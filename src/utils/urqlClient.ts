import { createClient, gql, Client } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core';

export const clientClaim: Client = createClient({
  url: 'https://gateway.thegraph.com/api/d24439ea36740b0a941d4851ddf60e1d/subgraphs/id/HBvQgCQCSvNyTY5VdyPGf2tZpVrhjmwkuKwYJDX7M7SQ',
  exchanges: [cacheExchange, fetchExchange],
});

export const clientMint: Client = createClient({
  url: 'https://gateway.thegraph.com/api/d24439ea36740b0a941d4851ddf60e1d/subgraphs/id/ETCUAbvTHiyPSfXKznxMmKQ3hUBA8uG8Deg1xkiw77R7',
  exchanges: [cacheExchange, fetchExchange],
});

// 添加 $parent 变量并定义为 String 类型
export const CLAIM_HISTORY_DATA = gql`
  query($parent: String!) {
    collectFees(first: 10, where: { parent: $parent }) {
      token
      parentAmount
      owner
      blockTimestamp
    }
  }
`;

// 添加 $minter 变量并定义为 String 类型
export const MINT_HISTORY_DATA = gql`
  query($minter: String!) {
    claims(first: 5, where: { minter: $minter }) {
      id
      minter
      claimer
      blockTimestamp
    }
  }
`;
