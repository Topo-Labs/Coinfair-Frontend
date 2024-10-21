import { useState, useCallback, useEffect } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { NETWORK_CONFIG } from 'utils/wallet'
import { copyText } from 'utils/copyText';
import useToast from 'hooks/useToast';
import { FiCopy } from 'react-icons/fi';
import { Text } from '@pancakeswap/uikit';
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, ExternalProvider, JsonRpcProvider } from '@ethersproject/providers';
import {isAddress} from "@ethersproject/address"
import { circleContractAddress, MINT_ABI } from './constants';
import { CircleContent, CircleContentPeople, CircleHeader, CircleImg, CircleMint, CircleNft, CircleNftMain, CircleTitle, CopyBtn, CopyLink, CopyMain, MintAmount, NftMessage, NftRemain, NftTotal, Tooltip } from './styles';

export default function Earn() {

  return (
    <>
      
    </>
  );
}