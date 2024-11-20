import React, { useEffect, useRef, useState } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { useMatchBreakpointsContext } from "@pancakeswap/uikit";
import { formatUnits } from "@ethersproject/units";
import { Contract } from "@ethersproject/contracts";
import { TREASURY_ADDRESS } from "@pancakeswap/sdk";
import TreasuryABI from '@pancakeswap/sdk/src/abis/Coinfair_Treasury.json';
import { useTranslation } from "@pancakeswap/localization";
import { EarnClaimAmount, EarnNumItem, EarnTokenClaim, EarnTokenClaimed, EarnTokenContainer, EarnTokenIcon, EarnTokenInfo, EarnTokenItem, EarnTokenItemInfo, EarnTokenNoLogo, EarnTokenNumLine, EarnTokenTop, EarnTokenTotal, EarnTotalItem } from "./styles";
import { useTokenRewards } from "../useHistory";

const EarnTokenList = () => {
  const { chainId, account, library } = useActiveWeb3React();
  const { isDesktop } = useMatchBreakpointsContext();
  const { t } =  useTranslation()
  const { data: tokenData, loading: tokenLoading, error: tokenError, refetch } = useTokenRewards(chainId, account);

  // 动态生成 hover 状态和最后坐标
  const [hoverStates, setHoverStates] = useState({});
  const [contract, setContract] = useState(null);
  const lastCoords = useRef({}); // 保存所有 token 的最后坐标

  useEffect(() => {
    if (account && chainId && library && TREASURY_ADDRESS[chainId]) {
      const _contract = new Contract(TREASURY_ADDRESS[chainId], TreasuryABI, library.getSigner(account));
      setContract(_contract);
    }
  }, [account, chainId, library]);

  const handleMouseMove = (e, id) => {
    if (!hoverStates[id]) return; // 仅在悬停时更新坐标
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    lastCoords.current[id] = { x, y }; // 更新对应 token 的最后坐标
  };

  const handleMouseEnter = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  const tokenRewards = (pending, decimals) => formatUnits(pending, decimals).slice(0, formatUnits(pending, decimals).indexOf('.') + 6)

  const tokenClaimed = (pending, total, decimals) => {
    if (!pending || !total || typeof decimals === 'undefined') {
      console.error('Invalid inputs for tokenClaimed:', { pending, total, decimals });
      return '0';
    }
    try {
      const result = total.sub(pending);
      const formatted = formatUnits(result, decimals);
      const decimalIndex = formatted.indexOf('.');
      return formatted.slice(0, decimalIndex + 6);
    } catch (error) {
      console.error('Error in tokenClaimed:', error);
      return '0';
    }
  };

  const handleClaimToken = async (token) => {
    console.log(token.token)
    if (!contract) {
        console.error('contract is error');
        return;
    }

    if (!token.token) {
      console.error('token is not right');
      return;
    }

    try {
        const tx = await contract.withdrawFee(token.token);
        console.log('Transaction hash:', tx.hash);

        const receipt = await tx.wait();
        console.log('Claim successful!', receipt);

        refetch();
    } catch (err) {
        console.error('claimed error:', err);
    } finally {
    }
  };

  return (
    <EarnTokenContainer>
      {tokenData && tokenData.tokens.map((token) => (
        <EarnTokenItem key={token.id}>
          <EarnTokenItemInfo>
            <EarnTokenTop>
              <EarnTokenInfo>
                <EarnTokenIcon>
                    {token.symbol === 'ETH' ? (
                      <img src='/images/tokens/eth.png' alt="" />
                    ) : (
                      <EarnTokenNoLogo>
                        {token.symbol?.substring(0, 1) || token.name?.substring(0, 1)}
                        {/* eslint-disable */}
                        <img style={{ width: '48px', height: '48px' }} onError={(e) => {e.currentTarget.style.opacity = '0'}} src={getTokenLogoURL(token.address)} alt="" />
                      </EarnTokenNoLogo>
                    )}
                </EarnTokenIcon>
                {token.symbol}
              </EarnTokenInfo>
              <EarnClaimAmount>+ {tokenRewards(token.pending_balance, token.decimals)}</EarnClaimAmount>
            </EarnTokenTop>
            <EarnTokenNumLine>
              <EarnNumItem>
                {t('Claimed')}
                <EarnTokenClaimed>{tokenClaimed(token.pending_balance, token.total_balance, token.decimals)}</EarnTokenClaimed>
              </EarnNumItem>
              <EarnTotalItem>
                {t('Total')}
                <EarnTokenTotal>{tokenRewards(token.total_balance, token.decimals)}</EarnTokenTotal>
              </EarnTotalItem>
            </EarnTokenNumLine>
          </EarnTokenItemInfo>
          <EarnTokenClaim disabled={!tokenRewards(token.pending_balance, token.decimals)} onClick={() => handleClaimToken(token)}>{t('Claim')}</EarnTokenClaim>
        </EarnTokenItem>
      ))}
    </EarnTokenContainer>
  );
};

export default React.memo(EarnTokenList);
