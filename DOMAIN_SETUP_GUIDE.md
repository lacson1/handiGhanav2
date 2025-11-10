# Domain Setup Guide for handighana.com

This guide will walk you through setting up your custom domain `handighana.com` for both frontend and backend services.

## Overview

- **Frontend**: handighana.com → Vercel
- **Backend**: handighana-backend.fly.dev (or api.handighana.com) → Fly.io
- **Current Backend URL**: https://handighana-backend.fly.dev

## Step 1: Domain Provider Configuration

### 1.1 Purchase Domain (if not already done)

If you haven't purchased `handighana.com` yet, you can buy it from:
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Google Domains](https://domains.google)
- [Cloudflare](https://www.cloudflare.com/products/registrar/)

### 1.2 Access Your Domain DNS Settings

Log into your domain registrar and navigate to DNS management for `handighana.com`.

## Step 2: Frontend Setup (Vercel)

### 2.1 Add Domain in Vercel Dashboard

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your HandiGhana project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `handighana.com`
6. Also add: `www.handighana.com` (recommended)
7. Click **Add**

### 2.2 Configure DNS Records for Frontend

Vercel will provide you with DNS records to add. Add these records in your domain registrar:

**For Root Domain (handighana.com):**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| AAAA | @ | 2606:4700:4:0:0:0:7628:1515 |

**For WWW Subdomain (www.handighana.com):**

| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |

**Alternative Option (if your registrar supports ANAME/ALIAS):**

| Type | Name | Value |
|------|------|-------|
| ANAME/ALIAS | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |

### 2.3 SSL Certificate

Vercel will automatically provision an SSL certificate for your domain within a few minutes after DNS propagation.

## Step 3: Backend Setup (Fly.io) - Optional

You have two options for the backend:

### Option A: Keep Current URL (Recommended for now)
- Backend URL: `https://handighana-backend.fly.dev`
- No changes needed
- Works immediately

### Option B: Use Custom Subdomain (api.handighana.com)

If you want to use `api.handighana.com` for your backend:

#### 3.1 Add Custom Domain in Fly.io

```bash
# Install Fly CLI if not already installed
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Add custom domain
cd backend
fly certs create api.handighana.com
```

#### 3.2 Configure DNS Records for Backend

Add the following DNS record in your domain registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | api | handighana-backend.fly.dev |

#### 3.3 Update Frontend Configuration

If you choose Option B, update the frontend to use the new API URL:

**Update `frontend/vercel.json`:**

```json
{
  "env": {
    "VITE_API_URL": "https://api.handighana.com/api",
    "VITE_SOCKET_URL": "https://api.handighana.com"
  },
  "build": {
    "env": {
      "VITE_API_URL": "https://api.handighana.com/api",
      "VITE_SOCKET_URL": "https://api.handighana.com"
    }
  }
}
```

#### 3.4 Update Backend CORS Settings

Update your backend to allow requests from the new domain:

**In `backend/src/server.ts` or equivalent:**

```typescript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://handighana.com',
    'https://www.handighana.com',
    'https://your-vercel-url.vercel.app'
  ],
  credentials: true
}
```

## Step 4: Verification & Testing

### 4.1 Check DNS Propagation

Use these tools to verify DNS propagation:
- https://dnschecker.org
- https://www.whatsmydns.net

DNS propagation can take 24-48 hours, but usually completes within 1-2 hours.

### 4.2 Test Your Application

1. **Frontend**: Visit https://handighana.com
2. **SSL**: Ensure the padlock icon shows in the browser
3. **API Connection**: Test login/signup to verify API connectivity
4. **WebSocket**: Test real-time features (if applicable)

### 4.3 Redirect WWW to Non-WWW (or vice versa)

In Vercel dashboard:
1. Go to **Settings** → **Domains**
2. Find `www.handighana.com`
3. Set it to redirect to `handighana.com` (or opposite)

## Step 5: Update Environment Variables

### 5.1 Backend Environment Variables

Update your backend's `.env` or Fly.io secrets:

```bash
# Update FRONTEND_URL
fly secrets set FRONTEND_URL=https://handighana.com
```

Or in your backend `.env`:
```env
FRONTEND_URL=https://handighana.com
```

### 5.2 Verify All URLs

**Check these files for URL references:**
- `backend/src/server.ts` - CORS configuration
- `backend/src/services/emailService.ts` - Email links
- Any OAuth callback URLs
- Payment callback URLs (Paystack)

## Step 6: Post-Deployment Checklist

- [ ] Domain resolves to Vercel
- [ ] SSL certificate is active (HTTPS works)
- [ ] WWW redirect is configured
- [ ] API endpoints are accessible
- [ ] Login/signup works
- [ ] Image uploads work (check Cloudinary CORS)
- [ ] Payment integration works (update Paystack webhook URLs)
- [ ] Email links point to new domain
- [ ] Social share links updated
- [ ] Analytics/monitoring updated with new domain
- [ ] Sitemap updated (if exists)

## Troubleshooting

### DNS Not Resolving
- Wait 24-48 hours for full propagation
- Clear browser cache and DNS cache
- Try different browsers or incognito mode
- Use `nslookup handighana.com` to check DNS

### SSL Certificate Issues
- Vercel usually provisions SSL within 10 minutes
- Ensure DNS records are correct
- Remove and re-add domain in Vercel if needed

### CORS Errors
- Update backend CORS to include new domain
- Redeploy backend after CORS changes
- Check browser console for specific error messages

### API Not Connecting
- Verify `VITE_API_URL` in Vercel environment variables
- Check backend is running: `curl https://handighana-backend.fly.dev/api/health`
- Redeploy frontend after changing environment variables

## Quick Commands

```bash
# Check if domain resolves
nslookup handighana.com

# Check SSL certificate
openssl s_client -connect handighana.com:443 -servername handighana.com

# Test API endpoint
curl https://handighana-backend.fly.dev/api/providers

# Redeploy frontend (in frontend directory)
vercel --prod

# Check Fly.io certificates
fly certs show api.handighana.com

# Redeploy backend (in backend directory)
fly deploy
```

## Domain Configuration Summary

### Current Setup (Before Custom Domain)
- Frontend: `your-project.vercel.app`
- Backend: `handighana-backend.fly.dev`

### Target Setup (After Custom Domain)
- Frontend: `handighana.com` (with www redirect)
- Backend: `handighana-backend.fly.dev` (or `api.handighana.com`)

## Support Resources

- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Fly.io Custom Domains](https://fly.io/docs/app-guides/custom-domains-with-fly/)
- [DNS Checker](https://dnschecker.org)

## Notes

- Keep both old and new URLs working during transition period
- Update all external services (OAuth, payments, etc.) with new URLs
- Monitor error logs for any issues after domain switch
- Consider setting up redirects from old domain if applicable

---

**Last Updated**: November 10, 2025
**Application**: HandiGhana v2
**Primary Domain**: handighana.com

