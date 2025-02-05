/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  AirdopMetadata,
  AirdopMetadataInterface,
} from "../AirdopMetadata";

const _abi = [
  {
    inputs: [],
    name: "_airdoptime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "_time",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "add",
        type: "address",
      },
    ],
    name: "getAridop",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "add",
        type: "address",
      },
    ],
    name: "getTimeStamp",
    outputs: [
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class AirdopMetadata__factory {
  static readonly abi = _abi;
  static createInterface(): AirdopMetadataInterface {
    return new utils.Interface(_abi) as AirdopMetadataInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AirdopMetadata {
    return new Contract(address, _abi, signerOrProvider) as AirdopMetadata;
  }
}
