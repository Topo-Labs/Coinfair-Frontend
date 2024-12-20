import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { ETHER, Token, TREASURY_ADDRESS } from '@pancakeswap/sdk';
import { useTranslation } from '@pancakeswap/localization';
import { useMatchBreakpointsContext } from '@pancakeswap/uikit';
import TreasuryABI from '@pancakeswap/sdk/src/abis/Coinfair_Treasury.json';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useHttpLocations from 'hooks/useHttpLocations';
import getTokenLogoURL from 'utils/getTokenLogoURL';
import { WrappedTokenInfo } from 'state/types';
import Logo from 'components/Logo/Logo';
import { EarnAmountTotal, EarnClaimAmount, EarnClaimButton, EarnClaimedAomunt, EarnClaimGroup, EarnClaimLast, EarnClaimSelect, EarnClaimTBottom, EarnClaimTItem, EarnTBottomGroup, EarnTBottomName, EarnTokenIcon, EarnTokenInfo, EarnTokenNoLogo } from './styles';

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  background: #fff;
`

export default function EarnClaimKaola({ token, refetch }) {
  const { chainId, account, library } = useActiveWeb3React();
  const [contract, setContract] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [claimAmount, setClaimAmount] = useState('0');
  const [claimPending, setClaimPending] = useState('0');
  const [hasRewards, setHasRewards] = useState(false);
  const { isDesktop } = useMatchBreakpointsContext()

  const { t } =  useTranslation()

  const fetchClaims = async (_contract) => {
    try {
      const alreadyAmount = await _contract.withdrawAmount(account, token.address);
      const pendingAmount = await _contract.waitingWithdraw(account, token.address);
      // const amount = total.sub(pending);
      // setClaimTotal(formatUnits(total, token.decimals).slice(0, formatUnits(total, token.decimals).indexOf('.') + 6));
      setClaimAmount(formatUnits(alreadyAmount, token.decimals).slice(0, formatUnits(alreadyAmount, token.decimals).indexOf('.') + 6));
      setClaimPending(formatUnits(pendingAmount, token.decimals).slice(0, formatUnits(pendingAmount, token.decimals).indexOf('.') + 6));
      setHasRewards(pendingAmount.gt(0));
    } catch (err) {
      setHasRewards(false);
      fetchClaims(contract);
      console.error('查询返佣奖励失败:', err);
    }
  };

  useEffect(() => {
    if (account && library) {
      const _contract = new Contract('0xAdF6a8D84833F591FC86a8dBA217818c373a1CD7', TreasuryABI, library.getSigner(account));
      setContract(_contract);
      fetchClaims(_contract);
    }
  }, [account, library]);

  console.log(claimAmount, claimPending, 123)

  const tokenRewards = (pending, decimals) => formatUnits(pending, decimals).slice(0, formatUnits(pending, decimals).indexOf('.') + 6)

  const tokenClaimed = (pending, total, decimals) => {
    if (!pending || !total || typeof decimals === 'undefined') {
      console.error('Invalid inputs for tokenClaimed:', { pending, total, decimals });
      return '0';
    }
    try {
      const totalBN = BigNumber.from(total);
      const pendingBN = BigNumber.from(pending);
      const result = totalBN.sub(pendingBN);
      const formatted = formatUnits(result, decimals);
      const decimalIndex = formatted.indexOf('.');
      return formatted.slice(0, decimalIndex + 6);
    } catch (error) {
      return '0';
    }
  };

  const handleClaimToken = async () => {
    if (!contract) {
        console.error('合约未正确加载');
        return;
    }

    if (!token.token) {
      console.error('token位置领取失败');
      return;
    }

    try {
        const tx = await contract.withdrawFee(token.token);
        console.log('Transaction hash:', tx.hash);

        const receipt = await tx.wait();
        console.log('Claim successful!', receipt);

        refetch();
    } catch (err) {
        console.error('领取失败:', err);
    }
  };

  return (
    <>
      {
        isDesktop ? (
          <EarnClaimTItem>
            <EarnTokenInfo>
              <EarnTokenIcon>
                  {token.symbol === 'ETH' ? (
                    <img src='/images/tokens/eth.png' alt="" />
                  ) : (
                    <EarnTokenNoLogo>
                      {token.symbol?.substring(0, 1) || token.name?.substring(0, 1)}
                      {/* eslint-disable */}
                      <img onError={(e) => {e.currentTarget.style.opacity = '0'}} src={getTokenLogoURL(token.token)} alt="" />
                    </EarnTokenNoLogo>
                  )}
              </EarnTokenIcon>
              {token.symbol}
            </EarnTokenInfo>
            <EarnClaimAmount>{tokenRewards(token.pending_balance, token.decimals)}</EarnClaimAmount>
            <EarnClaimedAomunt>{tokenClaimed(token.pending_balance, token.total_balance, token.decimals)}</EarnClaimedAomunt>
            <EarnAmountTotal>{tokenRewards(token.total_balance, token.decimals)}</EarnAmountTotal>
            <EarnClaimLast>
              <EarnClaimButton disabled={tokenRewards(token.pending_balance, token.decimals) === '0.0' || tokenRewards(token.pending_balance, token.decimals) === '0'} onClick={handleClaimToken}>{t('Claim')}</EarnClaimButton>
            </EarnClaimLast>
          </EarnClaimTItem>
        ) : (
          <EarnClaimGroup isOpen={isOpen}>
            <EarnClaimTItem>
              <EarnTokenInfo>
                <EarnTokenIcon>
                  {token.symbol === 'ETH' ? (
                    <img src='/images/tokens/eth.png' alt="" />
                  ) : (
                    <EarnTokenNoLogo>
                      {token.symbol?.substring(0, 1) || token.name?.substring(0, 1)}
                      {/* eslint-disable */}
                      <img onError={(e) => {e.currentTarget.style.opacity = '0'}} src={getTokenLogoURL(token.token)} alt="" />
                    </EarnTokenNoLogo>
                  )}
                </EarnTokenIcon>
                {token.symbol}
              </EarnTokenInfo>
              <EarnClaimAmount>{tokenRewards(token.pending_balance, token.decimals)}</EarnClaimAmount>
              <EarnClaimLast>
                <EarnClaimButton disabled={tokenRewards(token.pending_balance, token.decimals) === '0.0' || tokenRewards(token.pending_balance, token.decimals) === '0'} onClick={handleClaimToken}>{t('Claim')}</EarnClaimButton>
              </EarnClaimLast>
              <EarnClaimSelect onClick={() => setIsOpen((prev) => !prev)} src='/images/item-arrow.svg' isOpen={isOpen}/>
            </EarnClaimTItem>
            <EarnClaimTBottom isOpen={isOpen}>
              <EarnTBottomGroup>
                <EarnTBottomName>{t('Claimed')}</EarnTBottomName>
                <EarnClaimedAomunt>{tokenClaimed(token.pending_balance, token.total_balance, token.decimals)}</EarnClaimedAomunt>
              </EarnTBottomGroup>
              <EarnTBottomGroup>
                <EarnTBottomName>{t('Total')}</EarnTBottomName>
                <EarnAmountTotal>{tokenRewards(token.total_balance, token.decimals)}</EarnAmountTotal>
              </EarnTBottomGroup>
            </EarnClaimTBottom>
          </EarnClaimGroup>
        )
      }
    </>
  );
}
