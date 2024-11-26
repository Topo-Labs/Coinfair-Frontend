import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from '@pancakeswap/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    /* font-family: 'Kanit', sans-serif; */
    /* font-family: 'Inter'; */
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 12px;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
    #okx-inject {
      display: none !important;
    }
  }
`

export default GlobalStyle
