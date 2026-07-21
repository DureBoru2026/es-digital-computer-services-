import React, { useState } from 'react';
import { Download, ShoppingCart, Lock, CheckCircle2, FileVideo, FileImage, FileText, FileCode, Package, ArrowRight, Sparkles, Filter, Search, AlertCircle } from 'lucide-react';
import { DigitalAsset } from '../types';
import { formatETB } from '../utils';

interface DigitalStoreProps {
  assets: DigitalAsset[];
  onDownload: (id: string) => void;
  onInitiatePurchase: (asset: DigitalAsset) => void;
}

export default function DigitalStore({ assets, onDownload, onInitiatePurchase }: DigitalStoreProps) {
  const [filter, setFilter] = useState<'all' | DigitalAsset['type']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refSearch, setRefSearch] = useState('');
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [checkingRef, setCheckingRef] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);

  const handleRefCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refSearch.trim()) return;
    
    setCheckingRef(true);
    setRefError(null);
    setDownloadLink(null);

    try {
      // We check the transaction status for this reference
      const res = await fetch(`/api/transactions/verify/${refSearch}`);
      const data = await res.json();

      if (res.ok && data.status === 'approved') {
        // If approved, try to find the asset by purpose
        // Purpose is usually "Digital: Asset Title"
        const assetTitle = data.purpose.replace('Digital: ', '');
        const asset = (assets || []).find(a => a && a.title === assetTitle);
        
        if (asset) {
          setDownloadLink(asset.fileUrl);
          // Increment download count
          fetch(`/api/assets/${asset.id}/download`, { method: 'POST' });
        } else {
          setRefError('Payment verified, but asset not found. Contact support.');
        }
      } else if (res.ok) {
        setRefError(`Payment status: ${data.status.toUpperCase()}. Link will be available once approved.`);
      } else {
        setRefError('Reference number not found or still processing.');
      }
    } catch (err) {
      setRefError('Service temporarily unavailable.');
    } finally {
      setCheckingRef(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === 'all' || asset.type === filter;
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: DigitalAsset['type']) => {
    switch (type) {
      case 'video': return <FileVideo className="w-6 h-6" />;
      case 'image': return <FileImage className="w-6 h-6" />;
      case 'template': return <FileCode className="w-6 h-6" />;
      case 'pdf': return <FileText className="w-6 h-6" />;
      case 'ppt': return <Package className="w-6 h-6" />;
      case 'word': return <FileText className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const getBgColor = (type: DigitalAsset['type']) => {
    switch (type) {
      case 'video': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'image': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'template': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'pdf': return 'bg-red-50 text-red-600 border-red-100';
      case 'ppt': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'word': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0EA5E9] rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
          <Sparkles className="w-3 h-3" />
          Digital Marketplace
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight leading-tight">
          Premium Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-sky-600">Assets & Resources</span>
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Browse our curated collection of professional templates, high-quality videos, and educational documents designed to accelerate your workflow.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
              filter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-50 hover:border-slate-200'
            }`}
          >
            All Assets
          </button>
          {['template', 'video', 'image', 'pdf', 'ppt', 'word'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as DigitalAsset['type'])}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                filter === type ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]' : 'bg-slate-50 text-slate-500 border-slate-50 hover:border-slate-200'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-50 rounded-xl focus:outline-none focus:border-[#0EA5E9] text-sm transition-all"
          />
        </div>
      </div>

      {/* Already Paid? Download by Reference */}
      <div className="bg-sky-50/50 border border-sky-100 rounded-[2rem] p-6 sm:p-8 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0EA5E9]" />
              Already Purchased a Paid Asset?
            </h3>
            <p className="text-xs text-slate-500">
              Enter your telebirr or CBE Birr reference number to unlock your download once approved by our team.
            </p>
          </div>
          <form onSubmit={handleRefCheck} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Ref: 9G47H..."
              value={refSearch}
              onChange={(e) => setRefSearch(e.target.value)}
              className="px-4 py-2.5 bg-white border border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] min-w-[200px]"
            />
            <button 
              disabled={checkingRef}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-[#0EA5E9] transition-all whitespace-nowrap disabled:opacity-50"
            >
              {checkingRef ? 'Checking...' : 'Unlock Download'}
            </button>
          </form>
        </div>

        {refError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {refError}
          </div>
        )}

        {downloadLink && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5" /> Payment Verified! Your download is ready.
            </div>
            <a 
              href={downloadLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
            >
              Start Download <Download className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4 border border-slate-100">
              <Filter className="w-8 h-8" />
            </div>
            <p className="text-slate-400 font-medium italic">No assets match your current selection.</p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div 
              key={asset.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/30 transition-all duration-500 overflow-hidden flex flex-col h-full"
            >
              <div className="p-8 pb-4 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${getBgColor(asset.type)}`}>
                  {getIcon(asset.type)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0EA5E9] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {asset.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Download className="w-3 h-3" /> {asset.downloadCount}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0EA5E9] transition-colors leading-tight">
                    {asset.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {asset.description || 'Professional digital resource optimized for your creative and technical projects.'}
                  </p>
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Type</p>
                    {asset.priceType === 'free' ? (
                      <span className="text-lg font-black text-emerald-600">FREE</span>
                    ) : (
                      <span className="text-lg font-black text-slate-900">{formatETB(asset.price)}</span>
                    )}
                  </div>
                  
                  {asset.priceType === 'free' ? (
                    <button
                      onClick={() => onDownload(asset.id)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-[#0EA5E9] transition-all group-hover:translate-x-1"
                    >
                      Download <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onInitiatePurchase(asset)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
                    >
                      Buy Now <ShoppingCart className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Support Section */}
      <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9] rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h4 className="text-2xl font-black mb-4">Request a Custom Template?</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our design team can craft custom business booklets, ID cards, and technical templates tailored to your specific needs.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-[#0EA5E9] hover:text-white transition-all flex items-center gap-3">
            Contact Designers <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
