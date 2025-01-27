import { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Drawer } from '@mui/material';
import { CurrencyAmount, Token, Trade, WNATIVE } from '@pancakeswap/sdk'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange'
import { IoClose } from "react-icons/io5";
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  Flex,
  IconButton,
  ArrowUpDownIcon,
  Skeleton,
  useMatchBreakpointsContext,
  BottomDrawer,
} from '@pancakeswap/uikit'
import Airdop from 'components/Airdop'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import useGoogleAnalysis from 'hooks/useGoogleAnalysis'
import { useCurrencyBalance, useCurrencyBalances, useTokenBalances } from 'state/wallet/hooks'
import useRefreshBlockNumberID from './hooks/useRefreshBlockNumber'
import AddressInputPanel from './components/AddressInputPanel'
import { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedSwapDetailsDropdown from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapState,
} from '../../state/swap/hooks'
import {
  useExpertModeManager,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  useExchangeChartManager,
} from '../../state/user/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'
import { StyledInputCurrencyWrapper, StyledSwapContainer, BTC, USDC, Binance, ETH, USDT, ADA, Slogen, SlogenLine } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'
import { CommonBasesType } from '../../components/SearchModal/types'
import { swapFormulaList } from '../../utils'
import CandlestickChart from './components/ViewChart'
import { CurrencyLogo } from 'components/Logo';
import { NETWORK_CONFIG } from 'config';
import getLpAddress from 'utils/getLpAddress';

const SwapPage = styled(Page)`
  position: relative;
`

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const SwitchIconButton = styled(IconButton)`
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: #000;
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #434B34 0%, #000 100%);
  border-radius: 28px;
`

const StyledAutoColumn = styled(AutoColumn)`
  margin: 12px auto -8px;
`

