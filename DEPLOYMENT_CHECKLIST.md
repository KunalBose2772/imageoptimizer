# Vercel Deployment Checklist

## Before You Start
- [ ] GitHub account created
- [ ] Your project code is ready
- [ ] Node.js installed on your computer

## Step 1: GitHub Setup
- [ ] Create new repository on GitHub
- [ ] Repository name: `imageoptimizer` (or your choice)
- [ ] Make repository **PUBLIC** (required for free Vercel)
- [ ] Don't initialize with README/gitignore

## Step 2: Prepare Your Code
- [ ] Run `npm install` (install dependencies)
- [ ] Run `npm run build` (test build works)
- [ ] Run `npm start` (test production build)

## Step 3: Push to GitHub
- [ ] Initialize git: `git init`
- [ ] Add files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Add remote: `git remote add origin https://github.com/yourusername/imageoptimizer.git`
- [ ] Set branch: `git branch -M main`
- [ ] Push: `git push -u origin main`

## Step 4: Deploy on Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Click "New Project"
- [ ] Import your `imageoptimizer` repository
- [ ] Click "Deploy"

## Step 5: Test Your Live Site
- [ ] Visit your live URL (e.g., `https://imageoptimizer-xxx.vercel.app`)
- [ ] Test homepage loads
- [ ] Test image conversion tools
- [ ] Test PDF tools
- [ ] Test on mobile device
- [ ] Test file uploads

## Quick Commands (Copy & Paste)

```bash
# Initialize and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOURUSERNAME/imageoptimizer.git
git branch -M main
git push -u origin main
```

Replace `YOURUSERNAME` with your actual GitHub username!

## Troubleshooting

### Build Fails?
```bash
npm install
npm run build
```
Fix any errors before deploying.

### Can't Push to GitHub?
- Check your GitHub username in the remote URL
- Make sure you're authenticated with GitHub
- Use GitHub CLI: `gh auth login`

### API Routes Not Working?
- Check files are in `pages/api/` folder
- Verify function exports in API files

## Your Live URL Will Be:
`https://imageoptimizer-xxx.vercel.app`

Where `xxx` is your project name.

## Need Help?
1. Check `VERCEL_DEPLOYMENT_GUIDE.md` for detailed steps
2. Run `deploy.bat` (Windows) or `deploy.sh` (Mac/Linux) for automated setup
3. Visit Vercel documentation: https://vercel.com/docs
