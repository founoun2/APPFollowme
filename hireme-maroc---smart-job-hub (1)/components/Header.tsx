
import React, { useState, useEffect, useRef } from 'react';
import { SidebarKey } from '../types';

interface HeaderProps {
  onOpenSidebar: (key: SidebarKey) => void;
  keyword: string;
  setKeyword: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  selectedContract: string;
  setSelectedContract: (value: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  suggestionRef: React.RefObject<HTMLDivElement>;
  cities: string[];
  contracts: string[];
  onFilterChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, keyword, setKeyword, selectedCity, setSelectedCity, selectedContract, setSelectedContract, suggestions, showSuggestions, setShowSuggestions, suggestionRef, cities, contracts, onFilterChange }) => {
  const [time, setTime] = useState(new Date());
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = (key: SidebarKey) => {
    onOpenSidebar(key);
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? 'py-3 bg-white/70 border-b border-zinc-100 shadow-sm' : 'py-5 bg-transparent'} backdrop-blur-2xl`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between relative">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500 group-hover:scale-110 active:scale-95">
            <div className="absolute inset-0 bg-[#c1272d] rounded-2xl sm:rounded-full shadow-lg shadow-red-900/10 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 512 512" className="w-6 h-6 sm:w-8 sm:h-8 fill-none stroke-[#006233] stroke-[35]">
                <path d="M256 160l26.4 81.3h85.5l-69.1 50.2 26.4 81.3-69.2-50.2-69.2 50.2 26.4-81.3-69.1-50.2h85.5z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-black tracking-tighter leading-none text-zinc-900 uppercase">HIREME MAROC</span>
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">Smart Job Aggregator</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">
          <button onClick={() => handleLinkClick('legal')} className="hover:text-indigo-600 transition-all hover:translate-y-[-1px]">Légal</button>
          <button onClick={() => handleLinkClick('privacy')} className="hover:text-indigo-600 transition-all hover:translate-y-[-1px]">Confidentialité</button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-zinc-800 shadow-xl shadow-zinc-900/10">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            <span className="text-[10px] sm:text-[11px] font-black text-white tabular-nums tracking-wider">
              {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isMenuOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-zinc-50 text-zinc-400 active:bg-zinc-100'}`}
          >
            <i className={`fa ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute top-full right-4 left-4 mt-3 lg:hidden bg-white rounded-3xl border border-zinc-100 shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300 z-50 overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => handleLinkClick('legal')}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-zinc-50 transition-colors group active:bg-zinc-100"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <i className="fa fa-info-circle text-sm"></i>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-black text-zinc-900 uppercase tracking-tighter">À propos & Légal</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Informations plateforme</span>
                </div>
              </button>

              <button 
                onClick={() => handleLinkClick('privacy')}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-zinc-50 transition-colors group active:bg-zinc-100"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <i className="fa fa-shield-alt text-sm"></i>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-black text-zinc-900 uppercase tracking-tighter">Confidentialité</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Protection des données</span>
                </div>
              </button>

              <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between px-2">
                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em]">Hireme Maroc Hub</span>
                <div className="flex gap-4">
                  <i className="fa-brands fa-linkedin text-zinc-300 text-sm hover:text-indigo-600 cursor-pointer transition-colors"></i>
                  <i className="fa-brands fa-x-twitter text-zinc-300 text-sm hover:text-indigo-600 cursor-pointer transition-colors"></i>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Bar */}
      <div className="border-t border-zinc-100/50">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-2">
          <div className="bg-white/70 backdrop-blur-3xl border border-zinc-100 shadow-2xl shadow-indigo-500/5 rounded-[2rem] sm:rounded-[2.5rem] p-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center bg-zinc-50/50 rounded-2xl px-5 py-2 sm:py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10" ref={suggestionRef}>
                <i className="fa fa-search text-zinc-300 mr-4 text-sm sm:text-base"></i>
                <input 
                  type="text" 
                  value={keyword}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => { setKeyword(e.target.value); onFilterChange(); }}
                  placeholder="Quel métier cherchez-vous ?" 
                  className="w-full bg-transparent outline-none text-sm sm:text-base font-bold placeholder:text-zinc-300 text-zinc-800"
                />
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+10px)] left-0 right-0 bg-white rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden animate-in slide-in-from-top-2 z-50 p-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setKeyword(s); setShowSuggestions(false); }}
                        className="w-full text-left px-5 py-3 rounded-2xl hover:bg-zinc-50 transition-colors flex items-center gap-3 group"
                      >
                        <i className="fa fa-magnifying-glass text-[10px] text-zinc-300 group-hover:text-indigo-500"></i>
                        <span className="text-sm font-bold text-zinc-700">{s}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative group bg-zinc-50/50 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 w-full sm:w-48">
                <i className="fa fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 text-[10px] sm:text-[11px]"></i>
                <select 
                  value={selectedCity}
                  onChange={(e) => { setSelectedCity(e.target.value); onFilterChange(); }}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-transparent text-[11px] sm:text-[13px] font-bold text-zinc-600 outline-none cursor-pointer appearance-none"
                >
                  <option value="">Toutes Villes</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <i className="fa fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-300 pointer-events-none group-hover:text-indigo-500 transition-colors"></i>
              </div>

              <div className="relative group bg-zinc-50/50 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 w-full sm:w-48">
                <i className="fa fa-file-contract absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 text-[10px] sm:text-[11px]"></i>
                <select 
                  value={selectedContract}
                  onChange={(e) => { setSelectedContract(e.target.value); onFilterChange(); }}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-transparent text-[11px] sm:text-[13px] font-bold text-zinc-600 outline-none cursor-pointer appearance-none"
                >
                  <option value="">Contrats</option>
                  {contracts.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <i className="fa fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-300 pointer-events-none group-hover:text-indigo-500 transition-colors"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
