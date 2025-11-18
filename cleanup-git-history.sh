#!/bin/bash

# Git History Cleanup Script
# This script removes AWS credentials from git history

set -e

echo "🧹 Git History Cleanup Script"
echo "=============================="
echo ""
echo "⚠️  WARNING: This will rewrite git history!"
echo "⚠️  All collaborators will need to re-clone the repository."
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "📦 Creating backup..."
cd ..
BACKUP_DIR="cc-backup-$(date +%Y%m%d-%H%M%S)"
cp -r cc "$BACKUP_DIR"
echo "✅ Backup created at: $BACKUP_DIR"
cd cc

echo ""
echo "🔍 Checking for git-filter-repo..."
if command -v git-filter-repo &> /dev/null; then
    echo "✅ git-filter-repo found"
    echo ""
    echo "🧹 Cleaning history with git-filter-repo..."
    
    # Create replacement file
    cat > /tmp/git-replacements.txt << 'EOF'
AKIAX55Z5EKTR7J6UK2I==>YOUR_ACCESS_KEY_ID
fZnc1JgaS9TePyRa7LaamUCplErbWkuecTQpmp0C==>YOUR_SECRET_ACCESS_KEY
EOF
    
    git filter-repo --replace-text /tmp/git-replacements.txt --force
    
    # Re-add remote
    git remote add origin git@github.com:femto/cc.git
    
    echo "✅ History cleaned with git-filter-repo"
else
    echo "❌ git-filter-repo not found"
    echo ""
    echo "Installing git-filter-repo..."
    
    if command -v pip3 &> /dev/null; then
        pip3 install git-filter-repo
    elif command -v pip &> /dev/null; then
        pip install git-filter-repo
    elif command -v brew &> /dev/null; then
        brew install git-filter-repo
    else
        echo "❌ Cannot install git-filter-repo automatically"
        echo ""
        echo "Please install it manually:"
        echo "  - macOS: brew install git-filter-repo"
        echo "  - Linux: pip install git-filter-repo"
        echo ""
        echo "Then run this script again."
        exit 1
    fi
    
    echo "✅ git-filter-repo installed"
    echo ""
    echo "Please run this script again to clean the history."
    exit 0
fi

echo ""
echo "🔍 Verifying cleanup..."
if git log -p -S "AKIAX55Z5EKTR7J6UK2I" --all | grep -q "AKIAX55Z5EKTR7J6UK2I"; then
    echo "❌ Credentials still found in history!"
    exit 1
else
    echo "✅ Credentials removed from history"
fi

echo ""
echo "📤 Ready to force push!"
echo ""
echo "Run the following command to push:"
echo "  git push origin --force --all"
echo ""
echo "⚠️  Remember to:"
echo "  1. Rotate your AWS credentials immediately"
echo "  2. Notify team members to re-clone the repository"
echo "  3. Set up credentials using environment variables"
echo ""
echo "✅ Cleanup complete!"
