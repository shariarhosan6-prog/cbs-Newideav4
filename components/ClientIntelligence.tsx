
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ActivityLog, ApplicationStage, ApplicationType, JourneyMilestone } from '../types';
import { 
    User, FileText, GraduationCap, History, CheckCircle, Clock, 
    ShieldCheck, Zap, MoreHorizontal, ChevronDown, Rocket, AlertTriangle, 
    Plus, Send, PlaneLanding, Repeat, Globe, Fingerprint, RefreshCw,
    Search, Trash2, ExternalLink, FileCheck, Info, AlertCircle, Calendar, MapPin, Sparkles, Loader2, ArrowRight
} from 'lucide-react';
import { generateMigrationStrategy } from '../services/geminiService';

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
    const [aiStrategy, setAiStrategy] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    
    const verifiedCount = conversation.documents.filter(d => d.status === 'verified').length;
    const progressPercent = Math.round((verifiedCount / (conversation.documents.length || 1)) * 100) || 0;

    const handleGenerateAiStrategy = async () => {
        setIsThinking(true);
        const strategy = await generateMigrationStrategy(conversation.client);
        setAiStrategy(strategy);
        setIsThinking(false);
    };

    const availableStages: ApplicationStage[] = ['lead', 'evidence_collection', 'mediator_review', 'rto_submission', 'certified', 'app_lodged', 'coe_issued', 'visa_granted', 'onshore_arrival'];
    const sortedEducation = [...conversation.client.educationHistory].sort((a, b) => a.startYear - b.startYear);

    // Get the current active milestone
    const currentMilestone = conversation.journey.find(m => m.status === 'active') || conversation.journey[conversation.journey.length - 1];

    const getRecommendation = (milestone: JourneyMilestone) => {
        if (milestone.serviceType === 'admission' && milestone.status === 'completed') return "Confirm Payment & OSHC";
        if (milestone.serviceType === 'visa' && milestone.status === 'completed' && conversation.onshoreStatus === 'offshore') return "Pre-Departure Briefing";
        if (conversation.onshoreStatus === 'landed' && milestone.serviceType !== 'rpl') return "Spawn Onshore RPL Review";
        return "Complete Evidence Collection";
    };

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden border-l border-slate-100">
            {/* Header Area */}
            <div className="p-6 bg-white border-b border-slate-100 z-20">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                        <img src={conversation.client.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border ring-4 ring-slate-50 shadow-sm" />
                        {conversation.onshoreStatus === 'landed' && (
                            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white">
                                <PlaneLanding className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">{conversation.client.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <button 
                                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest"
                            >
                                {conversation.currentStep} <ChevronDown className="w-3 h-3" />
                            </button>
                            {conversation.source === 'sub_agent' && (
                                <span className="bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">B2B</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {[
                        { id: 'profile', label: 'Info', icon: User },
                        { id: 'lifecycle', label: 'Journey', icon: RefreshCw },
                        { id: 'docs', label: 'Docs', icon: FileText },
                        { id: 'activity', label: 'Log', icon: History }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {activeSection === 'lifecycle' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        
                        {/* Contextual Smart Action */}
                        <div className="bg-white p-5 rounded-[28px] border border-indigo-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-16 h-16 text-indigo-600" /></div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Recommended Next Step</p>
                            <h4 className="text-sm font-bold text-slate-800 mb-4">{getRecommendation(currentMilestone)}</h4>
                            <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
                                Execute Action <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* AI STRATEGY HUB (THINKING MODE) */}
                        <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-400" /> Gemini Migration Thinker
                            </h4>
                            
                            {isThinking ? (
                                <div className="space-y-3 py-4 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
                                    <p className="text-[10px] font-black text-indigo-200 animate-pulse uppercase tracking-widest">Building Long-term Roadmap...</p>
                                </div>
                            ) : aiStrategy ? (
                                <div className="bg-white/10 p-4 rounded-2xl border border-white/5 max-h-60 overflow-y-auto custom-scrollbar-white">
                                    <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap">{aiStrategy}</p>
                                    <button onClick={() => setAiStrategy(null)} className="mt-4 text-[10px] font-black uppercase underline text-indigo-300">New Strategy</button>
                                </div>
                            ) : (
                                <div className="text-center py-2">
                                    <p className="text-xs text-slate-400 font-medium mb-4">Deep analysis of visa expiry vs qualification timelines.</p>
                                    <button 
                                        onClick={handleGenerateAiStrategy}
                                        className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95"
                                    >
                                        Run Predictive Engine
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Professional Visual Roadmap */}
                        <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Global Journey Flow</h4>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${conversation.onshoreStatus === 'landed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {conversation.onshoreStatus?.toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="relative pl-8 space-y-8">
                                <div className="absolute left-[15px] top-1 bottom-1 w-[2px] bg-slate-100"></div>
                                
                                {conversation.journey?.map((milestone, idx) => (
                                    <div key={idx} className="relative group">
                                        {/* Point */}
                                        <div className={`absolute -left-[2.1rem] top-1 w-6 h-6 rounded-full border-4 border-white shadow-md z-10 flex items-center justify-center transition-all ${milestone.status === 'completed' ? 'bg-emerald-500' : milestone.status === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200'}`}>
                                            {milestone.status === 'completed' ? <CheckCircle className="w-2.5 h-2.5 text-white" /> : <Clock className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        
                                        <div className={`p-4 rounded-2xl border transition-all ${milestone.status === 'active' ? 'bg-indigo-50/30 border-indigo-100 shadow-md' : 'bg-white border-slate-100'}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <p className={`text-[9px] font-black uppercase tracking-tighter ${milestone.status === 'completed' ? 'text-emerald-500' : milestone.status === 'active' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                        {milestone.serviceType.replace(/_/g, ' ')} Phase
                                                    </p>
                                                    <p className={`text-sm font-black tracking-tight ${milestone.status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>{milestone.title}</p>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {milestone.status === 'completed' ? 'Finished ' : milestone.status === 'active' ? 'Since ' : 'Pending '}
                                                {new Date(milestone.startDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Onshore Transition Point */}
                                {conversation.onshoreStatus === 'offshore' && (
                                    <div className="relative opacity-30">
                                        <div className="absolute -left-[2.1rem] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 bg-slate-100 flex items-center justify-center">
                                            <PlaneLanding className="w-2.5 h-2.5 text-slate-400" />
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Onshore Arrival</p>
                                            <p className="text-sm font-bold text-slate-400 mt-1 italic">Future Progression</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Hub */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => onSpawnService('rpl', 'Trade Qualification')}
                                className="p-4 bg-white border border-slate-200 text-slate-700 rounded-[24px] flex flex-col items-center gap-2 hover:border-indigo-200 transition-all shadow-sm group active:scale-95"
                            >
                                <Zap className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Spawn RPL</span>
                            </button>
                            <button 
                                onClick={() => onSpawnService('onshore_transfer', 'University Transfer')}
                                className="p-4 bg-white border border-slate-200 text-slate-700 rounded-[24px] flex flex-col items-center gap-2 hover:border-blue-200 transition-all shadow-sm group active:scale-95"
                            >
                                <Repeat className="w-5 h-5 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Switch Course</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-slate-900 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Qualification</p>
                            <h3 className="text-xl font-black mb-6 tracking-tight leading-tight">{conversation.client.qualificationTarget}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-2xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Visa Expiry</p><p className="text-xs font-black">{conversation.client.visaExpiry || 'N/A'}</p></div>
                                <div className="bg-white/5 p-3 rounded-2xl"><p className="text-[9px] font-bold text-slate-400 uppercase">Location</p><p className="text-xs font-black truncate">{conversation.client.location}</p></div>
                            </div>
                        </div>

                        {/* Education Timeline */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-1">
                                <GraduationCap className="w-4 h-4 text-indigo-500" /> Academic Background
                            </h4>
                            <div className="space-y-3 relative pl-4">
                                <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                                {sortedEducation.map((edu, idx) => (
                                    <div key={idx} className="relative pl-4">
                                        <div className="absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-indigo-500"></div>
                                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                            <p className="text-[9px] font-black text-indigo-600 uppercase mb-0.5">{edu.level}</p>
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{edu.institution}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{edu.startYear} - {edu.endYear}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'docs' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-end mb-4">
                                <div><h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">File Integrity</h4><p className="text-3xl font-black text-indigo-600">{progressPercent}%</p></div>
                                <div className="text-right text-[10px] font-bold text-slate-400 uppercase">{verifiedCount}/{conversation.documents.length} Verified</div>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div style={{width: `${progressPercent}%`}} className="h-full bg-indigo-500 transition-all duration-1000"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {conversation.documents.map(doc => (
                                <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-50 flex items-center justify-between group hover:border-indigo-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}><FileCheck className="w-4 h-4" /></div>
                                        <div><p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p></div>
                                    </div>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{doc.status.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientIntelligence;
