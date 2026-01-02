import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookingData = location.state;

  const [paymentMethod, setPaymentMethod] = useState<'chapa' | 'telebirr' | 'cbe_birr' | 'credit_card'>('chapa');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!bookingData || !user) {
    navigate('/packages');
    return null;
  }

  const totalAmount = bookingData.price * bookingData.participants;

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          package_id: bookingData.packageId,
          travel_date: bookingData.travelDate,
          participants: bookingData.participants,
          total_amount: totalAmount,
          status: 'pending',
          special_requests: bookingData.specialRequests || null,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount: totalAmount,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          status: 'completed',
          payment_date: new Date().toISOString(),
        });

      if (paymentError) throw paymentError;

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      const { data: packageData } = await supabase
        .from('packages')
        .select('available_slots')
        .eq('id', bookingData.packageId)
        .single();

      if (packageData) {
        await supabase
          .from('packages')
          .update({ available_slots: packageData.available_slots - bookingData.participants })
          .eq('id', bookingData.packageId);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been successfully confirmed. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-semibold">{bookingData.packageTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Date:</span>
                  <span className="font-semibold">{bookingData.travelDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Travelers:</span>
                  <span className="font-semibold">{bookingData.participants}</span>
                </div>
                {bookingData.specialRequests && (
                  <div>
                    <span className="text-gray-600">Special Requests:</span>
                    <p className="mt-1 text-sm text-gray-700">{bookingData.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-500 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="chapa"
                    checked={paymentMethod === 'chapa'}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                    className="mr-3 h-5 w-5 text-emerald-600"
                  />
                  <div>
                    <div className="font-semibold">Chapa Payment</div>
                    <div className="text-sm text-gray-500">Pay with Chapa</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-500 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="telebirr"
                    checked={paymentMethod === 'telebirr'}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                    className="mr-3 h-5 w-5 text-emerald-600"
                  />
                  <div>
                    <div className="font-semibold">TeleBirr</div>
                    <div className="text-sm text-gray-500">Pay with TeleBirr</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-500 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cbe_birr"
                    checked={paymentMethod === 'cbe_birr'}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                    className="mr-3 h-5 w-5 text-emerald-600"
                  />
                  <div>
                    <div className="font-semibold">CBE Birr</div>
                    <div className="text-sm text-gray-500">Pay with Commercial Bank of Ethiopia</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-500 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                    className="mr-3 h-5 w-5 text-emerald-600"
                  />
                  <div>
                    <div className="font-semibold">Credit Card</div>
                    <div className="text-sm text-gray-500">Pay with Visa or Mastercard</div>
                  </div>
                </label>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  This is a demo payment system. In production, you would be redirected to the actual payment gateway.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per person:</span>
                  <span>{bookingData.price.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of travelers:</span>
                  <span>{bookingData.participants}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600">{totalAmount.toLocaleString()} ETB</span>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By confirming, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
