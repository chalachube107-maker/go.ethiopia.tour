import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';

interface Package {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  price: number;
  image_url: string;
  difficulty_level: string;
  featured: boolean;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string;
  popular: boolean;
}

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [packagesResult, destinationsResult] = await Promise.all([
        supabase
          .from('packages')
          .select('*')
          .eq('active', true)
          .eq('featured', true)
          .limit(3),
        supabase
          .from('destinations')
          .select('*')
          .eq('popular', true)
          .limit(4),
      ]);

      if (packagesResult.data) setFeaturedPackages(packagesResult.data);
      if (destinationsResult.data) setPopularDestinations(destinationsResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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
    <div>
      <section
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.pexels.com/photos/11371145/pexels-photo-11371145.jpeg)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover the Wonders of Ethiopia
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience ancient history, breathtaking landscapes, and vibrant cultures
            </p>
            <Link
              to="/packages"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
            >
              <span>Explore Tours</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose GO ETHIOPIA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer unforgettable experiences with expert guides, comfortable accommodations, and authentic cultural encounters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p className="text-gray-600">
                Local experts with deep knowledge of Ethiopian history and culture
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Destinations</h3>
              <p className="text-gray-600">
                Access to exclusive locations and authentic cultural experiences
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Tours available year-round with customizable itineraries
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Tour Packages
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked experiences for the ultimate Ethiopian adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <Link
                key={pkg.id}
                to={`/packages/${pkg.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.image_url}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {pkg.duration_days} Days
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition">
                    {pkg.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {pkg.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">
                      {pkg.price.toLocaleString()} ETB
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {pkg.difficulty_level}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/packages"
              className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold text-lg"
            >
              <span>View All Packages</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Explore the most sought-after locations in Ethiopia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <div
                key={destination.id}
                className="relative h-80 rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={destination.image_url}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                    <p className="text-sm line-clamp-2">{destination.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Your Ethiopian Adventure?</h2>
          <p className="text-xl mb-8">
            Join thousands of travelers who have discovered the magic of Ethiopia with us
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center space-x-2 bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            <span>Book Your Tour Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
