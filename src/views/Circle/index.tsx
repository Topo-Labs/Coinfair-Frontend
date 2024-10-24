import styled from 'styled-components'
import { Image } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import useGoogleAnalysis from 'hooks/useGoogleAnalysis'
import Page from '../Page'
import MintNft from './components/MintNft'
import EarnPage from './EarnPage'

const ListWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  background: #fff;
  box-shadow: 
    2px 0px 10px #f0f0f0,   /* 右侧阴影 */
    -2px 0px 10px #f0f0f0,  /* 左侧阴影 */
    0px 2px 10px #f0f0f0,   /* 底部阴影 */
    0px -2px 10px #f0f0f0;  /* 顶部阴影 */
  padding: 20px 20px 0 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 20px;
  @media (min-width: 1200px) {
    max-width: 560px;
  }
`

export default function CircleList() {
  useGoogleAnalysis("Circle", "")

  return (
    <Page>
      <EarnPage/>
      {/* <ListWrapper>
        <MintNft/>
      </ListWrapper> */}
    </Page>
  )
}
