# 快速设置指南

## 🎯 你想做什么？

### 选项 A: 运行原始 CLI（使用 Bedrock）✅

**这是实际可用的选项** - 使用你的 AWS Bedrock 凭证运行 Claude Code

### 选项 B: 查看重构后的代码📖

**这是用来阅读和理解的** - `src/` 目录中的代码不能直接运行

---

## 🚀 选项 A: 运行原始 CLI

### 第 1 步：安装 Node.js

**检查是否已安装：**
```bash
node --version
```

如果显示版本号（需要 18+），跳到第 2 步。

**如果没有安装：**

```bash
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用 nvm（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # 或 ~/.zshrc
nvm install 18
nvm use 18
```

### 第 2 步：使用启动脚本（最简单）

我已经为你创建了一个包含你的 Bedrock 凭证的启动脚本：

```bash
# 直接运行！
./start-bedrock.sh -p "Hello, Claude!"

# 交互模式
./start-bedrock.sh

# 查看帮助
./start-bedrock.sh --help
```

**就这么简单！** ✨

### 第 3 步（可选）：手动配置

如果你想自己设置环境变量：

```bash
# 设置环境变量
export CLAUDE_CODE_USE_BEDROCK=true
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_REGION="us-east-1"

# 运行
./cli.js -p "test" --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

---

## 📖 选项 B: 查看重构后的代码

**重要**: `src/` 目录中的代码是从压缩的 `cli.js` 重构出来的，**仅用于阅读和理解**。

### 快速开始

```bash
# 1. 查看快速索引
cat INDEX.md

# 2. 查看项目总结
cat SUMMARY.md

# 3. 查看主入口代码（可读版本）
cat src/core/main.js

# 4. 查看 CLI 配置
cat src/core/cli-runner.js
```

### 文档列表

| 文档 | 内容 |
|------|------|
| **INDEX.md** | 快速导航 |
| **SUMMARY.md** | 项目总结 |
| **ARCHITECTURE_ANALYSIS.md** | 架构分析 |
| **REFACTORING_GUIDE.md** | 重构指南 |
| **QUICK_REFERENCE.md** | 快速参考 |
| **RUN_GUIDE.md** | 运行指南 |

---

## 🧪 测试你的设置

### 方法 1: 使用启动脚本

```bash
./start-bedrock.sh -p "Say hello in 5 words"
```

### 方法 2: 手动测试

```bash
# 设置环境
export CLAUDE_CODE_USE_BEDROCK=true
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_REGION="us-east-1"

# 测试
./cli.js -p "What is 2+2?" \
  --model "us.anthropic.claude-sonnet-4-20250514-v1:0" \
  --debug
```

**成功的标志**:
- ✅ 看到 Claude 的回复
- ✅ 没有认证错误
- ✅ 没有权限错误

**如果失败**:
- 查看错误信息（`--debug` 会显示详细日志）
- 检查 Node.js 版本：`node --version`
- 检查网络连接
- 阅读 `RUN_GUIDE.md` 的故障排除部分

---

## 📁 项目文件说明

```
/code/
├── 🟢 可运行文件
│   ├── cli.js                      # 原始 CLI（压缩版，可运行）
│   ├── start-bedrock.sh            # Bedrock 启动脚本 ⭐ 用这个！
│   ├── .env.example                # 环境变量模板
│   └── bedrock-config.yaml         # 你的 Bedrock 配置
│
├── 📘 文档（阅读用）
│   ├── SETUP.md                    # 本文件 ⭐ 你在这里
│   ├── INDEX.md                    # 快速索引
│   ├── SUMMARY.md                  # 项目总结
│   ├── RUN_GUIDE.md               # 详细运行指南
│   ├── ARCHITECTURE_ANALYSIS.md    # 架构分析
│   ├── REFACTORING_GUIDE.md       # 重构指南
│   └── QUICK_REFERENCE.md         # 快速参考
│
└── 📦 重构代码（仅供阅读）
    └── src/
        ├── core/                   # 核心模块
        ├── api/                    # API 客户端
        └── utils/                  # 工具函数
```

---

## ⚡ 常用命令

### 使用启动脚本（推荐）

```bash
# 交互模式
./start-bedrock.sh

# 单次查询
./start-bedrock.sh -p "你的问题"

# 继续上次对话
./start-bedrock.sh -c

# 调试模式
./start-bedrock.sh -p "test" --debug
```

### 直接使用 cli.js

```bash
# 先设置环境变量（每个新终端都需要）
export CLAUDE_CODE_USE_BEDROCK=true
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_REGION="us-east-1"

# 然后运行
./cli.js --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

---

## 🔐 安全提示

**⚠️ 重要**: 你的 AWS 凭证已经保存在 `start-bedrock.sh` 中。

**保护你的凭证**:
```bash
# 1. 确保脚本只有你能读取
chmod 700 start-bedrock.sh

# 2. 不要提交到 Git
echo "start-bedrock.sh" >> .gitignore
echo "bedrock-config.yaml" >> .gitignore
echo ".env" >> .gitignore

# 3. 定期轮换密钥（在 AWS IAM 控制台）
```

---

## 🆘 故障排除

### 问题 1: "node: command not found"
**解决**: 安装 Node.js（见第 1 步）

### 问题 2: "Permission denied"
```bash
chmod +x cli.js
chmod +x start-bedrock.sh
```

### 问题 3: AWS 认证错误
```bash
# 检查凭证是否正确（需要 AWS CLI）
aws sts get-caller-identity \
  --region us-east-1

# 或者查看错误详情
./start-bedrock.sh -p "test" --debug
```

### 问题 4: 模型访问错误
确保你的 AWS 账户在 Bedrock 控制台中启用了模型访问：
1. 访问 AWS Bedrock 控制台
2. 选择 "Model access"
3. 请求访问 Claude Sonnet 4

### 问题 5: Node.js 版本太旧
```bash
# 更新 Node.js
nvm install 18
nvm use 18
```

---

## 📚 下一步

### 运行成功后

1. **探索功能**
   ```bash
   ./start-bedrock.sh --help
   ```

2. **阅读文档**
   ```bash
   cat QUICK_REFERENCE.md
   ```

3. **查看架构**
   ```bash
   cat ARCHITECTURE_ANALYSIS.md
   ```

4. **理解代码**
   ```bash
   cat src/core/main.js
   ```

### 高级用法

查看 `RUN_GUIDE.md` 了解：
- 所有命令行选项
- 性能优化技巧
- 高级配置
- 脚本化使用

---

## 💡 快速提示

1. ⚡ **最快开始**: `./start-bedrock.sh -p "hello"`
2. 📖 **了解架构**: `cat INDEX.md`
3. 🔧 **调试问题**: 添加 `--debug` 标志
4. 💰 **控制成本**: 使用 `--max-budget-usd 1.0`
5. 📝 **继续对话**: 使用 `-c` 标志

---

## ✅ 检查清单

运行前确认：
- [ ] Node.js 18+ 已安装
- [ ] `cli.js` 有执行权限
- [ ] `start-bedrock.sh` 有执行权限
- [ ] AWS 凭证已配置
- [ ] 网络连接正常

全部打勾？那就开始吧！

```bash
./start-bedrock.sh -p "Hello, Claude!"
```

**祝使用愉快！** 🎉

---

**需要帮助？** 查看 `RUN_GUIDE.md` 或阅读其他文档。
