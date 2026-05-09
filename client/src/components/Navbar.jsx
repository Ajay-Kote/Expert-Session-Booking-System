import { Link } from 'react-router-dom';
import { CalendarDays, UserRound } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors">
            <CalendarDays className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">ExpertBook</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
              Find Experts
            </Link>
            <Link to="/my-bookings" className="flex items-center gap-2 btn-secondary bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200">
              <UserRound className="w-4 h-4" />
              <span>My Bookings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
