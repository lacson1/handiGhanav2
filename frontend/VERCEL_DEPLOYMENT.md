# Vercel Deployment Guide for HandyGhana Frontend

This guide will help you deploy the HandyGhana frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your backend API URL (if already deployed)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Navigate to the frontend directory**:
```bash
cd frontend
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy to Vercel**:
```bash
vercel
```

5. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account/team)
   - Link to existing project? **No** (for first deployment)
   - What's your project's name? **handyghana-frontend** (or your preferred name)
   - In which directory is your code located? **./** (current directory)
   - Want to override the settings? **No** (uses vercel.json)

6. **Set Environment Variables**:
After deployment, you'll need to set the `VITE_API_URL` environment variable:
```bash
vercel env add VITE_API_URL
```
Enter your backend API URL when prompted: `https://handighana-backend.fly.dev/api`

7. **Redeploy with environment variables**:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your Git repository**:
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select your repository
   - Click "Import"

4. **Configure the project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `frontend` (if deploying from monorepo root)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add `VITE_API_URL` with your backend API URL
   - Value: `https://handighana-backend.fly.dev/api` (Fly.io backend)
   - Make sure to add it for **Production**, **Preview**, and **Development** environments

6. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

## Environment Variables

### Required Environment Variables

- `VITE_API_URL`: Your backend API URL
  - Development: `http://localhost:3001/api`
  - Production: `https://handighana-backend.fly.dev/api` (Fly.io backend)

### Setting Environment Variables via CLI

```bash
# Add environment variable
vercel env add VITE_API_URL production

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VITE_API_URL production
```

### Setting Environment Variables via Dashboard

1. Go to your project on Vercel
2. Click "Settings" → "Environment Variables"
3. Add your variables
4. Redeploy the project

## Post-Deployment

### 1. Update CORS on Fly.io Backend

Make sure your Fly.io backend allows requests from your Vercel domain:
- SSH into your Fly.io backend: `cd backend && fly ssh console`
- Or update CORS configuration in `backend/src/server.ts`
- Add your Vercel URL to CORS origins (e.g., `https://handyghana-frontend.vercel.app`)
- Redeploy backend if needed: `cd backend && fly deploy`

### 2. Test the Deployment

1. Visit your Vercel deployment URL
2. Test authentication
3. Test API calls
4. Check browser console for any errors

### 3. Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### API Calls Fail

- Verify `VITE_API_URL` is set to `https://handighana-backend.fly.dev/api`
- Check CORS settings on Fly.io backend (should allow your Vercel domain)
- Verify backend is running: `fly status` (from backend directory)
- Check backend logs: `fly logs` (from backend directory)

### Routing Issues (404 on refresh)

- The `vercel.json` includes rewrites for SPA routing
- If issues persist, check the rewrites configuration

### Service Worker Issues

- Service workers are configured with proper cache headers
- Clear browser cache if needed
- Check browser console for service worker errors

## Continuous Deployment

Vercel automatically deploys when you push to your connected Git branch:
- `main` branch → Production
- Other branches → Preview deployments

## Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove
```

## Project Configuration

The `vercel.json` file includes:
- Build configuration
- SPA routing rewrites
- Service worker cache headers
- Framework detection (Vite)

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set
4. Check backend API is accessible

