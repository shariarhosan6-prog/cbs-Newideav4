import React, { useState, useEffect } from 'react';
import { MOCK_COMMISSIONS, MOCK_COUNSELORS } from '../constants';
import { CommissionRecord, TransactionType } from '../types';
import { 
    DollarSign, ArrowUpRight, ArrowDownLeft, Users, Building2, TrendingUp, 
    Search, Filter, Calendar, Briefcase, Download, ChevronRight, 
    CheckCircle2, Clock, AlertCircle, PieChart, Wallet, ChevronDown,
    Zap, Loader2, Bell, Mail, FileCheck, X
} from 'lucide-react';

// Augmented Mock Data for Demo Purposes
const EXTRA_MOCKS: CommissionRecord[] = [
    { id: 'tx_auto_1', clientId: 'u5', clientName: 'John Doe', description: 'Sub-Agent Fee', amount: 450, type: 'outgoing_sub_agent', status: 'pending', dueDate: new Date('2024-05-20'), relatedEntityName: 'VisaFast Agency' },
    { id: 'tx_auto_2', clientId: 'u6', clientName: 'Jane Smith', description: 'Counselor Bonus', amount: 200, type: 'outgoing_staff', status: 'pending', dueDate: new Date('2024-05-25'), relatedEntityName: 'Tom Hardy' },
];

