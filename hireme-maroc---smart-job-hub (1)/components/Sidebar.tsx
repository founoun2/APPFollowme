
import React from 'react';
import { SidebarKey } from '../types';
import { SIDEBAR_DATA } from '../constants';

interface SidebarProps {
  activeKey: SidebarKey;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeKey, onClose }) => {
  const content = activeKey ? SIDEBAR_DATA[activeKey] : null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${activeKey ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-[1001] flex flex-col transition-transform duration-500 ease-out ${activeKey ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-50">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">{content?.title || 'Information'}</span>
          <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
            <i className="fa fa-times text-slate-400"></i>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-10 prose prose-slate max-w-none">
          {content?.body}
        </div>
        <div className="p-8 border-t border-slate-50 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hireme Maroc v3.0 | Smart Hub</p>
        </div>
      </aside>
    </>
  );
};
