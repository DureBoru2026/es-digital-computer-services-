import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, XCircle, AlertCircle, Phone, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrackResult {
  id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  serviceTitle: string;
  bookingDate: string;
  paymentStatus?: 'unpaid' | 'paid' | 'partial' | 'waived';
}

export default function ServiceTracker() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setError('No active service found for this Reference ID or Phone Number.');
      }
    } catch (err) {
      setError('Unable to reach the tracking server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: TrackResult['status']) => {
    switch (status) {
      case 'completed': return { icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />, label: 'Service Completed', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' };
      case 'confirmed': return { icon: <Clock className="w-6 h-6 text-sky-500" />, label: 'In Progress / Confirmed', bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700' };
      case 'cancelled': return { icon: <XCircle className="w-6 h-6 text-rose-500" />, label: 'Cancelled', bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700' };
      default: return { icon: <Clock className="w-6 h-6 text-amber-500" />, label: 'Pending Review', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' };
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-4xl mx-auto">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          Live Service Status
        </div>
        <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Track Your Repair</h2>
        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
          Enter your Booking ID or the phone number you used during drop-off to see the real-time status of your computer service or digital request.
        </p>
      </div>

      <form onSubmit={handleTrack} className="relative max-w-lg mx-auto mb-10">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
          <Hash className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="e.g. 0912345678 or BK-1234"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{loading ? 'Tracking...' : 'Track'}</span>
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 md:p-8 rounded-[2rem] border-2 ${getStatusConfig(result.status).bg} ${getStatusConfig(result.status).border} ${getStatusConfig(result.status).text} relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] -mr-16 -mt-16 rounded-full" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                {getStatusConfig(result.status).icon}
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black tracking-tight">{result.serviceTitle}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] font-bold opacity-80">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Booked: {result.bookingDate}</span>
                    <span className="flex items-center gap-1.5 uppercase tracking-wider"><Hash className="w-3.5 h-3.5" /> ID: {result.id}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur rounded-2xl border border-current/10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <span className="text-sm font-black uppercase tracking-wide">{getStatusConfig(result.status).label}</span>
                </div>
              </div>

              {result.paymentStatus && (
                <div className="px-6 py-4 bg-white/50 rounded-2xl border border-current/10 text-center md:text-right min-w-[140px]">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Payment Status</p>
                  <p className="text-sm font-black uppercase tracking-tight">{result.paymentStatus}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
          {[
            { icon: <Clock className="w-5 h-5" />, title: 'Pending', desc: 'Initial check-in' },
            { icon: <Loader2 className="w-5 h-5" />, title: 'Confirmed', desc: 'Technician assigned' },
            { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Completed', desc: 'Ready for pickup' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                {step.icon}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">{step.title}</p>
                <p className="text-[10px] text-slate-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
