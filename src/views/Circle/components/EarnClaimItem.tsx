import React, { useEffect, useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import { TREASURY_ADDRESS } from '@pancakeswap/sdk';
import { useMatchBreakpointsContext } from '@pancakeswap/uikit';
import TreasuryABI from '@pancakeswap/sdk/src/abis/Coinfair_Treasury.json';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { EarnAmountTotal, EarnClaimAmount, EarnClaimButton, EarnClaimedAomunt, EarnClaimGroup, EarnClaimLast, EarnClaimSelect, EarnClaimTBottom, EarnClaimTItem, EarnTBottomGroup, EarnTBottomName, EarnTokenIcon, EarnTokenInfo, EarnTokenNoLogo } from './styles';

export default function EarnClaimItem({ token }) {
  const { chainId, account, library } = useActiveWeb3React();
  const [contract, setContract] = useState(null);
  const [claimTotal, setClaimTotal] = useState('0');
  const [claimAmount, setClaimAmount] = useState('0');
  const [claimPending, setClaimPending] = useState('0');
  const [hasRewards, setHasRewards] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isDesktop } = useMatchBreakpointsContext()

  const fetchClaims = async (_contract) => {
    try {
      const total = await _contract.CoinfairUsrTreasuryTotal(account, token.address);
      const pending = await _contract.CoinfairUsrTreasury(account, token.address);
      const amount = total.sub(pending);

      setClaimTotal(formatUnits(total, token.decimals).slice(0, formatUnits(total, token.decimals).indexOf('.') + 6));
      setClaimAmount(formatUnits(amount, token.decimals).slice(0, formatUnits(amount, token.decimals).indexOf('.') + 6));
      setClaimPending(formatUnits(pending, token.decimals).slice(0, formatUnits(pending, token.decimals).indexOf('.') + 6));
      setHasRewards(pending.gt(0)); // 如果返佣奖励大于 0，启用按钮
    } catch (err) {
      setHasRewards(false);
      fetchClaims(contract); // 领取成功后重新请求三个值
      console.error('查询返佣奖励失败:', err);
    }
  };

  useEffect(() => {
    if (account && token.address && chainId && library && TREASURY_ADDRESS[chainId]) {
      const _contract = new Contract(TREASURY_ADDRESS[chainId], TreasuryABI, library.getSigner(account));
      setContract(_contract);
      fetchClaims(_contract); // 领取成功后重新请求三个值
    }
  }, [account, token?.address, chainId, library]);

  const handleClaimToken = async () => {
    if (!contract) {
        console.error('合约未正确加载');
        return;
    }

    if (!token.address) {
      console.error('token位置领取失败');
      return;
    }

    setIsClaiming(true);

    try {
        const tx = await contract.withdrawFee(token.address); // 调用合约中的 withdrawFee 函数
        console.log('Transaction hash:', tx.hash);

        // 等待交易确认
        const receipt = await tx.wait();
        console.log('Claim successful!', receipt);

        // 成功后，更新奖励状态
        setHasRewards(false);
        fetchClaims(contract);
    } catch (err) {
        console.error('领取失败:', err);
    } finally {
        setIsClaiming(false);
    }
  };

  return (
    <>
      {
        isDesktop ? (
          <EarnClaimTItem>
            <EarnTokenInfo>
              <EarnTokenIcon>
                {token.tokenInfo ? (
                  <img src={token.tokenInfo?.logoURI} alt="" />
                ) : (
                  <EarnTokenNoLogo>
                    {token.symbol?.substring(0, 1) || token.name?.substring(0, 1)}
                  </EarnTokenNoLogo>
                )}
              </EarnTokenIcon>
              {token.symbol}
            </EarnTokenInfo>
            <EarnClaimAmount>{claimPending}</EarnClaimAmount>
            <EarnClaimedAomunt>{claimAmount}</EarnClaimedAomunt>
            <EarnAmountTotal>{claimTotal}</EarnAmountTotal>
            <EarnClaimLast>
              <EarnClaimButton disabled={!hasRewards} onClick={handleClaimToken}>Claim</EarnClaimButton>
            </EarnClaimLast>
          </EarnClaimTItem>
        ) : (
          <EarnClaimGroup isOpen={isOpen}>
            <EarnClaimTItem>
              <EarnTokenInfo>
                <EarnTokenIcon>
                  {token.tokenInfo ? (
                    <img src={token.tokenInfo?.logoURI} alt="" />
                  ) : (
                    <EarnTokenNoLogo>
                      {token.symbol?.substring(0, 1) || token.name?.substring(0, 1)}
                    </EarnTokenNoLogo>
                  )}
                </EarnTokenIcon>
                {token.symbol}
              </EarnTokenInfo>
              <EarnClaimAmount>{claimPending}</EarnClaimAmount>
              <EarnClaimLast>
                <EarnClaimButton disabled={!hasRewards} onClick={handleClaimToken}>Claim</EarnClaimButton>
              </EarnClaimLast>
              <EarnClaimSelect onClick={() => setIsOpen((prev) => !prev)} src='/images/item-arrow.svg' isOpen={isOpen}/>
            </EarnClaimTItem>
            <EarnClaimTBottom isOpen={isOpen}>
              <EarnTBottomGroup>
                <EarnTBottomName>Claimed</EarnTBottomName>
                <EarnClaimedAomunt>{claimAmount}</EarnClaimedAomunt>
              </EarnTBottomGroup>
              <EarnTBottomGroup>
                <EarnTBottomName>Total</EarnTBottomName>
                <EarnAmountTotal>{claimTotal}</EarnAmountTotal>
              </EarnTBottomGroup>
            </EarnClaimTBottom>
          </EarnClaimGroup>
        )
      }
    </>
  );
}
