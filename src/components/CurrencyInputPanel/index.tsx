import { Currency, Pair, Token, TREASURY_ADDRESS } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import TreasuryABI from '@pancakeswap/sdk/src/abis/Coinfair_Treasury.json'
import useToast from 'hooks/useToast';
import styled, { css, useTheme } from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from 'utils/formatBalance'
import { background, border } from "styled-system";
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { Input as NumericalInput } from './NumericalInput'
import { CopyButton } from '../CopyButton'
import AddToWalletButton from '../AddToWallet/AddToWalletButton'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  padding-top: 8px;
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' }) <{ zapStyle?: ZapStyle }>`
  padding: 0 0.5rem;
  padding-right: 0;
  margin-right: -0.3rem;

  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      // background: ${theme.colors.background};
      // border: 1px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 0px 0px;
      height: auto;
    `};
`

const ClaimButton = styled(Button)<{ disabled }>`
  transition: all .3s ease;
  ${(disabled) => 
    !disabled &&
    css`
      &:hover {
        background: #000;
        color: #fff;
      }
    `
  }
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 0.75rem 0 0.75rem;
  padding-top: 8px;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean; isDark?: boolean }>`
  /*border: 1px solid ${({ theme }) => theme.colors.inputCat};*/
  border-radius: ${({ theme }) => theme.radii.default};
  /*background-color: ${({ theme }) => theme.colors.input};*/
  border: ${({ isDark }) => isDark ? '1px solid #372F47' : '1px solid #fff'};
  background-color: ${({ isDark }) => isDark ? '#372F47' : '#f1f1f1'};
  /* box-shadow: inset 2px 2px 5px #eeeeee, inset -2px -2px 5px #eeeeee; */
