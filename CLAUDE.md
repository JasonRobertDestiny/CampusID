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
- React 19 + TypeScript + Vite for H5 mobile interface
- starknet.js v7 for blockchain interactions
- React Router v7 for navigation
- ArgentX wallet integration via get-starknet
- Mobile-first responsive design with CSS custom properties

**Smart Contracts:**
- Cairo for StarkNet contracts (edition 2024_07)
- OpenZeppelin ERC721 and ERC20 implementations
- StudentNFT: ERC721 with student metadata (avatar, name, student ID)
- CampusToken: ERC20 with check-in reward mechanism
- Scarb build system for compilation to Sierra and CASM
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
scarb test           # Run contract tests
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
```

**Deployment:**
```bash
# Deploy to StarkNet testnet using starkli CLI
# See DEPLOYMENT.md for detailed deployment instructions
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
- Three-context provider architecture: WalletProvider → AppProvider → ToastProvider
- WalletContext handles ArgentX connection via get-starknet library
- AppContext manages application state (user data, transactions, balances)
- ToastContext handles user notifications and loading states
- Mock services system in services/mockServices.ts for development without deployed contracts

**Contract Interaction Pattern:**
- Service-based architecture: StudentNFTService and CampusTokenService
- All contract calls through starknet.js Contract class with ABI definitions
- Services handle ABI parsing, contract instantiation, and transaction execution
- Handle transaction states: pending, success, error
- Wait for transaction confirmation before updating UI
- Mock data system in utils/mockData.ts for offline development

**Configuration Management:**
- CONTRACT_ADDRESSES constant in utils/constants.ts for contract addresses
- Environment variables for network endpoints (VITE_STARKNET_RPC_URL)
- Store products configurable via PRODUCTS array in constants
- Avatar picker component for NFT customization

**Error Handling:**
- Wallet not installed → prompt user to install ArgentX
- Insufficient balance → show clear error message
- Transaction failed → display transaction hash for debugging
- Network issues → show retry mechanism with timeout handling

## UI Pages

1. **Login Page:** Wallet connection button
2. **Home Page:** Display student certificate NFT card
3. **Check-in Page:** Button to earn 10 CPT
4. **Store Page:** Product list with prices in CPT
5. **History Page:** Transaction records

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