#!/bin/bash
# Campus ID - StarkNet Contract Deployment Script
# Execute in WSL: bash deploy.sh

set -e

echo "🎓 Campus ID Contract Deployment"
echo "================================="
echo ""

# Configuration
ACCOUNT_ADDRESS="0x01955B38096A742046Dbe65B85460f479Ce9B2E0Bf36CD5fc2Db9A3562c79fF1"
RPC_URL="https://starknet-sepolia.public.blastapi.io"

# Check for private key
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable not set"
    echo "Please run: export PRIVATE_KEY=<your_private_key>"
    exit 1
fi

# Check starkli installation
if ! command -v starkli &> /dev/null; then
    echo "❌ Error: starkli not found"
    echo "Install from: https://book.starkli.rs/installation"
    exit 1
fi

cd "$(dirname "$0")"

# 1. Declare StudentNFT
echo "📝 Declaring StudentNFT contract..."
STUDENT_DECLARE_OUTPUT=$(starkli declare target/dev/campus_contracts_StudentNFT.contract_class.json \
    --rpc "$RPC_URL" \
    --account "$ACCOUNT_ADDRESS" \
    --private-key "$PRIVATE_KEY" \
    --watch 2>&1)

echo "$STUDENT_DECLARE_OUTPUT"
STUDENT_CLASS_HASH=$(echo "$STUDENT_DECLARE_OUTPUT" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$STUDENT_CLASS_HASH" ]; then
    echo "❌ StudentNFT declaration failed"
    echo "Full output above ⬆️"
    exit 1
fi
echo "✅ StudentNFT declared: $STUDENT_CLASS_HASH"
echo ""

# 2. Declare CampusToken
echo "💰 Declaring CampusToken contract..."
TOKEN_CLASS_HASH=$(starkli declare target/dev/campus_contracts_CampusToken.contract_class.json \
    --rpc "$RPC_URL" \
    --account "$ACCOUNT_ADDRESS" \
    --private-key "$PRIVATE_KEY" \
    --watch 2>&1 | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$TOKEN_CLASS_HASH" ]; then
    echo "❌ CampusToken declaration failed"
    exit 1
fi
echo "✅ CampusToken declared: $TOKEN_CLASS_HASH"
echo ""

# 3. Deploy StudentNFT (no constructor args)
echo "🚀 Deploying StudentNFT..."
STUDENT_NFT_ADDRESS=$(starkli deploy "$STUDENT_CLASS_HASH" \
    --rpc "$RPC_URL" \
    --account "$ACCOUNT_ADDRESS" \
    --private-key "$PRIVATE_KEY" \
    --watch 2>&1 | grep "contract_address" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$STUDENT_NFT_ADDRESS" ]; then
    echo "❌ StudentNFT deployment failed"
    exit 1
fi
echo "✅ StudentNFT deployed: $STUDENT_NFT_ADDRESS"
echo ""

# 4. Deploy CampusToken (with initial_owner = ACCOUNT_ADDRESS)
echo "🚀 Deploying CampusToken..."
CAMPUS_TOKEN_ADDRESS=$(starkli deploy "$TOKEN_CLASS_HASH" \
    --rpc "$RPC_URL" \
    --account "$ACCOUNT_ADDRESS" \
    --private-key "$PRIVATE_KEY" \
    "$ACCOUNT_ADDRESS" \
    --watch 2>&1 | grep "contract_address" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$CAMPUS_TOKEN_ADDRESS" ]; then
    echo "❌ CampusToken deployment failed"
    exit 1
fi
echo "✅ CampusToken deployed: $CAMPUS_TOKEN_ADDRESS"
echo ""

# 5. Update frontend .env
echo "🔧 Updating frontend/.env..."
ENV_FILE="../frontend/.env"

# Backup original
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_FILE.backup"
fi

# Update contract addresses
cat > "$ENV_FILE" << EOF
# StarkNet Network Configuration
VITE_STARKNET_NETWORK=sepolia
VITE_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io

# Deployed Contract Addresses (Production Mode)
VITE_STUDENT_NFT_ADDRESS=$STUDENT_NFT_ADDRESS
VITE_CAMPUS_TOKEN_ADDRESS=$CAMPUS_TOKEN_ADDRESS

# Store Configuration
VITE_STORE_ADDRESS=$ACCOUNT_ADDRESS

# Block Explorer
VITE_BLOCK_EXPLORER_URL=https://sepolia.voyager.online

# Demo Mode (Set to false for production)
VITE_DEMO_MODE=false
EOF

echo "✅ Frontend .env updated!"
echo ""

# Summary
echo "🎉 Deployment Complete!"
echo "======================="
echo "StudentNFT:    $STUDENT_NFT_ADDRESS"
echo "CampusToken:   $CAMPUS_TOKEN_ADDRESS"
echo "Store Address: $ACCOUNT_ADDRESS"
echo ""
echo "🔗 Block Explorer: https://sepolia.voyager.online"
echo "🚀 Restart frontend: cd ../frontend && npm run dev"
echo ""
echo "📋 Contract addresses saved to frontend/.env"
