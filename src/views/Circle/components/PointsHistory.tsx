import React, { useEffect, useState } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { useMatchBreakpointsContext } from "@pancakeswap/uikit";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useMyPointsHistory } from "../useHistory";
import PointHistoryItem from "./PointHistoryItem";
import PointItemMobile from './PointItemMobile'
import { EarnClaimedHis, EarnHistoryTHead, EarnHistoryTitle, EarnNoData, EarnNoDataIcon, EarnTBody, EarnTName, EarnTTime, LoadingRing, PointsTBody } from "./styles";

const PointsHistory = ({myPoints, onDismiss = () => null}) => {
  const { chainId, account } = useActiveWeb3React();
  const { isDesktop } = useMatchBreakpointsContext()
  const { data: pHistoryData, loading: pHistoryLoading, error: pHistoryError } = useMyPointsHistory(chainId, account);
  console.log(pHistoryData, pHistoryLoading)
  const { t } =  useTranslation()

  return (
    <EarnClaimedHis>
      {/* eslint-disable */}
      <EarnHistoryTitle>{t('My Points')}: {myPoints || 0}<img onClick={() => onDismiss?.()} src="/images/mint-close.svg" alt="" /></EarnHistoryTitle>
      {
        isDesktop && pHistoryData && pHistoryData.length ? (
          <EarnHistoryTHead>
            <EarnTName>{t('Points')}</EarnTName>
            <EarnTName>{t('Type')}</EarnTName>
            <EarnTName>{t('User')}</EarnTName>
            <EarnTTime>{t('Time')}</EarnTTime>
          </EarnHistoryTHead>
        ) : ''
      }
      <PointsTBody>
        {
          pHistoryLoading ? (
            <LoadingRing />
          ) : pHistoryData && pHistoryData.length ? (
            [...pHistoryData].sort((a, b) => b.blockTimestamp - a.blockTimestamp).map((hty) =>
              isDesktop ? <PointHistoryItem info={hty} /> : <PointItemMobile info={hty}/>
            )
          ) : (
            <EarnNoData>
              <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
              {t('No Data')}
            </EarnNoData>
          )
        }
      </PointsTBody>
    </EarnClaimedHis>
  )
}

export default React.memo(PointsHistory)