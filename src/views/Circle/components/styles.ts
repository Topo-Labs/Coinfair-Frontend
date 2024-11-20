import { Button } from '@pancakeswap/uikit';
import styled, { keyframes } from 'styled-components';

const spinScale = keyframes`
  0% {
    transform: scale(0.8) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(0.8) rotate(360deg);
  }
`;

export const LoadingRing = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &::before {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.2);
    border-top: 5px solid black;
    border-radius: 50%;
    animation: ${spinScale} 1.5s infinite ease-in-out;
  }
`;

export const EarnContainer = styled.div`
  padding: 0 100px;
  padding-top: 100px;
  width: 100%;
  @media screen and (max-width: 800px) {
    padding: 0;
  }
`

export const EarnTips = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 800px) {
    margin: 1rem 0;
  }
`

export const EarnTipsOnce = styled.div`
  position: absolute;
  font-family: "Oswald", sans-serif !important;
  font-weight: 900;
  font-size: 300px;
  color: #F3F3F3;
  top: 100px;
  right: -40px;
  z-index: -1;
  @media screen and (max-width: 800px) {
    font-size: 85px;
    top: 30px;
    right: -20px;
  }
`

export const EarnTipsDouble = styled.div`
  position: absolute;
  font-family: "Oswald", sans-serif !important;
  font-weight: 900;
  font-size: 300px;
  color: #F3F3F3;
  top: 450px;
  right: -40px;
  z-index: -1;
  @media screen and (max-width: 800px) {
    font-size: 85px;
    top: 130px;
    right: -1px;
  }
`

export const EarnTipRight = styled.div`
  margin-left: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 800px) {
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
  font-size: 128px;
  font-weight: 900;
  line-height: 45px;
  font-family: "Oswald", sans-serif !important;
  color: #333333;
  &:first-child {
    text-indent: 0.8em;
  }
  @media screen and (max-width: 800px) {
    font-size: 48px;
    line-height: 48px;
  }
`

export const EarnTipGreen = styled.span`
  font-size: 128px;
  font-weight: 900;
  color: #56BA93;
  line-height: 128px;
  font-family: "Oswald", sans-serif !important;
  @media screen and (max-width: 800px) {
    font-size: 48px;
    line-height: 48px;
  }
`

export const EarnTipRed = styled.span`
  font-size: 128px;
  font-weight: 900;
  color: #CA685B;
  line-height: 128px;
  font-family: "Oswald", sans-serif !important;
  @media screen and (max-width: 800px) {
    font-size: 48px;
    line-height: 48px;
  }
`

export const EarnStep = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
  z-index: 9999;
  @media screen and (max-width: 800px) {
    margin-top: 20px;
  }
`

export const EarnStepItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  margin-right: -15px;
  padding: 30px;
  border-radius: 16px;
  color: #CCCCCC;
  transition: all .3s ease;
  cursor: pointer;
  &:first-child {
    z-index: 3;
    background: #EFF5FF;
    box-shadow: 2px 2px 8px 0 #D7E0EE;
    &:hover {
      box-shadow: 0 6px 16px 4px #D7E0EE;
      z-index: 4;
      .step-arrow {
        margin-left: 30px;
      }
    }
  }
  &:nth-child(2) {
    z-index: 2;
    background: #F2FFF3;
    box-shadow: 2px 2px 8px 0 #CADACB;
    &:hover {
      box-shadow: 0 6px 16px 4px #CADACB;
      z-index: 4;
      .step-arrow {
        margin-left: 30px;
      }
    }
  }
  &:last-child {
    z-index: 1;
    background: #FFF7F7;
    box-shadow: 2px 2px 8px 0 #E2D5D5;
    &:hover {
      box-shadow: 0 6px 16px 4px #E2D5D5;
      z-index: 4;
      .step-arrow {
        margin-left: 30px;
      }
    }
  }
`

export const EarnStepItemTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
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
  margin-top: -55px;
  @media screen and (max-width: 800px) {
    margin-top: -45px;
  }
`

export const EarnStepItemWords = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  color: #000000;
  margin-bottom: 45px;
`

export const EarnStepShareLink = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  color: #FAFAFA;
  border: 1px solid #EDEDED;
  margin: 20px 0 30px 0;
`

export const EarnStepItemButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  .step-arrow {
    margin-left: 20px;
    transition: all .3s ease;
  }
`

export const EarnStepItemToScroll = styled.div`
  width: 100%;
  color: #000000;
  transition: all .3s ease;
  display: flex;
  align-items: center;
  .step-arrow {
    margin-left: 20px;
    transition: all .3s ease;
  }
`

export const CarouselContainer = styled.div`
  width: 90%;
  max-width: 500px;
  position: relative;
  border-radius: 20px;
  margin: 0 auto;
`;

