# Chain Management

## Configuration Files

You can check the changes related to the newly added chain based on this commit:
[View Commit](https://github.com/Topo-Labs/Coinfair-Frontend/commit/db7ba9b0d047dd575e1d340831cdc3a0b5075e35)

### 1. Environment Variable Configuration

- **Files**: `.env.development` and `.env.production`

### 2. SDK Chain Configuration

- **File**: `packages/swap-sdk/src/constants.ts`

### 3. App Chain Configuration

- **File**: `src/config/index.ts`

### 4. Token Ownership Configuration

- **File**: `packages/swap-sdk/src/entities/token.ts`

### 5. Chain Icon Configuration

- **Path**: `public/images/chains/{chainId}.png`

### 6. Custom Chain Sorting

If you need to customize the position, you can rearrange elements using the `swapElements` method.

### 7. Contract Address Configuration

- **File**: `src/config/constants/exchange.ts`

### 8. Default Token Display Configuration

- **Note**: The token icons are submitted in [CoinfairTokenList](https://github.com/Topo-Labs/CoinfairTokenList), and this rule is case-sensitive.
- **File**: `src/config/constants/tokenLists/eqswap-default.tokenlist.json`

### 9. Hooks Initialization Related

- **Files**: 
  - `src/state/lists/hooks.ts`
  - `src/state/swap/hooks.ts`
  - `src/state/types.ts`