# 🔐 Forgot Password Feature

## Overview
Complete password reset functionality has been implemented for your YouTube clone app.

## Features Implemented

### Backend (Node.js/Express)

#### 1. User Model Updates
**File**: `backend/src/models/user.model.js`

Added fields:
```javascript
passwordResetToken: String
passwordResetExpires: Date
```

Added method:
```javascript
generatePasswordResetToken() // Generates secure reset token
```

#### 2. Controllers
**File**: `backend/src/controllers/user.controller.js`

**`forgotPassword`**:
- Accepts email
- Generates reset token
- Saves hashed token to database
- Returns reset URL (for development)
- In production: Send email with reset link

**`resetPassword`**:
- Accepts token and new password
- Validates token and expiry
- Updates password
- Clears reset token

#### 3. Routes
**File**: `backend/src/routes/user.routes.js`

```javascript
POST /api/v1/users/forgot-password
POST /api/v1/users/reset-password/:token
```

Both routes have rate limiting (5 attempts per 15 minutes).

### Frontend (React)

#### 1. Forgot Password Page
**File**: `frontend/src/pages/ForgotPassword.jsx`

Features:
- Email input form
- Success/error messages
- Link back to login
- Responsive design
- YouTube-style UI

#### 2. Reset Password Page
**File**: `frontend/src/pages/ResetPassword.jsx`

Features:
- New password input
- Confirm password input
- Show/hide password toggle
- Password validation (min 6 characters)
- Success screen with auto-redirect
- Token validation
- Responsive design

#### 3. Login Page Update
**File**: `frontend/src/pages/Login.jsx`

Added "Forgot your password?" link below login button.

#### 4. Routes
**File**: `frontend/src/App.jsx`

```javascript
/forgot-password
/reset-password/:token
```

## How It Works

### User Flow

1. **User clicks "Forgot Password" on login page**
   - Redirects to `/forgot-password`

2. **User enters email**
   - Frontend sends POST to `/api/v1/users/forgot-password`
   - Backend generates token and saves to database
   - Backend returns reset URL (in development)
   - Success message shown

3. **User clicks reset link (from email)**
   - Link format: `http://localhost:5173/reset-password/{token}`
   - Opens reset password page

4. **User enters new password**
   - Frontend validates password
   - Sends POST to `/api/v1/users/reset-password/:token`
   - Backend validates token and expiry
   - Password updated
   - Success screen shown
   - Auto-redirect to login after 3 seconds

### Security Features

1. **Token Hashing**
   - Token is hashed before storing in database
   - Uses SHA-256 algorithm
   - Prevents token theft from database

2. **Token Expiry**
   - Tokens expire after 10 minutes
   - Expired tokens cannot be used

3. **Rate Limiting**
   - 5 attempts per 15 minutes per IP
   - Prevents brute force attacks

4. **No User Enumeration**
   - Same response whether email exists or not
   - Prevents attackers from discovering valid emails

5. **Password Validation**
   - Minimum 6 characters
   - Passwords must match
   - Client and server-side validation

## Testing

### Development Testing

1. **Test Forgot Password**:
```bash
curl -X POST http://localhost:3000/api/v1/users/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Response includes reset URL (for development):
```json
{
  "success": true,
  "data": {
    "resetToken": "abc123...",
    "resetUrl": "http://localhost:5173/reset-password/abc123..."
  },
  "message": "Password reset link has been sent to your email"
}
```

2. **Test Reset Password**:
```bash
curl -X POST http://localhost:3000/api/v1/users/reset-password/TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password":"newpassword123"}'
```

### Manual Testing

1. Go to `http://localhost:5173/login`
2. Click "Forgot your password?"
3. Enter email and submit
4. Check backend console for reset URL
5. Copy token from URL
6. Visit `http://localhost:5173/reset-password/{token}`
7. Enter new password
8. Verify success and redirect
9. Login with new password

## Production Setup

### 1. Add Email Service

Install nodemailer:
```bash
cd backend
npm install nodemailer
```

Create email utility (`backend/src/utils/sendEmail.js`):
```javascript
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
```

### 2. Update Environment Variables

Add to `backend/.env`:
```env
FRONTEND_URL=https://your-domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@your-domain.com
```

