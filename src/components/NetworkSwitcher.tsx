import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { setupNetwork } from 'utils/wallet'
import { NETWORK_CONFIG } from 'config'

const chainsIdList = Object.keys(NETWORK_CONFIG);

export const SUPPORTED_CHAINS = chainsIdList.filter((chain) => {
  if (process.env.NEXT_PUBLIC_SUPPORTED_CHAINID) {
    // eslint-disable-next-line no-console
    return process.env.NEXT_PUBLIC_SUPPORTED_CHAINID.split(',').indexOf(chain) > -1
  }
  return false
})


export const NetworkSelect = () => {
  const { t } = useTranslation()

  return (
    <>
      <Box px="16px" py="8px">
        <Text fontWeight={600}>{t('Select a Network')}</Text>
      </Box>
      {/* <UserMenuDivider /> */}
      {SUPPORTED_CHAINS.length ? <UserMenuDivider /> : null}
      {SUPPORTED_CHAINS.map((chain) => {
        if (chain === '204') {
          return (
            <UserMenuItem key={chain} style={{ justifyContent: 'flex-start' }} onClick={() => setupNetwork(parseInt(chain))}>
              <Image width={24} height={24} src={`/images/chains/${chain}.png`} unoptimized />
              <Text pl="12px">{NETWORK_CONFIG[chain].name}</Text>
            </UserMenuItem>
          )
        }
        return ''
      })}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { chainId } = useActiveWeb3React()

  const opChainId = 204

  return (
    chainId ?
      <UserMenu
        mr="8px"
        avatarSrc={`/images/chains/${opChainId}.png`}
        account={
          NETWORK_CONFIG[SUPPORTED_CHAINS.find(chain => (Number(chain) === Number(opChainId)))]?.name
        }
        ellipsis={false}
      >
        {() => <NetworkSelect />}
      </UserMenu> : null
  )
}
