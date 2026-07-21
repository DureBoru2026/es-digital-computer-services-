import React, { useEffect, useState } from 'react';
import { Clock, ArrowRight, Eye } from 'lucide-react';
import { ProductService } from '../types';
import { formatETB } from '../utils';

interface RecentlyViewedProps {
  onSelect: (product: ProductService) => void;
  // This prop is used to trigger a refresh from outside if needed, 
  // but we mostly rely on sessionStorage changes
  lastViewedId?: string;
}

export default function RecentlyViewed({ onSelect, lastViewedId }: RecentlyViewedProps) {
  const [items, setItems] = useState<ProductService[]>([]);

  useEffect(() => {
    const loadItems = () => {
      const stored = sessionStorage.getItem('recently_viewed');
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse recently viewed items', e);
        }
      }
    };

    loadItems();
    
    // Listen for storage events (though sessionStorage doesn't trigger 'storage' event in same tab)
    // We'll use the lastViewedId prop to force updates when a new item is added
  }, [lastViewedId]);

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0EA5E9]" />
          Recently Viewed
        </h4>
        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
          {items.length} Items
        </span>
      </div>
      
      <div className="divide-y divide-slate-50">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-[11px] font-bold text-slate-900 truncate group-hover:text-[#0EA5E9] transition-colors">
                  {item.title}
                </h5>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  {formatETB(item.price)}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">
                    {item.category.replace('_', ' ')}
                  </span>
                  <button className="text-[#0EA5E9] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50/50 text-center">
        <p className="text-[9px] text-slate-400 font-medium">
          Last 5 items session history
        </p>
      </div>
    </div>
  );
}
