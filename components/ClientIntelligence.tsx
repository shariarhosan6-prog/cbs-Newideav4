
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ActivityLog, ApplicationStage } from '../types';
import { 
    User, FileText, GraduationCap, History, CheckCircle, Clock, 
    ShieldCheck, Zap, MoreHorizontal, ChevronDown, Rocket, AlertTriangle, Plus, Send
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onAddDocument: (name: string) => void;
  onAddEducation: (edu: EducationEntry) => void;
  onUpdateStatus: (status: ApplicationStage) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, isOpen, onAddDocument, onAddEducation, onUpdateStatus }) => {
    const [activeSection, setActiveSection] = useState<'profile' | 'docs' | 'activity'>('profile');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [gapExplanations, setGapExplanations] = useState<Record<string, string>>({});
    const [showGapInput, setShowGapInput] = useState<string | null>(null);
    
    const verifiedCount = conversation.documents.filter(d => d.status === 'verified').length;
    const progressPercent = Math.round((verifiedCount / conversation.documents.length) * 100) || 0;

    const RPL_STAGES: ApplicationStage[] = ['lead', 'evidence_collection', 'mediator_review', 'rto_submission', 'certified'];
    const ADM_STAGES: ApplicationStage[] = ['lead', 'app_lodged', 'conditional_offer', 'gte_assessment', 'coe_issued'];
    const availableStages = conversation.client.qualificationTarget.toLowerCase().includes('cert') || conversation.client.qualificationTarget.toLowerCase().includes('dip') 
        ? RPL_STAGES : ADM_STAGES;

    // Study Gap Detection Logic
    const sortedEducation = [...conversation.client.educationHistory].sort((a, b) => a.startYear - b.startYear);
    
    const renderTimelineWithGaps = () => {
        const timelineElements: React.ReactNode[] = [];
        
        sortedEducation.forEach((edu, index) => {
            // Add the education entry
            timelineElements.push(
                <div key={edu.id} className="relative pl-7 border-l-2 border-slate-100 pb-2 group last:pb-0">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    </div>
                    <p className="text-xs font-black text-slate-800 leading-none">{edu.level}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-tight">{edu.institution}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{edu.startYear} — {edu.endYear}</p>
                </div>
            );

            // Check for gap after this entry
            const nextEdu = sortedEducation[index + 1];
            if (nextEdu) {
                const gapYears = nextEdu.startYear - edu.endYear;
                if (gapYears >= 1) {
                    const gapId = `gap-${edu.id}-${nextEdu.id}`;
                    timelineElements.push(
                        <div key={gapId} className="relative pl-7 border-l-2 border-slate-100 py-4 my-2">
                            <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                            </div>
                            
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 animate-in fade-in slide-in-from-left-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                                        Significant Study Gap ({gapYears} {gapYears === 1 ? 'Year' : 'Years'})
                                    </span>
                                </div>
                                
                                {gapExplanations[gapId] ? (
                                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-amber-100 italic">
                                        "{gapExplanations[gapId]}"
                                    </div>
                                ) : (
                                    <>
                                        {showGapInput === gapId ? (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Reason for gap..."
                                                    className="flex-1 text-[11px] bg-white border border-amber-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            setGapExplanations({ ...gapExplanations, [gapId]: (e.target as HTMLInputElement).value });
                                                            setShowGapInput(null);
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                                <button 
                                                    onClick={() => setShowGapInput(null)}
                                                    className="p-1 text-slate-400 hover:text-slate-600"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setShowGapInput(gapId)}
                                                className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 hover:text-amber-900 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> Add Gap Explanation (Required for Compliance)
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                }
            }
        });
        
        return timelineElements;
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-l border-slate-100">
            {/* 1. Header & Profile Card */}
            <div className="p-6 bg-white border-b border-slate-100 z-20">
                <div className="flex items-center gap-4 mb-6">
                    <img src={conversation.client.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border ring-4 ring-slate-50 shadow-sm" />
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">{conversation.client.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                             <div className="relative">
                                <button 
                                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                    className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                >
                                    {conversation.currentStep}
                                    <ChevronDown className="w-3 h-3" />
                                </button>

                                {isStatusDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-50 animate-in zoom-in-95">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest p-2">Update Progression</p>
                                        {availableStages.map(stage => (
                                            <button 
                                                key={stage}
                                                onClick={() => { onUpdateStatus(stage); setIsStatusDropdownOpen(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${conversation.currentStage === stage ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
                                            >
                                                {stage.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                {(stage === 'rto_submission' || stage === 'app_lodged') && <Rocket className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {[
                        { id: 'profile', label: 'Info', icon: User },
                        { id: 'docs', label: 'Docs', icon: FileText },
                        { id: 'activity', label: 'Log', icon: History }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50/50">
                
                {activeSection === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* Financials Summary */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl shadow-slate-200 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Status</p>
                                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">VERIFIED</span>
                                </div>
                                <h3 className="text-3xl font-black mb-1 tracking-tight">${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6 opacity-70">Outstanding Balance</p>
                                <button className="w-full bg-white text-slate-900 hover:bg-indigo-50 transition-all text-[11px] font-black uppercase tracking-widest py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95">
                                    <Zap className="w-4 h-4 text-indigo-600 fill-current" /> Send Payment Link
                                </button>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-sm">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><History className="w-4 h-4" /></div>
                                 <div>
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                                     <p className="text-xs font-bold text-slate-800">{conversation.client.experienceYears} Years Professional</p>
                                 </div>
                             </div>
                        </div>

                        {/* Education History Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-indigo-500" /> Academic Timeline
                            </h4>
                            <div className="space-y-2">
                                {renderTimelineWithGaps()}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'docs' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Submission Integrity</h4>
                                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{progressPercent}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                <div style={{width: `${progressPercent}%`}} className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000"></div>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {conversation.documents.map(doc => (
                                <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        {doc.status === 'verified' ? (
                                            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><CheckCircle className="w-4 h-4" /></div>
                                        ) : (
                                            <div className="p-2 bg-amber-50 text-amber-500 rounded-xl animate-pulse"><Clock className="w-4 h-4" /></div>
                                        )}
                                        <div>
                                            <span className="text-xs font-bold text-slate-800 block">{doc.name}</span>
                                            {doc.uploadDate && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>}
                                        </div>
                                    </div>
                                    <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                                </div>
                            ))}
                            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all">
                                Request Additional Evidence
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === 'activity' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <ShieldCheck className="w-5 h-5 text-indigo-500" /> Operational Protocol Log
                        </h4>
                        <div className="space-y-8 relative">
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                            {conversation.activities.map((log) => (
                                <div key={log.id} className="flex gap-4 relative z-10">
                                    <div className="shrink-0 w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-[10px] text-indigo-600 uppercase">
                                        {log.staffName.charAt(0)}
                                    </div>
                                    <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{log.staffName}</p>
                                            <span className="text-[9px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 font-medium">{log.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Internal icon for closing input
const XCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
);

export default ClientIntelligence;
