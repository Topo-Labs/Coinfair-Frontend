import { TokenAmount, Pair, PairV3, Currency } from '@pancakeswap/sdk';
import { useMemo, useEffect } from 'react';
import IPancakePairABI from 'config/abi/IPancakePair.json';
import { Interface } from '@ethersproject/abi';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useMultipleContractSingleData } from '../state/multicall/hooks';
import { wrappedCurrency } from '../utils/wrappedCurrency';

const PAIR_INTERFACE = new Interface(IPancakePairABI);
const poolTypes = [1, 2, 3, 4, 5]
const fees = [1, 3, 5, 10]

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId, account, library } = useActiveWeb3React();

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        try {
          return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined;
        } catch (error: any) {
          console.error(
            error.msg,
            `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`,
            `chainId: ${tokenA?.chainId}`,
          );
          return undefined;
        }
      }),
    [tokens],
  );

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');
  const feeResults = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getFee');

  const pairsData = useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];

      const reserve0 = Array.isArray(reserves) ? reserves[0] : reserves.reserve0;
      const reserve1 = Array.isArray(reserves) ? reserves[1] : reserves.reserve1;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
      ];
    });
  }, [results, tokens, feeResults]);

  useEffect(() => {
    pairsData.forEach(([, pair], i) => {
      const fee = feeResults[i].result ? feeResults[i].result[0].toString() : '0';
      if (pair && fee !== '0') {
        const event = new CustomEvent('onFee', {
          detail: fee,
        });
        window.dispatchEvent(event);
      }
    });
  }, [pairsData, feeResults]);

  return pairsData as any;
}

export function useV3Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, PairV3 | null][] {
  const { chainId } = useActiveWeb3React();

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  );

  const pairAddresses = useMemo(() => {
    return tokens.flatMap(([tokenA, tokenB]) =>
      poolTypes.flatMap((poolType) =>
        fees.map((fee) => {
          try {
            const address = tokenA &&
              tokenB &&
              !tokenA.equals(tokenB)
              ? PairV3.getV3Address(tokenA, tokenB, poolType, fee)
              : undefined;
            return address;
          } catch (error: any) {
            console.error(
              error.msg,
              `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`,
              `chainId: ${tokenA?.chainId}`
            );
            return undefined;
          }
        })
      )
    );
  }, [tokens, poolTypes, fees]);

  const processedPairAddresses = useMemo(() => {
    return tokens.flatMap(([tokenA, tokenB]) =>
      poolTypes.flatMap((poolType) =>
        fees.map((fee) => {
          try {
            const address = tokenA &&
              tokenB &&
              !tokenA.equals(tokenB)
              ? PairV3.getV3Address(tokenA, tokenB, poolType, fee)
              : undefined;
            // console.log(tokenA.symbol, tokenB.symbol, poolType, fee, address)
            return { pairAddress: address, poolType, fee, tokenA, tokenB };
          } catch (error: any) {
            console.error(
              error.msg,
              `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`,
              `chainId: ${tokenA?.chainId}`
            );
            return undefined;
          }
        })
      )
    );
  }, [tokens, poolTypes, fees]);

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');
  // const feeResults = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getFee');

  const pairsData = useMemo(() => {
    // 将 results 分为每 9 个一组，保持与 processedPairAddresses 对应
    const groupedResults = Array.from({ length: Math.ceil(results.length / 9) }, (_, i) =>
      results.slice(i * 9, i * 9 + 9)
    );
  
    return groupedResults.map((group, i) => {
      // 对应的 processedPairAddresses
      return group.map((result, index) => {
        const { result: reserves, loading } = result;
        const { tokenA, tokenB, poolType, fee } = processedPairAddresses[i * 9 + index]; // 获取 tokenA, tokenB, poolType 和 fee
  
        if (loading) return [PairState.LOADING, null];
        if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
        if (!reserves) return [PairState.NOT_EXISTS, null];
  
        // 提取 reserves 值，处理数组或对象的情况
        const reserve0 = Array.isArray(reserves) ? reserves[0] : reserves.reserve0;
        const reserve1 = Array.isArray(reserves) ? reserves[1] : reserves.reserve1;

        // console.log(tokenA.symbol, tokenB.symbol, reserve0.toString(), reserve1.toString())

        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
  
        // 返回 PairState 和新创建的 PairV3 实例，传递 token 和 reserves
        return [
          PairState.EXISTS,
          new PairV3(
            new TokenAmount(token0, reserve0.toString()),  // 传递 tokenA 和 reserve0
            new TokenAmount(token1, reserve1.toString()),  // 传递 tokenB 和 reserve1
            poolType,
            fee
          ),
        ];
      });
    });
  }, [results, processedPairAddresses]); 
  
  // useEffect(() => {
  //   pairsData.forEach(([, pair], i) => {
  //     const fee = feeResults[i].result ? feeResults[i].result[0].toString() : '0';
  //     if (pair && fee !== '0') {
  //       const event = new CustomEvent('onFee', {
  //         detail: fee,
  //       });
  //       window.dispatchEvent(event);
  //     }
  //   });
  // }, [pairsData, feeResults]);

  return pairsData as any;
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const pairCurrencies = useMemo<[Currency, Currency][]>(() => [[tokenA, tokenB]], [tokenA, tokenB]);
  return usePairs(pairCurrencies)[0];
}

export function useV3Pair(tokenA?: Currency, tokenB?: Currency) {
  const pairCurrencies = useMemo<[Currency, Currency][]>(() => [[tokenA, tokenB]], [tokenA, tokenB]);
  const allPairs = useV3Pairs(pairCurrencies)
  const response = allPairs.flatMap(first => 
    first.filter(second => second[1])
  )
  return response;
}
