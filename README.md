# 🎓 Campus ID - Web3 Digital Student Identity

A Web3-based campus digital identity and points ecosystem built on StarkNet. Students can mint NFT-based student certificates, earn campus points (CPT) through check-ins, and spend them at the virtual campus store.

## 🌟 Features

- **🆔 NFT Student Certificate**: Mint unique student ID as an ERC721 NFT
- **🪙 Campus Points (CPT)**: ERC20 token economy for campus activities
- **📝 Daily Check-ins**: Earn 10 CPT tokens for each check-in
- **🛒 Campus Store**: Purchase virtual items using CPT tokens
- **📜 Transaction History**: Track all activities with on-chain verification

## 🏗️ Tech Stack

**Smart Contracts**: Cairo, Scarb, StarkNet
**Frontend**: React 18, TypeScript, Vite, starknet.js
**Wallet**: ArgentX

## 📁 Project Structure

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
    │   ├── contexts/         # Wallet context
    │   ├── pages/           # Login, Home, CheckIn, Store, History
    │   ├── services/        # Contract interaction
    │   ├── types/           # TypeScript types
    │   └── utils/           # Helpers & constants
    └── package.json         # Dependencies
```

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Scarb](https://docs.swmansion.com/scarb/download) (Cairo build tool)
- [ArgentX Wallet](https://www.argent.xyz/argent-x/)

### Installation

```bash
# Install Scarb
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Install frontend dependencies
cd frontend
npm install
```

### Build Contracts

```bash
cd contracts
scarb build
```

### Run Frontend

```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

## 📝 Smart Contract Development

### Build

```bash
cd contracts
scarb build
```

### Deploy to StarkNet Sepolia

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🎨 Frontend Development

### Development Server

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview  # Test production build
```

### Environment Configuration

Create `.env` in `frontend/` directory:

```env
VITE_STARKNET_NETWORK=sepolia
VITE_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_STUDENT_NFT_ADDRESS=0x...
VITE_CAMPUS_TOKEN_ADDRESS=0x...
VITE_STORE_ADDRESS=0x...
VITE_BLOCK_EXPLORER_URL=https://sepolia.voyager.online
```

## 🎯 User Flow

1. **Connect Wallet**: User connects ArgentX wallet
2. **Mint NFT**: First-time users mint their student certificate
3. **Check-in**: Users earn 10 CPT tokens daily
4. **Shop**: Browse and purchase items with CPT
5. **History**: View all transactions with blockchain verification

## 📄 Smart Contracts

### StudentNFT (ERC721)

```cairo
mint_student_nft(avatar_uri, student_name, student_id) → token_id
has_nft(account) → bool
get_student_info(token_id) → (avatar, name, id)
```

### CampusToken (ERC20)

```cairo
check_in() → bool              // Mint 10 CPT to caller
purchase(store, amount) → bool // Transfer tokens for purchase
balance_of(account) → u256
```

## 🔧 Configuration

### Store Products

Edit `frontend/src/utils/constants.ts`:

```typescript
export const PRODUCTS = [
  { id: '1', name: 'Coffee', price: '20', image: '☕' },
  { id: '2', name: 'Bread', price: '30', image: '🍞' },
  { id: '3', name: 'Drink', price: '50', image: '🥤' },
];
```

## 🚢 Deployment

### Smart Contracts

1. Deploy StudentNFT contract
2. Deploy CampusToken contract
3. Update `.env` with contract addresses

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guide.

### Frontend

Deploy to Vercel/Netlify:

```bash
cd frontend
npm run build
# Deploy dist/ folder
```

## 🧪 Testing

### Build Test

```bash
cd frontend
npm run build
```

### Contract Test

```bash
cd contracts
scarb test
```

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [CLAUDE.md](./CLAUDE.md) - Architecture notes for AI assistance

## 🐛 Troubleshooting

**Wallet won't connect:**
- Install ArgentX extension
- Switch to Sepolia testnet
- Refresh page

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
- ArgentX Wallet

---

**Built with ❤️ on StarkNet**