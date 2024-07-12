import styled from 'styled-components'
import {
  Flex,
  Heading,
  HistoryIcon,
  NotificationDot,
  IconButton,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import { GlobalSettings } from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
import useTheme from 'hooks/useTheme'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'

interface Props {
  title: string
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const ChartImg = styled.img`
  width: 28px;
  height: 30px;
  cursor: pointer;
  position: relative;
  bottom: 1px;
`

const CharIcon = styled.span`
  cursor: pointer;
  position: relative;
  bottom: 1px;
`

const CurrencyInputContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
`

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  subtitle,
  setIsChartDisplayed,
  isChartDisplayed,
  hasAmount,
  onRefreshPrice,
}) => {
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const { isDark } = useTheme()
  const getStrokeColor = () => isDark ? "#FFFFFF" : "#333333";
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])
  const router = useRouter()
  return (
    <CurrencyInputContainer>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        {/* {setIsChartDisplayed && (
          <ColoredIconButton onClick={toggleChartDisplayed} variant="text" scale="sm">
            {isChartDisplayed ? <ChartDisableIcon color="textSubtle" /> : <ChartIcon width="24px" color="textSubtle" />}
          </ColoredIconButton>
        )} */}
        <Flex flexDirection="column" alignItems="flex-start" width="100%" mr={0}>
          <Heading as="h2">{title}</Heading>
          <Text color="textSubtle" fontSize="14px">
            {subtitle}
          </Text>
        </Flex>
        <Flex>
          <IconButton variant="text" scale="sm">
            <CharIcon>
              <svg className="icon" width="18px" height="18px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M874.666667 277.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v448a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334a85.333333 85.333333 0 0 1-85.333333-85.333333V362.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h85.333334zM554.666667 128a85.333333 85.333333 0 0 1 85.333333 85.333333v597.333334a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334zM234.666667 490.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v234.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H149.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V576a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334z m640-149.333334h-85.333334a21.333333 21.333333 0 0 0-21.184 18.837334L768 362.666667v448a21.333333 21.333333 0 0 0 18.837333 21.184L789.333333 832h85.333334a21.333333 21.333333 0 0 0 21.184-18.837333L896 810.666667V362.666667a21.333333 21.333333 0 0 0-18.837333-21.184L874.666667 341.333333zM554.666667 192h-85.333334a21.333333 21.333333 0 0 0-21.184 18.837333L448 213.333333v597.333334a21.333333 21.333333 0 0 0 18.837333 21.184L469.333333 832h85.333334a21.333333 21.333333 0 0 0 21.184-18.837333L576 810.666667V213.333333a21.333333 21.333333 0 0 0-18.837333-21.184L554.666667 192zM234.666667 554.666667H149.333333a21.333333 21.333333 0 0 0-21.184 18.837333L128 576v234.666667a21.333333 21.333333 0 0 0 18.837333 21.184L149.333333 832h85.333334a21.333333 21.333333 0 0 0 21.184-18.837333L256 810.666667V576a21.333333 21.333333 0 0 0-18.837333-21.184L234.666667 554.666667z" fill="#333333" /></svg>
            </CharIcon>
            {/* <ChartImg onClick={() => router.push('/trading-view')} src='/images/kchart.png' alt='gg' /> */}
          </IconButton>
          <NotificationDot show={expertMode}>
            <GlobalSettings color={getStrokeColor()} mr="0" mode={SettingsMode.SWAP_LIQUIDITY} />
          </NotificationDot>
          <IconButton mt='-1px' onClick={onPresentTransactionsModal} variant="text" scale="sm">
            <HistoryIcon width="18px" stroke={getStrokeColor()} />
          </IconButton>
          <IconButton mt='-1px' variant="text" scale="sm" onClick={handleOnClick}>
            <RefreshIcon disabled={!hasAmount} width="20px" stroke={getStrokeColor()} />
          </IconButton>
        </Flex >
      </Flex >
      {/* <Flex alignItems="center">
        <Text color="textSubtle" fontSize="14px">
          {subtitle}
        </Text>
      </Flex> */}
    </CurrencyInputContainer >
  )
}

export default CurrencyInputHeader
