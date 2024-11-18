import React from 'react';
import { useMatchBreakpointsContext } from '@pancakeswap/uikit';
import { EarnClaimTItem, EarnHistoryValue } from './styles';

const formatAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 4);   // 前6位
  const end = address.slice(-4);       // 后4位
  return `${start}...${end}`;
};

export default function EarnRewardItem({ info }) {

  const { isDesktop } = useMatchBreakpointsContext()

  return (
    <EarnClaimTItem className={info?.rank <= 3 ? `rank-${info?.rank}` : 'rank-item'}>
      <EarnHistoryValue className='rank-value'>{info?.rank}</EarnHistoryValue>
      <EarnHistoryValue className='rank-value'>{info?.points?.toLocaleString()}</EarnHistoryValue>
      <EarnHistoryValue className='rank-value'>{formatAddress(info?.address)}</EarnHistoryValue>
    </EarnClaimTItem>
  );
}
