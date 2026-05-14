# 🚀 Node Website Template

Welcome! Thank you for purchasing Node - a modern, responsive website template for hosting services.

## 📋 Important Notes

> **Please read these terms carefully before proceeding:**

- ❌ **No refunds** - All sales are final
- 🔧 **Custom modifications** require additional payment
- 💡 **Basic support** is provided, but self-help is expected
- ⚠️ **Support exclusions** - No support for heavily modified websites or removed footer credits

## 🛠️ Getting Started

### Configuration Files
Customize your website by modifying these key files:

| File/Directory | Purpose |
|----------------|---------|
| `/app/config/sections/` | Main content configuration |
| `ui.json` | Currencies, colors, and UI settings |
| `hero.json` | Hero section content |
| `Footer.tsx` | Footer component and logo |
| `language.json` | Language and translations |
| `layout.tsx` | Meta data and SEO settings |

### 🎨 Quick Customization Guide

1. **Colors & UI**: Edit `ui.json`
2. **Content**: Modify files in `/app/config/sections/`
3. **Branding**: Update `hero.json` and `Footer.tsx`
4. **Languages**: Configure `language.json`
5. **SEO**: Update `layout.tsx`



1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install PM2 Process Manager**
   ```bash
   npm install -g pm2
   ```

3. **Build and Start the Application**
   ```bash
   npm run build
   pm2 start npm --name "Node-website" -- start
   ```

   The application will run on `localhost:3000`

4. **PM2 Management Commands**
   ```bash
   pm2 list              # View running processes
   pm2 restart Node-website    # Restart the app
   pm2 stop Node-website       # Stop the app
   pm2 delete Node-website     # Delete the app from PM2
   pm2 logs Node-website       # View logs
   ```

### 🔧 Nginx Reverse Proxy Setup

Create an Nginx configuration file for your domain:

```bash
sudo nano /etc/nginx/sites-available/your-domain.com
```

Add the following configuration:

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
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**For HTTPS with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**Important Notes:**
- Replace `your-domain.com` with your actual domain name
- Ensure your domain points to your server's IP address
- The application must be running on port 3000 (as configured with PM2)
- Test your configuration with `sudo nginx -t` before reloading

### ☁️ Vercel Deployment Guide

Deploy your Node website template to Vercel for easy hosting and automatic deployments.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Your project pushed to a GitHub repository

#### Step-by-Step Deployment

1. **Prepare Your Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Build Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - Add any environment variables in the Vercel dashboard
   - Go to Project Settings → Environment Variables
   - Add variables like `NEXT_PUBLIC_API_URL` if your app uses them

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site automatically
   - You'll get a URL like `https://your-project-name.vercel.app`

#### Custom Domain Setup

1. **Add Custom Domain**
   - Go to your project dashboard
   - Click "Domains" tab
   - Add your domain (e.g., `yourdomain.com`)

2. **Configure DNS**
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add an A record pointing to Vercel's IP addresses

3. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - HTTPS will be enabled automatically

#### Vercel Configuration File (Optional)

Create a `vercel.json` file in your project root for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### Automatic Deployments

- **Push to main branch**: Automatically triggers production deployment
- **Pull requests**: Creates preview deployments
- **Branch deployments**: Each branch gets its own URL

#### Vercel CLI (Alternative Method)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Deploy to production
vercel --prod
```

#### Performance Optimizations

Vercel automatically provides:
- **Edge Network**: Global CDN for fast loading
- **Image Optimization**: Automatic image optimization
- **Automatic HTTPS**: SSL certificates
- **Analytics**: Built-in performance monitoring

#### Troubleshooting

**Common Issues:**
- **Build failures**: Check your `package.json` scripts
- **Environment variables**: Ensure they're set in Vercel dashboard
- **Static files**: Place them in the `public` directory
- **API routes**: Must be in `app/api/` or `pages/api/` directory

**Useful Commands:**
```bash
# View deployment logs
vercel logs

# Check deployment status
vercel ls

# Remove deployment
vercel rm your-project-name
```