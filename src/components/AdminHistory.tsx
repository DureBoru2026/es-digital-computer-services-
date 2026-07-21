import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ShieldCheck, 
  Download, 
  ArrowUpDown, 
  Smartphone, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Check, 
  FileText
} from 'lucide-react';
import { Transaction } from '../types';
import { formatETB } from '../utils';

interface AdminHistoryProps {
  transactions: Transaction[];
  onRefresh: () => void;
}

type SortField = 'date' | 'amount' | 'customerName';
type SortOrder = 'asc' | 'desc';

export default function AdminHistory({ transactions, onRefresh }: AdminHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGateway, setFilterGateway] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    let totalValue = 0;
    let approvedValue = 0;
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    transactions.forEach(tx => {
      totalValue += tx.amount;
      if (tx.status === 'approved') {
        approvedValue += tx.amount;
        approvedCount++;
      } else if (tx.status === 'pending') {
        pendingCount++;
      } else if (tx.status === 'rejected') {
        rejectedCount++;
      }
    });

    return {
      totalTransactions: transactions.length,
      totalValue,
      approvedValue,
      pendingCount,
      approvedCount,
      rejectedCount,
    };
  }, [transactions]);

  // Handle Sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(tx => tx.status === filterStatus);
    }

    // Gateway filter
    if (filterGateway !== 'all') {
      result = result.filter(tx => tx.paymentGateway === filterGateway);
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx => 
        tx.referenceNumber.toLowerCase().includes(query) ||
        tx.customerName.toLowerCase().includes(query) ||
        (tx.customerPhone && tx.customerPhone.toLowerCase().includes(query)) ||
        tx.purpose.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'customerName') {
        comparison = a.customerName.localeCompare(b.customerName);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchQuery, filterStatus, filterGateway, sortField, sortOrder]);

  const handleCopyText = (text: string, txId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(txId);
    setTimeout(() => setCopiedTxId(null), 2500);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Date,Reference Number,Gateway,Customer Name,Phone,Purpose,Amount,Status,Notes\n';
    const rows = processedTransactions.map(tx => {
      const escapedNotes = tx.notes ? tx.notes.replace(/"/g, '""') : '';
      const escapedPurpose = tx.purpose.replace(/"/g, '""');
      return `"${tx.id}","${new Date(tx.date).toISOString()}","${tx.referenceNumber}","${tx.paymentGateway}","${tx.customerName}","${tx.customerPhone || ''}","${escapedPurpose}",${tx.amount},"${tx.status}","${escapedNotes}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `es_digital_transactions_history_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-history-tab" className="space-y-6">
      
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0EA5E9]" />
            <span>Transaction Auditing Log & History</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete historical registry of payments received. Check timestamps, gateway, customer contact, and verification trails.
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            disabled={processedTransactions.length === 0}
            className="flex-1 sm:flex-initial px-3.5 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({processedTransactions.length})</span>
          </button>
        </div>
      </div>

      {/* KPI / Audit Metrics Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Total Receipts</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{stats.totalTransactions}</span>
            <span className="text-[10px] text-slate-400 font-mono">records</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Total Value Submitted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{formatETB(stats.totalValue)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between border-l-4 border-l-green-500">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Reconciliation Confirmed</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-green-700">{formatETB(stats.approvedValue)}</span>
            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
              {stats.approvedCount} orders
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Pending Reconciliation</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-600">{stats.pendingCount}</span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
              Needs action
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by receipt/reference, name, phone, purpose..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0EA5E9]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0EA5E9] font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Verification</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Gateway Filter */}
        <div>
          <select
            value={filterGateway}
            onChange={(e) => setFilterGateway(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0EA5E9] font-medium text-slate-700"
          >
            <option value="all">All Gateways</option>
            <option value="telebirr">telebirr logs</option>
            <option value="CBE Birr">CBE Birr logs</option>
          </select>
        </div>
      </div>

      {/* Sort Info Bar */}
      <div className="flex justify-between items-center text-xs text-slate-500 px-1">
        <div>
          Showing <strong>{processedTransactions.length}</strong> of {transactions.length} records chronologically
        </div>
        <div className="flex items-center gap-3">
          <span>Sort By:</span>
          <button 
            onClick={() => toggleSort('date')} 
            className={`font-semibold flex items-center gap-1 hover:text-slate-800 ${sortField === 'date' ? 'text-[#0EA5E9]' : ''}`}
          >
            Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => toggleSort('amount')} 
            className={`font-semibold flex items-center gap-1 hover:text-slate-800 ${sortField === 'amount' ? 'text-[#0EA5E9]' : ''}`}
          >
            Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => toggleSort('customerName')} 
            className={`font-semibold flex items-center gap-1 hover:text-slate-800 ${sortField === 'customerName' ? 'text-[#0EA5E9]' : ''}`}
          >
            Customer {sortField === 'customerName' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Main Log Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Reference Code & Gateway</th>
                <th className="p-4">Customer Contact Info</th>
                <th className="p-4">Timestamp & Date</th>
                <th className="p-4">Purchased Product / Purpose</th>
                <th className="p-4">Price</th>
                <th className="p-4 pr-6">Audited Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {processedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400 font-mono">
                    No transactions matched your query.
                  </td>
                </tr>
              ) : (
                processedTransactions.map((tx) => {
                  const dateObj = new Date(tx.date);
                  const formattedDate = dateObj.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  const formattedTime = dateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Reference Code & Gateway */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2.5">
                          {tx.paymentGateway === 'telebirr' ? (
                            <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-mono text-[9px] font-bold" title="telebirr">
                              TB
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded bg-purple-50 text-purple-600 flex items-center justify-center font-mono text-[9px] font-bold" title="CBE Birr">
                              CBE
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-bold text-slate-900 tracking-wider uppercase">
                                {tx.referenceNumber}
                              </span>
                              <button
                                onClick={() => handleCopyText(tx.referenceNumber, tx.id)}
                                className="text-slate-300 hover:text-slate-500 transition-colors p-0.5"
                                title="Copy Reference Number"
                              >
                                {copiedTxId === tx.id ? (
                                  <Check className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              via {tx.paymentGateway}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Customer contact details */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{tx.customerName}</span>
                        </div>
                        {tx.customerPhone && (
                          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span>{tx.customerPhone}</span>
                          </div>
                        )}
                      </td>

                      {/* Timestamp chronological info */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-800">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span>{formattedTime}</span>
                        </div>
                      </td>

                      {/* Purchased service/product */}
                      <td className="p-4">
                        <div className="font-medium text-slate-800 max-w-xs truncate" title={tx.purpose}>
                          {tx.purpose}
                        </div>
                      </td>

                      {/* Cost */}
                      <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                        {formatETB(tx.amount)}
                      </td>

                      {/* Audit Status indicator */}
                      <td className="p-4 pr-6">
                        <div>
                          {tx.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-500" />
                              <span>Pending</span>
                            </span>
                          )}
                          {tx.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>Approved</span>
                            </span>
                          )}
                          {tx.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </div>
                        {tx.notes && (
                          <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-1 max-w-xs" title={tx.notes}>
                            Note: {tx.notes}
                          </p>
                        )}
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
