import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { SwapParameters, Trade, TradeType } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import truncateHash from 'utils/truncateHash'
import { INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress } from '../utils'
import isZero from '../utils/isZero'
import { useSwapCallArguments } from './useSwapCallArguments'
import { transactionErrorToUserReadableMessage } from '../utils/transactionErrorToUserReadableMessage'
import { basisPointsToPercent } from '../utils/exchange'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall extends SwapCallEstimate {
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  error: string
}

interface SwapCallEstimate {
  call: SwapCall
}

export function useSwapCallback(
  trade: Trade | undefined,
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE,
  recipientAddress: string | null,
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddress)
  const { t } = useTranslation()
  const addTransaction = useTransactionAdder()
  const recipient = recipientAddress === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        // 动态获取 gas price
        const gasPrice = await library.getGasPrice()

        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: t('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)
                    return { call, error: transactionErrorToUserReadableMessage(callError, t) }
                  })
              })
          }),
        )

        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw new Error(errorCalls[errorCalls.length - 1].error)
          throw new Error(t('Unexpected error. Could not estimate gas for the swap.'))
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          gasPrice,
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const pct = basisPointsToPercent(allowedSlippage)
            const inputAmount =
              trade.tradeType === TradeType.EXACT_INPUT
                ? trade.inputAmount.toSignificant(3)
                : trade.maximumAmountIn(pct).toSignificant(3)
            const outputAmount =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? trade.outputAmount.toSignificant(3)
                : trade.minimumAmountOut(pct).toSignificant(3)

            const base = `Swap ${trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
              } ${inputAmount} ${inputSymbol} for ${trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
              } ${outputAmount} ${outputSymbol}`

            const recipientAddressText =
              recipientAddress && isAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress

            const withRecipient = recipient === account ? base : `${base} to ${recipientAddressText}`

            const translatableWithRecipient =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? recipient === account
                  ? 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
                  : 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%'
                : recipient === account
                  ? 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'
                  : 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%'

            addTransaction(response, {
              summary: withRecipient,
              translatableSummary: {
                text: translatableWithRecipient,
                data: {
                  inputAmount,
                  inputSymbol,
                  outputAmount,
                  outputSymbol,
                  ...(recipient !== account && { recipientAddress: recipientAddressText }),
                },
              },
              type: 'swap',
            })

            return response.hash
          })
          .catch((error: any) => {
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(t('Swap failed: %message%', { message: transactionErrorToUserReadableMessage(error, t) }))
            }
          })
      },
      error: null,
    }
  }, [
    trade,
    library,
    account,
    chainId,
    recipient,
    recipientAddress,
    swapCalls,
    t,
    addTransaction,
    allowedSlippage,
  ])
}
