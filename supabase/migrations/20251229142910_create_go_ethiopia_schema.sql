/*
  # GO ETHIOPIA - Tour and Travel Management System Database Schema
  
  ## Overview
  Complete database schema for the tour and travel management system with role-based access control.
  
  ## New Tables
  
  ### 1. user_profiles
  - `id` (uuid, primary key) - references auth.users
  - `full_name` (text) - user's full name
  - `phone` (text) - contact number
  - `role` (text) - 'traveler', 'admin', 'system_admin'
  - `created_at` (timestamptz) - account creation timestamp
  - `updated_at` (timestamptz) - last update timestamp
  
  ### 2. destinations
  - `id` (uuid, primary key)
  - `name` (text) - destination name (e.g., "Lalibela", "Simien Mountains")
  - `description` (text) - detailed description
  - `country` (text) - default 'Ethiopia'
  - `image_url` (text) - destination image
  - `popular` (boolean) - featured destination flag
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. packages
  - `id` (uuid, primary key)
  - `destination_id` (uuid) - foreign key to destinations
  - `title` (text) - package title
  - `description` (text) - detailed description
  - `duration_days` (integer) - trip duration
  - `price` (decimal) - package price in ETB
  - `max_participants` (integer) - maximum group size
  - `available_slots` (integer) - current availability
  - `includes` (text) - what's included (JSON array as text)
  - `excludes` (text) - what's excluded (JSON array as text)
  - `itinerary` (text) - day-by-day itinerary (JSON as text)
  - `difficulty_level` (text) - 'easy', 'moderate', 'challenging'
  - `image_url` (text) - main package image
  - `images` (text) - additional images (JSON array as text)
  - `active` (boolean) - package availability status
  - `featured` (boolean) - featured package flag
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. bookings
  - `id` (uuid, primary key)
  - `user_id` (uuid) - foreign key to auth.users
  - `package_id` (uuid) - foreign key to packages
  - `booking_date` (timestamptz) - when booking was made
  - `travel_date` (date) - when trip starts
  - `participants` (integer) - number of travelers
  - `total_amount` (decimal) - total cost
  - `status` (text) - 'pending', 'confirmed', 'cancelled', 'completed'
  - `special_requests` (text) - customer notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. payments
  - `id` (uuid, primary key)
  - `booking_id` (uuid) - foreign key to bookings
  - `amount` (decimal) - payment amount
  - `payment_method` (text) - 'chapa', 'telebirr', 'cbe_birr', 'credit_card'
  - `transaction_id` (text) - external payment reference
  - `status` (text) - 'pending', 'completed', 'failed', 'refunded'
  - `payment_date` (timestamptz) - when payment was made
  - `created_at` (timestamptz)
  
  ### 6. reviews
  - `id` (uuid, primary key)
  - `user_id` (uuid) - foreign key to auth.users
  - `package_id` (uuid) - foreign key to packages (nullable)
  - `destination_id` (uuid) - foreign key to destinations (nullable)
  - `rating` (integer) - 1-5 stars
  - `comment` (text) - review text
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Separate policies for travelers, admins, and system admins
  - Users can only access their own data
  - Admins can manage all content
  - Public read access for destinations and active packages
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'traveler' CHECK (role IN ('traveler', 'admin', 'system_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  country text DEFAULT 'Ethiopia',
  image_url text,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid REFERENCES destinations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  max_participants integer NOT NULL CHECK (max_participants > 0),
  available_slots integer NOT NULL CHECK (available_slots >= 0),
  includes text,
  excludes text,
  itinerary text,
  difficulty_level text DEFAULT 'moderate' CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
  image_url text,
  images text,
  active boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  booking_date timestamptz DEFAULT now(),
  travel_date date NOT NULL,
  participants integer NOT NULL CHECK (participants > 0),
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL CHECK (amount >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('chapa', 'telebirr', 'cbe_birr', 'credit_card')),
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  destination_id uuid REFERENCES destinations(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (package_id IS NOT NULL OR destination_id IS NOT NULL)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination_id);
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(active);
CREATE INDEX IF NOT EXISTS idx_packages_featured ON packages(featured);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_package ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_package ON reviews(package_id);
CREATE INDEX IF NOT EXISTS idx_reviews_destination ON reviews(destination_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

-- RLS Policies for destinations
CREATE POLICY "Anyone can view destinations"
  ON destinations FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert destinations"
  ON destinations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

CREATE POLICY "Admins can update destinations"
  ON destinations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

CREATE POLICY "Admins can delete destinations"
  ON destinations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

-- RLS Policies for packages
CREATE POLICY "Anyone can view active packages"
  ON packages FOR SELECT
  TO authenticated, anon
  USING (active = true);

CREATE POLICY "Admins can view all packages"
  ON packages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

CREATE POLICY "Admins can insert packages"
  ON packages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

CREATE POLICY "Admins can update packages"
  ON packages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

CREATE POLICY "Admins can delete packages"
  ON packages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

CREATE POLICY "Authenticated users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any review"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'system_admin')
    )
  );