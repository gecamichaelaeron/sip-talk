# 🚀 Complete Deployment Guide - SipTalk Coffee Shop

This comprehensive guide covers all deployment options: Docker, Render.com, and Netlify.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Docker Deployment](#local-docker-deployment)
4. [Render.com Deployment (Backend)](#rendercom-deployment)
5. [Netlify Deployment (Frontend)](#netlify-deployment)
6. [Database Migration (MySQL to PostgreSQL)](#database-migration)
7. [Production Checklist](#production-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- ✅ **Git** - Version control
- ✅ **Docker** & **Docker Compose** - For containerization
- ✅ **Node.js** 18+ - For building frontend
- ✅ **GitHub Account** - For version control
- ✅ **Render.com Account** - For backend deployment
- ✅ **Netlify Account** - For frontend deployment

### Optional Tools
- pgAdmin - PostgreSQL database management
- Postman - API testing

---

## Environment Configuration

### Step 1: Create Environment File

```bash
# Copy the template
cp env.template .env

# Edit the .env file with your values
nano .env
```

### Step 2: Required Environment Variables

```env
# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sip_talk_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Application
APP_PORT=8080
NODE_ENV=production
FRONTEND_URL=http://localhost:3000

# API
API_BASE_URL=http://localhost:8080/api
CORS_ORIGIN=http://localhost:3000

# Security (Generate random strings)
SESSION_SECRET=generate_random_32_char_string
JWT_SECRET=generate_random_32_char_string
```

### Generate Secure Secrets

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Local Docker Deployment

### Option 1: Quick Start (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/gecamichaelaeron/sip-talk.git
cd sip-talk

# 2. Create .env file
cp env.template .env
# Edit .env with your values

# 3. Start all services
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

**Access Points:**
- Frontend + Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
- pgAdmin (dev): `http://localhost:5050`

### Option 2: Build and Run Manually

```bash
# Build Docker image
docker build -t siptalk-app .

# Run with environment variables
docker run -d \
  --name siptalk \
  -p 8080:80 \
  --env-file .env \
  siptalk-app
```

### Docker Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v

# Rebuild services
docker-compose up -d --build

# View logs for specific service
docker-compose logs -f web

# Access database
docker-compose exec postgres psql -U postgres -d sip_talk_db

# Restart service
docker-compose restart web
```

---

## Render.com Deployment

### Step 1: Prepare Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repository

### Step 3: Deploy PostgreSQL Database

**Via Render Dashboard:**

1. Click **"New +"** → **"PostgreSQL"**
2. Configuration:
   - **Name**: `siptalk-postgres`
   - **Database**: `sip_talk_db`
   - **User**: `siptalk_user`
   - **Region**: `Oregon` (or nearest)
   - **Plan**: `Free`
3. Click **"Create Database"**
4. Wait for provisioning (2-3 minutes)
5. **Save connection details** - you'll need them

**Connection String Example:**
```
postgres://siptalk_user:password@dpg-xxxxx.oregon-postgres.render.com/sip_talk_db
```

### Step 4: Import Database Schema

```bash
# Using psql
psql postgresql://siptalk_user:password@dpg-xxxxx.oregon-postgres.render.com/sip_talk_db < database/sip_talk_postgres.sql

# Or using pgAdmin
# 1. Add new server with Render connection details
# 2. Tools → Query Tool
# 3. Open and execute sip_talk_postgres.sql
```

### Step 5: Deploy Web Service

**Via Render Dashboard:**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configuration:
   - **Name**: `siptalk-api`
   - **Region**: `Oregon`
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: `Free`

4. **Environment Variables** (Add these):

```
DB_HOST=dpg-xxxxx.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=sip_talk_db
DB_USER=siptalk_user
DB_PASSWORD=your_database_password
FRONTEND_URL=https://siptalk-coffeeshop.netlify.app
NODE_ENV=production
SESSION_SECRET=your_generated_secret
JWT_SECRET=your_generated_secret
```

5. **Advanced** → **Health Check Path**: `/api/health.php`
6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)

### Step 6: Get Your Backend URL

After deployment:
```
https://siptalk-api.onrender.com
```

Test health endpoint:
```bash
curl https://siptalk-api.onrender.com/api/health.php
```

### Using Blueprint (Automated)

```bash
# Deploy using render.yaml
render blueprint apply

# Or via dashboard:
# 1. New → Blueprint
# 2. Connect repository
# 3. Click "Apply"
```

---

## Netlify Deployment

### Step 1: Build Configuration

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080/api')
  }
})
```

### Step 2: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify

### Step 3: Deploy Site

**Option A: Via Dashboard (Recommended)**

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your repository: `sip-talk`
4. Configuration:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: `/`

5. **Environment Variables**:
```
VITE_API_URL=https://siptalk-api.onrender.com/api
NODE_VERSION=18
```

6. Click **"Deploy site"**
7. Wait for build (2-3 minutes)

**Option B: Via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Step 4: Configure Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

### Step 5: Update Backend CORS

Update `backend/db_postgres.php` and all API files:

```php
header("Access-Control-Allow-Origin: https://siptalk-coffeeshop.netlify.app");
```

Or use environment variable:
```php
$allowed_origin = getenv('FRONTEND_URL') ?: 'http://localhost:3000';
header("Access-Control-Allow-Origin: " . $allowed_origin);
```

### Your URLs:

```
Frontend: https://siptalk-coffeeshop.netlify.app
Backend:  https://siptalk-api.onrender.com
```

---

## Database Migration

### MySQL to PostgreSQL Conversion

**Already Provided:**
- ✅ `database/sip_talk_mysql.sql` - Original MySQL
- ✅ `database/sip_talk_postgres.sql` - Converted PostgreSQL

**Key Differences:**

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Auto Increment | `AUTO_INCREMENT` | `SERIAL` |
| String Type | `VARCHAR(255)` | `VARCHAR(255)` |
| Text Type | `TEXT` | `TEXT` |
| Date/Time | `TIMESTAMP` | `TIMESTAMP` |
| Boolean | `TINYINT(1)` | `BOOLEAN` |
| Enum | `ENUM('a','b')` | `CHECK (col IN ('a','b'))` |

**Connection Changes:**

```php
// MySQL (mysqli)
$conn = new mysqli($host, $user, $pass, $db);

// PostgreSQL (PDO)
$conn = new PDO("pgsql:host=$host;dbname=$db", $user, $pass);
```

### Data Migration Tools

```bash
# Using pgloader (MySQL → PostgreSQL)
pgloader mysql://user:pass@localhost/sip_talk_db \
          postgresql://user:pass@localhost/sip_talk_db

# Or manual dump and import
mysqldump sip_talk_db > mysql_dump.sql
# Convert SQL (use provided postgres version)
psql -U postgres -d sip_talk_db < database/sip_talk_postgres.sql
```

---

## Production Checklist

### Security

- [ ] Change all default passwords
- [ ] Generate unique SESSION_SECRET and JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Disable error display in PHP
- [ ] Use environment variables (never hardcode credentials)
- [ ] Enable database SSL connections
- [ ] Set up firewall rules
- [ ] Implement rate limiting

### Performance

- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Minify CSS/JS (Vite does this)
- [ ] Use CDN for static assets
- [ ] Database indexes created
- [ ] Connection pooling configured

### Monitoring

- [ ] Set up error logging
- [ ] Configure health checks
- [ ] Monitor database performance
- [ ] Set up uptime monitoring
- [ ] Configure backup schedules
- [ ] Set up alerts for failures

### Testing

- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test database operations
- [ ] Test frontend on multiple browsers
- [ ] Test mobile responsiveness
- [ ] Load testing
- [ ] Security scanning

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `Connection refused` or `Authentication failed`

**Solutions**:
```bash
# Check database is running
docker-compose ps

# Check connection string
echo $DATABASE_URL

# Test connection
psql postgresql://user:pass@host:port/database

# Check firewall
# Render: Whitelist your IP in database settings
# Docker: Check network configuration
```

#### 2. CORS Errors

**Error**: `Access-Control-Allow-Origin`

**Solutions**:
```php
// Update in all backend PHP files
$allowed_origins = [
    'http://localhost:3000',
    'https://siptalk-coffeeshop.netlify.app'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
```

#### 3. Build Failures on Netlify

**Error**: Build fails

**Solutions**:
```bash
# Check build locally first
npm run build

# Verify Node version
echo "NODE_VERSION=18" >> .env

# Check Netlify logs
netlify logs

# Clear cache and rebuild
# In Netlify dashboard: Deploy → Trigger deploy → Clear cache and deploy
```

#### 4. Render Service Won't Start

**Error**: Service crashes or won't start

**Solutions**:
```bash
# Check logs in Render dashboard
# Events → View logs

# Verify Dockerfile builds locally
docker build -t test .

# Check environment variables are set

# Verify health check endpoint
curl https://your-app.onrender.com/api/health.php
```

#### 5. Database Schema Not Loading

**Error**: Tables don't exist

**Solutions**:
```bash
# Manually import schema
psql $DATABASE_URL < database/sip_talk_postgres.sql

# Check if tables exist
psql $DATABASE_URL -c "\dt"

# Verify user permissions
psql $DATABASE_URL -c "\du"
```

---

## Useful Commands

### Docker

```bash
# View all containers
docker ps -a

# View logs
docker logs siptalk-web

# Execute command in container
docker exec -it siptalk-web bash

# Clean up
docker system prune -a
```

### PostgreSQL

```bash
# Connect to database
psql postgresql://user:pass@host/db

# List tables
\dt

# Describe table
\d table_name

# Run query
SELECT * FROM users;

# Exit
\q
```

### Git Deployment

```bash
# Deploy to production
git add .
git commit -m "Deploy to production"
git push origin main

# Render and Netlify auto-deploy on push
```

---

## Support & Resources

### Documentation
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

### Your Project Files
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Multi-container setup
- `render.yaml` - Render blueprint
- `netlify.toml` - Netlify configuration
- `env.template` - Environment variables template

---

## 🎉 Deployment Complete!

Your SipTalk Coffee Shop is now deployed!

**Access Your App:**
- Frontend: https://siptalk-coffeeshop.netlify.app
- Backend API: https://siptalk-api.onrender.com/api
- Database: Managed by Render

**Next Steps:**
1. Set up custom domain
2. Configure SSL certificates (auto on Render/Netlify)
3. Set up monitoring and alerts
4. Configure automated backups
5. Add CI/CD pipeline

**Happy Deploying! ☕🚀**

