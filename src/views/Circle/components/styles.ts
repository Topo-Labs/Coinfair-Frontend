import { Button } from '@pancakeswap/uikit';
import styled from 'styled-components';

export const EarnContainer = styled.div`
  padding: 0 100px;
  padding-top: 100px;
  width: 100%;
  @media screen and (max-width: 1200px) {
    padding: 0;
    /* overflow-x: hidden; */
  }
`

export const EarnTips = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  @media screen and (max-width: 1200px) {
    margin: 1rem 0;
  }
`

export const EarnTipRight = styled.div`
  margin-left: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 1200px) {
    margin-left: 1rem;
  }
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
  @media screen and (max-width: 1200px) {
    font-size: 25px;
    line-height: 25px;
  }
`

export const EarnTipGreen = styled.span`
  font-size: 38px;
  font-weight: 900;
  color: #0DAE6F;
  line-height: 45px;
  @media screen and (max-width: 1200px) {
    font-size: 25px;
    line-height: 25px;
  }
`

export const EarnStep = styled.div`
  display: flex;
  margin-top: 100px;
  @media screen and (max-width: 1200px) {
    margin-top: 20px;
  }
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 20px;
  font-weight: 900;
  color: #CCCCCC;
`

export const EarnStepItemBottom = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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

export const CarouselContainer = styled.div`
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 3px 0 #EDEDED;
  border-radius: 20px;
`;

export const SlideWrapper = styled.div<{translateX: number}>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => props.translateX}%);
`;

