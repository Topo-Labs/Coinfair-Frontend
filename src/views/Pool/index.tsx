import { useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon, ArrowBackIcon, IconButton } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@web3-react/core'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator, useTokenBalanceV3 } from '../../state/wallet/hooks'
import { usePairs, PairState, useV3Pairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #434B34 0%, #000000 100%);
  border-radius: 28px;
`

const TextCenter = styled.div`
  text-align: center;
  margin-bottom: 4px;
`

export default function Pool() {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const theme = useTheme()
  const [isTimedOut, setIsTimedOut] = useState(false)

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsV3 = useV3Pairs(trackedTokenPairs)

  const filteredPairs = tokenPairsV3.map(
    secondLevelArray => 
      secondLevelArray.filter(
        thirdLevelArray => thirdLevelArray[1]
      ).map(
        thirdLevelArray => thirdLevelArray[1]
      )
  ).flat();

  const v2IsLoading = filteredPairs?.length === 0

  useEffect(() => {
    const timer = setTimeout(() => {
      if (v2IsLoading) {
        setIsTimedOut(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [v2IsLoading])

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading && !isTimedOut) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (filteredPairs?.length > 0) {
      return (
        filteredPairs.map((pairItem, i) =>
          <FullPositionCard
            pair={pairItem}
            mb={i < filteredPairs.length - 1 ? '16px' : 0}
          />
        )
      )
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
        <Body
        >
          {renderBody()}
          {account && (
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
