import { useState, useCallback } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NETWORK_CONFIG } from 'utils/wallet'
import useToast from 'hooks/useToast';
import { useModal } from '@pancakeswap/uikit';
import { copyText } from 'utils/copyText';
import { useTranslation } from '@pancakeswap/localization'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import {isAddress} from "@ethersproject/address"
import { MINT_ADDRESS } from 'config/constants/exchange'
import { DogSvg } from 'components/Svg/Dog';
import { MINT_ABI } from './constants';
import { CircleContent, CircleHeader, CircleImgWrapper, CircleMint, CircleNft, CircleNftMain, CircleTips, CircleTitle, CopyMyLink, ListWrapper, MintAmount, MintSuccessBottom, MintSuccessModal, MintSuccessNft, MintSuccessTitle } from './styles';

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
  enable: any;
  on?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
  removeListener?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
}

export default function MintNft({ onDismiss = () => null }) {
  const { account, chainId, active } = useActiveWeb3React();
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<string[]>([]);

  const MintSuccess = () => {

    const displayTooltip = () => {
      toastSuccess('Copyied success!', 'You can share link with your friends and circle')
    }

    const handleCopy = () => {
      onDismiss?.()
      copyText(`Buy Coinfair with my link: https://coinfair.xyz/claim?address=${account}`, displayTooltip)
    }

    return (
      <MintSuccessModal>
        <MintSuccessTitle>
          {t('Mint Success')}
          {/* eslint-disable */ }
          <img onClick={() => onDismiss?.()} src="/images/mint-close.svg" alt="" />
        </MintSuccessTitle>
        <MintSuccessNft src="/images/mint-success.svg" alt="" />
        <MintSuccessBottom>
          <CopyMyLink onClick={handleCopy}>{t('Copy link and share your friends')}</CopyMyLink>
        </MintSuccessBottom>
      </MintSuccessModal>
    )
  }

  const [onMintSuccess] = useModal(<MintSuccess/>)

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
        if (ethereum?.request) {
          await ethereum.request({ method: 'eth_requestAccounts' });
        } else if (ethereum?.enable) {
          await ethereum.enable();
        } else {
          throw new Error('Unsupported wallet provider.');
        }
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
      onDismiss?.()
      onMintSuccess()
      // toastSuccess('Success to mint', 'Go notify your friends to claim now!')
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
          <CircleTitle>{t('Mint NFT')}</CircleTitle>
        </CircleHeader>

        <CircleNftMain>
          <p>Please login to view and mint NFTs.</p>
        </CircleNftMain>
      </>

    );
  }

  const layers = Array.from({ length: 10 }, (_, i) => i - 5);

  return (
    <ListWrapper>
      <CircleHeader>
        <CircleTitle>{t('Mint NFT')}</CircleTitle>
        {/* eslint-disable */ }
        <img onClick={() => onDismiss?.()} src="/images/mint-close.svg" alt="" />
      </CircleHeader>
      <CircleNftMain>
      <CircleNft>
        <CircleImgWrapper>
          {layers.map((depth) => (
            <DogSvg
              key={depth}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                transform: `translateZ(${depth * 0.5}px)`,
                opacity: 1 - depth * 0.1,
              }}
            />
          ))}
        </CircleImgWrapper>
      </CircleNft>
      </CircleNftMain>
      <CircleContent>
        <MintAmount
          id="mint_amount"
          type="number"
          min="1"
          max="500"
          placeholder={t('mint_limit_text')}
          value={amount === 0 ? '' : amount.toString()}
          onChange={onChangeAmount}
        />
      </CircleContent>
      <CircleTips>{t('Mint an NFT and share it with your friends to claim, and the referral relationship will be established.')}</CircleTips>
      <CircleMint 
        onClick={confirmMint}
        disabled={loading}>
        {loading ? `${t('Minting')}...` : t('Mint')}
      </CircleMint>
    </ListWrapper>
  );
}