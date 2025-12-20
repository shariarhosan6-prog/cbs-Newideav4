
import React, { useState } from 'react';
import { Conversation, ApplicationStage, InternalNote, FileTask } from '../types';
import { 
    User, FileText, FileCheck, RefreshCw, History, MapPin, Sparkles, Loader2, 
    Target, CheckSquare, Plus, DollarSign, Stethoscope, FileBadge, StickyNote,
    History as HistoryIcon, Send, ShieldCheck, ListChecks, Pin, Trash2, CheckCircle2,
    X, AlertTriangle, AlertCircle, ChevronDown
} from 'lucide-react';
import { MOCK_COUNSELORS } from '../constants';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onUpdateStatus: (status: ApplicationStage) => void;
  onAddNote?: (note: Omit<InternalNote, 'id' | 'timestamp'>) => void;
  onAddTask?: (taskId: string, task: Omit<FileTask, 'id' | 'status'>) => void;
  onToggleTask?: (taskId: string) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, onUpdateStatus, onAddNote, onAddTask, onToggleTask }) => {
    const [activeSection, setActiveSection] = useState<'checklist' | 'tasks' | 'gte' | 'notes' | 'audit'>('checklist');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);

    // Note State
    const [noteContent, setNoteContent] = useState('');
    const [noteColor, setNoteColor] = useState<InternalNote['color']>('yellow');

    // Task State
    const [taskTitle, setTaskTitle] = useState('');
    const [taskAssignee, setTaskAssignee] = useState('');

    const handleNoteSubmit = () => {
        if (!noteContent.trim()) return;
        if (onAddNote) {
            onAddNote({
                content: noteContent,
                authorName: "Alex (Admin)",
                color: noteColor,
                mentions: noteContent.match(/@(\w+)/g)?.map(m => m.substring(1)) || []
            });
        }
        setNoteContent('');
        setIsAddingNote(false);
    };

    const handleTaskSubmit = () => {
        if (!taskTitle.trim() || !taskAssignee || !onAddTask) return;
        const assignee = MOCK_COUNSELORS.find(c => c.id === taskAssignee);
        onAddTask(conversation.id, {
            title: taskTitle,
            assignedToId: taskAssignee,
            assignedToName: assignee?.name || 'Agent',
            priority: 'medium'
        });
        setTaskTitle('');
        setIsAddingTask(false);
    };

    const handleGenerateReport = () => {
        setIsGeneratingReport(true);
        setTimeout(() => {
            const reportData = `STITCH INTELLIGENCE REPORT - ${conversation.client.name}\nDifficulty: ${conversation.difficulty || 'Standard'}\nStage: ${conversation.currentStage}\nScore: ${conversation.gsScore}%`;
            const blob = new Blob([reportData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${conversation.client.name}_Report.txt`;
            a.click();
            setIsGeneratingReport(false);
        }, 2000);
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

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-l border-slate-200">
            <div className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-2.5 rounded-xl shadow-lg ${conversation.gsScore && conversation.gsScore < 60 ? 'bg-red-500 shadow-red-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
                            <Target className="w-5 h-5" />
                        </div>
                        <div className="flex gap-2">
                             {conversation.difficulty && (
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest border ${
                                    conversation.difficulty === 'critical' ? 'bg-red-500/20 border-red-500 text-red-400' :
                                    conversation.difficulty === 'complex' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-500/20 border-slate-500 text-slate-400'
                                }`}>
                                    {conversation.difficulty} Case
                                </span>
                             )}
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Intel Console</span>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-black tracking-tight">{conversation.client.name}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate">{conversation.client.qualificationTarget}</p>
                    
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mt-6 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'checklist', label: 'Inventory', icon: ListChecks },
                            { id: 'tasks', label: 'Team Tasks', icon: CheckSquare },
                            { id: 'notes', label: 'Strategy', icon: StickyNote },
                            { id: 'gte', label: 'GTE Risk', icon: ShieldCheck },
                            { id: 'audit', label: 'Log', icon: History }
                        ].map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveSection(t.id as any)}
                                className={`flex-1 min-w-[64px] py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all ${activeSection === t.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                <t.icon className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-black uppercase tracking-widest leading-none mt-0.5">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
                
                {/* CASE TASKS SECTION */}
                {activeSection === 'tasks' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        {isAddingTask ? (
                            <div className="bg-white rounded-3xl p-6 border border-indigo-200 shadow-xl animate-in zoom-in-95">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Assign Case Task</h4>
                                    <button onClick={() => setIsAddingTask(false)} className="p-1 text-slate-300 hover:text-slate-600"><X className="w-4 h-4" /></button>
                                </div>
                                <input 
                                    autoFocus
                                    value={taskTitle}
                                    onChange={e => setTaskTitle(e.target.value)}
                                    placeholder="Task description..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mb-3 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                />
                                <select 
                                    value={taskAssignee}
                                    onChange={e => setTaskAssignee(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold mb-4 outline-none appearance-none"
                                >
                                    <option value="">Assign To...</option>
                                    {MOCK_COUNSELORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <button 
                                    onClick={handleTaskSubmit}
                                    className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                                >
                                    Confirm Task
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsAddingTask(true)}
                                className="w-full group bg-white rounded-[32px] p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-3"
                            >
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <CheckSquare className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Assign File Task</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Delegate specific actions to team</p>
                                </div>
                            </button>
                        )}

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Assigned Case Tasks</h4>
                            <div className="space-y-3">
                                {conversation.tasks?.length === 0 ? (
                                    <div className="text-center py-10 opacity-20"><CheckCircle2 className="w-12 h-12 mx-auto mb-2" /><p className="text-[10px] font-black uppercase tracking-widest">No pending tasks</p></div>
                                ) : (
                                    conversation.tasks?.map(task => (
                                        <div key={task.id} className={`bg-white p-4 rounded-3xl border transition-all ${task.status === 'completed' ? 'border-slate-100 opacity-60 grayscale' : 'border-slate-100 hover:border-indigo-200 hover:shadow-md'}`}>
                                            <div className="flex items-start gap-3">
                                                <button 
                                                    onClick={() => onToggleTask?.(task.id)}
                                                    className={`mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 hover:border-indigo-600'}`}
                                                >
                                                    {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                </button>
                                                <div className="flex-1">
                                                    <p className={`text-xs font-black leading-tight ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.title}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Assigned: {task.assignedToName}</span>
                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${task.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>{task.priority}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* STRATEGY NOTES SECTION */}
                {activeSection === 'notes' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 pb-10">
                        {isAddingNote ? (
                            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xl animate-in zoom-in-95">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Shared Strategy Note</h4>
                                    <button onClick={() => setIsAddingNote(false)} className="p-1 text-slate-300 hover:text-slate-600"><X className="w-4 h-4" /></button>
                                </div>
                                <textarea 
                                    autoFocus 
                                    value={noteContent} 
                                    onChange={e => setNoteContent(e.target.value)} 
                                    placeholder="Strategic insights, GTE risks, or difficult pathway notes..." 
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-amber-500/5 resize-none mb-4 outline-none" 
                                />
                                <div className="flex gap-3">
                                    <button onClick={() => setIsAddingNote(false)} className="flex-1 py-3 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500">Cancel</button>
                                    <button onClick={handleNoteSubmit} className="flex-[2] py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-amber-200 active:scale-95">Post Shared Strategy</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsAddingNote(true)} className="w-full py-5 border-2 border-dashed border-amber-200 rounded-[32px] text-[10px] font-black text-amber-600 uppercase flex items-center justify-center gap-2 hover:bg-amber-50 transition-all">
                                <Plus className="w-4 h-4" /> Add Case Strategy
                            </button>
                        )}

                        <div className="space-y-6">
                            {/* PINNED NOTES FIRST */}
                            {conversation.notes.filter(n => n.isPinned).map(note => (
                                <div key={note.id} className="p-6 rounded-[32px] border-2 border-indigo-200 bg-white shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3"><Pin className="w-4 h-4 text-indigo-500 fill-indigo-500" /></div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">Pinned Strategy</span>
                                        <span className="text-[9px] font-bold text-slate-300">@{note.authorName}</span>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 leading-relaxed">{note.content}</p>
                                </div>
                            ))}

                            {conversation.notes.filter(n => !n.isPinned).map((note) => (
                                <div key={note.id} className={`p-6 rounded-[32px] border ${getNoteColorClasses(note.color)} hover:shadow-md transition-all`}>
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

                {/* INVENTORY / CHECKLIST */}
                {activeSection === 'checklist' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex justify-between items-center">
                            Case Documentation
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black uppercase">{conversation.documents.length} Files</span>
                        </h4>
                        <div className="space-y-3">
                            {conversation.documents.map(doc => (
                                <div key={doc.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {doc.status === 'verified' ? <FileCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 tracking-tight">{doc.name}</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{doc.type}</p>
                                        </div>
                                    </div>
                                    <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        {doc.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GTE RISK / GS SCORE */}
                {activeSection === 'gte' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-125 transition-transform"><Target className="w-24 h-24 text-slate-900" /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center justify-center gap-2">
                                <AlertTriangle className={`w-3.5 h-3.5 ${conversation.gsScore && conversation.gsScore < 70 ? 'text-red-500' : 'text-blue-500'}`} /> Genuine Student Assessment
                            </h4>
                            <div className="relative inline-flex items-center justify-center mb-10">
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                                    <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={465} strokeDashoffset={465 - (465 * (conversation.gsScore || 75)) / 100} strokeLinecap="round" className={`${(conversation.gsScore || 75) >= 85 ? 'text-emerald-500' : (conversation.gsScore || 75) >= 70 ? 'text-blue-500' : 'text-red-500'} transition-all duration-1000 ease-out`} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-black ${(conversation.gsScore || 75) >= 70 ? 'text-slate-900' : 'text-red-600'} tracking-tighter`}>{conversation.gsScore || 75}%</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Integrity Score</span>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Automated Risk Verdict</p>
                                <p className={`text-sm font-black ${(conversation.gsScore || 75) < 70 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {(conversation.gsScore || 75) < 70 ? 'HIGH RISK: Manual Audit Required' : 'OPTIMUM: Proceed to Submission'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 bg-white border-t border-slate-200 flex gap-4 z-30 shadow-[0_-15px_30px_rgba(0,0,0,0.03)] shrink-0">
                 <button 
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2 active:scale-95"
                 >
                    {isGeneratingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileBadge className="w-4 h-4" />} 
                    Case Audit
                 </button>
                 <button onClick={() => onUpdateStatus('visa_lodged')} className="flex-1 py-4 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-300 flex items-center justify-center gap-2 active:scale-95">
                    <Send className="w-4 h-4" /> Final Lodge
                 </button>
            </div>
        </div>
    );
};

export default ClientIntelligence;
