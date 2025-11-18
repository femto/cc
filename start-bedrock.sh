#!/bin/bash

# Claude Code CLI - AWS Bedrock Launcher
# 使用你的 Bedrock 凭证启动 Claude Code

set -e

echo "🚀 Starting Claude Code with AWS Bedrock..."
echo ""

# AWS Bedrock 配置
export CLAUDE_CODE_USE_BEDROCK=true
# Load credentials from environment or AWS profile
# Set these in your shell or use: aws configure
export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
export AWS_REGION="${AWS_REGION:-us-east-1}"

# Bedrock 模型
MODEL="us.anthropic.claude-sonnet-4-20250514-v1:0"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed."
    echo ""
    echo "Please install Node.js 18+ first:"
    echo "  - macOS: brew install node"
    echo "  - Ubuntu: sudo apt install nodejs npm"
    echo "  - Or use nvm: https://github.com/nvm-sh/nvm"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18+ is required (current: $(node --version))"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ Using model: $MODEL"
echo "✅ Region: $AWS_REGION"
echo ""

# 运行 CLI
exec ./cli.js --model "$MODEL" "$@"
