# 🚀 Deployment Overview - SipTalk Coffee Shop

Welcome to the complete deployment solution for SipTalk! This project now supports multiple deployment strategies.

---

## 📦 What's Included

### Docker Configuration
- ✅ **Dockerfile** - Multi-stage build (Node.js + PHP + Apache)
- ✅ **docker-compose.yml** - Full stack orchestration (Web + PostgreSQL + pgAdmin)
- ✅ **.dockerignore** - Optimized build context

### Database
- ✅ **PostgreSQL Schema** - `database/sip_talk_postgres.sql`
- ✅ **MySQL Schema** - `database/sip_talk_db.sql` (original)
- ✅ **Migration Tools** - Automated conversion

### Deployment Platforms
- ✅ **Render.com** - Backend API hosting (render.yaml)
- ✅ **Netlify** - Frontend hosting (netlify.toml)
- ✅ **Docker** - Local/self-hosted deployment

### Configuration
- ✅ **Environment Template** - `env.template`
- ✅ **Health Checks** - `backend/health.php`
- ✅ **CORS Configuration** - Production-ready
- ✅ **Security Settings** - Hardened for production

### Documentation
- ✅ **DEPLOYMENT_GUIDE.md** - Comprehensive 50-page guide
- ✅ **DEPLOYMENT_QUICK_START.md** - Get running in 20 minutes
- ✅ **This file** - Overview and quick links

### Automation Scripts
- ✅ **scripts/deploy.sh** - Bash deployment helper (Linux/Mac)
- ✅ **scripts/deploy.ps1** - PowerShell deployment helper (Windows)

---

## 🎯 Quick Start Paths

### 1. Local Development with Docker (5 minutes)
```bash
# Windows
.\scripts\deploy.ps1

# Linux/Mac
./scripts/deploy.sh

# Or manually
docker-compose up -d
```
👉 **See**: `DEPLOYMENT_QUICK_START.md`

### 2. Production Deployment (20 minutes)
1. **Backend**: Deploy to Render.com
2. **Frontend**: Deploy to Netlify
3. **Database**: PostgreSQL on Render

👉 **See**: `DEPLOYMENT_QUICK_START.md` → Step 2 & 3

### 3. Full Manual Deployment
Complete control over every step

👉 **See**: `DEPLOYMENT_GUIDE.md`

---

## 📚 Documentation Index

| Document | Purpose | Time to Read |
|----------|---------|--------------|
| **README_DEPLOYMENT.md** | This file - Overview | 5 min |
| **DEPLOYMENT_QUICK_START.md** | Get deployed fast | 10 min |
| **DEPLOYMENT_GUIDE.md** | Complete reference | 30 min |
| **README.md** | Project overview | 5 min |
| **DATABASE_SETUP.md** | MySQL setup (local) | 15 min |

---

## 🛠️ Technology Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- React Router DOM
- CSS (custom styling)

### Backend
- PHP 8.2
- Apache 2.4
- PDO (PostgreSQL)
- RESTful API

### Database
- PostgreSQL 15 (production)
- MySQL 8 (development - optional)

### Infrastructure
- Docker & Docker Compose
- Render.com (backend hosting)
- Netlify (frontend hosting)

---

## 🌐 Deployment Targets

### Development
```
Frontend: http://localhost:3000 (Vite dev server)
Backend:  http://localhost:8080 (Docker)
Database: localhost:5432 (PostgreSQL in Docker)
```

### Production
```
Frontend: https://your-site.netlify.app
Backend:  https://your-app.onrender.com
Database: Managed PostgreSQL on Render
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

### Accounts Created
- [ ] GitHub account (free)
- [ ] Render.com account (free tier available)
- [ ] Netlify account (free tier available)

### Tools Installed
- [ ] Docker & Docker Compose
- [ ] Node.js 18+
- [ ] Git
- [ ] Text editor (VS Code recommended)

### Repository Setup
- [ ] Code pushed to GitHub
- [ ] `.gitignore` configured
- [ ] Environment variables template ready

---

## 🔒 Environment Variables

### Required for All Deployments

```env
# Database
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=sip_talk_db
DB_USER=your-username
DB_PASSWORD=your-secure-password

# Application
FRONTEND_URL=https://your-frontend-url
NODE_ENV=production

# Security (generate random strings)
SESSION_SECRET=32-char-random-string
JWT_SECRET=32-char-random-string
```

### Generate Secrets
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

---

## 🚀 Deployment Commands

### Docker
```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Clean reset
docker-compose down -v
```

### Render (via Git)
```bash
git add .
git commit -m "Deploy to production"
git push origin main
# Render auto-deploys on push
```

### Netlify (via Git)
```bash
git push origin main
# Netlify auto-deploys on push
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────┐
│           Users / Browsers                   │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌──────────────┐  ┌──────────────┐
│   Netlify    │  │   Render     │
│  (Frontend)  │  │  (Backend)   │
│              │  │              │
│  - React     │  │  - PHP API   │
│  - Static    │  │  - Apache    │
└──────────────┘  └──────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   Render DB   │
                  │  (PostgreSQL) │
                  └───────────────┘
```

---

## 🐛 Common Issues

### Docker won't start
```bash
# Check Docker is running
docker --version

# Restart Docker Desktop (Windows/Mac)
```

### Database connection fails
```bash
# Check environment variables
cat .env

# Check database is running
docker-compose ps
```

### Build fails
```bash
# Clear cache
docker-compose build --no-cache

# Check disk space
docker system df
```

---

## 📞 Support

### Documentation
- Full deployment guide: `DEPLOYMENT_GUIDE.md`
- Quick start: `DEPLOYMENT_QUICK_START.md`
- Database setup: `DATABASE_SETUP.md`

### External Resources
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)

---

## ✅ Post-Deployment

After successful deployment:

1. **Test all features**
   - User registration
   - Login/logout
   - Making reservations
   - Submitting feedback

2. **Set up monitoring**
   - Render dashboard
   - Netlify analytics
   - Database metrics

3. **Configure custom domain** (optional)
   - Add CNAME records
   - Enable SSL

4. **Enable backups**
   - Database backups on Render
   - Code versioning on GitHub

---

## 🎉 You're Ready!

Choose your deployment path and follow the guides. Your SipTalk Coffee Shop will be live in minutes!

**Quick Links:**
- 🏃 Fast track: `DEPLOYMENT_QUICK_START.md`
- 📖 Full guide: `DEPLOYMENT_GUIDE.md`
- 🐳 Docker: `docker-compose up -d`

**Happy Deploying! ☕🚀**

