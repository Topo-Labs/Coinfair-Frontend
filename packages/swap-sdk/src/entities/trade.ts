/* eslint-disable no-continue */
import JSBI from 'jsbi';
import { InsufficientInputAmountError, InsufficientReservesError } from '..'

import { ChainId, ONE, TradeType, ZERO } from '../constants'
import { sortedInsert } from '../utils'
import { Currency, ETHER } from './currency'
import { CurrencyAmount } from './fractions/currencyAmount'
import { Fraction } from './fractions/fraction'
import { Percent } from './fractions/percent'
import { Price } from './fractions/price'
import { TokenAmount } from './fractions/tokenAmount'
import { Pair, PairV3 } from './pair'
import { Route } from './route'
import { currencyEquals, Token, WNATIVE } from './token'

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
function computePriceImpact(midPrice: Price, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
  const exactQuote = midPrice.raw.multiply(inputAmount.raw)
  // calculate slippage := (exactQuote - outputAmount) / exactQuote
  const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
  return new Percent(slippage.numerator, slippage.denominator)
}

// minimal interface so the input output comparator may be shared across types
interface InputOutput {
  readonly inputAmount: CurrencyAmount
  readonly outputAmount: CurrencyAmount
}

// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first
export function inputOutputComparator(a: InputOutput, b: InputOutput): number {
  if (!currencyEquals(a.inputAmount.currency, b.inputAmount.currency)) {
    console.error('INPUT_CURRENCY mismatch');
  }
  if (!currencyEquals(a.outputAmount.currency, b.outputAmount.currency)) {
    console.error('OUTPUT_CURRENCY mismatch');
  }
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    }
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}

// extension of the input output comparator that also considers other dimensions of the trade in ranking them
export function tradeComparator(a: Trade, b: Trade) {
  const ioComp = inputOutputComparator(a, b)
  if (ioComp !== 0) {
    return ioComp
  }

  // consider lowest slippage next, since these are less likely to fail
  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1
  }

  // finally consider the number of hops since each hop costs gas
  return a.route.path.length - b.route.path.length
}

export interface BestTradeOptions {
  // how many results to return
  maxNumResults?: number
  // the maximum number of hops a trade should contain
  maxHops?: number
}

/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */
function wrappedAmount(currencyAmount: CurrencyAmount, chainId: ChainId): TokenAmount {
  if (currencyAmount instanceof TokenAmount) return currencyAmount;
  if (currencyAmount.currency === ETHER) return new TokenAmount(WNATIVE[chainId], currencyAmount.raw);

  console.error('Invalid currency type passed to wrappedAmount');
  return new TokenAmount(WNATIVE[chainId], ZERO);
}

function wrappedCurrency(currency: Currency, chainId: ChainId): Token {
  if (currency instanceof Token) return currency;
  if (currency === ETHER) return WNATIVE[chainId];

  console.error('Invalid currency type passed to wrappedCurrency');
  return WNATIVE[chainId];
}

