import React, { useState } from 'react';
import { Partner } from '../types';
import { MOCK_PARTNERS } from '../constants';
import { Search, Filter, Plus, Building2, User, Mail, MoreHorizontal, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

const Partners: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'RTO' | 'Sub-Agent'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPartners = MOCK_PARTNERS.filter(p => {
        const matchesTab = activeTab === 'all' || p.type === activeTab;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* Header */}
            <div className="p-8 bg-white border-b border-slate-100">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Partner Network</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage relationships with RTOs, Universities, and Sub-Agents.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                        <Plus className="w-4 h-4" /> Add Partner
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        {['all', 'RTO', 'Sub-Agent'].map((tab) => (
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
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPartners.map(partner => (
                        <div key={partner.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={partner.logo} alt="" className="w-12 h-12 rounded-xl" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{partner.name}</h3>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 
                                            ${partner.type === 'RTO' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {partner.type === 'RTO' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            {partner.type}
                                        </span>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Contact</span>
                                    <span className="font-semibold text-slate-700">{partner.contactPerson}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</span>
                                    <span className="font-medium text-blue-600 truncate max-w-[150px]">{partner.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Commission</span>
                                    <span className="font-bold text-emerald-600">{partner.commissionRate}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${partner.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    <span className="text-xs font-medium text-slate-500">{partner.status === 'active' ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="text-xs font-bold text-slate-700">
                                    {partner.activeStudents} Active Students
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Card (Visual) */}
                    <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-all min-h-[240px]">
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-sm">Register New Partner</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Partners;