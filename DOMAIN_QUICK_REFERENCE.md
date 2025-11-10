# Domain Quick Reference - handighana.com

## 🌐 Live URLs

- **Main Site**: https://handighana.com
- **API Endpoint**: https://handighana-backend.fly.dev/api
- **Health Check**: https://handighana-backend.fly.dev/health

## 📋 DNS Records

Add these records to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare):

### For Vercel (Frontend)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Auto |
| CNAME | www | cname.vercel-dns.com | Auto |

### For Fly.io Backend (Optional - if using api.handighana.com)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | api | handighana-backend.fly.dev | Auto |

## ⚡ Quick Setup Steps

### 1. Add Domain to Vercel
```bash
# Go to: https://vercel.com/dashboard
# → Select your project
# → Settings → Domains
# → Add: handighana.com and www.handighana.com
```

### 2. Configure DNS
- Log into your domain registrar
- Add the DNS records listed above
- Wait 5-60 minutes for propagation

### 3. Verify Setup
```bash
# Check DNS propagation
nslookup handighana.com

# Test SSL
curl -I https://handighana.com

# Test API
curl https://handighana-backend.fly.dev/health
```

## 🔧 Update Backend for New Domain

If needed, update the `FRONTEND_URL` environment variable:

```bash
cd backend
fly secrets set FRONTEND_URL=https://handighana.com
```

## ✅ Post-Setup Checklist

- [ ] Domain resolves to Vercel
- [ ] SSL certificate active (HTTPS works)
- [ ] WWW redirects to non-WWW (or vice versa)
- [ ] API calls work from frontend
- [ ] Login/authentication works
- [ ] Image uploads work
- [ ] Payment integration works (update Paystack settings)
- [ ] Email links use new domain
- [ ] Update OAuth redirect URLs (if applicable)

## 🐛 Troubleshooting

### Domain not resolving?
- Wait longer (DNS can take up to 48 hours)
- Clear browser cache: Ctrl+Shift+Del (or Cmd+Shift+Del on Mac)
- Try incognito mode
- Check DNS: https://dnschecker.org

### CORS errors?
- Verify domain is in `backend/src/server.ts` CORS configuration
- Redeploy backend after changes
- Check browser console for specific error

### SSL not working?
- Vercel usually provisions SSL within 10 minutes
- Try removing and re-adding domain in Vercel
- Ensure DNS records are correct

## 📞 Support

- [Vercel Domains Docs](https://vercel.com/docs/concepts/projects/domains)
- [Fly.io Custom Domains](https://fly.io/docs/app-guides/custom-domains-with-fly/)
- [DNS Checker Tool](https://dnschecker.org)

---

For detailed setup instructions, see [DOMAIN_SETUP_GUIDE.md](./DOMAIN_SETUP_GUIDE.md)

