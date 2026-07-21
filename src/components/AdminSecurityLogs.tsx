import React, { useState, useEffect } from 'react';
import { Shield, Clock, User, Info, AlertTriangle, AlertOctagon, Search, RefreshCw, Globe } from 'lucide-react';
import { SecurityLog } from '../types';

interface AdminSecurityLogsProps {
  token: string;
}

export default function AdminSecurityLogs({ token }: AdminSecurityLogsProps) {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to load logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.adminUser.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityIcon = (severity: SecurityLog['severity']) => {
    switch (severity) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'critical': return <AlertOctagon className="w-4 h-4 text-red-500" />;
    }
  };

  const getSeverityClass = (severity: SecurityLog['severity']) => {
    switch (severity) {
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'critical': return 'bg-red-50 text-red-700 border-red-100 font-bold';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Security & Administrative Logs
          </h2>
          <p className="text-sm text-slate-500">Audit trail of all sensitive database and system actions.</p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Audit Trail
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs by action, details, or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm"
          />
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-10 h-10 text-slate-200 animate-spin mx-auto" />
              <p className="text-slate-400 font-medium italic">Fetching encrypted logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-2xl">
              <Shield className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium italic">No security events match your criteria.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-xl border ${getSeverityClass(log.severity)}`}>
                      {getSeverityIcon(log.severity)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.action}</h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{log.severity}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{log.details}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <User className="w-3 h-3" /> {log.adminUser}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Globe className="w-3 h-3" /> {log.ip || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end gap-2 text-[10px] text-slate-300 font-mono">
                    ID: {log.id.split('_').pop()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
