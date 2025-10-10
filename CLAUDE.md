# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web3 Campus Digital Identity + Points Ecosystem for StarkNet Re{Solve} Hackathon. This is a completed hackathon submission featuring an H5 mobile application that implements:
- Wallet-based authentication (ArgentX on StarkNet)
- NFT-based student certificates (ERC721)
- Campus points token system (ERC20 - CampusToken/CPT)
- Virtual campus store with token-based payments
- **Current Status**: Demo mode enabled by default, no live contracts deployed

## Tech Stack

**Frontend:**
- React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.7 for H5 mobile interface
- starknet.js v7.6.4 for blockchain interactions
- React Router v7.9.3 for navigation
- get-starknet v4.0.0 + @starknet-io/get-starknet-core v4.0.7 for ArgentX wallet integration
- Mobile-first responsive design with CSS custom properties
- No UI framework - custom CSS with dark mode support

**Smart Contracts:**
- Cairo for StarkNet contracts (edition 2024_07)
- Scarb build system (starknet dependency >=2.8.0)
- OpenZeppelin patterns for ERC721 and ERC20
- StudentNFT: ERC721 with student metadata (avatar, name, student ID)
- CampusToken: ERC20 with check-in reward mechanism
- Compilation targets: Sierra and CASM formats
- Deploy target: StarkNet Sepolia testnet (not currently deployed)

## Project Structure

```
/contracts/                 # Cairo smart contracts
  src/
    lib.cairo              # Module declarations
    student_nft.cairo      # ERC721 student certificate
    campus_token.cairo     # ERC20 campus points
  Scarb.toml               # Contract dependencies and build config
  target/dev/              # Compiled contract artifacts
    campus_contracts_StudentNFT.contract_class.json
    campus_contracts_CampusToken.contract_class.json

/frontend/                  # React H5 mobile application
  src/
    /components/           # Reusable UI components
      StatusBar.tsx       # Modified: Status display component
      StatusBar.css       # Modified: Status styles
      AvatarPicker.tsx    # NFT avatar selection
    /contexts/            # React Context providers
      WalletContext.tsx   # ArgentX wallet connection
      AppContext.tsx      # Application state (demo mode forced disabled)
      ToastContext.tsx    # Notification system
    /pages/               # Route components
      Login.tsx          # Wallet connection page
      Home.tsx           # Modified: Student certificate display
      CheckIn.tsx        # Daily check-in rewards
      Store.tsx          # Campus store with products
      History.tsx        # Transaction history
    /services/           # Contract interaction services
      studentNFT.ts      # Modified: StudentNFT contract service
      campusToken.ts     # Modified: CampusToken contract service
      mockServices.ts    # Development mock services
    /utils/              # Utilities and constants
      constants.ts       # Contract addresses and config
      mockData.ts        # Mock data for development
    App.tsx              # Main application component
    App.css              # Global styles
  package.json           # Frontend dependencies
  .env                   # Environment config (demo mode enabled)
  vite.config.ts        # Vite configuration
  tsconfig.json         # TypeScript project references
  tsconfig.app.json     # App TypeScript config
  tsconfig.node.json    # Node TypeScript config

/install-tools.sh          # Untracked: Script to install scarb and starkli
```

## Development Commands

**Tool Installation:**
```bash
# Install StarkNet development tools (scarb and starkli)
./install-tools.sh

# Activate tools after installation
source ~/.bashrc
source ~/.starkli/env
starkliup

# Verify installation
scarb --version
starkli --version
```

**Frontend Development:**
```bash
cd frontend
npm install           # Install dependencies
npm run dev          # Start development server on localhost:5173
npm run build        # Build for production (runs tsc -b && vite build)
npm run lint         # Run ESLint checks
npm run preview      # Test production build locally
```

**Smart Contract Development:**
```bash
cd contracts
scarb build          # Compile Cairo contracts to Sierra and CASM
scarb clean          # Clean build artifacts

# Note: scarb test is configured but no test files exist
```

**Type Checking:**
```bash
cd frontend
npx tsc --noEmit     # Type-only validation without building
```

## Testing Infrastructure

**Current State:**
- ❌ No test files exist in the codebase
- ❌ No test runner configured in package.json
- ✅ Manual testing through demo mode
- ✅ Type checking with TypeScript strict mode

**Testing Approach:**
- Demo mode (`VITE_DEMO_MODE=true`) for functionality testing
- Manual wallet connection testing with ArgentX
- Build validation with `npm run build`

## Deployment & Configuration

**Environment Variables (frontend/.env):**
```env
VITE_STARKNET_NETWORK=sepolia
VITE_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_STUDENT_NFT_ADDRESS=0x0000000000000000000000000000000000000000  # Placeholder
VITE_CAMPUS_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000  # Placeholder
VITE_STORE_ADDRESS=0x0000000000000000000000000000000000000000  # Placeholder
VITE_BLOCK_EXPLORER_URL=https://sepolia.voyager.online
VITE_DEMO_MODE=true  # Currently enabled by default
```

