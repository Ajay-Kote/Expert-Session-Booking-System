import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { Calendar, Clock, Star, Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ExpertDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [expert, setExpert] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const res = await axios.get(`/api/experts/${id}`);
        setExpert(res.data.expert);
        setBookedSlots(res.data.bookedSlots);
        
        if (res.data.expert.availableSlots.length > 0) {
          setSelectedDate(res.data.expert.availableSlots[0].date);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load expert details');
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time booking updates
    socket.on('slotBooked', (data) => {
      // If the booking is for this expert, add it to our disabled slots list
      if (data.expertId === id) {
        setBookedSlots(prev => [...prev, { date: data.date, slot: data.slot }]);
      }
    });

    return () => {
      socket.off('slotBooked');
    };
  }, [socket, id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-32">
      <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-600 font-medium bg-red-50 rounded-xl max-w-2xl mx-auto">
      {error}
    </div>
  );

  if (!expert) return null;

  const currentDaySlots = expert.availableSlots.find(d => d.date === selectedDate)?.slots || [];
  
  const isSlotBooked = (date, time) => {
    return bookedSlots.some(b => b.date === date && b.slot === time);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to experts</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <img 
              src={expert.imageUrl} 
              alt={expert.name} 
              className="w-32 h-32 rounded-xl object-cover ring-4 ring-white shadow-md bg-white"
            />
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full font-semibold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {expert.rating.toFixed(1)}
              </div>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{expert.name}</h1>
            <div className="flex flex-wrap gap-4 text-slate-600 font-medium mb-6">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                <Briefcase className="w-4 h-4 text-brand-600" />
                {expert.category}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 text-brand-600" />
                {expert.yearsOfExperience} Years Exp.
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-3">About</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {expert.about}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-brand-600" />
          Book a Session
        </h2>

        <div className="grid md:grid-cols-[1fr_2fr] gap-8">
          {/* Date Picker */}
          <div>
            <h3 className="font-semibold text-slate-700 mb-4 uppercase tracking-wider text-sm">Select Date</h3>
            <div className="flex flex-col gap-2">
              {expert.availableSlots.map(day => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`px-4 py-3 rounded-xl text-left transition-all font-medium border
                    ${selectedDate === day.date 
                      ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50'
                    }`}
                >
                  {format(parseISO(day.date), 'EEEE, MMM d')}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div>
             <h3 className="font-semibold text-slate-700 mb-4 uppercase tracking-wider text-sm">Available Time</h3>
             {selectedDate ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                 {currentDaySlots.map(time => {
                   const booked = isSlotBooked(selectedDate, time);
                   return (
                     <button
                       key={time}
                       disabled={booked}
                       onClick={() => navigate(`/book/${expert._id}?date=${selectedDate}&time=${time}`)}
                       className={`px-4 py-3 rounded-xl font-medium transition-all text-center border
                         ${booked 
                           ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                           : 'bg-white border-brand-200 text-brand-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 shadow-sm hover:shadow-md'
                         }`}
                     >
                       {time}
                     </button>
                   );
                 })}
                 {currentDaySlots.length === 0 && (
                   <div className="col-span-full p-4 text-center text-slate-500 bg-slate-50 rounded-xl">
                     No slots available for this date.
                   </div>
                 )}
               </div>
             ) : (
               <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                 Please select a date first
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailPage;
