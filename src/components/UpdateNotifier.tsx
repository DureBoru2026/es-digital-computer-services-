import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UpdateNotifier() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'updated' | 'error'>('idle');

  const checkUpdates = () => {
    setStatus('checking');
    // Simulate update check
    setTimeout(() => {
      setStatus('updated');
      setTimeout(() => setStatus('idle'), 5000);
    }, 2000);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence mode="wait">
        {status === 'idle' ? (
          <motion.button
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={checkUpdates}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full text-[11px] font-bold shadow-xl hover:bg-slate-700 transition-all border border-slate-700/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Check for Updates</span>
          </motion.button>
        ) : status === 'checking' ? (
          <motion.div
            key="checking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-full text-[11px] font-bold shadow-xl border border-sky-500/50"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Checking cloud servers...</span>
          </motion.div>
        ) : status === 'updated' ? (
          <motion.div
            key="updated"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-[11px] font-bold shadow-xl border border-green-500/50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>You're up to date!</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
