# Claude Code CLI 重构指南

本文档说明如何从压缩的 `cli.js` 文件中理解代码逻辑。

## 📋 概述

原始的 `cli.js` 是一个经过打包和压缩的 JavaScript 文件（9.8MB），包含：
- 所有应用代码
- 所有 npm 依赖（Lodash, Commander, Ink, Chalk 等）
- 压缩和混淆的变量名

重构后的代码位于 `/code/src/` 目录，提供了可读的源代码结构。

## 🔍 如何阅读压缩代码

### 1. 识别模块边界

压缩代码使用这种模式定义模块：

```javascript
var T = (A, B) => () => (A && (B = A(A = 0)), B);

var someModule = T(() => {
  // 模块代码
});
```

这是一个延迟初始化模式。

### 2. 识别导出

```javascript
var M$ = (A, B) => {
  for (var Q in B)
    Y91(A, Q, {get: B[Q], enumerable: !0, configurable: !0, set: (I) => B[Q] = () => I})
};

M$(exports, {
  main: () => O6I,
  setup: () => K21
});
```

这定义了模块的导出。

### 3. 识别 Import

```javascript
import{createRequire as $Q9}from"node:module";
import*as w9 from"fs";
import{stat as _29,open as x29}from"fs/promises";
```

Import 语句保持相对完整。

### 4. 识别关键函数

通过搜索特征字符串：

```bash
# 查找主函数
grep -n "process.title.*claude" cli.js

# 查找 Commander 配置
grep -n ".name(\"claude\")" cli.js

# 查找遥测事件
grep -n "GA(\"tengu_" cli.js
```

## 🛠️ 重构步骤

### 第 1 步：提取主入口

从文件末尾向前搜索，找到：

```javascript
async function O6I() {
  // 主入口逻辑
  process.title = "claude";
  await P6I();
}
```

重构为：

```javascript
// src/core/main.js
export async function main() {
  process.title = "claude";
  await run();
}
```

### 第 2 步：提取 CLI 配置

搜索 Commander 配置：

```javascript
let A = new CLA;
A.name("claude")
  .description("...")
  .option("-p, --print", "...")
```

重构为：

```javascript
// src/core/cli-runner.js
export async function run() {
  const program = new Command();
  program
    .name('claude')
    .description('...')
    .option('-p, --print', '...')
}
```

### 第 3 步：提取辅助模块

识别工具函数：

```javascript
function mB() {
  return process.env.CLAUDE_CONFIG_DIR ??
    f29(h29(), ".claude")
}
```

重构为：

```javascript
// src/core/setup.js
export function getConfigDir() {
  return process.env.CLAUDE_CONFIG_DIR ??
    join(homedir(), '.claude');
}
```

### 第 4 步：提取 API 客户端

搜索 API 调用：

```javascript
async function makeAPICall(messages) {
  // Anthropic API 调用
}
```

重构为：

```javascript
// src/api/anthropic-client.js
export class AnthropicClient {
  async sendMessage(messages) {
    // API 调用逻辑
  }
}
```

## 📖 阅读建议

### 从这些文件开始

1. **`src/core/main.js`** - 理解应用启动流程
2. **`src/core/setup.js`** - 理解初始化过程
3. **`src/core/cli-runner.js`** - 理解所有 CLI 选项
4. **`src/api/anthropic-client.js`** - 理解 API 交互
5. **`src/utils/session-manager.js`** - 理解会话管理

### 对照原始代码

使用这些工具对照阅读：

```bash
# 查找特定函数
grep -n "function.*functionName" cli.js

# 查找特定字符串
grep -n "specific string" cli.js

# 查看特定行范围
sed -n '4117,4122p' cli.js

# 搜索 import 语句
grep "^import" cli.js
```

### 理解变量命名

原始代码中的变量名映射：

| 压缩名 | 含义 | 示例 |
|--------|------|------|
| `A, B, Q, I, G, Z, Y` | 函数参数 | `function(A, B)` |
| `FB` | 全局应用状态 | `FB.sessionId` |
| `GA()` | Google Analytics / 遥测 | `GA("event_name", {...})` |
| `tJ` | 全局对象 | `tJ.Symbol` |
| `iW` | Symbol | `iW.toStringTag` |
| `w9` | fs 模块 | `import * as w9 from "fs"` |

## 🔧 调试技巧

### 1. 添加断点

在原始 `cli.js` 中添加调试语句：

```javascript
// 在关键函数前添加
console.log('[DEBUG] Function called:', arguments);
```

### 2. 使用 Node.js Inspector

```bash
node --inspect-brk cli.js
```

然后在 Chrome 中打开 `chrome://inspect`。

### 3. 追踪函数调用

```javascript
// 在函数开始处
console.trace('Function called');
```

### 4. 美化部分代码

提取一小段代码并美化：

```bash
# 提取 4117-4122 行
sed -n '4117,4122p' cli.js > snippet.js

# 使用 prettier 或 js-beautify
npx prettier --write snippet.js
```

## 📚 工具推荐

### 代码美化
- **Prettier**: `npx prettier --write file.js`
- **js-beautify**: `npx js-beautify file.js`

### 代码分析
- **esprima**: JavaScript 语法解析
- **babel-parser**: 现代 JavaScript 解析
- **uglify-js**: 反混淆工具

### 调试
- **Chrome DevTools**: Node.js 调试
- **VS Code Debugger**: 集成调试器
- **ndb**: Google 的 Node.js 调试器

## 🎯 重构优先级

### 高优先级（已完成）
- [x] 主入口函数 (`main.js`)
- [x] CLI 运行器 (`cli-runner.js`)
- [x] 设置模块 (`setup.js`)
- [x] API 客户端 (`anthropic-client.js`)
- [x] 会话管理 (`session-manager.js`)

### 中优先级（TODO）
- [ ] 交互式模式处理
- [ ] 打印模式处理
- [ ] 工具系统（Bash, Edit, Read, Write 等）
- [ ] MCP 集成
- [ ] 遥测系统

### 低优先级（TODO）
- [ ] UI 组件（React/Ink）
- [ ] 主题系统
- [ ] 插件系统
- [ ] 更新检查

## 💡 提示

### 寻找特定功能

1. **搜索错误消息**
   ```bash
   grep -n "Error: specific error" cli.js
   ```

2. **搜索配置项**
   ```bash
   grep -n "ANTHROPIC_API_KEY" cli.js
   ```

3. **搜索命令选项**
   ```bash
   grep -n -- "--model" cli.js
   ```

### 理解控制流

1. 从 `main()` 开始
2. 追踪 `setup()` 调用
3. 追踪 `run()` 调用
4. 查看事件处理器

### 理解数据流

1. 查看会话状态 (`FB` 对象)
2. 查看消息格式
3. 查看 API 请求/响应
4. 查看工具调用

## 🤝 贡献

如果你提取了更多模块：

1. 遵循现有的文件结构
2. 添加清晰的注释
3. 更新 README 和映射表
4. 提交 Pull Request

## 📞 获取帮助

遇到问题？

1. 查看 [ARCHITECTURE_ANALYSIS.md](../ARCHITECTURE_ANALYSIS.md)
2. 查看 [src/README.md](../src/README.md)
3. 搜索特定函数或字符串
4. 使用调试器逐步执行

---

**最后更新**: 2025-11-15
**维护者**: Claude Code 社区
