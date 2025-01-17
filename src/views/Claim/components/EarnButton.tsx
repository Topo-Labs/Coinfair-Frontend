import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'

const EarnButtonStyles = styled.div`
  text-align: center;
  margin-bottom: 10px;
  span {
    display: inline-block;
    cursor: pointer;
    padding: 10px;
    white-space: nowrap;
    @media (max-width: 800px) {
      font-size: 14px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
`

const EarnButton = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const handleNavigation = () => {
    // @ts-ignore
    window.EarnTarget = 'airdrop-square'
    router.push({
      pathname: '/earn'
    })
  }

  return (
    <EarnButtonStyles>
      <span onClick={handleNavigation}>{t('Go to the airdrop square to claim tokens.')} 👉</span>
    </EarnButtonStyles>
  )
}

export default EarnButton
