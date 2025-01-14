import { createClient, gql, Client } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core';

export const clientEth: Client = createClient({
  url: 'https://gateway.thegraph.com/api/9a78d6010b39f533aba5209e0a99bc7d/subgraphs/id/FWZ5hkYqRDMpo4s2Rdnc3b3nPfPPE6PTcxEdupYS7qN',
  exchanges: [cacheExchange, fetchExchange],
});

export const clientBase: Client = createClient({
  url: 'https://gateway.thegraph.com/api/9a78d6010b39f533aba5209e0a99bc7d/subgraphs/id/FdWtjVoHKznZjvTUEua54Hiogi9swwwe2e5imE9a4yXe',
  exchanges: [cacheExchange, fetchExchange],
});

export const clientBSC: Client = createClient({
  url: 'https://gateway.thegraph.com/api/9a78d6010b39f533aba5209e0a99bc7d/subgraphs/id/84gyab1peMD1esN7LdKTg9VyoGJhtmUQugvfgcoZMqJJ',
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
