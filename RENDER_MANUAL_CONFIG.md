# Render Manual Configuration Guide

## 🚨 The Real Problem

Your Render service is likely configured incorrectly. Here's how to fix it step by step.

## Step 1: Check Current Configuration

1. Go to https://dashboard.render.com
2. Find your frontend service: `youtube-clone-frontend`
3. Click on it

### Check These Settings:

**Service Type:**
- Should be: **Static Site** ✅
- If it says "Web Service": ❌ WRONG - Need to recreate

**Root Directory:**
- Should be: `frontend` ✅
- If blank or wrong: ❌ This is your problem!

**Build Command:**
- Should be: `npm install && npm run build` ✅

**Publish Directory:**
- Should be: `dist` ✅
- NOT `frontend/dist` (because root is already `frontend`)

## Step 2: Fix the Configuration

### Option A: Update Existing Service (If Static Site)

1. **Go to Settings**
2. **Update these fields:**
   ```
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
3. **Scroll to "Redirects/Rewrites"**
4. **Click "Add Rule":**
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```
5. **Save Changes**
6. **Click "Manual Deploy" → "Clear build cache & deploy"**

### Option B: Create New Static Site (If Web Service)

If your service is a "Web Service", you MUST recreate it:

1. **Click "New +" → "Static Site"**
2. **Connect to your GitHub repository**
3. **Configure:**
   ```
   Name: youtube-clone-frontend
   Branch: main (or your branch)
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. **Add Environment Variable:**
   ```
   Key: VITE_API_URL
   Value: https://youtube-clone-n67u.onrender.com/api/v1/
   ```
5. **After creation, go to Settings → Redirects/Rewrites**
6. **Add Rule:**
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```
7. **Deploy**

## Step 3: Verify Build Output

After deployment, check the logs:

**Should see:**
```
✓ 1650 modules transformed.
dist/index.html
dist/assets/...
dist/_redirects  ← This file should be here!
✓ built in X.XXs
```

**If you don't see `dist/_redirects`:**
- The file isn't being copied
- Check that `frontend/public/_redirects` exists in your repo

## Step 4: Test

After successful deployment:

1. **Visit:** `https://youtube-clone-frontend-9y0g.onrender.com/`
   - Should work ✅

2. **Visit:** `https://youtube-clone-frontend-9y0g.onrender.com/login`
   - Should show login page ✅
   - NOT "Route not found" ❌

3. **Refresh on any page:**
   - Should stay on same page ✅

## Common Issues and Solutions

### Issue 1: "Route not found" on /login

**Cause:** Render is not serving `index.html` for all routes

**Fix:**
1. Check "Redirects/Rewrites" in Render settings
2. Must have rule: `/*` → `/index.html` (Rewrite)
3. If missing, add it and redeploy

### Issue 2: Still getting 404

**Cause:** Service type is "Web Service" not "Static Site"

**Fix:**
- Web Services don't support `_redirects` properly
- Must recreate as Static Site

### Issue 3: Build succeeds but routes don't work

**Cause:** Wrong publish directory or root directory

**Fix:**
```
Root Directory: frontend  ← Must be set!
Publish Directory: dist   ← Relative to root directory
```

### Issue 4: _redirects file not in build output

**Cause:** File is in wrong location

**Fix:**
- Must be in: `frontend/public/_redirects`
- Vite copies `public/` to `dist/` automatically
- Check your repo has this file

## Debugging Checklist

### In Your Local Repo:

```bash
# Check file exists
ls frontend/public/_redirects  # Should exist

# Check content
cat frontend/public/_redirects  # Should show: /*    /index.html    200

# Build locally
cd frontend
npm run build

# Check build output
ls dist/_redirects  # Should exist in dist after build
```

### In Render Dashboard:

- [ ] Service type is "Static Site"
- [ ] Root directory is `frontend`
- [ ] Build command is `npm install && npm run build`
- [ ] Publish directory is `dist`
- [ ] Rewrite rule exists: `/*` → `/index.html`
- [ ] Environment variable `VITE_API_URL` is set

### In Render Logs:

- [ ] Build completes successfully
- [ ] See `dist/_redirects` in build output
- [ ] No errors about missing files
- [ ] Deploy completes successfully

## The Nuclear Option

If nothing works, do this:

1. **Delete the existing frontend service**
2. **Create a brand new Static Site:**
   - New + → Static Site
   - Connect to GitHub
   - Branch: main
   - **Root Directory: `frontend`** ← CRITICAL!
   - Build: `npm install && npm run build`
   - Publish: `dist`
3. **Add environment variables**
4. **Add rewrite rule after creation**
5. **Deploy**

## Expected Result

After correct configuration:

```
✅ https://your-app.onrender.com/ → Works
✅ https://your-app.onrender.com/login → Works
✅ https://your-app.onrender.com/watch/123 → Works
✅ Refresh on any page → Works
✅ Direct URL access → Works
```

## Still Not Working?

### Check These:

1. **Is the service actually deployed?**
   - Check deployment status in dashboard
   - Should say "Live" with green dot

2. **Is the correct branch deployed?**
   - Check which branch is connected
   - Make sure your changes are pushed to that branch

3. **Are there build errors?**
   - Check the "Logs" tab
   - Look for any red error messages

4. **Is the domain correct?**
   - Check the URL in Render dashboard
   - Make sure you're visiting the right URL

### Contact Render Support

If you've tried everything:

1. Go to Render dashboard
2. Click "Help" → "Contact Support"
3. Provide:
   - Service name
   - Build logs
   - Screenshot of settings
   - Description: "SPA routing not working, getting 404 on refresh"

## Key Takeaway

**The most common issue:** Root Directory not set to `frontend`

When you have a monorepo structure:
```
your-repo/
├── frontend/    ← Root Directory should point here
│   ├── dist/    ← Publish Directory is relative to root
│   └── public/
│       └── _redirects
└── backend/
```

Render needs to know to look in the `frontend` folder!

---

**After fixing configuration, commit and push:**
```bash
git add .
git commit -m "Add Render configuration"
git push
```

Then manually deploy or wait for auto-deploy.
