
import React, { useState } from 'react';
import { ApplicationStage, ApplicationCard, ApplicationType, Conversation } from '../types';
import { 
    MoreHorizontal, Plus, Search, Filter, CalendarClock, FileText, 
    User, GraduationCap, Briefcase, ChevronDown, MessageSquare,
    Zap, ExternalLink, AlertCircle, Hammer, Landmark
} from 'lucide-react';

interface Props {
  conversations: Conversation[];
  onSelectCard?: (id: string) => void;
}

const Kanban: React.FC<Props> = ({ conversations, onSelectCard }) => {
  const [activePipeline, setActivePipeline] = useState<ApplicationType>('rpl');

  const RPL_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'New Leads', color: 'bg-slate-100' },
    { id: 'evidence_collection', label: 'Evidence Collection', color: 'bg-blue-50' },
    { id: 'mediator_review', label: 'Mediator Review', color: 'bg-indigo-50' },
    { id: 'rto_submission', label: 'RTO Processing', color: 'bg-orange-50' },
    { id: 'certified', label: 'Certified', color: 'bg-emerald-50' },
  ];

  const ADMISSION_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'Uni Enquiries', color: 'bg-slate-100' },
    { id: 'app_lodged', label: 'App Lodged', color: 'bg-purple-50' },
    { id: 'conditional_offer', label: 'Conditional Offer', color: 'bg-fuchsia-50' },
    { id: 'gte_assessment', label: 'GTE / GS Check', color: 'bg-pink-50' },
    { id: 'coe_issued', label: 'CoE Issued', color: 'bg-green-50' },
  ];

  const currentStages = activePipeline === 'rpl' ? RPL_STAGES : ADMISSION_STAGES;

  const mappedCards: ApplicationCard[] = conversations.map(c => {
      const isRpl = c.client.qualificationTarget.toLowerCase().includes('cert') || 
                    c.client.qualificationTarget.toLowerCase().includes('dip') ||
                    c.client.qualificationTarget.toLowerCase().includes('carpentry') ||
                    c.client.qualificationTarget.toLowerCase().includes('cookery') ||
                    c.client.qualificationTarget.toLowerCase().includes('plumbing') ||
                    c.client.qualificationTarget.toLowerCase().includes('painting') ||
                    c.client.qualificationTarget.toLowerCase().includes('automotive') ||
                    c.client.qualificationTarget.toLowerCase().includes('hospitality');
      const type: ApplicationType = isRpl ? 'rpl' : 'admission';
      
      return {
          id: c.id,
          type: type,
          clientName: c.client.name,
          qualification: c.client.qualificationTarget,
          stage: c.currentStage,
          tags: [c.source === 'sub_agent' ? (c.subAgentName || 'Sub-Agent') : 'Direct'],
          value: `$${c.paymentTotal.toLocaleString()}`,
          daysInStage: Math.floor((Date.now() - c.lastActive.getTime()) / (1000 * 60 * 60 * 24)) || 1,
          missingDocs: c.documents.filter(d => d.status === 'missing').length,
          counselorId: c.assignedCounselorId
      };
  });

  const filteredCards = mappedCards.filter(card => card.type === activePipeline);
  const totalValue = filteredCards.reduce((acc, card) => acc + parseFloat(card.value.replace(/[^0-9.-]+/g,"")), 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Board Toolbar */}
        <div className="h-24 shrink-0 border-b border-slate-200 flex items-center justify-between px-8 bg-white z-20 shadow-sm">
            <div className="flex items-center gap-6">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-inner">
                    <button 
                        onClick={() => setActivePipeline('rpl')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activePipeline === 'rpl' ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Hammer className="w-4 h-4" />
                        RPL Desk
                    </button>
                    <button 
                        onClick={() => setActivePipeline('admission')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activePipeline === 'admission' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Landmark className="w-4 h-4" />
                        Admissions
                    </button>
                </div>
                
                <div className="h-10 w-px bg-slate-200 hidden lg:block"></div>

                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                        {activePipeline === 'rpl' ? 'Trade Recognition Hub' : 'University Intake Hub'}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                        <Zap className="w-3.5 h-3.5 text-orange-400" /> ${totalValue.toLocaleString()} in Pipeline
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Intake Lead
                 </button>
            </div>
        </div>

        {/* Board Surface - horizontal scroll only */}
        <div className="flex-1 overflow-x-auto p-8 bg-[#f8fafc]">
            <div className="flex h-full gap-8 min-w-[1600px]">
                {currentStages.map(stage => {
                    const stageCards = filteredCards.filter(c => c.stage === stage.id);
                    return (
                        <div key={stage.id} className="w-[340px] flex flex-col h-full rounded-[32px] bg-slate-100/40 border border-slate-200/50 overflow-hidden shrink-0 shadow-sm">
                            {/* Column Header - Fixed */}
                            <div className="p-6 bg-white/60 border-b border-slate-200/50 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-widest flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${activePipeline === 'rpl' ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                                        {stage.label}
                                    </h3>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{stageCards.length} Applications</div>
                                </div>
                                <button className="text-slate-300 hover:text-slate-600 transition-opacity"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>

                            {/* Column Content - Independent Vertical Scroll */}
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar h-[calc(100vh-320px)]">
                                {stageCards.map(card => (
                                    <div 
                                        key={card.id} 
                                        onClick={() => onSelectCard?.(card.id)}
                                        className={`group bg-white p-5 rounded-[28px] border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 cursor-pointer transition-all relative overflow-hidden active:scale-[0.98] ${card.daysInStage > 5 ? 'ring-2 ring-red-100 shadow-red-50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border ${activePipeline === 'rpl' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                                {card.tags[0]}
                                            </span>
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
                                            <div className="mt-4 px-3 py-1.5 bg-red-50 rounded-xl flex items-center gap-2 border border-red-100">
                                                <AlertCircle className="w-3 h-3 text-red-500" />
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{card.missingDocs} Missing Evidence</span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/[0.03] transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                            <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                <MessageSquare className="w-3.5 h-3.5" /> Jump to Inbox
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {stageCards.length === 0 && (
                                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Active Files</p>
                                    </div>
                                )}

                                <button className="w-full py-4 text-[11px] text-slate-400 font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 rounded-[24px] border-2 border-dashed border-slate-200 hover:border-indigo-100 transition-all flex items-center justify-center gap-2 group">
                                    <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" /> Intake Lead
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
