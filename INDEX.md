# Claude Code CLI - 快速索引

欢迎！这是 Claude Code CLI 项目的快速导航指南。

## 📚 文档索引

### 核心文档
1. **[SUMMARY.md](SUMMARY.md)** ⭐ START HERE
   - 项目概览
   - 已完成工作总结
   - 快速开始指南

2. **[ARCHITECTURE_ANALYSIS.md](ARCHITECTURE_ANALYSIS.md)**
   - 完整架构分析
   - 调用流程图
   - 所有功能说明

3. **[REFACTORING_GUIDE.md](REFACTORING_GUIDE.md)**
   - 如何阅读压缩代码
   - 重构步骤详解
   - 调试技巧

### 源代码文档
4. **[src/README.md](src/README.md)**
   - 重构后代码结构
   - 函数映射表
   - 开发指南

## 📁 文件结构

```
/code/
│
├── 📘 文档
│   ├── INDEX.md                    ← 你在这里
│   ├── SUMMARY.md                  ← 从这里开始
│   ├── ARCHITECTURE_ANALYSIS.md    ← 架构分析
│   └── REFACTORING_GUIDE.md       ← 重构指南
│
├── 💻 原始代码
│   ├── cli.js                      ← 压缩的原始文件 (9.8MB)
│   └── package.json                ← 依赖配置
│
└── 📦 重构代码
    └── src/
        ├── README.md               ← 源代码说明
        ├── core/                   ← 核心模块
        ├── api/                    ← API 客户端
        ├── utils/                  ← 工具函数
        ├── commands/               ← 命令实现 (TODO)
        └── ui/                     ← UI 组件 (TODO)
```

## 🎯 根据目标选择阅读路径

### 我想快速了解项目
👉 阅读顺序：
1. [SUMMARY.md](SUMMARY.md) - 5 分钟
2. [src/README.md](src/README.md) - 10 分钟

### 我想理解代码架构
👉 阅读顺序：
1. [ARCHITECTURE_ANALYSIS.md](ARCHITECTURE_ANALYSIS.md) - 20 分钟
2. [src/core/main.js](src/core/main.js) - 10 分钟
3. [src/core/cli-runner.js](src/core/cli-runner.js) - 15 分钟

### 我想学习如何重构压缩代码
👉 阅读顺序：
1. [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md) - 30 分钟
2. [src/core/main.js](src/core/main.js) - 实践示例
3. 对照原始 `cli.js` - 动手尝试

### 我想贡献代码
👉 阅读顺序：
1. [SUMMARY.md](SUMMARY.md) - 了解项目
2. [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md) - 学习方法
3. [src/README.md](src/README.md) - 了解结构
4. 选择一个 TODO 任务开始

### 我想使用 Claude Code
👉 直接运行：
```bash
./cli.js --help
```

## 🔑 关键概念

### 入口点
- **文件**: `cli.js`
- **主函数**: `O6I()` (压缩) → `main()` (重构)
- **位置**: [src/core/main.js](src/core/main.js)

### 调用流程
```
main() → setup() → run() → [交互模式 | 打印模式]
```

### 核心模块
1. **main.js** - 应用启动
2. **setup.js** - 初始化配置
3. **cli-runner.js** - CLI 参数解析
4. **anthropic-client.js** - API 通信
5. **session-manager.js** - 会话管理

## 🛠️ 常用命令

### 查看代码
```bash
# 查看主入口
cat src/core/main.js

# 查看所有源文件
find src -name "*.js" | xargs cat

# 搜索原始文件
grep -n "特定字符串" cli.js
```

### 运行 Claude Code
```bash
# 交互模式
./cli.js

# 打印模式
./cli.js -p "你的问题"

# 调试模式
./cli.js --debug

# 查看帮助
./cli.js --help
```

## 📊 进度追踪

### ✅ 已完成
- [x] 架构分析
- [x] 主入口重构 (main.js)
- [x] CLI 运行器 (cli-runner.js)
- [x] 设置模块 (setup.js)
- [x] API 客户端 (anthropic-client.js)
- [x] 会话管理 (session-manager.js)
- [x] 文档编写

### 🚧 进行中
- [ ] 交互式模式
- [ ] 打印模式
- [ ] 工具系统

### 📝 待开始
- [ ] UI 组件
- [ ] MCP 集成
- [ ] 插件系统
- [ ] 测试用例

## 🎓 学习资源

### 官方文档
- [Claude Code 官方文档](https://docs.claude.com/s/claude-code)
- [Anthropic API 文档](https://docs.anthropic.com/)

### 相关技术
- **Commander.js** - CLI 框架
- **Ink** - React for CLI
- **Chalk** - 终端颜色
- **Lodash** - 工具库

## 💬 快速问答

**Q: 原始 cli.js 为什么这么大？**
A: 包含了所有 npm 依赖的打包版本，经过压缩混淆。

**Q: 重构的代码可以直接运行吗？**
A: 不能，这是为了阅读理解。原始 cli.js 才是可执行的。

**Q: 如何找到特定功能的实现？**
A: 1) 在文档中查找关键词，2) 在 cli.js 中搜索相关字符串。

**Q: 我可以修改重构后的代码吗？**
A: 可以！这是为了学习和改进用的。

**Q: 如何贡献？**
A: 查看 [SUMMARY.md](SUMMARY.md) 的"后续工作"部分。

## 🔗 快速链接

| 链接 | 用途 |
|------|------|
| [SUMMARY.md](SUMMARY.md) | 项目总结 |
| [ARCHITECTURE_ANALYSIS.md](ARCHITECTURE_ANALYSIS.md) | 架构文档 |
| [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md) | 重构指南 |
| [src/README.md](src/README.md) | 代码说明 |
| [src/core/main.js](src/core/main.js) | 主入口 |
| [src/core/cli-runner.js](src/core/cli-runner.js) | CLI 配置 |

## 📞 需要帮助？

1. **搜索文档** - 使用 `grep` 或 IDE 搜索
2. **查看示例** - 参考已重构的模块
3. **阅读指南** - 按照推荐的阅读路径
4. **动手实践** - 尝试提取一个小模块

---

**提示**: 如果你是第一次查看这个项目，强烈建议从 [SUMMARY.md](SUMMARY.md) 开始！

**最后更新**: 2025-11-15
