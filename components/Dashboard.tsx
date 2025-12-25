
import React, { useState } from 'react';
import { 
    TrendingUp, Users, AlertCircle, CheckCircle2, DollarSign, Briefcase, ArrowRight, 
    Activity, Building2, Wallet, ArrowUpRight, ArrowDownLeft, Calendar, BarChart3, 
    MoreHorizontal, Globe, PlaneLanding, Repeat, ShieldCheck, Zap, Clock, 
    FileWarning, MessageCircle, ArrowRightCircle, Layers, Crown, UserCheck, Flame, 
    Target, BadgePercent, GraduationCap, Handshake, Plus, FileSpreadsheet, Loader2
} from 'lucide-react';

interface Props {
  onOpenNewLead: () => void;
}

const Dashboard: React.FC<Props> = ({ onOpenNewLead }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAnalytics = () => {
    setIsExporting(true);
    setTimeout(() => {
        const analyticsData = "STITCH AGENCY OPS ANALYTICS - " + new Date().toLocaleDateString();
        const blob = new Blob([analyticsData], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Executive_Audit_${Date.now()}.xls`;
        a.click();
        setIsExporting(false);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-[#F0F4F2] h-full overflow-y-auto custom-scrollbar">
      {/* EXECUTIVE COMMAND HEADER - MIDNIGHT PINE */}
      <div className="bg-[#001a14] border-b border-emerald-900/10 px-8 py-10 sticky top-0 z-30 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
                <div className="p-4 bg-emerald-600 rounded-[28px] shadow-2xl shadow-black/80 text-white border border-white/10 animate-pulse-glow">
                    <Crown className="w-8 h-8" />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border border-emerald-500/20">
                            Super Console
                        </span>
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-emerald-500" /> Active Sync
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Executive Intelligence</h1>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <button 
                    onClick={handleExportAnalytics}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-6 py-3.5 bg-white/5 text-emerald-100/40 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all"
                 >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                    Audit Report
                 </button>

                 <div className="hidden xl:flex items-center gap-10 mr-4 px-8 py-3 bg-white/5 rounded-[24px] border border-white/5">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-emerald-500/30 uppercase tracking-widest mb-0.5">Files</p>
                        <p className="text-xl font-black text-white">124</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-emerald-500/30 uppercase tracking-widest mb-0.5">Yield</p>
                        <p className="text-xl font-black text-emerald-400">82%</p>
                    </div>
                 </div>
                 <button 
                    onClick={onOpenNewLead}
                    className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-black/40 hover:bg-emerald-500 transition-all border border-white/10"
                 >
                    <Plus className="w-5 h-5" /> New Intake
                 </button>
            </div>
        </div>
      </div>

      <div className="p-10 space-y-10">
        
        {/* REVENUE HUD */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: 'MTD Billing', value: '$84,250', trend: '+12.4%', icon: Wallet, color: 'emerald' },
                { label: 'Agency Margin', value: '$24,110', trend: 'Optimum', icon: BadgePercent, color: 'blue' },
                { label: 'Total Pipeline', value: '$425,800', trend: 'Active', icon: Users, color: 'indigo' },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border border-pine-900/5 shadow-sm relative overflow-hidden group hover:shadow-premium transition-all">
                    <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-[#F0FDF4] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl shadow-sm border border-emerald-100"><stat.icon className="w-6 h-6" /></div>
                            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">{stat.trend}</span>
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                    </div>
                </div>
            ))}

            <div className="bg-[#001a14] p-8 rounded-[40px] shadow-2xl relative overflow-hidden text-white group">
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/5"><Zap className="w-6 h-6 text-emerald-400" /></div>
                            <span className="text-[10px] font-black text-emerald-200/20 uppercase tracking-widest">Growth Index</span>
                        </div>
                        <h3 className="text-3xl font-black leading-none tracking-tight">$1.2M <span className="text-emerald-500">EOY</span></h3>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-500/20 mt-8 uppercase tracking-widest">Global Asset Forecast</p>
                </div>
            </div>
        </section>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <div className="bg-white rounded-[48px] border border-pine-900/5 shadow-sm p-10 flex flex-col">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Counselor Workforce</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Intake Throughput</p>
                    </div>
                    <button className="text-[10px] font-black text-emerald-900 uppercase tracking-widest bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100">Roster Hub</button>
                </div>

                <div className="space-y-10 flex-1">
                    {[
                        { name: 'Jessica Wu', role: 'Senior', load: 18, target: 20, revenue: '$14,200', color: 'bg-emerald-600' },
                        { name: 'Tom Hardy', role: 'Junior', load: 12, target: 15, revenue: '$8,500', color: 'bg-[#001a14]' },
                        { name: 'Sarah Ahmed', role: 'Mid', load: 14, target: 18, revenue: '$10,100', color: 'bg-emerald-500' },
                    ].map((agent, i) => (
                        <div key={i} className="group cursor-pointer hover:bg-emerald-50/20 p-4 rounded-[32px] transition-all border border-transparent hover:border-emerald-100">
                            <div className="flex justify-between items-end mb-4">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-[18px] bg-[#001a14] flex items-center justify-center font-black text-sm text-emerald-400 border border-white/5 uppercase shadow-xl">{agent.name.charAt(0)}</div>
                                    <div>
                                        <p className="text-lg font-black text-slate-900 leading-none">{agent.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-wider">{agent.role} Liaison</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-slate-900">{agent.revenue}</span>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Gross Yield</p>
                                </div>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                                <div className={`h-full ${agent.color} rounded-full transition-all duration-1000`} style={{width: `${(agent.load/agent.target)*100}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CHANNEL FEED */}
            <div className="bg-[#001a14] rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Activity className="w-48 h-48 text-emerald-500" /></div>
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-12 text-emerald-200/10 flex items-center gap-4">
                    <Repeat className="w-6 h-6 animate-spin text-emerald-500/40" style={{animationDuration: '8s'}} /> Intelligence Feed
                </h3>
                
                <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar-white pr-6">
                    {[
                        { agent: 'Jessica Wu', action: 'Verified Financial Audit: Sarah J.', time: '1m', type: 'success' },
                        { agent: 'System (AI)', action: 'Risk Alert: Document Discrepancy detected', time: '12m', type: 'alert' },
                        { agent: 'Admissions', action: 'Full Offer Issued: Monash University', time: '45m', type: 'offer' },
                        { agent: 'Finance', action: 'Commission Payout Cleared ($1,200)', time: '2h', type: 'finance' }
                    ].map((log, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                            <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'alert' ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium"><span className="font-black text-emerald-400">@{log.agent.replace(/\s/g, '')}</span> {log.action}</p>
                            </div>
                            <span className="text-[11px] font-black text-white/10 uppercase tracking-widest">{log.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
