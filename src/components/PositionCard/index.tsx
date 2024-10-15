import { useState } from 'react'
import { JSBI, Pair, PairV3, Percent } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ChevronUpIcon,
  ChevronDownIcon,
  Card,
  CardBody,
  Flex,
  CardProps,
  AddIcon,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@pancakeswap/localization'
import { useTotalSupply, useTotalSupplyV3 } from 'hooks/useTotalSupply'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useWeb3React } from '@web3-react/core'
import { BIG_INT_ZERO } from 'config/constants/exchange'

import { useTokenBalance, useTokenBalanceV3 } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'
import Dots from '../Loader/Dots'
import { formatAmount } from '../../utils/formatInfoNumbers'
import { useLPApr } from '../../state/swap/hooks'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

interface PositionCardProps extends CardProps {
  pair?: Pair
  pairV3?: PairV3[]
  showUnwrapped?: boolean
}

const useLPValues = (account, pair, currency0, currency1) => {
  const token0Price = useBUSDPrice(currency0)
  const token1Price = useBUSDPrice(currency1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined]

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
      : null
  const totalUSDValue = token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null

  return { token0Deposited, token1Deposited, totalUSDValue, poolTokenPercentage, userPoolBalance }
}

const useLPV3Values = (account, pairs, currency0, currency1) => {
  const token0Price = useBUSDPrice(currency0);
  const token1Price = useBUSDPrice(currency1);

  // 使用自定义 Hook 获取用户的池余额
  const userPoolBalances = useTokenBalanceV3(account, pairs);

  const totalPoolTokensArr = useTotalSupplyV3(pairs);

  const poolTokenPercentages = pairs.map((pair, index) => {
    const userPoolBalance = userPoolBalances[index];
    const totalPoolTokens = totalPoolTokensArr[index];

    return !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;
  });

  const tokenDeposits = pairs.map((pair, index) => {
    const userPoolBalance = userPoolBalances[index];
    const totalPoolTokens = totalPoolTokensArr[index];

    return !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];
  });

  const tokenUSDValues = tokenDeposits.map(([token0Deposited, token1Deposited], index) => {
    const token0USDValue =
      token0Deposited && token0Price
        ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
        : null;
    const token1USDValue =
      token1Deposited && token1Price
        ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
        : null;

    const totalUSDValue = token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null;

    return { token0USDValue, token1USDValue, totalUSDValue };
  });

  return {
    token0DepositedV3: tokenDeposits.map(([token0]) => token0),
    token1DepositedV3: tokenDeposits.map(([_, token1]) => token1),
    totalUSDValuesV3: tokenUSDValues.map(({ totalUSDValue }) => totalUSDValue),
    poolTokenPercentagesV3: poolTokenPercentages,
    userPoolBalancesV3: userPoolBalances
  };
};

