import React from 'react';
import { formatUnits } from '@ethersproject/units';
import moment from 'moment-timezone'
import { EarnClaimTItem, EarnHistoryReward, EarnHistoryTime, EarnHistoryValue } from './styles';

const formatAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 6);   // 前6位
  const end = address.slice(-4);       // 后4位
  return `${start}...${end}`;
};

export default function EarnMintItem({ info, index }) {

  const formattedTimestamp = moment.unix(info.blockTimestamp).format('YYYY-MM-DD HH:mm');

  return (
    <EarnClaimTItem>
      <EarnHistoryValue>{index + 1}</EarnHistoryValue>
      <EarnHistoryValue>{formatAddress(info.minter)}</EarnHistoryValue>
      <EarnHistoryTime>{formattedTimestamp}</EarnHistoryTime>
    </EarnClaimTItem>
  );
}
