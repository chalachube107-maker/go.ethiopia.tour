# GO ETHIOPIA - Setup Guide

## Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values can be found in your Supabase project settings under API.

## Database Setup

The database schema has been automatically created with the following tables:
- user_profiles
- destinations
- packages
- bookings
- payments
- reviews

Sample data for destinations and packages has been pre-populated.

## Creating an Admin Account

To create an admin account:

1. Register a new account through the website at `/register`
2. After registration, manually update the user's role in the database:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'your-user-id-here';
```

Alternatively, for quick testing, you can create a demo admin account:

### Option 1: Via Supabase Dashboard
1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User"
3. Email: `admin@goethiopia.com`
4. Password: `admin123`
5. After creating, go to SQL Editor and run:
```sql
INSERT INTO user_profiles (id, full_name, phone, role)
VALUES (
  'user-id-from-auth-table',
  'System Admin',
  '+251 11 123 4567',
  'admin'
);
```

### Option 2: Via SQL (if you have a user ID)
```sql
-- First, get the user ID from auth.users
SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then update the profile
UPDATE user_profiles SET role = 'admin' WHERE id = 'user-id-here';
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

### Public Features
- Browse tour packages
- View package details
- Search and filter packages
- View destinations
- Contact form

### User Features (Travelers)
- Register and login
- Book tour packages
- Make payments (demo mode)
- View booking history
- Cancel bookings
- Personal dashboard

### Admin Features
- View statistics dashboard
- Manage bookings (confirm/cancel)
- Manage packages (activate/deactivate)
- View all users
- Access booking and payment reports

## Payment Integration

The system includes a mock payment integration with support for:
- Chapa
- TeleBirr
- CBE Birr
- Credit Card

For production deployment, you would need to integrate with actual payment gateways.

## Security Features

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure authentication with Supabase Auth
- Protected routes for authenticated users
- Admin-only routes for administrative functions

## Demo Credentials

After setting up an admin account, use these credentials:
- Email: admin@goethiopia.com
- Password: admin123

For regular users, anyone can register at `/register`.
