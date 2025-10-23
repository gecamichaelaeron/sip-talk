# 🗺️ SipTalk Deployment - Complete Paths & Environment Guide

## 📍 All File Paths & Locations

### Docker Configuration Files
```
📁 Project Root (SipTalk/)
├── Dockerfile                          ← Multi-stage build configuration
├── docker-compose.yml                  ← Full stack orchestration
├── .dockerignore                       ← Build optimization
└── env.template                        ← Environment variables template
```

### Database Files
```
📁 database/
├── sip_talk_postgres.sql              ← PostgreSQL schema (PRODUCTION)
└── sip_talk_db.sql                    ← MySQL schema (DEVELOPMENT)
```

### Backend PHP Files
```
📁 backend/
├── db.php                              ← MySQL connection (legacy)
├── db_postgres.php                     ← PostgreSQL connection (NEW)
├── login.php                           ← Login endpoint
├── register.php                        ← Registration endpoint
├── logout.php                          ← Logout endpoint
├── reservation.php                     ← Reservation endpoint
├── contact.php                         ← Contact form endpoint
├── feedback.php                        ← Feedback endpoint
├── check_session.php                   ← Session verification
├── health.php                          ← Health check (Render)
├── test_api.php                        ← API testing interface
└── .htaccess                           ← Apache configuration
```

### Deployment Configuration
```
📁 Project Root (SipTalk/)
├── render.yaml                         ← Render.com blueprint
├── netlify.toml                        ← Netlify configuration
└── .gitignore                          ← Git ignore rules
```

### Documentation
```
📁 Project Root (SipTalk/)
├── DEPLOYMENT_GUIDE.md                 ← Full deployment guide (50 pages)
├── DEPLOYMENT_QUICK_START.md           ← Quick start (20 min)
├── README_DEPLOYMENT.md                ← Deployment overview
├── DEPLOYMENT_PATHS_SUMMARY.md         ← This file
├── DATABASE_SETUP.md                   ← MySQL database setup
├── DATABASE_IMPLEMENTATION_SUMMARY.md  ← Database details
└── LAB_REQUIREMENTS_CHECKLIST.md       ← Project requirements
```

### Scripts
```
📁 scripts/
├── deploy.sh                           ← Bash deployment (Linux/Mac)
└── deploy.ps1                          ← PowerShell deployment (Windows)
```

---

## 🌐 Environment Variables - Complete Reference

### Create .env File
```bash
# Copy template
cp env.template .env

# Edit with your values
nano .env  # Linux/Mac
notepad .env  # Windows
```

### All Environment Variables Explained

#### **Database Configuration (PostgreSQL)**
```env
# PostgreSQL host (local or Render)
DB_HOST=localhost
# For Render: dpg-xxxxx.oregon-postgres.render.com

# PostgreSQL port
DB_PORT=5432

# Database name
DB_NAME=sip_talk_db

# Database username
DB_USER=postgres
# For Render: siptalk_user

# Database password (CHANGE THIS!)
DB_PASSWORD=your_secure_password_here
```

#### **Application Configuration**
```env
# Port for Docker web service
APP_PORT=8080

# Environment mode
NODE_ENV=production  
# Options: development, production, test

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
# Production: https://siptalk-coffeeshop.netlify.app
```

#### **API Configuration**
```env
# Backend API base URL
API_BASE_URL=http://localhost:8080/api
# Production: https://siptalk-api.onrender.com/api

# Allowed CORS origin
CORS_ORIGIN=http://localhost:3000
# Production: https://siptalk-coffeeshop.netlify.app
```

#### **Development Tools (Optional)**
```env
# pgAdmin configuration
PGADMIN_EMAIL=admin@siptalk.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
```

#### **Security (REQUIRED)**
```env
# Session secret (32+ random characters)
SESSION_SECRET=your_random_session_secret_here
# Generate: openssl rand -base64 32

# JWT secret (32+ random characters)
JWT_SECRET=your_jwt_secret_key_here
# Generate: openssl rand -base64 32
```

#### **Email Configuration (Optional)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@siptalk.com
```

#### **Render.com Specific**
```env
RENDER_SERVICE_NAME=siptalk-api
RENDER_REGION=oregon
# Options: oregon, frankfurt, singapore, ohio
```

#### **Netlify Specific**
```env
NETLIFY_SITE_NAME=siptalk-coffeeshop
VITE_API_URL=https://siptalk-api.onrender.com/api
```

---

## 🐳 Docker Deployment - Full Details

### Docker Files Explained

#### **Dockerfile** (Multi-stage build)
```dockerfile
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
# Installs dependencies and builds React app

