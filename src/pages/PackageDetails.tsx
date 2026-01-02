import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Users, MapPin, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface PackageDetails {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  price: number;
  max_participants: number;
  available_slots: number;
  includes: string;
  excludes: string;
  itinerary: string;
  difficulty_level: string;
  image_url: string;
  images: string;
  destinations?: {
    name: string;
    description: string;
  };
}

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<PackageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (id) {
      loadPackage();
    }
  }, [id]);

  const loadPackage = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*, destinations(name, description)')
        .eq('id', id)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;
      setPkg(data);
    } catch (error) {
      console.error('Error loading package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    navigate('/booking', {
      state: {
        packageId: pkg?.id,
        packageTitle: pkg?.title,
        price: pkg?.price,
        participants,
        travelDate,
        specialRequests,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
          <Link to="/packages" className="text-emerald-600 hover:text-emerald-700">
            Browse all packages
          </Link>
        </div>
      </div>
    );
  }

  const includes = pkg.includes ? JSON.parse(pkg.includes) : [];
  const excludes = pkg.excludes ? JSON.parse(pkg.excludes) : [];
  const itinerary = pkg.itinerary ? JSON.parse(pkg.itinerary) : [];
  const totalPrice = pkg.price * participants;
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <div className="text-white">
              {pkg.destinations && (
                <div className="flex items-center text-emerald-400 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{pkg.destinations.name}</span>
                </div>
              )}
              <h1 className="text-5xl font-bold mb-4">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{pkg.duration_days} Days</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Max {pkg.max_participants} People</span>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full capitalize">
                  {pkg.difficulty_level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
              <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              <div className="space-y-6">
                {itinerary.map((day: { day: number; title: string; activities: string[] }, index: number) => (
                  <div key={index} className="border-l-4 border-emerald-600 pl-6">
                    <h3 className="text-lg font-semibold text-emerald-600 mb-2">
                      Day {day.day}: {day.title}
                    </h3>
                    <ul className="space-y-2">
                      {day.activities.map((activity: string, actIndex: number) => (
                        <li key={actIndex} className="text-gray-700 flex items-start">
                          <span className="text-emerald-600 mr-2">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-2" />
                  What's Included
                </h2>
                <ul className="space-y-3">
                  {includes.map((item: string, index: number) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <XCircle className="h-6 w-6 text-red-600 mr-2" />
                  What's Excluded
                </h2>
                <ul className="space-y-3">
                  {excludes.map((item: string, index: number) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <div className="mb-6">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {pkg.price.toLocaleString()} ETB
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={pkg.available_slots}
                    value={participants}
                    onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {pkg.available_slots} spots available
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Travel Date
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Any special requirements or requests?"
                  />
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Price per person:</span>
                  <span className="font-semibold">{pkg.price.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Travelers:</span>
                  <span className="font-semibold">{participants}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-emerald-600">{totalPrice.toLocaleString()} ETB</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!travelDate || pkg.available_slots < participants}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user ? 'Proceed to Booking' : 'Login to Book'}
              </button>

              {!user && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  You need to login to make a booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
