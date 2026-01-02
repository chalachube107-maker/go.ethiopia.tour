# API Guide - GO ETHIOPIA

This guide provides information on how to interact with the Supabase database for the GO ETHIOPIA Tour and Travel Management System.

## Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Create user profile
await supabase.from('user_profiles').insert({
  id: data.user.id,
  full_name: 'John Doe',
  phone: '+251 91 123 4567',
  role: 'traveler',
});
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

## Packages

### Get All Active Packages
```typescript
const { data, error } = await supabase
  .from('packages')
  .select('*, destinations(name)')
  .eq('active', true)
  .order('created_at', { ascending: false });
```

### Get Package by ID
```typescript
const { data, error } = await supabase
  .from('packages')
  .select('*, destinations(name, description)')
  .eq('id', packageId)
  .eq('active', true)
  .maybeSingle();
```

### Search Packages
```typescript
const { data, error } = await supabase
  .from('packages')
  .select('*, destinations(name)')
  .eq('active', true)
  .ilike('title', `%${searchTerm}%`);
```

### Filter Packages by Difficulty
```typescript
const { data, error } = await supabase
  .from('packages')
  .select('*')
  .eq('active', true)
  .eq('difficulty_level', 'moderate');
```

### Filter Packages by Price Range
```typescript
const { data, error } = await supabase
  .from('packages')
  .select('*')
  .eq('active', true)
  .gte('price', minPrice)
  .lte('price', maxPrice);
```

## Bookings

### Create Booking
```typescript
const { data, error } = await supabase
  .from('bookings')
  .insert({
    user_id: userId,
    package_id: packageId,
    travel_date: '2024-06-15',
    participants: 2,
    total_amount: 30000,
    status: 'pending',
    special_requests: 'Vegetarian meals preferred',
  })
  .select()
  .single();
```

### Get User Bookings
```typescript
const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    packages(id, title, duration_days, image_url),
    payments(payment_method, status, transaction_id)
  `)
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Update Booking Status
```typescript
const { error } = await supabase
  .from('bookings')
  .update({ status: 'confirmed' })
  .eq('id', bookingId);
```

### Cancel Booking
```typescript
const { error } = await supabase
  .from('bookings')
  .update({ status: 'cancelled' })
  .eq('id', bookingId);
```

## Payments

### Create Payment
```typescript
const { data, error } = await supabase
  .from('payments')
  .insert({
    booking_id: bookingId,
    amount: totalAmount,
    payment_method: 'chapa',
    transaction_id: 'TXN123456789',
    status: 'completed',
    payment_date: new Date().toISOString(),
  });
```

### Get Payment by Booking
```typescript
const { data, error } = await supabase
  .from('payments')
  .select('*')
  .eq('booking_id', bookingId)
  .maybeSingle();
```

## Destinations

### Get All Destinations
```typescript
const { data, error } = await supabase
  .from('destinations')
  .select('*')
  .order('name');
```

### Get Popular Destinations
```typescript
const { data, error } = await supabase
  .from('destinations')
  .select('*')
  .eq('popular', true);
```

## Admin Operations

### Get Dashboard Statistics
```typescript
// Get total bookings
const { count: totalBookings } = await supabase
  .from('bookings')
  .select('*', { count: 'exact', head: true });

// Get total revenue
const { data: payments } = await supabase
  .from('payments')
  .select('amount')
  .eq('status', 'completed');

const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

// Get total packages
const { count: totalPackages } = await supabase
  .from('packages')
  .select('*', { count: 'exact', head: true });

// Get total users
const { count: totalUsers } = await supabase
  .from('user_profiles')
  .select('*', { count: 'exact', head: true });
```

### Update Package Status
```typescript
const { error } = await supabase
  .from('packages')
  .update({ active: false })
  .eq('id', packageId);
```

### Get All Bookings (Admin)
```typescript
const { data, error } = await supabase
  .from('bookings')
  .select(`
    *,
    packages(title),
    user_profiles(full_name)
  `)
  .order('created_at', { ascending: false });
```

## User Profiles

### Get User Profile
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle();
```

### Update User Profile
```typescript
const { error } = await supabase
  .from('user_profiles')
  .update({
    full_name: 'Jane Doe',
    phone: '+251 91 234 5678',
  })
  .eq('id', userId);
```

### Update User Role (Admin Only)
```typescript
const { error } = await supabase
  .from('user_profiles')
  .update({ role: 'admin' })
  .eq('id', userId);
```

## Real-time Subscriptions

### Subscribe to New Bookings (Admin)
```typescript
const channel = supabase
  .channel('bookings')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'bookings',
    },
    (payload) => {
      console.log('New booking:', payload.new);
      // Handle new booking
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();
```

### Subscribe to Booking Updates
```typescript
const channel = supabase
  .channel(`booking:${bookingId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'bookings',
      filter: `id=eq.${bookingId}`,
    },
    (payload) => {
      console.log('Booking updated:', payload.new);
      // Handle booking update
    }
  )
  .subscribe();
```

## Error Handling

Always handle errors appropriately:

```typescript
try {
  const { data, error } = await supabase
    .from('packages')
    .select('*');

  if (error) throw error;

  // Process data
  console.log(data);
} catch (error) {
  console.error('Error fetching packages:', error);
  // Show user-friendly error message
}
```

## Row Level Security

All tables have RLS enabled. Users can only:
- View their own bookings and payments
- View active packages
- View all destinations
- Update their own profile

Admins can:
- View all bookings and payments
- Manage packages
- Update booking statuses
- View all user profiles

## Best Practices

1. Always use `.maybeSingle()` when expecting 0 or 1 result
2. Use `.single()` only when you're certain a result exists
3. Handle errors appropriately
4. Use TypeScript for type safety
5. Implement proper loading states
6. Use optimistic updates for better UX
7. Implement proper error messages for users

## Rate Limits

Supabase has rate limits based on your plan. For production:
- Implement request caching where appropriate
- Use pagination for large datasets
- Batch operations when possible
- Monitor API usage in Supabase dashboard
