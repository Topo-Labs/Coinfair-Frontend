import { Token } from '../token'
import { TokenAmount } from './tokenAmount'
import { currencyEquals } from '../token'
import JSBI from 'jsbi'

import { BigintIsh, Rounding, TEN } from '../../constants'
import { Currency } from '../currency'
import { Route } from '../route'
import { Fraction } from './fraction'
import { CurrencyAmount } from './currencyAmount'

export class Price extends Fraction {
  public readonly baseCurrency: Currency // input i.e. denominator
  public readonly quoteCurrency: Currency // output i.e. numerator
  public readonly scalar: Fraction // used to adjust the raw fraction w/r/t the decimals of the {base,quote}Token

  public static fromRoute(route: Route): Price {
    const prices: Price[] = []
    for (const [i, pair] of route.pairs.entries()) {
      prices.push(
        route.path[i].equals(pair.token0)
          ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw)
          : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw)
      )
    }
    return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  }

  // denominator and numerator _must_ be raw, i.e. in the native representation
  public constructor(baseCurrency: Currency, quoteCurrency: Currency, denominator: BigintIsh, numerator: BigintIsh) {
    super(numerator, denominator)

    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
    this.scalar = new Fraction(
      JSBI.exponentiate(TEN, JSBI.BigInt(baseCurrency.decimals)),
      JSBI.exponentiate(TEN, JSBI.BigInt(quoteCurrency.decimals))
    )
  }

  public get raw(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }

  public get adjusted(): Fraction {
    return super.multiply(this.scalar)
  }

  public invert(): Price {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator)
  }

  public multiply(other: Price): Price {
    if (!currencyEquals(this.quoteCurrency, other.baseCurrency)) {
      console.error('Currency mismatch in multiply method: expected quoteCurrency of this Price to be equal to baseCurrency of other Price')
      throw new Error('Currency mismatch in multiply method')
    }
    const fraction = super.multiply(other)
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator)
  }

  // performs floor division on overflow
  public quote(currencyAmount: CurrencyAmount): CurrencyAmount {
    if (!currencyEquals(currencyAmount.currency, this.baseCurrency)) {
      console.error('Currency mismatch in quote method: expected currencyAmount.currency to be equal to baseCurrency of this Price')
      throw new Error('Currency mismatch in quote method')
    }
    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, super.multiply(currencyAmount.raw).quotient)
    }
    return CurrencyAmount.ether(super.multiply(currencyAmount.raw).quotient)
  }

  public toSignificant(significantDigits: number = 6, format?: object, rounding?: Rounding): string {
    return this.adjusted.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces: number = 4, format?: object, rounding?: Rounding): string {
    return this.adjusted.toFixed(decimalPlaces, format, rounding)
  }
}
