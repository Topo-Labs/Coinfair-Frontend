import { ChainId, JSBI, Percent, Token } from '@pancakeswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { goerliTokens, bscTokens, bscTestnetTokens, arbTestnetTokens, opBNBTokens, scrollTestnetToken, scrollToken } from './tokens'
import { ChainTokenList } from './types'

export const ROUTER_ADDRESS = {
  [ChainId.GOERLI]: '0x76155E29e441559B7b047d75E079F13b8F9179b9',
  [ChainId.BSC]: '0x8099414Dde7A1f06fa5a877E6E424E4B62A032e6',
  [ChainId.BSC_TESTNET]: '0x66378b7abED49802798923998a8239f6f57cF39D',
  [ChainId.ARB_TESTNET]: '0x0B0c953Ac2DB11c469aA90D780594A3B6B87F7e3',
  [ChainId.opBNB]: '0x5a42CA48034FdF30A8cB3a077B18a7c641012982',
  [ChainId.SCROLL_TESTNET]: '0xDC80625F25C2d78082F78610eEAC7dc28b5259F2',
  [ChainId.SCROLL]: '0x95074bFCC3bF400E6De39cd553e3b51Bd7619925'
}

export const AIRDOP_ADDRESS = {
  [ChainId.BSC_TESTNET]: '0xC568A77878EB50C61b807F4E26437b6B0B6d3B02',
  [ChainId.ARB_TESTNET]: '0x6860c458e3854C86CeD18eCDBC299749F29629b3'
}

export const MINT_ADDRESS = {
  [ChainId.BSC_TESTNET]: '0x0FDD73F79Bcb84Ac6c81805b50A452a61Bb0B2Cc',
}

export const HAND_NFT_ADDRESS = {
  [ChainId.BSC_TESTNET]: '0xD8e6800511A23ab3B30E7175D5831894b8390529',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.GOERLI]: [goerliTokens.pe, goerliTokens.usdt],
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.pe,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
    bscTokens.pv
  ],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.usdt, bscTestnetTokens.es, bscTestnetTokens.ms, bscTestnetTokens.testToken, bscTestnetTokens.testToken1],
  [ChainId.ARB_TESTNET]: [arbTestnetTokens.pe, arbTestnetTokens.usdt],
  [ChainId.ETHEREUM]: [],
  [ChainId.opBNB]: [opBNBTokens.PV001, opBNBTokens.PV002, opBNBTokens.wbnb],
  [ChainId.ARB]: [],
  [ChainId.ZKSYNC]: [],
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.SCROLL_TESTNET]: [scrollTestnetToken.USDT, scrollTestnetToken.p1, scrollTestnetToken.p2, scrollTestnetToken.p3],
  [ChainId.SCROLL]: [scrollToken.WBTC, scrollToken.USDT]
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.GOERLI]: [goerliTokens.pe, goerliTokens.usdt],
  [ChainId.BSC]: [bscTokens.usdt, bscTokens.pv, bscTokens.usdc],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.testToken, bscTestnetTokens.testToken1, bscTestnetTokens.testToken2, bscTestnetTokens.pe, bscTestnetTokens.usdt, bscTestnetTokens.es, bscTestnetTokens.ms, bscTestnetTokens.ew],
  [ChainId.ARB_TESTNET]: [arbTestnetTokens.pe, arbTestnetTokens.usdt],
  [ChainId.ETHEREUM]: [],
  [ChainId.ARB]: [],
  [ChainId.ZKSYNC]: [],
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.opBNB]: [opBNBTokens.PV001, opBNBTokens.PV002, opBNBTokens.wbnb],
  [ChainId.SCROLL_TESTNET]: [scrollTestnetToken.p1, scrollTestnetToken.p2, scrollTestnetToken.p3],
  [ChainId.SCROLL]: [scrollToken.WBTC, scrollToken.USDT]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.GOERLI]: [goerliTokens.pe, goerliTokens.usdt],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.pe, bscTokens.busd, bscTokens.usdt],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.usdt, bscTestnetTokens.pe, bscTestnetTokens.es, bscTestnetTokens.ms, bscTestnetTokens.ew],
  [ChainId.ARB_TESTNET]: [arbTestnetTokens.pe, arbTestnetTokens.usdt],
  [ChainId.ETHEREUM]: [],
  [ChainId.ARB]: [],
  [ChainId.ZKSYNC]: [],
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.opBNB]: [opBNBTokens.PV001, opBNBTokens.PV002, opBNBTokens.wbnb],
  [ChainId.SCROLL_TESTNET]: [scrollTestnetToken.p1, scrollTestnetToken.p2, scrollTestnetToken.p3],
  [ChainId.SCROLL]: [scrollToken.WBTC, scrollToken.USDT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSC]: [
    [bscTokens.pe, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
}

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_TEN = JSBI.BigInt(10)

// one basis point
export const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(JSBI.BigInt(30), BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'BNB'
// PE
export const DEFAULT_OUTPUT_CURRENCY = 'PE'

// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'equityswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000)

export const LIMIT_ORDERS_DOCS_URL = 'https://www.peopleequity.club/doc'
