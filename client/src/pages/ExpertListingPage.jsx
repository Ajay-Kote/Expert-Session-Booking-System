import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Filter, Loader2 } from 'lucide-react';
import ExpertCard from '../components/ExpertCard';

const ExpertListingPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['', 'Software Engineering', 'Product Management', 'UX/UI Design', 'Career Coaching'];

  const fetchExperts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/experts', {
        params: {
          search: searchTerm,
          category,
          page,
          limit: 6
        }
      });
      setExperts(res.data.experts);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load experts');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, page]);

  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchExperts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchExperts]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Find the Perfect <span className="text-brand-600">Expert</span>
        </h1>
        <p className="text-lg text-slate-600">
          Book 1-on-1 sessions with industry leaders and accelerate your career growth today.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search experts by name..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            className="input-field pl-10 appearance-none bg-white"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.filter(Boolean).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 text-brand-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="mt-4 font-medium text-slate-600">Loading experts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
          <p className="font-semibold">{error}</p>
          <button onClick={fetchExperts} className="mt-4 underline hover:text-red-700">Try Again</button>
        </div>
      ) : experts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xl font-semibold text-slate-700">No experts found</p>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map(expert => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8">
              <button 
                className="btn-secondary"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button 
                className="btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpertListingPage;