const Finance: React.FC = () => {
    // State
    const [transactions, setTransactions] = useState<CommissionRecord[]>([...MOCK_COMMISSIONS, ...EXTRA_MOCKS]);
    const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'payouts' | 'staff'>('overview');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
    const [dateFilter, setDateFilter] = useState<'this_month' | 'last_month' | 'quarter' | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Automation State
    const [isAutomationOpen, setIsAutomationOpen] = useState(false);
    const [automationStatus, setAutomationStatus] = useState<'idle' | 'scanning' | 'processing' | 'complete'>('idle');
    const [automationLogs, setAutomationLogs] = useState<{msg: string, type: 'info' | 'success' | 'action', time: string}[]>([]);
    const [processingIds, setProcessingIds] = useState<string[]>([]);
    
    // --- Calculations based on current state ---
    const totalIncoming = transactions.filter(c => c.type === 'incoming').reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutgoingSub = transactions.filter(c => c.type === 'outgoing_sub_agent').reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutgoingStaff = transactions.filter(c => c.type === 'outgoing_staff').reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutgoing = totalOutgoingSub + totalOutgoingStaff;
    const netProfit = totalIncoming - totalOutgoing;
    
    const pendingIncoming = transactions.filter(c => c.type === 'incoming' && c.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingOutgoing = transactions.filter(c => c.type !== 'incoming' && c.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

    const totalPaidIncoming = totalIncoming - pendingIncoming;
    const totalPaidOutgoing = totalOutgoing - pendingOutgoing;
    const incomingProgress = totalIncoming > 0 ? (totalPaidIncoming / totalIncoming) * 100 : 0;
    const outgoingProgress = totalOutgoing > 0 ? (totalPaidOutgoing / totalOutgoing) * 100 : 0;

    // --- Automation Logic ---
    const addLog = (msg: string, type: 'info' | 'success' | 'action' = 'info') => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setAutomationLogs(prev => [{msg, type, time}, ...prev]);
    };

    const runPayoutAutomation = () => {
        setIsAutomationOpen(true);
        setAutomationStatus('scanning');
        setAutomationLogs([]);
        addLog("Initiating Smart Payout Protocol v2.1...", 'info');

        setTimeout(() => {
            // Step 1: Scan
            const eligible = transactions.filter(t => 
                t.status === 'pending' && 
                (t.type === 'outgoing_sub_agent' || t.type === 'outgoing_staff')
            );

            if (eligible.length === 0) {
                addLog("Scan complete. No eligible pending payouts found.", 'success');
                setAutomationStatus('complete');
                return;
            }

            addLog(`Scan complete. Found ${eligible.length} eligible transactions for payout.`, 'action');
            setAutomationStatus('processing');

            // Step 2: Process each
            let processedCount = 0;
            eligible.forEach((tx, idx) => {
                setTimeout(() => {
                    setProcessingIds(prev => [...prev, tx.id]);
                    addLog(`Processing Payout #${tx.id} for ${tx.relatedEntityName} ($${tx.amount})`, 'info');
                    
                    // Simulate Workflow Steps
                    setTimeout(() => {
                        addLog(`→ Invoice generated & sent to Finance Team`, 'info');
                    }, 500);

                    setTimeout(() => {
                        addLog(`→ Notification sent to ${tx.relatedEntityName} (via Email/SMS)`, 'info');
                    }, 1000);

                    setTimeout(() => {
                        // Finalize
                        setTransactions(prev => prev.map(item => 
                            item.id === tx.id ? { ...item, status: 'paid' } : item
                        ));
                        setProcessingIds(prev => prev.filter(id => id !== tx.id));
                        addLog(`✓ Payout #${tx.id} Approved & Initiated`, 'success');
                        
                        processedCount++;
                        if (processedCount === eligible.length) {
                            setAutomationStatus('complete');
                            addLog("All payouts processed successfully. Workflow complete.", 'success');
                        }
                    }, 2000);

                }, idx * 2500);
            });

        }, 1500);
    };

    // --- Filtering Logic ---
    const getFilteredTransactions = () => {
        return transactions.filter(tx => {
            // Tab Filter
            if (activeTab === 'earnings' && tx.type !== 'incoming') return false;
            if (activeTab === 'payouts' && tx.type !== 'outgoing_sub_agent') return false;
            if (activeTab === 'staff' && tx.type !== 'outgoing_staff') return false;

            // Status Filter
            if (statusFilter !== 'all' && tx.status !== statusFilter) return false;

            // Search Filter
            if (searchTerm && !tx.clientName.toLowerCase().includes(searchTerm.toLowerCase()) && !tx.relatedEntityName.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            return true; 
        });
    };

    const filteredTransactions = getFilteredTransactions();

    const renderTransactionTable = () => (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Client / Reference</th>
                            <th className="px-6 py-4">
                                {activeTab === 'earnings' ? 'Source (RTO/Super Agent)' : 
                                 activeTab === 'payouts' ? 'Sub-Agent' : 
                                 activeTab === 'staff' ? 'Counselor' : 'Entity'}
                            </th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredTransactions.map(tx => {
                            const isProcessing = processingIds.includes(tx.id);
                            return (
                                <tr key={tx.id} className={`hover:bg-slate-50/80 transition-colors group ${isProcessing ? 'bg-blue-50/50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                                                ${isProcessing ? 'scale-110 ring-2 ring-blue-400' : ''}
                                                ${tx.type === 'incoming' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}
                                            `}>
                                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : tx.clientName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{tx.clientName}</div>
                                                <div className="text-xs text-slate-400">{tx.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {tx.type === 'incoming' && <Building2 className="w-4 h-4 text-slate-400" />}
                                            {tx.type === 'outgoing_sub_agent' && <Users className="w-4 h-4 text-slate-400" />}
                                            {tx.type === 'outgoing_staff' && <Briefcase className="w-4 h-4 text-slate-400" />}
                                            <span className="font-medium text-slate-700">{tx.relatedEntityName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium font-mono text-xs">
                                        {tx.dueDate.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {tx.status === 'paid' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 animate-in zoom-in">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                                            </span>
                                        )}
                                        {tx.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                                <Clock className="w-3.5 h-3.5" /> Pending
                                            </span>
                                        )}
                                        {tx.status === 'overdue' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                                                <AlertCircle className="w-3.5 h-3.5" /> Overdue
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-sm font-bold ${tx.type === 'incoming' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                            {tx.type === 'incoming' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-messenger-blue transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {filteredTransactions.length === 0 && (
                 <div className="p-12 text-center">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                         <Search className="w-8 h-8" />
                     </div>
                     <h3 className="text-slate-900 font-bold mb-1">No transactions found</h3>
                     <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
                 </div>
            )}
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
            
            {/* --- AUTOMATION OVERLAY PANEL --- */}
            {isAutomationOpen && (
                <div className="absolute top-0 inset-x-0 z-30 bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-10 duration-300">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <div className={`p-2 rounded-lg ${automationStatus === 'processing' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                                        {automationStatus === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                    </div>
                                    Smart Payout Automation
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Processing scheduled payouts based on approval rules.</p>
                            </div>
                            <button 
                                onClick={() => setIsAutomationOpen(false)} 
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-4 h-48 overflow-y-auto custom-scrollbar font-mono text-xs space-y-2">
                             {automationLogs.length === 0 && <span className="text-slate-500">Initializing logs...</span>}
                             {automationLogs.map((log, i) => (
                                 <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                                     <span className="text-slate-500 shrink-0">[{log.time}]</span>
                                     <span className={`
                                        ${log.type === 'success' ? 'text-emerald-400 font-bold' : 
                                          log.type === 'action' ? 'text-blue-400 font-bold' : 'text-slate-300'}
                                     `}>
                                         {log.type === 'success' && '✓ '}
                                         {log.msg}
                                     </span>
                                 </div>
                             ))}
                             {automationStatus === 'scanning' && (
                                 <div className="flex gap-3 text-slate-500 animate-pulse">
                                     <span>[...]</span>
                                     <span>Scanning database for due dates...</span>
                                 </div>
                             )}
                        </div>

                        {automationStatus === 'complete' && (
                            <div className="mt-4 flex justify-end">
                                <button onClick={() => setIsAutomationOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 text-sm">
                                    Close Console
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* Header */}
            <div className="px-8 py-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Commission Hub</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">Agent View</span>
                        <p className="text-slate-500 text-sm">Track your earnings and manage partner payouts.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={runPayoutAutomation}
                        disabled={isAutomationOpen}
                        className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm disabled:opacity-50"
                    >
                        <Zap className="w-4 h-4" /> Run Auto-Payouts
                    </button>
                    <button className="flex items-center gap-2 bg-messenger-blue text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-colors">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'earnings', label: 'My Earnings', icon: TrendingUp },
                        { id: 'payouts', label: 'Sub-Agent Payouts', icon: Users },
                        { id: 'staff', label: 'Staff Commission', icon: Briefcase },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap
                                ${activeTab === tab.id 
                                    ? 'text-messenger-blue border-messenger-blue' 
                                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-200'}
                            `}
                        >
                            {tab.icon && <tab.icon className="w-4 h-4" />}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                
                {/* Filters Toolbar */}
                {activeTab !== 'overview' && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            {/* Status Filter */}
                            <div className="relative group">
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                    className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-messenger-blue/20 cursor-pointer hover:border-messenger-blue/30 transition-colors"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {/* Date Filter */}
                            <div className="relative group">
                                <select 
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value as any)}
                                    className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-messenger-blue/20 cursor-pointer hover:border-messenger-blue/30 transition-colors"
                                >
                                    <option value="all">All Time</option>
                                    <option value="this_month">This Month</option>
                                    <option value="last_month">Last Month</option>
                                    <option value="quarter">This Quarter</option>
                                </select>
                                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                placeholder="Search client or partner..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-messenger-blue/20 w-64 transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        {/* 1. KEY METRICS ROW */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* REVENUE */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ArrowDownLeft className="w-24 h-24 text-emerald-600" /></div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                                        <span className="text-sm font-bold text-slate-500">Total Revenue</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">${totalIncoming.toLocaleString()}</h3>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${incomingProgress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold mt-2">
                                    <span className="text-emerald-600">{Math.round(incomingProgress)}% Collected</span>
                                    <span className="text-slate-400">${pendingIncoming.toLocaleString()} Pending</span>
                                </div>
                            </div>

                            {/* PAYOUTS */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ArrowUpRight className="w-24 h-24 text-red-600" /></div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Users className="w-5 h-5" /></div>
                                        <span className="text-sm font-bold text-slate-500">Total Payouts</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900">${totalOutgoing.toLocaleString()}</h3>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${outgoingProgress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold mt-2">
                                    <span className="text-red-600">{Math.round(outgoingProgress)}% Paid Out</span>
                                    <span className="text-slate-400">${pendingOutgoing.toLocaleString()} Pending</span>
                                </div>
                            </div>

                             {/* NET PROFIT */}
                            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg shadow-slate-200 flex flex-col justify-between h-40 relative overflow-hidden text-white">
                                 <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-messenger-blue rounded-full opacity-20 blur-2xl"></div>
                                 <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-white/10 text-white rounded-lg"><Wallet className="w-5 h-5" /></div>
                                        <span className="text-sm font-bold text-slate-300">Net Profit</span>
                                    </div>
                                    <h3 className="text-4xl font-bold tracking-tight">${netProfit.toLocaleString()}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 relative z-10">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">+12.5%</span> vs last month
                                </div>
                            </div>
                        </div>

                        {/* 2. VISUAL BREAKDOWN */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Cash Flow Chart */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-slate-800">Cash Flow Overview</h3>
                                    <div className="flex gap-3">
                                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div> In
                                         </div>
                                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                             <div className="w-2 h-2 rounded-full bg-red-500"></div> Out
                                         </div>
                                    </div>
                                </div>
                                <div className="h-48 flex items-end justify-between gap-4 px-2">
                                     {[
                                        { m: 'Jan', in: 65, out: 40 },
                                        { m: 'Feb', in: 45, out: 30 },
                                        { m: 'Mar', in: 80, out: 55 },
                                        { m: 'Apr', in: 70, out: 45 },
                                        { m: 'May', in: 90, out: 60 },
                                        { m: 'Jun', in: totalIncoming/100 * 5, out: totalOutgoing/100 * 5 }, // Fake scale based on current mock
                                     ].map((item, i) => (
                                         <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full group">
                                             <div className="flex gap-1 h-full items-end justify-center w-full">
                                                 <div style={{height: `${Math.min(item.in, 100)}%`}} className="w-3 bg-emerald-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity relative"></div>
                                                 <div style={{height: `${Math.min(item.out, 100)}%`}} className="w-3 bg-red-400 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity relative"></div>
                                             </div>
                                             <span className="text-[10px] text-center font-bold text-slate-400 mt-2">{item.m}</span>
                                         </div>
                                     ))}
                                </div>
                            </div>
                            
                            {/* Status Breakdown */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                                <h3 className="font-bold text-slate-800 mb-6">Pending vs Paid</h3>
                                <div className="flex-1 flex flex-col justify-center gap-6">
                                    {/* Receivables */}
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-600">Receivables (Incoming)</span>
                                            <span className="text-slate-800">${totalIncoming.toLocaleString()}</span>
                                        </div>
                                        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                            <div style={{width: `${incomingProgress}%`}} className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-bold text-white/90">
                                                {Math.round(incomingProgress) > 15 ? 'PAID' : ''}
                                            </div>
                                            <div className="flex-1 bg-amber-400 h-full flex items-center justify-center text-[9px] font-bold text-white/90">
                                                {100 - Math.round(incomingProgress) > 15 ? 'PENDING' : ''}
                                            </div>
                                        </div>
                                    </div>

                                     {/* Payables */}
                                     <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-600">Payables (Outgoing)</span>
                                            <span className="text-slate-800">${totalOutgoing.toLocaleString()}</span>
                                        </div>
                                        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                             <div style={{width: `${outgoingProgress}%`}} className="bg-red-500 h-full flex items-center justify-center text-[9px] font-bold text-white/90">
                                                {Math.round(outgoingProgress) > 15 ? 'PAID' : ''}
                                             </div>
                                             <div className="flex-1 bg-amber-400 h-full flex items-center justify-center text-[9px] font-bold text-white/90">
                                                {100 - Math.round(outgoingProgress) > 15 ? 'PENDING' : ''}
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. RECENT TRANSACTIONS */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Transactions</h3>
                            {renderTransactionTable()}
                        </div>
                    </div>
                )}

                {/* 2. SPECIFIC LIST TABS */}
                {activeTab !== 'overview' && activeTab !== 'staff' && (
                    renderTransactionTable()
                )}

                {/* 3. STAFF TEAM TAB */}
                {activeTab === 'staff' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                         {MOCK_COUNSELORS.map(counselor => (
                             <div key={counselor.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                 <div className="flex items-start gap-4">
                                     <img src={counselor.avatar} alt={counselor.name} className="w-14 h-14 rounded-full ring-4 ring-slate-50 group-hover:scale-105 transition-transform" />
                                     <div className="flex-1">
                                         <div className="flex justify-between items-start">
                                             <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{counselor.name}</h3>
                                                <p className="text-xs text-slate-500 font-medium">Sales Counselor</p>
                                             </div>
                                             <div className="text-right">
                                                 <span className="block text-xl font-bold text-messenger-blue">${counselor.commissionEarned.toLocaleString()}</span>
                                                 <span className="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Earned</span>
                                             </div>
                                         </div>
                                         
                                         <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                             <div>
                                                 <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Total Sales</span>
                                                 <span className="text-sm font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md">${counselor.totalSales.toLocaleString()}</span>
                                             </div>
                                             <div>
                                                 <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Performance</span>
                                                 <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1 w-fit">
                                                     <TrendingUp className="w-3 h-3" /> High
                                                 </span>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                )}
            </div>
        </div>
    );
};

export default Finance;