export default function Swap() {
  const theme = useTheme()
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t, currentLanguage } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const [current, setCurrent] = useState('')
  const [fee, setFee] = useState('')
  const [openChart, setOpenChart] = useState(false)
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  useGoogleAnalysis("swap", "")

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )
  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const {
    v2Trade,
    v2TradeOne,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currencies[Field.INPUT] ?? undefined)
  
  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()
  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />, false)

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, selectedCurrencyBalance?.toSignificant(6))
    }
  }, [maxAmountInput, onUserInput])

  const handleClaimToken = useCallback(() => {
    // const provider = new Contract(TREASURY_ADDRESS[chainId], )
  }, [account, chainId])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyOutput)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  const ammType = useMemo(() => {
    if (v2TradeOne?.route?.pairs?.[0]?.exponent0 && v2TradeOne?.route?.pairs?.[0]?.exponent1) {
      switch (Number(v2TradeOne?.route?.pairs?.[0]?.exponent0) / Number(v2TradeOne?.route?.pairs?.[0]?.exponent1)) {
        case 1:
          return 3
        case 32:
          return 2
        case 0.03125:
          return 2
        case 4:
          return 1
        case 0.25:
          return 1
        default:
          return null
      }
    }
    return null
  }, [v2TradeOne])

  useEffect(() => {
    if (currencies[Field.INPUT] && currencies[Field.OUTPUT]) {
      const tokenA = currencies[Field.INPUT];
      const tokenB = currencies[Field.OUTPUT];
      const event = new CustomEvent('tokensUpdated', {
        detail: { tokenA, tokenB }
      });
      window.dispatchEvent(event);
    }
  }, [currencies[Field.INPUT], currencies[Field.OUTPUT]]);

  // k line hanlde
  // const klineCurrencies = useMemo(()=>{
  //   return currencies[Field.OUTPUT] || currencies[Field.INPUT];
  // },[currencies]);

  // const lpAddress = useMemo(()=>{
  //   if(!currencies.INPUT || !currencies.OUTPUT || !chainId) return undefined;
  //   [currencies.INPUT,currencies.OUTPUT].forEach(v=>{
  //     console.log(v);
  //     v.address =  v.symbol==='BNB' ?  WNATIVE[chainId].address : v.address;
  //   });
  //   console.log(currencies.INPUT.address,currencies.OUTPUT.address,chainId);
  //   return getLpAddress(currencies.INPUT.address,currencies.OUTPUT.address,chainId);
  // },[currencies])

  return (
    <SwapPage>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper mt="0">
              <Slogen currentLanguage={currentLanguage.locale !== 'en-US'}>
                <SlogenLine>{t('Trade in deep')}</SlogenLine>
                {currentLanguage.locale !== 'en-US' ? <SlogenLine>,&nbsp;</SlogenLine> : ''}
                <SlogenLine>{t('Rewards you keep')}</SlogenLine>
              </Slogen>
              <AppBody>
                <CurrencyInputHeader
                  title={t('Swap')}
                  subtitle=''
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                  hasAmount={hasAmount}
                  onRefreshPrice={onRefreshPrice}
                  setOpenChart={setOpenChart}
                />
                <Wrapper id="swap-page" style={{ minHeight: '325px' }}>
                  <AutoColumn style={{ display: 'block' }}>
                    <div>
                      <CurrencyInputPanel
                        label={
                          independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                        }
                        labelType="swap"
                        value={formattedAmounts[Field.INPUT]}
                        showMaxButton={!atMaxAmountInput}
                        showWithDraw
                        currency={currencies[Field.INPUT]}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={currencies[Field.OUTPUT]}
                        id="swap-currency-input"
                        showCommonBases
                        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
                        zapStyle='noZap'
                      />
                      <StyledAutoColumn justify="space-between">
                        <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                          <SwitchIconButton
                            variant="light"
                            scale="sm"
                            onClick={() => {
                              setApprovalSubmitted(false) // reset 2 step UI for approvals
                              onSwitchTokens()
                            }}
                          >
                            <ArrowDownIcon
                              className="icon-down"
                              color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? '#434B34' : 'text'}
                            />
                            <ArrowUpDownIcon
                              className="icon-up-down"
                              color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? '#434B34' : 'text'}
                            />
                          </SwitchIconButton>
                          {recipient === null && !showWrap && isExpertMode ? (
                            <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                              {t('+ Add a send (optional)')}
                            </Button>
                          ) : null}
                        </AutoRow>
                      </StyledAutoColumn>
                      <CurrencyInputPanel
                        value={formattedAmounts[Field.OUTPUT]}
                        onUserInput={handleTypeOutput}
                        onClaim={handleClaimToken}
                        label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                        labelType="swap-balance"
                        showMaxButton={false}
                        showWithDraw
                        currency={currencies[Field.OUTPUT]}
                        onCurrencySelect={handleOutputSelect}
                        otherCurrency={currencies[Field.INPUT]}
                        id="swap-currency-output"
                        showCommonBases
                        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
                        zapStyle='noZap'
                      />
                    </div>
                    {isExpertMode && recipient !== null && !showWrap ? (
                      <>
                        <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                          <ArrowWrapper clickable={false}>
                            <ArrowDownIcon width="16px" />
                          </ArrowWrapper>
                          <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                            {t('- Remove send')}
                          </Button>
                        </AutoRow>
                        <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                      </>
                    ) : null}

                    {showWrap ? null : (
                      <AutoColumn gap="7px">
                        <RowBetween align="center">
                          {Boolean(trade) && (
                            <>
                              <Label>{t('Price')}</Label>
                              {isLoading ? (
                                <Skeleton width="100%" ml="8px" height="24px" />
                              ) : (
                                <TradePrice
                                  price={trade?.executionPrice}
                                  showInverted={showInverted}
                                  setShowInverted={setShowInverted}
                                />
                              )}
                            </>
                          )}
                        </RowBetween>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px 0' }}>
                          <Label style={{ color: theme.colors.dark }}>{t('Slippage Tolerance')}</Label>
                          <Text bold color="primary" style={{ marginLeft: '10px', color: theme.colors.dark }}>
                            {allowedSlippage / 100}%
                          </Text>
                        </div>
                      </AutoColumn>
                    )}
                  </AutoColumn>
                  <Box mt="0.25rem">
                    {swapIsUnsupported ? (
                      <StyledButton width="100%" disabled>
                        {t('Unsupported Asset')}
                      </StyledButton>
                    ) : !account ? (
                      <ConnectWalletButton width="100%" />
                    ) : showWrap ? (
                      <StyledButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </StyledButton>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard style={{ textAlign: 'center', padding: '0.75rem', background: 'linear-gradient(90deg,#434B34 0%,#000 100%)', borderRadius: '28px' }}>
                        <Text color="textSubtle" style={{ color: 'white', fontWeight: '600' }}>
                          {t('Insufficient liquidity for this trade.')}
                        </Text>
                        {/* {singleHopOnly && (
                          <Text color="textSubtle" style={{ color: 'white', fontWeight: '600' }}>
                            {t('Try enabling multi-hop trades.')}
                          </Text>
                        )} */}
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <StyledButton
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                          )}
                        </StyledButton>
                        <StyledButton
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                              })
                              onPresentConfirmModal()
                            }
                          }}
                          width="48%"
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                        >
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact High')
                            : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap')}
                        </StyledButton>
                      </RowBetween>
                    ) : (
                      <StyledButton
                        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              txHash: undefined,
                            })
                            onPresentConfirmModal()
                          }
                        }}
                        id="swap-button"
                        width="100%"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                      >
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact Too High')
                            : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap'))}
                      </StyledButton>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                    {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                  </Box>
                </Wrapper>
              </AppBody>
              {!swapIsUnsupported ? (
                trade && <AdvancedSwapDetailsDropdown trade={trade} />
              ) : (
                <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
              )}
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
      <Airdop />
      <Drawer
        anchor="bottom"
        open={openChart}
        onClose={() => setOpenChart(false)}
        style={{ zIndex: 200 }}
      >
        <div style={{ width: '100%', padding: '10px', paddingTop: '5px', maxHeight: '1000px', overflowY: 'auto' }}>
          <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* <div style={{ fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              {klineCurrencies && klineCurrencies.address ?
              <img style={{ width: '40px', height: '40px' }} src={`https://raw.githubusercontent.com/Topo-Labs/CoinfairTokenList/refs/heads/main/${klineCurrencies.address}.png`} alt="" /> :
              <CurrencyLogo currency={klineCurrencies}/>
              }
              {klineCurrencies && <span>&nbsp;&nbsp;{klineCurrencies.symbol}</span>}
            </div> */}

            <div style={{ fontSize: '24px', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <img style={{ width: '40px', height: '40px' }} src="https://github.com/Topo-Labs/CoinfairTokenList/blob/main/0x17480b68F3E6c8B25574e2db07BFEB17C8faa056.png?raw=true" alt="" />
              <img style={{ width: '40px', height: '40px', marginLeft: '-12px' }} src="https://github.com/Topo-Labs/CoinfairTokenList/blob/main/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png?raw=true" alt="" />
              <span>&nbsp;&nbsp;HOPE/BNB</span>
            </div>
            <IoClose size={22} onClick={() => setOpenChart(false)} />
          </div>
          {
            <div style={{borderRadius:'10px',border:'none',width:'100%',height:'80vh',overflow:'hidden'}}>
              <iframe 
                  id="dextools-widget"
                  title="Trading Chart"
                  style={{width:'100%',height:'100%'}}
                  // src={`https://www.dextools.io/widget-chart/en/${NETWORK_CONFIG[chainId].network=='bsc'?'bnb':NETWORK_CONFIG[chainId].network}/pe-light/${lpAddress}?theme=light&chartType=2&chartResolution=30&drawingToolbars=false`}
                  src='https://www.dextools.io/widget-chart/en/bnb/pe-light/0x7465858234db8ca7bdcadd0d655368c333a42768?theme=light&chartType=2&chartResolution=30&drawingToolbars=false'
              />
            </div>
          }
          {/* <CandlestickChart /> */}
        </div>
      </Drawer>
      <BTC>
        <img src="/images/coins/BTC.svg" alt="" />
      </BTC>
      <USDC>
        <img src="/images/coins/USDC.svg" alt="" />
      </USDC>
      <Binance>
        <img src="/images/coins/Binance.svg" alt="" />
      </Binance>
      <ETH>
        <img src="/images/coins/ETH.svg" alt="" />
      </ETH>
      <USDT>
        <img src="/images/coins/USDT.svg" alt="" />
      </USDT>
      <ADA>
        <img src="/images/coins/ADA.svg" alt="" />
      </ADA>
    </SwapPage>
  )
}