# Stage 2: PHP + Apache backend
FROM php:8.2-apache
# Installs PostgreSQL extensions
# Copies backend PHP files
# Copies built frontend
# Configures Apache for SPA routing
```

**Path**: `SipTalk/Dockerfile`

#### **docker-compose.yml** (3 services)
```yaml
services:
  postgres:    # PostgreSQL database
  web:         # PHP + Apache + React
  pgadmin:     # Database management UI (dev only)
```

**Path**: `SipTalk/docker-compose.yml`

### Docker Commands Reference

```bash
# BUILD AND START
docker-compose up -d                    # Start all services
docker-compose up -d --build            # Rebuild and start
docker-compose build                    # Build only

# MANAGE SERVICES
docker-compose ps                       # View status
docker-compose logs -f                  # View logs (all)
docker-compose logs -f web              # View web logs
docker-compose restart web              # Restart web service

# DATABASE
docker-compose exec postgres psql -U postgres -d sip_talk_db
# Access PostgreSQL CLI

# IMPORT SCHEMA
docker-compose exec -T postgres psql -U postgres -d sip_talk_db < database/sip_talk_postgres.sql

# STOP AND CLEAN
docker-compose down                     # Stop all services
docker-compose down -v                  # Stop and remove volumes
docker system prune -a                  # Clean everything
```

### Access Points (Docker)

```
┌─────────────────────────────────────┐
│ Service       │ URL                  │
├───────────────┼─────────────────────┤
│ Web App       │ http://localhost:8080│
│ Health Check  │ http://localhost:8080/api/health.php
│ PostgreSQL    │ localhost:5432       │
│ pgAdmin       │ http://localhost:5050│ (dev only)
└─────────────────────────────────────┘
```

---

## 🎯 Render.com Deployment - Complete Path

### Step 1: PostgreSQL Database

**Dashboard Path**:
```
render.com → New + → PostgreSQL
```

**Configuration**:
- **Name**: `siptalk-postgres`
- **Database**: `sip_talk_db`
- **User**: `siptalk_user`
- **Region**: `Oregon` (or closest)
- **Plan**: `Free` (100 MB, 90 days)

**Save These Values**:
```
Internal Database URL: 
postgresql://siptalk_user:password@dpg-xxxxx-a.oregon-postgres.render.com/sip_talk_db

External Database URL (for local connections):
postgresql://siptalk_user:password@dpg-xxxxx.oregon-postgres.render.com/sip_talk_db

Hostname: dpg-xxxxx.oregon-postgres.render.com
Port: 5432
Database: sip_talk_db
Username: siptalk_user
Password: [auto-generated]
```

### Step 2: Import Database Schema

**Method 1: psql (Recommended)**
```bash
psql postgresql://siptalk_user:password@dpg-xxxxx.oregon-postgres.render.com/sip_talk_db < database/sip_talk_postgres.sql
```

**Method 2: pgAdmin**
```
1. Add Server → Connection tab
2. Host: dpg-xxxxx.oregon-postgres.render.com
3. Port: 5432
4. Database: sip_talk_db
5. Username: siptalk_user
6. Password: [your password]
7. Tools → Query Tool → Open sip_talk_postgres.sql → Execute
```

### Step 3: Web Service

**Dashboard Path**:
```
render.com → New + → Web Service → Connect Repository
```

**Configuration**:
```
Name: siptalk-api
Environment: Docker
Region: Oregon
Branch: main
Dockerfile Path: ./Dockerfile
Instance Type: Free
```

**Environment Variables** (Click "Add Environment Variable"):
```
Key                 | Value
--------------------|----------------------------------------
DB_HOST             | dpg-xxxxx.oregon-postgres.render.com
DB_PORT             | 5432
DB_NAME             | sip_talk_db
DB_USER             | siptalk_user
DB_PASSWORD         | [paste from database]
FRONTEND_URL        | https://siptalk-coffeeshop.netlify.app
NODE_ENV            | production
SESSION_SECRET      | [generate random 32 chars]
JWT_SECRET          | [generate random 32 chars]
```

**Advanced Settings**:
```
Health Check Path: /api/health.php
Auto-Deploy: Yes (deploys on git push)
```

**Your Backend URL**:
```
https://siptalk-api.onrender.com
```

**Health Check**:
```
https://siptalk-api.onrender.com/api/health.php
```

### Using Blueprint (Automated)

**File**: `SipTalk/render.yaml`

**Deploy**:
```bash
# Option 1: Dashboard
render.com → New + → Blueprint → Connect repository

# Option 2: CLI
render blueprint apply
```

---

## 🌐 Netlify Deployment - Complete Path

### Step 1: Build Configuration

**File**: `SipTalk/netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"
  base = "/"

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy Site

