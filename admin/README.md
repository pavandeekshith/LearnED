# LearnED Admin Dashboard

A separate React application for managing the LearnED platform's administrative functions.

## Overview

This is a standalone admin application that provides secure access to:
- Dashboard with system overview
- Classroom management
- Teacher management  
- Student management

## Features

- **Secure Authentication**: Admin-only access with Supabase authentication
- **Real-time Data**: Live updates from the LearnED database
- **Responsive Design**: Works on desktop and mobile devices
- **Role-based Access**: Only users with admin role can access the system

## Installation

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   # Copy the Supabase credentials from ../frontend/.env
   # Update the .env file with your Supabase URL and keys
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The admin app will run on http://localhost:3002

## Project Structure

```
admin/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ClassroomList.js
│   │   ├── LoginModal.js
│   │   └── ProtectedRoute.js
│   ├── contexts/
│   │   ├── AdminContext.js
│   │   └── AuthContext.js
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── AdminClassrooms.js
│   │   ├── AdminDashboard.js
│   │   ├── AdminStudents.js
│   │   └── AdminTeachers.js
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Routes

- `/` - Admin Dashboard (default)
- `/classrooms` - Classroom Management
- `/teachers` - Teacher Management
- `/students` - Student Management

## Authentication

- Only users with `user_type = 'admin'` can access the system
- Authentication is handled through Supabase
- Automatic logout if user doesn't have admin privileges

## Development

### Scripts

- `npm start` - Start development server on port 3002
- `npm build` - Build for production
- `npm test` - Run tests

### Environment Variables

Required environment variables:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `PORT` - Port for the development server (default: 3002)

## Security

- Separate application from main website
- Admin-only authentication
- Row Level Security (RLS) policies in Supabase
- No public access to admin routes

## Deployment

To deploy the admin app separately:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting provider
3. Configure routing to serve the admin app on a subdomain or path
   - Example: `admin.learned.com` or `learned.com/admin`

## Contributing

When making changes to the admin app:
1. Test all authentication flows
2. Verify admin-only access restrictions
3. Ensure data loading works correctly
4. Test all CRUD operations

## Support

For admin access issues, contact the development team.
