
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry, ActivityLog } from '../types';
import { 
    User, FileText, ShoppingCart, Eye, Download, AlertCircle, Plus, GraduationCap, AlertTriangle, X, CheckCircle, Clock, 
    History, MapPin, ExternalLink, ShieldCheck, Mail, Zap, FileBarChart, MoreHorizontal, Globe
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onAddDocument: (name: string) => void;
  onAddEducation: (edu: EducationEntry) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, isOpen, onAddDocument, onAddEducation }) => {
    const [activeSection, setActiveSection] = useState<'profile' | 'docs' | 'activity'>('profile');
    
    const verifiedCount = conversation.documents.filter(d => d.status === 'verified').length;
    const progressPercent = Math.round((verifiedCount / conversation.documents.length) * 100) || 0;

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
            {/* 1. Header & Profile Card (Simplified for better focus) */}
            <div className="p-6 bg-white border-b border-slate-100 z-10">
                <div className="flex items-center gap-4 mb-6">
                    <img src={conversation.client.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border ring-4 ring-slate-50" />
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">{conversation.client.name}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                            <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase">{conversation.client.visaStatus}</span>
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
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                
                {activeSection === 'profile' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        {/* Financials Summary */}
                        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl shadow-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Status</p>
                                <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Good Standing</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}</h3>
                            <p className="text-[10px] text-slate-400 font-medium mb-4">Current Outstanding Balance</p>
                            <button className="w-full bg-white/10 hover:bg-white/20 transition-all text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                                <Zap className="w-3.5 h-3.5" /> Issue Payment Link
                            </button>
                        </div>

                        {/* Education History Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4">
                            <h4 className="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-indigo-500" /> Education Snapshot
                            </h4>
                            <div className="space-y-4">
                                {conversation.client.educationHistory.map((edu) => (
                                    <div key={edu.id} className="relative pl-6 border-l-2 border-indigo-100 pb-2 group last:pb-0">
                                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-indigo-500 group-last:bg-emerald-500"></div>
                                        <p className="text-xs font-bold text-slate-800 leading-none">{edu.level}</p>
                                        <p className="text-[10px] text-slate-500 mt-1">{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'docs' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between mb-2">
                             <h4 className="text-xs font-bold text-slate-800">Checklist Progress</h4>
                             <span className="text-xs font-bold text-blue-600">{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div style={{width: `${progressPercent}%`}} className="h-full bg-blue-500 transition-all duration-1000"></div>
                        </div>
                        <div className="grid gap-2">
                            {conversation.documents.map(doc => (
                                <div key={doc.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        {doc.status === 'verified' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                                        <span className="text-xs font-bold text-slate-700">{doc.name}</span>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'activity' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-4 h-4 text-blue-500" /> Audit Trail (Staff Activity)
                        </h4>
                        <div className="space-y-6">
                            {conversation.activities.map((log) => (
                                <div key={log.id} className="flex gap-4 relative">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-500">
                                        {log.staffName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-xs font-bold text-slate-800">{log.staffName}</p>
                                            <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1">{log.action}</p>
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

export default ClientIntelligence;
