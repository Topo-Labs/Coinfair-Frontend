import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { parseUnits } from '@ethersproject/units'
import { useMasterchefV1, useSousChef } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const sousUnstake = async (sousChefContract: any, amount: string, decimals: number, library: any) => {
  const gasPrice = await library.getGasPrice()
  const units = parseUnits(amount, decimals)

  return sousChefContract.withdraw(units.toString(), {
    gasPrice,
  })
}

const sousEmergencyUnstake = async (sousChefContract: any, library: any) => {
  const gasPrice = await library.getGasPrice()
  return sousChefContract.emergencyWithdraw({ gasPrice })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const masterChefV1Contract = useMasterchefV1()
  const sousChefContract = useSousChef(sousId)
  const { library } = useActiveWeb3React()

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (!library) return Promise.resolve(null) // 确保返回值存在

      if (sousId === 0) {
        const gasPrice = await library.getGasPrice()
        const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
        return masterChefV1Contract.leaveStaking(value, { gasLimit: DEFAULT_GAS_LIMIT, gasPrice })
      }

      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract, library)
      }

      return sousUnstake(sousChefContract, amount, decimals, library)
    },
    [enableEmergencyWithdraw, masterChefV1Contract, sousChefContract, sousId, library],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
