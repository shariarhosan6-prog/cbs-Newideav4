
import React, { useState } from 'react';
import { MOCK_COUNSELORS, MOCK_CONVERSATIONS } from '../constants';
import { Counselor } from '../types';
// Added Plus to the imports from lucide-react
import { Users, TrendingUp, Clock, Activity, ChevronRight, Search, BarChart3, Star, ShieldCheck, Mail, Phone, ExternalLink, Flame, Briefcase, Zap, Plus } from 'lucide-react';

const TeamManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'Senior' | 'Junior' | 'Migration'>('all');

    const filteredStaff = MOCK_COUNSELORS.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || s.role.includes(filterRole);
        return matchesSearch && matchesRole;
    });

    return (
        <div className="flex-1 bg-slate-50 h-full overflow-y-auto">
            {/* Enterprise Header */}
            <div className="p-8 bg-white border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 z-20 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-widest">Global Operations</span>
                        <h1 className="text-2xl font-bold text-slate-900">Workforce Intelligence</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Monitoring {MOCK_COUNSELORS.length} agents across 2 departments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Find staff..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none w-48 transition-all"
                        />
                    </div>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Optimization Rules
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-8 max-w-7xl mx-auto">
                
                {/* 1. EXECUTIVE KPIS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft group hover:translate-y-[-4px] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl"><Users className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+2 Joined</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">14</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Agents</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft group hover:translate-y-[-4px] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-2xl"><Flame className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">System Capacity</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">82%</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Utilization</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft group hover:translate-y-[-4px] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl"><Star className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Top Performer</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">4.9</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Avg Rating</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft group hover:translate-y-[-4px] transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp className="w-5 h-5" /></div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">MTD Growth</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">$156k</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Revenue Led</p>
                    </div>
                </div>

                {/* 2. ANALYTICS MID-SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Leaderboard */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-soft p-6 overflow-hidden relative">
                         <div className="flex items-center justify-between mb-8">
                             <div>
                                <h3 className="font-bold text-slate-800">Agent Performance Index</h3>
                                <p className="text-xs text-slate-400">Comparing conversion vs workload.</p>
                             </div>
                             <div className="flex gap-2">
                                 {['all', 'Senior', 'Junior'].map(r => (
                                     <button 
                                        key={r} 
                                        onClick={() => setFilterRole(r as any)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase ${filterRole === r ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                     >
                                         {r}
                                     </button>
                                 ))}
                             </div>
                         </div>
                         
                         <div className="space-y-6">
                            {filteredStaff.map((staff, i) => (
                                <div key={staff.id} className="group relative">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="relative">
                                            <img src={staff.avatar} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
                                            {i === 0 && <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-full shadow-lg"><Star className="w-2.5 h-2.5 fill-current" /></div>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="text-sm font-bold text-slate-800">{staff.name}</h4>
                                                <span className="text-[10px] font-black text-slate-400 tracking-tighter">${staff.totalSales.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden mr-4">
                                                    <div style={{width: `${(staff.activeDeals/20)*100}%`}} className={`h-full rounded-full transition-all duration-1000 ${staff.activeDeals > 12 ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600 shrink-0">{staff.activeDeals} Active Cases</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>

                    {/* Department Heatmap (Visual) */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col">
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
                        <h3 className="font-bold mb-1 relative z-10">Workload Heatmap</h3>
                        <p className="text-xs text-slate-400 mb-6 relative z-10">Real-time load balancing across departments.</p>
                        
                        <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-2 relative z-10">
                            {[...Array(16)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`rounded-lg transition-all transform hover:scale-105 ${i % 3 === 0 ? 'bg-blue-500/80 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : i % 5 === 0 ? 'bg-orange-500/80' : 'bg-white/10'}`}
                                ></div>
                            ))}
                        </div>
                        
                        <div className="mt-6 flex justify-between items-center text-[10px] font-bold relative z-10">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Admissions</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> RPL Expert</span>
                        </div>
                    </div>
                </div>

                {/* 3. STAFF DIRECTORY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((staff) => (
                        <div key={staff.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft group hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-slate-50 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600"><ExternalLink className="w-4 h-4" /></button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img src={staff.avatar} className="w-16 h-16 rounded-[24px] object-cover border-4 border-slate-50 group-hover:rotate-3 transition-transform" />
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${staff.status === 'online' ? 'bg-green-500' : staff.status === 'busy' ? 'bg-orange-500' : 'bg-slate-400'}`}></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg leading-none">{staff.name}</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">{staff.role}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Conversion</span>
                                    <span className="text-sm font-bold text-slate-800">84.2%</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Lead Time</span>
                                    <span className="text-sm font-bold text-slate-800">1.2 Days</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-50">
                                <button className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all">
                                    <Mail className="w-3.5 h-3.5" /> Message Agent
                                </button>
                                <button className="w-full py-2.5 flex items-center justify-center gap-2 bg-white text-slate-400 rounded-xl text-xs font-bold border border-slate-100 hover:border-slate-300 transition-all">
                                    <Activity className="w-3.5 h-3.5" /> Activity Log
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Agent Placeholder */}
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all min-h-[340px]">
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm">Add New Counselor</p>
                            <p className="text-[11px] font-medium opacity-70">Expand your team capacity</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeamManagement;
