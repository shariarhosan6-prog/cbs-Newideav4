
import React, { useState } from 'react';
import { ApplicationStage, ApplicationCard, ApplicationType, Conversation } from '../types';
import { 
    MoreHorizontal, Plus, CalendarClock, AlertCircle, Hammer, Landmark, BarChart2
} from 'lucide-react';

interface Props {
  conversations: Conversation[];
  onSelectCard?: (id: string) => void;
}

const Kanban: React.FC<Props> = ({ conversations, onSelectCard }) => {
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

  const mappedCards: ApplicationCard[] = conversations.map(c => {
      const isRpl = c.client.qualificationTarget.toLowerCase().includes('cert') || 
                    c.client.qualificationTarget.toLowerCase().includes('dip') ||
                    c.client.qualificationTarget.toLowerCase().includes('carpentry') ||
                    c.client.qualificationTarget.toLowerCase().includes('cookery') ||
                    c.client.qualificationTarget.toLowerCase().includes('plumbing') ||
                    c.client.qualificationTarget.toLowerCase().includes('painting') ||
                    c.client.qualificationTarget.toLowerCase().includes('automotive') ||
                    c.client.qualificationTarget.toLowerCase().includes('hospitality') ||
                    c.client.qualificationTarget.toLowerCase().includes('tiling') ||
                    c.client.qualificationTarget.toLowerCase().includes('bricklaying') ||
                    c.client.qualificationTarget.toLowerCase().includes('kitchen');
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

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
        {/* Header */}
        <div className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                    <button 
                        onClick={() => setActivePipeline('rpl')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activePipeline === 'rpl' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        RPL Pipeline
                    </button>
                    <button 
                        onClick={() => setActivePipeline('admission')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activePipeline === 'admission' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Academic Hub
                    </button>
                </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Lead
            </button>
        </div>

        {/* Kanban Surface */}
        <div className="flex-1 overflow-x-auto p-4 flex gap-4 h-full">
            {currentStages.map(stage => {
                const stageCards = filteredCards.filter(c => c.stage === stage.id);
                return (
                    <div key={stage.id} className="w-80 shrink-0 flex flex-col h-full">
                        {/* Column Title */}
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-700 text-sm">{stage.label}</h3>
                                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{stageCards.length}</span>
                            </div>
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </div>

                        {/* Cards container - Independent Scroll */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-20">
                            {stageCards.map(card => (
                                <div 
                                    key={card.id} 
                                    onClick={() => onSelectCard?.(card.id)}
                                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                                            {card.tags[0]}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                            <CalendarClock className="w-3 h-3" /> {card.daysInStage}d
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-slate-900 text-sm mb-1">{card.clientName}</h4>
                                    <p className="text-[11px] text-slate-500 truncate mb-4">{card.qualification}</p>
                                    
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200 uppercase">{card.counselorId.charAt(0)}</div>
                                            <span className="text-[10px] text-slate-400 font-bold">{card.value}</span>
                                        </div>
                                        {card.missingDocs > 0 && (
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-3 text-xs text-slate-400 font-bold hover:text-blue-600 border-2 border-dashed border-slate-200 rounded-xl hover:bg-white hover:border-blue-200 transition-all flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add File
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
