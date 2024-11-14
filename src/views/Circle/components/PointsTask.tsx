import React from 'react';
import styled from 'styled-components';
import {  } from './styles'

const Card = styled.div`
  position: relative;
  width: 250px;
  height: 150px;
  background-color: #f5f5f5;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    color: #ffffff;
  }

  /* 伪元素，用于显示渐变背景 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2a2a2a, #3e3e3e);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 15px; /* 确保伪元素的边框圆角与卡片一致 */
    z-index: 1; /* 使伪元素位于内容下方 */
  }

  /* 悬停时渐变背景显示 */
  &:hover::before {
    opacity: 1;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2; /* 确保内容在渐变背景之上 */
`;

const CardTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: #ffffff;
  }
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 10px 0 0;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: #ffffff;
  }
`;

const CardButton = styled.button`
  background-color: transparent;
  border: 1px solid #333;
  color: #333;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  ${Card}:hover & {
    background-color: #ffffff;
    color: #333;
    border-color: #ffffff;
  }
`;

const HoverCard = () => (
  <Card>
    <CardContent>
      {/* <SwapSvg stroke="black" /> */}
      <CardTitle>参与SWAP交易</CardTitle>
      <CardDescription>参与swap交易，最高返还30%积分。</CardDescription>
      <CardButton>立即参与</CardButton>
    </CardContent>
  </Card>
);

export default HoverCard;
