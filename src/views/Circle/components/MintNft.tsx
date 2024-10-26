import { useState, useCallback, useEffect } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NETWORK_CONFIG } from 'utils/wallet'
import { copyText } from 'utils/copyText';
import useToast from 'hooks/useToast';
import { FiCopy } from 'react-icons/fi';
import { Text } from '@pancakeswap/uikit';
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import {isAddress} from "@ethersproject/address"
import { MINT_ADDRESS } from 'config/constants/exchange'
import { MINT_ABI } from './constants';
import { CircleContent, CircleContentPeople, CircleHeader, CircleImg, CircleMint, CircleNft, CircleNftMain, CircleTitle, CopyBtn, CopyLink, CopyMain, MintAmount, NftMessage, NftRemain, NftTotal, Tooltip } from './styles';

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
  const { toastSuccess, toastError } = useToast()
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<string[]>([]);
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!Number.isNaN(value) && value >= 1 && value <= 500) {
      setAmount(value);
    } else {
      setAmount(0);
    }
  };
  const fetchNftInfo = useCallback(async () => {
    setLoading(true);
    const rpcUrl = NETWORK_CONFIG[String(chainId)]?.rpcUrls[0]
    try {
      if (!chainId) {
        console.error('Invalid chain configuration or missing node URL:', chainId);
        return;
      }

      const provider = new JsonRpcProvider(rpcUrl);
      if (!isAddress(MINT_ADDRESS[chainId])) {
        console.error('Invalid contract address:', MINT_ADDRESS[chainId]);
        return;
      }

      const contract = new Contract(MINT_ADDRESS[chainId], MINT_ABI, provider);

      if (!isAddress(account)) {
        console.error('Invalid account address:', account);
        return;
      }

      const result = await retryAsync(() => contract.getMCInfo(account));
      if (!result) {
        console.error('No data returned from contract call.');
        return;
      }

      const info = result.toString().split(',');
      setNftInfo(info);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [chainId, account]);

  useEffect(() => {
    if (active) {
      fetchNftInfo();
    }
  }, [active, fetchNftInfo]);

  const confirmMint = useCallback(async () => {
    if (!amount || parseInt(amount as unknown as string, 10) <= 0) {
      return;
    }

    setLoading(true);
    try {
      if (!chainId) {
        return;
      }

      if (!isAddress(account)) {
        console.error('Invalid account address:', account);
        return;
      }

      if (!((window as any).ethereum)) {
        return;
      }

      const ethereum = ((window as any).ethereum) as unknown as ExtendedEthereum;

      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (requestError) {
        console.error('Failed to request wallet accounts:', requestError);
        setLoading(false);
        return;
      }

      const provider = new Web3Provider(ethereum);
      const signer = await provider.getSigner();

      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== account.toLowerCase()) {
        console.error('Signer address does not match:', signerAddress, account);
        return;
      }

      const contract = new Contract(MINT_ADDRESS[chainId], MINT_ABI, signer);

      const cost = await contract.mintCost();
      const totalCost = BigInt(cost.toString()) * BigInt(amount);

      const tx = await contract.mint(amount, { value: totalCost });
      await tx.wait();
      toastSuccess('Success to mint', 'Go notify your friends to claim now!')
      await fetchNftInfo(); // 在 mint 成功后再次获取 NFT 信息
    } catch (error: any) {
      toastError('Failed to mint', `${error.message}`)
      console.error('Mint failed:', error);
    } finally {
      setLoading(false);
    }
  }, [amount, account, chainId, fetchNftInfo]);

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

  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
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
              <CopyLink title={`https://coinfair.xyz/claim?address=${account}`}>
                https://coinfair.xyz/claim?address={account}
              </CopyLink>
              <CopyBtn
                onClick={() => copyText(`https://coinfair.xyz/claim?address=${account}`, displayTooltip)}
                aria-label="Copy Claim link">
                <FiCopy />
                <Tooltip
                  isTooltipDisplayed={isTooltipDisplayed}
                  tooltipTop={-5}
                  tooltipRight={-60}
                  tooltipFontSize={100}
                >
                  Copied
                </Tooltip>
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
        onClick={confirmMint}
        disabled={loading}>
        {loading ? 'Minting...' : 'Mint'}
      </CircleMint>
    </>
  );
}