# GitHub Setup Checklist - First Time User

## ✅ Step 1: Create GitHub Account
- [ ] Go to [github.com](https://github.com)
- [ ] Click "Sign up"
- [ ] Choose a username (e.g., `johnsmith`)
- [ ] Enter email and password
- [ ] Verify email address
- [ ] Choose "Free" plan

## ✅ Step 2: Create Repository
- [ ] Click "+" icon → "New repository"
- [ ] Repository name: `imageoptimizer`
- [ ] Description: `Ultimate All-in-One File Converter, Compressor & Optimizer Platform`
- [ ] Select **"Public"** (required for free hosting)
- [ ] Leave all checkboxes **UNCHECKED**
- [ ] Click "Create repository"

## ✅ Step 3: Install Git (if needed)
- [ ] Check if Git is installed: `git --version`
- [ ] If not installed, download from [git-scm.com](https://git-scm.com)
- [ ] Configure Git with your info:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your-email@example.com"
  ```

## ✅ Step 4: Create Personal Access Token
- [ ] Go to GitHub → Profile picture → "Settings"
- [ ] Left sidebar → "Developer settings"
- [ ] "Personal access tokens" → "Tokens (classic)"
- [ ] "Generate new token" → "Generate new token (classic)"
- [ ] Note: "My Image Optimizer Project"
- [ ] Expiration: 90 days
- [ ] Check "repo" scope
- [ ] Click "Generate token"
- [ ] **COPY THE TOKEN** (save it somewhere safe!)

## ✅ Step 5: Upload Your Project
Open Command Prompt in your project folder (`C:\xampp\htdocs\imageoptimizer`):

```bash
# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: My image optimizer project"

# Connect to GitHub (replace YOURUSERNAME)
git remote add origin https://github.com/YOURUSERNAME/imageoptimizer.git

# Set main branch
git branch -M main

# Upload to GitHub (use your token as password)
git push -u origin main
```

## ✅ Step 6: Verify Upload
- [ ] Go to your GitHub profile
- [ ] You should see `imageoptimizer` repository
- [ ] Click on it to see all your files
- [ ] All your project files should be there

## 🎯 Quick Commands Summary
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOURUSERNAME/imageoptimizer.git
git branch -M main
git push -u origin main
```

**Replace `YOURUSERNAME` with your actual GitHub username!**

## ❓ Need Help?
- Check `GITHUB_FIRST_TIME_GUIDE.md` for detailed explanations
- Your repository URL will be: `https://github.com/YOURUSERNAME/imageoptimizer`

## 🚀 Next Step
Once GitHub is set up, you'll be ready to deploy to Vercel!
