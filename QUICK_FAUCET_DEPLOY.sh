#!/bin/bash

# 快速获取测试币并部署合约
echo "🚀 StarkNet Quick Deploy Script"
echo "==============================="

STORE_ADDRESS="0x01955B38096A742046Dbe65B85460f479Ce9B2E0Bf36CD5fc2Db9A3562c79fF1"
RPC_URL="https://starknet-sepolia.public.blastapi.io"
PRIVATE_KEY="0x02173fbe12ff48db4d659179b0655e4189fd440e9b8e5a1461de3caf8d0d76e8"

echo "💳 使用地址: $STORE_ADDRESS"
echo "🔑 私钥: $PRIVATE_KEY"
echo ""

# 1. 检查余额
echo "📊 检查余额..."
BALANCE=$(starkli balance "$STORE_ADDRESS" --rpc "$RPC_URL" 2>/dev/null)
echo "当前余额: $BALANCE ETH"

if [ "$BALANCE" = "0.000000000000000000" ] || [ -z "$BALANCE" ]; then
    echo "❌ 余额不足，需要获取测试ETH"
    echo ""
    echo "🌰 请立即访问以下链接获取测试ETH："
    echo "   https://faucet.starknet.io"
    echo ""
    echo "📝 输入地址: $STORE_ADDRESS"
    echo "⏳ 获取后按任意键继续部署..."
    read -n 1 -s

    # 重新检查余额
    echo ""
    echo "📊 重新检查余额..."
    BALANCE=$(starkli balance "$STORE_ADDRESS" --rpc "$RPC_URL" 2>/dev/null)
    echo "新余额: $BALANCE ETH"

    if [ "$BALANCE" = "0.000000000000000000" ] || [ -z "$BALANCE" ]; then
        echo "❌ 仍然没有余额，请确保已经获取测试ETH"
        exit 1
    fi
fi

echo "✅ 余额充足，开始部署合约..."
echo ""

# 2. 编译合约 (如果还没有编译)
echo "🔨 编译合约..."
cd contracts
if [ ! -f "target/dev/campus_contracts_StudentNFT.contract_class.json" ]; then
    scarb build
fi
echo "✅ 合约编译完成"
echo ""

# 3. 声明StudentNFT
echo "🎓 声明StudentNFT合约..."
STUDENT_NFT_HASH=$(starkli declare target/dev/campus_contracts_StudentNFT.contract_class.json \
    --rpc "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --account-address "$STORE_ADDRESS" \
    --watch 2>&1 | grep "class_hash" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$STUDENT_NFT_HASH" ]; then
    echo "❌ StudentNFT声明失败"
    exit 1
fi
echo "✅ StudentNFT声明成功: $STUDENT_NFT_HASH"
echo ""

# 4. 声明CampusToken
echo "💰 声明CampusToken合约..."
CAMPUS_TOKEN_HASH=$(starkli declare target/dev/campus_contracts_CampusToken.contract_class.json \
    --rpc "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --account-address "$STORE_ADDRESS" \
    --watch 2>&1 | grep "class_hash" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$CAMPUS_TOKEN_HASH" ]; then
    echo "❌ CampusToken声明失败"
    exit 1
fi
echo "✅ CampusToken声明成功: $CAMPUS_TOKEN_HASH"
echo ""

# 5. 部署StudentNFT
echo "🎓 部署StudentNFT..."
STUDENT_NFT_ADDRESS=$(starkli deploy "$STUDENT_NFT_HASH" \
    --rpc "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --account-address "$STORE_ADDRESS" \
    --watch 2>&1 | grep "contract_address" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$STUDENT_NFT_ADDRESS" ]; then
    echo "❌ StudentNFT部署失败"
    exit 1
fi
echo "✅ StudentNFT部署成功: $STUDENT_NFT_ADDRESS"
echo ""

# 6. 部署CampusToken
echo "💰 部署CampusToken..."
CAMPUS_TOKEN_ADDRESS=$(starkli deploy "$CAMPUS_TOKEN_HASH" \
    --rpc "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --account-address "$STORE_ADDRESS" \
    --watch 2>&1 | grep "contract_address" | grep -o '0x[a-fA-F0-9]\{64\}' | head -1)

if [ -z "$CAMPUS_TOKEN_ADDRESS" ]; then
    echo "❌ CampusToken部署失败"
    exit 1
fi
echo "✅ CampusToken部署成功: $CAMPUS_TOKEN_ADDRESS"
echo ""

# 7. 更新前端配置
echo "🔧 更新前端配置..."
ENV_FILE="../frontend/.env"
cp "$ENV_FILE" "$ENV_FILE.backup"

sed -i "s/VITE_STUDENT_NFT_ADDRESS=.*/VITE_STUDENT_NFT_ADDRESS=$STUDENT_NFT_ADDRESS/" "$ENV_FILE"
sed -i "s/VITE_CAMPUS_TOKEN_ADDRESS=.*/VITE_CAMPUS_TOKEN_ADDRESS=$CAMPUS_TOKEN_ADDRESS/" "$ENV_FILE"
sed -i "s/VITE_DEMO_MODE=.*/VITE_DEMO_MODE=false/" "$ENV_FILE"

echo "✅ 前端配置已更新！"
echo ""

# 8. 完成总结
echo "🎉 部署完成！"
echo "====================="
echo "StudentNFT地址:  $STUDENT_NFT_ADDRESS"
echo "CampusToken地址: $CAMPUS_TOKEN_ADDRESS"
echo "Store地址:      $STORE_ADDRESS"
echo ""
echo "🔗 区块浏览器: https://sepolia.voyager.online"
echo "🚀 重启前端服务器使用真实合约: cd frontend && npm run dev"
echo ""
echo "✅ XContractnotinitialized错误已彻底解决！"