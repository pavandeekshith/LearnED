# Supabase Redirect URL Configuration

## Problem
When clicking the magic link from email, it redirects to the home page with the JWT hash instead of the teacher onboarding page.

## Solution
You need to configure the allowed redirect URLs in Supabase Dashboard.

## Steps:

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/ugphaeiqbfejnzpiqdty

### 2. Navigate to Authentication Settings
Click: **Authentication** → **URL Configuration**

### 3. Add Redirect URLs

In the **Redirect URLs** field, add these URLs (one per line):

```
http://localhost:3000/teacher/onboard
http://localhost:3000/*
https://learnedtech.in/teacher/onboard
https://learnedtech.in/*
```

### 4. Set Site URL

**Site URL**: `https://learnedtech.in` (for production)

Or `http://localhost:3000` for local development.

### 5. Save Changes

Click **Save** at the bottom of the page.

---

## Testing the Flow:

1. **Rebuild admin panel** (if running from build):
   ```bash
   cd admin
   npm run build
   ```

2. **Start frontend server**:
   ```bash
   cd frontend
   npm start
   ```

3. **Create teacher invitation** from admin panel

4. **Check your email** and click the magic link

5. **Should redirect to**: `http://localhost:3000/teacher/onboard#access_token=...`

6. **Check browser console** (F12) for detailed logs

---

## Current Flow:

1. ✅ Admin creates invitation → Saved to database
2. ✅ Magic link email sent → Using `signInWithOtp()`
3. ✅ Teacher receives email → From Supabase
4. ⚠️ **Teacher clicks link** → Should redirect to `/teacher/onboard`
5. 🔄 TeacherOnboarding page handles JWT → Validates and shows form
6. 🎯 Teacher completes profile → Creates teacher account

---

## Troubleshooting:

### If still redirecting to home page:
1. Clear browser cache
2. Check Supabase Dashboard → Authentication → Logs
3. Verify the redirect URL in the magic link email
4. Check browser console for errors

### If "Invalid redirect URL" error:
- The redirect URL is not whitelisted in Supabase
- Add it in Authentication → URL Configuration

### If JWT not being processed:
- Check TeacherOnboarding component logs in console
- Verify `supabase.auth.getSession()` is being called

---

## Environment Variables (Optional)

Create `.env` file in admin folder:

```env
REACT_APP_FRONTEND_URL=http://localhost:3000
```

This will be used for the redirect URL in production.
