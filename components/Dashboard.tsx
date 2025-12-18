import React from 'react';
import { 
    TrendingUp, Users, AlertCircle, CheckCircle2, DollarSign, Briefcase, ArrowRight, 
    Activity, Building2, Wallet, ArrowUpRight, ArrowDownLeft, Calendar, BarChart3, MoreHorizontal 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-50 h-full overflow-y-auto">
      {/* Super Admin Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wide">
                        Super Admin View
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Operational
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
            </div>
            <div className="flex items-center gap-3">
                 <div className="text-right mr-2 hidden sm:block">
                    <p className="text-xs font-bold text-slate-700">June 2024</p>
                    <p className="text-[10px] text-slate-400">Financial Period</p>
                 </div>
                 <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                    <Calendar className="w-4 h-4" />
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
                    <Activity className="w-4 h-4" /> Generate Report
                 </button>
            </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* 1. High-Level Financial Pulse */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Net Profit Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 opacity-90">
                        <div className="p-1.5 bg-white/20 rounded-lg"><DollarSign className="w-4 h-4" /></div>
                        <span className="text-xs font-bold tracking-wide">Net Profit (MTD)</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">$48,250</h3>
                    <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                         <span className="bg-white/20 px-1.5 py-0.5 rounded text-white">+18.2%</span>
                         <span>vs last month</span>
                    </div>
                </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Gross</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">$124,500</h3>
                <p className="text-xs text-slate-500 font-medium">Total Revenue Generated</p>
                <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%]"></div>
                </div>
            </div>

            {/* Pending Payouts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full animate-pulse">Action Req</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">$12,800</h3>
                <p className="text-xs text-slate-500 font-medium">Pending Sub-Agent Payouts</p>
                <div className="mt-4 flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <img key={i} src={`https://ui-avatars.com/api/?name=Agent+${i}&background=random`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">+3</div>
                </div>
            </div>

             {/* Active Files */}
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">+5 New</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">64 Active</h3>
                <p className="text-xs text-slate-500 font-medium">Students in Pipeline</p>
                <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] font-bold text-slate-400">
                    <div className="text-center bg-slate-50 rounded py-1">20 Lead</div>
                    <div className="text-center bg-blue-50 text-blue-600 rounded py-1">30 Proc</div>
                    <div className="text-center bg-green-50 text-green-600 rounded py-1">14 Done</div>
                </div>
            </div>
        </div>

        {/* 2. Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Analytics Chart (Mock) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Financial Performance</h3>
                        <p className="text-xs text-slate-500 font-medium">Revenue vs Commission Payouts (Last 6 Months)</p>
                    </div>
                    <div className="flex gap-2">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Revenue
                         </div>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span> Payouts
                         </div>
                    </div>
                </div>
                
                {/* CSS Bar Chart */}
                <div className="h-64 flex items-end justify-between gap-4 sm:gap-8 px-2">
                    {[
                        { m: 'Jan', rev: 40, pay: 15 },
                        { m: 'Feb', rev: 55, pay: 20 },
                        { m: 'Mar', rev: 45, pay: 18 },
                        { m: 'Apr', rev: 80, pay: 35 },
                        { m: 'May', rev: 65, pay: 25 },
                        { m: 'Jun', rev: 95, pay: 40 },
                    ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 group cursor-pointer">
                            <div className="relative w-full flex gap-1 items-end h-full">
                                {/* Revenue Bar */}
                                <div 
                                    style={{ height: `${item.rev}%` }} 
                                    className="flex-1 bg-indigo-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 relative group/bar"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                        ${item.rev}k
                                    </div>
                                </div>
                                {/* Payout Bar */}
                                <div 
                                    style={{ height: `${item.pay}%` }} 
                                    className="flex-1 bg-orange-400 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 relative group/bar"
                                >
                                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                        ${item.pay}k
                                    </div>
                                </div>
                            </div>
                            <span className="text-center text-xs text-slate-400 font-bold mt-2">{item.m}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Partner Performance */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-slate-900">Top Partners</h3>
                     <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                
                <div className="flex-1 space-y-4">
                    {[
                        { name: "Global Ed Consultancy", type: "Sub-Agent", sales: 12, trend: 'up', val: '$24k' },
                        { name: "StudyPath RTO", type: "Provider", sales: 28, trend: 'up', val: '$56k' },
                        { name: "VisaFast Agency", type: "Sub-Agent", sales: 5, trend: 'down', val: '$8k' },
                        { name: "Jessica Wu (Staff)", type: "Internal", sales: 15, trend: 'up', val: '$32k' },
                    ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                             <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${p.type === 'Internal' ? 'bg-purple-100 text-purple-600' : p.type === 'Provider' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
                                     {p.name.charAt(0)}
                                 </div>
                                 <div>
                                     <p className="text-sm font-bold text-slate-800 leading-none">{p.name}</p>
                                     <p className="text-[10px] text-slate-400 font-medium mt-1">{p.type} • {p.sales} Sales</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-sm font-bold text-slate-900">{p.val}</p>
                                 {p.trend === 'up' 
                                    ? <p className="text-[10px] text-emerald-500 font-bold flex items-center justify-end gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> 12%</p>
                                    : <p className="text-[10px] text-red-500 font-bold flex items-center justify-end gap-0.5"><ArrowDownLeft className="w-2.5 h-2.5" /> 2%</p>
                                 }
                             </div>
                        </div>
                    ))}
                </div>
                 <button className="w-full mt-4 py-2.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    View All Partners
                </button>
            </div>
        </div>

        {/* 3. Operational Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                    <h3 className="text-lg font-bold text-slate-900">Critical Actions Required</h3>
                </div>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">3 High Priority</span>
            </div>
            <div className="divide-y divide-slate-50">
                {[
                    { title: "Invoice Approval Pending", desc: "Global Ed Consultancy submitted invoice #INV-2024-001 for $3,400", time: "2 hours ago", type: "Finance" },
                    { title: "Compliance Audit", desc: "Missing documentation for 3 students in 'Certified' stage. RTO flagged.", time: "5 hours ago", type: "Compliance" },
                    { title: "Visa Expiry Warning", desc: "Sarah Jenkins (Student ID: 8821) visa expires in 14 days.", time: "1 day ago", type: "Urgent" },
                ].map((alert, i) => (
                    <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className={`mt-1 w-2 h-2 rounded-full ${alert.type === 'Urgent' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                                <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                            </div>
                            <p className="text-xs text-slate-500">{alert.desc}</p>
                        </div>
                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            Review
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;