# Admin Dashboard Caching System

## How It Works

### Initial Load (When You Open Admin Dashboard)
1. **AdminContext** runs `loadAdminData()` automatically on app startup
2. Fetches all data in parallel from database:
   - Classrooms (with pricing & teachers)
   - Teachers (with user details)
   - Students (basic info)
   - Students with Classrooms (detailed enrollment data via RPC)
   - Recent Activity (audit logs)
3. Stores everything in memory (cache)
4. Sets `dataLoaded = true`

### Navigation Between Pages
- **Dashboard, Teachers, Classrooms, Students pages** all read from the cache
- **No database calls** when switching between pages
- **Instant loading** (0ms) - just reading from memory

### When Cache Updates (Auto-Refresh)

#### After Database Operations:
When you perform any of these operations, cache automatically refreshes:

1. **Enroll Student** → calls `refreshData('students')`
2. **Remove Student from Classroom** → calls `refreshData('students')`
3. **Reactivate Enrollment** → calls `refreshData('students')`
4. **Update Student Status** → calls `refreshData('students')`
5. **Create/Update Classroom** → calls `refreshData('classrooms')`

#### What refreshData Does:
- Fetches latest data from database
- Updates the cache in memory
- UI automatically re-renders with new data
- You see updated counts/enrollments immediately

### Manual Refresh
- **Browser Refresh (F5/Cmd+R)**: Clears cache, loads everything fresh from database
- **Force Refresh**: If added, would call `loadAdminData(true)` to bypass cache check

## Current Behavior

### Good ✅
- First page load: ~2 seconds (fetches all data)
- Navigation: Instant (uses cache)
- After operations: Auto-refreshes affected data

### Limitations ⚠️
- Cache doesn't auto-update if someone else makes changes
- Must manually refresh browser to see changes made by others
- No real-time updates

## Future Improvements (Optional)

### Option 1: Periodic Auto-Refresh
```javascript
// In AdminContext
useEffect(() => {
  const interval = setInterval(() => {
    loadAdminData(true); // Refresh every 5 minutes
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

### Option 2: Real-Time Subscriptions
```javascript
// Listen to database changes
const subscription = supabase
  .channel('db-changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'student_enrollments' 
  }, (payload) => {
    refreshData('students'); // Auto-refresh when data changes
  })
  .subscribe();
```

### Option 3: Refresh Button
Add a refresh button in header to manually trigger cache update without full page reload.

## Summary

**Cache Lifecycle:**
1. **Load once** on app startup
2. **Use cache** for all page navigation
3. **Auto-refresh** after your database operations
4. **Manual refresh** (F5) for external changes

**Performance:**
- Before: 2 sec load on EVERY page visit
- After: 2 sec first load, 0ms for all subsequent navigation
