# 🚨 Immediate Actions Required

## What Happened

GitHub detected AWS credentials in your repository and blocked your push. The credentials are in your git history (commit `ff0ad75`).

## Critical Steps (Do These NOW)

### 1. Rotate Your AWS Credentials ⚠️ URGENT

Your credentials are compromised. Rotate them immediately:

```bash
# Go to AWS IAM Console
# https://console.aws.amazon.com/iam/

# 1. Navigate to: IAM → Users → Your User → Security Credentials
# 2. Find access key: AKIAX55Z5EKTR7J6UK2I
# 3. Click "Deactivate" then "Delete"
# 4. Click "Create access key"
# 5. Save the new credentials securely
```

### 2. Clean Git History

Run the automated cleanup script:

```bash
./cleanup-git-history.sh
```

This will:
- Create a backup of your repository
- Install git-filter-repo if needed
- Remove credentials from all commits
- Prepare for force push

### 3. Force Push

After cleanup completes:

```bash
git push origin --force --all
```

### 4. Set Up New Credentials

Use environment variables (never hardcode again):

```bash
# Add to ~/.bashrc or ~/.zshrc
export AWS_ACCESS_KEY_ID="your-new-key-here"
export AWS_SECRET_ACCESS_KEY="your-new-secret-here"
export AWS_REGION="us-east-1"
export CLAUDE_CODE_USE_BEDROCK=true

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

Or use AWS CLI:

```bash
aws configure
# Enter your new credentials when prompted
```

### 5. Test Everything

```bash
# Test AWS credentials
aws sts get-caller-identity

# Test the CLI
./start-bedrock.sh -p "Hello, Claude!"
```

## Files That Were Fixed

✅ `RUN_GUIDE.md` - Credentials replaced with placeholders
✅ `SETUP.md` - Credentials replaced with placeholders  
✅ `start-bedrock.sh` - Now reads from environment variables
✅ `bedrock-config.yaml` - Credentials removed
✅ `.env.example` - Template for local credentials

## What's Protected Now

- `.env` files are in `.gitignore`
- All documentation uses placeholders
- Scripts read from environment variables
- No hardcoded credentials anywhere

## Quick Reference

### Run the CLI (after setup):

```bash
# Using the start script
./start-bedrock.sh -p "Your question"

# Or directly
./cli.js --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

### If You Get Stuck

1. **Can't push?** → Run `./cleanup-git-history.sh`
2. **Auth errors?** → Check credentials with `aws sts get-caller-identity`
3. **Need help?** → Read `GIT_HISTORY_CLEANUP.md` for detailed options

## Prevention Checklist

- [ ] AWS credentials rotated
- [ ] Git history cleaned
- [ ] New credentials in environment variables (not files)
- [ ] Force push completed
- [ ] CLI tested and working
- [ ] Team notified (if applicable)

## Resources

- `SECURITY_NOTICE.md` - Security best practices
- `GIT_HISTORY_CLEANUP.md` - Detailed cleanup options
- `cleanup-git-history.sh` - Automated cleanup script

---

**Time to act: 5-10 minutes**

**Priority: CRITICAL** 🔴

Start with step 1 (rotate credentials) right now!
