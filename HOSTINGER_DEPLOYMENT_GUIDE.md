# LearnED Frontend - Hostinger Deployment Guide

## 🎯 Overview
Deploy your React website directly to Hostinger using their hosting service (no Vercel needed).

## ✅ Prerequisites
- [x] Hostinger hosting plan (Premium/Business recommended)
- [x] Domain registered with Hostinger
- [x] FTP/SSH access to Hostinger
- [x] Supabase project running

---

## 📦 What Hostinger Hosting Includes

Hostinger provides:
- ✅ Web hosting space
- ✅ Domain name
- ✅ File manager / FTP access
- ✅ SSL certificate (free)
- ✅ Static file hosting

---

## 🚀 Deployment Steps

### Step 1: Build Your React App for Production

In your terminal:

```bash
cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED/frontend

# Install dependencies (if not already)
npm install

# Create production build
npm run build
```

This creates a `build/` folder with optimized static files.

**What's in the build folder:**
```
build/
├── index.html          # Main HTML file
├── static/
│   ├── css/           # Compiled CSS
│   ├── js/            # Compiled JavaScript (React bundled)
│   └── media/         # Images, fonts
├── manifest.json
└── robots.txt
```

### Step 2: Configure Environment Variables

Since Hostinger serves static files, you need to **hardcode** the Supabase credentials during build.

**Option A: Create `.env.production.local` (Recommended)**

```bash
# In frontend folder
nano .env.production.local
```

Add:
```env
REACT_APP_SUPABASE_URL=https://ugphaeiqbfejnzpiqdty.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncGhhZWlxYmZlam56cGlxZHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTMwNDcsImV4cCI6MjA2OTc4OTA0N30.-OcW0or7v6krUQJUG0Jb8VoPbpbGjbdbjsMKn6KplM8
```

Then rebuild:
```bash
npm run build
```

**Option B: Update `.env.production` (Already created for you)**

The file is already there with your credentials, just rebuild:
```bash
npm run build
```

### Step 3: Upload to Hostinger

#### Method 1: Using Hostinger File Manager (Easiest)

1. **Login to Hostinger Control Panel** (hpanel.hostinger.com)
2. **Go to "File Manager"**
3. **Navigate to `public_html/`** (this is your website root)
4. **Delete default files** (index.html, default WordPress files, etc.)
5. **Upload your build folder**:
   - Click "Upload Files"
   - Select ALL files from your local `frontend/build/` folder
   - Upload directly to `public_html/`
   - **Important**: Upload the CONTENTS of build folder, not the folder itself

**Your public_html should look like:**
```
public_html/
├── index.html
├── static/
├── manifest.json
├── robots.txt
└── .htaccess (we'll create this next)
```

#### Method 2: Using FTP (FileZilla)

1. **Get FTP credentials from Hostinger**:
   - Hosting → FTP Accounts → Create FTP account
   - Note: Hostname, Username, Password

2. **Connect with FileZilla**:
   - Host: `ftp.yourdomain.com`
   - Username: `your_ftp_user`
   - Password: `your_ftp_password`
   - Port: 21

3. **Upload files**:
   - Navigate to `public_html/` on remote (right side)
   - Upload all files from `frontend/build/` to `public_html/`

### Step 4: Configure .htaccess for React Router

React uses client-side routing. Create `.htaccess` file in `public_html/`:

**File: `public_html/.htaccess`**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect all requests to index.html for React Router
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
  
  # Enable HTTPS redirect (optional but recommended)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

You can create this file:
1. In Hostinger File Manager → Click "New File" → Name it `.htaccess`
2. Paste the content above

### Step 5: Enable SSL Certificate

