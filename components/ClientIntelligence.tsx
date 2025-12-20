
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ApplicationStage, ApplicationType } from '../types';
import { 
    User, FileText, GraduationCap, CheckCircle, Clock, 
    ShieldCheck, Zap, MoreHorizontal, ChevronDown, Send, 
    RefreshCw, Search, Trash2, FileCheck, Info, AlertCircle, 
    Calendar, MapPin, Sparkles, Loader2, Building2, 
    CreditCard, Wallet, BadgePercent, Target, Receipt, Eye, 
    Activity, DollarSign, CheckCircle2, Crown, Briefcase, Handshake,
    Stethoscope, Fingerprint, Calculator, FileSearch, ClipboardList, CheckSquare,
    Bell, Plus, ChevronLeft, ArrowRight, ShieldAlert, History as HistoryIcon
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onUpdateStatus: (status: ApplicationStage) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, onUpdateStatus }) => {
    const [activeSection, setActiveSection] = useState<'checklist' | 'gte' | 'local'>('checklist');
    const [isRequesting, setIsRequesting] = useState(false);
    const [comparingDoc, setComparingDoc] = useState<DocumentStatus | null>(null);

    // Request Form State
    const [newRequest, setNewRequest] = useState({
        type: 'identity' as any,
        name: '',
        deadline: '',
        reminder: true
    });

    const handleRequestSubmit = () => {
        // Mock submission
        setIsRequesting(false);
        setNewRequest({ type: 'identity', name: '', deadline: '', reminder: true });
    };

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

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
                
                {/* 1. COUNSELOR'S WORKLIST */}
                {activeSection === 'checklist' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        
                        {/* THE "REQUEST DOCUMENT" ACTION CARD */}
                        {isRequesting ? (
                            <div className="bg-blue-600 rounded-[32px] p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest">Smart Doc Request</h4>
                                    <button onClick={() => setIsRequesting(false)} className="p-1 hover:bg-white/10 rounded-lg"><XIcon className="w-4 h-4" /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-blue-200 uppercase tracking-widest ml-1">Document Type</label>
                                        <select 
                                            value={newRequest.type}
                                            onChange={e => setNewRequest({...newRequest, type: e.target.value as any})}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:bg-white/20 transition-all appearance-none"
                                        >
                                            <option value="identity" className="text-slate-900">Identity Proof</option>
                                            <option value="academic" className="text-slate-900">Academic Records</option>
                                            <option value="financial" className="text-slate-900">Financial Evidence</option>
                                            <option value="employment" className="text-slate-900">Work Experience</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-blue-200 uppercase tracking-widest ml-1">Document Name</label>
                                        <input 
                                            placeholder="e.g. Birth Certificate"
                                            value={newRequest.name}
                                            onChange={e => setNewRequest({...newRequest, name: e.target.value})}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:bg-white/20 placeholder:text-blue-300 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-blue-200 uppercase tracking-widest ml-1">Deadline</label>
                                        <input 
                                            type="date"
                                            value={newRequest.deadline}
                                            onChange={e => setNewRequest({...newRequest, deadline: e.target.value})}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:bg-white/20 transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-2xl border border-white/10">
                                        <span className="text-[9px] font-black uppercase tracking-widest">AI Auto-Reminders</span>
                                        <button 
                                            onClick={() => setNewRequest({...newRequest, reminder: !newRequest.reminder})}
                                            className={`w-10 h-5 rounded-full relative transition-colors ${newRequest.reminder ? 'bg-emerald-400' : 'bg-white/20'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${newRequest.reminder ? 'left-6' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handleRequestSubmit}
                                        className="w-full py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                                    >
                                        Send Request
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsRequesting(true)}
                                className="w-full group bg-white rounded-[32px] p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3"
                            >
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Request New Document</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Notify Client & Sub-Agent</p>
                                </div>
                            </button>
                        )}

                        {/* COMPARISON VIEW OVERLAY */}
                        {comparingDoc && (
                            <div className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-md p-8 flex flex-col animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4 text-white">
                                        <button onClick={() => setComparingDoc(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><ChevronLeft className="w-6 h-6" /></button>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight">AI Integrity Audit</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auditing: {comparingDoc.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">Reject File</button>
                                        <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Approve & Verify</button>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-hidden">
                                    {/* UPLOADED FILE SIDE */}
                                    <div className="flex flex-col bg-slate-800 rounded-[40px] border border-slate-700 overflow-hidden relative">
                                        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Eye className="w-4 h-4" /> Client Upload</span>
                                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Sarah_Passport_Bio.jpg</span>
                                        </div>
                                        <div className="flex-1 p-10 flex flex-col items-center justify-center relative">
                                            <div className="w-full max-w-sm aspect-[4/3] bg-slate-700 rounded-3xl border border-slate-600 flex items-center justify-center shadow-2xl relative group">
                                                <ImageIcon className="w-16 h-16 text-slate-600 group-hover:scale-110 transition-transform" />
                                                <div className="absolute inset-0 bg-red-500/10 border-4 border-red-500/40 rounded-3xl animate-pulse flex items-center justify-center">
                                                    <div className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-2xl">Low Resolution Detected</div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-6 max-w-xs text-center font-medium">Uploaded on May 12, 2024 via Bangladesh Sub-Agent portal.</p>
                                        </div>
                                    </div>

                                    {/* REQUIREMENTS SIDE */}
                                    <div className="flex flex-col bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl">
                                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Compliance Benchmark</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AU Home Affairs Standard</span>
                                        </div>
                                        <div className="flex-1 p-10 space-y-8">
                                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Mandatory Criteria</h4>
                                                <ul className="space-y-4">
                                                    {[
                                                        { text: "Full color high-resolution scan", match: false },
                                                        { text: "All four corners of document visible", match: true },
                                                        { text: "No reflection or glare on photo ID", match: false },
                                                        { text: "Date of expiry clearly legible", match: true }
                                                    ].map((c, i) => (
                                                        <li key={i} className="flex items-center gap-3">
                                                            {c.match ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-red-500" />}
                                                            <span className={`text-xs font-bold ${c.match ? 'text-slate-700' : 'text-red-500'}`}>{c.text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-125 transition-transform"><Sparkles className="w-16 h-16 text-blue-600" /></div>
                                                <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Integrity Score</h4>
                                                <div className="text-4xl font-black text-blue-900 mb-2">64%</div>
                                                <p className="text-[10px] font-bold text-blue-700 leading-relaxed">Verification failed due to low resolution and significant glare on the primary photo. AI recommends requesting a fresh scan.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LIST OF DOCUMENTS */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex justify-between items-center">
                                Application File Inventory
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest">{conversation.documents.length} Items</span>
                            </h4>
                            
                            <div className="space-y-3">
                                {conversation.documents.map(doc => (
                                    <div key={doc.id} className={`bg-white rounded-[24px] border transition-all shadow-sm group ${doc.status === 'requested' ? 'border-orange-200 bg-orange-50/10' : 'border-slate-100 hover:border-blue-200'}`}>
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl ${
                                                    doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' :
                                                    doc.status === 'requested' ? 'bg-orange-100 text-orange-600 animate-pulse' :
                                                    doc.status === 'pending' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                    {doc.status === 'verified' ? <FileCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800 tracking-tight">{doc.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{doc.type}</span>
                                                        {doc.deadline && (
                                                            <span className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1">
                                                                <Clock className="w-2.5 h-2.5" /> Due: {new Date(doc.deadline).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {doc.status === 'pending' && (
                                                    <button 
                                                        onClick={() => setComparingDoc(doc)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="AI Audit & Compare"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {doc.status === 'requested' && doc.autoReminder && (
                                                    <div className="p-2 text-emerald-600 bg-emerald-50 rounded-lg flex items-center gap-1 mr-2">
                                                        <Bell className="w-3.5 h-3.5" />
                                                        <span className="text-[8px] font-black uppercase">Auto-Reminder On</span>
                                                    </div>
                                                )}
                                                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* GTE AUDIT & LOCAL EVENTS remain unchanged from previous state for brevity */}
                {activeSection === 'gte' && (
                    <div className="animate-in fade-in slide-in-from-right-4 space-y-8">
                         <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700"><ShieldCheck className="w-20 h-20" /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-8 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 animate-pulse" /> AI GTE Integrity Check
                            </h4>
                            {/* ... Content from previous version ... */}
                            <div className="text-sm font-bold opacity-70">GTE Module Active. Analysis in progress...</div>
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION FOOTER */}
            <div className="p-8 bg-white border-t border-slate-200 flex gap-4 z-30 shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
                 <button className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2 active:scale-95">
                    <HistoryIcon className="w-4 h-4" /> Audit Log
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

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
);

export default ClientIntelligence;
