# Bangla Newspaper Website - Deployment Guide

This guide covers how to deploy your Bangla Newspaper Website to Render and Hostinger hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- A Sanity.io account and project set up
- Your environment variables ready
- The project built and tested locally

## Environment Variables

You'll need these environment variables for deployment:

```bash
# Required - Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-12-01
SANITY_TOKEN=your_sanity_token_here

# Required - Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional - Newsletter Integration
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_LIST_ID=your_mailchimp_list_id

# Optional - Push Notifications
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_API_KEY=your_onesignal_api_key
```

---

## Deployment on Render

Render is a modern cloud platform that makes it easy to deploy Next.js applications.

### Step 1: Prepare Your Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Ensure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Step 2: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub/GitLab/Bitbucket account
3. Connect your repository

### Step 3: Create a New Web Service

1. Click "New +" and select "Web Service"
2. Connect your repository
3. Configure the service:

**Basic Settings:**
- **Name**: `bangla-newspaper`
- **Environment**: `Node`
- **Region**: Choose closest to your audience
- **Branch**: `main` (or your production branch)

**Build & Deploy Settings:**
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` (in Environment Variables)

### Step 4: Configure Environment Variables

In the Render dashboard:

1. Go to your service → Environment
2. Add all required environment variables
3. Set `NODE_VERSION` to `18`

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Once deployed, you'll get a URL like `https://bangla-newspaper.onrender.com`

### Step 6: Custom Domain (Optional)

1. Go to Settings → Custom Domains
2. Add your domain name
3. Update your DNS settings as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

### Render Deployment Tips:

- **Build Time**: First build might take 10-15 minutes
- **Auto-Deploy**: Enabled by default on every push
- **Free Tier**: Available but with limitations (spins down after inactivity)
- **Monitoring**: Built-in logs and metrics
- **SSL**: Automatic HTTPS with free SSL certificates

---

## Deployment on Hostinger

Hostinger offers shared hosting, VPS, and cloud hosting suitable for Next.js applications.

### Option 1: Hostinger VPS (Recommended)

#### Step 1: Set Up VPS

1. Purchase a Hostinger VPS plan
2. Choose Ubuntu 20.04 LTS
3. Connect via SSH:

```bash
ssh root@your-vps-ip
```

#### Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install certbot for SSL
apt install certbot python3-certbot-nginx -y
```

#### Step 3: Clone and Build Project

```bash
# Clone your repository
git clone https://github.com/yourusername/bangla-newspaper.git
cd bangla-newspaper

# Install dependencies
npm install

# Create environment file
nano .env.local
# Add all your environment variables

# Build the project
npm run build
```

#### Step 4: Configure PM2

Create PM2 ecosystem file:

```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'bangla-newspaper',
    script: 'npm',
    args: 'start',
    cwd: '/root/bangla-newspaper',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Start the application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 5: Configure Nginx

```bash
nano /etc/nginx/sites-available/bangla-newspaper
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/bangla-newspaper /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 6: Setup SSL Certificate

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Option 2: Hostinger Shared Hosting

**Note**: Shared hosting has limitations for Next.js apps. Consider static export:

#### Step 1: Configure for Static Export

Add to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

#### Step 2: Build and Export

```bash
npm run build
```

#### Step 3: Upload to Hostinger

1. Use File Manager or FTP
2. Upload `out` folder contents to `public_html`
3. Configure domain in Hostinger panel

**Limitations of Static Export:**
- No server-side features
- No API routes
- No dynamic data fetching
- Limited SEO benefits

---

## Post-Deployment Checklist

### 1. Test Core Functionality
- [ ] Homepage loads correctly
- [ ] Articles display properly
- [ ] Search functionality works
- [ ] Category pages work
- [ ] Dark mode toggle functions
- [ ] Mobile responsiveness

### 2. SEO Verification
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Meta tags display correctly
- [ ] OpenGraph images work
- [ ] Structured data validates

### 3. Performance Optimization
- [ ] Enable CDN (Cloudflare recommended)
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Monitor Core Web Vitals

### 4. Security Measures
- [ ] SSL certificate installed
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] Admin panel access restricted

### 5. Monitoring Setup
- [ ] Error tracking (Sentry recommended)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

## Troubleshooting Common Issues

### Build Failures

**Error**: `Module not found`
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Out of memory`
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Runtime Issues

**Error**: `Cannot connect to Sanity`
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check Sanity CORS settings
- Ensure token has correct permissions

**Error**: `Images not loading`
- Add your domain to `next.config.js` images domains
- Check Sanity image URLs

### Performance Issues

**Slow loading**:
- Enable Nginx gzip compression
- Use CDN for static assets
- Optimize images in Sanity
- Enable Next.js Image Optimization

**High server load**:
- Increase PM2 instances
- Add caching layer (Redis)
- Optimize database queries

---

## Scaling Considerations

### For High Traffic

1. **Use a CDN**: Cloudflare, AWS CloudFront
2. **Database Optimization**: Sanity has built-in CDN
3. **Server Scaling**: Use load balancers
4. **Caching Strategy**: Redis for API responses
5. **Image Optimization**: Use Sanity's image transforms

### Cost Optimization

1. **Render**: Start with free tier, upgrade as needed
2. **Hostinger VPS**: Choose appropriate VPS size
3. **Sanity**: Monitor API usage
4. **CDN**: Many offer generous free tiers

---

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**:
   - Check error logs
   - Monitor performance metrics
   - Update content regularly

2. **Monthly**:
   - Update dependencies
   - Review security patches
   - Backup database

3. **Quarterly**:
   - Performance audit
   - SEO review
   - Security audit

### Getting Help

- **Render Support**: [render.com/docs](https://render.com/docs)
- **Hostinger Support**: Via hosting panel
- **Sanity Support**: [sanity.io/help](https://sanity.io/help)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## Backup Strategy

### Code Backup
- Use Git repository (GitHub/GitLab)
- Tag releases for easy rollback

### Content Backup
- Sanity provides automatic backups
- Export content regularly via Sanity CLI

### Configuration Backup
- Document all environment variables
- Save server configurations
- Backup SSL certificates

Remember to test your backup restoration process regularly!