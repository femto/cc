# 快速开始 - CLI.js 拆分版本

## 📊 拆分结果

原始文件：**cli.js** (496,069行, 15MB)

拆分为 10 个文件，存放在 `src/parts/`：

```
part-01-utils.js         60K行  1.8MB
part-02-aws-sdk.js       60K行  1.9MB
part-03-dependencies.js  60K行  1.9MB
part-04-core.js          60K行  2.0MB
part-05-cli.js           60K行  2.1MB
part-06-api.js           60K行  1.7MB
part-07-tools.js         60K行  1.9MB
part-08-runtime.js       60K行  1.6MB
part-09-main.js          16K行  441KB
```

## 🚀 常用命令

```bash
# 重建 cli.js
./build-cli.sh

# 或
npm run build

# 验证重建的文件
md5sum cli.js cli-rebuilt.js

# 搜索功能
grep -n "keyword" src/parts/part-*.js

# 查看特定部分
cat src/parts/part-05-cli.js | less
```

## 🔍 快速查找

```bash
# Bedrock 配置
grep -n "bedrock" src/parts/part-02-aws-sdk.js | head -20

# Anthropic API
grep -n "anthropic" src/parts/part-01-utils.js | head -20

# CLI 命令
grep -n "\.command\|\.option" src/parts/part-05-cli.js | head -20

# OAuth 配置
grep -n "oauth\|CLIENT_ID" src/parts/part-01-utils.js | head -20
```

## 📐 行号转换

原始行号 → 拆分文件位置

```
第 50,000 行   → part-01-utils.js:49,999
第 100,000 行  → part-02-aws-sdk.js:40,000
第 250,000 行  → part-05-cli.js:10,000
第 450,000 行  → part-08-runtime.js:30,000
```

公式：`文件编号 = floor((行号-1)/60000)`

## ✅ 验证

```bash
# 文件完整性
$ wc -l src/parts/part-*.js | tail -1
496069 total

# 与原始文件对比
$ diff cli.js cli-rebuilt.js
# (无输出 = 完全相同)

# MD5 校验
$ md5sum cli.js cli-rebuilt.js
3185916b5b6c1a061a9ad8a544cd8a99  cli.js
3185916b5b6c1a061a9ad8a544cd8a99  cli-rebuilt.js
```

## 📚 更多信息

- 详细说明：[src/README.md](src/README.md)
- 完整指南：[CLI_SPLIT_GUIDE.md](CLI_SPLIT_GUIDE.md)
