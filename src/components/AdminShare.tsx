import React, { useState } from 'react';
import { Mail, MessageCircle, Calendar, Send, Trash2, ShieldCheck, Check, AlertCircle, RefreshCw, Archive, Star, Eye, EyeOff } from 'lucide-react';
import { Announcement, Feedback } from '../types';

interface AdminShareProps {
  announcements: Announcement[];
  feedback: Feedback[];
  onAddAnnouncement: (announcement: { title: string; content: string; author: string }) => Promise<boolean>;
  onDeleteAnnouncement: (id: string) => Promise<boolean>;
  onUpdateFeedbackStatus: (id: string, status: 'read' | 'replied', replyMessage?: string) => Promise<boolean>;
  onUpdateFeedbackPublic: (id: string, isPublic: boolean) => Promise<boolean>;
  onDeleteFeedback: (id: string) => Promise<boolean>;
}

export default function AdminShare({
  announcements,
  feedback,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onUpdateFeedbackStatus,
  onUpdateFeedbackPublic,
  onDeleteFeedback
}: AdminShareProps) {
  
  // Announcement States
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annAuthor, setAnnAuthor] = useState('Jemal Ireso (Manager)');
  const [annMessage, setAnnMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [annLoading, setAnnLoading] = useState(false);

  // Feedback States
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnMessage(null);
    setAnnLoading(true);

    if (!annTitle.trim() || !annContent.trim()) {
      setAnnMessage({ text: 'Please fill in the announcement title and body.', type: 'error' });
      setAnnLoading(false);
      return;
    }

    try {
      const success = await onAddAnnouncement({
        title: annTitle,
        content: annContent,
        author: annAuthor || 'Admin'
      });

      if (success) {
        setAnnMessage({ text: 'Announcement published successfully!', type: 'success' });
        setAnnTitle('');
        setAnnContent('');
        setTimeout(() => setAnnMessage(null), 3000);
      } else {
        setAnnMessage({ text: 'Publishing failed.', type: 'error' });
      }
    } catch (err) {
      setAnnMessage({ text: 'Network connection issue.', type: 'error' });
    } finally {
      setAnnLoading(false);
    }
  };

  const handleDeleteAnn = async (id: string) => {
    if (window.confirm('Delete this announcement? It will disappear from the public news feed.')) {
      try {
        const success = await onDeleteAnnouncement(id);
        if (success) {
          setAnnMessage({ text: 'Announcement deleted.', type: 'success' });
          setTimeout(() => setAnnMessage(null), 3000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendReply = async (id: string) => {
    if (!replyMessage.trim()) return;
    setReplyLoading(true);
    setFeedbackMessage(null);

    try {
      const success = await onUpdateFeedbackStatus(id, 'replied', replyMessage);
      if (success) {
        setFeedbackMessage({ text: 'Reply logged and message marked as Replied.', type: 'success' });
        setReplyMessage('');
        setActiveFeedbackId(null);
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        setFeedbackMessage({ text: 'Failed to update feedback.', type: 'error' });
      }
    } catch (err) {
      setFeedbackMessage({ text: 'Network failure during reply.', type: 'error' });
    } finally {
      setReplyLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await onUpdateFeedbackStatus(id, 'read');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublic = async (id: string, currentStatus: boolean) => {
    try {
      const success = await onUpdateFeedbackPublic(id, !currentStatus);
      if (success) {
        setFeedbackMessage({ 
          text: !currentStatus ? 'Feedback is now visible on home page.' : 'Feedback is now hidden from public.', 
          type: 'success' 
        });
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer feedback record from the inbox?')) {
      try {
        const success = await onDeleteFeedback(id);
        if (success) {
          setFeedbackMessage({ text: 'Inquiry deleted.', type: 'success' });
          setTimeout(() => setFeedbackMessage(null), 3000);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div id="admin-share-subtab" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column: Announcement Publisher */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Archive className="w-5 h-5 text-blue-600" />
            <span>Publish Announcements</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast business updates, training enrollments, or new electronic stock arrivals straight to the Public News page.
          </p>
        </div>

        {annMessage && (
          <div className={`p-4 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${
            annMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {annMessage.type === 'success' ? <Check className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{annMessage.text}</span>
          </div>
        )}

        <form onSubmit={handlePublishAnnouncement} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Announcement Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Special Holiday Discounts on Genuine Leather Wallets!"
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Author Name / Role</label>
              <input
                type="text"
                placeholder="Jemal Ireso (Manager)"
                value={annAuthor}
                onChange={(e) => setAnnAuthor(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={annLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-500/10 disabled:opacity-50 h-[38px]"
              >
                <Send className="w-4 h-4" />
                <span>{annLoading ? 'Publishing...' : 'Publish to News Board'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detailed Content *</label>
            <textarea
              required
              rows={5}
              placeholder="Write the full announcement text here..."
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>

        {/* Existing Announcements List */}
        <div className="space-y-3.5">
          <h3 className="font-display font-bold text-sm text-slate-800">
            Active Broadcast History ({announcements.length})
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white rounded-xl border border-slate-100 p-4 flex justify-between items-start space-x-3 hover:border-slate-200 transition-colors shadow-sm">
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 mt-2">
                    <span>By {ann.author}</span>
                    <span>•</span>
                    <span>{new Date(ann.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAnn(ann.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 transition-colors"
                  title="Remove Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Inquiry Feedback Inbox */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>Customer Inbox & Feedback</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review inquiries submitted via the Contact form. Follow up with clients directly via phone, email, or record custom logs.
          </p>
        </div>

        {feedbackMessage && (
          <div className={`p-4 rounded-xl border flex items-center space-x-2 text-xs font-semibold ${
            feedbackMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {feedbackMessage.type === 'success' ? <Check className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Feedback List Panel */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {feedback.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-250 rounded-2xl p-12 text-center text-slate-400 font-mono text-xs">
              No incoming customer feedback reports found.
            </div>
          ) : (
            feedback.map((f) => {
              const isUnread = f.status === 'unread';
              const isReplied = f.status === 'replied';

              return (
                <div 
                  key={f.id} 
                  className={`rounded-2xl border p-4.5 transition-all space-y-3 ${
                    isUnread 
                      ? 'bg-blue-50/20 border-blue-150 shadow-sm' 
                      : 'bg-white border-slate-100'
                  }`}
                  onClick={() => {
                    if (isUnread) handleMarkAsRead(f.id);
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-bold text-slate-900 text-sm">{f.name}</span>
                        {isUnread && (
                          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide animate-pulse">
                            New
                          </span>
                        )}
                        {isReplied && (
                          <span className="bg-green-100 text-green-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-green-200 uppercase tracking-wide">
                            Replied
                          </span>
                        )}
                        {f.rating && (
                          <div className="flex items-center gap-0.5 ml-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-2.5 h-2.5 ${s <= f.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        )}
                        {f.isPublic && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200 uppercase tracking-wide flex items-center gap-1">
                            <Eye className="w-2 h-2" /> Public
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                        {f.email} {f.phone ? `• ${f.phone}` : ''} • {new Date(f.date).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePublic(f.id, !!f.isPublic);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${f.isPublic ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                        title={f.isPublic ? "Hide from public" : "Make public"}
                      >
                        {f.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFeedback(f.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Message Body */}
                  <p className="text-slate-600 text-xs leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 font-mono">
                    "{f.message}"
                  </p>

                  {/* Reply Log */}
                  {f.replyMessage && (
                    <div className="bg-green-50/40 border border-green-150 rounded-xl p-3 text-xs text-green-900 font-mono">
                      <span className="font-bold block text-green-800 text-[10px] uppercase tracking-wider mb-1">
                        ✓ Action Logged / Reply Saved:
                      </span>
                      "{f.replyMessage}"
                    </div>
                  )}

                  {/* Toggle Reply Input */}
                  {!f.replyMessage && (
                    <div>
                      {activeFeedbackId === f.id ? (
                        <div className="space-y-2 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
                          <textarea
                            rows={2}
                            placeholder="Type response log or resolution (e.g. 'Called Abebe and scheduled MS training enrollment on Monday')..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setActiveFeedbackId(null);
                                setReplyMessage('');
                              }}
                              className="px-3 py-1.5 text-slate-500 hover:text-slate-700 text-[11px] font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendReply(f.id)}
                              disabled={replyLoading || !replyMessage.trim()}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm disabled:opacity-50"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Log Resolution</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveFeedbackId(f.id);
                            setReplyMessage('');
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 pt-1 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Respond & Save Resolution Log</span>
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
