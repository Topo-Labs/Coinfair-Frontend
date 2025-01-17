import { useEffect, useState } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import {
  Flex,
  LogoutIcon,
  RefreshIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  Box,
} from '@pancakeswap/uikit'
import Trans from 'components/Trans'
import useAuth from 'hooks/useAuth'
import useToast from 'hooks/useToast'
import { useRouter } from 'next/router'
import { useProfile } from 'state/profile/hooks'
import { usePendingTransactions } from 'state/transactions/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CLAIM_FAUCET from 'config/abi/Claim_Faucet.json'
import { useTranslation } from '@pancakeswap/localization'
import WalletModal, { WalletView } from './WalletModal'
import ProfileUserMenuItem from './ProfileUserMenuItem'
import WalletUserMenuItem from './WalletUserMenuItem'

const UserMenu = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account, chainId, library, error } = useWeb3React()
  const { logout } = useAuth()
  const { toastError } = useToast()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)
  const hasProfile = isInitialized && !!profile
  // const avatarSrc = profile?.nft?.image?.thumbnail
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')
  const isWrongNetwork: boolean = error && error instanceof UnsupportedChainIdError

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  const onClickWalletMenu = (): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }
  const handleSignClick = async (): Promise<void> => {
    router.push(`/profile`);
  }

  const handleClaimFaucet = async () => {
    if (!library || !account) {
      console.error('Library or account is not available');
      return
    }

    try {
      const signer = library.getSigner()
      const faucetContract = new Contract('0x2B33B7a06A5E28D5760ab30945efE5D3De7eB813', CLAIM_FAUCET, signer)
      const tx = await faucetContract.claim()
      console.log('Transaction sent:', tx)
      await tx.wait()
      console.log('Transaction confirmed:', tx)
    } catch (err) {
      console.error('Error claiming faucet:', err)
      if (err instanceof Error) {
        if (err.message.includes('execution reverted: not sufficient funds')) {
          toastError(t('Insufficient funds for gas. Please check your wallet balance.'))
        } else {
          toastError(t('Each user can only claim the cfUSD test token once.'))
        }
      } else {
        toastError(t('Unknown error occurred while claiming faucet.'))
      }
    }
  }

  const UserMenuItems = () => {
    return (
      <>
        <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
        <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
          {t('Recent Transactions')}
          {hasPendingTransactions && <RefreshIcon spin />}
        </UserMenuItem>
        {
          chainId === 56 && (
            <UserMenuItem as="button" onClick={handleClaimFaucet}>
              <Flex alignItems="center" justifyContent="space-between" width="100%">
                {t('Claim Faucet')}
              </Flex>
            </UserMenuItem>
          )
        }
        {/* <UserMenuDivider /> */}
        {/* <UserMenuItem
          as="button"
          disabled={isWrongNetwork}
          onClick={() => router.push(`/profile/${account.toLowerCase()}`)}
        >
          {t('Your NFTs')}
        </UserMenuItem> */}
        {/* <ProfileUserMenuItem isLoading={isLoading} hasProfile={hasProfile} disabled={isWrongNetwork} /> */}
        {/* <UserMenuItem
          as="button"
          disabled={isWrongNetwork}
          onClick={handleSignClick}
        >
          {t('Go to Profile')}
        </UserMenuItem> */}
        <UserMenuDivider />
        <UserMenuItem as="button" onClick={logout}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {t('Disconnect')}
            <LogoutIcon />
          </Flex>
        </UserMenuItem>
      </>
    )
  }

  if (account) {
    return (
      <UIKitUserMenu account={account} avatarSrc='/images/img/walletnew.svg' text={userMenuText} variant={userMenuVariable}>
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text={t('Network')} variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  return (
    <ConnectWalletButton scale="sm">
      <Box display={['none', , , 'block']}>
        <Trans>Connect Wallet</Trans>
      </Box>
      <Box display={['block', , , 'none']}>
        <Trans>Connect</Trans>
      </Box>
    </ConnectWalletButton>
  )
}

export default UserMenu
