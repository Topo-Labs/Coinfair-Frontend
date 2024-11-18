import React from 'react';
import { useMatchBreakpointsContext } from '@pancakeswap/uikit';
import moment from 'moment-timezone'
import { EarnClaimTItem, EarnHistoryAddress, EarnHistoryReward, EarnHistoryTime, EarnHistoryValue } from './styles';

const formatAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 6);   // 前6位
  const end = address.slice(-10);       // 后4位
  return `${start}...${end}`;
};

export default function EarnMintItem({ info, index }) {

  const { isDesktop } = useMatchBreakpointsContext()

  const formattedTimestamp = moment.unix(info.blockTimestamp).format('MMM DD HH:mm:ss')

  return (
    <EarnClaimTItem>
      {isDesktop ? <EarnHistoryValue>{index + 1}</EarnHistoryValue> : ''}
      <EarnHistoryAddress>{formatAddress(info.claimer)}</EarnHistoryAddress>
      <EarnHistoryTime>{formattedTimestamp}</EarnHistoryTime>
    </EarnClaimTItem>
  );
}
