# Quick Fix for Render 404 Issue

## The Problem
Getting 404 when refreshing or accessing routes directly on Render.

## The Solution

### Check Your Render Service Type

**IMPORTANT:** Your service MUST be a "Static Site", not a "Web Service"

1. Go to Render Dashboard
2. Check your frontend service
3. Look at the service type badge

**If it says "Web Service":**
- You need to recreate it as a "Static Site"
- Web Services don't support `_redirects` file properly

**If it says "Static Site":**
- Continue with configuration below

### Configure Render (Dashboard Method)

1. **Go to your Static Site settings**
2. **Scroll to "Redirects/Rewrites"**
3. **Click "Add Rule":**
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite` (not Redirect)
4. **Save and redeploy**

### Files Already Created

✅ `frontend/public/_redirects` - Will be copied to dist
✅ `frontend/render.yaml` - Render configuration

### Build Settings on Render

```
Build Command: npm install && npm run build
Publish Directory: dist
Root Directory: frontend (if monorepo)
```

### Environment Variables

```
VITE_API_URL=https://youtube-clone-n67u.onrender.com/api/v1/
```

## Test After Deploy

1. Visit `/login` directly - should work
2. Refresh on any page - should work
3. Share deep links - should work

## If Still Not Working

**Most likely cause:** Service is "Web Service" not "Static Site"

**Fix:** Create new Static Site service and delete old one
