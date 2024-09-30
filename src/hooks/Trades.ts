/* eslint-disable no-param-reassign */
import { isTradeBetter } from 'utils/trades';
import { Currency, CurrencyAmount, Pair, PairV3, Token, Trade } from '@pancakeswap/sdk';
import flatMap from 'lodash/flatMap';
import { useMemo } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useUserSingleHopOnly } from 'state/user/hooks';
import {
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
  BETTER_TRADE_LESS_HOPS_THRESHOLD,
  ADDITIONAL_BASES,
} from 'config/constants/exchange';
import { Interface } from '@ethersproject/abi';
import IPancakePairABI from 'config/abi/IPancakePair.json';
import { PairState, usePairs, useV3Pairs } from './usePairs';
import { wrappedCurrency } from '../utils/wrappedCurrency';
import { useUnsupportedTokens, useWarningTokens } from './Tokens';
import { useMultipleContractSingleData } from '../state/multicall/hooks';

const PAIR_INTERFACE = new Interface(IPancakePairABI);

const poolTypes = [1, 2, 4]
const fees = [3, 5, 10]

export function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): PairV3[] {
  const { chainId } = useActiveWeb3React();

  const [tokenA, tokenB] = useMemo(() => {
    if (!chainId) return [undefined, undefined];
    const wrappedA = wrappedCurrency(currencyA, chainId);
    const wrappedB = wrappedCurrency(currencyB, chainId);
    return [wrappedA, wrappedB];
  }, [currencyA, currencyB, chainId]);

  const bases: Token[] = useMemo(() => {
    if (!chainId || !tokenA || !tokenB) return [];

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];
    const additionalA = ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [];
    const additionalB = ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [];

    return [...common, ...additionalA, ...additionalB];
  }, [chainId, tokenA, tokenB]);

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
    [bases],
  );

  const allPairCombinations: [Token, Token][] = useMemo(() => {
    if (!tokenA || !tokenB) return [];
    
    const pairs = [
      [tokenA, tokenB],
      ...bases.map((base): [Token, Token] => [tokenA, base]),
      ...bases.map((base): [Token, Token] => [tokenB, base]),
      ...basePairs,
    ];

    return pairs
      .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
      .filter(([t0, t1]) => t0.address !== t1.address)
      .filter(([tokenA_, tokenB_]) => {
        const customBases = CUSTOM_BASES[chainId];
        const customBasesA = customBases?.[tokenA_.address];
        const customBasesB = customBases?.[tokenB_.address];

        if (!customBasesA && !customBasesB) return true;
        if (customBasesA && !customBasesA.some((base) => tokenB_.equals(base))) return false;
        if (customBasesB && !customBasesB.some((base) => tokenA_.equals(base))) return false;

        return true;
      });
  }, [tokenA, tokenB, bases, basePairs, chainId]);

  function isExistsPair(result: any): result is [PairState.EXISTS, Pair] {
    return result[0] === PairState.EXISTS && !!result[1];
  }

  // const allPairs = usePairs(allPairCombinations).filter(
  //   (result): result is [PairState.EXISTS, Pair] => result[0] === PairState.EXISTS && !!result[1],
  // );

  const allV3Pairs = useV3Pairs(allPairCombinations).map((group) =>
    group.filter(isExistsPair)
  );

  // console.log('allV3Pairs::::', allV3Pairs[0])

  // const validPairAddresses = allPairs.map(([, pair]) => Pair.getAddress(pair.token0, pair.token1));
  
  const validPairV3Addresses = allV3Pairs.flatMap((group) =>
    group.flatMap((result) => {
      if (!isExistsPair(result)) {
        return [];
      }
      const [, pair] = result;
      return poolTypes.flatMap((poolType) =>
        fees.map((fee) =>
          PairV3.getV3Address(pair.token0, pair.token1, poolType, fee)
        )
      );
    })
  );

  // const exponentsResult = useMultipleContractSingleData(validPairAddresses, PAIR_INTERFACE, 'getExponents');
  const exponentsResultV3 = useMultipleContractSingleData(validPairV3Addresses, PAIR_INTERFACE, 'getExponents');
  
  // exponentsResult.forEach((result, i) => {
  //   const { result: exponents, loading } = result;
  //   if (loading || !exponents) {
  //     allPairs[i][1]?.setExponents('100', '100');
  //   } else {
  //     const [exponent0, exponent1] = Array.isArray(exponents)
  //       ? exponents
  //       : [exponents.exponent0, exponents.exponent1];
  //     allPairs[i][1]?.setExponents(exponent0.toString(), exponent1.toString());
  //   }
  // });

  // 将 exponentsResultV3 按每 9 个分组
  const groupedResults = Array.from(
    { length: Math.ceil(exponentsResultV3.length / 9) },
    (_, i) => exponentsResultV3.slice(i * 9, i * 9 + 9)
  );

  // console.log(groupedResults, 'groupedResultsgroupedResultsgroupedResults')

  // 类型守卫函数，确保 item 是 [PairState, Pair]
  function isValidPair(item: any): item is [PairState, Pair] {
    return Array.isArray(item) && item.length === 2 && item[0] === PairState.EXISTS && item[1] instanceof Pair;
  }
  
  // 类型守卫函数，确保 result 是 { result: any; loading: boolean }
  function isValidResult(result: any): result is { result: any; loading: boolean } {
    return result && typeof result === 'object' && 'loading' in result && 'result' in result;
  }

  allV3Pairs.forEach((group, groupIndex) => {
    // 获取对应的分组结果
    const results = groupedResults[groupIndex];
  
    // 遍历每组中的 pair 和对应的 result
    group.forEach((item, pairIndex) => {
      // 使用类型守卫函数检查 item 是否为 [PairState, Pair]
      if (!isValidPair(item)) return;
      const [, pair] = item;
      // 获取当前 pair 对应的 result，并使用类型守卫检查 result
      const result = results?.[pairIndex];
      if (!isValidResult(result)) return;
      const { result: exponents, loading } = result;
      // 更新 pair 的指数
      if (loading || !exponents) {
        pair.setExponents('100', '100'); // 设置默认指数值
      } else {
        // 提取 exponent0 和 exponent1
        const [exponent0, exponent1] = Array.isArray(exponents)
          ? exponents
          : [exponents.exponent0, exponents.exponent1];
        pair.setExponents(exponent0.toString(), exponent1.toString()); // 更新指数
      }
    });
  });

  // 类型守卫函数，确保 pairEntry 是 [PairState, PairV3] 结构
  function isValidPairEntry(entry: any): entry is [PairState, PairV3] {
    return Array.isArray(entry) && entry.length === 2 && entry[1] instanceof PairV3;
  }

  return useMemo(() => {
    // 将 allV3Pairs（即 pairData）展平为一维数组，并确保 pair 存在
    const flatPairs = allV3Pairs.flatMap(group =>
      group.map((pairEntry) => {
        // 使用类型守卫函数确保 pairEntry 是 [PairState, PairV3]
        if (isValidPairEntry(pairEntry)) {
          return pairEntry[1]; // 只返回 PairV3
        }
        return null;
      }).filter(Boolean) // 确保 pair 存在
    );
  
    // 使用 reduce 构建唯一的 PairV3 映射，基于 liquidityToken.address 去重
    const uniquePairs = Object.values(
      flatPairs.reduce<{ [pairAddress: string]: PairV3 }>((memo, pair) => {
        // 确保只存储唯一的 liquidityToken.address
        memo[pair.liquidityToken.address] = memo[pair.liquidityToken.address] ?? pair;
        return memo;
      }, {})
    );

    // console.log(uniquePairs, 'uniquePairsuniquePairs')
  
    return uniquePairs;
  }, [allV3Pairs]);
}

