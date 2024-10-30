import { useState, useCallback, useEffect, useRef } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { NETWORK_CONFIG } from 'utils/wallet'
import { copyText } from 'utils/copyText';
import useToast from 'hooks/useToast';
import { MINT_ADDRESS } from 'config/constants/exchange'
import { FaShare } from "react-icons/fa6";
import { useModal } from '@pancakeswap/uikit';
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers';
import {isAddress} from "@ethersproject/address"
import { MINT_ABI } from './components/constants';
import { useRewardsPool, useMintHistory } from './useHistory'
import EarnClaimItem from './components/EarnClaimItem';
import EarnMintItem from './components/EarnMintItem';
import EarnRewardItem from './components/EarnRewardItem';
import MintNft from './components/MintNft';
import EarnFAQGroup from './components/EarnFAQGroup';
import faqData from './FAQ.json'
import { EarnContainer, EarnTips, EarnTipIcon, EarnTipRight, EarnTipWords, EarnTipGreen, EarnStep, EarnStepItem, EarnStepItemIcon, EarnStepItemTop, EarnStepItemWords, EarnStepItemButton, EarnStepItemToScroll, EarnClaimTable, EarnClaimTop, EarnTitle, EarnClaimImport, EarnClaimTHead, EarnTName, EarnTOpration, EarnHistory, EarnMiddleBox, EarnFAQ, EarnStepItemBottom, EarnTBody, EarnNoData, EarnNoDataIcon, EarnHistoryTHead, EarnTTime, EarnTReward, EarnMintGroup, EarnMintGroupItem, EarnMintGroupNumber, EarnMintGroupWords, EarnFAQItem, EarnFAQBody, EarnQuestion, EarnAnswer, EarnFAQTitle, EarnHistoryTitle } from './components/styles';

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

export default function Earn() {

  const { chainId, account, active } = useActiveWeb3React();
  const { toastSuccess, toastError } = useToast();
  const { data: claimData, loading: claimLoading, error: claimError } = useRewardsPool(chainId, account);
  const { data: mintData, loading: mintLoading, error: mintError } = useMintHistory(account);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState(null);
  const claimRewardsRef = useRef(null);

  const getStorageKey = (_chainId: number) => `earnTokens_${_chainId}`;

  useEffect(() => {
    const storedTokens = localStorage.getItem(getStorageKey(chainId));
    if (storedTokens) {
      setSelectedTokens(JSON.parse(storedTokens));
    } else {
      setSelectedTokens([]);
    }
  }, [chainId, active]);

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

  const onCurrencySelect = (currencyInput) => {
    const isTokenExists = selectedTokens.some(token => token.address === currencyInput.address);
    if (!isTokenExists) {
      const updatedTokens = [...selectedTokens, currencyInput];
      setSelectedTokens(updatedTokens);
      localStorage.setItem(getStorageKey(chainId), JSON.stringify(updatedTokens));
    } 
  }

  const [onPresentCurrencyModal] = useModal(<CurrencySearchModal onCurrencySelect={onCurrencySelect}/>)

  const [onMintNftModal] = useModal(<MintNft/>)

  const displayTooltip = () => {
    toastSuccess('Copyied success!', 'You can share link with your friends and circle')
  }

  const handleGoClaimClick = () => {
    if (claimRewardsRef.current) {
      claimRewardsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleOpen = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
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
            <EarnStepItemToScroll onClick={handleGoClaimClick}>Go claim！</EarnStepItemToScroll>
          </EarnStepItemBottom>
        </EarnStepItem>
      </EarnStep>
      <EarnClaimTable ref={claimRewardsRef}>
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
          <EarnHistoryTitle>Rewords Pool</EarnHistoryTitle>
          {
            claimData && claimData.length ? (
              <EarnHistoryTHead>
                <EarnTName>Number</EarnTName>
                <EarnTReward>Claimed amount</EarnTReward>
                <EarnTName>Address</EarnTName>
                <EarnTTime>Claimed time</EarnTTime>
              </EarnHistoryTHead>
            ) : ''
          }
          <EarnTBody>
          {
            claimData && claimData.length ? (
              [...claimData].sort((a, b) => b.blockTimestamp - a.blockTimestamp).map((hty, index) =>
                <EarnRewardItem info={hty} index={index} />
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
          <EarnHistoryTitle>Mint History</EarnHistoryTitle>
          <EarnMintGroup>
            <EarnMintGroupItem>
              <EarnMintGroupNumber>{nftInfo.length > 1 && nftInfo[1] !== undefined ? nftInfo[1] : '--'}</EarnMintGroupNumber>
              <EarnMintGroupWords>Minted total</EarnMintGroupWords>
            </EarnMintGroupItem>
            <EarnMintGroupItem>
              <EarnMintGroupNumber>{nftInfo.length > 1 && nftInfo[0] !== undefined ? nftInfo[0] : '--'}</EarnMintGroupNumber>
              <EarnMintGroupWords>Already claimed</EarnMintGroupWords>
            </EarnMintGroupItem>
            <EarnMintGroupItem>
              <EarnMintGroupNumber>
                {
                  nftInfo.length > 1
                  ? !Number.isNaN(Number(nftInfo[1])) && !Number.isNaN(Number(nftInfo[0]))
                    ? (Number(nftInfo[1]) - Number(nftInfo[0])).toString()
                    : '--'
                  : '--'
                }
              </EarnMintGroupNumber>
              <EarnMintGroupWords>Remain</EarnMintGroupWords>
            </EarnMintGroupItem>
          </EarnMintGroup>
          {
            mintData && mintData.length ? (
              <EarnHistoryTHead>
                <EarnTName>Number</EarnTName>
                <EarnTName>Address</EarnTName>
                <EarnTTime>Claimed time</EarnTTime>
              </EarnHistoryTHead>
            ) : ''
          }
          <EarnTBody>
            {
              mintData && mintData.length ? (
                [...mintData].sort((a, b) => b.blockTimestamp - a.blockTimestamp).map((hty, index) =>
                  <EarnMintItem info={hty} index={index}/>
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
        <EarnFAQTitle>FAQ</EarnFAQTitle>
        <EarnFAQBody>
          {
            faqData.map((faq, index) =>
              <EarnFAQGroup
                key={`${faq + index}`}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                toggleOpen={() => toggleOpen(index)}
                index={index}
              />
            )
          }
        </EarnFAQBody>
      </EarnFAQ>
    </EarnContainer>
  );
}