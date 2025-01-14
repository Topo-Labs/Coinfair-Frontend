import { Box, Flex } from '@pancakeswap/uikit'
import styled, { keyframes } from 'styled-components'

const floatAnimation = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(2px, -20px); }
  100% { transform: translate(0, 0); }
`;

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 0px;
  /* box-shadow: 2px 2px 10px #eeeeee; */
  border-radius: 20px;
  /* overflow: hidden; */

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    ${({ $isChartExpanded }) => ($isChartExpanded ? 'padding: 0 120px' : 'padding: 0 40px')};
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 358px;
  border-radius: 20px;
`

export const Slogen = styled.div<{currentLanguage: boolean}>`
  display: flex;
  flex-direction: ${({ currentLanguage }) => (currentLanguage ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
  margin-top: ${({ currentLanguage }) => (currentLanguage ? '80px' : '50px')};
  margin-bottom: ${({ currentLanguage }) => (currentLanguage ? '50px' : '20px')};
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const SlogenLine = styled.div`
  font-size: 48px;
  font-weight: 900;
  line-height: 60px;
  white-space: nowrap;
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const Coin = styled.div`
  border-radius: 100%;
  box-shadow: 0 4px 8px 1px #f2f2f2;
  background: #fff;
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const BTC = styled(Coin)`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 20%;
  top: 30%;
  animation: ${floatAnimation} 4s ease-in-out infinite;
  animation-delay: ${Math.random()}s;
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const USDC = styled(Coin)`
  width: 54px;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 10%;
  top: 50%;
  animation: ${floatAnimation} 4.5s ease-in-out infinite;
  animation-delay: ${Math.random()}s;
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const Binance = styled(Coin)`
  width: 68px;
  height: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 25%;
  top: 70%;
  animation: ${floatAnimation} 5s ease-in-out infinite;
  animation-delay: ${Math.random()}s;
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const ETH = styled(Coin)`
  width: 82px;
  height: 82px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20%;
  top: 30%;
  animation: ${floatAnimation} 4.3s ease-in-out infinite;
  animation-delay: ${Math.random()}s;
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const USDT = styled(Coin)`
  width: 54px;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10%;
  top: 50%;
  animation: ${floatAnimation} 4.8s ease-in-out infinite;
  animation-delay: ${Math.random()}s;
  @media screen and (max-width: 968px) {
    display: none;
  }
`

export const ADA = styled(Coin)`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20%;
  top: 75%;
  animation: ${floatAnimation} 5.2s ease-in-out infinite;
  animation-delay: ${Math.random()}s;
  @media screen and (max-width: 968px) {
    display: none;
  }
`