### 3. Update Controller

In `backend/src/controllers/user.controller.js`:
```javascript
import { sendEmail } from '../utils/sendEmail.js';

// In forgotPassword function:
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

await sendEmail({
  to: user.email,
  subject: 'Password Reset Request',
  html: `
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link expires in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `
});

// Remove resetToken and resetUrl from response
return res.status(200).json(
  new ApiResponse(200, {}, "Password reset link has been sent to your email")
);
```

### 4. Email Template (Optional)

Create a nice HTML email template:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      background: #3ea6ff; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 4px; 
      display: inline-block; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>You requested to reset your password.</p>
    <p>Click the button below to reset your password:</p>
    <a href="{{resetUrl}}" class="button">Reset Password</a>
    <p>Or copy this link: {{resetUrl}}</p>
    <p>This link expires in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>
```

## Email Service Options

### 1. Gmail (Development)
- Free
- Easy setup
- Use app-specific password
- Limited to 500 emails/day

### 2. SendGrid (Production)
- Free tier: 100 emails/day
- Reliable delivery
- Good documentation
- Easy integration

### 3. AWS SES (Production)
- Very cheap ($0.10 per 1000 emails)
- Highly scalable
- Requires AWS account
- More complex setup

### 4. Mailgun (Production)
- Free tier: 5000 emails/month
- Good for transactional emails
- Easy API

## Security Best Practices

### Implemented ✅
- [x] Token hashing
- [x] Token expiry (10 minutes)
- [x] Rate limiting
- [x] No user enumeration
- [x] Password validation
- [x] HTTPS in production (via secure cookies)

### Recommended 🔄
- [ ] Email verification before password reset
- [ ] Log password reset attempts
- [ ] Notify user via email when password is changed
- [ ] Add CAPTCHA after multiple failed attempts
- [ ] Implement account lockout after too many resets
- [ ] Add 2FA option

## Troubleshooting

### Token Invalid or Expired
- Tokens expire after 10 minutes
- Request new reset link
- Check system time is correct

### Email Not Received
- Check spam folder
- Verify email address is correct
- Check email service logs
- Ensure email service is configured

### Rate Limit Exceeded
- Wait 15 minutes
- Try from different IP
- Contact support if legitimate

## API Documentation

### Forgot Password
```
POST /api/v1/users/forgot-password
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "data": {},
  "message": "Password reset link has been sent to your email"
}

Errors:
- 400: Email is required
- 429: Too many requests
```

### Reset Password
```
POST /api/v1/users/reset-password/:token
Content-Type: application/json

Body:
{
  "password": "newpassword123"
}

Response (200):
{
  "success": true,
  "data": {},
  "message": "Password reset successful"
}

Errors:
- 400: Password is required / Invalid or expired token
- 400: Password must be at least 6 characters
```

## Files Modified/Created

### Backend
- ✅ `backend/src/models/user.model.js` - Added reset fields and method
- ✅ `backend/src/controllers/user.controller.js` - Added controllers
- ✅ `backend/src/routes/user.routes.js` - Added routes
- ✅ `backend/.env.example` - Added FRONTEND_URL

### Frontend
- ✅ `frontend/src/pages/ForgotPassword.jsx` - New page
- ✅ `frontend/src/pages/ResetPassword.jsx` - New page
- ✅ `frontend/src/pages/Login.jsx` - Added link
- ✅ `frontend/src/App.jsx` - Added routes

### Documentation
- ✅ `FORGOT-PASSWORD-FEATURE.md` - This file

## Next Steps

1. **Add Email Service** (Production)
   - Choose email provider
   - Configure credentials
   - Update controller to send emails

2. **Test Thoroughly**
   - Test with real email
   - Test token expiry
   - Test rate limiting
   - Test error cases

3. **Add Monitoring**
   - Log reset attempts
   - Monitor email delivery
   - Track success/failure rates

4. **Enhance Security**
   - Add email verification
   - Implement 2FA
   - Add CAPTCHA

---

**Status**: ✅ Feature Complete (Development)
**Production Ready**: ⚠️ Requires email service setup
**Last Updated**: November 19, 2024
