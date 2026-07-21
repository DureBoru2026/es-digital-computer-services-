import React, { useState } from 'react';
import { Search, UserCheck, PhoneCall, Award, Users, DollarSign, RefreshCw } from 'lucide-react';
import { CustomerRecord } from '../types';
import { formatETB } from '../utils';

interface AdminUsersProps {
  customers: CustomerRecord[];
  onRefresh: () => void;
}

export default function AdminUsers({ customers, onRefresh }: AdminUsersProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c => {
    if (!c) return false;
    const name = c.name || '';
    const contact = c.contact || '';
    const source = c.source || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
           source.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Stats calculation
  const totalLeads = customers.length;
  const highValueBuyers = customers.filter(c => c.spentAmount >= 2000).length;
  const totalClientSpend = customers.reduce((sum, c) => sum + c.spentAmount, 0);

  return (
    <div id="admin-users-subtab" className="space-y-6">
      
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Customer Record Book (CRM)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse leads and registered clients captured via purchase checkout and contact form feedback inquiries.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Book</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: Total Captured */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Captured Customers</span>
            <span className="block font-display font-black text-slate-900 text-2xl mt-0.5">
              {totalLeads}
            </span>
          </div>
        </div>

        {/* Card 2: Total Spent (ETB) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">Reconciled Sales</span>
            <span className="block font-display font-black text-slate-900 text-2xl mt-0.5">
              {formatETB(totalClientSpend)}
            </span>
          </div>
        </div>

        {/* Card 3: Premium Tier */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase">High Value Clients</span>
            <span className="block font-display font-black text-slate-900 text-2xl mt-0.5">
              {highValueBuyers}
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Search */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search customer records by name, phone, email, or client source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* CRM Grid */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-55/60 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4">Contact Number / Email</th>
                <th className="p-4">Acquisition Origin</th>
                <th className="p-4">Reference Filings</th>
                <th className="p-4 pr-6 text-right">Lifetime Approved Billings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-mono text-xs">
                    No matching client records found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, idx) => {
                  const isPremium = c.spentAmount >= 2000;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPremium ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 flex items-center gap-1">
                              {c.name}
                              {isPremium && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                                  Premium Client
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-4 font-mono text-xs text-slate-600">
                        {c.contact}
                      </td>

                      {/* Origin */}
                      <td className="p-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          c.source === 'Purchase'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {c.source}
                        </span>
                      </td>

                      {/* Count */}
                      <td className="p-4 font-mono text-xs">
                        {c.transactionsCount} entries
                      </td>

                      {/* Life value */}
                      <td className="p-4 pr-6 text-right font-mono font-bold text-slate-900">
                        {formatETB(c.spentAmount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
