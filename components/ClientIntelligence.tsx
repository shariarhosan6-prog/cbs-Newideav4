
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ApplicationStage, ApplicationType, InternalNote } from '../types';
import { 
    User, FileText, GraduationCap, CheckCircle, Clock, 
    ShieldCheck, Zap, MoreHorizontal, ChevronDown, Send, 
    RefreshCw, Search, Trash2, FileCheck, Info, AlertCircle, 
    Calendar, MapPin, Sparkles, Loader2, Building2, 
    CreditCard, Wallet, BadgePercent, Target, Receipt, Eye, 
    Activity, DollarSign, CheckCircle2, Crown, Briefcase, Handshake,
    Stethoscope, Fingerprint, Calculator, FileSearch, ClipboardList, CheckSquare,
    Bell, Plus, ChevronLeft, ArrowRight, ShieldAlert, History as HistoryIcon,
    AlertTriangle, CheckSquare as CheckSquareIcon, ListChecks, TrendingDown,
    StickyNote, AtSign, Tag as TagIcon, MessageSquare
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onUpdateStatus: (status: ApplicationStage) => void;
  onAddNote?: (note: Omit<InternalNote, 'id' | 'timestamp'>) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, onUpdateStatus, onAddNote }) => {
    const [activeSection, setActiveSection] = useState<'checklist' | 'gte' | 'notes' | 'local'>('checklist');
    const [isRequesting, setIsRequesting] = useState(false);
    const [comparingDoc, setComparingDoc] = useState<DocumentStatus | null>(null);
    const [isAddingNote, setIsAddingNote] = useState(false);

    // Note Form State
    const [noteContent, setNoteContent] = useState('');
    const [noteColor, setNoteColor] = useState<InternalNote['color']>('yellow');

    const handleNoteSubmit = () => {
        if (!noteContent.trim()) return;
        
        // Simple regex for @mentions detection
        const mentions = noteContent.match(/@(\w+)/g)?.map(m => m.substring(1)) || [];
        
        if (onAddNote) {
            onAddNote({
                content: noteContent,
                authorName: "Alex (Admin)",
                color: noteColor,
                mentions: mentions
            });
        }
        
        setNoteContent('');
        setIsAddingNote(false);
    };

    // Request Form State
    const [newRequest, setNewRequest] = useState({
        type: 'identity' as any,
        name: '',
        deadline: '',
        reminder: true
    });

    const handleRequestSubmit = () => {
        setIsRequesting(false);
        setNewRequest({ type: 'identity', name: '', deadline: '', reminder: true });
    };

    // --- Risk Assessment Logic ---
    const gsScore = conversation.gsScore || 75;
    const riskLevel = conversation.visaRiskLevel || 'medium';
    
    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-emerald-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-orange-500';
        return 'text-red-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 85) return 'bg-emerald-500';
        if (score >= 70) return 'bg-blue-500';
        if (score >= 50) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getNoteColorClasses = (color: InternalNote['color']) => {
        switch (color) {
            case 'yellow': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
            case 'blue': return 'bg-blue-50 border-blue-200 text-blue-900';
            case 'red': return 'bg-red-50 border-red-200 text-red-900';
            case 'green': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
            case 'purple': return 'bg-purple-50 border-purple-200 text-purple-900';
            default: return 'bg-slate-50 border-slate-200 text-slate-900';
        }
    };

    const getNoteIconColor = (color: InternalNote['color']) => {
        switch (color) {
            case 'yellow': return 'text-yellow-500';
            case 'blue': return 'text-blue-500';
            case 'red': return 'text-red-500';
            case 'green': return 'text-emerald-500';
            case 'purple': return 'text-purple-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-l border-slate-200">
            {/* COUNSELOR STATUS HEADER */}
            <div className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0">
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
                            { id: 'gte', label: 'Risk Audit', icon: ShieldCheck },
                            { id: 'notes', label: 'Notes', icon: StickyNote },
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

                {/* 2. RISK ASSESSMENT PANEL (GTE AUDIT) */}
                {activeSection === 'gte' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 pb-10">
                        
                        {/* A. GS SCORE GAUGE */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-125 transition-transform"><Target className="w-16 h-16 text-slate-900" /></div>
                            
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center justify-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> Genuine Student Integrity
                            </h4>

                            <div className="relative inline-flex items-center justify-center mb-6">
                                {/* SVG Circular Gauge */}
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={364}
                                        strokeDashoffset={364 - (364 * gsScore) / 100}
                                        strokeLinecap="round"
                                        className={`${getScoreColor(gsScore)} transition-all duration-1000 ease-out`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-3xl font-black ${getScoreColor(gsScore)} tracking-tighter`}>{gsScore}%</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                                </div>
                            </div>

                            <div className={`px-4 py-2 rounded-2xl ${getScoreBg(gsScore)}/10 border ${getScoreBg(gsScore)}/20 inline-block`}>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${getScoreColor(gsScore)}`}>
                                    Status: {riskLevel.toUpperCase()} RISK PROFILE
                                </p>
                            </div>
                        </div>

                        {/* B. RISK FACTORS BREAKDOWN */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">High Impact Risk Factors</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { label: "Financial Capability", impact: "Critical", score: 85, icon: DollarSign, color: "emerald" },
                                    { label: "Study Gap Evidence", impact: "High", score: 40, icon: Clock, color: "red" },
                                    { label: "Academic Progression", impact: "Medium", score: 65, icon: GraduationCap, color: "orange" },
                                    { label: "Sub-Agent Reliability", impact: "Low", score: 92, icon: Handshake, color: "emerald" }
                                ].map((factor, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl bg-${factor.color}-50 text-${factor.color}-600`}>
                                                <factor.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800">{factor.label}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Impact: {factor.impact}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-black text-${factor.color}-600`}>{factor.score}%</span>
                                            <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                <div className={`h-full bg-${factor.color}-500`} style={{width: `${factor.score}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* C. RED FLAGS HIGHLIGHT */}
                        <div className="bg-red-50 rounded-[32px] p-6 border border-red-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldAlert className="w-12 h-12 text-red-600" /></div>
                            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-3.5 h-3.5" /> AI Detected Red Flags
                            </h4>
                            <div className="space-y-3">
                                {[
                                    "2-year unexplained gap post Bachelor completion.",
                                    "Passport expiring in less than 6 months.",
                                    "Inconsistent financial source of funds from sub-agent."
                                ].map((flag, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                                        <p className="text-[10px] font-bold text-red-700 leading-relaxed">{flag}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* D. STRATEGIC RECOMMENDATIONS */}
                        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 fill-current" /> AI Strategic Recommendations
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] font-black text-blue-400 uppercase mb-1 tracking-widest">Primary Action</p>
                                    <p className="text-xs font-bold leading-relaxed opacity-90">Request Employment Letter or Professional Year certificate to explain the 2021-2023 gap.</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-1 tracking-widest">Secondary Action</p>
                                    <p className="text-xs font-bold leading-relaxed opacity-90">Schedule a mock GTE interview to assess oral communication skills for visa interview readiness.</p>
                                </div>
                            </div>
                        </div>

                        {/* E. RISK MITIGATION CHECKLIST */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
                                Risk Mitigation Checklist
                                <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">2/5 Done</span>
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { task: "Verify Financial Sponsor Bank Statements", done: true },
                                    { task: "Cross-check Sub-Agent Verification Stamp", done: true },
                                    { task: "Obtain Gap Explanation Affidavit", done: false },
                                    { task: "Review 3rd Version of GTE SOP", done: false },
                                    { task: "Confirm OSHC Activation Date", done: false }
                                ].map((item, i) => (
                                    <button key={i} className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${item.done ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 shadow-sm'}`}>
                                        <div className={`p-1 rounded-lg ${item.done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-300'}`}>
                                            {item.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ListChecks className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`text-[11px] font-bold ${item.done ? 'line-through opacity-60' : ''}`}>{item.task}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* 3. NOTES & INTERNAL COMMENTS PANEL */}
                {activeSection === 'notes' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 pb-10">
                        {/* A. NEW NOTE TRIGGER */}
                        {isAddingNote ? (
                            <div className="bg-white rounded-[32px] p-6 border-2 border-indigo-200 shadow-2xl animate-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600">New Sticky Note</h4>
                                    <div className="flex gap-2">
                                        {(['yellow', 'blue', 'red', 'green', 'purple'] as const).map(c => (
                                            <button 
                                                key={c} 
                                                onClick={() => setNoteColor(c)}
                                                className={`w-4 h-4 rounded-full border-2 transition-all ${noteColor === c ? 'border-slate-900 scale-125' : 'border-transparent'} 
                                                    ${c === 'yellow' ? 'bg-yellow-400' : c === 'blue' ? 'bg-blue-400' : c === 'red' ? 'bg-red-400' : c === 'green' ? 'bg-emerald-400' : 'bg-purple-400'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <textarea 
                                    autoFocus
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                    placeholder="Type your internal note... Use @name to mention team members."
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 resize-none mb-4 transition-all"
                                />
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsAddingNote(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleNoteSubmit}
                                        className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                    >
                                        Post Note
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsAddingNote(true)}
                                className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-[28px] text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-50 hover:border-indigo-400 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Private Note
                            </button>
                        )}

                        {/* B. STICKY NOTES FEED */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex justify-between items-center">
                                Team Briefing History
                                <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Private Only</span>
                            </h4>

                            <div className="space-y-4">
                                {conversation.notes.length === 0 ? (
                                    <div className="text-center py-10 opacity-30">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                                        <p className="text-xs font-black uppercase tracking-widest">No internal records</p>
                                    </div>
                                ) : (
                                    conversation.notes.map((note) => (
                                        <div key={note.id} className={`p-6 rounded-[32px] border transition-all hover:shadow-lg ${getNoteColorClasses(note.color)}`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-lg bg-white/50 ${getNoteIconColor(note.color)}`}>
                                                        <TagIcon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">@{note.authorName}</span>
                                                </div>
                                                <span className="text-[9px] font-bold opacity-40 uppercase">{new Date(note.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm font-bold leading-relaxed">
                                                {note.content.split(' ').map((word, i) => (
                                                    word.startsWith('@') 
                                                        ? <span key={i} className="text-indigo-600 bg-white/40 px-1 rounded-md mr-1">{word} </span>
                                                        : word + ' '
                                                ))}
                                            </p>
                                            <div className="flex justify-end mt-4 pt-3 border-t border-black/5 opacity-40 group">
                                                <button className="p-1 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. LOCAL EVENTS (BD EVENTS) */}
                {activeSection === 'local' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                         <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5"><MapPin className="w-16 h-16 text-slate-900" /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" /> Bangladesh Processing Hub
                            </h4>
                            
                            <div className="space-y-6">
                                <div className="relative pl-8 border-l-2 border-dashed border-slate-100">
                                    <div className="absolute -left-2.5 top-0 p-1 bg-white border-2 border-blue-500 rounded-full text-blue-500"><Stethoscope className="w-3 h-3" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase">IOM Medical Examination</p>
                                        <p className="text-xs font-bold text-slate-500 mt-1">Gulshan, Dhaka Branch</p>
                                        <p className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase w-fit mt-2">Booked: June 15, 2024</p>
                                    </div>
                                </div>

                                <div className="relative pl-8 border-l-2 border-dashed border-slate-100">
                                    <div className="absolute -left-2.5 top-0 p-1 bg-white border-2 border-slate-200 rounded-full text-slate-300"><Fingerprint className="w-3 h-3" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">VFS Biometrics Collection</p>
                                        <p className="text-xs font-bold text-slate-400 mt-1">Pending Submission of File</p>
                                    </div>
                                </div>
                                
                                <div className="pt-4 mt-6 border-t border-slate-50">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Local Lead Source</p>
                                            <p className="text-sm font-black text-slate-900">{conversation.subAgentName || 'Global Ed Bangladesh'}</p>
                                        </div>
                                        <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm">
                                            <Handshake className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
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
