# Claude Code CLI - 快速参考卡

## 📂 文件导航

| 文件 | 用途 | 阅读时间 |
|------|------|----------|
| **[INDEX.md](INDEX.md)** | 快速导航索引 | 2 分钟 |
| **[SUMMARY.md](SUMMARY.md)** | 项目总结 | 10 分钟 |
| **[ARCHITECTURE_ANALYSIS.md](ARCHITECTURE_ANALYSIS.md)** | 完整架构分析 | 20 分钟 |
| **[REFACTORING_GUIDE.md](REFACTORING_GUIDE.md)** | 重构指南 | 30 分钟 |
| **[src/README.md](src/README.md)** | 源代码说明 | 15 分钟 |

## 🔑 关键函数映射

| 压缩代码 | 重构代码 | 文件位置 |
|---------|---------|---------|
| `O6I()` | `main()` | `src/core/main.js` |
| `K21()` | `setup()` | `src/core/setup.js` |
| `P6I()` | `run()` | `src/core/cli-runner.js` |
| `GA()` | `trackEvent()` | (遥测) |
| `mB()` | `getConfigDir()` | `src/core/setup.js` |
| `V0()` | `isEnvTrue()` | `src/core/setup.js` |

## 📋 命令速查

### 查看代码
```bash
# 主入口
cat src/core/main.js

# CLI 配置
cat src/core/cli-runner.js

# 设置模块
cat src/core/setup.js

# API 客户端
cat src/api/anthropic-client.js

# 会话管理
cat src/utils/session-manager.js
```

### 搜索原始代码
```bash
# 查找函数
grep -n "^function\|^async function" cli.js | head -20

# 查找字符串
grep -n "Claude Code" cli.js

# 查找 import
grep "^import" cli.js

# 查看特定行
sed -n '4117,4122p' cli.js
```

### 运行程序
```bash
# 交互模式
./cli.js

# 打印模式
./cli.js -p "你的问题"

# 继续上次对话
./cli.js -c

# 恢复会话
./cli.js -r

# 调试模式
./cli.js --debug

# 帮助
./cli.js --help
```

## 🎯 调用流程

```
cli.js 启动
    ↓
main() - 主入口
    ↓
setup() - 初始化
    ↓
run() - Commander CLI
    ↓
handleCliAction() - 处理命令
    ↓
┌─────────────────┐
│ 交互模式 │ 打印模式│
└─────────────────┘
        ↓
   API 调用
        ↓
   工具执行
```

## 🛠️ CLI 选项速查

### 基本
- `-p, --print` - 打印模式
- `-d, --debug` - 调试
- `--verbose` - 详细输出
- `-h, --help` - 帮助

### 会话
- `-c, --continue` - 继续对话
- `-r, --resume [id]` - 恢复会话
- `--fork-session` - 复制会话
- `--session-id <uuid>` - 指定 ID

### 模型
- `--model <name>` - 选择模型
- `--fallback-model` - 后备模型

### 工具
- `--allowed-tools` - 允许工具
- `--disallowed-tools` - 禁止工具
- `--tools` - 指定工具集

### MCP
- `--mcp-config` - MCP 配置
- `--strict-mcp-config` - 严格模式

### 权限
- `--permission-mode` - ask/allow/deny
- `--dangerously-skip-permissions` - 跳过检查

### 高级
- `--settings <file>` - 加载设置
- `--agents <json>` - 自定义代理
- `--max-turns <n>` - 最大回合数
- `--max-budget-usd <n>` - 预算上限

## 📊 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `ANTHROPIC_API_KEY` | API 密钥 | - |
| `CLAUDE_CONFIG_DIR` | 配置目录 | `~/.claude` |
| `AWS_REGION` | AWS 区域 | `us-east-1` |
| `CLOUD_ML_REGION` | Vertex AI 区域 | `us-east5` |
| `CLAUDE_CODE_USE_BEDROCK` | 使用 Bedrock | `false` |
| `NODE_OPTIONS` | Node.js 选项 | - |

## 🔍 调试技巧

### 1. 启用调试
```bash
claude --debug
```

### 2. 过滤日志
```bash
# 仅显示 API 日志
claude --debug="api"

# 排除某些日志
claude --debug="!statsig,!file"
```

### 3. 使用 Node Inspector
```bash
node --inspect-brk cli.js
# 然后在 Chrome 打开 chrome://inspect
```

### 4. 追踪函数调用
在 cli.js 中添加：
```javascript
console.trace('Function called');
```

## 📁 配置文件位置

```
~/.claude/
├── settings.json          # 用户设置
├── sessions/              # 会话历史
│   └── <uuid>.json       # 单个会话
├── api-keys/             # API 密钥（加密）
└── telemetry/            # 遥测数据
```

## 🎨 代码模式识别

### 延迟初始化
```javascript
var T = (A, B) => () => (A && (B = A(A = 0)), B);
```

### 模块导出
```javascript
M$(exports, {
  functionName: () => actualFunction
});
```

### Import 重命名
```javascript
import { something as A } from "module";
```

## 💡 有用的 Grep 模式

```bash
# 查找所有函数
grep -n "^function\|^async function" cli.js

# 查找遥测事件
grep -o "GA(\"[^\"]*\"" cli.js | sort -u

# 查找环境变量
grep -o "process.env\.[A-Z_]*" cli.js | sort -u

# 查找 Commander 选项
grep -o "\-\-[a-z-]*" cli.js | sort -u

# 查找错误消息
grep -n "Error:" cli.js
```

## 📖 推荐阅读顺序

### 入门 (15 分钟)
1. INDEX.md
2. SUMMARY.md

### 进阶 (1 小时)
3. ARCHITECTURE_ANALYSIS.md
4. src/core/main.js
5. src/core/cli-runner.js

### 精通 (2 小时)
6. REFACTORING_GUIDE.md
7. src/core/setup.js
8. src/api/anthropic-client.js
9. src/utils/session-manager.js
10. 对照 cli.js 练习

## 🚀 快速上手命令

```bash
# 克隆或进入项目
cd /code

# 查看文档
cat INDEX.md

# 查看主入口
cat src/core/main.js

# 搜索功能
grep -n "某个功能" cli.js

# 运行程序
./cli.js -p "hello world"

# 调试模式
./cli.js --debug -p "test"
```

## ⚡ 性能提示

1. **大文件处理**: cli.js 有 9.8MB，使用 `less` 而不是 `cat`
2. **搜索优化**: 使用 `grep -F` (固定字符串) 而不是正则
3. **行号查看**: 使用 `sed -n 'start,end'p` 查看特定范围

## 🎯 常见任务

### 查找特定功能
```bash
# 例如：查找会话恢复
grep -n "resume.*session" cli.js
grep -n "\-\-resume" cli.js
```

### 理解命令选项
```bash
# 查找所有选项
grep -n "\.option(" cli.js | head -20

# 查找特定选项
grep -n "\-\-model" cli.js
```

### 追踪 API 调用
```bash
# 查找 API 相关代码
grep -n "anthropic.*api" cli.js
grep -n "\.sendMessage" cli.js
```

## 📞 获取更多帮助

- **详细架构**: [ARCHITECTURE_ANALYSIS.md](ARCHITECTURE_ANALYSIS.md)
- **重构方法**: [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md)
- **代码示例**: [src/](src/)
- **官方文档**: https://docs.claude.com/s/claude-code

---

**提示**: 将本文件加入书签，作为日常参考！

**最后更新**: 2025-11-15
