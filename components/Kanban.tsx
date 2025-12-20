
import React, { useState } from 'react';
import { ApplicationStage, ApplicationType, Conversation } from '../types';
import { 
    Plus, Globe, PlaneLanding, ShieldAlert, FileSearch, Stethoscope, 
    Fingerprint, BadgePercent, ChevronRight, AlertCircle, FileText
} from 'lucide-react';

interface Props {
  conversations: Conversation[];
  onSelectCard?: (id: string) => void;
  onAddLead?: () => void;
}

const Kanban: React.FC<Props> = ({ conversations, onSelectCard, onAddLead }) => {
  const [activePipeline, setActivePipeline] = useState<ApplicationType>('admission');

  const ADMISSION_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'Intake/Lead', color: 'bg-slate-400' },
    { id: 'gs_assessment', label: 'GS/GTE Audit', color: 'bg-indigo-500' },
    { id: 'financial_audit', label: 'Finance Check', color: 'bg-blue-500' },
    { id: 'sop_drafting', label: 'SOP Drafting', color: 'bg-purple-500' },
    { id: 'rto_submission', label: 'Uni/RTO Sub', color: 'bg-orange-500' },
    { id: 'visa_lodged', label: 'Visa Lodged', color: 'bg-messenger-blue' },
    { id: 'visa_granted', label: 'Visa Granted', color: 'bg-emerald-500' },
  ];

  const currentStages = ADMISSION_STAGES;

  const filteredConversations = conversations.filter(c => {
      // In a real app, we'd filter by activePipeline type. For now, showing relevant admission flow.
      return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Header */}
        <div className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm">
            <div className="flex items-center gap-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Agency Workflow</h2>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {['admission', 'rpl', 'visa'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setActivePipeline(type as any)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${activePipeline === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={onAddLead} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
                <Plus className="w-4 h-4 mr-2 inline" /> New Enrollment
            </button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-6 flex gap-6 h-full custom-scrollbar">
            {currentStages.map(stage => {
                const stageCards = filteredConversations.filter(c => c.currentStage === stage.id);
                return (
                    <div key={stage.id} className="w-80 shrink-0 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 px-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">{stage.label}</h3>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 bg-white border border-slate-100 px-2 rounded-full">{stageCards.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pb-20 pr-1 custom-scrollbar">
                            {stageCards.map(conv => (
                                <div 
                                    key={conv.id}
                                    onClick={() => onSelectCard?.(conv.id)}
                                    className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    {/* GS RISK INDICATOR */}
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${conv.visaRiskLevel === 'low' ? 'bg-emerald-400' : conv.visaRiskLevel === 'high' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                                    
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-1.5">
                                            {conv.onshoreStatus === 'landed' ? (
                                                <span className="p-1 bg-emerald-50 text-emerald-600 rounded-lg"><PlaneLanding className="w-3 h-3" /></span>
                                            ) : (
                                                <span className="p-1 bg-blue-50 text-blue-600 rounded-lg"><Globe className="w-3 h-3" /></span>
                                            )}
                                            {conv.sopStatus === 'review_required' && (
                                                <span className="p-1 bg-purple-50 text-purple-600 rounded-lg animate-pulse"><FileText className="w-3 h-3" /></span>
                                            )}
                                        </div>
                                        <div className="flex -space-x-2">
                                            <div className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">JW</div>
                                        </div>
                                    </div>

                                    <h4 className="font-black text-slate-900 text-sm mb-1 leading-tight">{conv.client.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 truncate mb-4">{conv.subAgentName || 'Direct Lead'}</p>
                                    
                                    {/* STATUS CHIPS FOR MISSING STEPS */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className={`flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${conv.medicalStatus === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                            <Stethoscope className="w-2.5 h-2.5" /> Med
                                        </div>
                                        <div className={`flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${conv.biometricStatus === 'booked' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                            <Fingerprint className="w-2.5 h-2.5" /> Bio
                                        </div>
                                        {conv.gsScore && conv.gsScore < 70 && (
                                            <div className="flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-red-50 border-red-100 text-red-600">
                                                <ShieldAlert className="w-2.5 h-2.5" /> Low GS
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-black text-slate-900">${conv.paymentTotal.toLocaleString()}</span>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                                            {Math.floor((Date.now() - conv.lastActive.getTime()) / (1000 * 60 * 60 * 24))}d in stage
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={onAddLead} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[28px] text-[10px] font-black text-slate-300 uppercase hover:border-blue-200 hover:text-blue-500 hover:bg-white transition-all">
                                + Add Student
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
