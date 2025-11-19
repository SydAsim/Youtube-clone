# 🔒 Security Quick Start Guide

## ⚠️ URGENT: Do This First!

Your credentials are exposed. Follow these steps immediately:

### Step 1: Generate New Secrets (2 minutes)
```bash
cd backend
node generate-secrets.js
```

Copy the output and update your `.env` file.

### Step 2: Rotate MongoDB Password (3 minutes)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Database Access"
3. Edit your user → Change password
4. Copy new connection string
5. Update `MONGODB_URI` in `.env`

### Step 3: Regenerate Cloudinary Keys (2 minutes)
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Settings → Security → API Keys
3. Click "Regenerate API Secret"
4. Update `CLOUDINARY_API_SECRET` in `.env`

### Step 4: Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## ✅ What's Been Fixed

- ✅ Rate limiting on login/register (5 attempts per 15 min)
- ✅ Rate limiting on uploads (10 per hour)
- ✅ NoSQL injection prevention in search
- ✅ Secure cookie configuration
- ✅ Input sanitization

## 🧪 Quick Test

```bash
# Test rate limiting works
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  -w "\nStatus: %{http_code}\n"

# Run 6 times - 6th should return 429
```

## 📚 Full Documentation

- `SECURITY.md` - Complete security guidelines
- `SECURITY-FIXES-APPLIED.md` - Detailed changes made

## 🆘 Need Help?

Check the backend console for errors or refer to the documentation files.

---

**Time to complete**: ~10 minutes
**Priority**: 🔴 CRITICAL - Do immediately
