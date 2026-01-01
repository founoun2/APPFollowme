
import React from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  isApplied: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isApplied, onClick, style }) => {
  const isLive = job.url.includes('linkedin') || job.url.includes('emploi') || job.url.includes('rekrute') || job.url.includes('wadifa') || job.url.includes('anapec');

  return (
    <div 
      onClick={onClick}
      style={style}
      className="group bg-white p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer border border-zinc-100 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(79,70,229,0.08)] hover:border-indigo-100 hover:translate-y-[-2px] active:scale-[0.98]"
    >
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h3 className="text-lg sm:text-xl font-black text-zinc-900 group-hover:text-indigo-600 transition-colors tracking-tight truncate max-w-full">
            {job.title}
          </h3>
          
          <div className="flex gap-1.5 shrink-0">
            {isLive ? (
              <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter flex items-center gap-1 border border-emerald-100">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span> Live
              </span>
            ) : job.isNew && (
              <span className="bg-indigo-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter">New</span>
            )}

            {isApplied && (
              <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter">Postulé</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] sm:text-[13px] font-bold text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-700 font-extrabold">{job.company}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa fa-location-dot opacity-20 text-[9px]"></i>
            <span className="truncate">{job.city}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa fa-file-contract opacity-20 text-[9px]"></i>
            <span>{job.contract}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 mt-5 sm:mt-0 pt-5 sm:pt-0 border-t sm:border-t-0 border-zinc-50">
        <div className="flex flex-col sm:items-end">
          <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-0.5">Detecté</span>
          <span className="text-[11px] sm:text-[12px] font-bold text-zinc-500 tabular-nums">{job.time}</span>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-[-8deg] transition-all duration-500">
          <i className="fa fa-chevron-right text-xs"></i>
        </div>
      </div>
    </div>
  );
};
