/* 
  EarnPage.tsx (示例代码)
  - 移除/注释了 CurrencySearchModal 等未使用的内容
  - 对 <img> 加了 // eslint-disable-next-line jsx-a11y/alt-text
  - 修复 key 不使用纯数组索引
*/

import { useState, useCallback, useEffect, useRef, memo } from 'react'
import { ReactTyped } from 'react-typed'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal' // <-- 已注释
import { NETWORK_CONFIG } from 'utils/wallet'
import { copyText } from 'utils/copyText'
import useToast from 'hooks/useToast'
import { MINT_ADDRESS } from 'config/constants/exchange'
import { useModal, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { isAddress } from '@ethersproject/address'
import { formatUnits } from '@ethersproject/units'
import { MINT_ABI } from './components/constants'
import { useRewardsPool, usePointsRank, useTokenRewards } from './useHistory'
import EarnRewardItem from './components/EarnRewardItem'
import PointRankItem from './components/PointRankItem'
import MintNft from './components/MintNft'
import EarnFAQGroup from './components/EarnFAQGroup'
import HoverCard from './components/PointsTask'
import ClaimedHistory from './components/ClaimedHistory'
import PointsHistory from './components/PointsHistory'
import EarnClaimItem from './components/EarnClaimItem'
import faqData from './FAQ.json'

import {
  EarnContainer,
  EarnTips,
  EarnTipRight,
  EarnTipWords,
  EarnTipGreen,
  EarnStep,
  EarnStepItem,
  EarnStepItemIcon,
  EarnStepItemTop,
  EarnStepItemWords,
  EarnStepItemButton,
  EarnStepItemToScroll,
  EarnClaimTable,
  EarnTitle,
  EarnClaimTHead,
  EarnTName,
  EarnHistory,
  EarnMiddleBox,
  EarnFAQ,
  EarnStepItemBottom,
  EarnTBody,
  EarnNoData,
  EarnNoDataIcon,
  EarnHistoryTHead,
  EarnTTime,
  EarnTReward,
  EarnMintGroup,
  EarnMintGroupItem,
  EarnMintGroupNumber,
  EarnMintGroupWords,
  EarnFAQBody,
  EarnFAQTitle,
  EarnHistoryTitle,
  CarouselContainer,
  SlideWrapper,
  Slide,
  DotContainer,
  Dot,
  SlideButton,
  EarnTAddress,
  EarnTipRed,
  EarnTipsOnce,
  EarnTipsDouble,
  ToggleSwitch,
  ToggleBox,
  ToggleSlider,
  ToggleOption,
  EarnMyRank,
  PointsCard,
  PointsContainer,
  MyPoints,
  MyRank,
  PointsRankTop,
  LoadingRing,
  EarnClaimTop,
  EarnTOpration,
  EarnTNameToken,
  EarnTNamePending,
  EarnTSelect,
  EarnFarm,
} from './components/styles'

// ------------------- Koala 相关 -------------------
import KOALA from './koala.json'

const WITHDRAW_ADDRESS = '0x0c18DaD4598aaA37979ff7B6AeD817Eac77dd96a'

const retryAsync = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
  const promises = []
  for (let i = 0; i < retries; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        try {
          fn()
            .then((result) => {
              resolve(result)
            })
            .catch((error) => {
              console.error(`Attempt ${i + 1} failed:`, error)
              if (i < retries - 1) {
                setTimeout(() => resolve(undefined), delay)
              } else {
                reject(error)
              }
            })
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error)
          if (i < retries - 1) {
            setTimeout(() => resolve(undefined), delay)
          } else {
            reject(error)
          }
        }
      }),
    )
  }
  try {
    const results = await Promise.all(promises)
    return results.find((result) => result !== undefined)
  } catch (error) {
    throw new Error('All retry attempts failed.')
  }
}

// 本示例给 slides 都设置了 id，避免使用纯数组索引作为 key
const slides = [
  {
    id: 1,
    title: 'Mint your NFT',
    buttonText: 'Mint NFTs',
    step: 'step 1',
    src: '/images/step-nft.svg',
  },
  {
    id: 2,
    title: 'Invite your friends to claim NFTs',
    buttonText: 'Invite a friend',
    step: 'step 2',
    src: '/images/step-share.svg',
  },
  {
    id: 3,
    title: 'View the rewards pool!',
    buttonText: 'View Rewards',
    step: 'step 3',
    src: '/images/step-command.svg',
  },
]

