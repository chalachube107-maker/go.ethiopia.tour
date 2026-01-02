import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Filter, Clock, MapPin } from 'lucide-react';

interface Package {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  price: number;
  image_url: string;
  difficulty_level: string;
  destination_id: string;
  destinations?: {
    name: string;
  };
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchTerm, difficultyFilter, priceRange]);

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*, destinations(name)')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
      setFilteredPackages(data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = [...packages];

    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((pkg) => pkg.difficulty_level === difficultyFilter);
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter((pkg) => {
        switch (priceRange) {
          case 'low':
            return pkg.price < 10000;
          case 'medium':
            return pkg.price >= 10000 && pkg.price < 25000;
          case 'high':
            return pkg.price >= 25000;
          default:
            return true;
        }
      });
    }

    setFilteredPackages(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="bg-emerald-600 text-white py-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16, 185, 129, 0.9), rgba(16, 185, 129, 0.9)), url(https://images.pexels.com/photos/12836920/pexels-photo-12836920.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Tour Packages</h1>
          <p className="text-xl">Discover our handcrafted Ethiopian adventures</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="challenging">Challenging</option>
                </select>
              </div>
            </div>

            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Prices</option>
                <option value="low">Under 10,000 ETB</option>
                <option value="medium">10,000 - 25,000 ETB</option>
                <option value="high">Over 25,000 ETB</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 text-gray-600">
          Showing {filteredPackages.length} of {packages.length} packages
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
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
                <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{pkg.duration_days} Days</span>
                </div>
              </div>
              <div className="p-6">
                {pkg.destinations && (
                  <div className="flex items-center text-emerald-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{pkg.destinations.name}</span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition">
                  {pkg.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    {pkg.price.toLocaleString()} ETB
                  </span>
                  <span className="text-sm text-gray-500 capitalize px-3 py-1 bg-gray-100 rounded-full">
                    {pkg.difficulty_level}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No packages found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
