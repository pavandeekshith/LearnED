# LearnED Frontend - Vercel Deployment Guide

## 🎯 Overview
This guide will help you deploy the **main website** (not admin panel) to Vercel with your Hostinger domain.

## ✅ Prerequisites Checklist
- [x] Vercel Hobby account
- [x] GitHub repository connected to Vercel
- [x] Domain registered with Hostinger
- [x] Supabase project running

---

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub
```bash
cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import your GitHub repo**: `pavandeekshith/LearnED`
4. **Configure Project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend` ⚠️ IMPORTANT - Point to frontend folder!
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables in Vercel

In the Vercel project settings, add these environment variables:

| Name | Value |
|------|-------|
| `REACT_APP_SUPABASE_URL` | `https://ugphaeiqbfejnzpiqdty.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |

**How to add:**
1. In Vercel → Your Project → Settings → Environment Variables
2. Add each variable with value
3. Select "Production", "Preview", and "Development" for all

### Step 4: Deploy!
Click **"Deploy"** - Vercel will:
- Install dependencies
- Build your React app
- Deploy to a `.vercel.app` URL (e.g., `learned-frontend.vercel.app`)

---

## 🌐 Connect Your Hostinger Domain

### Step 5: Configure Domain in Vercel

1. **In Vercel Project → Settings → Domains**
2. **Add your domain**: e.g., `learned.com` (or whatever you registered)
3. **Vercel will show DNS records** you need to add

### Step 6: Update DNS in Hostinger

1. **Login to Hostinger**
2. **Go to Domain → DNS Zone**
3. **Add Vercel's DNS records**:

**For root domain (e.g., learned.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

4. **Save changes** (may take up to 48 hours to propagate, usually <30 minutes)

### Step 7: Verify Domain in Vercel
- Go back to Vercel → Domains
- Click "Verify" on your domain
- Once verified, your site will be live at your custom domain!

---

## 🔧 Architecture Overview

```
┌─────────────────┐
│   Your Domain   │
│  (Hostinger)    │
│ learned.com     │
└────────┬────────┘
         │
         │ DNS Points To
         ▼
┌─────────────────┐
│     Vercel      │
│  (Static Host)  │
│  - React App    │
│  - Build files  │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│    Supabase     │
│  - Database     │
│  - Auth         │
│  - RLS Policies │
└─────────────────┘
```

**You DON'T need:**
- ❌ Backend server (React app talks directly to Supabase)
- ❌ Separate API hosting
- ❌ Database hosting (using Supabase)

**You DO need:**
- ✅ Environment variables (Supabase URL & Key)
- ✅ Frontend code on Vercel
- ✅ Domain DNS pointing to Vercel

---

## 📝 Important Notes

### Supabase Configuration
Before going live, update Supabase settings:

1. **Go to Supabase Dashboard → Authentication → URL Configuration**
2. **Add your production domain to Redirect URLs**:
   ```
   https://learned.com/teacher/onboard
   https://www.learned.com/teacher/onboard
   ```

### CORS Configuration
Supabase needs to allow requests from your domain:

1. **Supabase Dashboard → Settings → API**
2. **Allowed Origins** should include:
   ```
   https://learned.com
   https://www.learned.com
   ```

---

## 🧪 Testing After Deployment

1. Visit your domain: `https://learned.com`
2. Test key features:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ Contact form submits
   - ✅ Teacher invitation flow (if testing)
3. Check browser console for errors

---

## 🔄 Future Updates

To deploy changes:
```bash
git add .
git commit -m "Update website"
git push origin main
```
Vercel automatically redeploys on push to main branch!

---

## 🆘 Troubleshooting

### Build fails on Vercel
- Check build logs
- Ensure `frontend/package.json` has all dependencies
- Verify Node version compatibility

### Environment variables not working
- Variables must start with `REACT_APP_`
- Redeploy after adding variables
- Check Vercel logs for undefined errors

### Domain not connecting
- Wait 24-48 hours for DNS propagation
- Use DNS checker: https://dnschecker.org
- Verify DNS records in Hostinger match Vercel's requirements

### 403 Errors from Supabase
- Add your domain to Supabase Redirect URLs
- Check RLS policies allow public access where needed
- Verify Anon Key is correct

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- React Deployment: https://create-react-app.dev/docs/deployment/

---

**Estimated Time**: 15-30 minutes (excluding DNS propagation)
**Cost**: $0 (Hobby plan covers this)
