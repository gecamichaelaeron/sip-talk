# 🚀 Quick Deployment Guide - SipTalk

## 3-Step Deployment to Production

### Prerequisites
- Docker installed
- Render.com account
- Netlify account
- GitHub repository ready

---

## 🐳 Step 1: Test Locally with Docker (5 minutes)

```bash
# 1. Copy environment template
cp env.template .env

# 2. Edit .env with your values
nano .env

# 3. Start everything
docker-compose up -d

# 4. Test
open http://localhost:8080
```

**Verify**: App runs on `http://localhost:8080`

---

## 🎯 Step 2: Deploy Backend to Render (10 minutes)

### A. Create PostgreSQL Database

1. Login to [render.com](https://render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - Name: `siptalk-postgres`
   - Database: `sip_talk_db`
   - Plan: `Free`
4. Click **"Create Database"**
5. **Copy connection string** (you'll need this!)

### B. Import Database Schema

```bash
# Replace with your connection string
psql postgresql://user:pass@host/db < database/sip_talk_postgres.sql
```

### C. Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository
3. Settings:
   - Name: `siptalk-api`
   - Runtime: `Docker`
   - Plan: `Free`
4. **Environment Variables**:
```
DB_HOST=your-render-postgres-host
DB_PORT=5432
DB_NAME=sip_talk_db
DB_USER=your-db-user
DB_PASSWORD=your-db-password
FRONTEND_URL=https://your-netlify-site.netlify.app
SESSION_SECRET=generate-random-32-chars
```

5. Click **"Create Web Service"**
6. **Save URL**: `https://siptalk-api.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Netlify (5 minutes)

### Deploy via Dashboard

1. Login to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import from Git"**
3. Select your GitHub repository
4. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Environment Variable**:
```
VITE_API_URL=https://siptalk-api.onrender.com/api
```

6. Click **"Deploy site"**
7. **Get URL**: `https://your-site-name.netlify.app`

### Update Backend CORS

Go back to Render → Environment Variables → Add:
```
FRONTEND_URL=https://your-site-name.netlify.app
```

Then redeploy the backend.

---

## ✅ Verification Checklist

- [ ] Docker runs locally
- [ ] PostgreSQL database created on Render
- [ ] Database schema imported
- [ ] Backend deployed to Render
- [ ] Backend health check passes: `/api/health.php`
- [ ] Frontend deployed to Netlify
- [ ] Frontend can reach backend API
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can make a reservation

---

## 🔗 Your Live URLs

```
Frontend: https://your-site-name.netlify.app
Backend:  https://siptalk-api.onrender.com
Health:   https://siptalk-api.onrender.com/api/health.php
```

---

## 🐛 Quick Fixes

### "Cannot connect to database"
```bash
# Check Render database is running
# Verify DB_HOST, DB_USER, DB_PASSWORD in Render environment
```

### "CORS Error"
```bash
# Update FRONTEND_URL in Render environment variables
# Redeploy backend service
```

### "Build failed on Netlify"
```bash
# Check build logs
# Verify VITE_API_URL is set
# Test build locally: npm run build
```

---

## 📚 Full Documentation

See `DEPLOYMENT_GUIDE.md` for complete details on:
- Docker configuration
- Environment variables
- Database migration
- Production checklist
- Troubleshooting

---

## 🎉 You're Live!

Congratulations! Your SipTalk Coffee Shop is now deployed to production!

**Share your app**: `https://your-site-name.netlify.app`

☕ Happy coding!

