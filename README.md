# 🎓 Campus ID - Web3 Digital Student Identity

**StarkNet Re{Solve} Hackathon 项目**

一个基于StarkNet的去中心化校园数字身份系统，集成NFT学生证书和校园代币经济。

## 🌟 项目特色

- **🔑 钱包登录** - ArgentX钱包一键连接
- **🎓 NFT证书** - 铸造独特的数字学生身份证书
- **💰 校园代币** - CampusToken (CPT) 签到奖励系统
- **🛒 校园商店** - 使用代币兑换商品
- **📊 交易历史** - 完整的区块链记录查询

## 🚀 快速开始

### 方式1：演示模式（立即可用）
```bash
# 启动前端 - 自动使用演示数据
cd frontend
npm run dev
```

演示模式特点：
- ✅ 无需钱包连接
- ✅ 完整功能展示
- ✅ 模拟区块链交互
- ✅ 适合演示和测试

### 方式2：真实区块链模式

#### 前置要求
- 安装 [ArgentX钱包](https://www.argent.xyz/argent-x/)
- 获取StarkNet Sepolia测试ETH

#### 获取测试ETH
1. 访问水龙头获取测试币：
   - StarkGate: https://starkgate.starknet.io
   - Alchemy: https://sepolia-faucet.starknet.io
   - Thirdweb: https://faucet.thirdweb.com/starknet-sepolia

2. 输入钱包地址：`0x01955B38096A742046Dbe65B85460f479Ce9B2E0Bf36CD5fc2Db9A3562c79fF1`

#### 部署智能合约
```bash
# 方法1: 自动部署脚本
./QUICK_FAUCET_DEPLOY.sh

# 方法2: 手动部署
cd contracts
scarb build
starkli declare target/dev/campus_contracts_StudentNFT.contract_class.json --rpc https://starknet-sepolia.public.blastapi.io --account-address 0x01955B38096A742046Dbe65B85460f479Ce9B2E0Bf36CD5fc2Db9A3562c79fF1 --private-key 0x02173fbe12ff48db4d659179b0655e4189fd440e9b8e5a1461de3caf8d0d76e8 --watch
starkli declare target/dev/campus_contracts_CampusToken.contract_class.json --rpc https://starknet-sepolia.public.blastapi.io --account-address 0x01955B38096A742046Dbe65B85460f479Ce9B2E0Bf36CD5fc2Db9A3562c79fF1 --private-key 0x02173fbe12ff48db4d659179b0655e4189fd440e9b8e5a1461de3caf8d0d76e8 --watch
```

#### 启动生产模式
```bash
# 更新配置为真实合约地址
./update_to_production.sh

# 启动前端
cd frontend
npm run dev
```

## 📱 功能展示

### 1. 钱包连接
- 自动检测ArgentX钱包
- 一键连接StarkNet网络
- 显示钱包地址和余额

### 2. 学生证书NFT
- 首次登录自动铸造
- 包含学生基本信息
- 独特的头像和学号

### 3. 每日签到
- 每天可获得10 CPT代币
- 智能合约自动发放
- 防重复签到机制

### 4. 校园商店
- ☕ 咖啡 - 20 CPT
- 🍞 面包 - 30 CPT
- 🥤 饮料 - 50 CPT
- 即时交易确认

### 5. 交易历史
- 完整的操作记录
- 区块链交易哈希
- 可在Voyager浏览器验证

## 🏗️ 技术架构

### 前端技术栈
- **React 19** + **TypeScript** - 现代化UI框架
- **Vite** - 极速构建工具
- **starknet.js v7** - StarkNet区块链交互
- **Tailwind CSS** - 移动端优先设计

### 智能合约
- **Cairo 2024_07** - StarkNet智能合约语言
- **OpenZeppelin** - 安全的合约标准
- **StudentNFT** - ERC721学生证书
- **CampusToken** - ERC20校园代币

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