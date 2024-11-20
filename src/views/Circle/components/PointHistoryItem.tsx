import React from 'react';
import moment from 'moment-timezone'
import { EarnClaimTItem, EarnHistoryAddress, EarnHistoryReward, EarnHistoryTime, EarnHistoryValue } from './styles';

const formatAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 6);   // 前6位
  const end = address.slice(-10);       // 后4位
  return `${start}...${end}`;
};

export default function PointHistoryItem({ info }) {

  const formattedTimestamp = moment.unix(info.timestamp).format('MMM DD HH:mm:ss')

  const renderType = () => {
    switch (info.source) {
      case 1:
        return 'Trade on Coinfair';

      case 2:
        return 'Trade on Coinfair';

      case 3:
        return 'Claim NFT';

      case 4:
        return 'Claim NFT';

      case 5:
        return 'Claim NFT';

      default:
        break;
    }
  }

  return (
    <EarnClaimTItem>
      <EarnHistoryReward style={{ fontSize: '16px', fontWeight: 600, flex: 1 }}>+{info.points}</EarnHistoryReward>
      <EarnHistoryValue style={{ justifyContent: 'flex-start' }}>{renderType()}</EarnHistoryValue>
      <EarnHistoryAddress>{formatAddress(info.addr)}</EarnHistoryAddress>
      <EarnHistoryTime>{formattedTimestamp}</EarnHistoryTime>
    </EarnClaimTItem>
  );
}
