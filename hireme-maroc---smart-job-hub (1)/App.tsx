
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Job, SidebarKey } from './types';
import { generateMockJobs, CITIES, CONTRACTS } from './constants';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { JobCard } from './components/JobCard';
import { JobModal } from './components/JobModal';
import { GoogleGenAI, Type } from "@google/genai";
import { jobService } from './services/jobService';

const PAGE_SIZE = 12;
const SYNC_INTERVAL = 20000;
const CLEANUP_INTERVAL = 3600000; // 1 hour

const App: React.FC = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [activeSidebar, setActiveSidebar] = useState<SidebarKey>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Load jobs from database on mount
  useEffect(() => {
    loadJobsFromDatabase();
    syncLiveJobs();
    
    // Set up intervals
    const syncInterval = setInterval(syncLiveJobs, SYNC_INTERVAL);
    const cleanupInterval = setInterval(cleanupOldJobs, CLEANUP_INTERVAL);
    
    return () => {
      clearInterval(syncInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  const loadJobsFromDatabase = async () => {
    setIsScanning(true);
    try {
      const jobs = await jobService.getAllJobs();
      if (jobs.length > 0) {
        setAllJobs(jobs);
      } else {
        // If no jobs in database, use mock data
        setAllJobs(generateMockJobs());
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setAllJobs(generateMockJobs());
    } finally {
      setIsScanning(false);
    }
  };

  const cleanupOldJobs = async () => {
    try {
      await jobService.deleteOldJobs();
      // Reload jobs after cleanup
      await loadJobsFromDatabase();
    } catch (error) {
      console.error('Error cleaning up old jobs:', error);
    }
  };

  const syncLiveJobs = async () => {
    if (allJobs.length === 0) setIsScanning(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Extract 12 recent job offers from Morocco posted within the last 7 days (1 week) across these platforms: ANAPEC, ReKrute, Emploi.ma, JobLike.ma, Dreamjob.ma, Recrutement24.com, Postule.ma, JobPortal.ma, Emploi-public.ma, Alwadifa-Maroc.com, Emploidiali.ma, MarocEmploi.net, Mitula.ma, Jooble.org, OptionCarriere.ma, Glassdoor Maroc, Bayt.com, Talent.com, Indeed Maroc, LinkedIn, and Facebook Groups. Categories: IT, Sales, Finance, Graphic Design, Logistics. Include specific contact email/phone and salary if present. Return valid JSON.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                city: { type: Type.STRING },
                contract: { type: Type.STRING },
                time: { type: Type.STRING },
                isNew: { type: Type.BOOLEAN },
                description: { type: Type.STRING },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                salary: { type: Type.STRING },
                email: { type: Type.STRING },
                contactPhone: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["id", "title", "company", "city", "contract", "time", "description", "url"]
            }
          }
        },
      });

      const liveJobs = JSON.parse(response.text || "[]") as Job[];
      if (liveJobs.length > 0) {
        // Save new jobs to database
        await jobService.saveJobs(liveJobs);
        
        // Update state with unique jobs
        setAllJobs(prev => {
          const uniqueNew = liveJobs.filter(lj => 
            !prev.some(pj => pj.title === lj.title && pj.company === lj.company)
          );
          return [...uniqueNew.map(j => ({ ...j, isNew: true })), ...prev];
        });
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return allJobs.filter(j => 
      (!keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || j.company.toLowerCase().includes(keyword.toLowerCase())) &&
      (!selectedCity || j.city === selectedCity) &&
      (!selectedContract || j.contract === selectedContract)
    );
  }, [allJobs, keyword, selectedCity, selectedContract]);

  const currentJobs = useMemo(() => filteredJobs.slice(0, displayedCount), [filteredJobs, displayedCount]);

  const suggestions = useMemo(() => {
    if (!keyword.trim()) return [];
    return Array.from(new Set(allJobs.map(j => j.title)))
      .filter(t => t.toLowerCase().includes(keyword.toLowerCase()))
      .slice(0, 5);
  }, [keyword, allJobs]);

  // Fix: Added handleApply function to manage job applications state
  const handleApply = useCallback((id: number) => {
    setAppliedJobs(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(e => {
      if (e[0].isIntersecting && displayedCount < filteredJobs.length) {
        setDisplayedCount(p => p + PAGE_SIZE);
      }
    }, { threshold: 0.1 });
    const anchor = document.getElementById('scroll-anchor');
    if (anchor) observer.observe(anchor);
    return () => observer.disconnect();
  }, [displayedCount, filteredJobs.length]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Header 
        onOpenSidebar={setActiveSidebar}
        keyword={keyword}
        setKeyword={setKeyword}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedContract={selectedContract}
        setSelectedContract={setSelectedContract}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        suggestionRef={suggestionRef}
        cities={CITIES}
        contracts={CONTRACTS}
        onFilterChange={() => setDisplayedCount(PAGE_SIZE)}
      />

      <Sidebar activeKey={activeSidebar} onClose={() => setActiveSidebar(null)} />
      
      {/* Scanning Splash Screen (Mobile/Desktop Optimized) */}
      {isScanning && allJobs.length === 0 && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
          <div className="relative mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 border-[6px] border-zinc-100 rounded-[2.5rem] sm:rounded-[3rem] animate-pulse"></div>
            <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 border-[6px] border-indigo-600 border-t-transparent rounded-[2.5rem] sm:rounded-[3rem] animate-spin"></div>
            <i className="fa fa-magnifying-glass absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl text-indigo-600 animate-float"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2 tracking-tighter">Initialisation de l'IA...</h2>
          <p className="text-zinc-400 font-bold text-sm sm:text-base max-w-xs mx-auto">Détection en temps réel sur tout le Web Marocain</p>
        </div>
      )}

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 flex-grow pb-24 pt-48">
        {/* Content Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {filteredJobs.length} Opportunités détectées
            </h2>
            <div className="flex gap-2 items-center bg-zinc-900 px-3 py-1.5 rounded-full shadow-lg shadow-zinc-900/20">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[8px] sm:text-[9px] font-black text-white uppercase tracking-widest">Live Scan</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job, idx) => (
                <div key={`${job.id}-${idx}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${(idx % PAGE_SIZE) * 50}ms` }}>
                  <JobCard 
                    job={job} 
                    isApplied={appliedJobs.has(job.id)}
                    onClick={() => setSelectedJob(job)}
                  />
                </div>
              ))
            ) : (
              <div className="py-24 sm:py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-zinc-100 animate-in zoom-in-95 duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 rounded-full mb-6 text-zinc-200">
                  <i className="fa fa-ghost text-2xl sm:text-3xl"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-zinc-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-zinc-400 font-bold text-xs sm:text-sm px-10">L'IA est en train de recalculer les opportunités pour vous...</p>
                <button 
                  onClick={() => { setKeyword(''); setSelectedCity(''); setSelectedContract(''); }}
                  className="mt-8 px-8 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        </div>

        {displayedCount < filteredJobs.length && (
          <div id="scroll-anchor" className="h-40 flex items-center justify-center">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </main>

      <JobModal 
        job={selectedJob} 
        isApplied={selectedJob ? appliedJobs.has(selectedJob.id) : false}
        onClose={() => setSelectedJob(null)} 
        onApply={handleApply}
      />

      <style>{`
        .animate-in {
          animation-duration: 500ms;
          animation-fill-mode: both;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInFromBottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideInFromTop { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-bottom-4 { animation-name: slideInFromBottom; }
        .slide-in-from-top-2 { animation-name: slideInFromTop; }
        .zoom-in-95 { animation-name: zoomIn; }
      `}</style>
    </div>
  );
};

export default App;
