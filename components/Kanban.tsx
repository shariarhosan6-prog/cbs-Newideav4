
import React, { useState } from 'react';
import { ApplicationStage, ApplicationCard, ApplicationType } from '../types';
import { MoreHorizontal, Plus, Search, Filter, CalendarClock, FileText, User, GraduationCap, Briefcase, ChevronDown, MessageSquare } from 'lucide-react';

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

  // --- MOCK DATA (Mixed) ---
  const allCards: ApplicationCard[] = [
    // RPL CARDS (Matching IDs with Conversations)
    { 
        id: 'c1', type: 'rpl', clientName: 'Sarah Jenkins', qualification: 'Dip. Project Mgmt', stage: 'mediator_review', 
        tags: ['Direct'], value: '$2,500', daysInStage: 2, missingDocs: 1, counselorId: 'Jessica Wu' 
    },
    { 
        id: 'c2', type: 'rpl', clientName: 'Michael Chen', qualification: 'Cert IV Cookery', stage: 'evidence_collection', 
        tags: ['Global Ed'], value: '$3,200', daysInStage: 14, missingDocs: 4, counselorId: 'David Kim' 
    },
    { 
        id: 'c3', type: 'rpl', clientName: 'Elena Rodriguez', qualification: 'Dip. ECE', stage: 'rto_submission', 
        tags: ['Direct'], value: '$1,800', daysInStage: 5, missingDocs: 0, counselorId: 'Amanda Lee' 
    },
    // ADMISSION CARDS
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
        {/* Toolbar */}
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8 bg-white shadow-sm z-10">
            <div className="flex items-center gap-6">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                    <button 
                        onClick={() => setActivePipeline('rpl')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePipeline === 'rpl' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Briefcase className="w-3.5 h-3.5" />
                        RPL Pipeline
                    </button>
                    <button 
                        onClick={() => setActivePipeline('admission')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activePipeline === 'admission' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Admissions
                    </button>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {activePipeline === 'rpl' ? 'RPL Applications' : 'University Admissions'}
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{filteredCards.length}</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Pipeline Value: ${totalValue.toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg transition-all">
                    <Plus className="w-4 h-4" /> New Lead
                 </button>
            </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
            <div className="flex h-full gap-6 min-w-[1400px]">
                {currentStages.map(stage => {
                    const stageCards = filteredCards.filter(c => c.stage === stage.id);
                    return (
                        <div key={stage.id} className="w-80 flex flex-col h-full rounded-2xl bg-slate-100/50 border border-slate-200/60 overflow-hidden">
                            <div className="p-4 bg-white/50 border-b border-slate-100">
                                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${activePipeline === 'rpl' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                                    {stage.label}
                                </h3>
                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{stageCards.length} Applications</div>
                            </div>
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                {stageCards.map(card => (
                                    <div 
                                        key={card.id} 
                                        onClick={() => onSelectCard?.(card.id)}
                                        className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase border border-slate-200">{card.tags[0]}</span>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><CalendarClock className="w-3 h-3" /> {card.daysInStage}d</div>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{card.clientName}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium truncate mb-4">{card.qualification}</p>
                                        
                                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">{card.counselorId.charAt(0)}</div>
                                                <span className="text-[10px] font-bold text-slate-400">{card.counselorId.split(' ')[0]}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-800">{card.value}</span>
                                        </div>

                                        {/* Action Overlay */}
                                        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                            <div className="bg-white text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-xl flex items-center gap-1.5 translate-y-4 group-hover:translate-y-0 transition-transform">
                                                <MessageSquare className="w-3 h-3" /> Open Conversation
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