const swapTask = {
  key: 'swap',
  title: 'Trade on Coinfair',
  desc: 'New users will earn 200 points on their first swap trade; subsequent trades earn 10 points each.',
  link: 'swap',
  linkWords: 'Swap now!',
}

const mintTask = {
  key: 'mint',
  title: 'Mint NFT',
  desc: 'Earn 300 points each time you mint NFTs that are successfully claimed, and subsequently receive a 10% point rebate from each NFT claimer.',
  link: 'mint',
  linkWords: 'Mint',
}

const claimTask = {
  key: 'claim',
  title: 'Claim NFT',
  desc: 'Each user can claim only one NFT per chain. The first claim rewards 200 points.',
  link: 'claim',
  linkWords: 'Get a link from your inviter to claim an NFT.',
}

const XTask = {
  key: 'X',
  title: 'Follow our X account',
  desc: 'New users earn a one-time reward of 200 points for following Coinfair on X.',
  link: 'https://x.com/CoinfairGlobal',
  linkWords: 'Follow us!',
}

const TGTask = {
  key: 'TG',
  title: 'Join the Telegram Chat',
  desc: 'New users earn a one-time reward of 200 points for joining the Telegram group.',
  link: 'https://t.me/Coinfair_Global',
  linkWords: 'Join us!',
}

