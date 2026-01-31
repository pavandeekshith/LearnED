# LearnED Frontend Deployment Guide - Hostinger

## Overview
This guide explains how to build and deploy the LearnED React frontend to Hostinger hosting.

---

## Prerequisites

Before deploying, ensure you have:
- Node.js installed (v14 or higher)
- npm or yarn package manager
- Hostinger account with FTP/SFTP access
- FileZilla or similar FTP client (optional, for easier file transfer)

---

## Step 1: Build the Frontend

Navigate to the frontend folder and create an optimized production build:

```bash
cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED/frontend
npm install  # Install dependencies (first time only)
npm run build
```

This creates a `build/` folder with optimized files ready for production.

### Expected Output:
```
Build folder size: ~150-200 KB (gzipped)
Main JS bundle: ~150 KB
No compilation errors
```

---

## Step 2: Prepare Files for Upload

The `build/` folder contains:
- `index.html` - Main HTML file
- `static/js/` - JavaScript bundles
- `static/css/` - CSS files
- `manifest.json` - PWA manifest
- `robots.txt` - SEO configuration

---

## Step 3: Connect to Hostinger via FTP

### Using File Manager (Recommended - Easiest)
1. Log in to Hostinger Dashboard
2. Go to **File Manager**
3. Navigate to **public_html** folder (or your root directory)
4. Delete any existing files (optional, if starting fresh)

### Using FileZilla (Alternative)
1. Open FileZilla
2. File → Site Manager
3. Enter Hostinger FTP credentials:
   - Host: `ftp.yourdomain.com`
   - Username: Your FTP username
   - Password: Your FTP password
4. Connect and navigate to `public_html`

---

## Step 4: Upload Build Files

### Option A: Using Hostinger File Manager (Easiest)
1. Open the `build` folder locally
2. Select all contents (not the `build` folder itself)
3. Drag and drop into Hostinger's `public_html` folder
4. Wait for upload to complete

### Option B: Using FileZilla
1. Navigate to local `build` folder in FileZilla left panel
2. Drag all files/folders to right panel (`public_html`)
3. Wait for transfer to complete (progress shows in status bar)

### Option C: Using Command Line (Advanced)
```bash
# From frontend folder
sftp -r build/* username@ftp.yourdomain.com:/public_html/
```

---

## Step 5: Configure .htaccess for React Router

Create a `.htaccess` file in the `public_html` folder to handle React Router:

1. In Hostinger File Manager, click **Create** → **File**
2. Name it: `.htaccess`
3. Add this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite to index.html
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

4. Save the file

**Why?** This ensures all routes redirect to `index.html`, allowing React Router to handle navigation.

---

## Step 6: Verify Deployment

### Check Website is Live
1. Visit `https://yourdomain.com`
2. Website should load within 5-10 seconds
3. All pages should be accessible:
   - Home: `/`
   - Academics: `/academics`
   - Our Team: `/team`
   - Contact Us: `/contact`

### Test Key Features
- ✅ All links work
- ✅ Navigation between pages works
- ✅ Images load correctly
- ✅ Responsive design on mobile
- ✅ Forms submit to Google Sheet

### Test Forms Integration
1. Fill out **"Book Free Demo"** form on Home page
2. Fill out **floating demo button** form (bottom right)
3. Fill out **Contact Us** form
4. Check Google Sheet: https://docs.google.com/spreadsheets/d/1Ui45PPlFn5W4InWTCCeZhXrpdy5bpgoEjpydcsVtn7E/
5. Data should appear within 30 seconds

---

## Step 7: Clear Browser Cache (If Needed)

If you see old version of website:

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache and cookies
3. Or open in incognito/private window

---

## Important Files & Integrations

### Google Sheet Integration
- **Deployment URL**: `https://script.google.com/macros/s/AKfycbxrs3LPaLa_u5nr2E-WzK0Gcwl8thjBSyRi9R22ffn3KyDEB7FlQVUkapKjFlIlc33Fuw/exec`
- **Forms Connected**: Home Demo, Floating Button, Contact Us
- **Sheet**: https://docs.google.com/spreadsheets/d/1Ui45PPlFn5W4InWTCCeZhXrpdy5bpgoEjpydcsVtn7E/

### Phone Number
- Primary: `+91-9019120669`
- Updated in: Contact page, Footer, all contact links

### Hero Sections
- Standardized color: `from-red-600 via-red-700 to-black`
- Consistent size: `py-20` padding
- Applied to: Team, Academics, Contact pages

### ICSE Classes Color Fix
- Mathematics: `blue`
- Science: `green`
- Fixed Classes 3 and 9 inconsistencies

---

## Troubleshooting

### Website Shows Old Version
- Clear browser cache (Ctrl+Shift+R)
- Wait 5-10 minutes for CDN cache to clear
- Check that new files are in `public_html`

### Forms Not Submitting
- Check Google Sheet deployment URL is correct
- Verify CORS isn't blocking requests
- Check browser console for errors (F12)
- Ensure Google Sheet has correct headers: Timestamp, Name, Phone, Email, Message

### 404 Errors on Routes
- Check `.htaccess` file exists in `public_html`
- Verify mod_rewrite is enabled on Hostinger
- Contact Hostinger support if 404s persist

### Slow Loading
- Minimize browser extensions
- Check Hostinger server status
- Consider upgrading hosting plan if frequent slowness

### Images Not Loading
- Verify image paths are correct (public folder references)
- Check image file extensions match
- Ensure images are in correct folder structure

---

## Redeployment (For Updates)

When you make changes and need to redeploy:

```bash
# From frontend folder
npm run build
# Then upload new build folder contents to public_html via FTP/File Manager
```

**Note**: You only need to upload changed files, but uploading entire `build` folder is safest.

---

## Performance Tips

1. **Images**: Use optimized/compressed images
2. **Lazy Loading**: Already implemented for quiz questions
3. **Code Splitting**: React automatically chunks large files
4. **Caching**: .htaccess can set cache headers (advanced)

---

## Security Notes

- ✅ HTTPS enabled (Hostinger provides free SSL)
- ✅ No sensitive data stored in frontend code
- ✅ Google Sheet API uses secure deployment URL
- ✅ No database credentials exposed

---

## Support & Next Steps

### If You Need Help:
1. Check Hostinger knowledge base: https://www.hostinger.com/help
2. Review deployment logs in Hostinger dashboard
3. Contact Hostinger support with error messages

### Future Enhancements:
- Add email notifications for form submissions
- Implement analytics (Google Analytics)
- Add SEO metadata for each page
- Implement caching strategies

---

## Deployment Checklist

- [ ] Build created successfully (`npm run build`)
- [ ] All files uploaded to `public_html`
- [ ] `.htaccess` file created with React Router rules
- [ ] Website loads at https://yourdomain.com
- [ ] All pages accessible (Home, Academics, Team, Contact)
- [ ] Navigation works without 404s
- [ ] Forms submit successfully to Google Sheet
- [ ] Mobile responsive design verified
- [ ] Browser cache cleared and tested

---

**Last Updated**: January 23, 2026
**Version**: 1.0
**Status**: Production Ready
