import React from 'react';
import { formatUnits } from '@ethersproject/units';
import { useMatchBreakpointsContext } from '@pancakeswap/uikit';
import moment from 'moment-timezone'
import { EarnClaimTItem, EarnHistoryReward, EarnHistoryTime, EarnHistoryValue } from './styles';
import { floatFormat } from 'utils';

const formatAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 4);   // 前6位
  const end = address.slice(-4);       // 后4位
  return `${start}...${end}`;
};

export default function EarnRewardItem({ info, index }) {

  const { isDesktop } = useMatchBreakpointsContext()

  const formattedParentAmount = floatFormat(formatUnits(info.parentAmount, info.decimals),6)

  const formattedTimestamp = moment.unix(info.blockTimestamp).format('MMM DD HH:mm:ss')

  return (
    <EarnClaimTItem>
      {isDesktop ? <EarnHistoryValue>{index + 1}</EarnHistoryValue> : ''}
      <EarnHistoryReward>{formattedParentAmount}&nbsp;&nbsp;{info.symbol}</EarnHistoryReward>
      <EarnHistoryValue>{formatAddress(info.owner)}</EarnHistoryValue>
      <EarnHistoryTime>{formattedTimestamp}</EarnHistoryTime>
    </EarnClaimTItem>
  );
}
