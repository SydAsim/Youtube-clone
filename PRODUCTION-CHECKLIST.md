# 🚀 Production Deployment Checklist

## ⚠️ CRITICAL - Do Before Deploying

### 1. Security - Rotate All Secrets ✅
```bash
cd backend
node generate-secrets.js
```

- [ ] Generate new JWT secrets (ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET)
- [ ] Create new MongoDB user with strong password
- [ ] Regenerate Cloudinary API keys
- [ ] Update all secrets in production environment variables
- [ ] **NEVER** use the exposed secrets from your current `.env`

### 2. Environment Configuration
- [ ] Set `NODE_ENV=production` in production
- [ ] Update `CORS_ORIGIN` to your production frontend URL
- [ ] Set proper `PORT` (usually 3000 or from environment)
- [ ] Verify all environment variables are set

### 3. Database
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Database backups enabled
- [ ] Connection string uses production credentials
- [ ] Test database connection

### 4. Frontend Build
```bash
cd frontend
npm run build
```
- [ ] Build completes without errors
- [ ] Test the build locally: `npm run preview`
- [ ] Update `VITE_API_URL` to production backend URL

## 📋 Pre-Deployment Tests

### Backend Tests
```bash
cd backend
npm run dev
```

- [ ] Server starts without errors
- [ ] All routes respond correctly
- [ ] Rate limiting works (test login 6 times)
- [ ] File uploads work
- [ ] Authentication flow works
- [ ] Search functionality works

### Frontend Tests
```bash
cd frontend
npm run dev
```

- [ ] App loads without errors
- [ ] Login/Register works
- [ ] Video upload works
- [ ] Search works
- [ ] All pages accessible
- [ ] No console errors

## 🔒 Security Verification

- [x] Rate limiting enabled
- [x] Input sanitization implemented
- [x] Secure cookies configured
- [x] CORS properly configured
- [ ] HTTPS enabled (production only)
- [ ] Secrets rotated
- [ ] `.env` not in git
- [ ] Security headers added (recommended: helmet)

## 📦 Recommended Production Enhancements

### Install Helmet for Security Headers
```bash
cd backend
npm install helmet
```

Add to `backend/src/app.js`:
```javascript
import helmet from 'helmet';
app.use(helmet());
```

### Install Compression
```bash
npm install compression
```

Add to `backend/src/app.js`:
```javascript
import compression from 'compression';
app.use(compression());
```

### Install Morgan for Logging
```bash
npm install morgan
```

Add to `backend/src/app.js`:
```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

## 🌐 Deployment Options

### Option 1: Deploy to Render (Recommended - Free Tier)

#### Backend on Render
1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Add all variables from `.env`
5. Deploy

#### Frontend on Render
1. New → Static Site
2. Connect your GitHub repo
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment**: `VITE_API_URL=https://your-backend.onrender.com/api/v1`
4. Deploy

### Option 2: Deploy to Railway

#### Backend
1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select backend folder
4. Add environment variables
5. Deploy

#### Frontend
1. New Project → Deploy from GitHub
2. Select frontend folder
3. Add `VITE_API_URL` environment variable
4. Deploy

### Option 3: Deploy to Vercel + Railway

#### Backend on Railway
Same as Option 2

#### Frontend on Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. `cd frontend`
3. `vercel`
4. Follow prompts
5. Set environment variable: `VITE_API_URL`

### Option 4: VPS (DigitalOcean, AWS, etc.)

#### Requirements
- Ubuntu 20.04+ server
- Node.js 18+
- Nginx
- PM2
- SSL certificate (Let's Encrypt)

#### Setup Script
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone your repo
git clone your-repo-url
cd your-repo

# Backend setup
cd backend
npm install
pm2 start index.js --name youtube-backend

# Frontend setup
cd ../frontend
npm install
npm run build

# Install Nginx
sudo apt install nginx

# Configure Nginx (see below)
```

## 🔧 Production Environment Variables

### Backend `.env` (Production)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://prod_user:NEW_PASSWORD@cluster.mongodb.net/youtubeClone
CORS_ORIGIN=https://your-frontend-domain.com

ACCESS_TOKEN_SECRET=NEW_SECRET_HERE
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=NEW_SECRET_HERE
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=NEW_SECRET_HERE
```

### Frontend `.env` (Production)
```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

## 📊 Post-Deployment Monitoring

### Things to Monitor
- [ ] Server uptime
- [ ] API response times
- [ ] Error rates
- [ ] Database performance
- [ ] Storage usage (Cloudinary)
- [ ] Rate limit hits

### Recommended Tools
- **Uptime**: UptimeRobot (free)
- **Errors**: Sentry (free tier)
- **Analytics**: Google Analytics
- **Logs**: Papertrail, Logtail

## 🐛 Common Production Issues

### Issue: CORS Errors
**Solution**: Update `CORS_ORIGIN` in backend `.env` to include production frontend URL

### Issue: Cookies Not Working
**Solution**: 
- Ensure `secure: true` in production
- Frontend and backend must be on same domain or use proper CORS
- Check `sameSite` setting

### Issue: File Uploads Fail
**Solution**:
- Verify Cloudinary credentials
- Check file size limits
- Ensure temp folder exists and is writable

### Issue: Database Connection Fails
**Solution**:
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Verify connection string
- Check network connectivity

## 📝 Final Checklist

Before going live:
- [ ] All secrets rotated
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Frontend built and tested
- [ ] Backend tested
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] README updated with production URLs

## 🎉 You're Ready!

Once all items are checked, your YouTube clone is production-ready!

### Quick Deploy Commands

**Backend (if using PM2)**
```bash
cd backend
npm install
pm2 start index.js --name youtube-backend
pm2 save
pm2 startup
```

**Frontend (build)**
```bash
cd frontend
npm install
npm run build
# Upload dist/ folder to your hosting
```

---

**Need Help?** Refer to:
- `SECURITY.md` - Security guidelines
- `SECURITY-QUICK-START.md` - Quick security fixes
- Platform-specific documentation (Render, Railway, Vercel)

Good luck with your deployment! 🚀
