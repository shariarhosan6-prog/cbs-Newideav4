
import React, { useState, useEffect } from 'react';
import { MOCK_COMMISSIONS, MOCK_COUNSELORS } from '../constants';
import { CommissionRecord, TransactionType } from '../types';
import { 
    DollarSign, ArrowUpRight, ArrowDownLeft, Users, Building2, TrendingUp, 
    Search, Filter, Calendar, Briefcase, Download, ChevronRight, 
    CheckCircle2, Clock, AlertCircle, PieChart, Wallet, ChevronDown,
    Zap, Loader2, Bell, Mail, FileCheck, X, FileSpreadsheet
} from 'lucide-react';

const EXTRA_MOCKS: CommissionRecord[] = [
    { id: 'tx_auto_1', clientId: 'u5', clientName: 'John Doe', description: 'Sub-Agent Fee', amount: 450, type: 'outgoing_sub_agent', status: 'pending', dueDate: new Date('2024-05-20'), relatedEntityName: 'VisaFast Agency' },
    { id: 'tx_auto_2', clientId: 'u6', clientName: 'Jane Smith', description: 'Counselor Bonus', amount: 200, type: 'outgoing_staff', status: 'pending', dueDate: new Date('2024-05-25'), relatedEntityName: 'Tom Hardy' },
];

const Finance: React.FC = () => {
    const [transactions, setTransactions] = useState<CommissionRecord[]>([...MOCK_COMMISSIONS, ...EXTRA_MOCKS]);
    const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'payouts' | 'staff'>('overview');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
    const [dateFilter, setDateFilter] = useState<'this_month' | 'last_month' | 'quarter' | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const [isAutomationOpen, setIsAutomationOpen] = useState(false);
    const [automationStatus, setAutomationStatus] = useState<'idle' | 'scanning' | 'processing' | 'complete'>('idle');
    const [automationLogs, setAutomationLogs] = useState<{msg: string, type: 'info' | 'success' | 'action', time: string}[]>([]);
    const [processingIds, setProcessingIds] = useState<string[]>([]);
    
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

    const handleExportCSV = () => {
        setIsExporting(true);
        setTimeout(() => {
            const csvContent = transactions.map(t => `${t.clientName},${t.description},${t.amount},${t.status},${t.relatedEntityName}`).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Commission_Report_${new Date().toLocaleDateString()}.csv`;
            a.click();
            setIsExporting(false);
        }, 2000);
    };

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

            let processedCount = 0;
            eligible.forEach((tx, idx) => {
                setTimeout(() => {
                    setProcessingIds(prev => [...prev, tx.id]);
                    addLog(`Processing Payout #${tx.id} for ${tx.relatedEntityName} ($${tx.amount})`, 'info');
                    
                    setTimeout(() => {
                        addLog(`→ Invoice generated & sent to Finance Team`, 'info');
                    }, 500);

                    setTimeout(() => {
                        addLog(`→ Notification sent to ${tx.relatedEntityName} (via Email/SMS)`, 'info');
                    }, 1000);

                    setTimeout(() => {
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

    const getFilteredTransactions = () => {
        return transactions.filter(tx => {
            if (activeTab === 'earnings' && tx.type !== 'incoming') return false;
            if (activeTab === 'payouts' && tx.type !== 'outgoing_sub_agent') return false;
            if (activeTab === 'staff' && tx.type !== 'outgoing_staff') return false;
            if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
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
                            <th className="px-6 py-4">Entity</th>
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
                            </div>
                            <button onClick={() => setIsAutomationOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-4 h-48 overflow-y-auto custom-scrollbar font-mono text-xs space-y-2">
                             {automationLogs.map((log, i) => (
                                 <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 text-slate-300">
                                     <span className="text-slate-500 shrink-0">[{log.time}]</span>
                                     <span>{log.msg}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            )}


            {/* Header */}
            <div className="px-8 py-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Commission Hub</h1>
                    <p className="text-slate-500 text-sm">Track your earnings and manage partner payouts.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={runPayoutAutomation} disabled={isAutomationOpen} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm disabled:opacity-50">
                        <Zap className="w-4 h-4" /> Run Auto-Payouts
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        disabled={isExporting}
                        className="flex items-center gap-2 bg-messenger-blue text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-colors"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                        {activeTab === 'earnings' ? 'Earnings Report' : 'Commission CSV'}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                    {['overview', 'earnings', 'payouts', 'staff'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`py-4 text-sm font-bold capitalize border-b-2 transition-all whitespace-nowrap
                                ${activeTab === tab ? 'text-messenger-blue border-messenger-blue' : 'text-slate-500 border-transparent hover:text-slate-700'}
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'overview' ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-sm font-bold text-slate-500 mb-1">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-slate-900">${totalIncoming.toLocaleString()}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-sm font-bold text-slate-500 mb-1">Total Payouts</p>
                                <h3 className="text-3xl font-bold text-slate-900">${totalOutgoing.toLocaleString()}</h3>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white">
                                <p className="text-sm font-bold text-slate-300 mb-1">Net Profit</p>
                                <h3 className="text-3xl font-bold">${netProfit.toLocaleString()}</h3>
                            </div>
                        </div>
                        {renderTransactionTable()}
                    </div>
                ) : (
                    renderTransactionTable()
                )}
            </div>
        </div>
    );
};

export default Finance;
