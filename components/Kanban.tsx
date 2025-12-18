
import React, { useState } from 'react';
import { ApplicationStage, ApplicationCard, ApplicationType } from '../types';
import { 
    MoreHorizontal, Plus, Search, Filter, CalendarClock, FileText, 
    User, GraduationCap, Briefcase, ChevronDown, MessageSquare,
    Zap, ExternalLink
} from 'lucide-react';

interface Props {
  onSelectCard?: (id: string) => void;
}

const Kanban: React.FC<Props> = ({ onSelectCard }) => {
  const [activePipeline, setActivePipeline] = useState<ApplicationType>('rpl');

  // --- CONFIGURATION: RPL PIPELINE ---
  const RPL_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'New Leads', color: 'bg-slate-100' },
    { id: 'evidence_collection', label: 'Evidence Collection', color: 'bg-blue-50' },
    { id: 'mediator_review', label: 'Mediator Review', color: 'bg-indigo-50' },
    { id: 'rto_submission', label: 'RTO Processing', color: 'bg-orange-50' },
    { id: 'certified', label: 'Certified', color: 'bg-emerald-50' },
  ];

  // --- CONFIGURATION: ADMISSION PIPELINE ---
  const ADMISSION_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'Uni Enquiries', color: 'bg-slate-100' },
    { id: 'app_lodged', label: 'App Lodged', color: 'bg-purple-50' },
    { id: 'conditional_offer', label: 'Conditional Offer', color: 'bg-fuchsia-50' },
    { id: 'gte_assessment', label: 'GTE / GS Check', color: 'bg-pink-50' },
    { id: 'coe_issued', label: 'CoE Issued', color: 'bg-green-50' },
  ];

  // --- MOCK DATA ---
  const allCards: ApplicationCard[] = [
    { 
        id: 'c1', type: 'rpl', clientName: 'Sarah Jenkins', qualification: 'Dip. Project Mgmt', stage: 'mediator_review', 
        tags: ['Direct'], value: '$2,500', daysInStage: 2, missingDocs: 1, counselorId: 'Jessica Wu' 
    },
    { 
        id: 'c2', type: 'rpl', clientName: 'Michael Chen', qualification: 'Cert IV Cookery', stage: 'evidence_collection', 
        tags: ['Global Ed'], value: '$3,200', daysInStage: 14, missingDocs: 4, counselorId: 'David Kim' 
    },
    { 
        id: 'a1', type: 'admission', clientName: 'Kenji Tanaka', qualification: 'Master of IT (Monash)', stage: 'conditional_offer', 
        tags: ['Sub-Agent'], value: '$35,000', daysInStage: 3, missingDocs: 1, counselorId: 'Jessica Wu' 
    },
    { 
        id: 'a2', type: 'admission', clientName: 'Sophie Martin', qualification: 'Bachelor of Design (RMIT)', stage: 'app_lodged', 
        tags: ['Direct'], value: '$28,000', daysInStage: 1, missingDocs: 0, counselorId: 'Amanda Lee' 
    },
  ];

  const currentStages = activePipeline === 'rpl' ? RPL_STAGES : ADMISSION_STAGES;
  const filteredCards = allCards.filter(card => card.type === activePipeline);

  const totalValue = filteredCards.reduce((acc, card) => {
      const val = parseFloat(card.value.replace(/[^0-9.-]+/g,""));
      return acc + val;
  }, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
        {/* Board Toolbar */}
        <div className="h-24 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl shadow-sm z-20">
            <div className="flex items-center gap-6">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-inner">
                    <button 
                        onClick={() => setActivePipeline('rpl')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activePipeline === 'rpl' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Briefcase className="w-4 h-4" />
                        RPL Desk
                    </button>
                    <button 
                        onClick={() => setActivePipeline('admission')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activePipeline === 'admission' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Admissions
                    </button>
                </div>
                
                <div className="h-10 w-px bg-slate-200 hidden lg:block"></div>

                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        {activePipeline === 'rpl' ? 'Recognition Hub' : 'University Intake'}
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{filteredCards.length} Files</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                        <Zap className="w-3.5 h-3.5 text-orange-400" /> Pipeline Value: ${totalValue.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 <div className="relative group hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text" placeholder="Jump to file..." className="pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm border-2 border-transparent focus:bg-white focus:border-blue-100 w-64 transition-all outline-none font-medium" />
                 </div>
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Intake Lead
                 </button>
            </div>
        </div>

        {/* Board Surface */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 bg-[#f8fafc] custom-scrollbar">
            <div className="flex h-full gap-8 min-w-[1500px]">
                {currentStages.map(stage => {
                    const stageCards = filteredCards.filter(c => c.stage === stage.id);
                    return (
                        <div key={stage.id} className="w-80 flex flex-col h-full rounded-3xl bg-slate-200/40 border-2 border-slate-100 overflow-hidden shadow-inner group/column">
                            <div className="p-5 bg-white/60 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-widest flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${activePipeline === 'rpl' ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                                        {stage.label}
                                    </h3>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{stageCards.length} ACTIVE APPLICATIONS</div>
                                </div>
                                <button className="text-slate-300 hover:text-slate-600 group-hover/column:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>

                            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                                {stageCards.map(card => (
                                    <div 
                                        key={card.id} 
                                        onClick={() => onSelectCard?.(card.id)}
                                        className="group bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-300 cursor-pointer transition-all relative overflow-hidden active:scale-[0.98]"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 uppercase tracking-widest border border-indigo-100">{card.tags[0]}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                <CalendarClock className="w-3 h-3 text-orange-400" /> {card.daysInStage} Days
                                            </div>
                                        </div>

                                        <h4 className="font-black text-slate-900 text-sm mb-1 leading-tight">{card.clientName}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase truncate mb-5 tracking-wide">{card.qualification}</p>
                                        
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 border border-slate-200 uppercase">{card.counselorId.charAt(0)}</div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{card.counselorId.split(' ')[0]}</span>
                                            </div>
                                            <span className="text-sm font-black text-slate-900 tracking-tight">{card.value}</span>
                                        </div>

                                        {card.missingDocs > 0 && (
                                            <div className="mt-4 px-3 py-1.5 bg-orange-50 rounded-xl flex items-center gap-2 border border-orange-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{card.missingDocs} Docs Missing</span>
                                            </div>
                                        )}

                                        {/* Seamless Jump Trigger */}
                                        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/[0.03] transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                            <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                <MessageSquare className="w-3.5 h-3.5" /> Jump to Inbox
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-4 text-[11px] text-slate-400 font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 hover:shadow-sm rounded-[24px] border-2 border-dashed border-slate-200 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 group">
                                    <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" /> Quick Add File
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default Kanban;
