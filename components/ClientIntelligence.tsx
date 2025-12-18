
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ActivityLog, ApplicationStage, ApplicationType } from '../types';
import { 
    User, FileText, GraduationCap, History, CheckCircle, Clock, 
    ShieldCheck, Zap, MoreHorizontal, ChevronDown, Rocket, AlertTriangle, 
    Plus, Send, PlaneLanding, Repeat, Globe, Fingerprint, RefreshCw
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
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                            {conversation.client.name}
                            {conversation.source === 'sub_agent' && (
                                <span className="bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded font-black">B2B</span>
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
                
                {activeSection === 'lifecycle' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* B2B Offshore Status Card */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Offshore Origin
                                </h4>
                                {conversation.isB2BSettled && (
                                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100">COMMISSION SETTLED</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><Fingerprint className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">{conversation.subAgentName || 'Direct'}</p>
                                    <p className="text-[10px] text-slate-400">Bangladesh B2B Channel</p>
                                </div>
                            </div>
                        </div>

                        {/* Journey Timeline */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Repeat className="w-4 h-4 text-indigo-500" /> Student Lifecycle
                            </h4>
                            
                            <div className="space-y-3">
                                {conversation.journey?.map((milestone, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${milestone.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`}></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{milestone.serviceType.replace(/_/g, ' ')}</p>
                                                <p className="text-sm font-bold text-slate-800">{milestone.title}</p>
                                            </div>
                                            {milestone.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Spawning New Onshore Services */}
                            <div className="pt-4 space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Available Onshore Services</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => onSpawnService('rpl', 'Trade Qualification')}
                                        className="p-3 bg-indigo-600 text-white rounded-2xl flex flex-col items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                                    >
                                        <Zap className="w-5 h-5" />
                                        <span className="text-[9px] font-black uppercase">Start RPL</span>
                                    </button>
                                    <button 
                                        onClick={() => onSpawnService('onshore_transfer', 'University Transfer')}
                                        className="p-3 bg-white border border-slate-200 text-slate-700 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                                    >
                                        <Repeat className="w-5 h-5 text-blue-500" />
                                        <span className="text-[9px] font-black uppercase">Uni Change</span>
                                    </button>
                                    <button 
                                        onClick={() => onSpawnService('visa', 'Subclass 485 TR')}
                                        className="p-3 bg-white border border-slate-200 text-slate-700 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                                    >
                                        <PlaneLanding className="w-5 h-5 text-emerald-500" />
                                        <span className="text-[9px] font-black uppercase">TR/Visa Hub</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Journey Value</p>
                                <h3 className="text-3xl font-black mb-6 tracking-tight">${conversation.paymentTotal.toLocaleString()}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-2 rounded-xl">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase">Paid (Offshore)</p>
                                        <p className="text-xs font-black">${conversation.paymentPaid.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-indigo-500/20 p-2 rounded-xl">
                                        <p className="text-[8px] font-bold text-indigo-300 uppercase">Onshore Target</p>
                                        <p className="text-xs font-black text-indigo-400">${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-indigo-500" /> Academic Background
                            </h4>
                            <div className="space-y-4">
                                {conversation.client.educationHistory.map(edu => (
                                    <div key={edu.id} className="pl-4 border-l-2 border-slate-100">
                                        <p className="text-xs font-black text-slate-800 leading-none">{edu.level}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Docs and Activity sections remain available as fallback */}
                {activeSection === 'docs' && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">File Integrity: {progressPercent}%</h4>
                             <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div style={{width: `${progressPercent}%`}} className="h-full bg-indigo-500"></div>
                             </div>
                        </div>
                        {conversation.documents.map(doc => (
                            <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-800">{doc.name}</span>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {doc.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientIntelligence;
