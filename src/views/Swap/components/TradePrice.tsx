import { Price } from '@pancakeswap/sdk'
import { Text, AutoRenewIcon } from '@pancakeswap/uikit'
import styled from "styled-components";
import { StyledBalanceMaxMini } from './styleds'
import NumberFormat from 'components/NumberFormat';

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

const StyledFormattedPrice = styled.div`
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
`

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`

  return (
    <Text style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      {show ? (
        <>
          <StyledFormattedPrice title={formattedPrice ?? '-'}>{formattedPrice ? <NumberFormat value={formattedPrice}/> : '-'}</StyledFormattedPrice>&nbsp;{label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <AutoRenewIcon width="14px" />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
