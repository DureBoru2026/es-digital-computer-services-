import React, { useState } from 'react';
import { Menu, X, Laptop, ShieldCheck, LogOut, ArrowRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, AuthState } from '../types';
import { useLanguage } from '../LanguageContext';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  authState: AuthState;
  handleLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, authState, handleLogout }: HeaderProps) {
  const { t, lang, setLang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('home') },
    { id: 'about', label: t('aboutUs') },
    { id: 'services', label: t('services') },
    { id: 'digital-store', label: 'Digital Downloads' },
    { id: 'news', label: 'Announcements' },
    { id: 'contact', label: t('contact') },
  ] as const;

  const navigateTo = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand Section */}
          <div 
            id="brand-logo" 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigateTo('home')}
          >
            <div className="w-11 h-11 bg-[#0EA5E9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-100 group-hover:scale-105 transition-transform duration-300">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-[#1E293B] flex items-center gap-1.5">
                ES Digital <span className="text-[#0EA5E9]">CSC</span>
              </span>
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
                Kore Town • Service Center
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? 'text-[#0EA5E9]' 
                      : 'text-slate-800 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#0EA5E9] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Auth Buttons / Admin Access (with very light green 🍏 background block) */}
          <div className="hidden md:flex items-center space-x-4 bg-green-50/90 border border-green-100/80 rounded-2xl p-1.5 px-3 shadow-sm shadow-green-100/30">
            <div className="flex items-center gap-1.5 pr-2 border-r border-green-200/60">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <button 
                onClick={() => setLang('en')} 
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-[#0EA5E9] text-white' : 'text-slate-500 hover:text-[#0EA5E9] hover:bg-white'}`}
                title="English"
              >
                EN
              </button>
              <button 
                onClick={() => setLang('om')} 
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${lang === 'om' ? 'bg-[#0EA5E9] text-white' : 'text-slate-500 hover:text-[#0EA5E9] hover:bg-white'}`}
                title="Afaan Oromoo"
              >
                OM
              </button>
              <button 
                onClick={() => setLang('am')} 
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${lang === 'am' ? 'bg-[#0EA5E9] text-white' : 'text-slate-500 hover:text-[#0EA5E9] hover:bg-white'}`}
                title="Amharic"
              >
                AM
              </button>
            </div>

            {authState.isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  id="header-admin-btn"
                  onClick={() => navigateTo('admin')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                    activeTab === 'admin'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>Admin Panel</span>
                </button>
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  title="Logout Admin"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => navigateTo('login')}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-black text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-xl border border-green-200/40 transition-all shadow-sm group"
              >
                <span>Staff Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 -mr-2 rounded-lg text-slate-600 hover:text-[#0EA5E9] hover:bg-sky-50 focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white shadow-inner"
          >
            <div className="px-4 pt-4 pb-6 space-y-1">
              <div className="flex justify-center gap-2 pb-4 mb-2 border-b border-slate-100">
                <button 
                  onClick={() => { setLang('en'); setMobileMenuOpen(false); }} 
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold text-center border ${lang === 'en' ? 'bg-sky-50 border-sky-200 text-[#0EA5E9]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { setLang('om'); setMobileMenuOpen(false); }} 
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold text-center border ${lang === 'om' ? 'bg-sky-50 border-sky-200 text-[#0EA5E9]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  Oromoo
                </button>
                <button 
                  onClick={() => { setLang('am'); setMobileMenuOpen(false); }} 
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold text-center border ${lang === 'am' ? 'bg-sky-50 border-sky-200 text-[#0EA5E9]' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  Amharic
                </button>
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-all ${
                    activeTab === item.id
                      ? 'bg-sky-50 text-[#0EA5E9] font-bold'
                      : 'text-slate-600 hover:text-[#0EA5E9] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-slate-100 mt-2">
                {authState.isAuthenticated ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => navigateTo('admin')}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-xl bg-[#0EA5E9] text-white font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 text-sm transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('adminDashboard')}</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out Admin</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigateTo('login')}
                    className="flex items-center justify-center space-x-1 w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
                  >
                    <span>Staff Sign In</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
