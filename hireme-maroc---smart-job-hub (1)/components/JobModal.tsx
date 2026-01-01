
import React from 'react';
import { Job } from '../types';

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (id: number) => void;
  isApplied: boolean;
}

export const JobModal: React.FC<JobModalProps> = ({ job, onClose, onApply, isApplied }) => {
  if (!job) return null;

  const handleExternalApply = () => {
    onApply(job.id);
    setTimeout(() => {
        window.open(job.url, '_blank', 'noopener,noreferrer');
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 transition-all animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] sm:rounded-[3rem] rounded-t-[2.5rem] flex flex-col overflow-hidden shadow-3xl animate-in slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle for mobile */}
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-4 mb-2 sm:hidden shrink-0"></div>

        <div className="h-16 sm:h-20 flex items-center justify-between px-6 sm:px-10 border-b border-zinc-50 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Opportunité IA</span>
          <button onClick={onClose} className="w-10 h-10 bg-zinc-50 rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-zinc-100 transition-colors active:scale-90">
            <i className="fa fa-times text-zinc-400 text-sm"></i>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto px-6 sm:px-14 py-8 sm:py-12 scroll-smooth">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-900 rounded-3xl sm:rounded-[2.5rem] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-2xl shadow-zinc-900/10 rotate-[-5deg] shrink-0 mx-auto sm:mx-0">
              {job.company[0]}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{job.company}</span>
                <span className="text-zinc-200 hidden sm:block">•</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{job.time}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-tight tracking-tight">{job.title}</h2>
            </div>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            <div className="p-5 sm:p-6 bg-zinc-50 rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100/50">
              <span className="text-[8px] sm:text-[9px] font-black text-zinc-400 block mb-2 uppercase tracking-widest">Ville</span>
              <span className="font-extrabold text-zinc-800 text-xs sm:text-sm flex items-center gap-2">
                <i className="fa fa-location-dot text-zinc-300"></i> {job.city}
              </span>
            </div>
            <div className="p-5 sm:p-6 bg-zinc-50 rounded-[1.5rem] sm:rounded-[2rem] border border-zinc-100/50">
              <span className="text-[8px] sm:text-[9px] font-black text-zinc-400 block mb-2 uppercase tracking-widest">Contrat</span>
              <span className="font-extrabold text-zinc-800 text-xs sm:text-sm flex items-center gap-2">
                <i className="fa fa-file-contract text-zinc-300"></i> {job.contract}
              </span>
            </div>
            {job.salary && (
              <div className="p-5 sm:p-6 bg-emerald-50 rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-100/50 col-span-1">
                <span className="text-[8px] sm:text-[9px] font-black text-emerald-600 block mb-2 uppercase tracking-widest">Salaire</span>
                <span className="font-extrabold text-emerald-800 text-xs sm:text-sm uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                  {job.salary}
                </span>
              </div>
            )}
            <div className="p-5 sm:p-6 bg-indigo-50 rounded-[1.5rem] sm:rounded-[2rem] border border-indigo-100/50 col-span-1">
              <span className="text-[8px] sm:text-[9px] font-black text-indigo-600 block mb-2 uppercase tracking-widest">Status</span>
              <span className="font-extrabold text-indigo-800 text-xs sm:text-sm uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span> Ouvert
              </span>
            </div>
          </div>

          {/* Main Sections */}
          <div className="space-y-12 mb-10">
            <section>
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Présentation
              </h4>
              <p className="text-base sm:text-xl text-zinc-600 leading-relaxed font-medium">
                {job.description}
              </p>
            </section>

            {job.tasks && job.tasks.length > 0 && (
              <section className="bg-zinc-50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-zinc-100/80">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Missions clés
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {job.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500 shrink-0 mt-0.5">
                        <i className="fa fa-circle-check text-[10px]"></i>
                      </div>
                      <span className="text-zinc-700 font-bold text-sm sm:text-[15px] leading-tight">{task}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Votre Profil
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, i) => (
                    <span key={i} className="bg-white border border-zinc-100 px-4 py-2 rounded-xl text-zinc-600 font-bold text-xs sm:text-sm shadow-sm">
                      {req}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(job.email || job.contactPhone) && (
              <section className="p-7 sm:p-10 bg-zinc-900 rounded-[2rem] sm:rounded-[3rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-8">Contact Direct</h4>
                <div className="flex flex-col gap-6">
                  {job.email && (
                    <div className="group">
                      <p className="text-[9px] font-black text-zinc-500 uppercase mb-2">Email</p>
                      <a href={`mailto:${job.email}`} className="text-sm sm:text-lg font-black hover:text-indigo-400 transition-colors flex items-center gap-3 truncate">
                        <i className="fa fa-envelope-open text-zinc-700"></i> {job.email}
                      </a>
                    </div>
                  )}
                  {job.contactPhone && (
                    <div className="group">
                      <p className="text-[9px] font-black text-zinc-500 uppercase mb-2">Téléphone</p>
                      <a href={`tel:${job.contactPhone}`} className="text-sm sm:text-lg font-black hover:text-indigo-400 transition-colors flex items-center gap-3">
                        <i className="fa fa-phone-volume text-zinc-700"></i> {job.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Action Bar */}
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl pt-4 pb-4 sm:pb-0 border-t border-zinc-50 flex flex-col items-center">
            <button 
              onClick={handleExternalApply}
              className={`w-full py-5 sm:py-7 rounded-2xl sm:rounded-[2rem] font-black text-base sm:text-xl transition-all duration-500 shadow-2xl relative overflow-hidden active:scale-95 flex items-center justify-center gap-4 ${
                isApplied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-zinc-900 text-white hover:bg-indigo-600 shadow-indigo-500/10'
              }`}
            >
              {isApplied ? (
                <>
                  <i className="fa fa-external-link text-xs"></i>
                  <span>Consulter la Source</span>
                </>
              ) : (
                <>
                  <span>Postuler maintenant</span>
                  <i className="fa fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
            <p className="text-[8px] sm:text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-4 mb-2">
              Lien sécurisé • Hireme Maroc v3.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
