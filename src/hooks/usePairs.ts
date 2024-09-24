import { TokenAmount, Pair, Currency } from '@pancakeswap/sdk';
import { useMemo, useEffect, useState, useRef } from 'react';
import IPancakePairABI from 'config/abi/IPancakePair.json';
import TreasuryABI from 'config/abi/Coinfair_Treasury.json';
import { Interface } from '@ethersproject/abi';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useMultipleContractSingleData } from '../state/multicall/hooks';
import { wrappedCurrency } from '../utils/wrappedCurrency';

const PAIR_INTERFACE = new Interface(IPancakePairABI);
const GET_ALLPAIR = new Interface(TreasuryABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId, account, library } = useActiveWeb3React();
  const previousTokensRef = useRef<string[]>([]);
  // const [pairAddr, setPairAddr] = useState<(string | undefined)[]>([]);

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  );

  // const fetchPairAddresses = async () => {
  //   const addresses = await Promise.all(
  //     tokens.map(async ([tokenA, tokenB]) => {
  //       if (!tokenA || !tokenB || tokenA.equals(tokenB)) return undefined;
  
  //       return new Promise<string | undefined>((resolve) => {
  //         Pair.getPairAddress(tokenA, tokenB, library.getSigner(account), account, (address: string | null) => {
  //           resolve(address || undefined);
  //         });
  //       });
  //     })
  //   );
  
  //   console.log(addresses, 'addressesaddressesaddresses');
  //   setPairAddr(addresses); // 在这里再设置状态
  // };

  // useEffect(() => {
  //   const fetchPairAddresses = async () => {
  //     const addresses = await Promise.all(
  //       tokens.map(async ([tokenA, tokenB]) => {
  //         if (!tokenA || !tokenB || tokenA.equals(tokenB)) return undefined;

  //         return new Promise<string | undefined>((resolve) => {
  //           Pair.getPairAddress(tokenA, tokenB, library.getSigner(account), account, (address: string | null) => {
  //             resolve(address || undefined);
  //           });
  //         });
  //       })
  //     );

  //     console.log(addresses, 'addresses');
  //     setPairAddr(addresses);
  //   };

  //   // 仅在 tokens 变化时请求
  //   if (tokens.length > 0) {
  //     fetchPairAddresses();
  //   }
  // }, [tokens.join(',')]); // 使用字符串来减少依赖项的变化

  // console.log(pairAddr, 'pairAddrpairAddrpairAddr::::')

  // useEffect(() => {
  //   const currentTokens = tokens.map(([tokenA, tokenB]) => `${tokenA?.address}-${tokenB?.address}`).join(',');
  //   if (currentTokens !== previousTokensRef.current.join(',')) {
  //     previousTokensRef.current = tokens.map(([tokenA, tokenB]) => `${tokenA?.address}-${tokenB?.address}`);
  //     fetchPairAddresses();
  //   }
  // }, [tokens]);

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        try {
          Pair.getPairAddress(tokenA, tokenB, library.getSigner(account), account, (address: string) => {
            if (address) {
              // console.log('Pair address:', address);
            } else {
              console.log('Failed to fetch pair address');
            }
          })
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

  console.log(pairAddresses, 'pairAddresses:::')

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

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  // 如果 tokenA 或 tokenB 为 null 或 undefined，返回默认值
  if (!tokenA || !tokenB) {
    return [PairState.INVALID, null];
  }
  
  const pairCurrencies = useMemo<[Currency, Currency][]>(() => [[tokenA, tokenB]], [tokenA, tokenB]);
  return usePairs(pairCurrencies)[0];
}
