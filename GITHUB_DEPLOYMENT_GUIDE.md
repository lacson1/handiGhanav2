# GitHub Deployment Guide

This guide explains how to deploy HandyGhana v2 automatically via GitHub Actions.

## 🚀 Overview

The repository is configured with GitHub Actions workflows that automatically deploy:
- **Frontend** to Vercel when changes are pushed to `main` branch
- **Backend** to Fly.io when changes are pushed to `main` branch

## 📋 Prerequisites

1. **GitHub Repository**: `https://github.com/lacson1/handiGhanav2`
2. **Vercel Account**: Connected to your GitHub repository
3. **Fly.io Account**: With the `handighana-backend` app created
4. **Required Secrets**: Configured in GitHub repository settings

## 🔐 Setting Up GitHub Secrets

### Required Secrets for Frontend (Vercel)

1. Go to your GitHub repository: `https://github.com/lacson1/handiGhanav2`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | [Vercel Dashboard](https://vercel.com/account/tokens) → Create Token |
| `VITE_API_URL` | Backend API URL (optional) | `https://handighana-backend.fly.dev/api` |
| `VITE_SOCKET_URL` | WebSocket URL (optional) | `https://handighana-backend.fly.dev` |

### Required Secrets for Backend (Fly.io)

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `FLY_API_TOKEN` | Fly.io API token | Run: `fly auth token` in terminal |
| `DATABASE_URL` | PostgreSQL connection string | Your production database URL |

## 📁 Workflow Files

Three GitHub Actions workflows have been created:

### 1. `deploy-frontend.yml`
- **Triggers**: Push to `main` with changes in `frontend/` directory
- **Action**: Deploys frontend to Vercel
- **Manual Trigger**: Available via GitHub Actions UI

### 2. `deploy-backend.yml`
- **Triggers**: Push to `main` with changes in `backend/` directory
- **Action**: Deploys backend to Fly.io
- **Manual Trigger**: Available via GitHub Actions UI

### 3. `deploy.yml` (Combined)
- **Triggers**: Push to `main` or manual dispatch
- **Action**: Deploys both frontend and backend
- **Manual Trigger**: With options to deploy frontend/backend separately

## 🎯 How to Deploy

### Automatic Deployment

Simply push your changes to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The workflows will automatically:
- Detect changes in `frontend/` or `backend/` directories
- Build and deploy the appropriate service
- Run on every push to `main`

### Manual Deployment

1. Go to **Actions** tab in your GitHub repository
2. Select the workflow you want to run:
   - `Deploy Frontend to Vercel`
   - `Deploy Backend to Fly.io`
   - `Deploy Application` (both)
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow** button

### Commit Message Triggers

You can trigger specific deployments using commit messages:

- `[deploy frontend]` - Deploys only frontend
- `[deploy backend]` - Deploys only backend
- `[deploy all]` - Deploys both frontend and backend

Example:
```bash
git commit -m "[deploy all] Update features"
git push origin main
```

## 🔍 Monitoring Deployments

1. Go to **Actions** tab in GitHub
2. Click on a workflow run to see:
   - Build logs
   - Deployment status
   - Any errors or warnings

## 🛠️ Troubleshooting

### Frontend Deployment Issues

**Problem**: Vercel deployment fails
- **Solution**: 
  - Verify `VERCEL_TOKEN` secret is set correctly
  - Check that Vercel project is linked to GitHub repository
  - Ensure `vercel.json` is in the root directory

**Problem**: Build fails
- **Solution**:
  - Check build logs in GitHub Actions
  - Verify environment variables are set in Vercel dashboard
  - Test build locally: `cd frontend && npm run build`

### Backend Deployment Issues

**Problem**: Fly.io deployment fails
- **Solution**:
  - Verify `FLY_API_TOKEN` is valid (run `fly auth token` to get new token)
  - Check that `fly.toml` exists in `backend/` directory
  - Ensure Fly.io app exists: `fly apps list`

**Problem**: Database migration fails
- **Solution**:
  - Verify `DATABASE_URL` secret is correct
  - Check database connection from Fly.io
  - Run migrations manually: `fly ssh console -C 'npx prisma migrate deploy'`

## 📝 Environment Variables

### Vercel Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

- `VITE_API_URL`: `https://handighana-backend.fly.dev/api`
- `VITE_SOCKET_URL`: `https://handighana-backend.fly.dev`

### Fly.io Secrets

Set these using Fly.io CLI or dashboard:

```bash
fly secrets set DATABASE_URL="your-database-url"
fly secrets set JWT_SECRET="your-jwt-secret"
fly secrets set FRONTEND_URL="https://handi-ghanav2.vercel.app"
fly secrets set NODE_ENV="production"
# ... other secrets
```

## 🔄 Workflow Behavior

### Path-based Triggers

Workflows only run when relevant files change:
- Frontend workflow: Changes in `frontend/`, `vercel.json`, or workflow file
- Backend workflow: Changes in `backend/` or workflow file

This prevents unnecessary deployments.

### Branch Protection

Currently configured for `main` branch only. To deploy from other branches:
1. Edit workflow files
2. Add branch name to `branches:` section

## 🎉 Success Indicators

After a successful deployment:

- **Frontend**: Visit `https://handi-ghanav2.vercel.app` (or your custom domain)
- **Backend**: Visit `https://handighana-backend.fly.dev/api/health` (if health endpoint exists)
- **GitHub Actions**: Green checkmark ✅ in Actions tab

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Fly.io Deployment Guide](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/)

## 🔐 Security Notes

- Never commit secrets or API tokens to the repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate API tokens
- Review workflow logs for any exposed information

## ✅ Quick Checklist

Before your first deployment:

- [ ] GitHub repository is set up
- [ ] Vercel project is connected to GitHub
- [ ] Fly.io app is created
- [ ] All required secrets are added to GitHub
- [ ] Environment variables are set in Vercel
- [ ] Fly.io secrets are configured
- [ ] Test deployment with a small change

---

**Repository**: https://github.com/lacson1/handiGhanav2
**Frontend**: https://handi-ghanav2.vercel.app
**Backend**: https://handighana-backend.fly.dev

