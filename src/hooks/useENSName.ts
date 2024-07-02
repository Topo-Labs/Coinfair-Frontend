import { useWeb3React } from '@web3-react/core';
import { createWeb3Name } from '@web3-name-sdk/core'
import { useEffect, useState, useRef } from 'react';
import isEqual from 'lodash/isEqual';

const web3name = createWeb3Name()

const useENSName = (accountsList: string[]): { account: string, name: string | null }[] => {
  const { chainId } = useWeb3React()
  const [serviceNameList, setServiceNameList] = useState<{ account: string, name: string | null }[]>([]);
  const prevAddressesListRef = useRef<string[]>([])

  useEffect(() => {
    const fetchWeb3name = async () => {
      setServiceNameList(await Promise.all(accountsList.map(async (account) => {
        try {
          console.info(accountsList, "fetch getDomainName")
          const name = await web3name.getDomainName({
            address: account,
            queryChainIdList: [56]
          })
          return { account, name: name ?? null };
        } catch (e) {
          console.info("fetch web3name: ", e);
          return { account, name: null }
        }
      })))
    }
    if (accountsList
      && accountsList.length > 0
      && !isEqual(prevAddressesListRef.current, accountsList)
      // && chainId === 56
      && accountsList[0].startsWith("0x")) {
      fetchWeb3name();
      prevAddressesListRef.current = [...accountsList];
    }
  }, [accountsList, chainId])
  return serviceNameList;
}

export default useENSName;