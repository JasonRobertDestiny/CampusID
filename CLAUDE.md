# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web3 Campus Digital Identity + Points Ecosystem for StarkNet Re{Solve} Hackathon. This is an H5 mobile application that implements:
- Wallet-based authentication (ArgentX on StarkNet)
- NFT-based student certificates (ERC721)
- Campus points token system (ERC20 - CampusToken/CPT)
- Virtual campus store with token-based payments

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
- Deploy to StarkNet Sepolia testnet

## Project Structure

```
/contracts/                 # Cairo smart contracts
  src/
    student_nft.cairo      # ERC721 student certificate
    campus_token.cairo     # ERC20 campus points
  Scarb.toml               # Contract dependencies and build config
  target/                  # Compiled contract artifacts

/frontend/                  # React H5 mobile application
  src/
    /components/           # Reusable UI components
      AvatarPicker.tsx     # NFT avatar selection
      index.ts            # Component exports
    /contexts/             # React Context providers
      WalletContext.tsx   # ArgentX wallet connection
      AppContext.tsx      # Application state
      ToastContext.tsx    # Notification system
    /pages/               # Route components
      Login.tsx          # Wallet connection page
      Home.tsx           # Student certificate display
      CheckIn.tsx        # Daily check-in rewards
      Store.tsx          # Campus store with products
      History.tsx        # Transaction history
    /services/            # Contract interaction services
      studentNFT.ts      # StudentNFT contract service
      campusToken.ts     # CampusToken contract service
      mockServices.ts    # Development mock services
    /utils/               # Utilities and constants
      constants.ts       # Contract addresses and config
      mockData.ts        # Mock data for development
    App.tsx              # Main application component
    App.css              # Global styles
  package.json           # Frontend dependencies
```

## Core Smart Contract Logic

**StudentNFT Contract (ERC721):**
- Mints unique student certificate on first login
- Stores: avatar URI, student name, student ID
- One NFT per wallet address

**CampusToken Contract (ERC20):**
- Token symbol: CPT
- Distributes 10 CPT per check-in
- Handles token transfers for store purchases
- Owner can mint unlimited supply

## Development Commands

**Frontend Development:**
```bash
cd frontend
npm install           # Install dependencies
npm run dev          # Start development server on localhost:5173
npm run build        # Build for production
npm run lint         # Run ESLint checks
npm run preview      # Test production build locally
```

**Smart Contract Development:**
```bash
cd contracts
scarb build          # Compile Cairo contracts to Sierra and CASM
scarb test           # Run contract tests (if test files exist)
scarb clean          # Clean build artifacts
```

**Testing & Validation:**
```bash
# Frontend build test
cd frontend && npm run build

# Contract compilation test
cd contracts && scarb build

# Type checking
cd frontend && npx tsc --noEmit

# Note: No automated tests currently exist in the codebase
# Manual testing through demo mode or live wallet connection required
```

**Deployment:**
```bash
# Manual deployment via starkli (no deployment scripts exist in codebase)
cd contracts
scarb build  # Compile to Sierra and CASM

# Deploy using starkli commands (requires starkli CLI installed)
# 1. Declare contracts: starkli declare target/dev/campus_contracts_StudentNFT.contract_class.json
# 2. Deploy contracts: starkli deploy <class_hash> <constructor_args>
# 3. Update frontend/.env with deployed contract addresses
```

## Key User Flows

1. **Initial Login:**
   - User connects ArgentX wallet via starknet.js
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

## Architecture Notes

**State Management:**
- Three-context provider architecture (nesting order): AppProvider → ToastProvider → WalletProvider
- AppContext manages global app state (demo mode, dark mode, language) - MUST be outermost
- ToastContext handles user notifications and loading states
- WalletContext handles ArgentX connection via get-starknet library (innermost, depends on App/Toast contexts)
- Auto-reconnect on page load via localStorage check

**Contract Interaction Pattern:**
- Service-based architecture: StudentNFTService and CampusTokenService classes
- All contract calls through starknet.js Contract class with ABI definitions embedded in services
- Services handle ABI parsing, contract instantiation, and transaction execution
- Transaction lifecycle: send → wait for confirmation → update UI
- Demo mode fallback: services check `VITE_DEMO_MODE` env var and use localStorage when contracts unavailable
- Services throw descriptive errors prompting users to enable demo mode if contracts not deployed

**Configuration Management:**
- CONTRACT_ADDRESSES in utils/constants.ts loaded from environment variables
- Environment variables in frontend/.env:
  - VITE_STUDENT_NFT_ADDRESS: StudentNFT contract address
  - VITE_CAMPUS_TOKEN_ADDRESS: CampusToken contract address
  - VITE_STARKNET_NETWORK: Network identifier (default: 'sepolia')
  - VITE_STARKNET_RPC_URL: RPC endpoint URL
  - VITE_DEMO_MODE: 'true' for demo mode, 'false' for production
