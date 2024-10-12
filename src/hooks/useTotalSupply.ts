import { BigNumber } from '@ethersproject/bignumber'
import { PairV3, Token, TokenAmount } from '@pancakeswap/sdk'
import { useTokenContract, useTokenContracts } from './useContract'
import { useMultipleCallResults, useSingleCallResult } from '../state/multicall/hooks'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined
}

export function useTotalSupplyV3(pairs: PairV3[]): (TokenAmount | undefined)[] {
  const tokens = pairs.map(pair => pair.liquidityToken);
  const tokenAddresses = tokens.map(token => token?.address);

  const contracts = useTokenContracts(tokenAddresses, false);
  const totalSupplys = useMultipleCallResults(contracts, 'totalSupply');

  return tokens.map((token, index) => {
    const totalSupplyResult = totalSupplys[index]?.result?.[0];

    return token && totalSupplyResult
      ? new TokenAmount(token, totalSupplyResult.toString())
      : undefined;
  });
}
