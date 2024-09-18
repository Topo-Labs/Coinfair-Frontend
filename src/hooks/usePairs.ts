import { TokenAmount, Pair, Currency } from '@pancakeswap/sdk';
import { useMemo, useEffect } from 'react';
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

export function usePairs(currencies: [Currency | undefined, Currency | undefined][], amm: string): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React();

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

  console.log(pairAddresses, tokens)

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

  console.log(pairsData, results, 'pairsDatapairsData')

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

export function usePair(tokenA?: Currency, tokenB?: Currency, amm?: string): [PairState, Pair | null] {
  const pairCurrencies = useMemo<[Currency, Currency][]>(() => [[tokenA, tokenB]], [tokenA, tokenB]);
  console.log(pairCurrencies, 'pairCurrencies123123123')
  return usePairs(pairCurrencies, amm)[0];
}
