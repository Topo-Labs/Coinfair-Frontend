import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | number | string

export enum ChainId {
  ETHEREUM = 1,
  // RINKEBY = 4,
  GOERLI = 5,
  BSC = 56,
  opBNB = 204,
  BSC_TESTNET = 97,
  ARB_TESTNET = 421613,
  ARB = 42161,
  ZKSYNC = 324,
  ZKSYNC_TESTNET = 280,
  SCROLL_TESTNET = 534351,
  SCROLL = 534352,
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const FACTORY_ADDRESS_MAP = {
  [ChainId.GOERLI]: '0xa373C0460cD7c1A355E07a004c8f8651aDE8a3d3',
  [ChainId.BSC]: '0x84c189d8B52Be28AD4C4c9427aBd304268b2FCBA',
  [ChainId.BSC_TESTNET]: '0x0c5843163d0Fbe1c3106C5f96f202ca08D91F4b7',
  [ChainId.ARB_TESTNET]: '0x6941CD0d6EF3E4c1294b85fe6EF275AA6C4691fb',
  [ChainId.ZKSYNC]: '',
  [ChainId.opBNB]: '0x45500361eAEe1030a4e76f59396F10f1C5374Fb6',
  [ChainId.SCROLL_TESTNET]: '0x4CDE53B04082CDAAaD1fCF4fF5e54693C7254D19',
  [ChainId.SCROLL]:'0x11F174962dF86393faB25bf6EdB3d084e51FFAf9'
}

export const INIT_CODE_HASH_MAP = {
  [ChainId.GOERLI]: '0xbd6e9c8068984bfca91aed95f2f98658a71e81a7e6fdc3ee14a32e18282b6fd6',
  [ChainId.BSC]: '0x03835b706f9d113189195657a879689bd6bd25bcb39e55b463074e777ab96aa9',
  [ChainId.BSC_TESTNET]: '0x9d15c1fe3a61ecfd4282672e26382de61be672a5316cfef0c6362c7898c7b6d7',
  [ChainId.ARB_TESTNET]: '0xddb43bdccbba1a5f8ed99fdaccbafbcb4292989533b27066454dccc7f50ff467',
  [ChainId.opBNB]: '0x8b247e9de929d1981fa895749984a9c325040c7f0db1f55df5d636cfb9e7de81',
  [ChainId.SCROLL_TESTNET]: '0x05ae4e582d3dfde23af089aea9c8b019647888cabcc2aa3cb68fcc5a472935e2',
  [ChainId.SCROLL]:'0x6bf409838ed39aab678b3900f73838ac10e90eda0a1d325200da94cf79ead359'
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const FEES_NUMERATOR = JSBI.BigInt(9970)
export const FEES_DENOMINATOR = JSBI.BigInt(10000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
}
