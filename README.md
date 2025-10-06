# 🎓 Campus ID - Web3 Digital Student Identity

A decentralized campus digital identity ecosystem built on StarkNet, enabling students to mint NFT-based certificates, earn campus tokens through check-ins, and participate in a tokenized campus economy.

## 🌟 Features

- **🆔 NFT Student Certificate**: Mint unique student ID as an ERC721 NFT
- **🪙 Campus Points (CPT)**: ERC20 token economy for campus activities
- **📝 Daily Check-ins**: Earn 10 CPT tokens for each check-in
- **🛒 Campus Store**: Purchase virtual items using CPT tokens
- **📜 Transaction History**: Track all activities with on-chain verification

## 🚀 Quick Start

### Demo Mode (Immediate)
```bash
# Start frontend with demo data
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

Demo features:
- ✅ No wallet connection required
- ✅ Full functionality showcase
- ✅ Simulated blockchain interactions
- ✅ Perfect for presentations

### Production Mode (Live)

#### Prerequisites
- Install [ArgentX Wallet](https://www.argent.xyz/argent-x/)
- Get StarkNet Sepolia testnet ETH

#### Deployment
```bash
# Deploy contracts
cd contracts
scarb build
./deploy.sh

# Update frontend config
./update_to_production.sh

# Start production frontend
cd ../frontend
npm run dev
```

## 🏗️ Tech Stack

### Smart Contracts
- **Cairo 2024_07** - StarkNet smart contract language
- **OpenZeppelin** - Security standards for ERC721/ERC20
- **StudentNFT** - ERC721 student certificate contract
- **CampusToken** - ERC20 campus token contract

### Frontend
- **React 19** + **TypeScript** - Modern UI framework
- **Vite** - Ultra-fast build tool
- **starknet.js v7** - StarkNet blockchain interaction
- **Tailwind CSS** - Mobile-first responsive design

### Infrastructure
- **StarkNet Layer 2** - Low fees, high throughput
- **Account Abstraction** - User-friendly wallet experience
- **Sepolia Testnet** - Development and testing

## 📱 User Experience

### 1. Wallet Connection
- Auto-detect ArgentX wallet
- One-click StarkNet network connection
- Display wallet address and balance

### 2. Student Certificate NFT
- Auto-minted on first login
- Contains student metadata (avatar, name, ID)
- Unique and permanent digital identity

### 3. Daily Check-in
- Earn 10 CPT tokens daily
- Smart contract auto-distribution
- Anti-duplicate check-in mechanism

### 4. Campus Store
- ☕ Coffee - 20 CPT
- 🍞 Bread - 30 CPT
- 🥤 Drink - 50 CPT
- Instant transaction confirmation

### 5. Transaction History
- Complete operation records
- Blockchain transaction hashes
- Verifiable on Voyager explorer

## 🎯 Project Structure

```
StarkNet_hackathon/
├── contracts/                 # Cairo smart contracts
│   ├── src/
│   │   ├── student_nft.cairo # ERC721 Student Certificate
│   │   └── campus_token.cairo# ERC20 Campus Token
│   └── Scarb.toml            # Contract configuration
│
└── frontend/                  # React frontend
    ├── src/
    │   ├── components/       # UI components
    │   ├── contexts/         # Wallet and app contexts
    │   ├── pages/           # App pages (Login, Home, etc.)
    │   ├── services/        # Contract interaction services
    │   ├── types/           # TypeScript types
    │   └── utils/           # Helpers and constants
    └── package.json         # Dependencies
```

## 🔧 Development

### Environment Setup
```bash
# Install Cairo/Scarb
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Install frontend dependencies
cd frontend
npm install
```

### Development Commands
```bash
# Frontend development
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint

# Contract development
cd contracts
scarb build          # Compile contracts
scarb test           # Run tests
```

### Environment Variables
Create `frontend/.env`:
```env
VITE_STARKNET_NETWORK=sepolia
VITE_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_STUDENT_NFT_ADDRESS=0x...
VITE_CAMPUS_TOKEN_ADDRESS=0x...
VITE_STORE_ADDRESS=0x...
VITE_DEMO_MODE=true  # Set to false for production
```

## 🎪 Demo Instructions

### Quick Demo
1. Run `npm run dev` in frontend directory
2. Visit http://localhost:5173
3. Explore all features without wallet
4. Experience complete user journey

### Production Demo
1. Connect ArgentX wallet
2. Switch to Sepolia testnet
3. Mint student NFT certificate
4. Perform check-ins and store purchases
5. Verify transactions on blockchain explorer

## 🏆 Innovation Points

### Technical Innovation
- **First on StarkNet**: Pioneer student identity system on StarkNet
- **Account Abstraction**: Seamless wallet experience
- **Hybrid Architecture**: Demo + production modes
- **Mobile Optimization**: H5-first responsive design

### Business Innovation
- **Educational DeFi**: Tokenized campus participation
- **Digital Identity**: Verifiable student credentials
- **Incentive Mechanics**: Gamified campus engagement
- **Data Sovereignty**: User-controlled digital identity

## 📊 Project Status

### ✅ Completed
- [x] Smart contracts (StudentNFT + CampusToken)
- [x] Frontend application (5 complete pages)
- [x] Wallet integration (ArgentX)
- [x] Demo mode functionality
- [x] Mobile responsive design
- [x] Transaction history system
- [x] Complete documentation

### 🚀 Future Enhancements
- [ ] Multi-campus support
- [ ] Achievement system
- [ ] DeFi integrations
- [ ] Cross-chain compatibility
- [ ] Admin dashboard
- [ ] Advanced NFT attributes

## 🧪 Testing

### Build Test
```bash
cd frontend && npm run build
```

### Contract Test
```bash
cd contracts && scarb test
```

## 📚 Documentation

- [DEMO_GUIDE.md](./DEMO_GUIDE.md) - Detailed demo instructions
- [SUBMISSION.md](./SUBMISSION.md) - Hackathon submission details

## 🐛 Troubleshooting

**Wallet won't connect:**
- Install ArgentX extension
- Switch to Sepolia testnet
- Refresh the page

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Contract not found:**
- Deploy contracts first
- Update `.env` with addresses
- Restart dev server

## 📄 License

MIT License

## 🙏 Acknowledgments

Built for StarkNet Re{Solve} Hackathon

- StarkNet Foundation
- StarkWare
- OpenZeppelin
- ArgentX Wallet

---

**Built with ❤️ on StarkNet**