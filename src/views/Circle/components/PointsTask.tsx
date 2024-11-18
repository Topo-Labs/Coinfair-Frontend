import React, { useState } from 'react';
import { useModal } from '@pancakeswap/uikit';
import { useTranslation } from '@pancakeswap/localization';
import { SwapSvg, MintSvg, NftSvg, XSvg, TGSvg } from 'components/Svg/Points';
import { Card, CardButton, CardContent, CardDescription, CardTitle } from './styles'
import MintNft from './MintNft';

const HoverCard = ({ content }: { content?: any }) => {

  const [strokeColor, setStrokeColor] = useState("black");
  const { t } =  useTranslation()
  const [onMintNftModal] = useModal(<MintNft/>)

  const renderIcon = (key: string) => {
    switch (key) {
      case 'swap':
        return <SwapSvg stroke={strokeColor} />

      case 'mint':
        return <MintSvg stroke={strokeColor} />

      case 'claim':
        return <NftSvg stroke={strokeColor} />

      case 'X':
        return <XSvg stroke={strokeColor} />

      case 'TG':
        return <TGSvg stroke={strokeColor} />
    
      default:
        return ''
    }
  }

  const onTask = (link: string) => {
    if (link === 'swap') {
      window.location.href = `/${link}`
    } else if (link === 'mint') {
      onMintNftModal()
    } else if (link.includes('http')) {
      window.open(link)
    }
  }

  return (
  <Card 
    style={ !content ? { opacity: 0, zIndex: -1 } : {}}
    onMouseEnter={() => setStrokeColor("#fff")}
    onMouseLeave={() => setStrokeColor("#000")}
  >
    <CardContent>
      <>
        <CardTitle>{t(content?.title)}{renderIcon(content?.key)}</CardTitle>
        <CardDescription>{t(content?.desc)}</CardDescription>
      </>
      {
        content?.link === 'claim' ?
        t(content?.linkWords)
        :
        <CardButton onClick={() => onTask(content?.link)}>{t(content?.linkWords)}</CardButton>
      }
    </CardContent>
  </Card>
  )
}

export default HoverCard;
