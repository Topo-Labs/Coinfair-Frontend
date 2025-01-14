import React from "react";
import { useTranslation } from "@pancakeswap/localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useMintHistory } from "../useHistory";
import EarnMintItem from "./EarnMintItem";
import { EarnClaimedHis, EarnHistoryTHead, EarnHistoryTitle, EarnNoData, EarnNoDataIcon, EarnTBody, EarnTName, EarnTTime, LoadingRing } from "./styles";

const ClaimedHistory = ({onDismiss = () => null}) => {
  const { chainId, account } = useActiveWeb3React();
  const { data: mintData, loading: mintLoading, error: mintError } = useMintHistory(chainId, account);

  const { t } =  useTranslation()

  return (
    <EarnClaimedHis>
      {/* eslint-disable */}
      <EarnHistoryTitle>{t('Claim History')}<img onClick={() => onDismiss?.()} src="/images/mint-close.svg" alt="" /></EarnHistoryTitle>
      {
        mintData && mintData.length ? (
          <EarnHistoryTHead>
            <EarnTName>{t('User')}</EarnTName>
            <EarnTTime>{t('Time')}</EarnTTime>
          </EarnHistoryTHead>
        ) : ''
      }
      <EarnTBody>
        {
          mintLoading ? (
            <LoadingRing />
          ) : mintData && mintData.length ? (
            [...mintData].sort((a, b) => b.blockTimestamp - a.blockTimestamp).map((hty, index) =>
              <EarnMintItem info={hty} index={index}/>
            )
          ) : (
            <EarnNoData style={{ marginTop: '20px' }}>
              <EarnNoDataIcon><img src="/images/noData.svg" alt="" /></EarnNoDataIcon>
              {t('No Data')}
            </EarnNoData>
          )
        }
      </EarnTBody>
    </EarnClaimedHis>
  )
}

export default React.memo(ClaimedHistory)