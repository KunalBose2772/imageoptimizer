#!/bin/bash

# ImageOptimizer Vercel Deployment Script
# Run this script to automatically prepare and deploy your project

echo "🚀 Starting ImageOptimizer Deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check if git is initialized
print_status "Checking git repository..."
if [ ! -d ".git" ]; then
    print_status "Initializing git repository..."
    git init
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Step 2: Install dependencies
print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Run build test
print_status "Testing build..."
if npm run build; then
    print_success "Build test passed"
else
    print_error "Build test failed. Please fix errors before deploying"
    exit 1
fi

# Step 4: Add all files to git
print_status "Adding files to git..."
git add .
print_success "Files added to git"

# Step 5: Create commit
print_status "Creating commit..."
git commit -m "Deploy: Ready for Vercel deployment - $(date)"

# Step 6: Check if remote exists
if ! git remote get-url origin >/dev/null 2>&1; then
    print_warning "No GitHub remote found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/imageoptimizer.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    exit 1
fi

# Step 7: Push to GitHub
print_status "Pushing to GitHub..."
if git push origin main; then
    print_success "Code pushed to GitHub successfully"
else
    print_error "Failed to push to GitHub. Please check your GitHub credentials"
    exit 1
fi

# Step 8: Final instructions
print_success "🎉 Deployment preparation complete!"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Go to https://vercel.com"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your 'imageoptimizer' repository"
echo "5. Click 'Deploy'"
echo ""
echo -e "${BLUE}Your site will be live at:${NC} https://your-project-name.vercel.app"
echo ""
echo -e "${YELLOW}Need help? Check VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions${NC}"
