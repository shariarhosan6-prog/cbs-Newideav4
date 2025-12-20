
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ApplicationStage, ApplicationType, InternalNote, ActivityLog } from '../types';
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
    StickyNote, AtSign, Tag as TagIcon, MessageSquare, History, FileBadge
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onUpdateStatus: (status: ApplicationStage) => void;
  onAddNote?: (note: Omit<InternalNote, 'id' | 'timestamp'>) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, onUpdateStatus, onAddNote }) => {
    const [activeSection, setActiveSection] = useState<'checklist' | 'gte' | 'notes' | 'audit' | 'local'>('checklist');
    const [isRequesting, setIsRequesting] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);

    // Note Form State
    const [noteContent, setNoteContent] = useState('');
    const [noteColor, setNoteColor] = useState<InternalNote['color']>('yellow');

    const handleNoteSubmit = () => {
        if (!noteContent.trim()) return;
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

    const handleGenerateReport = () => {
        setIsGeneratingReport(true);
        setTimeout(() => {
            const reportData = `
                STITCH RPL CRM - STUDENT INTELLIGENCE REPORT
                Name: ${conversation.client.name}
                Stage: ${conversation.currentStage}
                GS Score: ${conversation.gsScore}%
                Documents: ${conversation.documents.length} verified
                Generated on: ${new Date().toLocaleString()}
            `;
            const blob = new Blob([reportData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${conversation.client.name}_Student_Report.txt`;
            a.click();
            setIsGeneratingReport(false);
        }, 2500);
    };

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

    const gsScore = conversation.gsScore || 75;
    
    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-emerald-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-orange-500';
        return 'text-red-500';
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

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'stage_change': return <RefreshCw className="w-3.5 h-3.5 text-blue-500" />;
            case 'doc_uploaded': return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
            case 'doc_verified': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
            case 'payment_received': return <Wallet className="w-3.5 h-3.5 text-emerald-500" />;
            case 'assignment_changed': return <User className="w-3.5 h-3.5 text-purple-500" />;
            case 'note_added': return <StickyNote className="w-3.5 h-3.5 text-amber-500" />;
            default: return <History className="w-3.5 h-3.5 text-slate-400" />;
        }
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-l border-slate-200">
            <div className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"><ClipboardList className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Counselor Console</span>
                    </div>
                    
                    <h2 className="text-xl font-black tracking-tight">{conversation.client.name}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Qualification: {conversation.client.qualificationTarget}</p>
                    
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mt-6 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'checklist', label: 'Worklist', icon: CheckSquare },
                            { id: 'gte', label: 'Risk', icon: ShieldCheck },
                            { id: 'notes', label: 'Notes', icon: StickyNote },
                            { id: 'audit', label: 'Audit', icon: History },
                            { id: 'local', label: 'BD', icon: MapPin }
                        ].map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveSection(t.id as any)}
                                className={`flex-1 min-w-[56px] py-2 flex flex-col items-center gap-1 rounded-xl transition-all ${activeSection === t.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                <t.icon className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
                
                {activeSection === 'checklist' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'gte' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 pb-10">
                        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-125 transition-transform"><Target className="w-16 h-16 text-slate-900" /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center justify-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> Genuine Student Integrity
                            </h4>
                            <div className="relative inline-flex items-center justify-center mb-6">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * gsScore) / 100} strokeLinecap="round" className={`${getScoreColor(gsScore)} transition-all duration-1000 ease-out`} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-3xl font-black ${getScoreColor(gsScore)} tracking-tighter`}>{gsScore}%</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'notes' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 pb-10">
                        {isAddingNote ? (
                            <div className="bg-white rounded-[32px] p-6 border-2 border-indigo-200 shadow-2xl animate-in zoom-in-95 duration-200">
                                <textarea autoFocus value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Internal note..." className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-indigo-500/5 resize-none mb-4" />
                                <div className="flex gap-3">
                                    <button onClick={() => setIsAddingNote(false)} className="flex-1 py-3 bg-slate-100 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                                    <button onClick={handleNoteSubmit} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">Post Note</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsAddingNote(true)} className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-[28px] text-[10px] font-black text-indigo-400 uppercase flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Private Note
                            </button>
                        )}
                        <div className="space-y-4">
                            {conversation.notes.map((note) => (
                                <div key={note.id} className={`p-6 rounded-[32px] border ${getNoteColorClasses(note.color)}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-black uppercase opacity-60">@{note.authorName}</span>
                                        <span className="text-[9px] font-bold opacity-40">{new Date(note.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-bold leading-relaxed">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'audit' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction & Event History</h4>
                            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
                        </div>

                        <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 border-dashed border-l"></div>
                            
                            <div className="space-y-6">
                                {conversation.activities.length === 0 ? (
                                    <div className="text-center py-20 opacity-20">
                                        <History className="w-12 h-12 mx-auto mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No activity recorded</p>
                                    </div>
                                ) : (
                                    conversation.activities.map((log) => (
                                        <div key={log.id} className="relative pl-12 group">
                                            <div className="absolute left-[15px] top-1 w-[18px] h-[18px] rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10 transition-all group-hover:scale-110 group-hover:border-blue-400">
                                                {getActivityIcon(log.type)}
                                            </div>
                                            
                                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{log.content}</p>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase whitespace-nowrap ml-4">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded capitalize">Actor: {log.actorName}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(log.timestamp).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <button 
                                onClick={handleGenerateReport}
                                disabled={isGeneratingReport}
                                className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                {isGeneratingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileBadge className="w-3.5 h-3.5" />}
                                Export Compliance PDF
                            </button>
                        </div>
                    </div>
                )}

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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 bg-white border-t border-slate-200 flex gap-4 z-30 shadow-[0_-15px_30px_rgba(0,0,0,0.03)] shrink-0">
                 <button 
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2 active:scale-95"
                 >
                    {isGeneratingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <HistoryIcon className="w-4 h-4" />} 
                    Student Report
                 </button>
                 <button onClick={() => onUpdateStatus('visa_lodged')} className="flex-1 py-4 bg-blue-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95">
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

export default ClientIntelligence;
