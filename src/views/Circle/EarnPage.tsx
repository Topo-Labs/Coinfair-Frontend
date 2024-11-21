import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactTyped } from "react-typed";
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import ConnectWalletButton from 'components/ConnectWalletButton';
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { NETWORK_CONFIG } from 'utils/wallet'
import { copyText } from 'utils/copyText';
import useToast from 'hooks/useToast';
import { MINT_ADDRESS } from 'config/constants/exchange'
import { useModal, useMatchBreakpointsContext } from '@pancakeswap/uikit';
import { useTranslation } from '@pancakeswap/localization'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers';
import { isAddress } from "@ethersproject/address"
import { MINT_ABI } from './components/constants';
import { useRewardsPool, usePointsRank } from './useHistory'
import EarnRewardItem from './components/EarnRewardItem';
import PointRankItem from './components/PointRankItem';
import MintNft from './components/MintNft';
import EarnFAQGroup from './components/EarnFAQGroup';
import HoverCard from './components/PointsTask'
import ClaimedHistory from './components/ClaimedHistory';
import PointsHistory from './components/PointsHistory';
import EarnTokenList from './components/EarnTokenList';
import faqData from './FAQ.json'
import { EarnContainer, EarnTips, EarnTipRight, EarnTipWords, EarnTipGreen, EarnStep, EarnStepItem, EarnStepItemIcon, EarnStepItemTop, EarnStepItemWords, EarnStepItemButton, EarnStepItemToScroll, EarnClaimTable, EarnTitle, EarnClaimTHead, EarnTName, EarnHistory, EarnMiddleBox, EarnFAQ, EarnStepItemBottom, EarnTBody, EarnNoData, EarnNoDataIcon, EarnHistoryTHead, EarnTTime, EarnTReward, EarnMintGroup, EarnMintGroupItem, EarnMintGroupNumber, EarnMintGroupWords, EarnFAQBody, EarnFAQTitle, EarnHistoryTitle, CarouselContainer, SlideWrapper, Slide, DotContainer, Dot, SlideButton, EarnTAddress, EarnTipRed, EarnTipsOnce, EarnTipsDouble, ToggleSwitch, ToggleBox, ToggleSlider, ToggleOption, EarnMyRank, PointsCard, PointsContainer, MyPoints, MyRank, PointsRankTop, LoadingRing } from './components/styles';

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

const slides = [
  {
    id: 1,
    title: 'Mint your NFT',
    buttonText: 'Mint NFTs',
    step: 'step 1',
    src: '/images/step-nft.svg'
  },
  {
    id: 2,
    title: 'Invite friends for your NFT',
    buttonText: 'Invite a friend',
    step: 'step 2',
    src: '/images/step-share.svg'
  },
  {
    id: 3,
    title: 'View the rewards pool!',
    buttonText: 'View Rewards',
    step: 'step 3',
    src: '/images/step-command.svg'
  },
];

const swapTask = {
  key: 'swap',
  title: 'Trade on Coinfair',
  desc: 'New users earn 200 points for their first swap trade; subsequent trades earn 100 points each.',
  link: 'swap',
  linkWords: 'Swap now'
}

const mintTask = {
  key: 'mint',
  title: 'Mint NFT',
  desc: 'Earn 300 points each time you mint NFTs that are successfully claimed, and subsequently receive a 10% point rebate from each NFT claimer.',
  link: 'mint',
  linkWords: 'Mint'
}

const claimTask = {
  key: 'claim',
  title: 'Claim NFT',
  desc: 'Each user can claim only one NFT per chain. The first claim rewards 200 points.',
  link: 'claim',
  linkWords: 'Get a link from your inviter to claim NFT.'
}

const XTask = {
  key: 'X',
  title: 'Follow X account',
  desc: 'New users earn a one-time reward of 200 points for following X.',
  link: 'https://x.com/CoinfairGlobal',
  linkWords: 'Follow us'
}

const TGTask = {
  key: 'TG',
  title: 'Join Telegram Group',
  desc: 'New users earn a one-time reward of 200 points for joining the Telegram group.',
  link: 'https://t.me/Coinfair_Global',
  linkWords: 'Join us'
}

