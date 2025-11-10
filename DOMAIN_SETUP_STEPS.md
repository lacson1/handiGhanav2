# 🌐 Domain Setup Steps for handighana.com

## ⚡ Quick Start (5 Steps)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your HandiGhana project
3. Click **Settings** → **Domains**

### Step 2: Add Your Domain
1. Click **"Add Domain"**
2. Enter: `handighana.com`
3. Click **"Add"**
4. Repeat for: `www.handighana.com`

### Step 3: Get DNS Records from Vercel
Vercel will show you the DNS records to add. They typically look like:

**Root Domain:**
- Type: A
- Name: @
- Value: 76.76.21.21

**WWW Subdomain:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### Step 4: Configure DNS at Your Registrar

**Where did you purchase handighana.com?**

#### If using Namecheap:
1. Login to Namecheap
2. Go to Domain List → Manage
3. Click "Advanced DNS"
4. Add the records from Vercel

#### If using GoDaddy:
1. Login to GoDaddy
2. Go to My Products → Domains
3. Click DNS
4. Add the records from Vercel

#### If using Cloudflare:
1. Login to Cloudflare
2. Select handighana.com
3. Go to DNS
4. Add the records from Vercel

#### If using Google Domains:
1. Login to Google Domains
2. Select handighana.com
3. Click DNS
4. Add the records from Vercel

### Step 5: Wait & Verify
1. **Wait 10-60 minutes** for DNS to propagate
2. Check propagation: https://dnschecker.org
3. Visit: https://handighana.com
4. ✅ If it loads, you're done!

---

## 🔍 Verification Commands

**Check if DNS is working:**
```bash
nslookup handighana.com
```

**Test SSL Certificate:**
```bash
curl -I https://handighana.com
```

**Test API Connection:**
```bash
curl https://handighana-backend.fly.dev/health
```

---

## 📋 DNS Records Summary

Add these records to your domain registrar's DNS settings:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Automatic |
| CNAME | www | cname.vercel-dns.com | Automatic |

**Note:** The exact values might differ. Always use the values provided by Vercel in your dashboard.

---

## ⏰ Timeline

- **Immediate**: Add domain in Vercel (2 minutes)
- **Immediate**: Configure DNS (5 minutes)
- **10-60 minutes**: DNS propagation
- **Automatic**: SSL certificate provisioning

**Total Time: ~1 hour** (mostly waiting for DNS)

---

## ✅ Success Checklist

After DNS propagates:

- [ ] https://handighana.com loads correctly
- [ ] SSL certificate shows (padlock icon)
- [ ] www.handighana.com redirects to handighana.com
- [ ] Can login/register
- [ ] Can search providers
- [ ] Can create bookings

---

## 🆘 Troubleshooting

### Domain doesn't load?
- Wait longer (can take up to 48 hours)
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode
- Check DNS: https://dnschecker.org

### SSL not working?
- Wait 10 more minutes
- Ensure DNS records are correct
- Try removing and re-adding domain in Vercel

### API errors?
- Check browser console (F12)
- Backend should still work at: handighana-backend.fly.dev
- CORS is already configured for your domain

---

## 🎯 What We've Already Done

✅ Updated backend CORS to allow handighana.com  
✅ Added security headers to Vercel config  
✅ Configured email service for new domain  
✅ Created comprehensive documentation  

**You just need to:** Add the domain in Vercel + Configure DNS

---

## 📚 Full Documentation

For detailed information, see:
- **DOMAIN_SETUP_GUIDE.md** - Complete setup guide
- **DOMAIN_QUICK_REFERENCE.md** - Quick reference
- **DOMAIN_CONFIGURATION_SUMMARY.md** - What we changed

---

## 💡 Pro Tips

1. **Do both domains**: Add both `handighana.com` and `www.handighana.com` in Vercel
2. **Set primary**: Choose which one is primary (we recommend non-www)
3. **Check email**: Update any OAuth apps, payment webhooks, etc.
4. **Monitor**: Check Vercel analytics after launch
5. **Test mobile**: Test on phone after DNS propagates

---

## 🎉 After Setup

Once your domain is live:

1. Share it: https://handighana.com
2. Test all features
3. Update social media links
4. Set up monitoring/analytics
5. Consider SEO setup (sitemap, robots.txt)

---

**Need help?** Check the troubleshooting sections in the documentation or feel free to ask!

---

**Quick Links:**
- [Vercel Dashboard](https://vercel.com/dashboard)
- [DNS Checker](https://dnschecker.org)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

