# Production Deployment Guide

This guide covers deploying your YouTube Clone application to production.

## Prerequisites

- Domain name with SSL/HTTPS configured
- Node.js hosting environment (e.g., AWS EC2, DigitalOcean, Render, Railway)
- MongoDB Atlas or managed MongoDB instance
- Cloud storage for video files (AWS S3, Cloudinary, etc.)

---

## 1. Environment Configuration

### Backend Environment Variables

Create a `.env` file in `/backend` with production values:

```env
NODE_ENV=production
PORT=8000

# Database
MONGODB_URI=your_production_mongodb_uri

# JWT Secrets (use strong, random strings)
ACCESS_TOKEN_SECRET=your_production_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_production_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# CORS (your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend Environment Variables

Create `.env.production` in `/frontend`:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 2. Backend Deployment

### Pre-Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment variables
- [ ] Update cookie settings to use environment-aware secure flag
- [ ] Enable CORS for your production frontend domain
- [ ] Use strong, unique secrets for JWT tokens
- [ ] Set up MongoDB Atlas with IP whitelist and strong password
- [ ] Configure cloud storage (Cloudinary/S3) for video uploads
- [ ] Enable rate limiting and request validation
- [ ] Set up logging (Winston, Morgan)
- [ ] Remove or secure any debug endpoints

### Cookie Configuration

Ensure your cookie options use environment-aware settings:

```javascript
const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false in dev, true in prod
    sameSite: "strict"
}
```

This ensures:
- **Development**: Cookies work over HTTP (localhost)
- **Production**: Cookies are sent only over HTTPS (secure)

### Deployment Steps

1. **Build & Install Dependencies**
   ```bash
   cd backend
   npm ci --production
   ```

2. **Start with Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name youtube-backend
   pm2 startup
   pm2 save
   ```

3. **Set up Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Platform-Specific Deployments

#### Render / Railway / Heroku
- Connect your GitHub repository
- Set environment variables in dashboard
- Set build command: `npm install`
- Set start command: `npm start`

#### AWS EC2 / DigitalOcean
- Use PM2 for process management
- Configure Nginx as reverse proxy
- Set up SSL with Certbot
- Configure firewall rules

---

## 3. Frontend Deployment

### Build for Production

```bash
cd frontend
npm install
npm run build
```

This creates an optimized `/dist` folder.

### Deployment Options

#### Option 1: Vercel (Recommended for React)
```bash
npm install -g vercel
vercel --prod
```

#### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option 3: Static Hosting (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/youtube-clone/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 4. Database Setup

### MongoDB Atlas

1. Create a production cluster
2. Configure Network Access:
   - Add your backend server's IP
   - Or use `0.0.0.0/0` with strong authentication
3. Create database user with strong password
4. Get connection string and add to backend `.env`

### Indexes (Performance)

Create indexes for frequently queried fields:

```javascript
// User collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

// Video collection
db.videos.createIndex({ owner: 1 })
db.videos.createIndex({ createdAt: -1 })
```

---

## 5. Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] Environment variables stored securely (not in code)
- [ ] Strong JWT secrets (min 32 characters, random)
- [ ] Cookie `httpOnly`, `secure`, and `sameSite` flags enabled
- [ ] CORS configured for specific domain (not `*`)
- [ ] Rate limiting on auth endpoints
- [ ] Input validation and sanitization
- [ ] MongoDB connection string secured
- [ ] File upload size limits enforced
- [ ] Helmet.js middleware added for security headers
- [ ] SQL injection / NoSQL injection prevention
- [ ] XSS protection enabled

---

## 6. Monitoring & Logging

### Application Monitoring

Use PM2 monitoring:
```bash
pm2 monit
pm2 logs youtube-backend
```

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- New Relic / DataDog for APM

### Health Checks

Add a health check endpoint:

```javascript
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() })
})
```

---

## 7. Performance Optimization

### Backend
- Enable gzip compression
- Implement Redis caching for frequent queries
- Use CDN for static assets
- Optimize database queries with indexes
- Implement pagination for large datasets

### Frontend
- Code splitting with lazy loading
- Image optimization and lazy loading
- CDN for static assets
- Service worker for offline support
- Bundle size optimization

---

## 8. CI/CD Pipeline (Optional)

### GitHub Actions Example

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install & Build
        run: |
          cd backend
          npm ci
      - name: Deploy to Server
        run: |
          # Your deployment commands
```

---

## 9. Backup Strategy

- **Database**: Set up automated MongoDB Atlas backups
- **Media Files**: Cloud storage automatically handles redundancy
- **Code**: Keep production branch protected on GitHub

---

## 10. Rollback Plan

1. Keep previous PM2 deployment
2. Use Git tags for releases
3. Database migration rollback scripts
4. Cloudflare/CDN cache purge if needed

---

## Common Issues & Solutions

### Issue: Cookies not working after deployment
**Solution**: Ensure `secure: process.env.NODE_ENV === "production"` is set and HTTPS is enabled

### Issue: CORS errors in production
**Solution**: Set `CORS_ORIGIN` to your exact frontend domain (including https://)

### Issue: MongoDB connection timeout
**Solution**: Whitelist backend server IP in MongoDB Atlas Network Access

### Issue: 502 Bad Gateway
**Solution**: Check if backend is running (`pm2 status`), verify Nginx proxy configuration

---

## Post-Deployment Testing

- [ ] User registration and login
- [ ] Video upload and playback
- [ ] Cookie persistence across refresh
- [ ] API response times (< 200ms ideal)
- [ ] Mobile responsiveness
- [ ] Different browsers (Chrome, Firefox, Safari)
- [ ] Load testing with multiple concurrent users

---

## Useful Commands

```bash
# Check backend logs
pm2 logs youtube-backend

# Restart backend
pm2 restart youtube-backend

# Monitor resources
pm2 monit

# Check Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Support & Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt SSL](https://letsencrypt.org/getting-started/)

---

**Last Updated**: Nov 2025
