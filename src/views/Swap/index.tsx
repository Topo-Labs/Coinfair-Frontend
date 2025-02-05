import { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { CurrencyAmount, Token, Trade } from '@pancakeswap/sdk'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange'
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
import { useCurrencyBalance } from 'state/wallet/hooks'
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
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'
import { CommonBasesType } from '../../components/SearchModal/types'
import { swapFormulaList } from '../../utils'

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: 0px 0px 10px #ccc;
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
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const [current, setCurrent] = useState('')
  const [fee, setFee] = useState('')
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

  return (
    <Page>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper mt="0">
              <AppBody>
                <CurrencyInputHeader
                  title={t('Swap')}
                  subtitle=''
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                  hasAmount={hasAmount}
                  onRefreshPrice={onRefreshPrice}
                />
                <Wrapper id="swap-page" style={{ minHeight: '325px' }}>
                  <AutoColumn style={{ display: 'block' }}>
                    {
                      ammType ?
                        (
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px', marginBottom: '-16px' }}>
                            <Text style={{ marginRight: '20px' }}>{swapFormulaList[ammType - 1].label}</Text>
                            <Text>{swapFormulaList[ammType - 1].alias}</Text>
                          </div>
                        ) : null
                    }
                    <div>
                      <CurrencyInputPanel
                        label={
                          independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                        }
                        labelType="swap"
                        value={formattedAmounts[Field.INPUT]}
                        // value={renderOnInput(currencies[Field.INPUT])}
                        showMaxButton={!atMaxAmountInput}
                        currency={currencies[Field.INPUT]}
                        onUserInput={handleTypeInput}
                        onMax={handleMaxInput}
                        onCurrencySelect={handleInputSelect}
                        otherCurrency={currencies[Field.OUTPUT]}
                        id="swap-currency-input"
                        showCommonBases
                        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
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
                        // value={renderOnInput()}
                        onUserInput={handleTypeOutput}
                        label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                        labelType="swap-balance"
                        showMaxButton={false}
                        currency={currencies[Field.OUTPUT]}
                        onCurrencySelect={handleOutputSelect}
                        otherCurrency={currencies[Field.INPUT]}
                        id="swap-currency-output"
                        showCommonBases
                        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
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
                        {/* <RowBetween align="center"> */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '10px 0' }}>
                          <Label style={{ color: theme.colors.dark }}>{t('Slippage Tolerance')}</Label>
                          <Text bold color="primary" style={{ marginLeft: '10px', color: theme.colors.dark }}>
                            {allowedSlippage / 100}%
                          </Text>
                        </div>
                        {/* </RowBetween> */}
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
                        {singleHopOnly && (
                          <Text color="textSubtle" style={{ color: 'white', fontWeight: '600' }}>
                            {t('Try enabling multi-hop trades.')}
                          </Text>
                        )}
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
    </Page>
  )
}
