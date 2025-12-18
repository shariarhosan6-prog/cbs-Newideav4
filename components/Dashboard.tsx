
import React from 'react';
import { 
    TrendingUp, Users, AlertCircle, CheckCircle2, DollarSign, Briefcase, ArrowRight, 
    Activity, Building2, Wallet, ArrowUpRight, ArrowDownLeft, Calendar, BarChart3, 
    MoreHorizontal, Globe, PlaneLanding, Repeat, ShieldCheck
} from 'lucide-react';

interface Props {
  onOpenNewLead: () => void;
}

const Dashboard: React.FC<Props> = ({ onOpenNewLead }) => {
  return (
    <div className="flex-1 bg-slate-50 h-full overflow-y-auto">
      {/* Super Admin Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wide">
                        Lifecycle Operations Hub
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Onshore/Offshore Sync: Online
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
            </div>
            <div className="flex items-center gap-3">
                 <button 
                    onClick={onOpenNewLead}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                 >
                    <Users className="w-4 h-4" /> New Lead
                 </button>
            </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* 1. Global Lifecycle Pulse */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bangladesh B2B Desk */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Globe className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-white/20 rounded-lg"><Globe className="w-4 h-4 text-indigo-200" /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Bangladesh B2B</span>
                    </div>
                    <h3 className="text-3xl font-black mb-1">89%</h3>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase">Offshore Share of Leads</p>
                </div>
            </div>

            {/* Onshore Service Value */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg">High Value</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">$45,200</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Onshore Revenue Potential</p>
            </div>

            {/* Transition Rate */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <Repeat className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">74%</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Retention (Onshore)</p>
                <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[74%]"></div>
                </div>
            </div>

             {/* Total Files */}
             <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-900 rounded-2xl text-white group-hover:bg-slate-800 transition-colors">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">112 Active</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Managed Journey</p>
            </div>
        </div>

        {/* 2. Lifecycle Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Lead Distribution Matrix</h3>
                        <p className="text-xs text-slate-500 font-medium">Offshore (Bangladesh) Lead Entry vs Onshore Service Activation</p>
                    </div>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-8 px-2">
                    {[
                        { m: 'Jan', offshore: 80, onshore: 20 },
                        { m: 'Feb', offshore: 85, onshore: 25 },
                        { m: 'Mar', offshore: 70, onshore: 35 },
                        { m: 'Apr', offshore: 90, onshore: 45 },
                        { m: 'May', offshore: 65, onshore: 55 },
                        { m: 'Jun', offshore: 95, onshore: 65 },
                    ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 group">
                            <div className="relative w-full flex flex-col justify-end gap-1 h-full">
                                <div style={{ height: `${item.offshore}%` }} className="w-full bg-indigo-600 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                                <div style={{ height: `${item.onshore}%` }} className="w-full bg-blue-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all duration-300"></div>
                            </div>
                            <span className="text-center text-[10px] text-slate-400 font-black mt-3 uppercase tracking-widest">{item.m}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase">Offshore (B2B BD)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase">Onshore Active</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">B2B BD Partners</h3>
                <div className="space-y-4 flex-1">
                    {[
                        { name: "Global Ed Bangladesh", leads: 42, settled: 38 },
                        { name: "Elite Careers Dhaka", leads: 25, settled: 20 },
                        { name: "BD Scholars", leads: 18, settled: 15 },
                        { name: "Sylhet Global Hub", leads: 12, settled: 8 },
                    ].map((p, i) => (
                        <div key={i} className="p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-800">{p.name}</span>
                                <span className="text-[10px] font-black text-emerald-600">${(p.settled * 800).toLocaleString()} Paid</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>{p.leads} Total Leads</span>
                                <span>{Math.round((p.settled/p.leads)*100)}% Settled</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 3. Action Hub */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Operational Heartbeat</h3>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-50">
                <div className="p-8 text-center border-b md:border-b-0 border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ready for RPL</p>
                    <h4 className="text-3xl font-black text-slate-900 mb-4">14 Students</h4>
                    <button className="px-6 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">Review Files</button>
                </div>
                <div className="p-8 text-center border-b md:border-b-0 border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Landed (Last 7 Days)</p>
                    <h4 className="text-3xl font-black text-emerald-600 mb-4">8 Students</h4>
                    <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">Onshore Welcome</button>
                </div>
                <div className="p-8 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Visa Granted Today</p>
                    <h4 className="text-3xl font-black text-blue-600 mb-4">3 Files</h4>
                    <button className="px-6 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">Send Letter</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
