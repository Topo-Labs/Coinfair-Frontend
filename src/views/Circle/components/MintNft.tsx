import { useState, useCallback } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import styled, { useTheme } from 'styled-components';
import { FiCopy } from 'react-icons/fi';
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, Image } from '@pancakeswap/uikit';
import Snackbar from 'components/SnackBar/SnackbarComponent';
import ethers, { Contract, providers } from 'ethers';
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import {isAddress} from "@ethersproject/address"
import { NETWORK_CONFIG } from 'utils/wallet'
import { circleContractAddress, MINT_ABI } from './contract';

const Circle = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  /* overflow: hidden; */
  background: #000;
  @media (min-width: 1200px) {
    max-width: 560px;
  }
`;

const CircleMain = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: #000;
  border-radius: 20px;
  @media (min-width: 1200px) {
    min-width: 560px;
  }
`;

const CircleHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CircleTitle = styled.div`
  display: flex;
  font-size: 24px;
`;

const CircleNftMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  & p{
    margin-top: 40px;
  }
`;

const CircleNft = styled.div`
  width: fit-content;
  border-radius: 16px;
  background: #EEEEEE;
  /* box-shadow: 0 0 15px 10px #27272B; */
`;

const NftMessage = styled.div`
  padding: 10px 5px;
`;

const NftTotal = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NftRemain = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

const CopyMain = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CopyLink = styled.span`
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  margin-top: 5px;
`;

const CopyBtn = styled.div`
  display: flex;
  align-items: center;
`;

const CircleImg = styled.img`
  border-radius: 16px;
`;

const CircleHistoryContent = styled.div`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: all .3s ease;
  padding: 20px 0;
`;

const CircleContent = styled.div`
  background-color: #f6f5fe;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const CirclePeopleCount = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 13px;
  margin-bottom: 285px;
  font-size: 16px;
`;

const CircleContentPeople = styled.div`
  color: #fff;
  font-size: 20px;
`;

const CircleContentPeopleRange = styled.div`
  color: #666666;
  font-size: 14px;
`;

const MintAmount = styled.input`
  background-color: #f6f5fe;
  border: 0;
  outline: 0;
  color: #fff;
  width: 100%;
`;

const CircleMint = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .3s ease;
  border-radius: 4px;
  padding: 15px 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: 300;
  background: linear-gradient(90deg, #EB3DFF 0%, #5C53D3 100%);
  border-radius: 28px;
  margin-bottom: 30px;
`;

const retryAsync = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
  const promises = [];

  for (let i = 0; i < retries; i++) {
    promises.push(new Promise((resolve, reject) => {
      try {
        fn().then(result => {
          resolve(result);
        }).catch(error => {
          console.error(`Attempt ${i + 1} failed:`, error);
          if (i < retries - 1) {
            setTimeout(() => resolve(undefined), delay); // 传递 undefined
          } else {
            reject(error);
          }
        });
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          setTimeout(() => resolve(undefined), delay); // 传递 undefined
        } else {
          reject(error);
        }
      }
    }));
  }

  try {
    const results = await Promise.all(promises);
    return results.find((result) => result !== undefined); // 返回第一个成功的结果
  } catch (error) {
    throw new Error('All retry attempts failed.');
  }
};
// 定义一个扩展 Eip1193Provider 的接口，包含 on 和 removeListener 方法
interface ExtendedEthereum extends ExternalProvider {
  on?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
  removeListener?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
}

