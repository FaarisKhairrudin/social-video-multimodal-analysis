# 🚀 Deploy to GitHub Pages - Complete Tutorial

Follow this step-by-step guide to deploy your Social Video Insights Dashboard to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed locally
- Node.js 18+ installed

## Step-by-Step Deployment Guide

### 1. **Prepare Your Repository**

#### Create GitHub Repository
1. Go to [github.com](https://github.com) and click **"New repository"**
2. Repository name: `social-video-insights-dashboard` (or your preferred name)
3. Make it **Public**
4. **Don't** initialize with README (we'll push existing code)
5. Click **"Create repository"**

#### Initialize Git (if not already done)
```bash
cd path/to/your/dashboard
git init
git add .
git commit -m "Initial commit: Social Video Insights Dashboard"
```

#### Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. **Project Already Configured** ✅

Your project includes these pre-configured files:
- ✅ `next.config.js` - Static export configuration
- ✅ `.github/workflows/deploy.yml` - Automated GitHub Actions deployment
- ✅ `package.json` - Build scripts for static export

### 3. **Update Configuration (Important!)**

#### If Repository Name ≠ `username.github.io`:

Update `next.config.js` - **Uncomment and modify these lines**:

```javascript
// Before (commented out)
// basePath: '/your-repo-name',
// assetPrefix: '/your-repo-name',

// After (uncommented and updated)
basePath: '/social-video-insights-dashboard',  // Your actual repo name
assetPrefix: '/social-video-insights-dashboard',  // Your actual repo name
```

**Example**: If your repo is `my-awesome-dashboard`:
```javascript
basePath: '/my-awesome-dashboard',
assetPrefix: '/my-awesome-dashboard',
```

### 4. **Enable GitHub Pages & Permissions**

#### Configure GitHub Pages:
1. Go to your GitHub repository page
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** section (left sidebar)
4. Under **"Source"**, select **"GitHub Actions"**
5. Click **"Save"**

#### Configure Actions Permissions:
1. In repository Settings, go to **"Actions"** → **"General"**
2. Under **"Workflow permissions"**, select:
   - ✅ **"Read and write permissions"**
   - ✅ **"Allow GitHub Actions to create and approve pull requests"**
3. Click **"Save"**

#### Configure Environments (Important!):
1. Go to **"Settings"** → **"Environments"**
2. Click **"New environment"**
3. Name: `github-pages`
4. Click **"Configure environment"**
5. Under **"Deployment branches and tags"**:
   - Select **"Selected branches and tags"**
   - Add rule: `main` (or your default branch)
6. Click **"Save protection rules"**

### 5. **Deploy! 🚀**

#### Push Your Changes:
```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

#### Monitor Deployment:
1. Go to **"Actions"** tab in your GitHub repository
2. You'll see a workflow running: **"Deploy to GitHub Pages"**
3. Click on it to watch the progress:
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build application
   - ✅ Deploy to GitHub Pages

### 6. **Access Your Live Site! 🎉**

Once deployment completes (green checkmark):

- **If repo name is** `username.github.io`: 
  - `https://username.github.io`
  
- **Otherwise**: 
  - `https://username.github.io/repository-name`

**Example**: `https://johndoe.github.io/social-video-insights-dashboard`

## 🔧 Test Local Build First

Before deploying, test the production build locally:

```bash
# Build for production
npm run build

# The 'out' folder will be created with static files
# This is what gets deployed to GitHub Pages
```

## 🛠 Troubleshooting

### Build Fails
- **Check Node.js version**: Requires 18+
- **Install dependencies**: `npm ci`
- **Check TypeScript**: `npm run lint`
- **Review error logs** in GitHub Actions

### 404 Error on GitHub Pages
- **Verify basePath** in `next.config.js` matches repository name
- **Check GitHub Pages settings** are correctly configured
- **Ensure workflow completed** successfully (green checkmark)

### CSS/Assets Not Loading
- **Update basePath/assetPrefix** in `next.config.js`
- **Use absolute paths** starting with `/` in your code
- **Clear browser cache** and try again

### Data Not Loading
- **Ensure** `public/data/df_final_dashboard.csv` exists
- **Check file paths** are correct for static export
- **Verify data file** is committed to repository

### Performance Issues
- **Enable compression** in GitHub Pages (automatic)
- **Optimize images** (use Next.js Image component)
- **Check bundle size** with `npm run build`

## 🚀 Automatic Updates

After initial setup, every push to `main` branch will automatically:
1. Trigger GitHub Actions workflow
2. Build the latest version
3. Deploy to GitHub Pages
4. Update your live site

## 🎯 Pro Tips

### Custom Domain (Optional)
1. Add `CNAME` file to `public/` folder with your domain
2. Configure DNS records with your domain provider
3. Update GitHub Pages settings

### Branch Protection
1. Go to repository Settings → Branches
2. Add protection rule for `main` branch
3. Require status checks to pass before merging

### Environment Variables
- GitHub Pages only supports **public** repositories
- Don't commit sensitive data
- Use build-time environment variables if needed

## 📈 Monitoring

### Check Deployment Status
- **GitHub Actions tab**: See all deployments
- **Repository Settings → Pages**: View current deployment
- **Network tab in browser**: Debug loading issues

### Analytics (Optional)
Add Google Analytics or similar to track visitors:
```javascript
// Add to app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
```

## 🔄 Updates and Maintenance

### Update Dependencies
```bash
npm update
git add package*.json
git commit -m "Update dependencies"
git push origin main
```

### Add New Features
1. Develop locally with `npm run dev`
2. Test build with `npm run build`
3. Commit and push to trigger deployment

---

**🎉 Congratulations!** Your Social Video Insights Dashboard is now live on GitHub Pages!

**Need help?** Open an issue in your repository or check the GitHub Actions logs for detailed error messages.