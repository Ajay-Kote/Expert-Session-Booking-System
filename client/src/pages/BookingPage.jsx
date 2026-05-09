import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Mail, Phone, FileText, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    notes: ''
  });

  useEffect(() => {
    if (!date || !time) {
      navigate(`/experts/${id}`);
      return;
    }

    const fetchExpert = async () => {
      try {
        const res = await axios.get(`/api/experts/${id}`);
        setExpert(res.data.expert);
      } catch {
        toast.error('Failed to load expert details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id, date, time, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/api/bookings', {
        expertId: id,
        date,
        slot: time,
        ...formData
      });
      
      setSuccess(true);
      toast.success('Session booked successfully!');
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(err.response.data.message || 'This slot was just booked by someone else.');
        // Redirect back to expert page to choose another slot
        setTimeout(() => navigate(`/experts/${id}`), 3000);
      } else {
        toast.error(err.response?.data?.message || 'Failed to book session. Please try again.');
      }
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-brand-600" /></div>
  );

  if (success) return (
    <div className="max-w-xl mx-auto text-center py-20 animate-fade-in">
      <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Booking Confirmed!</h1>
      <p className="text-lg text-slate-600 mb-8">
        You have successfully booked a session with {expert.name}.
        We've sent a confirmation to <span className="font-semibold">{formData.userEmail}</span>.
      </p>
      <button 
        onClick={() => navigate('/my-bookings')}
        className="btn-primary text-lg px-8 py-3"
      >
        View My Bookings
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to availability</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row items-center gap-6">
          <img src={expert.imageUrl} alt={expert.name} className="w-20 h-20 rounded-full object-cover shadow-sm ring-2 ring-white" />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Confirm your session</h2>
            <p className="text-slate-600">with {expert.name}</p>
          </div>
          <div className="md:ml-auto flex flex-col gap-2 text-sm font-medium text-slate-700 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>{format(parseISO(date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </label>
                <input 
                  type="text" name="userName" required 
                  className="input-field" placeholder="John Doe"
                  value={formData.userName} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <input 
                  type="email" name="userEmail" required 
                  className="input-field" placeholder="john@example.com"
                  value={formData.userEmail} onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Phone Number
              </label>
              <input 
                type="tel" name="userPhone" required 
                className="input-field" placeholder="+1 (555) 000-0000"
                value={formData.userPhone} onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Any notes for the expert? (Optional)
              </label>
              <textarea 
                name="notes" rows="4" 
                className="input-field resize-none" placeholder="Share any specific topics or questions you'd like to discuss..."
                value={formData.notes} onChange={handleChange}
              ></textarea>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Confirming Booking...</>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
