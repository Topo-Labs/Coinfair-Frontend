import { useState, useCallback, useEffect } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { NETWORK_CONFIG } from 'utils/wallet'
import { copyText } from 'utils/copyText';
import useToast from 'hooks/useToast';
import { FaShare } from "react-icons/fa6";
import { useModal } from '@pancakeswap/uikit';
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import {isAddress} from "@ethersproject/address"
import { circleContractAddress, MINT_ABI } from './components/constants';
import { useClaimHistory } from './useHistory'
import EarnClaimItem from './components/EarnClaimItem';
import MintNft from './components/MintNft';
import { EarnContainer, EarnTips, EarnTipIcon, EarnTipRight, EarnTipWords, EarnTipGreen, EarnStep, EarnStepItem, EarnStepItemIcon, EarnStepItemTop, EarnStepItemWords, EarnStepItemButton, EarnStepItemToScroll, EarnClaimTable, EarnClaimTop, EarnClaimTItem, EarnTitle, EarnClaimImport, EarnClaimTHead, EarnTName, EarnTOpration, EarnHistory, EarnMiddleBox, EarnFAQ, EarnStepItemBottom, EarnTBody, EarnNoData, EarnNoDataIcon, EarnTokenIcon, EarnTokenInfo, EarnClaimAmount, EarnAmount, EarnClaimButton, EarnClaimLast, EarnTokenNoLogo, EarnHistoryTHead } from './components/styles';

const history = [
  {
    address: '0xfjsldjfklajflksjfksaljfsf',
    claimed_number: 12.8888,
    claimed_time: Date.now()
  },
  {
    address: '0xfjsldjfklajflksjfksaljfsf',
    claimed_number: 12.8888,
    claimed_time: Date.now()
  },
  {
    address: '0xfjsldjfklajflksjfksaljfsf',
    claimed_number: 12.8888,
    claimed_time: Date.now()
  },
  {
    address: '0xfjsldjfklajflksjfksaljfsf',
    claimed_number: 12.8888,
    claimed_time: Date.now()
  },
  {
    address: '0xfjsldjfklajflksjfksaljfsf',
    claimed_number: 12.8888,
    claimed_time: Date.now()
  }
]

