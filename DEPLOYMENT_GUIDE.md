# PollStore Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying PollStore to production environments, including frontend, backend, and database setup.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Vercel)      │────│   (Railway)     │────│   (PostgreSQL)  │
│   React + Vite  │    │   Node.js       │    │   Managed DB    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Domain name (optional)
- SSL certificate (handled by platforms)

## 1. Environment Setup

### Environment Variables

Create `.env` files for different environments:

#### Frontend (.env.production)
```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=PollStore
VITE_APP_VERSION=1.0.0

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=HOTJAR_ID

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SOCIAL_LOGIN=true
VITE_ENABLE_REAL_TIME=true

# External Services
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend (.env.production)
```bash
# Server Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://username:password@host:port/database
DB_SSL=true

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Service (SendGrid/Mailgun)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@your-domain.com

# File Upload (AWS S3/Cloudinary)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Redis (for caching and sessions)
REDIS_URL=redis://username:password@host:port

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info

# External APIs
OPENAI_API_KEY=your-openai-api-key
```

## 2. Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

1. **Build Optimization**
   ```bash
   # Install dependencies
   npm ci

   # Run build
   npm run build

   # Test production build locally
   npm run preview
   ```

2. **Environment Variables Setup**
   - Create production environment variables in Vercel dashboard
   - Ensure all `VITE_` prefixed variables are set

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: GitHub Integration
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Step 3: Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.19.61
   ```

### Step 4: Performance Optimization

1. **Vercel Configuration** (`vercel.json`)
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "headers": [
       {
         "source": "/assets/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=31536000, immutable"
           }
         ]
       }
     ],
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

## 3. Backend Deployment (Railway)

### Step 1: Prepare Backend

1. **Create Production Build**
   ```bash
   # If using TypeScript
   npm run build

   # Test production build
   npm start
   ```

2. **Database Migration Scripts**
   ```bash
   # Create migration files
   npm run db:migrate

   # Seed production data
   npm run db:seed:prod
   ```

### Step 2: Deploy to Railway

#### Option A: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Option B: GitHub Integration
1. Connect GitHub repository to Railway
2. Configure build settings:
   - **Build Command**: `npm run build` (if applicable)
   - **Start Command**: `npm start`
   - **Root Directory**: `/` or `/backend` if monorepo

### Step 3: Database Setup

#### Option A: Railway PostgreSQL
1. Add PostgreSQL service in Railway
2. Connect to your backend service
3. Use provided `DATABASE_URL`

#### Option B: External Database (Supabase/PlanetScale)
1. Create database instance
2. Run migrations
3. Configure connection string

### Step 4: Environment Variables

Set all production environment variables in Railway dashboard:
- Database credentials
- JWT secrets
- API keys
- CORS origins

## 4. Database Setup

### PostgreSQL Schema Setup

```sql
-- Create database
CREATE DATABASE pollstore_production;

-- Connect to database
\c pollstore_production;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Run migrations
-- (Use your migration tool: Prisma, Knex, etc.)
```

### Migration Commands

```bash
# Prisma example
npx prisma migrate deploy

# Knex example
npx knex migrate:latest --env production

# Custom migration
npm run migrate:prod
```

### Database Indexing

```sql
-- Performance indexes
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_users_email ON users(email);
```

## 5. Domain and SSL Configuration

### DNS Setup

```
# Main domain
Type: A
Name: @
Value: [Your server IP]

# API subdomain
Type: CNAME
Name: api
Value: your-backend-domain.railway.app

# WWW redirect
Type: CNAME
Name: www
Value: your-main-domain.com
```

### SSL Certificate

Most platforms (Vercel, Railway) provide automatic SSL certificates. For custom setups:

```bash
# Using Certbot (Let's Encrypt)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 6. Monitoring and Logging

### Application Monitoring

1. **Sentry Setup**
   ```javascript
   // Frontend (main.jsx)
   import * as Sentry from "@sentry/react";

   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     environment: import.meta.env.MODE,
   });

   // Backend (app.js)
   const Sentry = require("@sentry/node");
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   ```

2. **Health Check Endpoints**
   ```javascript
   // Backend health check
   app.get('/health', (req, res) => {
     res.status(200).json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       version: process.env.APP_VERSION
     });
   });
   ```

### Performance Monitoring

1. **Web Vitals (Frontend)**
   ```javascript
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

2. **API Monitoring (Backend)**
   ```javascript
   const responseTime = require('response-time');
   app.use(responseTime((req, res, time) => {
     console.log(`${req.method} ${req.url} - ${time}ms`);
   }));
   ```

## 7. Security Configuration

### Security Headers

```javascript
// Backend security middleware
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## 8. Backup Strategy

### Database Backups

```bash
# Automated daily backups
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### File Backups

```bash
# Backup uploaded files
aws s3 sync s3://your-app-bucket s3://your-backup-bucket/files/
```

## 9. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run build
        run: npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-key: ${{ secrets.RAILWAY_API_KEY }}
          project-id: ${{ secrets.RAILWAY_PROJECT_ID }}
```

## 10. Post-Deployment Checklist

### Verification Steps

- [ ] **Frontend Accessibility**
  - [ ] Website loads correctly
  - [ ] All pages render properly
  - [ ] Mobile responsiveness works
  - [ ] SSL certificate is active

- [ ] **Backend Functionality**
  - [ ] API endpoints respond correctly
  - [ ] Database connections work
  - [ ] Authentication flow functions
  - [ ] File uploads work (if applicable)

- [ ] **Performance Checks**
  - [ ] Page load times < 3 seconds
  - [ ] API response times < 500ms
  - [ ] Database queries optimized
  - [ ] CDN serving static assets

- [ ] **Security Verification**
  - [ ] HTTPS enforced
  - [ ] Security headers present
  - [ ] Rate limiting active
  - [ ] Input validation working

- [ ] **Monitoring Setup**
  - [ ] Error tracking active
  - [ ] Performance monitoring enabled
  - [ ] Log aggregation working
  - [ ] Alerts configured

### Rollback Plan

```bash
# Frontend rollback (Vercel)
vercel --prod --rollback

# Backend rollback (Railway)
railway rollback [deployment-id]

# Database rollback
# Run specific migration rollback commands
```

## 11. Maintenance and Updates

### Regular Maintenance Tasks

- [ ] **Weekly**
  - Monitor error rates and performance
  - Review security logs
  - Check backup integrity

- [ ] **Monthly**
  - Update dependencies
  - Review and rotate secrets
  - Analyze usage patterns

- [ ] **Quarterly**
  - Security audit
  - Performance optimization
  - Disaster recovery testing

### Update Process

1. **Staging Deployment**
   - Deploy to staging environment
   - Run full test suite
   - Manual testing

2. **Production Deployment**
   - Deploy during low-traffic hours
   - Monitor for issues
   - Have rollback plan ready

---

**Document Status:** ✅ Complete  
**Last Updated:** September 2025  
**Deployment Environments:** Production Ready
