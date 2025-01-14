import { useCallback } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { Contract, CallOverrides } from '@ethersproject/contracts'
import { useGasPrice } from 'state/user/hooks'
import get from 'lodash/get'
import * as Sentry from '@sentry/react'
import useActiveWeb3React from './useActiveWeb3React'

export function useCallWithGasPrice() {
  const { library } = useActiveWeb3React() // 获取 library 对象
  
  /**
   * Perform a contract call with a gas price fetched dynamically from library.getGasPrice()
   * @param contract Used to perform the call
   * @param methodName The name of the method called
   * @param methodArgs An array of arguments to pass to the method
   * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by library.getGasPrice()
   * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
   */
  const callWithGasPrice = useCallback(
    async (
      contract: Contract,
      methodName: string,
      methodArgs: any[] = [],
      overrides: CallOverrides = null,
    ): Promise<TransactionResponse> => {
      // 获取实时 gas price
      const gasPrice = overrides?.gasPrice || (await library.getGasPrice())

      Sentry.addBreadcrumb({
        type: 'Transaction',
        message: `Call with gas price: ${gasPrice}`,
        data: {
          contractAddress: contract.address,
          methodName,
          methodArgs,
          overrides,
        },
      })

      const contractMethod = get(contract, methodName)
      const tx = await contractMethod(
        ...methodArgs,
        { ...overrides, gasPrice } // 使用获取到的实时 gas price
      )

      if (tx) {
        Sentry.addBreadcrumb({
          type: 'Transaction',
          message: `Transaction sent: ${tx.hash}`,
          data: {
            hash: tx.hash,
            from: tx.from,
            gasLimit: tx.gasLimit?.toString(),
            nonce: tx.nonce,
          },
        })
      }

      return tx
    },
    [library],
  )

  return { callWithGasPrice }
}
