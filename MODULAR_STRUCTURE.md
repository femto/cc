# 模块化结构说明

## 问题

原来的 `cli.js` 文件有 **496,069 行**（15MB），是一个打包压缩的文件，完全无法阅读和维护。

## 解决方案

我们创建了模块化的版本，将代码拆分成多个清晰的模块：

```
src/
├── index.js                    # 主入口点
├── api/
│   ├── bedrock-client.js       # AWS Bedrock API 客户端
│   └── anthropic-client.js     # Anthropic API 客户端
├── core/
│   ├── config.js               # 配置管理
│   ├── cli-runner.js           # CLI 命令运行器
│   ├── main.js                 # 主应用逻辑
│   └── setup.js                # 设置工具
└── utils/
    └── session-manager.js      # 会话管理
```

## 使用方法

### 方式 1: 使用模块化版本（推荐）

```bash
# 直接运行
./cli-modular.js "your prompt"

# 或使用 npm scripts
npm start -- "your prompt"

# 测试连接
npm test
```

### 方式 2: 使用原始打包版本

```bash
./cli.js "your prompt"

# 或
npm run start:original -- "your prompt"
```

## 对比

| 特性 | cli.js (原版) | cli-modular.js (模块化) |
|------|---------------|------------------------|
| 文件大小 | 15MB, 496K行 | 入口文件很小 |
| 可读性 | ❌ 完全无法阅读 | ✅ 清晰的模块结构 |
| 可维护性 | ❌ 无法修改 | ✅ 易于修改和扩展 |
| 功能 | ✅ 完整 | ✅ 等价功能 |

## 模块说明

### API 模块 (src/api/)

- **bedrock-client.js**: 封装 AWS Bedrock API 调用
- **anthropic-client.js**: 封装 Anthropic API 调用

### 核心模块 (src/core/)

- **config.js**: 读取和管理配置（环境变量、配置文件）
- **cli-runner.js**: 处理命令行参数和交互
- **main.js**: 主要的应用逻辑和流程控制
- **setup.js**: 初始化和设置相关功能

### 工具模块 (src/utils/)

- **session-manager.js**: 管理对话会话、历史记录

## Git 配置

`cli.js` 已添加到 `.gitignore`，因为：
1. 它是从 npm 包生成的，不应该提交到 git
2. 太大了（15MB）会让仓库变得臃肿
3. 我们有更好的模块化版本

## 开发建议

1. **修改代码**: 只修改 `src/` 目录下的模块化代码
2. **测试**: 使用 `cli-modular.js` 测试你的修改
3. **提交**: 只提交 `src/` 目录的代码，不提交 `cli.js`

## 未来改进

- [ ] 添加单元测试
- [ ] 添加 TypeScript 类型定义
- [ ] 创建自己的构建流程（如果需要打包）
- [ ] 添加更多的配置选项
- [ ] 改进错误处理
