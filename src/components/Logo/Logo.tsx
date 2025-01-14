import { useState } from 'react'
import { HelpIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const BAD_SRCS: { [imageSrc: string]: true } = {}

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcs: string[]
}

const DefaultCurrencyLogo = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #333333;
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  position: relative;
`

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: React.FC<React.PropsWithChildren<LogoProps>> = ({ srcs, alt, ...rest }) => {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s])
  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <DefaultCurrencyLogo>{alt.slice(0, 1)}</DefaultCurrencyLogo>
}

export default Logo