export const SlideWrapper = styled.div<{translateX: number}>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => props.translateX}%);
  margin-top: 64px;
`;

export const Slide = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 16px;
  transition: all .3s ease;
  &:first-child {
    background: #EFF5FF;
    &:hover {
      .step-arrow {
        margin-left: 30px;
      }
    }
  }
  &:nth-child(2) {
    z-index: 2;
    background: #F2FFF3;
    &:hover {
      .step-arrow {
        margin-left: 30px;
      }
    }
  }
  &:last-child {
    z-index: 1;
    background: #FFF7F7;
    &:hover {
      .step-arrow {
        margin-left: 30px;
      }
    }
  }
`;

export const SlideButton = styled.div`
  width: 100%;
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  img {
    margin-left: 20px;
  }
  &:hover {
    transform: scale(1.05);
  }
`;

export const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-bottom: 20px;
`;

export const Dot = styled.div<{ active: boolean }>`
  width: ${(props) => (props.active ? '30px' : '6px')};
  height: 6px;
  background-color: ${(props) => (props.active ? '#000' : '#ccc')};
  margin: 0 2px;
  transition: width 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  &:nth-child(1) {
    background-color: ${(props) => (props.active ? '#4A8BF3' : '#ccc')};
  }
  &:nth-child(2) {
    background-color: ${(props) => (props.active ? '#99E6A0' : '#ccc')};
  }
  &:nth-child(3) {
    background-color: ${(props) => (props.active ? '#F0AEAE' : '#ccc')};
  }
`;

// export const EarnTokenItem = styled.div<{isHovered: boolean, x: number, y: number, lastX: number, lastY: number}>`
//   flex: 1 1 calc(33.333% - 20px);
//   max-width: calc(33.333% - 20px);
//   margin-bottom: 20px;
//   background: ${(props) =>
//     props.isHovered
//       ? `radial-gradient(circle at ${props.x}% ${props.y}%, #999, #f1f1f1)`
//       : `radial-gradient(circle at ${props.lastX}% ${props.lastY}%, #f1f1f1, #f1f1f1)`};
//   border-radius: 10px;
//   clip-path: polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px);
//   height: 300px;
//   transition: all 0.3s ease;
//   display: flex;
//   flex-direction: column;
// `

export const EarnTokenContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  justify-content: flex-start;
  margin-top: 50px;
