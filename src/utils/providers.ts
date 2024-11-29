import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const DEFAULT_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://rpc.ankr.com/bsc/9c9763b95d62a8269670b0aa089f1ba82604d70f86115ee5185f54c6a837166f'

export const bscRpcProvider = new StaticJsonRpcProvider(DEFAULT_PROD_NODE)

export default null
