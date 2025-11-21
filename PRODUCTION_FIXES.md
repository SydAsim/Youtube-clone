# Production 400 Error Fixes

## Issues Fixed

### ✅ 1. Frontend - Removed js-cookie Token Reading
**File:** `frontend/src/services/api.js`
- **Removed:** Manual reading of `accessToken` from cookies using `js-cookie`
- **Reason:** httpOnly cookies cannot be read by JavaScript (security feature)
- **Fix:** Browser automatically sends httpOnly cookies with `withCredentials: true`

### ✅ 2. Frontend - Fixed Refresh Token Request
**File:** `frontend/src/services/api.js`
- **Changed:** Refresh token request to use `api` instance instead of manual URL
- **Removed:** Manual `refreshToken` parameter (sent automatically via httpOnly cookie)

### ✅ 3. Frontend - Created Production Environment File
**File:** `frontend/.env.production`
- **Added:** `VITE_API_URL=https://youtube-clone-n67u.onrender.com/api/v1/`
- **Reason:** Frontend was using localhost URL in production

### ✅ 4. Backend - Fixed Cookie Settings
**Files:** `backend/src/controllers/user.controller.js`
- **Changed:** All cookie settings to use:
  ```javascript
  {
    httpOnly: true,
    secure: true,        // Always true (was conditional)
    sameSite: 'none',    // Required for cross-domain (was conditional)
    maxAge: ...,
    path: '/'
  }
  ```
- **Applied to:** `loginUser`, `logoutUser`, `refreshAccessToken`

### ✅ 5. Backend - Simplified CORS Configuration
**File:** `backend/src/app.js`
- **Changed:** From complex dynamic origin checking to simple:
  ```javascript
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  ```
- **Reason:** Dynamic logic was sometimes blocking valid requests

### ✅ 6. Backend - Fixed Auth Middleware Error Codes
**File:** `backend/src/middlewares/auth.middleware.js`
- **Changed:** All authentication errors from 400 to 401
- **Added:** Specific error messages for different JWT errors

## Environment Variables Required

### Backend (Render)
```env
CORS_ORIGIN=https://youtube-clone-frontend-9y0g.onrender.com
NODE_ENV=production
```

### Frontend (Render)
The `.env.production` file will be used automatically during build.

## Deployment Steps

1. **Backend:**
   - Set `CORS_ORIGIN` environment variable in Render dashboard
   - Redeploy backend service

2. **Frontend:**
   - Rebuild: `npm run build`
   - Redeploy frontend service

3. **Database:**
   - Run migration script to fix HTTP URLs:
     ```bash
     cd backend
     npm run fix-urls
     ```

## How Authentication Works Now

1. **Login:**
   - Backend sets httpOnly cookies with `secure=true` and `sameSite=none`
   - Frontend receives cookies (cannot read them via JavaScript)

2. **Authenticated Requests:**
   - Frontend makes request with `withCredentials: true`
   - Browser automatically sends httpOnly cookies
   - Backend reads token from `req.cookies.accessToken`

3. **Token Refresh:**
   - On 401 error, frontend calls refresh endpoint
   - Refresh token sent automatically via httpOnly cookie
   - Backend returns new tokens as httpOnly cookies

## Testing

After deployment, verify:
- [ ] Login works and sets cookies
- [ ] Protected routes work (likes, subscriptions, etc.)
- [ ] Token refresh works on 401 errors
- [ ] No mixed content warnings
- [ ] No CORS errors in console
