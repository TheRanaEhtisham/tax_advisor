# Vercel Deployment Guide

## Overview
This guide walks you through deploying **TaxAdvisor** to Vercel with automatic CI/CD.

## Prerequisites
- GitHub account with the repository pushed
- Vercel account (free at https://vercel.com)
- Node.js 18+ locally installed

---

## Step 1: Push Your Code to GitHub

Ensure all code is committed and pushed:

```bash
git add .
git commit -m "Add Vercel configuration and CI/CD workflows"
git push -u origin main
```

---

## Step 2: Create a Vercel Account and Link Your Repo

1. **Sign up** at [vercel.com](https://vercel.com) (free tier available)
2. Click **"New Project"**
3. **Import Git Repository**
   - Select GitHub
   - Authorize Vercel to access your GitHub
   - Find and select the `tex_advisor` repository
4. Click **"Import"**

---

## Step 3: Configure Project Settings in Vercel

On the import screen:

- **Framework Preset:** Next.js (should auto-detect)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 18.x (default)

**Environment Variables:**
- (Optional) Add any future API keys here
- Currently, the app works without environment variables

Leave other settings as default and click **"Deploy"**.

---

## Step 4: Set Up GitHub Secrets for CI/CD

The GitHub Actions workflows need Vercel credentials. In GitHub:

1. Go to **Settings > Secrets and variables > Actions**
2. Click **"New repository secret"** and add:

   | Secret Name | Value |
   |---|---|
   | `VERCEL_TOKEN` | Your Vercel auth token (see Step 5) |
   | `VERCEL_ORG_ID` | Your Vercel org ID (see Step 5) |
   | `VERCEL_PROJECT_ID` | Your Vercel project ID (see Step 5) |

---

## Step 5: Obtain Your Vercel Credentials

### Get Your Vercel Token:
```bash
vercel login
vercel whoami
```

Then visit [vercel.com/account/tokens](https://vercel.com/account/tokens) and create a token.

### Get Your Organization ID and Project ID:

1. In Vercel dashboard, go to **Settings** (bottom left)
2. Copy your **Team ID** (this is your `VERCEL_ORG_ID`)
3. Go to your **TaxAdvisor project > Settings > General**
4. Copy the **Project ID** field

---

## Step 6: Test the CI/CD Pipeline

1. **Create a test branch:**
   ```bash
   git checkout -b test-ci
   ```

2. **Make a small change** (e.g., update README)
   ```bash
   git add .
   git commit -m "Test CI pipeline"
   git push -u origin test-ci
   ```

3. **Create a pull request** on GitHub
4. **Verify CI runs:**
   - Go to the PR > **Checks** tab
   - Watch the `CI - Lint and Test` workflow run
   - It should pass lint and build checks

5. **Merge the PR** to `main`
   - The `CD - Deploy to Vercel` workflow will trigger automatically
   - Monitor it in **Actions** tab
   - Once complete, your app is live on Vercel!

---

## Step 7: Access Your Deployed App

After deployment completes:

1. Go to your **Vercel project dashboard**
2. Copy the **Production URL** (e.g., `https://tex-advisor.vercel.app`)
3. Share or test your live app!

**Production Deployment Link:** [Available after first deployment]

---

## Ongoing Deployment

### Automatic Deployments:
- **Every push to `main`** → auto-deploys to production
- **Every push to `develop`** → (optional) deploys to a staging/preview
- **Every PR** → runs lint & build checks; previews deploy on merge

### Manual Deployments:
```bash
vercel --prod
```

---

## Environment Variables (Future)

If you add API keys in the future:

1. **In Vercel Dashboard:**
   - Project > Settings > Environment Variables
   - Add key-value pairs
   - Select which environments (Development, Preview, Production)

2. **In GitHub Actions:**
   - Add secrets to GitHub (Settings > Secrets)
   - Reference in workflow: `${{ secrets.YOUR_SECRET_NAME }}`

---

## Troubleshooting

### Deployment fails with "Build error"
- Check the **Build Logs** in Vercel
- Ensure `npm run build` works locally: `npm run build`
- Verify Node version matches (18.x)

### GitHub Actions workflow not running
- Ensure secrets are set correctly in GitHub
- Check repository > Actions > All workflows are enabled
- Verify branch name is `main` (case-sensitive)

### Vercel preview not showing changes
- Clear browser cache or use incognito mode
- Wait for deployment to complete (check Vercel dashboard)

### "Module not found" errors
- Run `npm install` locally and commit `package-lock.json`
- Ensure all dependencies are in `package.json`

---

## Scaling & Monitoring

Once deployed:

1. **Enable Analytics** (Vercel Dashboard > Analytics)
2. **Monitor performance** (Web Vitals, response times)
3. **Set up error tracking** (Vercel Integrations > Sentry)
4. **Configure custom domain** (Domains tab in project settings)

---

## Rollback to Previous Version

If something breaks after deployment:

1. Go to **Vercel Dashboard > Deployments**
2. Find the previous stable deployment
3. Click **⋮ > Promote to Production**

---

## CI/CD Workflows Summary

| Workflow | Trigger | Action |
|----------|---------|--------|
| `ci.yml` | PR to `main` or `develop` | Lint & build test |
| `deploy.yml` | Push to `main` or `develop` | Deploy to Vercel |

Both workflows use Node 18.x for consistency.

---

## Next Steps

✅ Vercel configured  
✅ GitHub Actions CI/CD set up  
✅ Production deployments automated  

**Ready to deploy?** Push to `main` and watch your app go live! 🚀
