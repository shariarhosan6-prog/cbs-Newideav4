
import React, { useState } from 'react';
import { Partner } from '../types';
import { 
  Search, Filter, Plus, Building2, User, Mail, MoreHorizontal, 
  CheckCircle2, XCircle, TrendingUp, X, Edit2, Save, Globe, Phone, Briefcase, ExternalLink,
  PieChart, BarChart3, Target, DollarSign, ArrowUpRight, GraduationCap, Award, ShieldCheck,
  Clock, ChevronRight
} from 'lucide-react';

interface Props {
  partners: Partner[];
  onUpdatePartner: (partner: Partner) => void;
  onAddPartner: (partner: Partner) => void;
  onViewApplications: (partnerId: string) => void;
}

const Partners: React.FC<Props> = ({ partners, onUpdatePartner, onAddPartner, onViewApplications }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'RTO' | 'Sub-Agent' | 'University' | 'insights'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state for editing
    const [editForm, setEditForm] = useState<Partner | null>(null);

    const filteredPartners = partners.filter(p => {
        const matchesTab = activeTab === 'all' || p.type === activeTab;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const selectedPartner = partners.find(p => p.id === selectedPartnerId);

    const handleCardClick = (partner: Partner) => {
        setSelectedPartnerId(partner.id);
        setIsEditing(false);
        setEditForm(partner);
    };

    const handleEditToggle = () => {
        if (!isEditing && selectedPartner) {
            setEditForm(selectedPartner);
        }
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        if (editForm) {
            onUpdatePartner(editForm);
            setIsEditing(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editForm) {
            const { name, value } = e.target;
            setEditForm({ ...editForm, [name]: value });
        }
    };

    const renderPerformanceDashboard = () => {
        const unis = partners.filter(p => p.type === 'University');
        const rtos = partners.filter(p => p.type === 'RTO');
        const subAgents = partners.filter(p => p.type === 'Sub-Agent');

        const totalCommissionPaid = partners.reduce((acc, curr) => acc + (curr.commissionPaid || 0), 0);
        const totalCommissionPending = partners.reduce((acc, curr) => acc + (curr.commissionPending || 0), 0);
        const totalNetworkRevenue = totalCommissionPaid + totalCommissionPending;

        const maxStudents = Math.max(...partners.map(p => p.activeStudents));

        return (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
                {/* Top Row: Executive Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-900 p-6 rounded-[32px] text-white relative overflow-hidden group border border-white/5">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Net Revenue</p>
                        <h3 className="text-3xl font-black tracking-tighter">${(totalNetworkRevenue / 0.15).toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Network Yield
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Commission Settled</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">${totalCommissionPaid.toLocaleString()}</h3>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(totalCommissionPaid / totalNetworkRevenue) * 100}%` }}></div>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 mt-2">{Math.round((totalCommissionPaid / totalNetworkRevenue) * 100)}% of Network Liability Paid</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Liabilities</p>
                        <h3 className="text-3xl font-black text-orange-600 tracking-tighter">${totalCommissionPending.toLocaleString()}</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-400" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Accrued & Not Yet Cleared</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visa Grant Success</p>
                        <h3 className="text-3xl font-black text-blue-600 tracking-tighter">
                            {Math.round(partners.reduce((acc, curr) => acc + (curr.successRate || 0), 0) / partners.length)}%
                        </h3>
                        <div className="mt-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-400" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Ecosystem Success Index</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* University Student Distribution */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">University Distribution</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Intake volume by provider</p>
                            </div>
                            <PieChart className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="space-y-6">
                            {unis.map((uni, i) => (
                                <div key={uni.id} className="space-y-2 group cursor-pointer">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                            <span className="text-xs font-black text-slate-700 group-hover:text-blue-600 transition-colors">{uni.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{uni.activeStudents} Files</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${i === 0 ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]' : 'bg-slate-300'}`} 
                                            style={{ width: `${(uni.activeStudents / maxStudents) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {unis.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">No University Data Available</p>}
                        </div>
                    </div>

                    {/* Sub-Agent Performance Yield */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sub-Agent Yield Matrix</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Lead Volume vs. Success Rate</p>
                            </div>
                            <BarChart3 className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {subAgents.map(agent => (
                                <div key={agent.id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-lg transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-slate-400 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        {agent.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black text-slate-800">{agent.name}</span>
                                            <span className={`text-[9px] font-black uppercase ${agent.successRate && agent.successRate > 80 ? 'text-emerald-600' : 'text-orange-500'}`}>
                                                {agent.successRate}% Success
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${(agent.activeStudents / maxStudents) * 100}%` }}></div>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{agent.activeStudents} active</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: RTO Metrics & Financial Integrity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* RTO Completion Rate Matrix */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">RTO Success Rate Index</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Documentation compliance & completion speed</p>
                            </div>
                            <Award className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="p-8 space-y-4">
                            {rtos.map(rto => (
                                <div key={rto.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-white shadow-sm text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{rto.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg Review: 12 Days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">{rto.successRate}% Success</p>
                                            <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${rto.successRate}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="w-px h-8 bg-slate-200"></div>
                                        <button className="p-2 text-slate-400 hover:text-slate-900"><ExternalLink className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                            {rtos.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px]">No Registered RTOs</p>}
                        </div>
                    </div>

                    {/* Financial Ledger Health */}
                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><DollarSign className="w-32 h-32" /></div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-10 text-slate-500 flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-emerald-500" /> Commission Integrity
                        </h4>
                        
                        <div className="space-y-8 relative z-10">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Paid Commissions</span>
                                    <span className="text-emerald-400">${totalCommissionPaid.toLocaleString()}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" style={{ width: `${(totalCommissionPaid / totalNetworkRevenue) * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Pending Liabilities</span>
                                    <span className="text-blue-400">${totalCommissionPending.toLocaleString()}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]" style={{ width: `${(totalCommissionPending / totalNetworkRevenue) * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="p-6 rounded-[28px] bg-white/5 border border-white/5 flex flex-col items-center gap-3 group-hover:bg-white/10 transition-all">
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Overall Network Health</p>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm font-black tracking-widest">OPERATIONAL: OPTIMUM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
            {/* Header */}
            <div className="p-8 bg-white border-b border-slate-100 shrink-0">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Partner Network</h1>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Oversee relationships across RTOs, Universities, and Global Sub-Agents.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
                        <Plus className="w-4 h-4" /> Add New Partner
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        {[
                            { id: 'all', label: 'Directory' },
                            { id: 'University', label: 'Universities' },
                            { id: 'RTO', label: 'RTOs' },
                            { id: 'Sub-Agent', label: 'Sub-Agents' },
                            { id: 'insights', label: 'Performance Hub' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab !== 'insights' && (
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search network assets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 pr-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-500/5 w-72 transition-all"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'insights' ? renderPerformanceDashboard() : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredPartners.map(partner => (
                            <div 
                                key={partner.id} 
                                onClick={() => handleCardClick(partner)}
                                className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 group cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:bg-blue-50 transition-colors"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <img src={partner.logo} alt="" className="w-14 h-14 rounded-[20px] object-cover border-4 border-slate-50 shadow-sm group-hover:scale-105 transition-transform" />
                                            <div>
                                                <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-sm">{partner.name}</h3>
                                                <span className={`inline-flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-full mt-1 uppercase tracking-[0.2em]
                                                    ${partner.type === 'RTO' ? 'bg-indigo-50 text-indigo-700' : partner.type === 'University' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {partner.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2"><User className="w-3.5 h-3.5" /> Liaison</span>
                                            <span className="font-black text-slate-700 text-xs">{partner.contactPerson}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Files</span>
                                            <span className="font-black text-slate-700 text-xs">{partner.activeStudents} Students</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Success</span>
                                            <span className="font-black text-emerald-600 text-xs">{partner.successRate}% Index</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${partner.status === 'active' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`}></div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{partner.status}</span>
                                        </div>
                                        <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                            Audit Report
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Partner Detail Panel */}
            {selectedPartner && (
                <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPartnerId(null)}></div>
                    <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <img src={selectedPartner.logo} alt="" className="w-16 h-16 rounded-[24px] object-cover border-4 border-slate-50 shadow-lg" />
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{isEditing ? 'Modify Identity' : selectedPartner.name}</h2>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{selectedPartner.type} Asset</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">
                                        <Save className="w-4 h-4" /> Save
                                    </button>
                                ) : (
                                    <button onClick={handleEditToggle} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                )}
                                <button onClick={() => setSelectedPartnerId(null)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                             {/* Stats Grid */}
                             <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-6 rounded-[32px] text-center border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Students</p>
                                    <p className="text-2xl font-black text-slate-900">{selectedPartner.activeStudents}</p>
                                </div>
                                <div className="bg-emerald-50 p-6 rounded-[32px] text-center border border-emerald-100">
                                    <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Success</p>
                                    <p className="text-2xl font-black text-emerald-700">{selectedPartner.successRate}%</p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-[32px] text-center border border-blue-100">
                                    <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Yield</p>
                                    <p className="text-2xl font-black text-blue-700">{selectedPartner.commissionRate}</p>
                                </div>
                             </div>

                             {/* Financial Health */}
                             <section>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Financial Overview</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-[28px] border border-slate-100 bg-slate-50/50">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Settled Commissions</p>
                                        <p className="text-lg font-black text-emerald-600">${selectedPartner.commissionPaid?.toLocaleString()}</p>
                                    </div>
                                    <div className="p-5 rounded-[28px] border border-slate-100 bg-slate-50/50">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Clearance</p>
                                        <p className="text-lg font-black text-orange-600">${selectedPartner.commissionPending?.toLocaleString()}</p>
                                    </div>
                                </div>
                             </section>

                             {/* Liaison Details */}
                             <section>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Liaison Profile</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 rounded-[28px] bg-white border border-slate-100 shadow-sm">
                                        <User className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Primary Contact</p>
                                            <p className="text-sm font-black text-slate-900">{selectedPartner.contactPerson}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 rounded-[28px] bg-white border border-slate-100 shadow-sm">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Secure Email</p>
                                            <p className="text-sm font-black text-blue-600">{selectedPartner.email}</p>
                                        </div>
                                    </div>
                                </div>
                             </section>

                             <button className="w-full py-5 rounded-[28px] bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                                <ExternalLink className="w-5 h-5" /> View Linked Enrollments
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Partners;