/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
export class Trade {
  /**
   * The route of the trade, i.e. which pairs the trade goes through.
   */
  public readonly route: Route
  /**
   * The type of the trade, either exact in or exact out.
   */
  public readonly tradeType: TradeType
  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: CurrencyAmount
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: CurrencyAmount
  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price
  /**
   * The mid price after the trade executes assuming no slippage.
   */
  public readonly nextMidPrice: Price
  /**
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  public readonly priceImpact: Percent

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  public static exactIn(route: Route, amountIn: CurrencyAmount): Trade {
    return new Trade(route, amountIn, TradeType.EXACT_INPUT)
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  public static exactOut(route: Route, amountOut: CurrencyAmount): Trade {
    return new Trade(route, amountOut, TradeType.EXACT_OUTPUT)
  }

  public constructor(route: Route, amount: CurrencyAmount, tradeType: TradeType) {
    const amounts: TokenAmount[] = new Array(route.path.length);
    const nextPairs: PairV3[] = new Array(route.pairs.length);
    if (tradeType === TradeType.EXACT_INPUT) {
      if (!currencyEquals(amount.currency, route.input)) {
        console.error('INPUT mismatch');
      }
      amounts[0] = wrappedAmount(amount, route.chainId);
      for (let i = 0; i < route.path.length - 1; i++) {
        const pair = route.pairs[i];
        const [outputAmount, nextPair] = pair.getOutputAmount(amounts[i]);
        amounts[i + 1] = outputAmount;
        nextPairs[i] = nextPair;
      }
    } else {
      if (!currencyEquals(amount.currency, route.output)) {
        console.error('OUTPUT mismatch');
      }
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId);
      for (let i = route.path.length - 1; i > 0; i--) {
        const pair = route.pairs[i - 1];
        const [inputAmount, nextPair] = pair.getInputAmount(amounts[i]);
        amounts[i - 1] = inputAmount;
        nextPairs[i - 1] = nextPair;
      }
    }

    this.route = route
    this.tradeType = tradeType
    this.inputAmount =
      tradeType === TradeType.EXACT_INPUT
        ? amount
        : route.input === ETHER
          ? CurrencyAmount.ether(amounts[0].raw)
          : amounts[0]
    this.outputAmount =
      tradeType === TradeType.EXACT_OUTPUT
        ? amount
        : route.output === ETHER
          ? CurrencyAmount.ether(amounts[amounts.length - 1].raw)
          : amounts[amounts.length - 1]
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw
    )
    this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input))
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
  }

  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public minimumAmountOut(slippageTolerance: Percent): CurrencyAmount {
    if (slippageTolerance.lessThan(ZERO)) {
      console.error('SLIPPAGE_TOLERANCE is invalid');
    }
    if (this.tradeType === TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      const slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.raw).quotient;
      return this.outputAmount instanceof TokenAmount ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut) : CurrencyAmount.ether(slippageAdjustedAmountOut);
    }
  }

  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  public maximumAmountIn(slippageTolerance: Percent): CurrencyAmount {
    if (slippageTolerance.lessThan(ZERO)) {
      console.error('SLIPPAGE_TOLERANCE is invalid');
    }
    if (this.tradeType === TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
      return this.inputAmount instanceof TokenAmount ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn) : CurrencyAmount.ether(slippageAdjustedAmountIn);
    }
  }

  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactIn(
    pairs: PairV3[],
    currencyAmountIn: CurrencyAmount,
    currencyOut: Currency,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptions = {},
    currentPairs: PairV3[] = [],
    originalAmountIn: CurrencyAmount = currencyAmountIn,
    bestTrades: Trade[] = []
  ): Trade[] {
  
    // 确保有有效的 pairs 和 maxHops
    if (pairs.length === 0 || maxHops <= 0) return bestTrades;
  
    const chainId: ChainId | undefined =
      currencyAmountIn instanceof TokenAmount
        ? currencyAmountIn.token.chainId
        : currencyOut instanceof Token
        ? currencyOut.chainId
        : undefined;
    if (!chainId) throw new Error('CHAIN_ID is undefined');
  
    const amountIn = wrappedAmount(currencyAmountIn, chainId);
    const tokenOut = wrappedCurrency(currencyOut, chainId);
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];  
      // 确保当前pair包含输入代币
      if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
  
      let amountOut: TokenAmount;
      try {
        [amountOut] = pair.getOutputAmount(amountIn);
      } catch (error) {
        if ((error as InsufficientInputAmountError).isInsufficientInputAmountError) {
          console.warn(`Skipping pair ${pair.token0.symbol}-${pair.token1.symbol} due to insufficient input amount.`);
          continue;
        }
        throw error;
      }
    
      // 如果找到了符合条件的交易路径
      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([...currentPairs, pair], originalAmountIn.currency, currencyOut),
            originalAmountIn,
            TradeType.EXACT_INPUT
          ),
          maxNumResults,
          tradeComparator
        );
      } else if (maxHops > 1 && pairs.length > 1) {
        // 递归调用，排除当前pair继续寻找路径
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1));
  
        // 递归调用时保证 `originalAmountIn` 不变
        Trade.bestTradeExactIn(
          pairsExcludingThisPair,
          amountOut,
          currencyOut,
          {
            maxNumResults,
            maxHops: maxHops - 1,
          },
          [...currentPairs, pair],
          originalAmountIn,  // 传递原始金额，保证不被修改
          bestTrades
        );
      }
    }
  
    return bestTrades;
  }  

  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  public static bestTradeExactOut(
    pairs: PairV3[],
    currencyIn: Currency,
    currencyAmountOut: CurrencyAmount,
    { maxNumResults = 3, maxHops = 3 }: BestTradeOptions = {},
    currentPairs: PairV3[] = [],
    originalAmountOut: CurrencyAmount = currencyAmountOut,
    bestTrades: Trade[] = []
): Trade[] {
    // 移除 invariant 检查，直接处理
    if (pairs.length === 0 || maxHops <= 0) return bestTrades;

    if (originalAmountOut !== currencyAmountOut && currentPairs.length === 0) {
      // 递归保护：如果原始的输出金额被修改，且没有跳跃过一次
      return bestTrades;
    }

    const chainId: ChainId | undefined = currencyAmountOut instanceof TokenAmount
      ? currencyAmountOut.token.chainId
      : currencyIn instanceof Token
      ? currencyIn.chainId
      : undefined;
    if (chainId === undefined) return bestTrades;

    const amountOut = wrappedAmount(currencyAmountOut, chainId);
    const tokenIn = wrappedCurrency(currencyIn, chainId);

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      // 跳过与当前输出代币无关的交易对
      if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;

      let amountIn: TokenAmount;
      try {
        [amountIn] = pair.getInputAmount(amountOut);
      } catch (error) {
        // 储备不足时处理错误
        if ((error as InsufficientReservesError).isInsufficientReservesError) {
          continue;
        }
        throw error;
      }

        // 如果到达了输入代币
      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([pair, ...currentPairs], currencyIn, originalAmountOut.currency),
            originalAmountOut,
            TradeType.EXACT_OUTPUT
          ),
          maxNumResults,
          tradeComparator
        );
      } else if (maxHops > 1 && pairs.length > 1) {
        // 如果未到达输入代币且还能继续跳跃
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));

        // 递归调用 bestTradeExactOut，继续尝试其它路径
        Trade.bestTradeExactOut(
          pairsExcludingThisPair,
          currencyIn,
          amountIn,  // 使用此跳的输出作为下一跳的输入
          {
              maxNumResults,
              maxHops: maxHops - 1,
          },
          [pair, ...currentPairs],
          originalAmountOut,
          bestTrades
        );
      }
    }
    return bestTrades;
}

}
