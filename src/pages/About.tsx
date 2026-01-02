import { MapPin, Award, Heart, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="bg-emerald-600 text-white py-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16, 185, 129, 0.9), rgba(16, 185, 129, 0.9)), url(https://images.pexels.com/photos/11371144/pexels-photo-11371144.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About GO ETHIOPIA</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your gateway to discovering the wonders of Ethiopia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                GO ETHIOPIA was founded with a passion for showcasing the incredible beauty and rich cultural heritage of Ethiopia. We believe that every traveler deserves an authentic, memorable experience that goes beyond typical tourist attractions.
              </p>
              <p>
                With years of experience in the travel industry and deep local knowledge, our team has carefully crafted tours that highlight the best of what Ethiopia has to offer. From the ancient rock-hewn churches of Lalibela to the dramatic landscapes of the Simien Mountains, we bring you closer to the heart of Ethiopia.
              </p>
              <p>
                We work with local communities, expert guides, and trusted partners to ensure that every journey is safe, enriching, and sustainable. Our commitment is to provide you with experiences that create lasting memories while supporting local economies and preserving Ethiopia's natural and cultural treasures.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/12836920/pexels-photo-12836920.jpeg"
              alt="Ethiopian landscape"
              className="rounded-xl shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p className="text-gray-600">
                Local professionals with deep knowledge of Ethiopian history, culture, and geography
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Your safety is our priority with comprehensive insurance and 24/7 support
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Experiences</h3>
              <p className="text-gray-600">
                Genuine cultural encounters and connections with local communities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Destinations</h3>
              <p className="text-gray-600">
                Access to exclusive locations and hidden gems throughout Ethiopia
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the magic of Ethiopia with us
          </p>
          <a
            href="/packages"
            className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Tour Packages
          </a>
        </div>
      </div>
    </div>
  );
}
