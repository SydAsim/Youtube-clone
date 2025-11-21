# Add Rewrite Rule on Render Dashboard

## Current Status
✅ Settings are correct
✅ Build is working
✅ Root (/) serves correctly
❌ /login returns 404 (redirects not working)

## The Missing Step

You need to manually add a Rewrite Rule in Render dashboard.

## Steps:

1. **Stay on the Settings page** (where you are now)

2. **Scroll down** to find "Redirects/Rewrites" section

3. **Click "Add Rule"** button

4. **Fill in the form:**
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```

5. **Click "Save"**

6. **Redeploy** (or wait for auto-deploy)

## Important Notes:

- Source must be: `/*` (with the slash)
- Action must be: "Rewrite" (not "Redirect")
- This tells Render to serve index.html for ALL routes

## After Adding Rule:

Test these URLs:
- https://youtube-clone-frontend-9y0g.onrender.com/login → Should work
- https://youtube-clone-frontend-9y0g.onrender.com/watch/123 → Should work
- Refresh on any page → Should work

## Why This is Needed:

Even though you have a `_redirects` file, Render Static Sites
require you to ALSO add the rule manually in the dashboard.

The `_redirects` file alone is not enough.
