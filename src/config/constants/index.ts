// used to construct the list of all pairs we consider by default in the frontend
import { ChainId, Token } from '@pancakeswap/sdk'
import { goerliTokens, bscTokens, bscTestnetTokens, arbTestnetTokens, opBNBTokens, scrollTestnetToken, scrollToken } from './tokens'
import { ChainTokenList } from './types'

export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.GOERLI]: [goerliTokens.pe, goerliTokens.usdt],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.pe, bscTestnetTokens.busd],
  [ChainId.ARB_TESTNET]: [arbTestnetTokens.pe, arbTestnetTokens.usdt],
  [ChainId.ETHEREUM]: [],
  [ChainId.opBNB]: [opBNBTokens.PV001, opBNBTokens.PV002],
  [ChainId.ARB]: [],
  [ChainId.ZKSYNC]: [],
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.SCROLL_TESTNET]: [scrollTestnetToken.USDT, scrollTestnetToken.p1],
  [ChainId.SCROLL]:[scrollToken.WBTC, scrollToken.USDT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC]: [
    [bscTokens.pe, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
}

export const NetworkContextName = 'NETWORK'

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
]

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export { default as farmsConfig } from './farms'
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

export const NOT_ON_SALE_SELLER = '0x0000000000000000000000000000000000000000'

export const FARM_AUCTION_HOSTING_IN_SECONDS = 604800

export const PREDICTION_TOOLTIP_DISMISS_KEY = 'prediction-switcher-dismiss-tooltip'

// Gelato uses this address to define a native currency in all chains
export const GELATO_NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const EXCHANGE_DOCS_URLS = 'https://www.peopleequity.club/doc'
