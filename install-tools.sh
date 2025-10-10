#!/bin/bash

# Quick Install Script for StarkNet Tools
echo "🚀 Installing StarkNet Development Tools..."
echo ""

# Install Scarb
echo "📦 [1/2] Installing Scarb (Cairo build tool)..."
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Install Starkli
echo "🔧 [2/2] Installing Starkli (deployment tool)..."
curl https://get.starkli.sh | sh

echo ""
echo "✅ Installation complete!"
echo ""
echo
echo "scarb --version"
echo "starkli --version"
echo ""
 "⚠️  IMPORTANT: Run these commands to activate:"
echo ""
echo "source ~/.bashrc"
echo "source ~/.starkli/env"
echo "starkliup"
echo ""
echo "Then verify with:"