1. **Hostinger hPanel → SSL**
2. **Install Free SSL** (Let's Encrypt)
3. **Force HTTPS** (usually automatic with .htaccess above)

### Step 6: Configure Supabase for Your Domain

1. **Go to Supabase Dashboard → Authentication → URL Configuration**
2. **Add your Hostinger domain to Redirect URLs**:
   ```
   https://yourdomain.com/teacher/onboard
   https://www.yourdomain.com/teacher/onboard
   ```

3. **Supabase Dashboard → Settings → API**
4. **Add to Allowed Origins**:
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

---

## 🔄 How to Update Your Website

When you make changes:

```bash
# 1. Make your code changes
cd frontend

# 2. Rebuild
npm run build

# 3. Upload new build/ contents to Hostinger
# (Use File Manager or FTP)
```

**Pro Tip**: Only upload changed files to save time!

---

## 🆚 Hostinger vs Vercel Comparison

| Feature | Hostinger | Vercel |
|---------|-----------|--------|
| **Deployment** | Manual upload | Auto from GitHub |
| **Updates** | Re-upload files | Git push = auto deploy |
| **SSL** | Free (Let's Encrypt) | Free (automatic) |
| **Custom Domain** | Included | Configure DNS |
| **Speed** | Depends on plan | Global CDN (faster) |
| **Cost** | Hosting plan cost | Free (Hobby plan) |
| **Best For** | Simple, manual control | CI/CD, auto updates |

---

## 📁 File Structure on Hostinger

```
public_html/                    ← Your domain root
├── index.html                  ← Main entry point
├── .htaccess                   ← Apache config (routing)
├── manifest.json
├── robots.txt
├── asset-manifest.json
├── favicon.ico
└── static/
    ├── css/
    │   └── main.[hash].css     ← Bundled styles
    ├── js/
    │   ├── main.[hash].js      ← React app bundle
    │   └── [other chunks]
    └── media/
        └── [images, fonts]
```

---

## 🧪 Testing After Deployment

1. **Visit your domain**: `https://yourdomain.com`
2. **Test navigation**:
   - Click all menu items (Home, Academics, Team, Contact)
   - URLs should work without 404 errors
3. **Test teacher onboarding**: `/teacher/onboard`
4. **Check browser console** for errors
5. **Test on mobile** (responsive design)

---

## 🔧 Troubleshooting

### React Router not working (404 errors)
**Problem**: Clicking links causes 404
**Solution**: Make sure `.htaccess` file is in `public_html/` with the rewrite rules above

### Images/CSS not loading
**Problem**: Static files missing
**Solution**: 
- Check `static/` folder uploaded correctly
- Verify paths in browser DevTools → Network tab

### Supabase API errors (CORS)
**Problem**: Browser blocks Supabase requests
**Solution**: Add your domain to Supabase Allowed Origins

### SSL not working
**Problem**: Site shows "Not Secure"
**Solution**: 
- Install SSL in Hostinger panel
- Check `.htaccess` has HTTPS redirect
- Wait 5-10 minutes for SSL to activate

### Environment variables not working
**Problem**: Supabase connection fails
**Solution**: 
- `.env.production.local` must exist BEFORE building
- Rebuild with `npm run build`
- Re-upload all files

---

## 💡 Pro Tips

1. **Keep a backup**: Download your live `public_html/` before uploading new version
2. **Test locally first**: Run `npm run build && npx serve -s build` to test production build
3. **Compress uploads**: Zip the build folder, upload, then extract on server
4. **Use staging**: Some Hostinger plans offer subdomains (test.yourdomain.com) for testing
5. **Monitor performance**: Use Google PageSpeed Insights after deployment

---

## 🚀 Quick Deployment Checklist

- [ ] Run `npm run build` in frontend folder
- [ ] Login to Hostinger File Manager
- [ ] Clear `public_html/` folder
- [ ] Upload all files from `build/` folder
- [ ] Create `.htaccess` file with routing rules
- [ ] Enable SSL certificate
- [ ] Add domain to Supabase redirect URLs
- [ ] Test website at your domain
- [ ] Check all pages load correctly
- [ ] Verify Supabase connection works

---

## 📞 Need Help?

- Hostinger Support: Live chat in hPanel
- Hostinger Tutorials: https://support.hostinger.com
- React Build Issues: Check `npm run build` logs

---

**Estimated Time**: 20-30 minutes for first deployment
**Cost**: Already included in your Hostinger plan!