export function MinimalPositionCard({ pair, pairV3, showUnwrapped = false }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )
  const currency0 = showUnwrapped ? pairV3[0].token0 : unwrappedToken(pairV3[0].token0)
  const currency1 = showUnwrapped ? pairV3[0].token1 : unwrappedToken(pairV3[0].token1)

  const { totalUSDValuesV3, poolTokenPercentagesV3, token0DepositedV3, token1DepositedV3, userPoolBalancesV3 } = useLPV3Values(
    account,
    pairV3,
    currency0,
    currency1,
  )

  return (
    <>
      {userPoolBalancesV3?.length && userPoolBalancesV3?.every(item => item?.toSignificant(4) !== '0') ? (
        <>
          {
            userPoolBalancesV3.map((userPoolBalance, index) => {
              const totalUSDValue = totalUSDValuesV3[index];
              const poolTokenPercentage = poolTokenPercentagesV3[index];
              const token0Deposited = token0DepositedV3[index];
              const token1Deposited = token1DepositedV3[index];
      
              return (
                <Card key={userPoolBalance?.token?.address}>
                  <CardBody>
                    <AutoColumn gap="16px">
                      <FixedHeightRow>
                        <RowFixed>
                          <Text color="secondary" bold>
                            {t('LP tokens in your wallet')}
                          </Text>
                        </RowFixed>
                      </FixedHeightRow>
                      <FixedHeightRow>
                        <RowFixed>
                          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                          <Text small color="textSubtle">
                            {currency0.symbol}-{currency1.symbol} LP
                          </Text>
                        </RowFixed>
                        <RowFixed>
                          <Flex flexDirection="column" alignItems="flex-end">
                            <Text>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                            {Number.isFinite(totalUSDValue) && (
                              <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })} USD)`}</Text>
                            )}
                          </Flex>
                        </RowFixed>
                      </FixedHeightRow>
                      <AutoColumn gap="4px">
                        {poolData && (
                          <FixedHeightRow>
                            <TooltipText ref={targetRef} color="textSubtle" small>
                              {t('LP reward APR')}:
                            </TooltipText>
                            {tooltipVisible && tooltip}
                            <Text>{formatAmount(poolData.lpApr7d)}%</Text>
                          </FixedHeightRow>
                        )}
                        <FixedHeightRow>
                          <Text color="textSubtle" small>
                            {t('Share of Pool')}:
                          </Text>
                          <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                        </FixedHeightRow>
                        <FixedHeightRow>
                          <Text color="textSubtle" small>
                            {t('Pooled %asset%', { asset: currency0.symbol })}:
                          </Text>
                          {token0Deposited ? (
                            <RowFixed>
                              <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
                            </RowFixed>
                          ) : (
                            '-'
                          )}
                        </FixedHeightRow>
                        <FixedHeightRow>
                          <Text color="textSubtle" small>
                            {t('Pooled %asset%', { asset: currency1.symbol })}:
                          </Text>
                          {token1Deposited ? (
                            <RowFixed>
                              <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
                            </RowFixed>
                          ) : (
                            '-'
                          )}
                        </FixedHeightRow>
                      </AutoColumn>
                    </AutoColumn>
                  </CardBody>
                </Card>
              );
            })
          }
          <Button as={NextLinkFromReactRouter} to="/liquidity" variant="secondary" width="100%">
            {t('Manage these pools')}
          </Button>
        </>
      ) : (
        // 可选的空状态显示逻辑
        ''
      )}
    </>
  );  
}

export default function FullPositionCard({ pair, pairV3, ...props }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )
  const [showMore, setShowMore] = useState(false)

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const { totalUSDValue, poolTokenPercentage, token0Deposited, token1Deposited, userPoolBalance } = useLPValues(
    account,
    pair,
    currency0,
    currency1,
  )

  return (
    <Card {...props}>
      <Flex justifyContent="space-between" role="button" onClick={() => setShowMore(!showMore)} p="16px">
        <Flex flexDirection="column">
          <Flex alignItems="center" mb="4px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text bold ml="8px">
              {!currency0 || !currency1 ? <Dots>{t('Loading')}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>
          <Text fontSize="14px" color="textSubtle">
            {userPoolBalance?.toSignificant(4)}
          </Text>
          {Number.isFinite(totalUSDValue) && (
            <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} USD)`}</Text>
          )}
        </Flex>
        {showMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Flex>

      {showMore && (
        <AutoColumn gap="8px" style={{ padding: '16px' }}>
          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency0} />
              <Text color="textSubtle" ml="4px">
                {t('Pooled %asset%', { asset: currency0.symbol })}:
              </Text>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed>
                <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency1} />
              <Text color="textSubtle" ml="4px">
                {t('Pooled %asset%', { asset: currency1.symbol })}:
              </Text>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed>
                <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          {poolData && (
            <FixedHeightRow>
              <RowFixed>
                <TooltipText ref={targetRef} color="textSubtle">
                  {t('LP reward APR')}:
                </TooltipText>
                {tooltipVisible && tooltip}
              </RowFixed>
              <Text>{formatAmount(poolData.lpApr7d)}%</Text>
            </FixedHeightRow>
          )}

          <FixedHeightRow>
            <Text color="textSubtle">{t('Share of Pool')}</Text>
            <Text>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
            <Flex flexDirection="column">
              <Button
                as={NextLinkFromReactRouter}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="primary"
                width="100%"
                mb="8px"
              >
                {t('Remove')}
              </Button>
              <Button
                as={NextLinkFromReactRouter}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}?step=1`}
                variant="text"
                startIcon={<AddIcon color="primary" />}
                width="100%"
              >
                {t('Add liquidity instead')}
              </Button>
            </Flex>
          )}
        </AutoColumn>
      )}
    </Card>
  )
}
