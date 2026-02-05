# LearnED Admin Dashboard - Hostinger Deployment Guide

## Files to Upload

Upload **ALL contents** from the `build` folder:

```
admin/build/
├── .htaccess                 ← React Router configuration (IMPORTANT!)
├── index.html                ← Main HTML file
├── manifest.json             ← PWA manifest
├── robots.txt                ← SEO robots file
├── asset-manifest.json       ← Build manifest
├── LearnED black.png         ← Your logo
├── favicon.ico               ← Favicon
├── logo192.png              ← Optional React logo
├── logo512.png              ← Optional React logo
└── static/                   ← Contains all CSS/JS files
    ├── css/
    │   └── main.[hash].css
    └── js/
        ├── main.[hash].js
        └── [other].js files
```

**Total size:** ~300-500 KB (very small!)

---

## Step-by-Step Deployment to Hostinger

### Step 1: Access File Manager

1. Login to your **Hostinger control panel** (hPanel)
2. Go to **Files** → **File Manager**
3. Navigate to your desired directory:
   - For main domain: `/public_html/`
   - For subdomain (admin.learnedtech.in): `/public_html/admin/`
   - For subfolder: `/public_html/admin-dashboard/`

### Step 2: Upload Files

**Option A: Using File Manager (Recommended for first time)**

1. Click **Upload Files** button
2. Select **ALL files** from `admin/build/` folder
3. Upload them (should take 10-20 seconds)
4. Make sure `.htaccess` is uploaded (it might be hidden)

**Option B: Using FTP (Faster for updates)**

1. Get FTP credentials from Hostinger:
   - Go to **Files** → **FTP Accounts**
   - Note down: Host, Username, Password, Port (21)

2. Use an FTP client (FileZilla recommended):
   - Download: https://filezilla-project.org/
   - Connect using credentials
   - Navigate to target folder
   - Drag & drop all files from `build/` folder

**Option C: Using ZIP (Easiest)**

1. **On your computer:**
   ```bash
   cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED/admin/build
   zip -r admin-build.zip .
   ```

2. Upload `admin-build.zip` to Hostinger File Manager

3. **In File Manager:**
   - Right-click the zip file
   - Click **Extract**
   - Delete the zip file after extraction

### Step 3: Verify .htaccess

**IMPORTANT:** Make sure `.htaccess` file is present!

1. In File Manager, click **Settings** (gear icon)
2. Check **Show Hidden Files**
3. Verify `.htaccess` exists in your upload directory
4. If not visible, create it manually:
   - Click **New File**
   - Name: `.htaccess`
   - Paste the content from the generated file

### Step 4: Set Up Custom Domain/Subdomain (Optional)

**For Subdomain (admin.learnedtech.in):**

1. Go to **Domains** in hPanel
2. Click **Create Subdomain**
3. Subdomain: `admin`
4. Domain: `learnedtech.in`
5. Document Root: `/public_html/admin`
6. Click **Create**
7. Wait 5-10 minutes for DNS propagation

**For Main Domain:**
- Just upload to `/public_html/` directly

### Step 5: Configure SSL (HTTPS)

1. Go to **Security** → **SSL**
2. Select your domain/subdomain
3. Click **Install SSL** (Free Let's Encrypt)
4. Wait 2-5 minutes for installation
5. Enable **Force HTTPS redirect**

### Step 6: Test Your Deployment

1. Visit your URL:
   - `https://admin.learnedtech.in` (if subdomain)
   - `https://learnedtech.in/admin-dashboard` (if subfolder)
   - `https://yourdomain.com` (if main domain)

2. **Test React Router (IMPORTANT):**
   - Click on different tabs (Classrooms, Teachers, Students)
   - Press **F5** or **Cmd+R** to refresh
   - Should NOT show white screen or 404 error
   - Should reload the same page correctly

3. **Clear browser cache if needed:**
   - Press **Cmd+Shift+R** (Mac) or **Ctrl+Shift+F5** (Windows)

### Step 7: Environment Variables (if needed)

If your `.env` file has sensitive data:

1. **DO NOT** upload `.env` to public folder
2. Instead, hardcode values in the build:
   - Before building, set env vars in your terminal:
     ```bash
     export REACT_APP_SUPABASE_URL="your-url"
     export REACT_APP_SUPABASE_ANON_KEY="your-key"
     npm run build
     ```
   - This bakes the values into the JS files

---

## Quick Commands Reference

### Rebuild for Production
```bash
cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED/admin
npm run build
```

### Create ZIP for Upload
```bash
cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED/admin/build
zip -r admin-build.zip .
```

### Create ZIP (excluding unnecessary files)
```bash
cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED/admin/build
zip -r admin-build.zip . -x "*.DS_Store" "*.map"
```

---

## Updating Your App (Future Deployments)

1. Make changes to code
2. Run `npm run build` in admin folder
3. Upload only changed files:
   - `index.html` (always)
   - `asset-manifest.json` (always)
   - `static/` folder (always - new hash files)
   - `.htaccess` (only if changed)
4. Clear browser cache and test

**Pro Tip:** Keep `.htaccess` file, only replace other files when updating.

---

## Common Issues & Solutions

### Issue 1: White Screen on Refresh
**Cause:** `.htaccess` file missing or not working  
**Solution:**
- Verify `.htaccess` is present
- Check if mod_rewrite is enabled (contact Hostinger support)
- Make sure file permissions are correct (644)

### Issue 2: 404 Errors
**Cause:** Wrong directory or missing files  
**Solution:**
- Check you uploaded to correct folder
- Verify `index.html` is in root of upload directory
- Check file permissions (755 for folders, 644 for files)

### Issue 3: CSS/JS Not Loading
**Cause:** Wrong base URL or path  
**Solution:**
- Ensure `homepage` in `package.json` is set to `"."`
- Rebuild the app
- Clear browser cache

### Issue 4: Favicon Not Showing
**Cause:** Browser cache  
**Solution:**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
- Wait 5-10 minutes for CDN cache to clear

---

## Performance Tips

1. **Enable Caching:** `.htaccess` already includes cache headers
2. **Enable Compression:** `.htaccess` includes gzip compression
3. **Use CDN:** Hostinger has built-in Cloudflare integration
4. **Optimize Images:** Your logo is already small, but compress if needed

---

## Security Checklist

- ✅ SSL enabled (HTTPS)
- ✅ `.htaccess` protects against directory listing
- ✅ No `.env` file in public folder
- ✅ API keys are read-only (Supabase anon key is safe)
- ✅ CORS configured in Supabase for your domain

---

## Accessing Your Admin Dashboard

**URL Options:**
1. Subdomain: `https://admin.learnedtech.in`
2. Subfolder: `https://learnedtech.in/admin`
3. Custom domain: `https://admin.yourdomain.com`

**Recommended:** Use subdomain for cleaner URLs

---

## Getting Help

**Hostinger Support:**
- Live Chat: Available 24/7 in hPanel
- Tutorials: https://support.hostinger.com
- Common issue: "How to enable mod_rewrite for React apps"

**Issues with deployment?** Check:
1. Browser console for errors (F12)
2. Network tab for failed requests
3. Hostinger error logs in File Manager

---

## Next Steps After Deployment

1. ✅ Test all routes (Dashboard, Classrooms, Teachers, Students, etc.)
2. ✅ Test refresh on each page
3. ✅ Update Supabase allowed origins to include your new URL
4. ✅ Test login flow
5. ✅ Monitor for any console errors
6. ✅ Share URL with stakeholders

---

**Deployment Complete! 🎉**

Your admin dashboard is now live and accessible to your team!
