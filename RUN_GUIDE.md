# 如何运行 Claude Code CLI

## ⚠️ 重要说明

**重构后的代码（`src/` 目录）是为了阅读和理解用的，不能直接运行。**

实际可运行的代码是原始的 `cli.js` 文件。

## 🚀 运行原始 CLI

### 前置要求

需要安装 **Node.js 18+**：

```bash
# 检查是否已安装
node --version

# 如果没有安装，使用以下方法之一：

# macOS (使用 Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用 nvm (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 配置 AWS Bedrock

#### 方法 1: 使用环境变量（推荐）

```bash
# 设置环境变量
export CLAUDE_CODE_USE_BEDROCK=true
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_REGION="us-east-1"

# 运行 CLI
./cli.js --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

#### 方法 2: 使用 .env 文件

```bash
# 1. 创建 .env 文件
cp .env.example .env

# 2. 编辑 .env 文件，填入你的凭证
cat > .env << 'EOF'
CLAUDE_CODE_USE_BEDROCK=true
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_REGION=us-east-1
EOF

# 3. 加载环境变量并运行
source .env
./cli.js --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

#### 方法 3: 使用 AWS 配置文件

```bash
# 配置 AWS CLI（如果已安装）
aws configure set aws_access_key_id YOUR_ACCESS_KEY_ID
aws configure set aws_secret_access_key YOUR_SECRET_ACCESS_KEY
aws configure set region us-east-1

# 启用 Bedrock 并运行
CLAUDE_CODE_USE_BEDROCK=true ./cli.js --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

## 📝 使用示例

### 1. 交互式模式（默认）

```bash
# 启动交互式会话
./cli.js

# 使用 Bedrock
CLAUDE_CODE_USE_BEDROCK=true ./cli.js --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

### 2. 单次查询（打印模式）

```bash
# 简单查询
./cli.js -p "What is the capital of France?"

# 使用 Bedrock
CLAUDE_CODE_USE_BEDROCK=true \
./cli.js -p "Explain Python decorators" \
  --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

### 3. 继续上次对话

```bash
./cli.js -c
```

### 4. 恢复特定会话

```bash
./cli.js -r <session-id>
```

### 5. 调试模式

```bash
./cli.js --debug -p "test query"
```

## 🔧 完整的 Bedrock 配置示例

创建一个启动脚本：

```bash
# 创建 start-bedrock.sh
cat > start-bedrock.sh << 'EOF'
#!/bin/bash

# AWS Bedrock 配置
export CLAUDE_CODE_USE_BEDROCK=true
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_REGION="us-east-1"

# Bedrock 模型
MODEL="us.anthropic.claude-sonnet-4-20250514-v1:0"

# 运行 CLI
./cli.js --model "$MODEL" "$@"
EOF

# 添加执行权限
chmod +x start-bedrock.sh

# 使用
./start-bedrock.sh -p "Hello, Claude!"
```

## 🧪 测试连接

### 测试 Bedrock 连接

```bash
# 设置环境变量
export CLAUDE_CODE_USE_BEDROCK=true
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_REGION="us-east-1"

# 简单测试
./cli.js -p "Say hello" \
  --model "us.anthropic.claude-sonnet-4-20250514-v1:0" \
  --debug

# 如果成功，你会看到 Claude 的回复
# 如果失败，--debug 会显示详细的错误信息
```

### 常见问题排查

```bash
# 1. 检查 Node.js 版本
node --version  # 需要 18+

# 2. 检查 AWS 凭证是否正确
aws sts get-caller-identity  # 需要 AWS CLI

# 3. 检查 Bedrock 权限
aws bedrock list-foundation-models --region us-east-1

# 4. 启用详细日志
./cli.js -p "test" --verbose --debug
```

## 📊 所有可用选项

```bash
./cli.js --help

# 常用选项：
# -p, --print              打印模式（非交互）
# -c, --continue           继续上次对话
# -r, --resume [id]        恢复会话
# --model <model>          指定模型
# --debug                  调试模式
# --verbose                详细输出
# --max-turns <n>          最大回合数
# --max-budget-usd <n>     预算限制
```

## ⚡ 性能优化

### 使用异步 Bedrock（推荐）

你的配置已经使用了 `bedrock_async`，这是推荐的方式：

```yaml
api_type: "bedrock_async"  # ✅ 异步模式，性能更好
```

### 启用提示缓存

```bash
# Bedrock 支持提示缓存，可以降低成本
./cli.js -c  # 继续对话时会自动使用缓存
```

## 🔒 安全注意事项

**⚠️ 重要**: 不要将包含凭证的文件提交到 Git！

```bash
# 确保 .env 在 .gitignore 中
echo ".env" >> .gitignore
echo "bedrock-config.yaml" >> .gitignore

# 检查
cat .gitignore
```

**最佳实践**:
1. 使用环境变量而不是硬编码
2. 使用 AWS IAM 角色（生产环境）
3. 定期轮换访问密钥
4. 限制 IAM 权限（最小权限原则）

## 📖 更多资源

- **架构分析**: `cat ARCHITECTURE_ANALYSIS.md`
- **快速参考**: `cat QUICK_REFERENCE.md`
- **重构代码**: 查看 `src/` 目录（仅供阅读）

## 🆘 遇到问题？

### Node.js 相关
```bash
# 检查 Node.js
which node
node --version

# 重新安装依赖（如果需要）
npm install
```

### AWS 凭证问题
```bash
# 测试凭证
aws sts get-caller-identity

# 检查 Bedrock 访问
aws bedrock list-foundation-models --region us-east-1
```

### CLI 运行问题
```bash
# 确保有执行权限
chmod +x cli.js

# 检查 shebang
head -1 cli.js  # 应该是 #!/usr/bin/env node

# 直接用 node 运行
node cli.js --help
```

## 💡 提示

1. **首次运行**: 使用 `--debug` 查看详细信息
2. **生产使用**: 设置预算限制 `--max-budget-usd`
3. **长对话**: 使用 `-c` 继续，利用缓存
4. **脚本化**: 使用 `-p` 和 `--output-format json`

---

**准备就绪？开始使用：**

```bash
# 设置环境变量
export CLAUDE_CODE_USE_BEDROCK=true
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_REGION="us-east-1"

# 运行！
./cli.js -p "Hello, Claude via Bedrock!" \
  --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

Good luck! 🚀