const MAX_HOPS = 3;

export function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Trade | null {
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut);
  // console.log(allowedPairs, 'allowedPairsallowedPairs::')
  const [singleHopOnly] = useUserSingleHopOnly();

  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 1, maxNumResults: 1 })[0] ??
          null
        );
      }

      let bestTradeSoFar: Trade | null = null;
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade = Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, {
          maxHops: i,
          maxNumResults: 1,
        })[0] ?? null;
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade;
        }
      }
      return bestTradeSoFar;
    }
    return null;
  }, [allowedPairs, currencyAmountIn, currencyOut, singleHopOnly]);
}

export function useTradeExactOut(currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Trade | null {
  const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency);
  const [singleHopOnly] = useUserSingleHopOnly();

  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: 1, maxNumResults: 1 })[0] ??
          null
        );
      }

      let bestTradeSoFar: Trade | null = null;
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade = Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, {
          maxHops: i,
          maxNumResults: 1,
        })[0] ?? null;
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade;
        }
      }
      return bestTradeSoFar;
    }
    return null;
  }, [allowedPairs, currencyIn, currencyAmountOut, singleHopOnly]);
}

export function useIsTransactionUnsupported(currencyIn?: Currency, currencyOut?: Currency): boolean {
  const unsupportedTokens = useUnsupportedTokens();
  const { chainId } = useActiveWeb3React();

  const tokenIn = wrappedCurrency(currencyIn, chainId);
  const tokenOut = wrappedCurrency(currencyOut, chainId);

  if (!unsupportedTokens || !tokenIn || !tokenOut) return false;

  return unsupportedTokens[tokenIn.address] || unsupportedTokens[tokenOut.address];
}

export function useIsTransactionWarning(currencyIn?: Currency, currencyOut?: Currency): boolean {
  const warningTokens = useWarningTokens();
  const { chainId } = useActiveWeb3React();

  const tokenIn = wrappedCurrency(currencyIn, chainId);
  const tokenOut = wrappedCurrency(currencyOut, chainId);

  if (!warningTokens || !tokenIn || !tokenOut) return false;

  return warningTokens[tokenIn.address] || warningTokens[tokenOut.address];
}
