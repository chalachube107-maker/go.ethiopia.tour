# GO ETHIOPIA - Tour and Travel Management System

A complete, production-ready web-based tour and travel management system built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Public Features
- Modern, responsive homepage with hero section and featured packages
- Browse and search tour packages with filters (difficulty, price)
- Detailed package information with itineraries and inclusions
- Popular destinations showcase
- About Us and Contact pages
- Mobile-responsive design

### Traveler Features
- User registration and secure authentication
- Browse and book tour packages
- Multi-step booking process with payment integration
- Personal dashboard with booking history
- View booking details and status
- Cancel confirmed bookings
- Payment options: Chapa, TeleBirr, CBE Birr, Credit Card

### Admin Features
- Comprehensive admin dashboard with statistics
- View total revenue, bookings, packages, and users
- Manage bookings (confirm, cancel, update status)
- Manage tour packages (activate, deactivate)
- View recent bookings and user information
- Real-time statistics and reports

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Supabase (PostgreSQL database)
- Supabase Authentication
- Row Level Security (RLS)
- Real-time data synchronization

## Database Schema

The system includes the following tables:

- **user_profiles**: User information and roles
- **destinations**: Ethiopian tourist destinations
- **packages**: Tour package details
- **bookings**: Customer bookings
- **payments**: Payment transactions
- **reviews**: User reviews (future feature)

All tables have Row Level Security enabled with role-based access control.

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Setup Instructions

See [SETUP.md](./SETUP.md) for detailed setup instructions including:
- Environment variable configuration
- Database initialization
- Creating an admin account
- Payment gateway setup

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Navbar.tsx     # Main navigation
│   ├── Footer.tsx     # Site footer
│   └── ProtectedRoute.tsx  # Route protection
├── contexts/          # React contexts
│   └── AuthContext.tsx     # Authentication state
├── lib/               # Utilities and configurations
│   └── supabase.ts    # Supabase client
├── pages/             # Page components
│   ├── Home.tsx       # Landing page
│   ├── Packages.tsx   # Package listing
│   ├── PackageDetails.tsx  # Package details
│   ├── Booking.tsx    # Booking flow
│   ├── Dashboard.tsx  # User dashboard
│   ├── AdminDashboard.tsx  # Admin dashboard
│   ├── Login.tsx      # Login page
│   ├── Register.tsx   # Registration page
│   ├── About.tsx      # About page
│   └── Contact.tsx    # Contact page
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## User Roles

### Traveler (Default)
- Browse and book packages
- Manage personal bookings
- View booking history

### Admin
- All traveler features
- Access admin dashboard
- Manage bookings and packages
- View system statistics

### System Admin
- All admin features
- User management
- System configuration

## Security Features

- Secure authentication with Supabase Auth
- Password hashing
- Row Level Security on all database tables
- Role-based access control
- Protected routes for authenticated users
- Admin-only routes

## Payment Integration

The system includes mock payment integration with support for Ethiopian payment gateways:
- Chapa
- TeleBirr
- CBE Birr
- International Credit Cards

For production, integrate with actual payment gateway APIs.

## Sample Data

The database comes pre-populated with:
- 8 Ethiopian destinations (Lalibela, Simien Mountains, Axum, etc.)
- 8 tour packages with detailed itineraries
- Complete package information including prices, durations, and inclusions

## Key Features Implementation

### Authentication
- Email/password authentication
- User profile management
- Role-based access control

### Booking System
- Real-time availability checking
- Multi-step booking process
- Payment processing
- Booking confirmation and cancellation

### Admin Dashboard
- Statistics cards (revenue, bookings, packages, users)
- Booking management with status updates
- Package management with activation controls
- Tabbed interface for different views

### Search and Filters
- Search packages by title or description
- Filter by difficulty level
- Filter by price range
- Real-time filtering

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile devices (< 768px)
- Tablets (768px - 1024px)
- Desktop (> 1024px)

## Future Enhancements

- Email notifications for bookings
- Review and rating system
- Advanced reporting and analytics
- Custom package requests
- Multi-language support
- SMS notifications
- Payment gateway integration
- Image upload for packages
- Booking calendar view

## Development

Run in development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Type checking:
```bash
npm run typecheck
```

Linting:
```bash
npm run lint
```

## License

All rights reserved.

## Support

For support, email info@goethiopia.com or visit our contact page.
