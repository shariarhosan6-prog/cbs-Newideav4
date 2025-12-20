
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ApplicationStage, ApplicationType } from '../types';
import { 
    User, FileText, GraduationCap, CheckCircle, Clock, 
    ShieldCheck, Zap, MoreHorizontal, ChevronDown, Send, 
    RefreshCw, Search, Trash2, FileCheck, Info, AlertCircle, 
    Calendar, MapPin, Sparkles, Loader2, Building2, 
    CreditCard, Wallet, BadgePercent, Target, Receipt, Eye, 
    Activity, DollarSign, CheckCircle2, Crown, Briefcase, Handshake,
    Stethoscope, Fingerprint, Calculator, FileSearch, ClipboardList, CheckSquare
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onUpdateStatus: (status: ApplicationStage) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, onUpdateStatus }) => {
    const [activeSection, setActiveSection] = useState<'checklist' | 'gte' | 'local'>('checklist');

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-l border-slate-200">
            {/* COUNSELOR STATUS HEADER */}
            <div className="p-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"><ClipboardList className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Counselor Console</span>
                    </div>
                    
                    <h2 className="text-xl font-black tracking-tight">{conversation.client.name}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Qualification: {conversation.client.qualificationTarget}</p>
                    
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mt-6">
                        {[
                            { id: 'checklist', label: 'Worklist', icon: CheckSquare },
                            { id: 'gte', label: 'GTE Audit', icon: ShieldCheck },
                            { id: 'local', label: 'BD Events', icon: MapPin }
                        ].map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveSection(t.id as any)}
                                className={`flex-1 py-2 flex flex-col items-center gap-1 rounded-xl transition-all ${activeSection === t.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                <t.icon className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* 1. COUNSELOR'S WORKLIST - MISSING DOCS & ACTIONS */}
                {activeSection === 'checklist' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        
                        {/* THE "REAL" STATUS PROGRESSION */}
                        <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-all"><Target className="w-16 h-16" /></div>
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">File Readiness Checklist</h4>
                            <div className="space-y-5">
                                {[
                                    { label: 'Identity (Passport/Visa)', status: conversation.documents.some(d => d.type === 'identity' && d.status === 'verified') ? 'done' : 'wait' },
                                    { label: '3-Month Bank Statements', status: conversation.documents.some(d => d.type === 'financial' && d.status === 'verified') ? 'done' : 'alert' },
                                    { label: 'Statement of Purpose (SOP)', status: conversation.sopStatus === 'finalized' ? 'done' : 'active' },
                                    { label: 'Offer Letter from Uni', status: conversation.currentStage === 'conditional_offer' || conversation.currentStage === 'coe_issued' ? 'done' : 'wait' },
                                    { label: 'Medicals & Biometrics', status: conversation.medicalStatus === 'completed' && conversation.biometricStatus === 'booked' ? 'done' : 'wait' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group/item">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                                            item.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 
                                            item.status === 'alert' ? 'bg-red-100 border-red-200 text-red-600' : 
                                            item.status === 'active' ? 'bg-blue-600 border-blue-600 animate-pulse text-white' : 'bg-slate-50 border-slate-200 text-slate-300'
                                        }`}>
                                            {item.status === 'done' ? <CheckCircle className="w-3.5 h-3.5" /> : item.status === 'alert' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`text-xs font-bold ${item.status === 'wait' ? 'text-slate-400' : 'text-slate-700'}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RECENT UPLOADS NEEDING COUNSELOR REVIEW */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex justify-between items-center">
                                Pending Verification
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black">ACTION REQ.</span>
                            </h4>
                            <div className="space-y-2.5">
                                {conversation.documents.filter(d => d.status === 'pending').map(doc => (
                                    <div key={doc.id} className="bg-white p-4 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><FileText className="w-4 h-4" /></div>
                                                <p className="text-xs font-black text-slate-800 truncate w-32 tracking-tight">{doc.name}</p>
                                            </div>
                                            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Verify</button>
                                            <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. GTE AUDIT - SPECIALIZED VISA RISK ASSESSMENT */}
                {activeSection === 'gte' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700"><ShieldCheck className="w-20 h-20" /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 animate-pulse" /> AI GTE Integrity Check
                            </h4>
                            
                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Academic Consistency</p>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold">NSU Degree vs Diploma</span>
                                        <span className="text-xs font-black text-emerald-400">Low Risk</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-400" style={{width: '90%'}}></div></div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Financial Source Verification</p>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold">Unexplained Deposit</span>
                                        <span className="text-xs font-black text-red-400">High Risk</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-red-400" style={{width: '30%'}}></div></div>
                                </div>
                            </div>
                            
                            <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                                Re-Scan GTE Profile
                            </button>
                        </div>

                        <section className="bg-white rounded-3xl p-6 border border-slate-200">
                             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">SOP Studio</h4>
                             <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Current Version</p>
                                        <span className="text-[9px] font-black text-blue-600 uppercase">Draft V2</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">Awaiting Sub-agent review...</p>
                                </div>
                                <button className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                    <FileSearch className="w-4 h-4" /> AI Plagiarism Scan
                                </button>
                             </div>
                        </section>
                    </div>
                )}

                {/* 3. LOCAL BD TOUCHPOINTS (Medicals, Biometrics, Finance) */}
                {activeSection === 'local' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                         {/* LOCAL BANGLADESH LOGISTICS */}
                         <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700"><Building2 className="w-20 h-20" /></div>
                             <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8">Local Compliance Hub</h4>
                             
                             <div className="space-y-8">
                                <div className="group cursor-pointer">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Stethoscope className="w-4 h-4" /></div>
                                            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">IOM Medical</span>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${conversation.medicalStatus === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {conversation.medicalStatus || 'PENDING'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 pl-10">Tracking HAP-ID verification with IOM Dhaka.</p>
                                </div>

                                <div className="group cursor-pointer">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Fingerprint className="w-4 h-4" /></div>
                                            <span className="text-xs font-black text-slate-800 uppercase tracking-tight">VFS Biometrics</span>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${conversation.biometricStatus === 'booked' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {conversation.biometricStatus || 'PENDING'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 pl-10">VFS Appointment usually takes 3-5 days to reflect.</p>
                                </div>
                             </div>
                         </div>

                         {/* SUB-AGENT LIAISON */}
                         <section className="bg-slate-50 p-6 rounded-[32px] border border-slate-200">
                             <div className="flex items-center gap-3 mb-6">
                                 <div className="p-2.5 bg-white rounded-2xl shadow-sm text-slate-400"><Handshake className="w-5 h-5" /></div>
                                 <div>
                                     <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Partner: {conversation.subAgentName || 'N/A'}</h5>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase">Origin: Dhaka Branch</p>
                                 </div>
                             </div>
                             <div className="space-y-3">
                                 <button className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                                     Notify Agent: Missing Documents
                                 </button>
                                 <button className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                                     Request Original Sight-Check
                                 </button>
                             </div>
                         </section>
                    </div>
                )}
            </div>

            {/* ACTION FOOTER */}
            <div className="p-8 bg-white border-t border-slate-200 flex gap-4 z-30 shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
                 <button className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2 active:scale-95">
                    <History className="w-4 h-4" /> Audit Log
                 </button>
                 <button 
                    onClick={() => onUpdateStatus('visa_lodged')}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95"
                 >
                    <Send className="w-4 h-4" /> Lodge Visa
                 </button>
            </div>
        </div>
    );
};

// Local History import fix
const History = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="m12 7 0 5 3 3"/>
    </svg>
);

export default ClientIntelligence;
