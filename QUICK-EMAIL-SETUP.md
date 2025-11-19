# ⚡ Quick Email Setup (5 Minutes)

## What You Need

Your Gmail account and 5 minutes.

## Steps

### 1. Enable 2FA on Gmail
Go to: https://myaccount.google.com/security
- Click "2-Step Verification"
- Follow the setup

### 2. Generate App Password
Go to: https://myaccount.google.com/apppasswords
- Select app: **Mail**
- Select device: **Other** → Type: **YouTube Clone**
- Click **Generate**
- Copy the 16-character password

### 3. Update backend/.env

Add these lines:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=YouTube Clone <your-email@gmail.com>
```

### 4. Restart Backend

```bash
# Stop backend (Ctrl+C)
# Start again
cd backend
npm run dev
```

### 5. Test It

1. Go to http://localhost:5173/forgot-password
2. Enter your email
3. Check your inbox
4. Click the reset link
5. Done! ✅

---

## How It Works Now

### Before (Without Email):
1. User enters email
2. Reset link shown in backend console only
3. User has to manually copy link

### After (With Email):
1. User enters email
2. Email sent automatically
3. User clicks link in email
4. Password reset!

---

## What If I Don't Set Up Email?

**No problem!** The app still works:
- Reset link will be shown in backend console
- You can copy it manually
- Good for development/testing

**But for production**, you MUST set up email so users can actually receive the reset links.

---

## Troubleshooting

### Email not sending?

Check backend console for errors:
- ✅ "Email sent successfully" = Working!
- ⚠️ "Email not configured" = Add EMAIL_USER and EMAIL_PASS to .env
- ❌ "Authentication failed" = Wrong password (use App Password, not regular password)

### Email goes to spam?

Normal for development. For production, use SendGrid or Mailgun.

---

## Production Setup

For production, use a professional email service:

**SendGrid** (Recommended):
- Free: 100 emails/day
- Sign up: https://sendgrid.com/
- Better deliverability

**Mailgun**:
- Free: 5000 emails/month
- Sign up: https://mailgun.com/

See `EMAIL-SETUP-GUIDE.md` for detailed instructions.

---

**Time**: 5 minutes
**Difficulty**: Easy 🟢
**Required**: Only for production
