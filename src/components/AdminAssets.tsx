import React, { useState } from 'react';
import { Upload, FileVideo, FileImage, FileText, FileCode, Plus, Trash2, Download, Package, DollarSign, Tag, Check, X, AlertCircle } from 'lucide-react';
import { DigitalAsset } from '../types';

interface AdminAssetsProps {
  assets: DigitalAsset[];
  onAddAsset: (asset: Omit<DigitalAsset, 'id' | 'date' | 'downloadCount'>) => Promise<boolean>;
  onDeleteAsset: (id: string) => Promise<boolean>;
}

export default function AdminAssets({ assets, onAddAsset, onDeleteAsset }: AdminAssetsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'template' as DigitalAsset['type'],
    priceType: 'free' as DigitalAsset['priceType'],
    price: 0,
    fileUrl: '',
    description: ''
  });

  const getIcon = (type: DigitalAsset['type']) => {
    switch (type) {
      case 'video': return <FileVideo className="w-5 h-5 text-purple-500" />;
      case 'image': return <FileImage className="w-5 h-5 text-blue-500" />;
      case 'template': return <FileCode className="w-5 h-5 text-amber-500" />;
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'ppt': return <Package className="w-5 h-5 text-orange-500" />;
      case 'word': return <FileText className="w-5 h-5 text-blue-600" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const success = await onAddAsset(formData);
      if (success) {
        setMessage({ text: 'Asset added successfully!', type: 'success' });
        setFormData({ title: '', type: 'template', priceType: 'free', price: 0, fileUrl: '', description: '' });
        setShowAddForm(false);
      } else {
        setMessage({ text: 'Failed to add asset.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Digital Assets Store</h2>
          <p className="text-sm text-slate-500">Manage downloadable videos, templates, and documents.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0EA5E9] text-white rounded-xl font-bold text-sm hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add New Asset'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 animate-in zoom-in-95 duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Asset Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Modern Resume Template"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0EA5E9] transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Asset Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as DigitalAsset['type'] })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0EA5E9] transition-all text-sm"
                >
                  <option value="template">Template</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF Document</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="word">Word Document</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Pricing Model</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, priceType: 'free', price: 0 })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      formData.priceType === 'free' 
                        ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#0EA5E9]'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, priceType: 'sale' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      formData.priceType === 'sale' 
                        ? 'bg-amber-500 text-white border-amber-500' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-500'
                    }`}
                  >
                    On Sale
                  </button>
                </div>
              </div>
              {formData.priceType === 'sale' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Price (ETB)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="50"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-amber-500 transition-all text-sm"
                    />
                  </div>
                </div>
              )}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">File URL / Download Link</label>
                <div className="relative">
                  <Upload className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="url"
                    placeholder="https://example.com/file.zip"
                    value={formData.fileUrl}
                    onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0EA5E9] transition-all text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">Asset Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide a brief description of what the user is getting..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0EA5E9] transition-all text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Discard
              </button>
              <button
                disabled={loading}
                type="submit"
                className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Save Asset'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Pricing</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Downloads</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium italic">No digital assets uploaded yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white border border-slate-100 rounded-lg shadow-sm">
                          {getIcon(asset.type)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">{asset.title}</p>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{asset.description || 'No description provided.'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                        {asset.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {asset.priceType === 'free' ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                          <Tag className="w-3 h-3" /> Free
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                          <DollarSign className="w-3 h-3" /> {asset.price} ETB
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-mono font-bold text-slate-900">{asset.downloadCount}</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Clicks</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={asset.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-[#0EA5E9] hover:bg-sky-50 rounded-lg transition-colors"
                          title="Preview Link"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => onDeleteAsset(asset.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
