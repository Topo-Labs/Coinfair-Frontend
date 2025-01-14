import { CurrencyAmount } from './currencyAmount'
import { Token } from '../token'
import JSBI from 'jsbi'

import { BigintIsh } from '../../constants'

export class TokenAmount extends CurrencyAmount {
  public readonly token: Token

  // amount _must_ be raw, i.e. in the native representation
  public constructor(token: Token, amount: BigintIsh) {
    super(token, amount)
    this.token = token
  }

  public add(other: TokenAmount): TokenAmount {
    if (!this.token.equals(other.token)) {
      console.error('Token mismatch in add method: expected tokens to be equal')
      throw new Error('Token mismatch in add method')
    }
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: TokenAmount): TokenAmount {
    if (!this.token.equals(other.token)) {
      console.error('Token mismatch in subtract method: expected tokens to be equal')
      throw new Error('Token mismatch in subtract method')
    }
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw))
  }
}