export const Slide = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
`;

export const SlideButton = styled(Button)`
  width: 100%;
  background: linear-gradient(90deg, #434B34 0%, #000 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

export const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  padding-bottom: 20px;
`;

export const Dot = styled.div<{ active: boolean }>`
  width: ${(props) => (props.active ? '30px' : '6px')};
  height: 6px;
  background-color: ${(props) => (props.active ? '#000' : '#ccc')};
  margin: 0 2px;
  transition: width 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
`;

export const EarnClaimTable = styled.div`
  border-radius: 16px;
  padding: 28px 0;
  box-shadow: 0 1px 3px 0 #EDEDED;
  margin-top: 40px;
  @media screen and (max-width: 1200px) {
    padding-top: 15px;
    padding-bottom: 0;
    overflow: hidden;
  }
`

export const EarnClaimTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 28px;
  @media screen and (max-width: 1200px) {
    padding: 0 15px;
  }
`

export const EarnTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: #000000;
  line-height: 24px;
  @media screen and (max-width: 1200px) {
    font-size: 18px;
  }
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
  @media screen and (max-width: 1200px) {
    padding: 0;
    border: 0;
    color: #666666;
    &:hover {
      color: none;
      background: none;
    }
  }
`

export const EarnClaimTHead = styled.div`
  display: flex;
  margin-bottom: 15px;
  padding: 0 28px;
  @media screen and (max-width: 1200px) {
    padding: 0 15px;
  }
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
  @media screen and (max-width: 1200px) {
    flex: 0;
  }
`

export const EarnTNameToken = styled.span`
  width: 40%;
  display: flex;
  font-size: 14px;
  color: #666666;
`

export const EarnTNamePending = styled.span`
  width: 30%;
  display: flex;
  font-size: 14px;
  color: #666666;
`

export const EarnTReward = styled.span`
  width: 30%;
  display: flex;
  font-size: 14px;
  color: #666666;
  @media screen and (max-width: 1200px) {
    flex: 1;
  }
`

export const EarnTAddress = styled.span`
  flex: 1;
  display: flex;
  font-size: 14px;
  color: #666666;
  @media screen and (max-width: 1200px) {
    flex: 1;
    justify-content: flex-end;
    margin-right: 10px;
  }
`

export const EarnTTime = styled(EarnTName)`
  justify-content: flex-end;
  @media screen and (max-width: 1200px) {
    flex: 1;
  }
`

export const EarnTOpration = styled.span`
  font-size: 14px;
  color: #666666;
  display: flex;
  justify-content: flex-end;
  width: 8%;
  @media screen and (max-width: 1200px) {
    width: 30%;
  }
`

export const EarnTSelect = styled.span`
  width: 25px;
`

export const EarnClaimGroup = styled.div<{isOpen: boolean}>`
  display: flex;
  flex-direction: column;
  transition: all .4s ease;
  background-color: ${({ isOpen }) => (isOpen ? '#FAFAFA' : 'none')};
  box-shadow: ${({ isOpen }) => (isOpen ? 'inset 0 0 4px 0 #EEEEEE' : 'none')};
`

export const EarnClaimTItem = styled.div`
  display: flex;
  border-radius: 4px;
  transition: all .3s ease;
  padding: 9px 28px;
  :hover {
    background: #f6f6f6;
  }
  @media screen and (max-width: 1200px) {
    padding: 9px 15px;
    border-radius: none;
    :hover {
      background: none;
    }
  }
`

export const EarnClaimTBottom = styled.div<{isOpen: boolean}>`
  display: flex;
  transition: all .3s ease;
  padding: 0 15px;
  /* background: #FAFAFA; */
  /* box-shadow: 'inset 0 0 4px 0 #EEE'; */
  overflow: hidden;
  height: ${({ isOpen }) => (isOpen ? `60px` : '0')};
  transition: height 0.4s ease;
  margin-top: 10px;
`

export const EarnTBottomGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-right: 18px;
`

export const EarnTBottomName = styled.span`
  font-size: 14px;
  color: #666666;
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

export const EarnAmountTotal = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  color: #000;
  font-size: 18px;
  font-weight: 500;
`

export const EarnClaimedAomunt = styled(EarnAmountTotal)`
  flex: 1;
  color: #999999;
`

export const EarnClaimAmount = styled(EarnAmountTotal)`
  color: #0DAE6F;
  flex: 1;
`

export const EarnClaimLast = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 8%;
  @media screen and (max-width: 1200px) {
    width: auto;
  }
`

export const EarnClaimButton = styled(Button)`
  width: 65px;
  height: 30px;
  color: #ffffff;
  padding: 0;
  background: #0DAE6F;
  font-size: 14px;
`

export const EarnClaimSelect = styled.img<{ isOpen: boolean }>`
  margin-left: 15px;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`

export const EarnMiddleBox = styled.div`
  display: flex;
`

export const EarnHistory = styled.div`
  flex: 1;
  border-radius: 16px;
  padding: 28px 0;
  box-shadow: 0 1px 3px 0 #EDEDED;
  margin-top: 40px;
  margin-right: 27px;
  &:last-child {
    margin-right: 0;
  }
  @media screen and (max-width: 1200px) {
    margin-right: 0;
    padding: 15px 0;
  }
`

export const EarnHistoryTitle = styled(EarnTitle)`
  padding: 0 28px;
  @media screen and (max-width: 1200px) {
    padding: 0 15px;
  }
`

export const EarnHistoryTHead = styled(EarnClaimTHead)`
  margin-top: 25px;
`

export const EarnHistoryValue = styled.span`
  display: flex;
  align-items: center;
  flex: 1;
  color: #000;
  font-size: 14px;
  @media screen and (max-width: 1200px) {
    justify-content: flex-end;
  }
`

export const EarnHistoryAddress = styled.span`
  display: flex;
  align-items: center;
  flex: 1;
  color: #000;
  font-size: 14px;
  @media screen and (max-width: 1200px) {
    justify-content: flex-start;
  }
`

export const EarnHistoryReward = styled.span`
  display: flex;
  align-items: center;
  width: 30%;
  color: #0DAE6F;
  font-size: 14px;
`

export const EarnHistoryTime = styled(EarnHistoryValue)`
  justify-content: flex-end;
`

export const EarnMintGroup = styled.div`
  display: flex;
  margin-top: 20px;
`

export const EarnMintGroupItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
`

export const EarnMintGroupNumber = styled.span`
  font-size: 20px;
  color: #333333;
  font-weight: 500;
  margin-bottom: 10px;
`

export const EarnMintGroupWords = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #666666;
`

export const EarnFAQ = styled.div`
  border-radius: 16px;
  padding-top: 28px;
  box-shadow: 0 1px 3px 0 #EDEDED;
  margin-top: 40px;
  overflow: hidden;
`

export const EarnFAQTitle = styled(EarnTitle)`
  padding: 0 28px;
`

export const EarnFAQBody = styled.div`
  margin-top: 36px;
`

export const EarnFAQItem = styled.div`
  display: flex;
  flex-direction: column;
  transition: all .3s ease;
  &:hover {
    background: #f6f6f6;
  }
`

export const EarnQuestion = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;
  padding: 20px 28px;
  border-top: 1px solid #EDEDED;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const EarnAnswerWrapper = styled.div<{ isOpen: boolean; height: number }>`
  overflow: hidden;
  height: ${({ isOpen, height }) => (isOpen ? `${height}px` : '0')};
  transition: height 0.4s ease;
`;

export const EarnAnswer = styled.div`
  font-size: 16px;
  line-height: 24px;
  padding: 15px 28px;
  padding-top: 0;
  color: #666666;
`

export const PlusMinusIcon = styled.div<{ isOpen: boolean }>`
  width: 16px;
  height: 16px;
  position: relative;
  cursor: pointer;

  /* Horizontal line (always visible) */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #333;
    transform: translateY(-50%);
  }

  /* Vertical line (visible when closed, hidden when open) */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 16px;
    background-color: #333;
    transform: translateX(-50%) scaleY(${({ isOpen }) => (isOpen ? 0 : 1)});
    transform-origin: center;
    transition: transform 0.3s ease;
  }
`;

export const ListWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  background: #fff;
  padding: 20px 20px 0 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 20px;
  z-index: 90;
  @media (min-width: 1200px) {
    max-width: 560px;
  }
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
  perspective: 1000px;
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

export const CircleImgWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: rotate3D 5s infinite linear;

  @keyframes rotate3D {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
`

export const CircleImg = styled.img<{depth: number}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateZ(${props => props.depth}px);
  opacity: ${props => 1 - props.depth / 20};
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