`

const StyledText = styled(Text)`
  height: 18px;
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onMax?: () => void
  onClaim?: () => void
  showMaxButton: boolean
  showWithDraw: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showBUSD?: boolean
  labelType?: string
  noLiquidity?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onMax,
  onClaim,
  showMaxButton,
  showWithDraw,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  disabled,
  error,
  showBUSD,
  labelType,
  noLiquidity,
}: CurrencyInputPanelProps) {
  const { account, chainId, library } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDark } = useTheme()

  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null
  const theme = useTheme()

  const amountInDollar = useBUSDCurrencyAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  )

  const [contract, setContract] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [hasRewards, setHasRewards] = useState(false);
  const [rewards, setRewards] = useState('')

  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    if (account && tokenAddress && chainId && library && TREASURY_ADDRESS[chainId]) {
      const _contract = new Contract(TREASURY_ADDRESS[chainId], TreasuryABI, library.getSigner(account));
      setContract(_contract)
      const checkRewards = async () => {
        try {
          const r = await _contract.CoinfairUsrTreasury(account, tokenAddress);
          setHasRewards(r.gt(0)); // 如果返佣奖励大于 0，启用按钮
          setRewards(rewards.toString())
        } catch (err) {
          setHasRewards(false)
          console.error('查询返佣奖励失败:', err);
        }
      };
      checkRewards()
    }
  }, [account, tokenAddress, chainId, library]);

  // 领取手续费
  const handleClaimToken = async () => {
    if (!contract) {
        console.error('合约未正确加载');
        return;
    }

    if (!tokenAddress && label !== 'To') {
      console.error('token位置领取失败');
      return;
    }

    setIsClaiming(true);
    setClaimError(null);

    try {
        const tx = await contract.withdrawFee(tokenAddress);
        console.log('Transaction hash:', tx.hash);

        // 等待交易确认
        const receipt = await tx.wait();
        console.log('Claim successful!', receipt);

        // 成功后，更新奖励状态
        setHasRewards(false);
        toastSuccess(t('Claim successful!'), `You claimed ${rewards} ${token.symbol}.`)
    } catch (err) {
        console.error('领取失败:', err);
        setClaimError(err || '领取失败');
    } finally {
        setIsClaiming(false);
    }
  };

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
    />,
  )

  return (
    <Box position="relative" id={id}>
      {noLiquidity ? (
        <StyledText style={{ fontSize: '12px', margin: '10px 0 10px 15px' }}>
          {label === 'X' ? t('tokensIssued') : label === 'Y' ? t('tokensRaised') : ''}
        </StyledText>
      ) :
        <StyledText style={{ fontSize: '12px', marginBottom: '2px', marginLeft: '15px' }}>
          {' '}
        </StyledText>
      }
      <Flex alignItems="center" justifyContent="space-between" style={{ display: 'none' }}>
        {account && (
          <Text
            onClick={!disabled && onMax}
            color="textSubtle"
            fontSize="12px"
            style={{ display: 'inline', cursor: 'pointer' }}
          >
            {!hideBalance && !!currency
              ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
              : ' -'}
          </Text>
        )}
      </Flex>
      <InputPanel>
        <Container as="label" zapStyle={zapStyle} error={error} isDark={isDark}>
          {labelType === 'swap' ? (
            <Flex alignItems="center" justifyContent="space-between" style={{ padding: '0 12px', paddingTop: '10px' }}>
              <Text style={{ fontSize: '14px' }}>{label}</Text>
              {account && (
                <Text
                  onClick={!disabled && onMax}
                  color="textSubtle"
                  fontSize="12px"
                  title={!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                  style={{ display: 'inline', cursor: 'pointer', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
            </Flex>
          ) : labelType === 'swap-balance' ? (
            <Flex alignItems="center" justifyContent="space-between" style={{ padding: '0 12px', paddingTop: '10px' }}>
              <Text style={{ fontSize: '12px' }}>{label}</Text>
              {account && (
                <Text
                  onClick={!disabled && onMax}
                  color="textSubtle"
                  fontSize="12px"
                  title={!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                  style={{ display: 'inline', cursor: 'pointer', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
            </Flex>
          ) : (
            <Flex alignItems="center" justifyContent="space-between" style={{ padding: '0 15px', paddingTop: '10px' }}>
              <Text style={{ fontSize: '12px' }}>INPUT</Text>
              {account && (
                <Text
                  onClick={!disabled && onMax}
                  color="textSubtle"
                  fontSize="14px"
                  title={!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                  style={{ display: 'inline', cursor: 'pointer', maxWidth: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {!hideBalance && !!currency
                    ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                    : ' -'}
                </Text>
              )}
            </Flex>
          )}
          <LabelRow>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              style={{ textAlign: 'left', fontSize: '20px', color: theme.colors.inputCat }}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
            {/* <Text style={{border: '2px solid #4B5860', padding: '0 8px', borderRadius: '15px', fontSize: '12px'}}>MAX</Text> */}
            {account && currency && !disabled && showMaxButton && label !== 'To' && (
              <Button
                onClick={onMax}
                scale="xs"
                variant="secondary"
                style={{
                  color: theme.colors.inputCat,
                  border: `1px solid ${theme.colors.inputCat}`
                }}
              >
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
            <Flex>
              {beforeButton}
              <CurrencySelectButton
                zapStyle={zapStyle}
                className="open-currency-select-button"
                selected={!!currency}
                onClick={() => {
                  if (!disableCurrencySelect) {
                    onPresentCurrencyModal()
                  }
                }}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                  ) : currency ? (
                    <CurrencyLogo currency={currency} size="20px" />
                  ) : null}
                  {pair ? (
                    <Text id="pair" bold style={{ marginLeft: '8px', fontSize: '12px' }}>
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </Text>
                  ) : (
                    <Text id="pair" bold style={{ marginLeft: '8px', fontSize: '12px' }}>
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                        : currency?.symbol) || t('Select a currency')}
                    </Text>
                  )}
                  {!disableCurrencySelect && <ChevronDownIcon />}
                </Flex>
              </CurrencySelectButton>
            </Flex>
          </LabelRow>
        </Container>
        {disabled && <Overlay />}
      </InputPanel>
    </Box>
  )
}
