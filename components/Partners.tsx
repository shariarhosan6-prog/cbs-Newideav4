
import React, { useState } from 'react';
import { Partner } from '../types';
import { 
  Search, Filter, Plus, Building2, User, Mail, MoreHorizontal, 
  CheckCircle2, XCircle, TrendingUp, X, Edit2, Save, Globe, Phone, Briefcase, ExternalLink
} from 'lucide-react';

interface Props {
  partners: Partner[];
  onUpdatePartner: (partner: Partner) => void;
  onAddPartner: (partner: Partner) => void;
  onViewApplications: (partnerId: string) => void;
}

const Partners: React.FC<Props> = ({ partners, onUpdatePartner, onAddPartner, onViewApplications }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'RTO' | 'Sub-Agent' | 'University'>('all');
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

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
            {/* Header */}
            <div className="p-8 bg-white border-b border-slate-100 shrink-0">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Partner Network</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage relationships with RTOs, Universities, and Sub-Agents.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
                        <Plus className="w-4 h-4" /> Add Partner
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        {['all', 'RTO', 'Sub-Agent', 'University'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {tab === 'all' ? 'All Partners' : tab + 's'}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-slate-600" />
                        <input 
                            type="text" 
                            placeholder="Search partners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredPartners.map(partner => (
                        <div 
                            key={partner.id} 
                            onClick={() => handleCardClick(partner)}
                            className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={partner.logo} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{partner.name}</h3>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full mt-1 uppercase tracking-widest
                                            ${partner.type === 'RTO' ? 'bg-indigo-50 text-indigo-700' : partner.type === 'University' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {partner.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-50 transition-all">
                                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-2"><User className="w-3.5 h-3.5" /> Lead</span>
                                    <span className="font-bold text-slate-700">{partner.contactPerson}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Students</span>
                                    <span className="font-bold text-slate-700">{partner.activeStudents} Active</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Rate</span>
                                    <span className="font-black text-emerald-600">{partner.commissionRate}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${partner.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-300'}`}></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partner.status}</span>
                                </div>
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg">
                                    View Profile
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Card (Visual) */}
                    <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-white transition-all min-h-[240px] group">
                        <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <span className="block font-black uppercase tracking-widest text-[11px]">Register New Partner</span>
                            <span className="text-[10px] font-medium opacity-60">Grow your ecosystem</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Partner Detail Slide-Over Modal */}
            {selectedPartner && (
                <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPartnerId(null)}></div>
                    
                    <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <img src={selectedPartner.logo} alt="" className="w-16 h-16 rounded-[20px] object-cover border-4 border-slate-50" />
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{isEditing ? 'Edit Profile' : selectedPartner.name}</h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedPartner.type} Partner</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                                            <Save className="w-4 h-4" /> Save
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleEditToggle} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button onClick={() => setSelectedPartnerId(null)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                            {isEditing ? (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner Name</label>
                                            <input name="name" value={editForm?.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner Type</label>
                                            <select name="type" value={editForm?.type} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none">
                                                <option value="RTO">RTO</option>
                                                <option value="Sub-Agent">Sub-Agent</option>
                                                <option value="University">University</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Contact Person</label>
                                        <input name="contactPerson" value={editForm?.contactPerson} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admissions/Support Email</label>
                                        <input name="email" value={editForm?.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commission Rate</label>
                                            <input name="commissionRate" value={editForm?.commissionRate} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                                            <select name="status" value={editForm?.status} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none">
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    {/* Stats Overview */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Students</p>
                                            <p className="text-xl font-black text-slate-900">{selectedPartner.activeStudents}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100 text-center">
                                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Comm. Rate</p>
                                            <p className="text-xl font-black text-indigo-700">{selectedPartner.commissionRate}</p>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 text-center">
                                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Partner Tier</p>
                                            <p className="text-xl font-black text-emerald-700">Gold</p>
                                        </div>
                                    </div>

                                    {/* Contact Details Section */}
                                    <section>
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-blue-500" /> Professional Contacts
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Primary Liaison</p>
                                                    <p className="text-sm font-bold text-slate-900">{selectedPartner.contactPerson}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400"><Mail className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Application Portal</p>
                                                    <p className="text-sm font-bold text-blue-600 underline cursor-pointer">{selectedPartner.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400"><Phone className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Direct Line</p>
                                                    <p className="text-sm font-bold text-slate-900">+61 1300 123 456</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* History/Network Section */}
                                    <section>
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-500" /> Operational Insights
                                        </h3>
                                        <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden group">
                                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-6">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. MTD Revenue</p>
                                                        <p className="text-2xl font-black">$12,450.00</p>
                                                    </div>
                                                    <div className="bg-white/10 p-3 rounded-2xl"><TrendingUp className="w-6 h-6 text-emerald-400" /></div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-[11px]">
                                                        <span className="text-slate-400 font-bold">Offer Acceptance Rate</span>
                                                        <span className="font-black">94%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-400 rounded-full" style={{width: '94%'}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    
                                    <button 
                                      onClick={() => {
                                        onViewApplications(selectedPartner.id);
                                        setSelectedPartnerId(null);
                                      }}
                                      className="w-full py-4 rounded-2xl bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" /> View Linked Applications
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer (Action Bar) */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-4">
                             <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                                 Deactivate Partner
                             </button>
                             <div className="h-4 w-px bg-slate-200"></div>
                             <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                                 Download Partnership PDF
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Partners;
