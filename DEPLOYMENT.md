# 🚀 Deployment Guide

Complete deployment guide for the Campus ID application to StarkNet testnet.

## Prerequisites Checklist

- [ ] Scarb installed (`scarb --version`)
- [ ] Starkli installed for deployment
- [ ] ArgentX wallet with Sepolia testnet ETH
- [ ] Node.js v18+ installed

## Part 1: Smart Contract Deployment

### Step 1: Build Contracts

```bash
cd contracts
scarb build
```

Expected output:
```
Compiling campus_contracts v0.1.0
Finished release target(s) in X seconds
```

### Step 2: Install Starkli (Deployment Tool)

```bash
curl https://get.starkli.sh | sh
starkliup
```

### Step 3: Setup Starkli Account

```bash
# Create account directory
mkdir -p ~/.starkli-wallets/deployer

# Fetch your account from ArgentX
starkli account fetch <YOUR_ARGENT_ADDRESS> \
  --rpc https://starknet-sepolia.public.blastapi.io \
  --output ~/.starkli-wallets/deployer/account.json

# Create keystore from your private key
starkli signer keystore from-key ~/.starkli-wallets/deployer/keystore.json
# Enter your private key when prompted
```

### Step 4: Declare Contracts

```bash
# Declare Student NFT
starkli declare target/dev/campus_contracts_StudentNFT.sierra.json \
  --rpc https://starknet-sepolia.public.blastapi.io \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json

# Save the class hash output

# Declare Campus Token
starkli declare target/dev/campus_contracts_CampusToken.sierra.json \
  --rpc https://starknet-sepolia.public.blastapi.io \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json

# Save the class hash output
```

### Step 5: Deploy Contracts

```bash
# Deploy Student NFT (no constructor args)
starkli deploy <STUDENT_NFT_CLASS_HASH> \
  --rpc https://starknet-sepolia.public.blastapi.io \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json

# Save the contract address: 0x...

# Deploy Campus Token (needs owner address)
starkli deploy <CAMPUS_TOKEN_CLASS_HASH> \
  <YOUR_WALLET_ADDRESS> \
  --rpc https://starknet-sepolia.public.blastapi.io \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json

# Save the contract address: 0x...
```

### Step 6: Verify Contracts on StarkScan

1. Go to https://sepolia.starkscan.co/
2. Search for your contract addresses
3. Verify deployment success

### Step 7: Record Contract Addresses

Create a deployment record:

```
Student NFT Address: 0x...
Campus Token Address: 0x...
Store Address: 0x... (use your wallet or create dedicated store wallet)
Deployed on: [Date]
Network: StarkNet Sepolia
Deployer: 0x...
```

## Part 2: Frontend Deployment

### Step 1: Configure Environment Variables

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_STARKNET_NETWORK=sepolia
VITE_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_STUDENT_NFT_ADDRESS=0x...  # From Step 5
VITE_CAMPUS_TOKEN_ADDRESS=0x... # From Step 5
VITE_STORE_ADDRESS=0x...        # Your store wallet address
VITE_BLOCK_EXPLORER_URL=https://sepolia.voyager.online
```

### Step 2: Test Build Locally

```bash
npm install
npm run build
npm run preview
```

Visit `http://localhost:4173` and test:
- [ ] Wallet connection
- [ ] NFT minting
- [ ] Check-in function
- [ ] Store purchases
- [ ] Transaction history

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: campus-id-starknet
# - Directory: ./
# - Build command: npm run build
# - Output directory: dist

# Production deployment
vercel --prod
```

### Step 4: Deploy to Netlify (Alternative)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### Step 5: Configure Deployment Platform

**Environment Variables on Vercel/Netlify:**

Add these in dashboard:
```
VITE_STARKNET_NETWORK=sepolia
VITE_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
VITE_STUDENT_NFT_ADDRESS=0x...
VITE_CAMPUS_TOKEN_ADDRESS=0x...
VITE_STORE_ADDRESS=0x...
VITE_BLOCK_EXPLORER_URL=https://sepolia.voyager.online
```

## Part 3: Testing Deployment

### Contract Testing

```bash
# Test Student NFT mint
starkli invoke <STUDENT_NFT_ADDRESS> mint_student_nft \
  "https://avatar.url" "John Doe" "STU123456" \
  --rpc https://starknet-sepolia.public.blastapi.io \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json

# Test Campus Token check-in
starkli invoke <CAMPUS_TOKEN_ADDRESS> check_in \
  --rpc https://starknet-sepolia.public.blastapi.io \
  --account ~/.starkli-wallets/deployer/account.json \
  --keystore ~/.starkli-wallets/deployer/keystore.json

# Check balance
starkli call <CAMPUS_TOKEN_ADDRESS> balance_of <YOUR_ADDRESS> \
  --rpc https://starknet-sepolia.public.blastapi.io
