import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const DEFAULT_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://mainnet.base.org'

export const bscRpcProvider = new StaticJsonRpcProvider(DEFAULT_PROD_NODE)

export default null
