import { Button } from '@pancakeswap/uikit';
import styled, { useTheme } from 'styled-components';

export const EarnContainer = styled.div`
  padding: 0 100px;
`

export const EarnStep = styled.div`
  
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