```

### Frontend Testing Checklist

Test on deployed site:

- [ ] Login page loads correctly
- [ ] ArgentX connection works
- [ ] Can mint student NFT (first time)
- [ ] Student certificate displays correctly
- [ ] Check-in awards 10 CPT
- [ ] Balance updates after check-in
- [ ] Store displays products
- [ ] Can purchase items with CPT
- [ ] Transaction history records actions
- [ ] Explorer links work correctly
- [ ] Mobile responsiveness

## Part 4: Hackathon Submission

### 1. Create Demo Video (Max 3 minutes)

**Script:**
- 0:00-0:30: Introduction and problem statement
- 0:30-1:00: Show wallet connection
- 1:00-1:30: Demonstrate NFT minting
- 1:30-2:00: Show check-in and earning CPT
- 2:00-2:30: Demonstrate store purchase
- 2:30-3:00: Show transaction history and conclusion

**Tools:**
- Loom: https://loom.com
- OBS Studio: https://obsproject.com
- QuickTime (Mac)

### 2. Prepare GitHub Repository

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: Campus ID hackathon project"

# Create GitHub repo and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

**Ensure repository includes:**
- [x] Complete source code
- [x] README.md with setup instructions
- [x] CLAUDE.md for AI assistance
- [x] Deployment guide
- [x] Smart contracts
- [x] Frontend code

### 3. Create Pitch Deck (Optional)

**Slides:**
1. Title: Campus ID - Web3 Digital Identity
2. Problem: Traditional campus identity systems are centralized
3. Solution: Decentralized NFT-based student certificates + token economy
4. Technology: StarkNet, Cairo, React, ERC721, ERC20
5. Demo: Screenshots of key features
6. Roadmap: Future features (AI assistant, more badges, cross-campus)
7. Team & Contact

### 4. Submit on Devpost

**Required Information:**
- Project Title: "Campus ID - Web3 Digital Student Identity"
- Tagline: "Decentralized campus identity with NFT certificates and token rewards"
- Description: Full project description
- Demo URL: Your deployed frontend URL
- GitHub URL: Repository link
- Demo Video: Upload your 3-minute video
- Built With: StarkNet, Cairo, React, TypeScript
- Track: Mobile / Payments / Open Track

**Before Submitting:**
- [ ] Test all links
- [ ] Verify video plays correctly
- [ ] Check demo site is accessible
- [ ] Ensure GitHub repo is public
- [ ] Double-check submission deadline

## Troubleshooting

### Contract Deployment Fails

**"Insufficient fee":**
```bash
# Get more testnet ETH from faucet
# https://faucet.goerli.starknet.io/
```

**"Class already declared":**
```bash
# Use existing class hash for deployment
# Skip declare step
```

### Frontend Build Errors

**"Module not found":**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Environment variables undefined":**
- Ensure `.env` file exists in `frontend/` directory
- Check variable names start with `VITE_`
- Rebuild after changing env vars

### Wallet Connection Issues

- Clear browser cache
- Reinstall ArgentX extension
- Ensure you're on Sepolia testnet
- Try different browser

## Post-Deployment Monitoring

### Monitor Contract Activity

```bash
# View contract on explorer
https://sepolia.voyager.online/contract/<YOUR_CONTRACT_ADDRESS>

# Monitor transactions
https://sepolia.starkscan.co/contract/<YOUR_CONTRACT_ADDRESS>
```

### Analytics (Optional)

Add Google Analytics or similar to track:
- Wallet connections
- NFT mints
- Check-ins
- Purchases
- User retention

## Backup and Security

### Backup Important Data

```bash
# Backup contract addresses
echo "Student NFT: 0x..." > deployment-addresses.txt
echo "Campus Token: 0x..." >> deployment-addresses.txt

# Backup .env file (store securely, not in git)
cp .env .env.backup

# Backup deployment account
cp ~/.starkli-wallets/deployer/account.json ~/backups/
```

### Security Checklist

- [ ] Never commit private keys or .env files
- [ ] Store keystore files securely
- [ ] Use environment variables for sensitive data
- [ ] Audit contracts before mainnet deployment
- [ ] Test all functions on testnet first
- [ ] Keep deployment credentials secure

## Next Steps After Hackathon

If continuing development:

1. **Audit smart contracts** with OpenZeppelin or CertiK
2. **Add more features**: AI learning assistant, achievement badges
3. **Deploy to mainnet** after thorough testing
4. **Implement tokenomics**: Staking, rewards, governance
5. **Add mobile app**: React Native version
6. **Integrate with real universities**: Pilot program
7. **Add cross-campus features**: Multi-university support

---

Good luck with your deployment! 🚀