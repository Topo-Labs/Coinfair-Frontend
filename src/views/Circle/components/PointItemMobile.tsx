import React from 'react';
import moment from 'moment-timezone'
import { EarnClaimTItem, EarnHistoryAddress, EarnHistoryReward, EarnHistoryTime, EarnHistoryValue, PointGroup, PointItem, PointReward, PointTime, PointValue } from './styles';

const formatAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 6);   // 前6位
  const end = address.slice(-6);       // 后4位
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

      case 6:
        return 'Claim NFT';

      default:
        return '';
    }
  }

  return (
    <PointGroup>
      <PointItem>
        <PointReward>+{info.points}</PointReward>
        <PointValue>{formatAddress(info.addr)}</PointValue>
      </PointItem>
      <PointItem>
        <PointValue>{renderType()}</PointValue>
        <PointTime>{formattedTimestamp}</PointTime>
      </PointItem>
    </PointGroup>
  );
}
