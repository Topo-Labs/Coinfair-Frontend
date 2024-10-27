import { Button } from '@pancakeswap/uikit';
import styled, { useTheme } from 'styled-components';

export const EarnContainer = styled.div`
  padding: 0 100px;
  padding-top: 100px;
  width: 100%;
`

export const EarnTips = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const EarnTipRight = styled.div`
  margin-left: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const EarnTipIcon = styled.div`
  font-size: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const EarnTipWords = styled.div`
  font-size: 38px;
  font-weight: 900;
  line-height: 45px;
`

export const EarnTipGreen = styled.span`
  font-size: 28px;
  font-weight: 900;
  color: #0DAE6F;
  line-height: 45px;
`

export const EarnStep = styled.div`
  display: flex;
  margin-top: 100px;
`

export const EarnStepItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  margin-right: 25px;
  padding: 30px;
  box-shadow: 0 1px 3px 0 #EDEDED;
  border-radius: 16px;
  color: #CCCCCC;
  transition: all .3s ease;
  &:hover {
    box-shadow: 0 6px 16px 4px #EDEDED;
  }
  &:last-child {
    margin-right: 0;
  }
`

export const EarnStepItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 900;
`

export const EarnStepItemBottom = styled.div`
  display: flex;
  flex-direction: column;
`

export const EarnStepItemIcon = styled.div`
  font-size: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const EarnStepItemWords = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  color: #000000;
  margin: 20px 0;
`

export const EarnStepShareLink = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  color: #FAFAFA;
  border: 1px solid #EDEDED;
  margin: 20px 0 30px 0;
`

export const EarnStepItemButton = styled(Button)`
  width: 100%;
  background: linear-gradient(90deg, #434B34 0%, #000 100%);
`

export const EarnStepItemToScroll = styled(Button)`
  width: 100%;
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  transition: all .3s ease;
  &:hover {
    background: #000000;
    opacity: 1;
    color: #ffffff;
  }
`

export const EarnClaimTable = styled.div`
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px 0 #EDEDED;
  margin-top: 40px;
`

export const EarnClaimTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const EarnTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: #000000;
  line-height: 24px;
`

export const EarnClaimImport = styled(Button)`
  display: flex;
  align-items: center;
  height: fit-content;
  padding: 8px 12px;
  border: 1px solid #000000;
  background: #ffffff;
  color: #000000;
  transition: all .3s ease;
  &:hover {
    opacity: 1;
    background: #000000;
    color: #ffffff
  }
`

export const EarnClaimTHead = styled.div`
  display: flex;
  margin-bottom: 15px;
`

export const EarnTBody = styled.div`
  display: flex;
  flex-direction: column;
`

export const EarnNoData = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #DDDDDD;
  font-size: 18px;
  font-weight: 800;
`

export const EarnNoDataIcon = styled(EarnStepItemIcon)`
  margin-bottom: 10px;
`

export const EarnTName = styled.span`
  flex: 1;
  display: flex;
  font-size: 14px;
  color: #666666;
`

export const EarnTOpration = styled.span`
  font-size: 14px;
  color: #666666;
  display: flex;
  justify-content: flex-end;
  width: 8%;
`

export const EarnClaimTItem = styled.div`
  display: flex;
  padding: 9px 0;
  border-radius: 4px;
  transition: all .3s ease;
  :hover {
    background: #f6f6f6;
  }
`

export const EarnTokenInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
`

export const EarnTokenIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  margin-right: 12px;
  border-radius: 100%;
  overflow: hidden;
`

export const EarnTokenNoLogo = styled.div`
  display: flex;
  background: #333333;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  color: #ffffff;
  width: 30px;
  height: 30px;
  font-size: 14px;
  font-weight: 900;
`

export const EarnAmount = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  color: #000;
  font-size: 18px;
  font-weight: 500;
`

export const EarnClaimAmount = styled(EarnAmount)`
  color: #0DAE6F;
  flex: 1;
`

export const EarnClaimLast = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 8%;
`

export const EarnClaimButton = styled(Button)`
  width: 65px;
  height: 30px;
  color: #ffffff;
  padding: 0;
  background: #0DAE6F;
  font-size: 14px;
`

export const EarnMiddleBox = styled.div`
  display: flex;
`

export const EarnHistory = styled.div`
  flex: 1;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px 0 #EDEDED;
  margin-top: 40px;
  margin-right: 27px;
  &:last-child {
    margin-right: 0;
  }
`

export const EarnHistoryTHead = styled(EarnClaimTHead)`
  margin-top: 25px;
`

export const EarnHistoryValue = styled.span`
  
`

export const EarnFAQ = styled.div`
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px 0 #EDEDED;
  margin-top: 40px;
`

export const EarnFAQItem = styled.div`
  border-top: 1px solid #EDEDED;
`

export const Circle = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  /* overflow: hidden; */
  background: #000;
  @media (min-width: 1200px) {
    max-width: 560px;
  }
`;

export const CircleMain = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: #000;
  border-radius: 20px;
  @media (min-width: 1200px) {
    min-width: 560px;
  }
`;

export const CircleHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CircleTitle = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: 600;
`;

export const CircleNftMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  & p{
    margin-top: 40px;
  }
`;

export const CircleNft = styled.div`
  width: fit-content;
  border-radius: 16px;
  background: #EEEEEE;
  /* box-shadow: 0 0 15px 10px #27272B; */
`;

export const NftMessage = styled.div`
  padding: 10px 5px;
`;

export const NftTotal = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const NftRemain = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

export const CopyMain = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CopyLink = styled.span`
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  margin-top: 5px;
`;

export const CopyBtn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

export const CircleImg = styled.img`
  border-radius: 16px;
`;

export const CircleHistoryContent = styled.div`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: all .3s ease;
  padding: 20px 0;
`;

export const CircleContent = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const CirclePeopleCount = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 13px;
  margin-bottom: 285px;
  font-size: 16px;
`;

export const CircleContentPeople = styled.div`
  color: #fff;
  font-size: 20px;
`;

export const CircleContentPeopleRange = styled.div`
  color: #666666;
  font-size: 14px;
`;

export const MintAmount = styled.input`
  background-color: #f0f0f0;
  border: 0;
  outline: 0;
  color: #000;
  width: 100%;
`;

export const CircleMint = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .3s ease;
  border-radius: 4px;
  padding: 15px 0;
  cursor: pointer;
  font-size: 18px;
  background: linear-gradient(90deg, #434B34 0%, #000 100%);
  border-radius: 28px;
  margin-bottom: 30px;
`;

export const Tooltip = styled.div<{
  isTooltipDisplayed: boolean
  tooltipTop: number
  tooltipRight: number
  tooltipFontSize?: number
}>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline' : 'none')};
  position: absolute;
  padding: 8px;
  top: ${({ tooltipTop }) => `${tooltipTop}px`};
  right: ${({ tooltipRight }) => (tooltipRight ? `${tooltipRight}px` : 0)};
  text-align: center;
  font-size: ${({ tooltipFontSize }) => `${tooltipFontSize}px` ?? '100%'};
  background-color: ${({ theme }) => theme.colors.contrast};
  color: #fff;
  border-radius: 16px;
  opacity: 0.7;
  width: max-content;
  font-size: 12px
`