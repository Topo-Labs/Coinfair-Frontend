import { createClient, gql, Client } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core';

export const clientClaim: Client = createClient({
  url: 'https://gateway.thegraph.com/api/d24439ea36740b0a941d4851ddf60e1d/subgraphs/id/ACumRwchwYzwKaFS3nygHymnbFkGJs8DMdtKS2c1KyyG',
  exchanges: [cacheExchange, fetchExchange],
});

export const clientMint: Client = createClient({
  url: 'https://gateway.thegraph.com/api/d24439ea36740b0a941d4851ddf60e1d/subgraphs/id/GgLfA8JnMo8595h9myC4Gxs3HyfjqDVg4a9vWw6hnEjC',
  exchanges: [cacheExchange, fetchExchange],
});

export const CLAIM_HISTORY_DATA = gql`
  query {
    collectFees(first: 10, 
      where: {
        parent: $parent
      }) {
      token
      parentAmount
      owner
      blockTimestamp
    }
  }
`;

// export const MINT_HISTORY_DATA = gql``