`;

export const EarnTokenItem = styled.div`
  flex: 1 1 calc(33.333% - 20px);
  max-width: calc(33.333% - 20px);
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  clip-path: polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fafafa;
  overflow: hidden;
  box-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.05);
  &:hover {
    box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const EarnTokenItemInfo = styled.div``

export const EarnTokenTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const EarnTokenNumLine = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`

export const EarnNumItem = styled.div`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 18px;
`

export const EarnTotalItem = styled.div`
  display: flex;
  align-items: center;
  color: #000;
  font-size: 18px;
`

export const EarnTokenClaimed = styled.div`
  display: flex;
  align-items: center;
  color: #999;
  margin-left: 10px;
`

export const EarnTokenTotal = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

export const EarnTokenClaim = styled(Button)`
  background: linear-gradient(135deg, #434B34 0%, #000 100%);
  font-size: 20px;
  margin-top: 35px;
`

export const EarnClaimTable = styled.div`
  border-radius: 16px;
  padding: 28px 0;
  box-shadow: 0 1px 3px 0 #EDEDED;
  margin-top: 40px;
  @media screen and (max-width: 800px) {
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
  @media screen and (max-width: 800px) {
    padding: 0 15px;
  }
`

export const PointsRankTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 28px;
  @media screen and (max-width: 800px) {
    padding: 0 15px;
    margin-bottom: 0;
  }
`

export const EarnTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: #000000;
  line-height: 24px;
  @media screen and (max-width: 800px) {
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
  @media screen and (max-width: 800px) {
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
  @media screen and (max-width: 800px) {
    padding: 0 15px;
  }
`

export const EarnTBody = styled.div`
  display: flex;
  flex-direction: column;
`

export const PointsTBody = styled.div`
  max-height: 300px;
  overflow-y: auto;
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
  min-width: 30px;
  display: flex;
  font-size: 14px;
  color: #666666;
  &.rank-tname {
    @media screen and (max-width: 800px) {
      flex: 1;
    }
  }
  @media screen and (max-width: 800px) {
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
  @media screen and (max-width: 800px) {
    flex: 1;
  }
`

export const EarnTAddress = styled.span`
  flex: 1;
  display: flex;
  font-size: 14px;
  color: #666666;
  @media screen and (max-width: 800px) {
    flex: 1;
    justify-content: flex-end;
    margin-right: 10px;
  }
`

export const EarnTTime = styled(EarnTName)`
  justify-content: flex-end;
  @media screen and (max-width: 800px) {
    flex: 1;
  }
`

export const EarnTOpration = styled.span`
  font-size: 14px;
  color: #666666;
  display: flex;
  justify-content: flex-end;
  width: 8%;
  @media screen and (max-width: 800px) {
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

export const PointGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  transition: all .3s ease;
  padding: 15px;
  border-bottom: 1px solid #f2f2f2;
`

export const PointItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
`

export const EarnClaimTItem = styled.div`
  display: flex;
  transition: all .3s ease;
  padding: 15px 28px;
  &.rank-item {
    padding: 15px 28px;
    span {
      font-size: 18px;
    }
    @media screen and (max-width: 800px) {
      padding: 10px 15px;
      span {
        font-size: 16px;
      }
    }
  }
  &.rank-1 {
    padding: 15px 28px;
    background: linear-gradient(90deg, #E0B14C, #FFEEC9, #FFFFFF);
    span {
      font-size: 18px;
      color: #976800;
    }
    :hover {
      background: linear-gradient(90deg, #E0B14C, #FFEEC9, #FFFFFF);
      transform: scale(1.1);
    }
    @media screen and (max-width: 800px) {
      padding: 10px 15px;
      :hover {
        transform: none;
      }
      span {
        font-size: 16px;
      }
    }
  }
  &.rank-2 {
    padding: 15px 28px;
    background: linear-gradient(90deg, #989898, #DEDEDE, #FFFFFF);
    span {
      font-size: 18px;
      color: #404040;
    }
    :hover {
      background: linear-gradient(90deg, #989898, #DEDEDE, #FFFFFF);
      transform: scale(1.1);
    }
    @media screen and (max-width: 800px) {
      padding: 10px 15px;
      :hover {
        transform: none;
      }
      span {
        font-size: 16px;
      }
    }
  }
  &.rank-3 {
    padding: 15px 28px;
    background: linear-gradient(90deg, #AE8365, #F1D1B4, #FFFFFF);
    span {
      font-size: 18px;
      color: #6A2C00;
    }
    :hover {
      background: linear-gradient(90deg, #AE8365, #F1D1B4, #FFFFFF);
      transform: scale(1.1);
    }
    @media screen and (max-width: 800px) {
      padding: 10px 15px;
      :hover {
        transform: none;
      }
      span {
        font-size: 16px;
      }
    }
  }
  :hover {
    background: #f6f6f6;
  }
  @media screen and (max-width: 800px) {
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
  font-size: 25px;
  font-weight: 500;
`

export const EarnTokenIcon = styled.div`
  width: 48px;
  height: 48px;
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
  width: 100%;
  height: 100%;
  font-size: 25px;
  font-weight: 900;
  position: relative;
  img {
    position: absolute;
  }
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

export const EarnClaimAmount = styled.span`
  display: flex;
  align-items: center;
  font-size: 36px;
  font-weight: 500;
  color: #0DAE6F;  
`

export const EarnClaimLast = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 8%;
  @media screen and (max-width: 800px) {
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

export const EarnMyLeaderboard = styled.div`
  display: flex;
`

export const EarnMyRank = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 800px) {
    justify-content: center;
    padding: 15px;
  }
`

export const MyPoints = styled.span`
  font-size: 20px;
  margin-right: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .3s ease;
  padding: 15px;
  padding-right: 3px;
  border-radius: 5px;
  cursor: pointer;
  img {
    margin-top: 2px;
    width: 20px;
    transition: all .3s ease;
  }
  &:hover {
    background: #f1f1f1;
    img {
      margin-left: 10px;
    }
  }
  @media screen and (max-width: 800px) {
    font-size: 14px;
    margin-right: 10px;
    padding-right: 3px;
    &:hover {
      background: none;
      img {
        margin-left: 0;
      }
    }
  }
`

export const MyRank = styled.span`
  font-size: 20px;
  @media screen and (max-width: 800px) {
    font-size: 14px;
  }
`

export const PointsContainer = styled.div`
  margin-top: 60px;
`

export const PointsCard = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Card = styled.div`
  position: relative;
  flex: 1;
  margin: 20px 40px 20px 0;
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: scale(1.2) rotate(2deg);;
    z-index: 99;
    color: #ffffff;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #434B34 0%, #000 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 15px;
    z-index: 1;
  }
  &:hover::before {
    opacity: 1;
  }
  &:last-child {
    margin-right: 0;
  }
  @media screen and (max-width: 800px) {
    margin-right: 0;
    &:hover {
      transform: rotate(2deg);;
      z-index: 99;
      color: #ffffff;
    }
  }
`;

export const CardContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  ${Card}:hover & {
    color: #ffffff;
  }
`;

export const CardTitle = styled.h3`
  width: 100%;
  font-size: 28px;
  margin: 0;
  transition: color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 28px;

  ${Card}:hover & {
    color: #ffffff;
  }
`;

export const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 10px 0 40px;
  transition: color 0.3s ease;
  line-height: 16px;
  ${Card}:hover & {
    color: #ffffff;
  }
`;

export const CardButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #333;
  color: #333;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all .3s ease;

  &:hover {
    background-color: #fff !important;
    color: #000 !important;
    opacity: 1 !important;
  }

  ${Card}:hover & {
    background-color: transparent;
    color: #fff;
    border-color: #ffffff;
  }
`;

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
  @media screen and (max-width: 800px) {
    margin-right: 0;
    padding: 15px 0;
  }
`

export const EarnClaimedHis = styled.div`
  width: 50%;
  border-radius: 16px;
  padding: 28px 0;
  margin-top: 40px;
  margin-right: 27px;
  background: #fff;
  z-index: 99;
  &:last-child {
    margin-right: 0;
  }
  @media screen and (max-width: 800px) {
    width: 80%;
    margin-right: 0;
    padding: 15px 0;
  }
`

export const EarnHistoryTitle = styled(EarnTitle)`
  padding: 0 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 800px) {
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
  @media screen and (max-width: 800px) {
    justify-content: flex-end;
    &.rank-value {
      justify-content: flex-start;
    }
  }
`

export const EarnHistoryAddress = styled.span`
  display: flex;
  align-items: center;
  flex: 1;
  color: #000;
  font-size: 14px;
  @media screen and (max-width: 800px) {
    justify-content: flex-start;
  }
`

export const PointValue = styled.span`
  display: flex;
  align-items: center;
  color: #000;
  font-size: 14px;
  @media screen and (max-width: 800px) {
    justify-content: flex-start;
  }
`

export const PointTime = styled.span`
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
  @media screen and (max-width: 800px) {
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

export const PointReward = styled.span`
  display: flex;
  align-items: center;
  color: #0DAE6F;
  font-size: 16px;
  font-weight: 600;
`

export const EarnHistoryTime = styled(EarnHistoryValue)`
  justify-content: flex-end;
  font-weight: normal;
`

export const EarnMintGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 90px;
`

export const EarnMintGroupItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
`

export const EarnMintGroupNumber = styled.span`
  font-size: 50px;
  color: #333333;
  font-weight: 500;
  margin-bottom: 30px;
  text-shadow: 10px -8px 8px rgba(0, 0, 0, 0.15);
  font-family: "Racing Sans One", sans-serif !important;
`

export const EarnMintGroupWords = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  display: flex;
  align-items: center;
  transition: all .3s ease;
  cursor: auto;
  .amount-arrow {
    margin-top: 2px;
    transition: all .3s ease;
  }
  &:nth-child(2) {
    &:hover {
      .amount-arrow {
        margin-left: 10px;
      }
    }
  }
`

export const ToggleSwitch = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-top: 80px;
  @media screen and (max-width: 800px) {
    padding: 10px;
  }
`;

export const ToggleBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background-color: #F5F5F5;
  border-radius: 50px;
  border: 8px solid #F5F5F5;
  @media screen and (max-width: 800px) {
    border-radius: 40px;
    border-width: 4px;
  }
`;

export const ToggleOption = styled.div<{active: boolean}>`
  width: 280px;
  height: 90px;
  flex: 1;
  text-align: center;
  line-height: 90px;
  font-size: 32px;
  font-weight: bold;
  color: ${(props) => (props.active ? '#000' : '#aaa')};
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 1;
  @media screen and (max-width: 800px) {
    font-size: 16px;
    width: 150px;
    height: 50px;
    line-height: 50px;
  }
`;

export const ToggleSlider = styled.div<{activeIndex: number}>`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(${(props) => (props.activeIndex === 0 ? 0 : '100%')});
  width: 280px;
  height: 90px;
  background-color: #fff;
  border-radius: 45px;
  box-shadow: 0px 3px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  @media screen and (max-width: 800px) {
    font-size: 16px;
    width: 150px;
    height: 50px;
  }
`;

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
  padding: 20px 28px;
  border-top: 1px solid #EDEDED;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const EarnQ = styled.div`
  @media screen and (max-width: 800px) {
    width: 100%;
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
  }
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
  width: 80%;
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

export const MintSuccessModal = styled.div`
  background: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  z-index: 999;
`

export const MintSuccessTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28px;
  font-weight: 600;
`

const floatAnimation = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(1px, -30px); }
  100% { transform: translate(0, 0); }
`;

export const MintSuccessNft = styled.img`
  margin: 70px 0;
  animation: ${floatAnimation} 2.5s ease infinite;
`

export const MintSuccessBottom = styled.div`
  display: flex;
  align-items: center;
`

export const CopyMyLink = styled(Button)`
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background: linear-gradient(90deg, #434B34 0%, #000 100%);
  transition: all .3s ease;
  flex: 1;
  padding: 15px 20px;
`

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
`;
