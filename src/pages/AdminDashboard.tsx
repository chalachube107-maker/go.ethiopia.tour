import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Users, DollarSign, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  totalBookings: number;
  totalRevenue: number;
  totalPackages: number;
  totalUsers: number;
  confirmedBookings: number;
  pendingBookings: number;
}

interface Booking {
  id: string;
  booking_date: string;
  travel_date: string;
  participants: number;
  total_amount: number;
  status: string;
  packages: {
    title: string;
  };
  user_profiles: {
    full_name: string;
  };
}

interface PackageItem {
  id: string;
  title: string;
  price: number;
  duration_days: number;
  available_slots: number;
  active: boolean;
  featured: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalRevenue: 0,
    totalPackages: 0,
    totalUsers: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'packages'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsResult, packagesResult, usersResult, paymentsResult] = await Promise.all([
        supabase.from('bookings').select('*'),
        supabase.from('packages').select('*'),
        supabase.from('user_profiles').select('id'),
        supabase.from('payments').select('amount').eq('status', 'completed'),
      ]);

      const bookings = bookingsResult.data || [];
      const totalRevenue = paymentsResult.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalBookings: bookings.length,
        totalRevenue,
        totalPackages: packagesResult.data?.length || 0,
        totalUsers: usersResult.data?.length || 0,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
      });

      const { data: recentBookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          packages(title),
          user_profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentBookings(recentBookingsData || []);
      setPackages(packagesResult.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      loadDashboardData();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const handleTogglePackageStatus = async (packageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ active: !currentStatus })
        .eq('id', packageId);

      if (error) throw error;
      loadDashboardData();
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Failed to update package status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your tour packages and bookings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">ETB</p>
              </div>
              <DollarSign className="h-12 w-12 text-emerald-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-xs text-gray-500">
                  {stats.confirmedBookings} confirmed
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tour Packages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPackages}</p>
                <p className="text-xs text-gray-500">
                  {packages.filter(p => p.active).length} active
                </p>
              </div>
              <Package className="h-12 w-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Registered travelers</p>
              </div>
              <Users className="h-12 w-12 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'overview'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'bookings'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'packages'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Packages
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Package
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Travel Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-4 py-4 text-sm">{booking.user_profiles.full_name}</td>
                          <td className="px-4 py-4 text-sm">{booking.packages.title}</td>
                          <td className="px-4 py-4 text-sm">
                            {new Date(booking.travel_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            {booking.total_amount.toLocaleString()} ETB
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{booking.packages.title}</h3>
                          <p className="text-sm text-gray-600">{booking.user_profiles.full_name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>Travel: {new Date(booking.travel_date).toLocaleDateString()}</p>
                          <p>Travelers: {booking.participants}</p>
                          <p className="font-semibold text-emerald-600">
                            {booking.total_amount.toLocaleString()} ETB
                          </p>
                        </div>
                        {booking.status === 'pending' && (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                              className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'packages' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Manage Packages</h2>
                  <Link
                    to="/admin/packages/new"
                    className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Package</span>
                  </Link>
                </div>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{pkg.title}</h3>
                          <p className="text-sm text-gray-600">
                            {pkg.duration_days} Days • {pkg.price.toLocaleString()} ETB
                          </p>
                          <p className="text-sm text-gray-600">
                            {pkg.available_slots} slots available
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTogglePackageStatus(pkg.id, pkg.active)}
                            className={`px-3 py-1 rounded text-sm ${
                              pkg.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {pkg.active ? 'Active' : 'Inactive'}
                          </button>
                          {pkg.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
