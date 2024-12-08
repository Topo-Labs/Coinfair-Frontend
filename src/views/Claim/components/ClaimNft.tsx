import { memo, useState, useEffect, useCallback } from 'react';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NETWORK_CONFIG } from 'utils/wallet';
import useToast from 'hooks/useToast'
import { MINT_ADDRESS } from 'config/constants/exchange'
import { DogSvg } from 'components/Svg/Dog';
import { MINT_ABI } from './constants';
import { ClaimFooter, ClaimHeader, ClaimImgWrapper, ClaimMint, ClaimNft, ClaimNftMain, ClaimTips, ClaimTitle, FooterTitle, MinterAddress } from './styles';

interface ExtendedEthereum extends ExternalProvider {
  on?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
  removeListener?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
}

const Claim = () => {
  const { account, chainId, active } = useActiveWeb3React();
  const [parents, setParents] = useState<string>('');
  const [claimCount, setClaimCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const address = new URLSearchParams(window.location.search).get('address'); // 直接从 URL 获取地址
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const fetchData = useCallback(async () => {
    if (!account || !chainId) return;

    try {
      const rpcUrl = NETWORK_CONFIG[String(chainId)]?.rpcUrls[0];
      const provider = new JsonRpcProvider(rpcUrl);
      const contract = new Contract(MINT_ADDRESS[chainId], MINT_ABI, provider);

      const [parentsData, claimCountData] = await Promise.all([
        contract.getTwoParentAddress(account),
        contract.balanceOf(account),
      ]);

      setParents(parentsData.toString().split(',')[0]);
      setClaimCount(Number(claimCountData));
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, [account, chainId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClaimNft = useCallback(async () => {
    if (!((window as any).ethereum) || claimCount > 0) return;

    setLoading(true);

    try {
      const ethereum = (window as any).ethereum as ExtendedEthereum;
      await ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new Web3Provider(ethereum);
      const signer = await web3Provider.getSigner();

      const contractInstance = new Contract(MINT_ADDRESS[chainId], MINT_ABI, signer);
      const balance = await web3Provider.getBalance(await signer.getAddress());
      const cost = await contractInstance.claimCost();

      const gasPrice = await web3Provider.getGasPrice();

      const estimatedGasLimit = await contractInstance.estimateGas.claim(address, { value: cost });

      const totalCost = cost.add(gasPrice.mul(estimatedGasLimit));

      if (balance.lt(totalCost)) {
        toastError(t('Claim failed'), t('Insufficient funds to cover gas fees and claim costs.'))
        console.error('Insufficient funds to cover gas fees and claim costs.');
        return;
      }

      const tx = await contractInstance.claim(address, {
        value: cost,
        gasPrice,
        gasLimit: estimatedGasLimit,
      });

      await tx.wait();
      setClaimCount((prev) => prev + 1);
      toastSuccess(t('Claim successful!'));
      fetchData(); // 更新状态

    } catch (error: any) {
      if (account.toLocaleLowerCase() === address.toLocaleLowerCase()) {
        toastError(t('Claim failed'), t('Cannot claim your own NFT.'));
      } else {
        toastError(t('Claim failed'), `${error.message}`);
      }
      console.error('Claim failed:', error);
    } finally {
      setLoading(false);
    }
  }, [address, claimCount, fetchData]);

  if (!active) {
    return (
      <>
        <ClaimHeader>
          <ClaimTitle>{t('mint_limit_text')}</ClaimTitle>
        </ClaimHeader>
        <ClaimNftMain>
          <p>{t('Please login to view and claim NFT.')}</p>
        </ClaimNftMain>
      </>
    );
  }

  const layers = Array.from({ length: 10 }, (_, i) => i - 5);

  return (
    <>
      <ClaimHeader>
        <ClaimTitle>{t('Claim NFT')}</ClaimTitle>
      </ClaimHeader>
      <ClaimNftMain>
        <ClaimNft>
          <ClaimImgWrapper>
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
          </ClaimImgWrapper>
        </ClaimNft>
      </ClaimNftMain>
      <ClaimFooter>
        <FooterTitle>{t('Minter Address')}</FooterTitle>
        <MinterAddress>{address}</MinterAddress>
        <ClaimTips>{t('Claim an NFT, register for trade mining, and earn token rewards.')}</ClaimTips>
        <ClaimMint
          id="claim_button"
          role="button"
          tabIndex={0}
          aria-label="Claim button"
          onClick={handleClaimNft}
          disabled={isLoading || claimCount > 0} // 如果已领取则禁用
        >
          {claimCount > 0 ? t('Already Claimed') : t('Claim')}
        </ClaimMint>
      </ClaimFooter>
    </>
  );
};

export default memo(Claim);
