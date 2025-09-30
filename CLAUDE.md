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
- React + Vite for H5 mobile interface
- starknet.js for blockchain interactions
- Wallet: ArgentX integration

**Smart Contracts:**
- Cairo for StarkNet contracts
- ERC721: Student Certificate NFT (includes avatar, name, student ID)
- ERC20: CampusToken (CPT) - unlimited supply, distributed by contract
- Deploy to StarkNet testnet

## Project Structure (Expected)

```
/contracts/          # Cairo smart contracts
  student_nft.cairo  # ERC721 student certificate
  campus_token.cairo # ERC20 campus points
/src/                # React frontend
  /components/       # UI components
  /services/         # Blockchain interaction layer
  /pages/           # Login, Home, CheckIn, Store, History
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

**Frontend:**
```bash
npm install           # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
```

**Smart Contracts:**
```bash
scarb build          # Compile Cairo contracts
scarb test           # Run contract tests
```

**Deployment:**
```bash
# Deploy to StarkNet testnet using starknet CLI or scripts
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
- Use React Context or lightweight state manager for wallet connection state
- Cache user's NFT metadata and token balance
- Refresh balance after each transaction

**Contract Interaction Pattern:**
- All contract calls through starknet.js
- Handle transaction states: pending, success, error
- Wait for transaction confirmation before updating UI

**Error Handling:**
- Wallet not installed → prompt user to install ArgentX
- Insufficient balance → show clear error message
- Transaction failed → display transaction hash for debugging

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
- Store deployed contract addresses in config file