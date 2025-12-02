# 🐛 Debugging Teacher Invitation Flow

## Where to Check Logs

### 1️⃣ **Supabase Dashboard - Authentication Logs**
**URL:** https://supabase.com/dashboard/project/ugphaeiqbfejnzpiqdty/auth/logs

**What to check:**
- OTP email sent events
- User sign-in attempts
- Magic link clicks
- Any authentication errors

**Look for:**
```
- "OTP sent" - Email was sent
- "User signed in" - Magic link was clicked successfully
- "Error" - Authentication failed (check error message)
```

---

### 2️⃣ **Supabase Dashboard - Users List**
**URL:** https://supabase.com/dashboard/project/ugphaeiqbfejnzpiqdty/auth/users

**What to check:**
- Is the teacher's email in the users list?
- What's the user's `confirmed_at` timestamp?
- Check the `raw_user_meta_data` field for:
  - `user_type: "teacher"`
  - `first_name`
  - `last_name`
  - `invitation_id`

---

### 3️⃣ **Supabase Dashboard - Database Logs (Trigger Logs)**
**URL:** https://supabase.com/dashboard/project/ugphaeiqbfejnzpiqdty/editor

Run this query to see trigger execution:
```sql
SELECT * FROM public.trigger_logs 
ORDER BY created_at DESC 
LIMIT 20;
```

**Look for:**
- "handle_new_user_signup triggered"
- "Teacher registration allowed - valid invitation found"
- "Teacher registration blocked" (if invitation check failed)
- Any error messages

---

### 4️⃣ **Supabase Dashboard - Teacher Invitations Table**
Run this query:
```sql
SELECT 
    id,
    email,
    first_name,
    last_name,
    status,
    expires_at,
    created_at
FROM public.teacher_invitations 
ORDER BY created_at DESC 
LIMIT 10;
```

**Check:**
- Status should be "pending" initially
- `expires_at` should be in the future
- After successful onboarding, status should become "accepted"

---

### 5️⃣ **Browser Console (Frontend Logs)**

**How to access:**
1. Open your browser
2. Click the magic link from email
3. Press `F12` or `Cmd+Option+I` (Mac) to open DevTools
4. Go to **Console** tab

**What you'll see:**
```
🔍 TeacherOnboarding mounted
📍 Current URL: http://localhost:3000/teacher/onboard#access_token=...
🔗 Hash: #access_token=...
🔐 Auth event: SIGNED_IN
👤 Session: {...}
✅ User authenticated: {...}
📧 User email: teacher@example.com
📝 User metadata: {user_type: "teacher", first_name: "John", ...}
🔍 Checking for invitation...
📨 Invitation query result: [{...}]
✅ Valid invitation found: {...}
```

**Common errors you might see:**
- `⚠️ No existing session` - Magic link expired or not clicked properly
- `❌ No valid invitation found` - Invitation doesn't exist or already used
- `❌ Invitation query error` - Database permission issue

---

## Testing Locally

### Step 1: Start Frontend Server
```bash
cd /Users/pavandeekshith/B-Tech/old_LearnED/LearnED/frontend
npm start
```

### Step 2: Configure Supabase Redirect URL
Go to: https://supabase.com/dashboard/project/ugphaeiqbfejnzpiqdty/auth/url-configuration

Add this URL:
```
http://localhost:3000/teacher/onboard
```

### Step 3: Test Flow
1. Admin creates invitation (sends email)
2. Check email inbox (including spam folder)
3. Click magic link in email
4. Browser should redirect to: `http://localhost:3000/teacher/onboard#access_token=...`
5. Open browser console (F12) to see logs
6. Page should show teacher onboarding form

---

## Common Issues & Solutions

### ❌ Issue: "No authentication found"
**Cause:** Magic link wasn't processed correctly

**Solutions:**
1. Check if URL has `#access_token=...` in it
2. Clear browser cookies/cache
3. Try in incognito/private window
4. Check Supabase Auth Logs for errors

---

### ❌ Issue: "No valid invitation found"
**Cause:** Invitation doesn't exist or expired

**Check:**
```sql
SELECT * FROM teacher_invitations WHERE email = 'teacher@example.com';
```

**Solutions:**
1. Create new invitation
2. Check invitation hasn't expired
3. Check status is "pending"

---

### ❌ Issue: "Database error saving new user"
**Cause:** Trigger blocking teacher registration

**Solution:** Run the fix SQL:
```sql
-- Check if trigger allows teacher with invitation
SELECT * FROM trigger_logs 
WHERE message LIKE '%Teacher registration%' 
ORDER BY created_at DESC;
```

If you see "Teacher registration blocked", run the fix from `fix_teacher_registration_trigger.sql`

---

### ❌ Issue: Email not received
**Cause:** Email provider not configured or email in spam

**Check:**
1. Supabase Dashboard → Settings → Auth → Email Settings
2. Check spam/junk folder
3. Check Auth Logs to confirm email was sent
4. Try different email provider (Gmail, Yahoo, etc.)

---

## Quick Debug Checklist

- [ ] Applied database trigger fix (`fix_teacher_registration_trigger.sql`)
- [ ] Rebuilt admin app (`npm run build`)
- [ ] Added `http://localhost:3000/teacher/onboard` to Supabase redirect URLs
- [ ] Frontend server running (`npm start`)
- [ ] Browser console open (F12)
- [ ] Email received (check spam folder)
- [ ] Magic link clicked
- [ ] URL contains `#access_token=...`
- [ ] Console shows authentication logs

---

## Need More Help?

1. **Copy all console logs** from browser
2. **Check Supabase Auth Logs** and copy any errors
3. **Run the SQL queries** above and share results
4. **Share the full URL** after clicking magic link (you can redact the actual token value)
