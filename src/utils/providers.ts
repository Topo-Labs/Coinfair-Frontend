import { StaticJsonRpcProvider } from '@ethersproject/providers'

// export const DEFAULT_PROD_NODE = process.env.NODE_BSC_PRODUCTION || 'https://rpc.ankr.com/bsc'
export const DEFAULT_PROD_NODE = 'http://127.0.0.1:8545'

export const bscRpcProvider = new StaticJsonRpcProvider(DEFAULT_PROD_NODE)

export default null
