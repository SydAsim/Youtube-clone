# 🔧 Production Authentication Fix

## Problem
Users getting logged out on page refresh in production.

## Root Cause
Cross-domain cookie issues when frontend and backend are on different domains.

## ✅ Fixes Applied

### 1. Cookie Settings Updated
```javascript
sameSite: 'none' // Required for cross-domain cookies in production
secure: true      // Required when sameSite is 'none'
path: '/'         // Ensure cookie is available on all paths
```

### 2. CORS Configuration Enhanced
- Added explicit methods and headers
- Proper credentials handling
- Origin validation improved

## 🚀 Production Deployment Checklist

### Backend Environment Variables

Add to your production backend `.env`:

```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

**Important:** Replace `your-frontend-domain.com` with your actual frontend URL.

### Frontend Environment Variables

Add to your production frontend `.env`:

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

**Important:** Replace `your-backend-domain.com` with your actual backend URL.

## 🔍 Common Deployment Scenarios

### Scenario 1: Same Domain (Recommended)
**Example:**
- Frontend: `https://myapp.com`
- Backend: `https://myapp.com/api` or `https://api.myapp.com`

**Cookie Settings:**
```javascript
sameSite: 'lax' or 'strict' // More secure
secure: true
```

**CORS:** Not needed if truly same domain

### Scenario 2: Different Domains (Current Setup)
**Example:**
- Frontend: `https://myapp.vercel.app`
- Backend: `https://myapp.onrender.com`

**Cookie Settings:**
```javascript
sameSite: 'none' // Required for cross-domain
secure: true     // Required with sameSite: none
```

**CORS:** Must be configured (already done ✅)

### Scenario 3: Subdomain
**Example:**
- Frontend: `https://app.myapp.com`
- Backend: `https://api.myapp.com`

**Cookie Settings:**
```javascript
sameSite: 'lax'
secure: true
domain: '.myapp.com' // Share cookies across subdomains
```

## 🧪 Testing in Production

### 1. Test Login
```bash
# Open browser DevTools → Application → Cookies
# After login, check for:
- accessToken cookie
- refreshToken cookie
- Both should have:
  ✅ HttpOnly: true
  ✅ Secure: true
  ✅ SameSite: None (or Lax)
  ✅ Path: /
```

### 2. Test Refresh
1. Login to your app
2. Refresh the page (F5)
3. You should stay logged in ✅

### 3. Test Browser Restart
1. Login to your app
2. Close browser completely
3. Open browser and go to your app
4. You should stay logged in ✅

## 🐛 Troubleshooting

### Issue: Still logging out on refresh

**Check 1: Cookie Domain**
```javascript
// If frontend and backend are on different domains:
// Make sure CORS_ORIGIN includes your frontend URL
CORS_ORIGIN=https://your-frontend.com
```

**Check 2: HTTPS**
```javascript
// Both frontend and backend MUST use HTTPS in production
// sameSite: 'none' requires secure: true
// secure: true requires HTTPS
```

**Check 3: Browser Console**
```javascript
// Check for errors:
- "Cookie blocked by browser"
- "SameSite attribute"
- "Secure attribute"
```

**Check 4: Network Tab**
```javascript
// Check Set-Cookie headers in response:
Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=None; Path=/
```

### Issue: Cookies not being sent

**Solution 1: Check axios configuration**
```javascript
// In frontend/src/services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✅ Must be true
});
```

**Solution 2: Check CORS**
```javascript
// Backend must have:
credentials: true // ✅ In CORS config
```

### Issue: "Cookie blocked by browser"

**Cause:** Third-party cookie blocking

**Solutions:**
1. **Best:** Deploy on same domain/subdomain
2. **Alternative:** Use Authorization header instead of cookies
3. **Workaround:** Ask users to allow third-party cookies (not recommended)

## 🔐 Security Considerations

### Current Setup (Secure ✅)
- ✅ HttpOnly cookies (prevents XSS)
- ✅ Secure flag (HTTPS only)
- ✅ SameSite protection
- ✅ CORS configured
- ✅ Token expiry set

### Additional Recommendations
- [ ] Add rate limiting (already done ✅)
- [ ] Add CSRF tokens (optional with SameSite)
- [ ] Monitor failed login attempts
- [ ] Add session timeout
- [ ] Implement refresh token rotation

## 📝 Alternative: Token in localStorage

If cookies continue to cause issues, you can use localStorage:

### Pros:
- ✅ No cross-domain issues
- ✅ Works everywhere
- ✅ Simpler setup

### Cons:
- ❌ Vulnerable to XSS attacks
- ❌ Not as secure as HttpOnly cookies
- ❌ Requires manual token management

### Implementation:
```javascript
// On login
localStorage.setItem('accessToken', token);

// On request
headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }

// On logout
localStorage.removeItem('accessToken');
```

## 🎯 Recommended Solution

**For Production:**

1. **Best Option:** Deploy frontend and backend on same domain
   - Example: `myapp.com` (frontend) and `myapp.com/api` (backend)
   - Or: `app.myapp.com` and `api.myapp.com`

2. **Current Option:** Cross-domain with SameSite: none
   - Already configured ✅
   - Works but less secure
   - Some browsers may block

3. **Fallback:** Use Authorization headers with localStorage
   - Most compatible
   - Less secure
   - Requires code changes

## 📞 Need Help?

If still having issues:

1. Check browser console for errors
2. Check Network tab → Response headers
3. Verify environment variables are set
4. Test with different browsers
5. Check if HTTPS is enabled on both domains

---

**Status:** ✅ Fixed
**Last Updated:** November 20, 2024
**Tested:** Development ✅ | Production ⏳ (needs testing)