- PRODUCTS array in constants.ts defines store items (Coffee 20 CPT, Bread 30 CPT, Drink 50 CPT)
- NETWORK_CONFIG provides chainId, rpcUrl, explorerUrl from environment

**Error Handling:**
- Wallet not installed → prompt user to install ArgentX
- Insufficient balance → show clear error message
- Transaction failed → display transaction hash for debugging
- Network issues → show retry mechanism with timeout handling

## UI Pages

1. **Login Page (/)**: Wallet connection button, entry point
2. **Home Page (/home)**: Display student certificate NFT card with avatar, name, ID
3. **Check-in Page (/checkin)**: Button to earn 10 CPT daily reward
4. **Store Page (/store)**: Product list with prices in CPT (Coffee 20, Bread 30, Drink 50)
5. **History Page (/history)**: Transaction records with blockchain verification links

**Routing:** React Router v7 with BrowserRouter, all routes defined in App.tsx

## MVP Requirements

Minimum viable features for hackathon demo:
1. ✅ Wallet login (ArgentX)
2. ✅ Auto-mint student NFT on first login
3. ✅ Check-in rewards (10 CPT)
4. ✅ Store purchases with token payment

Nice-to-have:
- Transaction history with on-chain verification
- Enhanced UI/UX
- NFT badge system for achievements

## Testing Strategy

**Contract Tests:**
- Test NFT minting (one per address)
- Test token distribution (10 CPT per check-in)
- Test token transfers for purchases
- Test insufficient balance scenarios

**Frontend Tests:**
- Mock wallet connection
- Test transaction flow end-to-end
- Test error states

## StarkNet Testnet Configuration

Use StarkNet Sepolia testnet for deployment:
- Get testnet ETH from StarkNet faucet
- Configure RPC endpoints in environment variables
- Store deployed contract addresses in utils/constants.ts

**Environment Variables (frontend/.env):**
```env
VITE_STARKNET_NETWORK=sepolia
VITE_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_STUDENT_NFT_ADDRESS=0x...
VITE_CAMPUS_TOKEN_ADDRESS=0x...
VITE_STORE_ADDRESS=0x...
VITE_BLOCK_EXPLORER_URL=https://sepolia.voyager.online
```

**Contract Address Management:**
- Update CONTRACT_ADDRESSES in utils/constants.ts after deployment
- Addresses used by services for contract instantiation
- Environment variables override for different networks

**Demo/Production Modes:**
- **Demo mode** (`VITE_DEMO_MODE=true`):
  - No wallet connection required - bypasses ArgentX entirely
  - Uses localStorage for state persistence (keys: demo_hasNFT, demo_studentInfo, demo_balance, demo_transactions)
  - Services detect demo mode and return mock data after simulated delays
  - Generates fake transaction hashes for UI consistency
  - Perfect for presentations and testing without deployed contracts
- **Production mode** (`VITE_DEMO_MODE=false` or unset):
  - Requires ArgentX wallet extension installed
  - Connects to live StarkNet contracts via starknet.js
  - Real blockchain transactions with gas fees
  - Services throw errors if contract addresses not configured
- **Mode switching**: Change VITE_DEMO_MODE in .env and restart dev server
- **Current state** (AppContext.tsx:18-19): Demo mode forcibly disabled, always requires real wallet

## Important Development Notes

**Cairo Contract Structure:**
- contracts/src/lib.cairo: Module declarations (includes student_nft and campus_token modules)
- Contracts compiled to target/dev/ with naming pattern: campus_contracts_{ContractName}.contract_class.json
- Each contract produces both .sierra.json and .casm.json artifacts

**TypeScript Configuration:**
- Strict mode enabled
- Build command runs type checking before Vite build: `tsc -b && vite build`
- Use `npx tsc --noEmit` for type-only validation without building

**Wallet Integration Patterns:**
- get-starknet returns wallet object, must call `.enable()` before accessing account
- Account stored in WalletContext and passed to service classes via `initialize(account)` method
- Services must be initialized with account before calling contract methods
- Auto-reconnect logic in WalletContext checks localStorage on mount

**Common Pitfalls:**
- Context provider order matters: App context MUST wrap Toast and Wallet contexts
- Demo mode check appears in both AppContext (global state) and individual services (contract interaction)
- Contract addresses from env vars can be empty strings - services handle gracefully in demo mode
- Transaction hashes must be awaited via `waitForTransaction()` before showing success
- StarkNet uses felt252 and u256 types - ensure proper type conversion in ABI calls