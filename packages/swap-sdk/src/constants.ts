import JSBI from 'jsbi';

// exports for external consumption
export type BigintIsh = JSBI | number | string;

export enum ChainId {
  ETHEREUM = 1,
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
  [ChainId.BSC]: '0xD4EBc57fA5635EC1160F80962d935d44DdCED916',
  [ChainId.BSC_TESTNET]: '0x0c5843163d0Fbe1c3106C5f96f202ca08D91F4b7',
  [ChainId.ARB_TESTNET]: '0x6941CD0d6EF3E4c1294b85fe6EF275AA6C4691fb',
  [ChainId.ZKSYNC]: '',
  [ChainId.opBNB]: '0xe2feC6354683D0f706ED7A9FD588fc706c9cA46e',
  [ChainId.SCROLL_TESTNET]: '0x4CDE53B04082CDAAaD1fCF4fF5e54693C7254D19',
  [ChainId.SCROLL]: '0x11F174962dF86393faB25bf6EdB3d084e51FFAf9',
};

export const INIT_CODE_HASH_MAP = {
  [ChainId.GOERLI]: '0xbd6e9c8068984bfca91aed95f2f98658a71e81a7e6fdc3ee14a32e18282b6fd6',
  [ChainId.BSC]: '0xa128b758fe3db46bdb4f32a8deaf22bbaa0a7b6f3cbaff9500cd9bc5aa31b595',
  [ChainId.BSC_TESTNET]: '0x9d15c1fe3a61ecfd4282672e26382de61be672a5316cfef0c6362c7898c7b6d7',
  [ChainId.ARB_TESTNET]: '0xddb43bdccbba1a5f8ed99fdaccbafbcb4292989533b27066454dccc7f50ff467',
  [ChainId.opBNB]: '0xecc1735d72f6390c4be5f9728cd7b93512fd08fd61ead274e369530977ef7c9e',
  [ChainId.SCROLL_TESTNET]: '0x05ae4e582d3dfde23af089aea9c8b019647888cabcc2aa3cb68fcc5a472935e2',
  [ChainId.SCROLL]: '0x6bf409838ed39aab678b3900f73838ac10e90eda0a1d325200da94cf79ead359',
};

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000);

// 动态更新 FEES_NUMERATOR 的函数
let FEES_NUMERATOR = JSBI.BigInt(9970);

function listenForFeeChanges(callback) {
  if (typeof window !== 'undefined') {
    const handleFeeChange = function (event) {
      const fee = event.detail;
      if (typeof callback === 'function') {
        callback(fee);
      }
    };
    window.addEventListener('onFee', handleFeeChange);
  } else {
    console.log('window is not available in this environment.');
  }
}

function handleFeeUpdate(fee) {
  try {
    // FEES_NUMERATOR = 10000 - fee * 10
    const feeBigInt = JSBI.BigInt(fee);
    const tenTimesFee = JSBI.multiply(feeBigInt, JSBI.BigInt(10));
    FEES_NUMERATOR = JSBI.subtract(JSBI.BigInt(10000), tenTimesFee);
  } catch (error) {
    console.error('Error updating FEES_NUMERATOR:', error);
  }
}
listenForFeeChanges(handleFeeUpdate);

// exports for internal consumption
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const TWO = JSBI.BigInt(2);
export const THREE = JSBI.BigInt(3);
export const FIVE = JSBI.BigInt(5);
export const TEN = JSBI.BigInt(10);
export const _100 = JSBI.BigInt(100);
export { FEES_NUMERATOR };
export const FEES_DENOMINATOR = JSBI.BigInt(10000);

export enum SolidityType {
  uint8 = 'uint8',
  uint256,
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
};
