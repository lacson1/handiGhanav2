# ☁️ Cloudinary Setup Guide

Cloudinary is used for image uploads (provider photos, work portfolios, user avatars, etc.)

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Free Cloudinary Account

1. Visit: https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email
4. You get **25 GB storage + 25 GB bandwidth FREE per month**

### Step 2: Get Your Credentials

1. Log into Cloudinary Dashboard: https://console.cloudinary.com/
2. On the dashboard home page, you'll see:
   ```
   Cloud Name: your-cloud-name
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz
   ```
3. Copy these three values

### Step 3: Set Local Environment Variables

**Option A: Manual Edit**
1. Open `backend/.env` file
2. Add these lines:
   ```bash
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your-secret-here
   ```

**Option B: Use Command Line**
```bash
cd backend
echo "CLOUDINARY_CLOUD_NAME=your-cloud-name" >> .env
echo "CLOUDINARY_API_KEY=123456789012345" >> .env
echo "CLOUDINARY_API_SECRET=your-secret-here" >> .env
```

### Step 4: Set Production Environment Variables (Fly.io)

Run these commands (replace with your actual values):

```bash
cd backend

# Set Cloudinary Cloud Name
fly secrets set CLOUDINARY_CLOUD_NAME="your-cloud-name" -a handighana-backend

# Set Cloudinary API Key
fly secrets set CLOUDINARY_API_KEY="123456789012345" -a handighana-backend

# Set Cloudinary API Secret
fly secrets set CLOUDINARY_API_SECRET="your-secret-here" -a handighana-backend
```

**Note**: Setting secrets will automatically restart your app!

### Step 5: Verify Setup

**Test Local:**
```bash
cd backend
npm run dev
# Visit http://localhost:3001/test/config
# Check that cloudinary.configured shows true
```

**Test Production:**
```bash
curl https://handighana-backend.fly.dev/test/config | jq .cloudinary
# Should show: { "configured": true }
```

---

## 🎨 Cloudinary Features Enabled

Once configured, your app will support:

- ✅ **Provider profile photos**
- ✅ **Provider work portfolios** (before/after photos)
- ✅ **User avatars**
- ✅ **Service images**
- ✅ **Automatic image optimization**
- ✅ **Responsive image delivery**
- ✅ **Image transformations** (crop, resize, etc.)

---

## 📊 Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **API Requests**: No limit

This is **more than enough** for testing and early production!

---

## 🔐 Security Best Practices

1. ✅ **Never commit** `.env` file to git (already in `.gitignore`)
2. ✅ **Use different accounts** for dev/production (optional)
3. ✅ **Rotate secrets** if exposed
4. ✅ **Use upload presets** for better security (optional)

---

## 🛠️ Quick Command Reference

```bash
# View current secrets in production
fly secrets list -a handighana-backend

# Update a single secret
fly secrets set CLOUDINARY_CLOUD_NAME="new-value" -a handighana-backend

# Remove a secret (if needed)
fly secrets unset CLOUDINARY_CLOUD_NAME -a handighana-backend

# Restart app after changes
fly apps restart handighana-backend
```

---

## 🧪 Test Upload (After Setup)

You can test uploads via the API:

```bash
# Get auth token first
TOKEN=$(curl -X POST https://handighana-backend.fly.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"password123"}' \
  | jq -r .token)

# Test upload endpoint
curl -X POST https://handighana-backend.fly.dev/api/upload/signature \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"uploadPreset":"provider_photos"}'
```

---

## ❓ Troubleshooting

### "Cloudinary is not configured" error
- Verify all 3 variables are set correctly
- Check for typos in variable names
- Restart your backend server

### "Invalid credentials" error
- Double-check your API Key and Secret
- Make sure there are no extra spaces
- Try regenerating credentials in Cloudinary dashboard

### Images not uploading
- Check browser console for errors
- Verify CORS settings in Cloudinary
- Ensure you're authenticated (JWT token)

---

## 🆓 Alternative: Use Demo Mode (Temporary)

If you want to test without setting up Cloudinary immediately, images will be stored as base64 strings in the database (not recommended for production, but works for testing).

The app will function, but:
- ⚠️ No image optimization
- ⚠️ Larger database size
- ⚠️ Slower loading times
- ⚠️ No transformations

---

## 🎯 Ready?

1. **Create account**: https://cloudinary.com/users/register_free
2. **Get credentials**: https://console.cloudinary.com/
3. **Set variables** (see Step 3 & 4 above)
4. **Test and enjoy!** 🚀

---

**Need help?** The setup takes just 5 minutes and gives you professional image handling!

