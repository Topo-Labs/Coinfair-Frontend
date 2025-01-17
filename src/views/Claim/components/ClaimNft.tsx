import { memo, useState, useEffect, useCallback } from 'react';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import { useTranslation } from '@pancakeswap/localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NETWORK_CONFIG } from 'utils/wallet';
import useToast from 'hooks/useToast';
import { MINT_ADDRESS } from 'config/constants/exchange';
import { DogSvg } from 'components/Svg/Dog';
import { MINT_ABI } from './constants';
import KOALA from './koala.json';
import {
  ClaimFooter,
  ClaimHeader,
  ClaimImgWrapper,
  ClaimMint,
  ClaimNft,
  ClaimNftMain,
  ClaimTips,
  ClaimTitle,
  ClaimToken,
  ClaimTokenBtn,
  ClaimTokenInfo,
  FooterTitle,
  MinterAddress,
} from './styles';
import EarnButton from './EarnButton';

interface ExtendedEthereum extends ExternalProvider {
  on?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
  removeListener?: <T = unknown>(event: string, handler: (...args: T[]) => void) => void;
}

const WITHDRAW_ADDRESS = '0xa296680a4bf0a1F42D06bae58628Fcd3ee924760';

const Claim = () => {
  const { account, chainId, active } = useActiveWeb3React();
  const [parents, setParents] = useState<string>('');
  const [claimCount, setClaimCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isClaiming, setClaiming] = useState<boolean>(false);
  const address = new URLSearchParams(window.location.search).get('address'); // 直接从 URL 获取地址
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();

  // State variables for withdraw data
  const [waitingWithdraw, setWaitingWithdraw] = useState<string>('0');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0');

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

  const fetchWithdrawData = useCallback(async () => {
    if (chainId !== 56 || !account) return; // 确保 chainId 为 56 且 account 存在

    try {
      const rpcUrl = NETWORK_CONFIG[String(chainId)]?.rpcUrls[0];
      const provider = new JsonRpcProvider(rpcUrl);
      const withdrawContract = new Contract(WITHDRAW_ADDRESS, KOALA, provider);

      console.log('Fetching withdraw data for account:', account);

      const [waiting, amount] = await Promise.all([
        withdrawContract.waitingWithdraw(account),
        withdrawContract.withdrawAmount(account),
      ]);

      setWaitingWithdraw(formatUnits(waiting, 18).slice(0, formatUnits(waiting, 18).indexOf('.') + 6));
      setWithdrawAmount(formatUnits(amount, 18).slice(0, formatUnits(amount, 18).indexOf('.') + 6));

      console.log('Withdraw Data:', { waiting, amount });
    } catch (err) {
      console.error('Error fetching withdraw data:', err);
    }
  }, [chainId, account]);

  useEffect(() => {
    if (chainId === 56) {
      fetchWithdrawData();
    }
  }, [chainId, fetchWithdrawData]);

  const handleClaimNft = useCallback(async () => {
    if (!(window as any).ethereum || claimCount > 0) return;

    setLoading(true);

    try {
      console.log('Initiating NFT claim...');
      const ethereum = (window as any).ethereum as ExtendedEthereum;
      await ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new Web3Provider(ethereum);
      const signer = web3Provider.getSigner();

      const contractInstance = new Contract(MINT_ADDRESS[chainId], MINT_ABI, signer);
      const signerAddress = await signer.getAddress();
      const balance = await web3Provider.getBalance(signerAddress);
      const cost = await contractInstance.claimCost();

      const gasPrice = await web3Provider.getGasPrice();
      const estimatedGasLimit = await contractInstance.estimateGas.claim(address, { value: cost });
      const totalCost = cost.add(gasPrice.mul(estimatedGasLimit));

      console.log('Balance:', balance.toString());
      console.log('Total Cost:', totalCost.toString());

      if (balance.lt(totalCost)) {
        toastError(t('Claim failed'), t('Insufficient funds to cover gas fees and claim costs.'));
        console.error('Insufficient funds to cover gas fees and claim costs.');
        return;
      }

      const tx = await contractInstance.claim(address, {
        value: cost,
        gasPrice,
        gasLimit: estimatedGasLimit,
      });

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed.');

      setClaimCount((prev) => prev + 1);
      toastSuccess(t('Claim successful!'));
      fetchData(); // 更新状态
    } catch (error: any) {
      console.error('NFT Claim failed:', error);
      if (account?.toLowerCase() === address?.toLowerCase()) {
        toastError(t('Claim failed'), t('Cannot claim your own NFT.'));
      } else {
        toastError(t('Claim failed'), `${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [address, claimCount, fetchData, chainId, toastError, toastSuccess, t, account]);

  const handleClaimToken = useCallback(async () => {
    if (!(window as any).ethereum || claimCount <= 0 || chainId !== 56) return;

    setClaiming(true);

    try {
      console.log('Initiating Token claim...');
      const ethereum = (window as any).ethereum as ExtendedEthereum;
      await ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new Web3Provider(ethereum);
      const signer = web3Provider.getSigner();

      const withdrawContract = new Contract(WITHDRAW_ADDRESS, KOALA, signer);
      const signerAddress = await signer.getAddress();
      const balance = await web3Provider.getBalance(signerAddress);

      const gasPrice = await web3Provider.getGasPrice();

      // 不传递参数，因为 withdraw 函数不需要参数
      const estimatedGasLimit = await withdrawContract.estimateGas.withdraw();
      const totalCost = gasPrice.mul(estimatedGasLimit); // 假设不发送任何ETH

      console.log('Signer Balance:', balance.toString());
      console.log('Total Gas Cost:', totalCost.toString());

      if (balance.lt(totalCost)) {
        toastError(t('Claim failed'), t('Insufficient funds to cover gas fees.'));
        console.error('Insufficient funds to cover gas fees.');
        return;
      }

      // 不传递参数
      const tx = await withdrawContract.withdraw();

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed.');

      toastSuccess(t('Claim successful!'));
      fetchWithdrawData();
    } catch (error: any) {
      console.error('Token Claim failed:', error);
      if (account?.toLowerCase() === address?.toLowerCase()) {
        toastError(t('Claim failed'), t('Cannot claim your own NFT.'));
      } else {
        toastError(t('Claim failed'), `${error.message}`);
      }
    } finally {
      setClaiming(false);
    }
  }, [address, claimCount, chainId, fetchWithdrawData, toastError, toastSuccess, t, account]);

  console.log('Claim Count:', claimCount);
  console.log('Withdraw Amount:', withdrawAmount);
  console.log('Waiting Withdraw:', waitingWithdraw);

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

        {/* <Link href="/earn">
          <ClaimTokenBtn  onClick={handleClaimToken}  style={{display:"block",margin:"20px 0"}}>{t('Earn')}</ClaimTokenBtn>
        </Link> */}

        <ClaimMint
          id="claim_button"
          role="button"
          tabIndex={0}
          aria-label="Claim button"
          onClick={handleClaimNft}
          disabled={isLoading || claimCount > 0}
        >
          {claimCount > 0 ? t('Already Claimed') : t('Claim NFT')}
        </ClaimMint>

        {
          chainId === 56 && <EarnButton/>
        }

        {/* {chainId === 56 && (
          <ClaimToken>
            <ClaimTokenBtn disabled={isClaiming || claimCount <= 0 || waitingWithdraw === '0.0' || waitingWithdraw === '0'} onClick={handleClaimToken}>
              Claim Token
            </ClaimTokenBtn>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <span style={{ marginRight: '10px' }}>Name: Koala</span>
              <span style={{ marginRight: '10px' }}>Already: {withdrawAmount}</span>
              <span>Pending: {waitingWithdraw}</span>
            </div>
          </ClaimToken>
        )} */}
      </ClaimFooter>
    </>
  );
};

export default memo(Claim);
