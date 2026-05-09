import { Link } from 'react-router-dom';
import { Star, Briefcase, ChevronRight } from 'lucide-react';

const ExpertCard = ({ expert }) => {
  return (
    <div className="card flex flex-col group h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <img 
            src={expert.imageUrl} 
            alt={expert.name} 
            className="w-16 h-16 rounded-full object-cover ring-4 ring-brand-50"
          />
          <div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
              {expert.name}
            </h3>
            <p className="text-sm font-medium text-brand-600">{expert.category}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span>{expert.yearsOfExperience} years experience</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{expert.rating.toFixed(1)} rating</span>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {expert.about}
        </p>
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
        <Link 
          to={`/experts/${expert._id}`}
          className="flex items-center justify-center gap-2 w-full text-brand-600 font-medium hover:text-brand-700 transition-colors"
        >
          <span>View Availability</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ExpertCard;
