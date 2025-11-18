# 🔐 Security Notice

## ⚠️ IMPORTANT: AWS Credentials Exposed

Your AWS credentials were previously hardcoded in the following files:
- `RUN_GUIDE.md`
- `SETUP.md`
- `start-bedrock.sh`

These files have been updated to use placeholders, but **the credentials are still in your git history**.

## Immediate Actions Required

### 1. Rotate Your AWS Credentials NOW

Go to AWS IAM Console and:
1. Delete the compromised access key: `AKIAX55Z5EKTR7J6UK2I`
2. Create a new access key
3. Update your local environment with the new credentials

### 2. Set Up Credentials Securely

Choose one of these methods:

#### Option A: Use Environment Variables (Recommended)
```bash
# Add to your ~/.bashrc or ~/.zshrc
export AWS_ACCESS_KEY_ID="your-new-key"
export AWS_SECRET_ACCESS_KEY="your-new-secret"
export AWS_REGION="us-east-1"
export CLAUDE_CODE_USE_BEDROCK=true
```

#### Option B: Use AWS CLI Configuration
```bash
aws configure
# Enter your new credentials when prompted
```

#### Option C: Use .env File (Local Only)
```bash
# Copy the example
cp .env.example .env

# Edit .env with your new credentials
# NEVER commit this file to git!
```

### 3. Clean Git History (Optional but Recommended)

If you want to remove the credentials from git history:

```bash
# WARNING: This rewrites history and requires force push
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch RUN_GUIDE.md SETUP.md start-bedrock.sh" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team first!)
git push origin --force --all
```

Or use BFG Repo-Cleaner (easier):
```bash
# Install BFG
brew install bfg  # macOS

# Clean the repo
bfg --replace-text passwords.txt  # Create passwords.txt with your old credentials
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

### 4. Verify Security

After rotating credentials:
```bash
# Test new credentials
aws sts get-caller-identity

# Verify old credentials are revoked
# (Try using old key - should fail)
```

## Best Practices Going Forward

1. **Never hardcode credentials** in any file
2. **Use environment variables** or AWS profiles
3. **Enable .gitignore** for sensitive files (already done)
4. **Use AWS IAM roles** when possible (for EC2, Lambda, etc.)
5. **Rotate credentials regularly** (every 90 days)
6. **Use least privilege** - only grant necessary permissions
7. **Enable MFA** on your AWS account

## How to Use the CLI Now

After setting up credentials securely:

```bash
# The start-bedrock.sh script now reads from environment
./start-bedrock.sh -p "Hello, Claude!"

# Or set variables inline
AWS_ACCESS_KEY_ID="new-key" \
AWS_SECRET_ACCESS_KEY="new-secret" \
AWS_REGION="us-east-1" \
CLAUDE_CODE_USE_BEDROCK=true \
./cli.js --model "us.anthropic.claude-sonnet-4-20250514-v1:0"
```

## Questions?

- AWS Security Best Practices: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- Rotating Access Keys: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
- Git History Cleaning: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

---

**Remember**: Security is not optional. Take these steps seriously to protect your AWS account.
