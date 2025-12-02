# Database Folder Structure

## 📁 Folders

### `/admin_functions`
Admin-specific database functions for student and classroom management:
- `admin_get_students_with_classrooms.sql` - Get all students with enrollment info
- `admin_update_student_status.sql` - Update student active/inactive status
- `admin_enroll_student_in_classroom.sql` - Enroll student in classroom
- `admin_remove_student_from_classroom.sql` - Remove student from classroom
- `admin_reactivate_student_enrollment.sql` - Reactivate cancelled enrollment
- `admin_student_management_all.sql` - **Master file** with all admin functions

### `/migrations`
Database schema migrations and updates:
- `001_change_classroom_id_to_uuid.sql` - Migration to change classroom ID from varchar to uuid
- `001_rollback_classroom_id.sql` - Rollback script for above migration
- `ENROLLMENT_EXPIRY_HANDLING.md` - Documentation for enrollment expiry automation

### `/automation`
Automated cron jobs and scheduled tasks:
- `auto_handle_expired_enrollments.sql` - Auto-expire old enrollments
- `admin_get_expiring_enrollments.sql` - Get enrollments expiring soon

### `/legacy`
Old SQL files kept for reference:
- `fix_*.sql` - Old fix scripts
- `get_students_classrooms_assignment.sql` - Old version
- `new_complete_schema_with_functions.sql` - Previous schema version
- `complete_teacher_invitation_debug.sql` - Debug scripts

## 📄 Root Database Files

- `complete_schema_with_functions.sql` - **MAIN SCHEMA** - Complete database schema

## 🚀 Usage

### For New Setup
Run `complete_schema_with_functions.sql` first to create the base schema.

### For Admin Functions
Run `/admin_functions/admin_student_management_all.sql` to install all admin functions at once.

### For Migrations
Run migration scripts in order (001, 002, etc.) when needed.

### For Automation
Set up cron jobs using scripts in `/automation` folder.

## ⚠️ Migration Guide: Classroom ID to UUID

**Current State:** `classrooms.id` is `character varying`
**Target State:** `classrooms.id` should be `uuid`

### Before Migration:
1. **BACKUP YOUR DATABASE** 
2. Review the migration script
3. Test in a development environment first

### Running the Migration:
```sql
-- Run in Supabase SQL Editor
\i database/migrations/001_change_classroom_id_to_uuid.sql
```

### After Migration:
1. Update all admin functions to use `uuid` instead of `character varying`
2. Update frontend code to handle uuid classroom IDs
3. Test all enrollment functions

### Important Notes:
- This migration creates a `classroom_id_mapping` table for rollback purposes
- All foreign key relationships are updated automatically
- Admin functions will need parameter type changes: `character varying` → `uuid`

## 📝 Function Parameter Updates Needed After Migration

After running the classroom ID migration, update these function signatures:

```sql
-- Before:
admin_enroll_student_in_classroom(uuid, character varying, character varying)
admin_remove_student_from_classroom(uuid, character varying)
admin_reactivate_student_enrollment(uuid, character varying)

-- After:
admin_enroll_student_in_classroom(uuid, uuid, character varying)
admin_remove_student_from_classroom(uuid, uuid)
admin_reactivate_student_enrollment(uuid, uuid)
```

Run the updated admin function files after migration.