export default function MintNft() {
  const { account, chainId, active } = useActiveWeb3React();

  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<string[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVariant, setSnackbarVariant] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  // const openSnackbar = (message: string, variant: 'success' | 'error' | 'warning' | 'info') => {
  //   setSnackbarMessage(message);
  //   setSnackbarVariant(variant);
  //   setSnackbarOpen(true);
  // };

  // const handleCloseSnackbar = () => {
  //   setSnackbarOpen(false);
  // };


  const accountAddress = '';

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!Number.isNaN(value) && value >= 1 && value <= 500) {
      setAmount(value);
    } else {
      setAmount(0);
    }
  };
  // 获取 NFT 信息
  // const fetchNftInfo = useCallback(async () => {
  //   setLoading(true);
  //   const rpcUrl = NETWORK_CONFIG[String(chainId)]?.rpcUrls[0]
  //   try {
  //     if (!chainId) {
  //       console.error('Invalid chain configuration or missing node URL:', chainId);
  //       openSnackbar('Network configuration error. Check your chain settings.', 'error');
  //       return;
  //     }

  //     const provider = new JsonRpcProvider(rpcUrl);

  //     if (!isAddress(circleContractAddress)) {
  //       console.error('Invalid contract address:', circleContractAddress);
  //       openSnackbar('Invalid contract address configuration.', 'error');
  //       return;
  //     }

  //     const contract = new Contract(circleContractAddress, MINT_ABI, provider);

  //     if (!isAddress(accountAddress)) {
  //       console.error('Invalid account address:', accountAddress);
  //       openSnackbar('Invalid account address. Please check your wallet connection.', 'error');
  //       return;
  //     }

  //     const result = await retryAsync(() => contract.getMCInfo(accountAddress));
  //     if (!result) {
  //       console.error('No data returned from contract call.');
  //       return;
  //     }

  //     const info = result.toString().split(',');
  //     setNftInfo(info);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [chainId, accountAddress, openSnackbar]);

  // const confirmMint = useCallback(async () => {
  //   if (!amount || parseInt(amount as unknown as string, 10) <= 0) {
  //     openSnackbar('Please enter a valid amount.', 'warning');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     if (!chainId) {
  //       openSnackbar('Network configuration error. Check your chain settings.', 'error');
  //       return;
  //     }

  //     if (!isAddress(accountAddress)) {
  //       openSnackbar('Invalid account address. Please check your wallet.', 'error');
  //       console.error('Invalid account address:', accountAddress);
  //       return;
  //     }

  //     if (!((window as any).ethereum)) {
  //       openSnackbar('Ethereum wallet not found. Please connect your wallet.', 'error');
  //       return;
  //     }

  //     const ethereum = ((window as any).ethereum) as unknown as ExtendedEthereum;

  //     try {
  //       await ethereum.request({ method: 'eth_requestAccounts' });
  //     } catch (requestError) {
  //       console.error('Failed to request wallet accounts:', requestError);
  //       openSnackbar('Failed to connect wallet. Please try again.', 'error');
  //       setLoading(false);
  //       return;
  //     }

  //     const provider = new Web3Provider(ethereum);
  //     const signer = await provider.getSigner();

  //     const signerAddress = await signer.getAddress();
  //     if (signerAddress.toLowerCase() !== accountAddress.toLowerCase()) {
  //       openSnackbar('Signer account does not match the provided address.', 'error');
  //       console.error('Signer address does not match:', signerAddress, accountAddress);
  //       return;
  //     }

  //     const contract = new Contract(circleContractAddress, MINT_ABI, signer);

  //     const cost = await contract.mintCost();
  //     const totalCost = BigInt(cost.toString()) * BigInt(amount);

  //     const tx = await contract.mint(amount, { value: totalCost });
  //     await tx.wait();

  //     openSnackbar('Mint success!', 'success');
  //     await fetchNftInfo(); // 在 mint 成功后再次获取 NFT 信息
  //   } catch (error) {
  //     console.error('Mint failed:', error);
  //     openSnackbar('Mint failed. Check console for details.', 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [amount, accountAddress, chainId, fetchNftInfo, openSnackbar]);



  if (!active) {
    return (
      <>
        <CircleHeader>
          <CircleTitle>Mint & Share NFT</CircleTitle>
        </CircleHeader>

        <CircleNftMain>
          <p>Please login to view and mint NFTs.</p>
        </CircleNftMain>
      </>

    );
  }

  return (
    <>
      <CircleHeader>
        <CircleTitle>Mint & Share NFT</CircleTitle>
      </CircleHeader>

      <CircleNftMain>
        <CircleNft>
          <CircleImg src="/images/circle/nft.svg" alt="NFT" />
          <NftMessage>
            <NftTotal>
              <span>Mint Total:</span>
              <span>{nftInfo.length > 1 && nftInfo[1] !== undefined ? nftInfo[1] : '--'}</span>
            </NftTotal>
            <NftRemain>
              <span>Remain:</span>
              <span>
                {nftInfo.length > 1
                  ? !Number.isNaN(Number(nftInfo[1])) && !Number.isNaN(Number(nftInfo[0]))
                    ? (Number(nftInfo[1]) - Number(nftInfo[0])).toString()
                    : '--'
                  : '--'}
              </span>
            </NftRemain>
            <CopyMain>
              <CopyLink title={`https://eqswap.io/claim?address=${accountAddress}`}>
                https://eqswap.io/claim?address={accountAddress}
              </CopyLink>
              <CopyBtn
                // onClick={handleCopyAddress} 
                aria-label="Copy Claim link">
                <FiCopy />
              </CopyBtn>
            </CopyMain>
          </NftMessage>
        </CircleNft>
      </CircleNftMain>
      <CircleContent>
        <MintAmount
          id="mint_amount"
          type="number"
          min="1"
          max="500"
          placeholder="please enter 1~500"
          value={amount === 0 ? '' : amount.toString()}
          onChange={onChangeAmount}
        />
        <CircleContentPeople>
          <Text
            color="textSubtle"
            fontSize="14px"
            style={{ display: 'inline', cursor: 'pointer', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            Amount
          </Text>
        </CircleContentPeople>
      </CircleContent>
      <CircleMint 
      // onClick={confirmMint}
       disabled={loading}>
        {loading ? 'Minting...' : 'Mint'}
      </CircleMint>
    </>
  );
}