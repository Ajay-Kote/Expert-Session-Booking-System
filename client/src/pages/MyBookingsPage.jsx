import { useState } from 'react';
import axios from 'axios';
import { Search, Calendar, Clock, User, FileText, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const MyBookingsPage = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/bookings', { params: { email } });
      setBookings(res.data);
      setHasSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-brand-50 text-brand-700 border-brand-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-600">Enter your email address to view your scheduled sessions.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              required
              className="input-field pl-10 h-12" 
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary h-12 px-8" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Find Bookings'}
          </button>
        </form>
      </div>

      {error && (
        <div className="text-center p-4 bg-red-50 text-red-600 rounded-xl mb-8">
          {error}
        </div>
      )}

      {hasSearched && !loading && bookings.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xl font-medium text-slate-700">No bookings found</p>
          <p className="text-slate-500 mt-2">We couldn't find any sessions booked with {email}.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                
                <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {booking.expertId?.name || 'Unknown Expert'}
                      </h3>
                      <p className="text-brand-600 font-medium">{booking.expertId?.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {format(parseISO(booking.date), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {booking.slot}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Booked by {booking.userName}
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="italic">"{booking.notes}"</p>
                      </div>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
