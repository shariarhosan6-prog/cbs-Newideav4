
import React from 'react';
import { 
    TrendingUp, Users, AlertCircle, CheckCircle2, DollarSign, Briefcase, ArrowRight, 
    Activity, Building2, Wallet, ArrowUpRight, ArrowDownLeft, Calendar, BarChart3, 
    MoreHorizontal, Globe, PlaneLanding, Repeat, ShieldCheck, Zap, Clock, 
    FileWarning, MessageCircle, ArrowRightCircle, Layers, Crown, UserCheck, Flame, 
    Target, BadgePercent, GraduationCap, Handshake, Plus
} from 'lucide-react';

interface Props {
  onOpenNewLead: () => void;
}

const Dashboard: React.FC<Props> = ({ onOpenNewLead }) => {
  return (
    <div className="flex-1 bg-slate-50 h-full overflow-y-auto custom-scrollbar">
      {/* 1. EXECUTIVE COMMAND HEADER */}
      <div className="bg-slate-900 border-b border-white/5 px-8 py-8 sticky top-0 z-30 shadow-2xl">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-[20px] shadow-lg shadow-blue-500/20 text-white">
                    <Crown className="w-6 h-6" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-white/10 text-white/60 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-white/5">
                            Agency Principal Console
                        </span>
                        <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Live Operations
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Executive Control Center</h1>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="hidden lg:flex items-center gap-8 mr-6 px-6 py-2 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Intake</p>
                        <p className="text-lg font-black text-white">124 Students</p>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Agency Yield</p>
                        <p className="text-lg font-black text-emerald-400">82.4%</p>
                    </div>
                 </div>
                 <button 
                    onClick={onOpenNewLead}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95"
                 >
                    <Plus className="w-4 h-4" /> Global Intake
                 </button>
            </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        
        {/* 2. AGENCY REVENUE & PIPELINE HUD */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm"><Wallet className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">+12.4%</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Total Billing MTD</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">$84,250.00</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm"><BadgePercent className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">Target: 95%</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Net Margin (Owner)</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">$24,110.00</h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm"><Users className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg">6 Counselors</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Active Pipeline Value</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">$425,800.00</h3>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[32px] shadow-2xl relative overflow-hidden text-white group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 rounded-xl"><Zap className="w-4 h-4 text-blue-400" /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Forecast</span>
                        </div>
                        <h3 className="text-2xl font-black leading-none">$1.2M EOY</h3>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase">Projected Agency Value</p>
                </div>
            </div>
        </section>

        {/* 3. MIDDLE SECTION: TEAM & PARTNER INTELLIGENCE */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* COUNSELOR POWER GRID */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Counselor Performance</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Intake Throughput & Load Balancing</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Manage All 7 Agents</button>
                </div>

                <div className="space-y-6 flex-1">
                    {[
                        { name: 'Jessica Wu', role: 'Senior', load: 18, target: 20, revenue: '$14.2k', color: 'bg-blue-600' },
                        { name: 'Tom Hardy', role: 'Junior', load: 12, target: 15, revenue: '$8.5k', color: 'bg-slate-900' },
                        { name: 'Sarah Ahmed', role: 'Mid', load: 14, target: 18, revenue: '$10.1k', color: 'bg-indigo-500' },
                        { name: 'Michael Chen', role: 'Junior', load: 6, target: 15, revenue: '$3.2k', color: 'bg-slate-400' }
                    ].map((agent, i) => (
                        <div key={i} className="group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 border border-slate-200 uppercase">{agent.name.charAt(0)}</div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 leading-none">{agent.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{agent.role} Counselor</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-slate-900">{agent.revenue}</span>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">MTD Sales</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                                <div className={`h-full ${agent.color} rounded-full transition-all duration-1000`} style={{width: `${(agent.load/agent.target)*100}%`}}></div>
                            </div>
                            <div className="flex justify-between mt-1 px-0.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{agent.load} / {agent.target} Capacity</span>
                                <span className={`text-[9px] font-black uppercase ${agent.load > (agent.target * 0.8) ? 'text-orange-500' : 'text-emerald-500'}`}>{agent.load > (agent.target * 0.8) ? 'Saturation High' : 'Optimum'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* B2B CHANNEL ANALYSIS */}
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">B2B & Sub-Agent Hub</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lead Yield from All 6 Partners</p>
                    </div>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Handshake className="w-5 h-5" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1">
                    {[
                        { name: 'Global Ed BD', leads: 42, grantRate: '92%', trend: 'up', icon: 'GE' },
                        { name: 'Elite Careers', leads: 28, grantRate: '88%', trend: 'up', icon: 'EC' },
                        { name: 'BD Scholars', leads: 15, grantRate: '74%', trend: 'down', icon: 'BS' },
                        { name: 'A1 Migration', leads: 12, grantRate: '100%', trend: 'up', icon: 'A1' }
                    ].map((sub, i) => (
                        <div key={i} className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-black text-[10px] text-slate-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">{sub.icon}</div>
                                <div className={`p-1 rounded-lg ${sub.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {sub.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                </div>
                            </div>
                            <h4 className="font-black text-slate-900 text-sm mb-1">{sub.name}</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-slate-400 font-bold uppercase">Volume</span>
                                    <span className="font-black text-slate-700">{sub.leads} Leads</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-slate-400 font-bold uppercase">Grant Rate</span>
                                    <span className="font-black text-emerald-600">{sub.grantRate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 4. OPERATIONAL HEATMAP & LIVE FEED */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20"><GraduationCap className="w-5 h-5" /></div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Academic Intake Pipeline</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Tracking: RTO Submissions to Visa Grants</p>
                    </div>
                </div>
            </div>
            
            <div className="p-10">
                <div className="h-64 flex items-end justify-between gap-12 px-6">
                    {[
                        { label: 'Enquiry', value: 100, color: 'bg-slate-200' },
                        { label: 'Documentation', value: 82, color: 'bg-blue-400' },
                        { label: 'RTO Lodged', value: 65, color: 'bg-indigo-500' },
                        { label: 'Offer Letter', value: 48, color: 'bg-emerald-500' },
                        { label: 'Payment/CoE', value: 32, color: 'bg-orange-500' },
                        { label: 'Visa Lodged', value: 24, color: 'bg-red-500' },
                        { label: 'Visa Granted', value: 18, color: 'bg-indigo-900' }
                    ].map((step, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center gap-4 group cursor-pointer">
                            <div className="relative w-full flex flex-col justify-end h-full">
                                <div 
                                    style={{ height: `${step.value}%` }} 
                                    className={`w-full ${step.color} rounded-t-[24px] opacity-80 group-hover:opacity-100 group-hover:scale-x-105 transition-all duration-500 shadow-xl relative`}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        {step.value}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center h-8 flex items-center">{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 5. LIVE AGENCY ACTIVITY TICKER */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="w-32 h-32" /></div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-8 text-slate-500 flex items-center gap-2">
                <Repeat className="w-4 h-4 animate-spin-slow" /> Global Activity Stream
            </h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar-white pr-4">
                {[
                    { agent: 'Jessica Wu', action: 'Uploaded GTE Files for Sarah Jenkins', time: '2 mins ago', type: 'success' },
                    { agent: 'System', action: 'Auto-requested missing document from Michael Chen', time: '14 mins ago', type: 'info' },
                    { agent: 'StudyPath RTO', action: 'Issued Conditional Offer Letter for Tanvir Ahmed', time: '1 hour ago', type: 'offer' },
                    { agent: 'Tom Hardy', action: 'Generated Commission Report for Global Ed', time: '3 hours ago', type: 'finance' },
                    { agent: 'Elite Careers', action: 'Submitted 3 New Leads from Dhaka Intake', time: '5 hours ago', type: 'success' }
                ].map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                        <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'offer' ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                        <div className="flex-1">
                            <p className="text-xs font-medium"><span className="font-black text-blue-400">{log.agent}</span> {log.action}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{log.time}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
