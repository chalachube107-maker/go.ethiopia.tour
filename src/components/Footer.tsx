import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="h-8 w-8 text-emerald-500" />
              <span className="text-2xl font-bold text-white">GO ETHIOPIA</span>
            </div>
            <p className="text-sm">
              Your trusted partner for unforgettable Ethiopian adventures. Discover the beauty, culture, and heritage of Ethiopia with our expert-guided tours.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-emerald-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-emerald-500 transition">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li className="hover:text-emerald-500 transition cursor-pointer">Lalibela</li>
              <li className="hover:text-emerald-500 transition cursor-pointer">Simien Mountains</li>
              <li className="hover:text-emerald-500 transition cursor-pointer">Danakil Depression</li>
              <li className="hover:text-emerald-500 transition cursor-pointer">Omo Valley</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">+251 11 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">info@goethiopia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} GO ETHIOPIA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
