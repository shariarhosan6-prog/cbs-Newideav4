
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ActivityLog, ApplicationStage, ApplicationType } from '../types';
import { 
    User, FileText, GraduationCap, History, CheckCircle, Clock, 
    ShieldCheck, Zap, MoreHorizontal, ChevronDown, Rocket, AlertTriangle, 
    Plus, Send, PlaneLanding, Repeat, Globe, Fingerprint, RefreshCw,
    Search, Trash2, ExternalLink, FileCheck, Info, AlertCircle, Calendar, MapPin
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onAddDocument: (name: string) => void;
  onAddEducation: (edu: EducationEntry) => void;
  onUpdateStatus: (status: ApplicationStage) => void;
  onSpawnService: (type: ApplicationType, target: string) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, isOpen, onAddDocument, onAddEducation, onUpdateStatus, onSpawnService }) => {
    const [activeSection, setActiveSection] = useState<'profile' | 'docs' | 'lifecycle' | 'activity'>('profile');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    
    const verifiedCount = conversation.documents.filter(d => d.status === 'verified').length;
    const progressPercent = Math.round((verifiedCount / (conversation.documents.length || 1)) * 100) || 0;

    const availableStages: ApplicationStage[] = ['lead', 'evidence_collection', 'mediator_review', 'rto_submission', 'certified', 'app_lodged', 'coe_issued', 'visa_granted', 'onshore_arrival'];

    const standardDocChecklist = [
        { name: 'Passport (Main Page)', category: 'Identity' },
        { name: 'Updated CV / Resume', category: 'Experience' },
        { name: 'Employer Reference Letter', category: 'Experience' },
        { name: 'Academic Transcripts', category: 'Education' },
        { name: 'Visa Grant Notice', category: 'Visa' },
        { name: 'IELTS/PTE Scorecard', category: 'English' }
    ];

    const sortedEducation = [...conversation.client.educationHistory].sort((a, b) => a.startYear - b.startYear);

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-l border-slate-100">
            {/* 1. Header & Profile Card */}
            <div className="p-6 bg-white border-b border-slate-100 z-20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <img src={conversation.client.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border ring-4 ring-slate-50 shadow-sm" />
                        {conversation.onshoreStatus === 'landed' && (
                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-lg">
                                <PlaneLanding className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2 truncate">
                            {conversation.client.name}
                            {conversation.source === 'sub_agent' && (
                                <span className="shrink-0 bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded font-black">B2B</span>
                            )}
                        </h2>
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
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest p-2">Process Progression</p>
                                        {availableStages.map(stage => (
                                            <button 
                                                key={stage}
                                                onClick={() => { onUpdateStatus(stage); setIsStatusDropdownOpen(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between group ${conversation.currentStage === stage ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
                                            >
                                                {stage.replace(/_/g, ' ').toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                    {[
                        { id: 'profile', label: 'Info', icon: User },
                        { id: 'lifecycle', label: 'Journey', icon: RefreshCw },
                        { id: 'docs', label: 'Docs', icon: FileText },
                        { id: 'activity', label: 'Log', icon: History }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeSection === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5 shrink-0" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50/50">
                
                {/* 1. JOURNEY HUB */}
                {activeSection === 'lifecycle' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><RefreshCw className="w-24 h-24 text-indigo-600" /></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.1em] flex items-center gap-2">
                                        <Rocket className="w-4 h-4 text-indigo-600" /> Lifecycle Roadmap
                                    </h4>
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${conversation.onshoreStatus === 'landed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                        {conversation.onshoreStatus?.toUpperCase()}
                                    </span>
                                </div>
                                
                                {/* Professional Vertical Timeline */}
                                <div className="relative pl-8 space-y-8">
                                    <div className="absolute left-[15px] top-1 bottom-1 w-[2px] bg-slate-100"></div>
                                    
                                    {conversation.journey?.map((milestone, idx) => (
                                        <div key={idx} className="relative group">
                                            {/* Milestone Point */}
                                            <div className={`absolute -left-[2.1rem] top-1 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center transition-all group-hover:scale-110 ${milestone.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`}>
                                                {milestone.status === 'completed' ? <CheckCircle className="w-2.5 h-2.5 text-white" /> : <Clock className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-[10px] font-black text-indigo-600 uppercase mb-0.5 tracking-tighter">{milestone.serviceType.replace(/_/g, ' ')}</p>
                                                        <p className="text-sm font-black text-slate-800 tracking-tight">{milestone.title}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(milestone.startDate).toLocaleDateString()}</span>
                                                    {milestone.status === 'completed' && <span className="text-emerald-500">Finished</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Future Target Milestone */}
                                    <div className="relative opacity-40">
                                        <div className="absolute -left-[2.1rem] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 bg-slate-200 flex items-center justify-center">
                                            <ShieldCheck className="w-2.5 h-2.5 text-slate-400" />
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">PR Pathway Target</p>
                                            <p className="text-sm font-bold text-slate-400 mt-1">Pending Selection</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Spawner Actions */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Active Service Triggers</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => onSpawnService('rpl', 'Trade Qualification')}
                                    className="p-5 bg-slate-900 text-white rounded-[24px] flex flex-col items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-95 group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Zap className="w-6 h-6 text-indigo-300" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Spawn RPL</span>
                                </button>
                                <button 
                                    onClick={() => onSpawnService('onshore_transfer', 'University Transfer')}
                                    className="p-5 bg-white border border-slate-200 text-slate-700 rounded-[24px] flex flex-col items-center gap-3 hover:border-indigo-200 transition-all shadow-sm active:scale-95 group"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                                        <Repeat className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Course Switch</span>
                                </button>
                                <button 
                                    onClick={() => onSpawnService('visa', 'Graduate 485 TR')}
                                    className="p-5 bg-white border border-slate-200 text-slate-700 rounded-[24px] flex flex-col items-center gap-3 hover:border-emerald-200 transition-all shadow-sm active:scale-95 group col-span-2"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Lodge TR Visa (485)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. ACADEMIC & PROFILE TAB */}
                {activeSection === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Primary Goal</p>
                                <h3 className="text-xl font-black mb-6 tracking-tight leading-tight">{conversation.client.qualificationTarget}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Visa Exp.</p>
                                        <p className="text-xs font-black truncate">{conversation.client.visaExpiry || 'No Data'}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Source</p>
                                        <p className="text-xs font-black truncate">{conversation.subAgentName || 'Direct'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-indigo-500" /> Academic Timeline
                                </h4>
                                <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                            
                            <div className="space-y-1 relative pl-4">
                                <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                                {sortedEducation.length > 0 ? (
                                    sortedEducation.map((edu, idx) => {
                                        const prevEdu = idx > 0 ? sortedEducation[idx - 1] : null;
                                        const gap = prevEdu ? edu.startYear - prevEdu.endYear : 0;
                                        const hasGap = gap >= 1;

                                        return (
                                            <React.Fragment key={edu.id}>
                                                {hasGap && (
                                                    <div className="my-3 ml-2 animate-in fade-in slide-in-from-left-2 duration-500">
                                                        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
                                                            <div className="shrink-0 p-1.5 bg-red-100 text-red-600 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">Gap Detected: {gap}Y</p>
                                                                <button className="text-[9px] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 mt-0.5"><Send className="w-2.5 h-2.5" /> Request explanation</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="relative mb-4 last:mb-0">
                                                    <div className="absolute -left-[1.05rem] top-4 w-3 h-3 rounded-full border-2 border-white bg-indigo-500 z-10 shadow-sm"></div>
                                                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-indigo-300 transition-all">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                    <p className="text-[9px] font-black text-indigo-600 uppercase">{edu.level}</p>
                                                                </div>
                                                                <p className="text-sm font-bold text-slate-800">{edu.institution}</p>
                                                                <div className="flex items-center gap-1.5 mt-1">
                                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{edu.startYear} — {edu.endYear}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                        <GraduationCap className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase">No Academic History</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. DOCUMENT MANAGEMENT TAB */}
                {activeSection === 'docs' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm">
                             <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">File Integrity</h4>
                                    <p className="text-3xl font-black text-indigo-600">{progressPercent}%</p>
                                </div>
                                <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase">{verifiedCount}/{conversation.documents.length || 0} Verified</p></div>
                             </div>
                             <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div style={{width: `${progressPercent}%`}} className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000"></div>
                             </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-1">Uploaded Files</h4>
                            <div className="space-y-2">
                                {conversation.documents.length > 0 ? (
                                    conversation.documents.map(doc => (
                                        <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}><FileCheck className="w-4 h-4" /></div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                                                    <p className="text-[9px] text-slate-400 font-medium">Uploaded {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : '—'}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{doc.status.toUpperCase()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-slate-400 italic text-[10px]">No documents uploaded.</div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Required Checklist</h4>
                            <div className="space-y-2">
                                {standardDocChecklist.map((item, idx) => {
                                    const isUploaded = conversation.documents.some(d => d.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]));
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 border border-transparent hover:bg-white hover:border-slate-200 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isUploaded ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-slate-300'}`}>{isUploaded && <CheckCircle className="w-3 h-3 text-white" />}</div>
                                                <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientIntelligence;
