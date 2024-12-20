import { Button } from '@pancakeswap/uikit';
import styled, { useTheme } from 'styled-components';

export const Claim = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  /* overflow: hidden; */
  background: #000;
  @media screen and (max-width: 852px){
    margin-top: 56px !important;
  }
`;

export const ClaimMain = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: #000;
  border-radius: 20px;
  @media screen and (max-width: 852px){
    margin-top: 56px !important;
  }
`;

export const ClaimTips = styled.div`
  font-size: 13px;
  padding: 15px 0;
`

export const ClaimHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ClaimTitle = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: 600;
`;

export const ClaimNftMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  & p{
    margin-top: 40px;
  }
`;

export const ClaimNft = styled.div`
  width: fit-content;
  border-radius: 16px;
  perspective: 1000px;
  /* box-shadow: 0 0 15px 10px #27272B; */
`;

export const NftMessage = styled.div`
  padding: 10px 5px;
`;

export const NftTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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

export const ClaimImgWrapper = styled.div`
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

export const ClaimImg = styled.img<{depth: number}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  transform: translateZ(${props => props.depth}px);
  opacity: ${props => 1 - props.depth / 20};
`;

export const ClaimHistoryContent = styled.div`
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: all .3s ease;
  padding: 20px 0;
`;

export const ClaimContent = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const ClaimPeopleCount = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 13px;
  margin-bottom: 285px;
  font-size: 16px;
`;

export const ClaimContentPeople = styled.div`
  color: #fff;
  font-size: 20px;
`;

export const ClaimContentPeopleRange = styled.div`
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

export const ClaimMint = styled(Button)`
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
  margin-bottom: 20px;
`;

export const ClaimFooter = styled.div`
  margin-top: 10px;
`

export const FooterTitle = styled.div`
  font-size: 14px;
`

export const MinterAddress = styled.div`
  width: 100%;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  margin-top: 5px;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

export const ClaimToken = styled.div`
  /* display: flex; */
  /* align-items: center; */
  margin-bottom: 30px;
`

export const ClaimTokenInfo = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
`

export const ClaimTokenBtn = styled(Button)`
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
  font-size: 12px;
`
