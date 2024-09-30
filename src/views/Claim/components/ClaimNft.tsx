import { memo, useState, useEffect, useCallback } from 'react';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NETWORK_CONFIG } from 'utils/wallet';
import useToast from 'hooks/useToast'
import { circleContractAddress, MINT_ABI } from './constants';
import { ClaimFooter, ClaimHeader, ClaimImg, ClaimMint, ClaimNft, ClaimNftMain, ClaimTitle, FooterTitle, MinterAddress, NftMessage, NftTotal } from './styles';

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

  const fetchData = useCallback(async () => {
    if (!account || !chainId) return;

    try {
      const rpcUrl = NETWORK_CONFIG[String(chainId)]?.rpcUrls[0];
      const provider = new JsonRpcProvider(rpcUrl);
      const contract = new Contract(circleContractAddress, MINT_ABI, provider);

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

      const contractInstance = new Contract(circleContractAddress, MINT_ABI, signer);
      const balance = await web3Provider.getBalance(await signer.getAddress());
      const cost = await contractInstance.claimCost();

      const feeData = await web3Provider.getFeeData();
      const totalCost = cost + (feeData.maxFeePerGas ?? 0);

      if (balance < totalCost) {
        toastError('Failed to claim', 'Insufficient funds to cover gas fees and claim costs.')
        console.error('Insufficient funds to cover gas fees and claim costs.');
        return;
      }

      const tx = await contractInstance.claim(address, {
        value: cost,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      });

      await tx.wait();
      setClaimCount((prev) => prev + 1);
      toastSuccess('Success to claim')
      fetchData(); // 更新状态

    } catch (error: any) {
      if (account.toLocaleLowerCase() === address.toLocaleLowerCase()) {
        toastError('Failed to claim', `Cannot claim your own NFT.`)
      } else {
        toastError('Failed to claim', `${error.message}`)
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
          <ClaimTitle>Mint & Share NFT</ClaimTitle>
        </ClaimHeader>
        <ClaimNftMain>
          <p>Please login to view and claim NFT.</p>
        </ClaimNftMain>
      </>
    );
  }

  return (
    <>
      <ClaimHeader>
        <ClaimTitle>Claim NFT</ClaimTitle>
      </ClaimHeader>
      <ClaimNftMain>
        <ClaimNft>
          <ClaimImg src="/images/circle/nft.svg" alt="NFT" />
          <NftMessage>
            <NftTotal>
              <span>Name:</span>
              <span>Eadge</span>
            </NftTotal>
            <NftTotal>
              <span>Claimed Count:</span>
              <span>{claimCount}</span>
            </NftTotal>
          </NftMessage>
        </ClaimNft>
      </ClaimNftMain>
      <ClaimFooter>
        <FooterTitle>Minter Address</FooterTitle>
        <MinterAddress>{address}</MinterAddress>
        <ClaimMint
          id="claim_button"
          role="button"
          tabIndex={0}
          aria-label="Claim button"
          onClick={handleClaimNft}
          disabled={isLoading || claimCount > 0} // 如果已领取则禁用
        >
          {claimCount > 0 ? 'Already Claimed' : 'Claim'}
        </ClaimMint>
      </ClaimFooter>
    </>
  );
};

export default memo(Claim);
