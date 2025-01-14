import React from 'react';
import moment from 'moment-timezone'
import { useTranslation } from '@pancakeswap/localization';
import { PointGroup, PointItem, PointReward, PointTime, PointValue } from './styles';

const formatAddress = (address: string) => {
  if (!address) return '';
  const start = address.slice(0, 6);   // 前6位
  const end = address.slice(-6);       // 后4位
  return `${start}...${end}`;
};

export default function PointHistoryItem({ info }) {

  const { t } =  useTranslation()
  const formattedTimestamp = moment.unix(info.timestamp).format('MMM DD HH:mm:ss')

  const renderType = () => {
    switch (info.source) {
      case 1:
        return t('Referral trade bonus');

      case 2:
        return t('Trade on Coinfair');

      case 3:
        return t('Mint NFT');

      case 4:
        return t('Referral claim bonus');

      case 5:
        return t('Claim NFT');

      case 6:
        return t('Referral mint bonus');

      default:
        return '';
    }
  }

  return (
    <PointGroup>
      <PointItem>
        <PointReward>+ {info.points}</PointReward>
        <PointValue>{formatAddress(info.addr)}</PointValue>
      </PointItem>
      <PointItem>
        <PointValue>{renderType()}</PointValue>
        <PointTime>{formattedTimestamp}</PointTime>
      </PointItem>
    </PointGroup>
  );
}