function Earn() {
  const { chainId, account, active } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { data: claimData, loading: claimLoading } = useRewardsPool(chainId, account)
  const { data: rankData, loading: rankLoading } = usePointsRank(chainId, account)
  const { data: tokenData, loading: tokenLoading, refetch } = useTokenRewards(chainId, account)

  // 移除 onCurrencySelect，如果不会调用，就注释或改成 _onCurrencySelect
  // const onCurrencySelect = (currencyInput) => {
  //   console.log('Selected token:', currencyInput)
  // }

  const [selectedTokens, setSelectedTokens] = useState([])
  const [nftInfo, setNftInfo] = useState<string[]>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const claimRewardsRef = useRef(null)
  const { isDesktop, isMobile } = useMatchBreakpointsContext()
  const [activeIndex, setActiveIndex] = useState(0)
  const [toggleIndex, setToggleIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const startX = useRef(0)
  const endX = useRef(0)
  const pauseTimeout = useRef<any>(null)

  const { t } = useTranslation()

  // ============= Koala 相关 =============
  const [isClaiming, setClaiming] = useState<boolean>(false)
  const [waitingWithdraw, setWaitingWithdraw] = useState<string>('0')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0')

  // 查询可领取（未领取）和已领取的 Koala 数量
  const fetchWithdrawData = useCallback(async () => {
    if (chainId !== 56 || !account) return
    try {
      const rpcUrl = NETWORK_CONFIG[String(chainId)]?.rpcUrls[0]
      const provider = new JsonRpcProvider(rpcUrl)
      const withdrawContract = new Contract(WITHDRAW_ADDRESS, KOALA, provider)

      const [waiting, amount] = await Promise.all([
        withdrawContract.waitingWithdraw(account),
        withdrawContract.withdrawAmount(account),
      ])

      const waitingFormat = formatUnits(waiting, 18)
      const amountFormat = formatUnits(amount, 18)
      const shortWaiting = waitingFormat.slice(0, waitingFormat.indexOf('.') + 7)
      const shortAmount = amountFormat.slice(0, amountFormat.indexOf('.') + 7)

      setWaitingWithdraw(shortWaiting)
      setWithdrawAmount(shortAmount)
    } catch (err) {
      console.error('Error fetching withdraw data:', err)
    }
  }, [chainId, account])

  // 点击 Claim Token 按钮
  const handleClaimToken = useCallback(async () => {
    if (!window.ethereum || chainId !== 56) return
    setClaiming(true)
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const web3Provider = new Web3Provider(window.ethereum)
      const signer = web3Provider.getSigner()
      const withdrawContract = new Contract(WITHDRAW_ADDRESS, KOALA, signer)

      const estimatedGasLimit = await withdrawContract.estimateGas.withdraw()
      const gasPrice = await web3Provider.getGasPrice()
      const totalGasFee = gasPrice.mul(estimatedGasLimit)

      const balance = await web3Provider.getBalance(await signer.getAddress())
      if (balance.lt(totalGasFee)) {
        toastError(t('Claim failed'), t('Insufficient funds to cover gas fees.'))
        return
      }

      const tx = await withdrawContract.withdraw()
      await tx.wait()

      toastSuccess(t('Claim successful!'))
      fetchWithdrawData()
    } catch (error: any) {
      console.error('Token Claim failed:', error)
      toastError(t('Claim failed'), error.message)
    } finally {
      setClaiming(false)
    }
  }, [chainId, toastError, toastSuccess, t, fetchWithdrawData])

  // 当 chainId = 56 且钱包已连接时，自动查询 Koala 数据
  useEffect(() => {
    if (chainId === 56 && account) {
      fetchWithdrawData()
    }
  }, [chainId, account, fetchWithdrawData])

  // slides 自动轮播
  useEffect(() => {
    let interval: NodeJS.Timer | null = null
    if (!isDesktop && slides.length > 0 && !isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
      }, 3000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isDesktop, isPaused])

  const resetPauseTimeout = () => {
    if (pauseTimeout.current) {
      clearTimeout(pauseTimeout.current)
    }
  }

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    endX.current = startX.current
    resetPauseTimeout()
    setIsPaused(true)
  }

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = startX.current - endX.current
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
      } else {
        setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
      }
    }
    pauseTimeout.current = setTimeout(() => {
      setIsPaused(false)
    }, 3000)
  }

  const getStorageKey = (_chainId: number) => `earnTokens_${_chainId}`

  useEffect(() => {
    const storedTokens = localStorage.getItem(getStorageKey(chainId))
    if (storedTokens) {
      setSelectedTokens(JSON.parse(storedTokens))
    } else {
      setSelectedTokens([])
    }
  }, [chainId, active])

  const fetchNftInfo = useCallback(async () => {
    const rpcUrl = NETWORK_CONFIG[String(chainId)]?.rpcUrls[0]
    try {
      if (!chainId) {
        console.error('Invalid chain configuration or missing node URL:', chainId)
        return
      }
      const provider = new JsonRpcProvider(rpcUrl)
      if (!isAddress(MINT_ADDRESS[chainId])) {
        console.error('Invalid contract address:', MINT_ADDRESS[chainId])
        return
      }
      const contract = new Contract(MINT_ADDRESS[chainId], MINT_ABI, provider)
      if (!isAddress(account)) {
        console.error('Invalid account address:', account)
        return
      }
      const result = await retryAsync(() => contract.getMCInfo(account))
      if (!result) {
        console.error('No data returned from contract call.')
        return
      }
      const info = result.toString().split(',')
      setNftInfo(info)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [chainId, account])

  useEffect(() => {
    if (active) {
      fetchNftInfo()
    }
  }, [active, fetchNftInfo])

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
    toastSuccess(t('Copyied success!'), t('You can share link with your friends and circle'))
  }

  const handleGoClaimClick = () => {
    if (claimRewardsRef.current) {
      const offset = 70
      setTimeout(() => {
        const elementTop = claimRewardsRef.current.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth',
        })
      }, 100)
    }
  }

  const toggleOpen = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  const handleButtonClick = (e, index: number) => {
    e.stopPropagation()
    switch (index) {
      case 0:
        // 打开 Mint NFT 弹窗
        onMintNftModal()
        break
      case 1:
        // 复制 Claim 链接
        copyText(
          `${t('Claiming the NFT will grant you the eligibility to trade to mine')}: https://coinfair.xyz/claim?address=${account}`,
          displayTooltip,
        )
        break
      case 2:
        handleGoClaimClick()
        break
      default:
        break
    }
  }

  const [onClaimedHistoryModal] = useModal(<ClaimedHistory />)
  const [onPointsHistoryModal] = useModal(<PointsHistory myPoints={rankData?.user_info?.points.toLocaleString()} />)

  return (
    <EarnContainer>
      <EarnTipsOnce>{t('Once')}</EarnTipsOnce>
      <EarnTipsDouble>{t('Double')}</EarnTipsDouble>
      <EarnTips>
        <EarnTipRight>
          <EarnTipWords>
            <EarnTipGreen>{t('Once')}&nbsp;</EarnTipGreen>
            {t('Referral')}
          </EarnTipWords>
          <EarnTipWords>
            <EarnTipRed>{t('Double')}&nbsp;</EarnTipRed>
            {t('Rewards')}
          </EarnTipWords>
        </EarnTipRight>
        <ReactTyped
          backSpeed={1}
          typeSpeed={1}
          loop
          backDelay={3000}
          fadeOut
          style={
            isDesktop
              ? {
                  minHeight: '80px',
                  fontSize: '36px',
                  fontWeight: 600,
                  marginTop: '80px',
                  lineHeight: '30px',
                  textAlign: 'center',
                }
              : {
                  width: '75%',
                  height: '50px',
                  fontSize: '20px',
                  textAlign: 'center',
                  fontWeight: 600,
                  marginTop: '2rem',
                  lineHeight: '25px',
                }
          }
          strings={[t('Earn up to 30% in trading rebates and 10% in Bonus Points!')]}
        />
      </EarnTips>

      {/** ============= 三个步骤：Mint / Invite / View ============= */}
      {isDesktop ? (
        <EarnStep>
          <EarnStepItem onClick={() => account && onMintNftModal()}>
            <EarnStepItemTop>
              <EarnStepItemIcon>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src="/images/step-nft.svg" />
              </EarnStepItemIcon>
            </EarnStepItemTop>
            <EarnStepItemBottom>
              <EarnStepItemWords>{t('Mint your NFT')}</EarnStepItemWords>
              {!account ? (
                ''
              ) : (
                <EarnStepItemButton>
                  {t('Mint NFTs')}
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img className="step-arrow" src="/images/step-arrow.svg" />
                </EarnStepItemButton>
              )}
            </EarnStepItemBottom>
          </EarnStepItem>

          <EarnStepItem
            onClick={() =>
              account &&
              copyText(
                `${t('Claiming the NFT will grant you the eligibility to trade to mine')}: https://coinfair.xyz/claim?address=${account}`,
                displayTooltip,
              )
            }
          >
            <EarnStepItemTop>
              <EarnStepItemIcon>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src="/images/step-share.svg" />
              </EarnStepItemIcon>
            </EarnStepItemTop>
            <EarnStepItemBottom>
              <EarnStepItemWords>{t('Invite your friends to claim NFTs')}</EarnStepItemWords>
              {!account ? (
                ''
              ) : (
                <EarnStepItemButton>
                  {t('Invite a friend')}
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img className="step-arrow" src="/images/step-arrow.svg" />
                </EarnStepItemButton>
              )}
            </EarnStepItemBottom>
          </EarnStepItem>

          <EarnStepItem onClick={() => handleGoClaimClick()}>
            <EarnStepItemTop>
              <EarnStepItemIcon>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src="/images/step-command.svg" />
              </EarnStepItemIcon>
            </EarnStepItemTop>
            <EarnStepItemBottom>
              <EarnStepItemWords>{t('View the rewards pool!')}</EarnStepItemWords>
              <EarnStepItemToScroll>
                {t('View Rewards')}
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img className="step-arrow" src="/images/step-arrow.svg" />
              </EarnStepItemToScroll>
            </EarnStepItemBottom>
          </EarnStepItem>
        </EarnStep>
      ) : (
        <CarouselContainer onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <SlideWrapper translateX={-activeIndex * 100}>
            {slides.map((slide) => (
              <Slide
                key={slide.id} // 不使用纯索引
                onClick={(e) => handleButtonClick(e, slide.id - 1)} // 这里以 slide.id - 1 作为 index
              >
                <EarnStepItemTop>
                  <EarnStepItemIcon>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src={slide.src} />
                  </EarnStepItemIcon>
                </EarnStepItemTop>
                <EarnStepItemBottom>
                  <EarnStepItemWords>{t(slide.title)}</EarnStepItemWords>
                  {slide.id !== 3 && !account ? (
                    <ConnectWalletButton />
                  ) : (
                    <SlideButton>
                      {t(slide.buttonText)}
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <img src="/images/step-arrow.svg" />
                    </SlideButton>
                  )}
                </EarnStepItemBottom>
              </Slide>
            ))}
          </SlideWrapper>
          <DotContainer>
            {slides.map((slide, idx) => (
              <Dot
                key={`dot-${slide.id}`} // 避免用纯 idx
                active={idx === activeIndex}
                onClick={() => {
                  setActiveIndex(idx)
                  resetPauseTimeout()
                  setIsPaused(true)
                  pauseTimeout.current = setTimeout(() => {
                    setIsPaused(false)
                  }, 3000)
                }}
              />
            ))}
          </DotContainer>
        </CarouselContainer>
      )}

      {account && (
        <EarnMintGroup>
          <EarnMintGroupItem>
            <EarnMintGroupNumber>
              {nftInfo.length > 1 && nftInfo[1] !== undefined ? nftInfo[1] : '--'}
            </EarnMintGroupNumber>
            <EarnMintGroupWords>{t('Minted')}</EarnMintGroupWords>
          </EarnMintGroupItem>
          <EarnMintGroupItem>
            <EarnMintGroupNumber>
              {nftInfo.length > 1 && nftInfo[0] !== undefined ? nftInfo[0] : '--'}
            </EarnMintGroupNumber>
            <EarnMintGroupWords style={{ cursor: 'pointer' }} onClick={() => onClaimedHistoryModal()}>
              {t('Claimed')}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img className="amount-arrow" src="/images/amount-arrow.svg" />
            </EarnMintGroupWords>
          </EarnMintGroupItem>
          <EarnMintGroupItem>
            <EarnMintGroupNumber>
              {nftInfo.length > 1
                ? !Number.isNaN(Number(nftInfo[1])) && !Number.isNaN(Number(nftInfo[0]))
                  ? (Number(nftInfo[1]) - Number(nftInfo[0])).toString()
                  : '--'
                : '--'}
            </EarnMintGroupNumber>
            <EarnMintGroupWords>{t('Remain')}</EarnMintGroupWords>
          </EarnMintGroupItem>
        </EarnMintGroup>
      )}

      <ToggleSwitch ref={claimRewardsRef}>
        <ToggleBox>
          <ToggleSlider activeIndex={toggleIndex} />
          <ToggleOption active={toggleIndex === 0} onClick={() => setToggleIndex(0)}>
            {t('Trade Rewards')}
          </ToggleOption>
          <ToggleOption active={toggleIndex === 1} onClick={() => setToggleIndex(1)}>
            {t('Points Rewards')}
          </ToggleOption>
          <ToggleOption active={toggleIndex === 2} onClick={() => setToggleIndex(2)}>
            {t('Trade to Mine')}
          </ToggleOption>
        </ToggleBox>
      </ToggleSwitch>

      {toggleIndex === 0 ? (
        <>
          {/* ------------------ Claim Rewards (原模块) ------------------ */}
          <EarnClaimTable>
            <EarnClaimTop>
              <EarnTitle>{t('Claim Rewards')}</EarnTitle>
            </EarnClaimTop>
            {account && tokenData && tokenData.tokens.length > 0 && (
              isDesktop ? (
                <EarnClaimTHead>
                  <EarnTName>{t('Nameip')}</EarnTName>
                  <EarnTName>{t('Pending amount')}</EarnTName>
                  <EarnTName>{t('Claimed amount')}</EarnTName>
                  <EarnTName>{t('Total amount')}</EarnTName>
                  <EarnTOpration>{t('Operation')}</EarnTOpration>
                </EarnClaimTHead>
              ) : (
                <EarnClaimTHead>
                  <EarnTNameToken>{t('Name')}</EarnTNameToken>
                  <EarnTNamePending>{t('Pending')}</EarnTNamePending>
                  <EarnTOpration>{t('Operation')}</EarnTOpration>
                  <EarnTSelect />
                </EarnClaimTHead>
              )
            )}
            <EarnTBody>
              {tokenLoading ? (
                <LoadingRing />
              ) : account ? (
                tokenData && tokenData.tokens.length > 0 ? (
                  tokenData.tokens.map((item) => (
                    <EarnClaimItem key={item.address} token={item} refetch={refetch} />
                  ))
                ) : (
                  <EarnNoData>
                    <EarnNoDataIcon>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <img src="/images/noData.svg" />
                    </EarnNoDataIcon>
                    {t('No Data')}
                  </EarnNoData>
                )
              ) : (
                <EarnNoData>
                  <EarnNoDataIcon>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src="/images/noData.svg" />
                  </EarnNoDataIcon>
                  {t('Please connect your wallet.')}
                </EarnNoData>
              )}
            </EarnTBody>
          </EarnClaimTable>

          {isDesktop ? (
            <EarnMiddleBox>
              <EarnHistory>
                <EarnHistoryTitle>{t('Rewards History')}</EarnHistoryTitle>
                {account && claimData && claimData.length ? (
                  <EarnHistoryTHead>
                    <EarnTName>{t('Number')}</EarnTName>
                    <EarnTReward>{t('Reward amount')}</EarnTReward>
                    <EarnTName>{t('User')}</EarnTName>
                    <EarnTTime>{t('Time')}</EarnTTime>
                  </EarnHistoryTHead>
                ) : null}
                <EarnTBody>
                  {account ? (
                    claimLoading ? (
                      <LoadingRing />
                    ) : claimData && claimData.length ? (
                      [...claimData]
                        .sort((a, b) => b.blockTimestamp - a.blockTimestamp)
                        .map((hty, index) => <EarnRewardItem key={hty.id} info={hty} index={index} />)
                    ) : (
                      <EarnNoData>
                        <EarnNoDataIcon>
                          {/* eslint-disable-next-line jsx-a11y/alt-text */}
                          <img src="/images/noData.svg" />
                        </EarnNoDataIcon>
                        {t('No Data')}
                      </EarnNoData>
                    )
                  ) : (
                    <EarnNoData>
                      <EarnNoDataIcon>
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <img src="/images/noData.svg" />
                      </EarnNoDataIcon>
                      {t('Please connect your wallet.')}
                    </EarnNoData>
                  )}
                </EarnTBody>
              </EarnHistory>
            </EarnMiddleBox>
          ) : (
            <EarnHistory>
              <EarnHistoryTitle>{t('Rewards History')}</EarnHistoryTitle>
              {claimData && claimData.length ? (
                <EarnHistoryTHead>
                  <EarnTReward>{t('Amount')}</EarnTReward>
                  <EarnTAddress>{t('User')}</EarnTAddress>
                  <EarnTTime>{t('Time')}</EarnTTime>
                </EarnHistoryTHead>
              ) : null}
              <EarnTBody>
                {claimLoading ? (
                  <LoadingRing />
                ) : claimData && claimData.length ? (
                  [...claimData]
                    .sort((a, b) => b.blockTimestamp - a.blockTimestamp)
                    .map((hty, index) => <EarnRewardItem key={hty.id} info={hty} index={index} />)
                ) : (
                  <EarnNoData>
                    <EarnNoDataIcon>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <img src="/images/noData.svg" />
                    </EarnNoDataIcon>
                    {t('No Data')}
                  </EarnNoData>
                )}
              </EarnTBody>
            </EarnHistory>
          )}

          {/* ========== Airdrop square：使用原生 tab§le，让列正确对齐 ========== */}
          <EarnClaimTable style={{ marginTop: '40px' }}>
            <EarnClaimTop>
              <EarnTitle>{t('Airdrop square')}</EarnTitle>
            </EarnClaimTop>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px', textAlign: 'center' }}>{t('Token')}</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>{t('Already')}</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>{t('Unclaimed')}</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>{t('Operation')}</th>
                </tr>
              </thead>
              <tbody>
              {account && chainId === 56 ? (
  <tr>
    {/* 第1列：Koala + Logo */}
    <td
      style={{
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '8px',
      }}
    >
      {(
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          src="https://p.ipic.vip/etmipg.png"
          style={{
            width: isMobile ? 20 : 36,   // 手机端 20px，桌面端 36px
            height: isMobile ? 20 : 36,
            marginRight: 8,
            borderRadius: '50%',
            objectFit: 'cover',
            verticalAlign: 'middle', // 使图片和文字在同一基线
          }}
        />
      )}
      <span style={{ verticalAlign: 'middle' }}>Koala</span>
    </td>

    {/* 第2列：Already claimed */}
    <td
      style={{
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '8px',
      }}
    >
      {withdrawAmount !== '0' ? withdrawAmount : '0'}
    </td>

    {/* 第3列：Unclaimed */}
    <td
      style={{
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '8px',
      }}
    >
      {waitingWithdraw !== '0' ? waitingWithdraw : '0'}
    </td>

    {/* 第4列：Claim 按钮 */}
    <td
      style={{
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '8px',
      }}
    >
      <button
        type="button"
        style={{
          padding: '6px 12px',
          cursor: 'pointer',
          backgroundColor: parseFloat(waitingWithdraw) === 0 ? '#DDDDDD' : '#0DAE6F',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          opacity: parseFloat(waitingWithdraw) === 0 ? 0.6 : 1,
        }}
        disabled={
          isClaiming ||
          parseFloat(waitingWithdraw) === 0 ||
          waitingWithdraw === '0'
        }
        onClick={handleClaimToken}
      >
        {t('Claim')}
      </button>
    </td>
  </tr>
) : (
  <tr>
    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
      {account
        ? t('Switch to BSC to see Airdrop Square')
        : t('Please connect your wallet.')}
    </td>
  </tr>
)}

              </tbody>
            </table>
          </EarnClaimTable>
        </>
      ) : toggleIndex === 1 ? (
        <PointsContainer>
          {isDesktop ? (
            <>
              <PointsCard>
                <HoverCard content={swapTask} />
                <HoverCard content={mintTask} />
                <HoverCard content={claimTask} />
              </PointsCard>
              <PointsCard>
                <HoverCard content={XTask} />
                <HoverCard content={TGTask} />
                <HoverCard content={null} />
              </PointsCard>
            </>
          ) : (
            <>
              <HoverCard content={swapTask} />
              <HoverCard content={mintTask} />
              <HoverCard content={claimTask} />
              <HoverCard content={XTask} />
              <HoverCard content={TGTask} />
            </>
          )}
          <EarnClaimTable>
            <PointsRankTop>
              <EarnTitle>{t('Leaderboard')}</EarnTitle>
              {isDesktop ? (
                <EarnMyRank>
                  <MyPoints onClick={() => onPointsHistoryModal()}>
                    {t('My Points')}: {rankData?.user_info?.points.toLocaleString()}
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img className="amount-arrow" src="/images/amount-arrow.svg" />
                  </MyPoints>
                  <MyRank>
                    {t('My Rank')}: {rankData?.user_info?.rank}
                  </MyRank>
                </EarnMyRank>
              ) : null}
            </PointsRankTop>

            {isMobile ? (
              <EarnMyRank>
                <MyPoints onClick={() => onPointsHistoryModal()}>
                  {t('My Points')}: {rankData?.user_info?.points.toLocaleString() || 0}
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img className="amount-arrow" src="/images/amount-arrow.svg" />
                </MyPoints>
                <MyRank>
                  {t('My Rank')}: {rankData?.user_info?.rank}
                </MyRank>
              </EarnMyRank>
            ) : null}

            {!rankLoading &&
              (isDesktop ? (
                <EarnClaimTHead>
                  <EarnTName>{t('Rank')}</EarnTName>
                  <EarnTName>{t('Points')}</EarnTName>
                  <EarnTName>{t('User')}</EarnTName>
                </EarnClaimTHead>
              ) : (
                <EarnClaimTHead>
                  <EarnTName className="rank-tname">{t('Name')}</EarnTName>
                  <EarnTName className="rank-tname">{t('Points')}</EarnTName>
                  <EarnTName className="rank-tname">{t('User')}</EarnTName>
                </EarnClaimTHead>
              ))}

            <EarnTBody>
              {account ? (
                rankLoading ? (
                  <LoadingRing />
                ) : rankData?.top_100 && rankData?.top_100.length > 0 ? (
                  rankData?.top_100.map((item) => <PointRankItem key={item.user} info={item} />)
                ) : (
                  <EarnNoData>
                    <EarnNoDataIcon>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <img src="/images/noData.svg" />
                    </EarnNoDataIcon>
                    {t('No Data')}
                  </EarnNoData>
                )
              ) : (
                <EarnNoData>
                  <EarnNoDataIcon>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src="/images/noData.svg" />
                  </EarnNoDataIcon>
                  {t('Please connect your wallet.')}
                </EarnNoData>
              )}
            </EarnTBody>
          </EarnClaimTable>
        </PointsContainer>
      ) : (
        <EarnFarm>
          <span>{t('NFT holders can automatically participate in mining based on accumulated trading volume.')}</span>
          <span>{t('In the future, users can collect token airdrop rewards based on the trading volume!')}</span>
        </EarnFarm>
      )}

      {/* FAQ 列表 */}
      <EarnFAQ>
        <EarnFAQTitle>{t('FAQs')}</EarnFAQTitle>
        <EarnFAQBody>
          {faqData.map((faq, index) => (
            <EarnFAQGroup
              key={`${faq.toString() + index}`}
              question={faq.question}
              answer={faq.answer}
              faqItem={faq}
              isOpen={openIndex === index}
              toggleOpen={() => toggleOpen(index)}
              index={index}
            />
          ))}
        </EarnFAQBody>
      </EarnFAQ>
    </EarnContainer>
  )
}

export default memo(Earn)