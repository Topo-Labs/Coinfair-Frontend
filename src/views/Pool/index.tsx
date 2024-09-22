import { useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, ArrowBackIcon, IconButton } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@web3-react/core'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import { Contract } from '@ethersproject/contracts'
import { TREASURY_ADDRESS } from 'config/constants/exchange'
import TreasuryABI from 'config/abi/Coinfair_Treasury.json'
import { BigNumber } from '@ethersproject/bignumber'
import { Token } from '@pancakeswap/sdk'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #434B34 0%, #000 100%);
  border-radius: 28px;
`

const TextCenter = styled.div`
  text-align: center;
  margin-bottom: 4px;
`

const poolTypes = [1, 2, 3, 4, 5];
const feeTypes = [1, 3, 5, 10];

export default function Pool() {
  const { account, chainId, library } = useWeb3React()
  const { t } = useTranslation()
  const theme = useTheme()
  const [pairV2Tokens, setPairV2Tokens] = useState<any>([])

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )

  const contract = useMemo(() => {
    if (!library || !account) return null
    return new Contract(TREASURY_ADDRESS[chainId], TreasuryABI, library.getSigner(account))
  }, [library, account])
  // console.log(tokenPairsWithLiquidityTokens, 'tokenPairsWithLiquidityTokens')

  const callContractMethod = async (tokens: any[]) => {
    if (contract && tokens) {
      try {
        // 调用合约的方法
        const result = await contract.getPairManagement([tokens[0].address, tokens[1].address], account);
        // 递归函数将嵌套数组中的 BigNumber 转换为字符串
        const convertToReadable = (data) => {
          if (Array.isArray(data)) {
            // 处理数组中的每个元素
            return data.map(convertToReadable);
          } else if (BigNumber.isBigNumber(data)) {
            // 将 BigNumber 转换为字符串
            return data.toString();
          }
          // 直接返回其他类型
          return data;
        };

        // 转换嵌套数组的所有 BigNumber 为字符串
        const readableResult = convertToReadable(result);
        return readableResult;
      } catch (error) {
        console.error('Error calling contract method:', error);
        return [];
      }
    }
  };

  // 假设 callContractMethod 是一个返回 Promise<Array> 或包含长度的异步函数
  async function getFilteredPairs() {
    // 等待所有 callContractMethod 调用完成，并获取每个结果
    const results = await Promise.all(
      trackedTokenPairs.map(async (tokens) => {
        const result = await callContractMethod(tokens); // 调用异步函数
        return { tokens, result }; // 返回 tokens 和 result
      })
    );
  
    // 筛选出 result 存在且长度不为空的对象
    const filteredPairs = results
      .filter(({ result }) => result && result.length > 0) // 过滤出 result 存在且长度不为空的项
      .map(({ result, tokens }) => ({
        liquidityToken: {
          address: result[0][0], // 假设 result[0] 是地址
          chainId: tokens[0]?.chainId || 204, // 从 tokens 中获取 chainId 或设置默认值
          decimals: 18,
          name: 'EquitySwap LPs',
          symbol: 'PE-LP',
        },
        tokens,
      })); // 返回包含 liquidityToken 和 tokens 的对象
      console.log(filteredPairs, 'filteredPairsfilteredPairs')
    return filteredPairs; // 返回筛选后的列表
  }
  
  // 主逻辑函数，用于获取并返回值
  async function main() {
    const filteredPairs = await getFilteredPairs(); // 使用 await 获取结果
    console.log('筛选后的最终值:', filteredPairs);
    return filteredPairs; // 返回筛选后的值
  }
  useEffect(() => {
    async function fetchLiquidityTokens() {
      const tokens = await main(); // 调用 main 并等待其结果
      setPairV2Tokens(tokens); // 更新状态
    }
    fetchLiquidityTokens()
  }, [])

  console.log(pairV2Tokens, 'pairV2TokenspairV2TokenspairV2Tokens')

  const newPairV2Tokens = useMemo(
    () => pairV2Tokens.map((tpwlt) => tpwlt.liquidityToken),
    [pairV2Tokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    newPairV2Tokens,
  )

  console.log(v2PairsBalances, 'v2PairsBalancesv2PairsBalances')

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      pairV2Tokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [pairV2Tokens, v2PairsBalances],
  )
  console.log(liquidityTokensWithBalances)
  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  console.log(v2Pairs, 'v2的pairs')
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }
  const [isAddWhitelist, setIsAddWhitelist] = useState(false)
  const [isAddWiteListSuccess, setIsAddWiteListSuccess] = useState(false)
  const [isMore, setMore] = useState(false)
  const [whiteListInfo, setWhiteListInfo] = useState({
    whiteListAddress: '',
    contractAddress: '',
  })

  return !isAddWhitelist ? (
    <Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle="" />
        {/* <Text color={theme.colors.contrast} p={[0, 17]} fontSize="12px">
          <TextCenter>{t('liquidityTitle')}</TextCenter>
          {t('liquidityText1')}
          <br />
          {t('liquidityText2')}
          <br />
          {t('liquidityText3')}
          <br />
          {
            isMore ?
              <>
                {t('liquidityText4')}
                <br />
                {t('liquidityText5')}
                <br />
                {t('liquidityText6')}
                <br />
                {t('liquidityText7')}
              </> : null
          }
          <div role="button" tabIndex="0" onKeyDown={() => { setMore(!isMore) }} style={{ zoom: '0.96', color: '#5c53d3', cursor: 'pointer', textAlign: 'right' }} onClick={() => { setMore(!isMore) }}>{isMore ? t('hide') : t('more')}</div>
        </Text> */}
        <Body
        >
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Link href="/find" passHref>
                <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                  {t('Find other LP tokens')}
                </Button>
              </Link>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Link href="/add" passHref>
            <StyledButton
              id="join-pool-button"
              width="100%"
              startIcon={<AddIcon color="white" />}
            >
              {t('Add Liquidity')}
            </StyledButton>
          </Link>
          {/* <Link href="/whitelist" passHref>
            <StyledButton id="join-pool-button" width="100%" style={{ background: 'transparent', boxShadow: 'unset', color: '#5c53d3', marginTop: '16px' }}>
              {t('addWhitelist')}
            </StyledButton>
          </Link> */}
        </CardFooter>
      </AppBody>
    </Page>
  ) : (
    <Page>
      <AppBody>
        <div
          style={{
            padding: '0 17px',
            marginBottom: '15px',
          }}
        >
          <div style={{ padding: '22px 0 14px 0' }}>
            <IconButton
              as="a"
              scale="sm"
              onClick={() => {
                setIsAddWhitelist(false)
              }}
            >
              <ArrowBackIcon width="22px" />
            </IconButton>
          </div>
          {/* <div
            style={{
              fontFamily: 'Inter',
              fontSize: '12px',
              fontStyle: 'normal',
              lineHeight: '15px',
              color: '#111526',
            }}
          >
            <TextCenter>{t('liquidityTitle')}</TextCenter>
            {t('liquidityText1')}
            <br />
            {t('liquidityText2')}
            <br />
            {t('liquidityText3')}
            <br />
            {t('liquidityText4')}
            <br />
            {
              isMore ?
                <>
                  {t('liquidityText5')}
                  <br />
                  {t('liquidityText6')}
                  <br />
                  {t('liquidityText7')}
                </> : null
            }
            <div role="button" tabIndex="0" onKeyDown={() => { setMore(!isMore) }} style={{ zoom: '0.96', color: '#5c53d3', cursor: 'pointer', textAlign: 'right' }} onClick={() => { setMore(!isMore) }}>{isMore ? t('hide') : t('more')}</div>
          </div> */}
        </div>
        <div
          style={{
            padding: '0 15px',
          }}
        >
          <div
            style={{
              color: '#333333',
              fontSize: '12px',
              fontWeight: '500',
              lineHeight: '15px',
              marginTop: '40px',
            }}
          >
            <div>{t('whitelistAddress')}</div>
            {!isAddWiteListSuccess ? (
              <div
                style={{
                  background: '#E8F3FF',
                  border: '1px solid #000000',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  marginTop: '10px',
                  height: '65px',
                }}
              >
                <textarea
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    lineHeight: '17px',
                  }}
                  onChange={(e) => {
                    setWhiteListInfo({
                      whiteListAddress: e.target.value,
                      contractAddress: whiteListInfo.contractAddress,
                    })
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '12px',
                  padding: '10px 0px',
                  marginTop: '10px',
                  wordBreak: 'break-all',
                }}
              >
                {whiteListInfo.whiteListAddress}
              </div>
            )}
          </div>
          <div
            style={{
              color: '#333333',
              fontSize: '12px',
              fontWeight: '500',
              lineHeight: '15px',
              marginTop: '24px',
              marginBottom: '30px',
            }}
          >
            <div>{t('tokenContractAddress')}</div>
            {!isAddWiteListSuccess ? (
              <div
                style={{
                  background: '#E8F3FF',
                  border: '1px solid #000000',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  marginTop: '10px',
                  height: '65px',
                }}
              >
                <textarea
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    lineHeight: '17px',
                  }}
                  onChange={(e) => {
                    setWhiteListInfo({
                      whiteListAddress: whiteListInfo.whiteListAddress,
                      contractAddress: e.target.value,
                    })
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '12px',
                  padding: '10px 0px',
                  marginTop: '10px',
                  wordBreak: 'break-all',
                }}
              >
                {whiteListInfo.whiteListAddress}
              </div>
            )}
            {/* {!isAddWiteListSuccess && (
              <div
                style={{
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '15px',
                  color: '#AAAAAA',
                  marginTop: '5px',
                }}
              >
                {t('tokenIssuerText')}
              </div>
            )} */}
          </div>
        </div>
        <CardFooter style={{ textAlign: 'center' }}>
          {!isAddWiteListSuccess ? (
            <Button
              id="join-pool-button"
              width="100%"
              style={{ background: '#111526' }}
              onClick={() => {
                setIsAddWiteListSuccess(true)
              }}
            >
              {t('suppy10U')}
            </Button>
          ) : (
            <>
              <Link href="/add" passHref>
                <Button
                  id="join-pool-button"
                  width="100%"
                  style={{ background: '#111526' }}
                  startIcon={<AddIcon color="white" />}
                >
                  {t('Add Liquidity')}
                </Button>
              </Link>
              <Button
                id="join-pool-button"
                width="100%"
                style={{ background: 'white', color: 'black', marginTop: '10px', boxShadow: 'none' }}
                onClick={() => {
                  setIsAddWiteListSuccess(false)
                  setWhiteListInfo({
                    whiteListAddress: '',
                    contractAddress: '',
                  })
                }}
              >
                {t('addMoreWhitelist')}
              </Button>
            </>
          )}
        </CardFooter>
      </AppBody>
    </Page>
  )
}
