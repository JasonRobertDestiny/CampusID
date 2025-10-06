#!/bin/bash

# Update frontend configuration for production contracts

echo "🔧 Updating frontend to production mode..."

# Deployed contract addresses (replace with actual deployed addresses)
STUDENT_NFT_ADDRESS="0x05a6b90e9c5a0ee52c1cbb688994c5dbb9ed0d5678a1a8e2b638e0e2b1e0b8d1"
CAMPUS_TOKEN_ADDRESS="0x07e5b8e5c8e8b8e5c8e8b8e5c8e8b8e5c8e8b8e5c8e8b8e5c8e8b8e5c8e8b8e5c8e8b"

ENV_FILE="frontend/.env"

# Backup current config
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backup created: $ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Update configuration
sed -i "s/VITE_STUDENT_NFT_ADDRESS=.*/VITE_STUDENT_NFT_ADDRESS=$STUDENT_NFT_ADDRESS/" "$ENV_FILE"
sed -i "s/VITE_CAMPUS_TOKEN_ADDRESS=.*/VITE_CAMPUS_TOKEN_ADDRESS=$CAMPUS_TOKEN_ADDRESS/" "$ENV_FILE"
sed -i "s/VITE_DEMO_MODE=.*/VITE_DEMO_MODE=false/" "$ENV_FILE"

echo "✅ Configuration updated!"
echo ""
echo "📋 New Configuration:"
echo "StudentNFT: $STUDENT_NFT_ADDRESS"
echo "CampusToken: $CAMPUS_TOKEN_ADDRESS"
echo "Demo Mode: false"
echo ""
echo "🚀 Restart your frontend development server to use production contracts:"
echo "   cd frontend && npm run dev"