**Dashboard Path**:
```
netlify.com → Add new site → Import an existing project → Deploy with GitHub
```

**Configuration**:
```
Repository: gecamichaelaeron/sip-talk
Branch: main
Build command: npm run build
Publish directory: dist
```

**Environment Variables**:
```
Key                 | Value
--------------------|----------------------------------------
VITE_API_URL        | https://siptalk-api.onrender.com/api
NODE_VERSION        | 18
```

**Deploy Settings**:
```
Auto-Deploy: Yes
Production branch: main
Build status: Enabled
```

### Step 3: Custom Domain (Optional)

**Dashboard Path**:
```
Site settings → Domain management → Add custom domain
```

**DNS Configuration**:
```
Type: CNAME
Name: www
Value: [your-site].netlify.app
```

**Your Frontend URL**:
```
https://siptalk-coffeeshop.netlify.app
or
https://your-custom-domain.com
```

### Using CLI

```bash
# Install
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd SipTalk
netlify deploy --prod
```

---

## 🔄 Complete Deployment Flow

### Development → Production Pipeline

```
┌────────────────┐
│ Local Computer │
│   SipTalk/     │
└───────┬────────┘
        │
        │ git push origin main
        ▼
┌────────────────┐
│     GitHub     │
│  Repository    │
└────┬──────┬────┘
     │      │
     │      │ (auto-deploy)
     │      │
     ▼      ▼
┌─────────┐ ┌──────────┐
│ Render  │ │ Netlify  │
│(Backend)│ │(Frontend)│
└────┬────┘ └────┬─────┘
     │           │
     │           │
     ▼           ▼
   Users    ←─────→   Browser
```

### Deployment Checklist

```
□ Local Development
  □ Code works in Docker
  □ Database schema tested
  □ All features functional
  
□ Repository
  □ Code pushed to GitHub
  □ .gitignore configured
  □ env.template provided
  
□ Render.com
  □ PostgreSQL database created
  □ Schema imported
  □ Web service deployed
  □ Environment variables set
  □ Health check passing
  
□ Netlify
  □ Site deployed
  □ Build successful
  □ Environment variables set
  □ Custom domain configured (optional)
  
□ Integration
  □ Frontend can reach backend
  □ CORS configured correctly
  □ Authentication works
  □ Database operations work
```

---

## 📊 Environment Variables by Platform

### Docker (.env file)
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=sip_talk_db
DB_USER=postgres
DB_PASSWORD=siptalk_secure_password
FRONTEND_URL=http://localhost:3000
APP_PORT=8080
```

### Render (Environment tab)
```
DB_HOST=dpg-xxxxx.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=sip_talk_db
DB_USER=siptalk_user
DB_PASSWORD=[from Render database]
FRONTEND_URL=https://siptalk-coffeeshop.netlify.app
NODE_ENV=production
SESSION_SECRET=[generate]
JWT_SECRET=[generate]
```

### Netlify (Environment variables tab)
```
VITE_API_URL=https://siptalk-api.onrender.com/api
NODE_VERSION=18
```

---

## 🎯 Quick Reference URLs

### Development
```
Local App:     http://localhost:8080
Local API:     http://localhost:8080/api
PostgreSQL:    postgresql://postgres:password@localhost:5432/sip_talk_db
pgAdmin:       http://localhost:5050
```

### Production
```
Frontend:      https://siptalk-coffeeshop.netlify.app
Backend API:   https://siptalk-api.onrender.com/api
Health Check:  https://siptalk-api.onrender.com/api/health.php
Database:      [Managed by Render - internal only]
```

### Dashboards
```
Render:        https://dashboard.render.com
Netlify:       https://app.netlify.com
GitHub:        https://github.com/gecamichaelaeron/sip-talk
Docker Hub:    https://hub.docker.com (if you push images)
```

---

## ✅ Final Verification

### Test All Paths

```bash
# Health Check
curl https://siptalk-api.onrender.com/api/health.php

# Frontend
curl https://siptalk-coffeeshop.netlify.app

# Test Registration
curl -X POST https://siptalk-api.onrender.com/api/register.php \
  -d "fullname=Test User&email=test@test.com&password=test123"

# Test Login
curl -X POST https://siptalk-api.onrender.com/api/login.php \
  -d "email=test@test.com&password=test123"
```

---

## 🎉 You Now Have

✅ Complete Docker setup with PostgreSQL  
✅ Render.com backend deployment configuration  
✅ Netlify frontend deployment configuration  
✅ PostgreSQL database schema (converted from MySQL)  
✅ All environment variables documented  
✅ Health check endpoints  
✅ Automated deployment scripts  
✅ Comprehensive documentation  

**Everything you need to deploy SipTalk Coffee Shop to production! ☕🚀**

