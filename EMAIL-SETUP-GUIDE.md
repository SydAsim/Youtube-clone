# 📧 Email Setup Guide for Password Reset

## Quick Setup with Gmail (Recommended for Development)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the steps to enable 2FA (if not already enabled)

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. In the "Select app" dropdown, choose **Mail**
4. In the "Select device" dropdown, choose **Other (Custom name)**
5. Type: **YouTube Clone App**
6. Click **Generate**
7. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Your .env File

Add these lines to `backend/.env`:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM=YouTube Clone <your-email@gmail.com>
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the app password you generated (remove spaces)

### Step 4: Restart Your Backend

```bash
# Stop the backend (Ctrl+C)
# Start it again
cd backend
npm run dev
```

### Step 5: Test It!

1. Go to `http://localhost:5173/login`
2. Click "Forgot your password?"
3. Enter your email
4. Check your inbox for the reset email
5. Click the link in the email
6. Reset your password

---

## Alternative: Using Other Email Services

### SendGrid (Free Tier: 100 emails/day)

1. Sign up at https://sendgrid.com/
2. Create an API key
3. Update `.env`:

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### Mailgun (Free Tier: 5000 emails/month)

1. Sign up at https://www.mailgun.com/
2. Verify your domain or use sandbox
3. Get SMTP credentials
4. Update `.env`:

```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
EMAIL_FROM=noreply@yourdomain.com
```

### AWS SES (Very Cheap: $0.10 per 1000 emails)

1. Sign up for AWS
2. Verify your email in SES
3. Get SMTP credentials
4. Update `.env`:

```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-aws-smtp-username
EMAIL_PASS=your-aws-smtp-password
EMAIL_FROM=noreply@yourdomain.com
```

---

## Troubleshooting

### "Invalid login" or "Authentication failed"

**For Gmail:**
- Make sure 2FA is enabled
- Use App Password, not your regular password
- Remove spaces from the app password
- Try generating a new app password

### Email not received

1. **Check spam folder**
2. **Check backend console** for error messages
3. **Verify email credentials** in .env
4. **Test with a simple email:**

```javascript
// Test in backend console or create a test route
import { sendEmail } from './src/utils/sendEmail.js';

await sendEmail({
  to: 'your-email@gmail.com',
  subject: 'Test Email',
  html: '<h1>Test</h1><p>If you see this, email is working!</p>'
});
```

### "Less secure app access"

Gmail no longer supports "less secure apps". You MUST use:
- App Passwords (with 2FA enabled), OR
- OAuth2 (more complex setup)

### Rate limits

**Gmail:**
- 500 emails per day for free accounts
- 2000 emails per day for Google Workspace

**Solution:** Use SendGrid or Mailgun for production

---

## Development vs Production

### Development (Current Setup)
- Uses Gmail with App Password
- Good for testing
- Limited to 500 emails/day
- Emails might go to spam

### Production (Recommended)
- Use dedicated email service (SendGrid, Mailgun, AWS SES)
- Better deliverability
- Higher limits
- Professional sender reputation
- Email analytics

---

## Security Best Practices

### ✅ DO:
- Use App Passwords (not regular passwords)
- Store credentials in .env (never commit to git)
- Use different email for production
- Monitor email sending logs
- Set up SPF, DKIM, DMARC records (production)

### ❌ DON'T:
- Commit .env file to git
- Use personal email for production
- Share email credentials
- Use "less secure app access"
- Send emails without rate limiting

---

## Testing Checklist

- [ ] 2FA enabled on Gmail
- [ ] App Password generated
- [ ] .env file updated with credentials
- [ ] Backend restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox (check spam)
- [ ] Reset link works
- [ ] Password reset successful

---

## Quick Test Command

Add this to your backend for testing:

```javascript
// backend/src/routes/user.routes.js
router.route("/test-email").get(async (req, res) => {
  try {
    const { sendEmail } = await import('../utils/sendEmail.js');
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'Test Email from YouTube Clone',
      html: '<h1>Success!</h1><p>Email is configured correctly.</p>'
    });
    res.json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

Visit: `http://localhost:3000/api/v1/users/test-email`

---

## Need Help?

### Common Issues:

1. **"Username and Password not accepted"**
   - Solution: Use App Password, not regular password

2. **"Connection timeout"**
   - Solution: Check firewall, try port 465 with secure: true

3. **"Email goes to spam"**
   - Solution: Normal for development. Use dedicated service for production

4. **"Daily limit exceeded"**
   - Solution: Wait 24 hours or use different email service

### Still stuck?

Check the backend console for detailed error messages. The error will tell you exactly what's wrong.

---

**Status**: Ready to configure
**Time to setup**: 5-10 minutes
**Difficulty**: Easy 🟢
