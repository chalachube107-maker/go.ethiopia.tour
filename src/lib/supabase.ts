import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: 'traveler' | 'admin' | 'system_admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          role?: 'traveler' | 'admin' | 'system_admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'traveler' | 'admin' | 'system_admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          description: string;
          country: string;
          image_url: string | null;
          popular: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      packages: {
        Row: {
          id: string;
          destination_id: string;
          title: string;
          description: string;
          duration_days: number;
          price: number;
          max_participants: number;
          available_slots: number;
          includes: string | null;
          excludes: string | null;
          itinerary: string | null;
          difficulty_level: 'easy' | 'moderate' | 'challenging';
          image_url: string | null;
          images: string | null;
          active: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          package_id: string;
          booking_date: string;
          travel_date: string;
          participants: number;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          special_requests: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          package_id: string;
          booking_date?: string;
          travel_date: string;
          participants: number;
          total_amount: number;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          special_requests?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          amount: number;
          payment_method: 'chapa' | 'telebirr' | 'cbe_birr' | 'credit_card';
          transaction_id: string | null;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          amount: number;
          payment_method: 'chapa' | 'telebirr' | 'cbe_birr' | 'credit_card';
          transaction_id?: string | null;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_date?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          package_id: string | null;
          destination_id: string | null;
          rating: number;
          comment: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
