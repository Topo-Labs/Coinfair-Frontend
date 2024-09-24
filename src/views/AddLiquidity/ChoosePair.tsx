import { Currency } from '@pancakeswap/sdk'
import styled from "styled-components";
import { Box, Text, AddIcon, CardBody, Button, CardFooter } from '@pancakeswap/uikit'
import { CurrencySelect } from 'components/CurrencySelect'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AppHeader } from '../../components/App'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'
import { CommonBasesType } from '../../components/SearchModal/types'
import { useAmmType } from "../../state/amm/hooks";
import { swapFormulaList } from '../../utils'

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #434B34 0%, #000 100%);
  border-radius: 28px;
`

export function ChoosePair({
  currencyA,
  currencyB,
  error,
  onNext,
}: {
  currencyA?: Currency
  currencyB?: Currency
  error?: string
  onNext?: () => void
}) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const isValid = !error
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  const ammType = useAmmType()
  return (
    <>
      <AppHeader
        title={t('Add Liquidity')}
        subtitle=''
        backTo="/liquidity"
      />
      <CardBody>
        <Box>
          <Text textTransform="uppercase" color="secondary" bold small pb="24px" style={{ fontSize: '12px', marginLeft: '10px' }}>
            {t('Choose a valid pair')}
          </Text>
          <FlexGap gap="12px">
            {/* <Text /> */}
            {/* <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{t('tokensIssued')}</Text> */}
            {/* <AddIcon color="textSubtle" /> */}
            {/* <Text style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{t('tokensRaised')}</Text> */}
          </FlexGap>
          <FlexGap gap="12px" style={{ marginLeft: '10px' }}>
            <div>
              <Text style={{ fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '15px' }}>{t('tokensIssued')}</Text>
              <CurrencySelect
                id="add-liquidity-select-tokena"
                selectedCurrency={currencyA}
                onCurrencySelect={handleCurrencyASelect}
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />
            </div>
            <AddIcon color="textSubtle" style={{ marginTop: '15px' }} />
            <div>
              <Text style={{ fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '15px' }}>{t('tokensRaised')}</Text>
              <CurrencySelect
                id="add-liquidity-select-tokenb"
                selectedCurrency={currencyB}
                onCurrencySelect={handleCurrencyBSelect}
                showCommonBases
                commonBasesType={CommonBasesType.LIQUIDITY}
              />
            </div>
          </FlexGap>
        </Box>
      </CardBody>
      <CardFooter>
        {/* exp diff */}
        {
          currencyA && currencyB ?
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
              <Text style={{ marginRight: '20px' }}>{swapFormulaList[ammType - 1].label}</Text>
              <Text>{swapFormulaList[ammType - 1].alias}</Text>
            </div> : null
        }
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <StyledButton
            data-test="choose-pair-next"
            width="100%"
            variant={!isValid ? 'danger' : 'primary'}
            onClick={onNext}
            style={{ marginTop: '10px' }}
            disabled={!isValid}
          >
            {error ?? t('Add Liquidity')}
          </StyledButton>
        )}
      </CardFooter>
    </>
  )
}
