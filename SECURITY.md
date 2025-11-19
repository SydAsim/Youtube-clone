# Security Guidelines

## 🔒 Security Improvements Implemented

### 1. Rate Limiting
- **Login/Register**: 5 attempts per 15 minutes per IP
- **Video Upload**: 10 uploads per hour per IP
- **General API**: 100 requests per 15 minutes per IP

### 2. Input Sanitization
- Search queries are sanitized to prevent NoSQL injection
- Special characters and MongoDB operators are escaped
- Query length is limited to 100 characters

### 3. Cookie Security
- `httpOnly`: Prevents XSS attacks from accessing cookies
- `secure`: Only sent over HTTPS in production
- `sameSite: 'strict'`: Prevents CSRF attacks
- Proper expiry times set

### 4. Authentication
- JWT tokens with secure secrets
- Refresh token rotation
- Password hashing with bcrypt (10 rounds)
- Token expiry: Access (1 day), Refresh (10 days)

### 5. CORS Configuration
- Whitelist of allowed origins
- Credentials enabled for authenticated requests
- Development mode allows all origins

## ⚠️ CRITICAL: Before Deploying to Production

### 1. Rotate All Secrets
Your current `.env` file has exposed credentials. Generate new ones:

```bash
# Generate new JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**What to rotate:**
- [ ] MongoDB password (create new user in MongoDB Atlas)
- [ ] ACCESS_TOKEN_SECRET
- [ ] REFRESH_TOKEN_SECRET
- [ ] Cloudinary API keys (regenerate in Cloudinary dashboard)

### 2. Environment Variables
- Never commit `.env` file to git
- Use `.env.example` as template
- Set `NODE_ENV=production` in production

### 3. MongoDB Security
- [ ] Enable IP whitelist in MongoDB Atlas
- [ ] Use strong password (20+ characters)
- [ ] Create separate users for dev/prod
- [ ] Enable audit logging

### 4. Additional Security Measures

#### Install Helmet (Recommended)
```bash
npm install helmet
```

Add to `backend/src/app.js`:
```javascript
import helmet from 'helmet';
app.use(helmet());
```

#### Install Express Rate Limit (Production)
For production, use Redis-based rate limiting:
```bash
npm install express-rate-limit rate-limit-redis redis
```

#### Enable HTTPS
- Use SSL/TLS certificates
- Redirect HTTP to HTTPS
- Set `secure: true` for cookies

#### Input Validation
- Validate all user inputs
- Use libraries like `joi` or `express-validator`
- Sanitize HTML content

#### File Upload Security
- Validate file types and sizes
- Scan for malware
- Use signed URLs for Cloudinary
- Limit upload frequency

## 🛡️ Security Checklist

### Backend
- [x] Rate limiting on auth endpoints
- [x] Rate limiting on upload endpoints
- [x] Input sanitization for search
- [x] Secure cookie configuration
- [x] Password hashing
- [x] JWT token validation
- [x] CORS configuration
- [ ] Helmet security headers (recommended)
- [ ] Request size limits (already set: 16kb JSON, 20kb URL)
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

### Frontend
- [ ] Sanitize user-generated content before rendering
- [ ] Validate inputs client-side
- [ ] Don't expose sensitive data in console logs
- [ ] Use HTTPS in production
- [ ] Implement CSP (Content Security Policy)

### Infrastructure
- [ ] Use environment variables for secrets
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Backup database regularly
- [ ] Use CDN for static assets

## 🚨 Known Vulnerabilities to Fix

### High Priority
1. **Exposed Credentials**: Rotate all secrets in `.env`
2. **No Helmet**: Add helmet for security headers
3. **File Upload**: Add file type validation and size limits
4. **No CSRF Protection**: Add CSRF tokens for state-changing operations

### Medium Priority
1. **Email Verification**: Add email verification for registration
2. **Password Reset**: Implement secure password reset flow
3. **2FA**: Add two-factor authentication option
4. **Session Management**: Implement session invalidation on password change
5. **Audit Logging**: Log security-relevant events

### Low Priority
1. **Brute Force**: Add CAPTCHA after failed attempts
2. **Account Lockout**: Lock account after multiple failed logins
3. **IP Blocking**: Block suspicious IPs
4. **Honeypot Fields**: Add honeypot fields to forms

## 📝 Security Best Practices

### For Developers
1. Never commit secrets to git
2. Use `.gitignore` for sensitive files
3. Review code for security issues
4. Keep dependencies updated
5. Use security linters (eslint-plugin-security)

### For Users
1. Use strong passwords (12+ characters)
2. Don't reuse passwords
3. Enable 2FA when available
4. Log out from shared devices
5. Report suspicious activity

## 🔍 Security Testing

### Manual Testing
- Test rate limiting by making multiple requests
- Try SQL/NoSQL injection in search
- Test XSS in comments and descriptions
- Verify CORS restrictions
- Check cookie security flags

### Automated Testing
```bash
# Install security audit tools
npm audit
npm audit fix

# Check for vulnerabilities
npx snyk test
```

## 📞 Reporting Security Issues

If you discover a security vulnerability, please email:
- **Email**: [your-email]@example.com
- **Response Time**: Within 48 hours

**Do not** create public GitHub issues for security vulnerabilities.

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Last Updated**: November 19, 2025
**Security Version**: 1.0
