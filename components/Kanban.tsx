
import React, { useState } from 'react';
import { ApplicationStage, ApplicationCard, ApplicationType, Conversation } from '../types';
import { 
    MoreHorizontal, Plus, CalendarClock, AlertCircle, Hammer, Landmark, BarChart2, Filter, X,
    Globe, PlaneLanding
} from 'lucide-react';

interface Props {
  conversations: Conversation[];
  onSelectCard?: (id: string) => void;
  filterPartnerId?: string | null;
  onClearFilter?: () => void;
  onAddLead?: () => void;
}

const Kanban: React.FC<Props> = ({ conversations, onSelectCard, filterPartnerId, onClearFilter, onAddLead }) => {
  const [activePipeline, setActivePipeline] = useState<ApplicationType>('rpl');

  const RPL_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'New Leads', color: 'bg-slate-500' },
    { id: 'evidence_collection', label: 'Documentation', color: 'bg-blue-500' },
    { id: 'mediator_review', label: 'Reviewing', color: 'bg-indigo-500' },
    { id: 'rto_submission', label: 'Submitted', color: 'bg-orange-500' },
    { id: 'certified', label: 'Certified', color: 'bg-green-500' },
  ];

  const ADMISSION_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'Enquiries', color: 'bg-slate-500' },
    { id: 'app_lodged', label: 'Lodged', color: 'bg-purple-500' },
    { id: 'conditional_offer', label: 'Offer Sent', color: 'bg-pink-500' },
    { id: 'gte_assessment', label: 'GTE Check', color: 'bg-cyan-500' },
    { id: 'coe_issued', label: 'CoE Issued', color: 'bg-emerald-500' },
  ];

  const currentStages = activePipeline === 'rpl' ? RPL_STAGES : ADMISSION_STAGES;

  const mappedCards: any[] = conversations.map(c => {
      const isRpl = c.client.qualificationTarget.toLowerCase().includes('cert') || 
                    c.client.qualificationTarget.toLowerCase().includes('dip') ||
                    c.client.qualificationTarget.toLowerCase().includes('rpl');
      const type: ApplicationType = isRpl ? 'rpl' : 'admission';
      
      return {
          id: c.id,
          partnerId: c.partnerId,
          type: type,
          clientName: c.client.name,
          qualification: c.client.qualificationTarget,
          stage: c.currentStage,
          tags: [c.source === 'sub_agent' ? (c.subAgentName || 'Sub-Agent') : 'Direct'],
          value: `$${c.paymentTotal.toLocaleString()}`,
          daysInStage: Math.floor((Date.now() - c.lastActive.getTime()) / (1000 * 60 * 60 * 24)) || 1,
          missingDocs: c.documents.filter(d => d.status === 'missing').length,
          counselorId: c.assignedCounselorId,
          onshore: c.onshoreStatus === 'landed',
          isB2B: c.source === 'sub_agent'
      };
  });

  const filteredCards = mappedCards.filter(card => {
      const matchesPipeline = card.type === activePipeline;
      const matchesPartner = filterPartnerId ? card.partnerId === filterPartnerId : true;
      return matchesPipeline && matchesPartner;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
        {/* Header */}
        <div className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                    <button 
                        onClick={() => setActivePipeline('rpl')}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePipeline === 'rpl' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        RPL Pipeline
                    </button>
                    <button 
                        onClick={() => setActivePipeline('admission')}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePipeline === 'admission' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Academic Hub
                    </button>
                </div>
            </div>
            <button 
                onClick={onAddLead}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
                <Plus className="w-4 h-4 mr-2 inline" /> Create File
            </button>
        </div>

        {/* Kanban Surface */}
        <div className="flex-1 overflow-x-auto p-6 flex gap-6 h-full bg-slate-100">
            {currentStages.map(stage => {
                const stageCards = filteredCards.filter(c => c.stage === stage.id);
                return (
                    <div key={stage.id} className="w-80 shrink-0 flex flex-col h-full">
                        {/* Column Title */}
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">{stage.label}</h3>
                                <span className="bg-white border border-slate-200 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full">{stageCards.length}</span>
                            </div>
                        </div>

                        {/* Cards container */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-24 pr-1">
                            {stageCards.map(card => (
                                <div 
                                    key={card.id} 
                                    onClick={() => onSelectCard?.(card.id)}
                                    className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-xl cursor-pointer transition-all group animate-in fade-in slide-in-from-bottom-2 duration-300 relative overflow-hidden"
                                >
                                    {card.onshore && (
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500 text-white flex items-center justify-center rounded-bl-2xl shadow-sm z-10">
                                            <PlaneLanding className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${card.isB2B ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {card.tags[0]}
                                            </span>
                                            {!card.onshore && (
                                                <span className="text-[8px] font-black text-slate-400 uppercase flex items-center gap-1">
                                                    <Globe className="w-2.5 h-2.5" /> Offshore
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h4 className="font-black text-slate-900 text-sm mb-1 leading-tight">{card.clientName}</h4>
                                    <p className="text-[11px] font-bold text-slate-500 truncate mb-5">{card.qualification}</p>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200 uppercase">{card.counselorId.charAt(0)}</div>
                                            <div>
                                                <span className="block text-[10px] font-black text-slate-900">{card.value}</span>
                                                <span className="block text-[9px] font-bold text-slate-400">{card.daysInStage} Days</span>
                                            </div>
                                        </div>
                                        {card.missingDocs > 0 && (
                                            <div className="flex items-center gap-1 bg-red-50 text-red-500 px-2 py-1 rounded-lg">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-black">{card.missingDocs}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={onAddLead}
                                className="w-full py-4 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] hover:text-indigo-600 border-2 border-dashed border-slate-200 rounded-[24px] hover:bg-white hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Create File
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Kanban;