**Contract Deployment:**
```bash
# Manual deployment process (no scripts exist)
cd contracts
scarb build  # Compile to target/dev/

# Use starkli CLI for deployment (example):
starkli declare target/dev/campus_contracts_StudentNFT.contract_class.json \
  --rpc <RPC_URL> \
  --account <ACCOUNT_FILE> \
  --private-key <PRIVATE_KEY>

# Deploy contract with constructor args
starkli deploy <CLASS_HASH> <CONSTRUCTOR_ARGS> \
  --rpc <RPC_URL> \
  --account <ACCOUNT_FILE> \
  --private-key <PRIVATE_KEY>

# Update frontend/.env with deployed addresses
```

## Architecture Notes

**State Management:**
- Three-context provider architecture (nesting order): AppProvider → ToastProvider → WalletProvider
- AppContext manages global app state (demo mode, dark mode, language) - MUST be outermost
- ToastContext handles user notifications and loading states
- WalletContext handles ArgentX connection via get-starknet library (innermost, depends on App/Toast contexts)
- Auto-reconnect on page load via localStorage check
- **Note**: Demo mode is forcibly disabled in AppContext.tsx:18-19, requiring real wallet connection

**Contract Interaction Pattern:**
- Service-based architecture: StudentNFTService and CampusTokenService classes
- All contract calls through starknet.js Contract class with ABI definitions embedded in services
- Services handle ABI parsing, contract instantiation, and transaction execution
- Transaction lifecycle: send → wait for confirmation → update UI
- Demo mode fallback: services check `VITE_DEMO_MODE` env var and use localStorage when contracts unavailable
- Services throw descriptive errors prompting users to enable demo mode if contracts not deployed

**Configuration Management:**
- CONTRACT_ADDRESSES in utils/constants.ts loaded from environment variables
- PRODUCTS array in constants.ts defines store items (Coffee 20 CPT, Bread 30 CPT, Drink 50 CPT)
- NETWORK_CONFIG provides chainId, rpcUrl, explorerUrl from environment

**Demo/Production Modes:**
- **Demo mode** (`VITE_DEMO_MODE=true`):
  - No wallet connection required - bypasses ArgentX entirely
  - Uses localStorage for state persistence (keys: demo_hasNFT, demo_studentInfo, demo_balance, demo_transactions)
  - Services detect demo mode and return mock data after simulated delays
  - Generates fake transaction hashes for UI consistency
  - Currently enabled by default in .env
- **Production mode** (`VITE_DEMO_MODE=false`):
  - Requires ArgentX wallet extension installed
  - Connects to live StarkNet contracts via starknet.js
  - Real blockchain transactions with gas fees
  - Contract addresses must be configured (currently placeholders)

## Key User Flows

1. **Initial Login:**
   - User connects ArgentX wallet (or demo mode bypass)
   - System checks if user has student NFT
   - If not, auto-mint student certificate NFT with user info

2. **Check-in:**
   - User clicks "Check In" button
   - Contract mints 10 CPT to user's address
   - Frontend displays updated balance

3. **Store Purchase:**
   - Display items: Coffee (20 CPT), Bread (30 CPT), Drink (50 CPT)
   - User selects item → triggers token transfer
   - Contract deducts CPT, emits purchase event
   - Frontend shows success message

4. **Transaction History:**
   - Display recent operations (check-ins, purchases)
   - Show transaction hashes for on-chain verification

## Important Development Notes

**Project State:**
- Git status shows modified files in StatusBar components and services
- install-tools.sh is untracked
- Main branch contains completed hackathon submission
- Recent commits focused on GitHub release preparation

**Cairo Contract Structure:**
- contracts/src/lib.cairo: Module declarations (includes student_nft and campus_token modules)
- Contracts compiled to target/dev/ with naming pattern: campus_contracts_{ContractName}.contract_class.json
- Each contract produces both .sierra.json and .casm.json artifacts

**TypeScript Configuration:**
- Strict mode enabled
- Uses project references (tsconfig.app.json and tsconfig.node.json)
- Build command runs type checking before Vite build: `tsc -b && vite build`
- Incremental compilation enabled for faster builds

**Wallet Integration Patterns:**
- get-starknet returns wallet object, must call `.enable()` before accessing account
- Account stored in WalletContext and passed to service classes via `initialize(account)` method
- Services must be initialized with account before calling contract methods
- Auto-reconnect logic in WalletContext checks localStorage on mount

**Common Pitfalls:**
- Context provider order matters: App context MUST wrap Toast and Wallet contexts
- Demo mode check appears in both AppContext (global state) and individual services (contract interaction)
- Contract addresses from env vars are currently placeholder zeros
- Transaction hashes must be awaited via `waitForTransaction()` before showing success
- StarkNet uses felt252 and u256 types - ensure proper type conversion in ABI calls
- No actual deployment scripts exist despite README references