export default function Earn() {

  const { chainId, account } = useActiveWeb3React();
  const { toastSuccess, toastError } = useToast()
  const { data: claimData, loading: claimLoading, error: claimError } = useClaimHistory(account);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [claimedHistory, setClaimedHistory] = useState([]);
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  // console.log(claimData, claimLoading, claimError, account)

  const getStorageKey = (_chainId: number) => `earnTokens_${_chainId}`;

  useEffect(() => {
    const storedTokens = localStorage.getItem(getStorageKey(chainId));
    if (storedTokens) {
      setSelectedTokens(JSON.parse(storedTokens));
    } else {
      setSelectedTokens([]);
    }
  }, [chainId]);

  const onCurrencySelect = (currencyInput) => {
    const isTokenExists = selectedTokens.some(token => token.address === currencyInput.address);
    if (!isTokenExists) { // 检查是否已存在
      const updatedTokens = [...selectedTokens, currencyInput];
      setSelectedTokens(updatedTokens);
      localStorage.setItem(getStorageKey(chainId), JSON.stringify(updatedTokens));
    } 
  }

  const [onPresentCurrencyModal] = useModal(<CurrencySearchModal onCurrencySelect={onCurrencySelect}/>)

  const [onMintNftModal] = useModal(<MintNft/>)

  const displayTooltip = () => {
    setIsTooltipDisplayed(true)
    toastSuccess('Copyied success!', 'You can share link with your friends and circle')
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  const formatAddress = (address: string) => {
    if (!address) return '';
    const start = address.slice(0, 6);   // 前6位
    const end = address.slice(-4);       // 后4位
    return `${start}...${end}`;
  };

  return (
    <EarnContainer>
      <EarnTips>
        <EarnTipIcon><img src="/images/earn-tip.svg" alt="" /></EarnTipIcon>
        <EarnTipRight>
          <EarnTipWords>Invite friends to trade</EarnTipWords>
          <EarnTipWords>and earn up to<EarnTipGreen> 30% rebate commission.</EarnTipGreen></EarnTipWords>
        </EarnTipRight>
      </EarnTips>
      <EarnStep>
        <EarnStepItem>
          <EarnStepItemTop>step 1<EarnStepItemIcon><img src="/images/step-nft.svg" alt="" /></EarnStepItemIcon></EarnStepItemTop>
          <EarnStepItemBottom>
            <EarnStepItemWords>MINT referral NFT</EarnStepItemWords>
            <EarnStepItemButton onClick={() => onMintNftModal()}>Mint NFT</EarnStepItemButton>
          </EarnStepItemBottom>
        </EarnStepItem>
        <EarnStepItem>
          <EarnStepItemTop>step 2<EarnStepItemIcon><img src="/images/step-share.svg" alt="" /></EarnStepItemIcon></EarnStepItemTop>
          <EarnStepItemBottom>
            <EarnStepItemWords>Invite friends for your NFT</EarnStepItemWords>
            <EarnStepItemButton onClick={() => copyText(`Buy Coinfair with my link: https://coinfair.xyz/claim?address=${account}`, displayTooltip)}><FaShare size={20} style={{ marginRight: '20px' }}/>Invite a friend</EarnStepItemButton>
          </EarnStepItemBottom>
        </EarnStepItem>
        <EarnStepItem>
          <EarnStepItemTop>step 3<EarnStepItemIcon><img src="/images/step-command.svg" alt="" /></EarnStepItemIcon></EarnStepItemTop>
          <EarnStepItemBottom>
            <EarnStepItemWords>Already Claimed!</EarnStepItemWords>
            <EarnStepItemToScroll>Go claim！</EarnStepItemToScroll>
          </EarnStepItemBottom>
        </EarnStepItem>
      </EarnStep>
      <EarnClaimTable>
        <EarnClaimTop><EarnTitle>Claim Rewards</EarnTitle><EarnClaimImport onClick={() => onPresentCurrencyModal()}>Select else +</EarnClaimImport></EarnClaimTop>
        {
          selectedTokens.length > 0 && (
            <EarnClaimTHead>
              <EarnTName>Name</EarnTName>
              <EarnTName>Pending amount</EarnTName>
              <EarnTName>Claimed amount</EarnTName>
              <EarnTName>Total amount</EarnTName>
              <EarnTOpration>Operation</EarnTOpration>
            </EarnClaimTHead>
          )
        }
        <EarnTBody>
          {
            selectedTokens.length > 0 ? (
              selectedTokens.map(item =>
                <EarnClaimItem token={item}/>
              )
            ) : (
              <EarnNoData>
                <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                No Data
              </EarnNoData>
            )
          }
        </EarnTBody>
      </EarnClaimTable>
      <EarnMiddleBox>
        <EarnHistory>
          <EarnTitle>Rewords Pool</EarnTitle>
          {
            !history.length && (
              <EarnHistoryTHead>
                <EarnTName>Number</EarnTName>
                <EarnTName>Claimed amount</EarnTName>
                <EarnTName>Address</EarnTName>
                <EarnTName>Claimed time</EarnTName>
              </EarnHistoryTHead>
            )
          }
          <EarnTBody>
            {
              claimData && claimData.collectFees.length ? (
                claimData.collectFees.map(hty =>
                  // <EarnClaimTItem></EarnClaimTItem>
                  <></>
                )
              ) : (
                <EarnNoData>
                  <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                  No Data
                </EarnNoData>
              )
            }
          </EarnTBody>
        </EarnHistory>
        <EarnHistory>
          <EarnTitle>Mint History</EarnTitle>
          {
            !history.length && (
              <EarnHistoryTHead>
                <EarnTName>Number</EarnTName>
                <EarnTName>Claimed amount</EarnTName>
                <EarnTName>Address</EarnTName>
                <EarnTName>Claimed time</EarnTName>
              </EarnHistoryTHead>
            )
          }
          <EarnTBody>
            {
              !history.length ? (
                history.map(hty =>
                  <></>
                )
              ) : (
                <EarnNoData>
                  <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                  No Data
                </EarnNoData>
              )
            }
          </EarnTBody>
        </EarnHistory>
      </EarnMiddleBox>
      <EarnFAQ>
        <EarnTitle>FAQ</EarnTitle>
      </EarnFAQ>
    </EarnContainer>
  );
}