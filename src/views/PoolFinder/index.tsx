import { useCallback, useEffect, useState, useMemo } from 'react'
import { Currency, ETHER, JSBI, TokenAmount } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, AddIcon, useModal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import TreasuryABI from 'config/abi/Coinfair_Treasury.json'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import { CurrencyLogo } from '../../components/Logo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Layout/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair, useV3Pair } from '../../hooks/usePairs'
import { usePairAdder, usePairV3Adder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import { CommonBasesType } from '../../components/SearchModal/types'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 16px;
`

const AmmTypeBox = styled.div`
  display: flex;
  justify-content: center;
`

const AmmItem = styled.div`
  /* background: ; */
  border: 1px solid #000;
  cursor: pointer;
`

export default function PoolFinder() {
  const { account, library, chainId } = useWeb3React()
  const { t } = useTranslation()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  // const contract = useMemo(() => {
  //   if (!library || !account) return null
  //   return new Contract(TREASURY_ADDRESS[chainId], TreasuryABI, library.getSigner(account))
  // }, [library, account])

  // useEffect(() => {
  //   const callContractMethod = async () => {
  //     if (
  //       contract &&
  //       currency0?.address && // 确保 currency0 存在并且有 address
  //       currency1?.address // 确保 currency1 存在并且有 address
  //     ) {
  //       try {
  //         // 调用合约的方法
  //         const result = await contract.getPairManagement([currency0.address, currency1.address]);
  
  //         // 递归函数将嵌套数组中的 BigNumber 转换为字符串
  //         const convertToReadable = (data) => {
  //           if (Array.isArray(data)) {
  //             // 处理数组中的每个元素
  //             return data.map(convertToReadable);
  //           } else if (BigNumber.isBigNumber(data)) {
  //             // 将 BigNumber 转换为字符串
  //             return data.toString();
  //           }
  //           // 直接返回其他类型
  //           return data;
  //         };
  
  //         // 转换嵌套数组的所有 BigNumber 为字符串
  //         const readableResult = convertToReadable(result);
  
  //         // 打印转换后的结果
  //         console.log('Contract call result:', readableResult);
  //       } catch (error) {
  //         console.error('Error calling contract method:', error);
  //       }
  //     }
  //   };
  
  //   callContractMethod();
  // }, [contract, currency0?.address, currency1?.address]); // 依赖项改为地址

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const pairV3 = useV3Pair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  const addPairV3 = usePairV3Adder()
  // useEffect(() => {
  //   if (pair) {
  //     addPair(pair)
  //   }
  // }, [pair, addPair])

  useEffect(() => {
    if (pairV3?.length) {
      addPairV3(pairV3)
    }
  }, [pairV3?.length, addPairV3])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
      pair &&
      JSBI.equal(pair.reserve0.raw, BIG_INT_ZERO) &&
      JSBI.equal(pair.reserve1.raw, BIG_INT_ZERO),
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  // pairV3.map(pairItem => {  })

  // const positionV3 = 

  const pairV3Data = pairV3?.length && pairV3.map(pairItem => pairItem[1])
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, BIG_INT_ZERO))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
      </Text>
    </LightCard>
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      commonBasesType={CommonBasesType.LIQUIDITY}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Import Pool')} subtitle={t('Import an existing pool')} backTo="/liquidity" />
        <AutoColumn style={{ padding: '1rem' }} gap="md">
          <StyledButton
            endIcon={<ChevronDownIcon />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN0)
            }}
          >
            {currency0 ? (
              <Row>
                <CurrencyLogo currency={currency0} />
                <Text ml="8px">{currency0.symbol}</Text>
              </Row>
            ) : (
              <Text ml="8px">{t('Select a Token')}</Text>
            )}
          </StyledButton>

          <ColumnCenter>
            <AddIcon />
          </ColumnCenter>

          <StyledButton
            endIcon={<ChevronDownIcon />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN1)
            }}
          >
            {currency1 ? (
              <Row>
                <CurrencyLogo currency={currency1} />
                <Text ml="8px">{currency1.symbol}</Text>
              </Row>
            ) : (
              <Text as={Row}>{t('Select a Token')}</Text>
            )}
          </StyledButton>

          {
            // pairV3?.length && pairV3.map(pairItem => <MinimalPositionCard pair={pairItem[1]}/>)
            currency0 && currency1 ? (
              pairV3?.length ? (
                <>
                  <MinimalPositionCard pair={pairV3[0][1]} pairV3={pairV3Data} />
                  <Button as={NextLinkFromReactRouter} to="/liquidity" variant="secondary" width="100%">
                    {t('Manage these pools')}
                  </Button>
                </>
              ) : ''
            ) : prerequisiteMessage
          }

          {/* {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <>
                  <MinimalPositionCard pair={pair} />
                  <Button as={NextLinkFromReactRouter} to="/liquidity" variant="secondary" width="100%">
                    {t('Manage this pool')}
                  </Button>
                </>
              ) : (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text textAlign="center">{t('You don’t have liquidity in this pool yet.')}</Text>
                    <Button
                      as={NextLinkFromReactRouter}
                      to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                      variant="secondary"
                    >
                      {t('Add Liquidity')}
                    </Button>
                  </AutoColumn>
                </LightCard>
              )
            ) : validPairNoLiquidity ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">{t('No pool found.')}</Text>
                  <Button
                    as={NextLinkFromReactRouter}
                    to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                    variant="secondary"
                  >
                    {t('Create pool')}
                  </Button>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.INVALID ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center" fontWeight={500}>
                    {t('Invalid pair.')}
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.LOADING ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    {t('Loading')}
                    <Dots />
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : null
          ) : (
            prerequisiteMessage
          )} */}
        </AutoColumn>

        {/* <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        /> */}
      </AppBody>
    </Page>
  )
}
