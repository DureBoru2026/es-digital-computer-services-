import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Download
} from 'lucide-react';
import { Transaction } from '../types';
import { formatETB } from '../utils';

interface AdminReportProps {
  transactions: Transaction[];
}

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminReport({ transactions }: AdminReportProps) {
  
  const reportData = useMemo(() => {
    const approvedTx = transactions.filter(tx => tx.status === 'approved');
    
    // Revenue by Day (Last 7 days)
    const dailyRevenue: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(date => {
      dailyRevenue[date] = 0;
    });

    approvedTx.forEach(tx => {
      const date = tx.date.split('T')[0];
      if (dailyRevenue[date] !== undefined) {
        dailyRevenue[date] += tx.amount;
      }
    });

    const dailyRevenueData = last7Days.map(date => ({
      name: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
      revenue: dailyRevenue[date]
    }));

    // Gateway distribution
    const gatewayStats: Record<string, number> = {};
    approvedTx.forEach(tx => {
      gatewayStats[tx.paymentGateway] = (gatewayStats[tx.paymentGateway] || 0) + tx.amount;
    });

    const gatewayData = Object.entries(gatewayStats).map(([name, value]) => ({
      name,
      value
    }));

    // Order status breakdown
    const statusStats: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0
    };
    transactions.forEach(tx => {
      statusStats[tx.status] = (statusStats[tx.status] || 0) + 1;
    });

    const statusData = Object.entries(statusStats).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Summary stats
    const totalApprovedRevenue = approvedTx.reduce((sum, tx) => sum + tx.amount, 0);
    const avgOrderValue = approvedTx.length > 0 ? totalApprovedRevenue / approvedTx.length : 0;

    return {
      dailyRevenueData,
      gatewayData,
      statusData,
      totalApprovedRevenue,
      avgOrderValue,
      totalOrders: transactions.length,
      approvedOrders: approvedTx.length,
      pendingOrders: statusStats.pending
    };
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{formatETB(reportData.totalApprovedRevenue)}</h3>
          <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
            Confirmed via CBE & telebirr
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Transaction</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{formatETB(reportData.avgOrderValue)}</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Per approved receipt</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Audit</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{reportData.pendingOrders}</h3>
          <p className="text-[10px] text-amber-600 font-bold mt-1">Needs verification</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Integrity</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {reportData.totalOrders > 0 ? Math.round((reportData.approvedOrders / reportData.totalOrders) * 100) : 100}%
          </h3>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Approval conversion rate</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-display font-bold text-slate-900">Weekly Revenue Trend</h4>
              <p className="text-xs text-slate-500">Revenue growth over the last 7 days</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.dailyRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                  tickFormatter={(val) => `\u0024{val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  formatter={(value: number) => [formatETB(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0EA5E9" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gateway Performance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-display font-bold text-slate-900">Payment Channel Volume</h4>
              <p className="text-xs text-slate-500">Distribution by gateway provider</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.gatewayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportData.gatewayData.map((entry, index) => (
                      <Cell key={`cell-\u0024{index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [formatETB(value), 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {reportData.gatewayData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs font-bold text-slate-700 capitalize">{item.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">{formatETB(item.value)}</span>
                </div>
              ))}
              {reportData.gatewayData.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center">No approved data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Efficiency */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-md">
            <h4 className="text-xl font-display font-bold">Operational Insight</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your business is seeing a processing efficiency of 
              <span className="text-sky-400 font-bold mx-1">
                {reportData.totalOrders > 0 ? Math.round((reportData.approvedOrders / reportData.totalOrders) * 100) : 100}%
              </span> 
              on submitted receipts. telebirr continues to be the preferred choice for 
              {reportData.gatewayData.find(g => g.name === 'telebirr') ? ' digital payments' : ' your customers'}.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                    User
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">+ {reportData.totalOrders} total inquiries this month</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-6 h-6 text-emerald-400 mb-2" />
              <span className="text-lg font-black">{reportData.approvedOrders}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Approved</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <Clock className="w-6 h-6 text-amber-400 mb-2" />
              <span className="text-lg font-black">{reportData.pendingOrders}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Pending</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