export default function Earn() {
  const { chainId, account, active } = useActiveWeb3React();
  const { toastSuccess } = useToast();
  const { data: claimData, loading: claimLoading, error: claimError } = useRewardsPool(chainId, account);
  const { data: rankData, loading: rankLoading, error: rankError } = usePointsRank(chainId, account);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftInfo, setNftInfo] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState(null);
  const claimRewardsRef = useRef(null);
  const { isDesktop, isMobile } = useMatchBreakpointsContext()
  const [activeIndex, setActiveIndex] = useState(0);
  const [toggleIndex, setToggleIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startX = useRef(0);
  const endX = useRef(0);
  const pauseTimeout = useRef(null);

  const { t } =  useTranslation()

  useEffect(() => {
    let interval = null;
    if (!isDesktop && slides.length > 0 && !isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000);
    }
    // 清除定时器（如果存在）
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDesktop, slides.length, isPaused]);

  // 清除暂停定时器
  const resetPauseTimeout = () => {
    if (pauseTimeout.current) {
      clearTimeout(pauseTimeout.current);
    }
  };

  // 处理触摸事件
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    endX.current = startX.current; // 初始化endX，以防止轻微移动
    resetPauseTimeout();
    setIsPaused(true); // 停止自动播放
  };

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = startX.current - endX.current;
    const threshold = 50; // 滑动的阈值
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // 向左滑动
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      } else {
        // 向右滑动
        setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
      }
    }

    // 设置暂停恢复的定时器，3秒后重新开始播放
    pauseTimeout.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

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
      const offset = 70;
      setTimeout(() => {
        const elementTop = claimRewardsRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth',
        });
      }, 100); // 设置适当的延迟
    }
  };

  const toggleOpen = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleButtonClick = (e, index: number) => {
    e.stopPropagation();
    switch (index) {
      case 0:
        onMintNftModal()
        break;

      case 1:
        copyText(`Buy Coinfair with my link: https://coinfair.xyz/claim?address=${account}`, displayTooltip)
        break;

      case 2:
        handleGoClaimClick()
        break;
    
      default:
        break;
    }
  };

  const [onClaimedHistoryModal] = useModal(<ClaimedHistory />)
  
  const [onPointsHistoryModal] = useModal(<PointsHistory myPoints={rankData?.user_info?.points.toLocaleString()} />)

  return (
    <EarnContainer>
      <EarnTipsOnce>{t('Once')}</EarnTipsOnce>
      <EarnTipsDouble>{t('Double')}</EarnTipsDouble>
      <EarnTips>
        <EarnTipRight>
          <EarnTipWords><EarnTipGreen>{t('Once')}&nbsp;</EarnTipGreen>{t('Referral')}</EarnTipWords>
          <EarnTipWords><EarnTipRed>{t('Double')}&nbsp;</EarnTipRed>{t('Rewards')}</EarnTipWords>
        </EarnTipRight>
        <ReactTyped
          backSpeed={1}
          typeSpeed={1}
          loop
          backDelay={3000}
          fadeOut
          style={
            isDesktop ?
            { minHeight: '80px', fontSize: '36px', fontWeight: 600, marginTop: '80px', lineHeight: '30px', textAlign: 'center', }
            :
            { width: '75%', height: '50px', fontSize: '20px', textAlign: 'center', fontWeight: 600, marginTop: '2rem', lineHeight: '25px' }}
          strings={[t('Earn up to 30% in trading rebates and 10% in bonus points!')]}
        />
      </EarnTips>
      {
        isDesktop ? (
          <EarnStep>
            <EarnStepItem onClick={() => account && onMintNftModal()}>
              <EarnStepItemTop><EarnStepItemIcon><img src="/images/step-nft.svg" alt="" /></EarnStepItemIcon></EarnStepItemTop>
              <EarnStepItemBottom>
                <EarnStepItemWords>{t('Mint your NFT')}</EarnStepItemWords>
                  {!account ? '' : <EarnStepItemButton>{t('Mint NFTs')}
                  <img className='step-arrow' src="/images/step-arrow.svg" alt="" />
                </EarnStepItemButton>}
              </EarnStepItemBottom>
            </EarnStepItem>
            <EarnStepItem onClick={() => account && copyText(`Buy Coinfair with my link: https://coinfair.xyz/claim?address=${account}`, displayTooltip)}>
              <EarnStepItemTop><EarnStepItemIcon><img src="/images/step-share.svg" alt="" /></EarnStepItemIcon></EarnStepItemTop>
              <EarnStepItemBottom>
                <EarnStepItemWords>{t('Invite friends for your NFT')}</EarnStepItemWords>
                {
                  !account ? 
                  '' : 
                  <EarnStepItemButton>
                    {t('Invite a friend')}
                    <img className='step-arrow' src="/images/step-arrow.svg" alt="" />
                  </EarnStepItemButton>
                }
              </EarnStepItemBottom>
            </EarnStepItem>
            <EarnStepItem onClick={() => handleGoClaimClick()}>
              <EarnStepItemTop><EarnStepItemIcon><img src="/images/step-command.svg" alt="" /></EarnStepItemIcon></EarnStepItemTop>
              <EarnStepItemBottom>
                <EarnStepItemWords>{t('View the rewards pool!')}</EarnStepItemWords>
                <EarnStepItemToScroll>{t('View Rewards')}
                  <img className='step-arrow' src="/images/step-arrow.svg" alt="" />
                </EarnStepItemToScroll>
              </EarnStepItemBottom>
            </EarnStepItem>
          </EarnStep>
        ) : (
          <CarouselContainer
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <SlideWrapper translateX={-activeIndex * 100}>
              {slides.map((slide, index) => (
                <Slide key={slide.id} onClick={(e) => handleButtonClick(e, index)}>
                  <EarnStepItemTop><EarnStepItemIcon><img src={slide.src} alt=''/></EarnStepItemIcon></EarnStepItemTop>
                  <EarnStepItemBottom>
                    <EarnStepItemWords>{t(slide.title)}</EarnStepItemWords>
                    {index !== 2 && !account ? <ConnectWalletButton/> : <SlideButton>{t(slide.buttonText)}<img src="/images/step-arrow.svg" alt="" /></SlideButton>}
                  </EarnStepItemBottom>
                </Slide>
              ))}
            </SlideWrapper>
            <DotContainer>
              {slides.map((slide, index) => (
                <Dot
                  key={slide.toString()}
                  active={index === activeIndex}
                  onClick={() => {
                    setActiveIndex(index);
                    resetPauseTimeout();
                    setIsPaused(true); // 手动选择时也停止自动播放
                    pauseTimeout.current = setTimeout(() => {
                      setIsPaused(false);
                    }, 3000);
                  }}
                />
              ))}
            </DotContainer>
          </CarouselContainer>
        )
      }
      {account &&
        <EarnMintGroup>
          <EarnMintGroupItem>
            <EarnMintGroupNumber>{nftInfo.length > 1 && nftInfo[1] !== undefined ? nftInfo[1] : '--'}</EarnMintGroupNumber>
            <EarnMintGroupWords>{t('Minted')}</EarnMintGroupWords>
          </EarnMintGroupItem>
          <EarnMintGroupItem>
            <EarnMintGroupNumber>{nftInfo.length > 1 && nftInfo[0] !== undefined ? nftInfo[0] : '--'}</EarnMintGroupNumber>
            <EarnMintGroupWords style={{ cursor: 'pointer' }} onClick={() => onClaimedHistoryModal()}>
              {t('Claimed')}
              <img className='amount-arrow' src="/images/amount-arrow.svg" alt="" />
            </EarnMintGroupWords>
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
            <EarnMintGroupWords>{t('Remain')}</EarnMintGroupWords>
          </EarnMintGroupItem>
        </EarnMintGroup>
      }
      <ToggleSwitch ref={claimRewardsRef}>
        <ToggleBox>
          <ToggleSlider activeIndex={toggleIndex} />
          <ToggleOption active={toggleIndex === 0} onClick={() => setToggleIndex(0)}>
            {t('Trade Rewards')}
          </ToggleOption>
          <ToggleOption active={toggleIndex === 1} onClick={() => setToggleIndex(1)}>
            {t('Points Rewards')}
          </ToggleOption>
        </ToggleBox>
      </ToggleSwitch>
      {
        toggleIndex === 0 ? (
          <>
            <EarnTokenList />
            {
              isDesktop ? (
                <EarnMiddleBox>
                  <EarnHistory>
                    <EarnHistoryTitle>{t('Rewards Pool')}</EarnHistoryTitle>
                    {
                      account && !claimLoading ? (
                        <EarnHistoryTHead>
                          <EarnTName>{t('Number')}</EarnTName>
                          <EarnTReward>{t('Reward amount')}</EarnTReward>
                          <EarnTName>{t('User')}</EarnTName>
                          <EarnTTime>{t('Time')}</EarnTTime>
                        </EarnHistoryTHead>
                      ) : ''
                    }
                    <EarnTBody>
                    {account ?
                      claimLoading ? (
                        <LoadingRing />
                      ) : claimData && claimData.length ? (
                        [...claimData].sort((a, b) => b.blockTimestamp - a.blockTimestamp).map((hty, index) =>
                          <EarnRewardItem info={hty} index={index} />
                        )
                      ) : (
                        <EarnNoData>
                          <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                          {t('No Data')}
                        </EarnNoData>
                      ) : (
                        <EarnNoData>
                          <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                          {t('Please connect your wallet.')}
                        </EarnNoData>
                      )
                    }
                    </EarnTBody>
                  </EarnHistory>
                </EarnMiddleBox>
              ) : (
                <>
                  <EarnHistory>
                    <EarnHistoryTitle>{t('Rewards Pool')}</EarnHistoryTitle>
                    {
                      !claimLoading ? (
                        <EarnHistoryTHead>
                          <EarnTReward>{t('Amount')}</EarnTReward>
                          <EarnTAddress>{t('User')}</EarnTAddress>
                          <EarnTTime>{t('Time')}</EarnTTime>
                        </EarnHistoryTHead>
                      ) : ''
                    }
                    <EarnTBody>
                    {
                      claimLoading ? (
                        <LoadingRing />
                      ) : claimData && claimData.length ? (
                        [...claimData].sort((a, b) => b.blockTimestamp - a.blockTimestamp).map((hty, index) =>
                          <EarnRewardItem info={hty} index={index} />
                        )
                      ) : (
                        <EarnNoData>
                          <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                          {t('No Data')}
                        </EarnNoData>
                      )
                    }
                    </EarnTBody>
                  </EarnHistory>
                </>
              )
            }
          </>
        ) : (
          <PointsContainer>
            {
              isDesktop ? (
                <>
                  <PointsCard>
                    <HoverCard content={swapTask}/>
                    <HoverCard content={mintTask}/>
                    <HoverCard content={claimTask}/>
                  </PointsCard>
                  <PointsCard>
                    <HoverCard content={XTask}/>
                    <HoverCard content={TGTask}/>
                    <HoverCard content={null}/>
                  </PointsCard>
                </>
              ) : (
                <>
                  <HoverCard content={swapTask}/>
                  <HoverCard content={mintTask}/>
                  <HoverCard content={claimTask}/>
                  <HoverCard content={XTask}/>
                  <HoverCard content={TGTask}/>
                </>
              )
            }
            <EarnClaimTable>
              <PointsRankTop>
                <EarnTitle>{t('Leaderboard')}</EarnTitle>
                {
                  isDesktop ? (
                    <EarnMyRank>
                      <MyPoints onClick={() => onPointsHistoryModal()}>
                        {t('My Points')}:&nbsp;&nbsp;{rankData?.user_info?.points.toLocaleString()}
                        <img className='amount-arrow' src="/images/amount-arrow.svg" alt="" />
                      </MyPoints>
                      <MyRank>{t('My Rank')}:&nbsp;&nbsp;{rankData?.user_info?.rank}</MyRank>
                    </EarnMyRank>
                  ) : ''
                }
              </PointsRankTop>
              {
                isMobile ? (
                  <EarnMyRank>
                    <MyPoints onClick={() => onPointsHistoryModal()}>
                      {t('My Points')}:&nbsp;&nbsp;{rankData?.user_info?.points.toLocaleString() || 0}
                      <img className='amount-arrow' src="/images/amount-arrow.svg" alt="" />
                    </MyPoints>
                    <MyRank>{t('My Rank')}:&nbsp;&nbsp;{rankData?.user_info?.rank}</MyRank>
                  </EarnMyRank>
                ) : ''
              }
              {
                !rankLoading && (
                  isDesktop ? 
                    (
                      <EarnClaimTHead>
                        <EarnTName>{t('Rank')}</EarnTName>
                        <EarnTName>{t('Points')}</EarnTName>
                        <EarnTName>{t('User')}</EarnTName>
                      </EarnClaimTHead>
                    ) : (
                      <EarnClaimTHead>
                        <EarnTName className='rank-tname'>{t('Name')}</EarnTName>
                        <EarnTName className='rank-tname'>{t('Points')}</EarnTName>
                        <EarnTName className='rank-tname'>{t('User')}</EarnTName>
                      </EarnClaimTHead>
                    )
                )
              }
              <EarnTBody>
                {account ?
                  rankLoading ? (
                    <LoadingRing />
                  ) : rankData?.top_100 && rankData?.top_100.length > 0 ? (
                    rankData?.top_100.map(item =>
                      <PointRankItem info={item}/>
                    )
                  ) : (
                    <EarnNoData>
                      <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                      {t('No Data')}
                    </EarnNoData>
                  ) : (
                    <EarnNoData>
                      <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
                      {t('Please connect your wallet.')}
                    </EarnNoData>
                  )
                }
              </EarnTBody>
            </EarnClaimTable>
          </PointsContainer>
        )
      }
      <EarnFAQ>
        <EarnFAQTitle>{t('FAQs')}</EarnFAQTitle>
        <EarnFAQBody>
          {
            faqData.map((faq, index) =>
              <EarnFAQGroup
                key={`${faq.toString() + index}`}
                question={faq.question}
                answer={faq.answer}
                faqItem={faq}
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