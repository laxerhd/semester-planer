# GitHub Pages Deployment Guide

This guide explains how to deploy your TUM Master Credit Tracker to GitHub Pages.

## Prerequisites

- GitHub account
- Repository pushed to GitHub
- Node.js and npm installed locally

## Deployment Methods

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

This method automatically deploys your site whenever you push to the `main` branch.

#### Setup Steps:

1. **Enable GitHub Pages with GitHub Actions:**
   - Go to your GitHub repository: https://github.com/laxerhd/master-planer
   - Click on "Settings" (top menu)
   - Click on "Pages" in the left sidebar
   - Under "Build and deployment":
     - **Source**: Select "GitHub Actions" from the dropdown

2. **Push to Main Branch:**
   - The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`
   - Simply push your code to the `main` branch:
     ```bash
     git add .
     git commit -m "Setup GitHub Pages deployment"
     git push origin main
     ```

3. **Monitor Deployment:**
   - Go to the "Actions" tab in your repository
   - You should see a workflow run called "Deploy to GitHub Pages"
   - Wait for it to complete (usually takes 1-2 minutes)

4. **Access Your Site:**
   - Once deployed, your site will be available at:
     ```
     https://laxerhd.github.io/master-planer/
     ```

#### How It Works:

- Every push to `main` triggers the workflow
- The workflow:
  1. Checks out your code
  2. Installs dependencies
  3. Builds the project (`npm run build`)
  4. Deploys to GitHub Pages

### Method 2: Manual Deployment

If you prefer to deploy manually:

1. **Install gh-pages** (already done):
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Deploy manually:**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages (if not already done):**
   - Go to Settings > Pages
   - Under "Build and deployment":
     - **Source**: Select "Deploy from a branch"
     - **Branch**: Select "gh-pages" and "/ (root)"

## Troubleshooting

### Site Not Loading Correctly

If your site loads but assets are not found:
- Check that `base: '/master-planer/'` is set in `vite.config.ts`
- Verify the repository name matches the base path

### Deployment Failed

If the GitHub Action fails:
- Check the Actions tab for error logs
- Ensure you have enabled GitHub Pages in Settings
- Verify that GitHub Actions have write permissions

### After Repository Rename

If you rename your repository:
1. Update `base` in `vite.config.ts` to match new name
2. Push changes
3. Update GitHub Pages settings if needed

## Configuration Files

### vite.config.ts
```typescript
base: '/master-planer/', // Must match repository name
```

### package.json
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

### .github/workflows/deploy.yml
The GitHub Actions workflow that handles automatic deployment.

## Local Testing

Test the production build locally:

```bash
npm run build
npm run preview
```

Then visit: http://localhost:4173/master-planer/

## Notes

- **Data Storage**: The app uses browser localStorage, so data is stored locally on each device
- **Export/Import**: Users can export/import their data as JSON files
- **No Backend**: The app runs entirely in the browser, perfect for GitHub Pages
- **Updates**: Any push to main will trigger a new deployment

## Support

For issues with deployment, check:
- GitHub Actions logs (Actions tab)
- Browser console for errors
- GitHub Pages status in repository settings
