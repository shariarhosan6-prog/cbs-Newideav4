
import React, { useState } from 'react';
import { Counselor, TeamTask } from '../types';
import { 
    Users, TrendingUp, Search, ShieldCheck, Mail, Flame, Briefcase, Zap, Plus, 
    LayoutGrid, List, AlertTriangle, Layers, MoreHorizontal, ChevronRight,
    X, Calendar, CheckSquare, Trash2
} from 'lucide-react';

interface Props {
  staff: Counselor[];
  onAddTask: (counselorId: string, task: Omit<TeamTask, 'id' | 'status'>) => void;
  onToggleTaskStatus: (counselorId: string, taskId: string) => void;
  onDeleteTask: (counselorId: string, taskId: string) => void;
}

const TeamManagement: React.FC<Props> = ({ staff, onAddTask, onToggleTaskStatus, onDeleteTask }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState<'all' | 'RPL' | 'Admissions' | 'Legal'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    
    // New Task Form State
    const [newTask, setNewTask] = useState({
        title: '',
        priority: 'medium' as 'high' | 'medium' | 'low',
        dueDate: new Date().toISOString().split('T')[0],
        counselorId: ''
    });

    const filteredStaff = staff.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = filterDepartment === 'all' || s.department === filterDepartment;
        return matchesSearch && matchesDept;
    });

    const totalDeals = filteredStaff.reduce((acc, curr) => acc + curr.activeDeals, 0);
    const avgLoad = filteredStaff.length > 0 ? (totalDeals / filteredStaff.length).toFixed(1) : 0;
    
    const allTasks = filteredStaff.flatMap(s => s.tasks.map(t => ({ ...t, counselorName: s.name, counselorId: s.id })));

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.title || !newTask.counselorId) return;
        
        onAddTask(newTask.counselorId, {
            title: newTask.title,
            priority: newTask.priority,
            dueDate: new Date(newTask.dueDate)
        });
        
        setNewTask({ title: '', priority: 'medium', dueDate: new Date().toISOString().split('T')[0], counselorId: '' });
        setIsTaskModalOpen(false);
    };

    return (
        <div className="flex-1 bg-slate-50 h-full overflow-y-auto relative">
            
            {/* Task Assignment Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl border border-slate-100 p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-indigo-600" /> Assign New Task
                            </h3>
                            <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Task Title</label>
                                <input 
                                    autoFocus
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                    placeholder="e.g., Review compliance for Cert III"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
                                    <select 
                                        value={newTask.priority}
                                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Due Date</label>
                                    <input 
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Assign To</label>
                                <select 
                                    required
                                    value={newTask.counselorId}
                                    onChange={e => setNewTask({...newTask, counselorId: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none"
                                >
                                    <option value="" disabled>Select Staff Member</option>
                                    {staff.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 mt-4 active:scale-95">
                                Confirm Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Super Admin Header */}
            <div className="p-8 bg-white border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center sticky top-0 z-30 gap-6 shadow-sm backdrop-blur-md bg-white/90">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Team Operations</h1>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Super-Admin Console</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                        {['all', 'RPL', 'Admissions'].map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setFilterDepartment(dept as any)}
                                className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${filterDepartment === dept ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><LayoutGrid className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><List className="w-4 h-4" /></button>
                    </div>

                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95">
                        <Plus className="w-4 h-4" /> Onboard Staff
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
                
                {/* GLOBAL PERFORMANCE HUD */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Users className="w-5 h-5" /></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Workforce</span>
                            </div>
                            <h3 className="text-4xl font-black text-slate-900">{filteredStaff.length} Agents</h3>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {filteredStaff.filter(s => s.status === 'online').length} Online
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 tracking-tight">Current Workforce Status</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-2xl"><Flame className="w-5 h-5" /></div>
                            <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-full animate-pulse">Load Alert</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900">{avgLoad} Files</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Avg. Load Per Counselor</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp className="w-5 h-5" /></div>
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>)}
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900">88.4%</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Team Conversion Rate</p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/10 rounded-xl"><Briefcase className="w-5 h-5 text-indigo-300" /></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pipeline Managed</span>
                                </div>
                                <h3 className="text-4xl font-black leading-none">$1.24M</h3>
                            </div>
                            <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                                <Zap className="w-4 h-4" /> Global Performance Audit
                            </button>
                        </div>
                    </div>
                </div>

                {/* MAIN ROSTER SECTION */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* LEFT: STAFF LISTING */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                             <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                Counselor Performance Matrix
                             </h3>
                             <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search team..." 
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none w-64 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                             </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {filteredStaff.map((staffMember) => (
                                    <div key={staffMember.id} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={staffMember.avatar} className="w-16 h-16 rounded-[24px] object-cover border-4 border-slate-50 group-hover:scale-110 transition-transform" />
                                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${staffMember.status === 'online' ? 'bg-emerald-500' : staffMember.status === 'busy' ? 'bg-orange-500' : 'bg-slate-400'}`}></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-lg leading-tight">{staffMember.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">{staffMember.role}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{staffMember.department}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="text-slate-300 hover:text-indigo-600 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Active Files</span>
                                                <div className="flex items-end gap-2">
                                                    <span className={`text-2xl font-black ${staffMember.activeDeals > 15 ? 'text-orange-600' : 'text-slate-900'}`}>{staffMember.activeDeals}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 mb-1.5">/ 20 Max</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-1000 ${staffMember.activeDeals > 15 ? 'bg-orange-500' : 'bg-indigo-600'}`} style={{width: `${(staffMember.activeDeals/20)*100}%`}}></div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Revenue</span>
                                                <span className="text-xl font-black text-slate-900">${(staffMember.totalSales / 1000).toFixed(0)}k</span>
                                                <p className="text-[10px] font-bold text-emerald-600 mt-1">+12.5% MTD</p>
                                            </div>
                                        </div>

                                        {staffMember.tasks.some(t => t.status === 'pending') && (
                                            <div className="mb-6 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                                                <p className="text-[10px] font-black text-orange-600 uppercase mb-2 flex items-center gap-1.5">
                                                    <AlertTriangle className="w-3 h-3" /> Critical Blocker
                                                </p>
                                                <p className="text-xs font-bold text-slate-700 truncate">{staffMember.tasks.find(t => t.status === 'pending')?.title}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                            <button className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                                                Manage Tasks ({staffMember.tasks.length})
                                            </button>
                                            <button className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">Agent Name</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Workload</th>
                                            <th className="px-6 py-4">Sales Vol.</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredStaff.map(s => (
                                            <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={s.avatar} className="w-10 h-10 rounded-xl" />
                                                        <p className="font-bold text-slate-900">{s.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">{s.department}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-slate-700">{s.activeDeals} Deals</span>
                                                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500" style={{width: `${(s.activeDeals/20)*100}%`}}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900">${s.totalSales.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${s.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                        <span className="text-xs font-bold text-slate-500 uppercase">{s.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-slate-300 hover:text-indigo-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: TEAM ANALYTICS & FEED */}
                    <div className="space-y-8">
                        {/* TEAM TASK MASTER */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col h-[500px]">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6 flex items-center justify-between shrink-0">
                                Operational Taskboard
                                <button onClick={() => setIsTaskModalOpen(true)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </h4>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                                {allTasks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <CheckSquare className="w-12 h-12 mb-2" />
                                        <p className="text-xs font-bold">No active tasks</p>
                                    </div>
                                ) : (
                                    allTasks.map((task) => (
                                        <div key={task.id} className={`p-4 rounded-2xl border transition-all group ${task.status === 'completed' ? 'bg-slate-50 border-slate-100 grayscale opacity-60' : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'}`}>
                                            <div className="flex items-start gap-3">
                                                <button 
                                                    onClick={() => onToggleTaskStatus(task.counselorId, task.id)}
                                                    className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 hover:border-indigo-600'}`}
                                                >
                                                    {task.status === 'completed' && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-bold leading-tight mb-2 ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                        {task.title}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-50 text-red-600' : task.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {task.priority}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 rounded-full">@{task.counselorName}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => onDeleteTask(task.counselorId, task.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* WORKLOAD OPTIMIZER HEATMAP */}
                        <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden group hover:shadow-indigo-500/10 transition-shadow">
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <h4 className="font-black uppercase tracking-widest text-[11px] mb-2 relative z-10 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-indigo-400" />
                                Workload Optimizer
                            </h4>
                            <p className="text-xs text-slate-400 mb-6 relative z-10 font-medium">Auto-balancing recommendations based on real-time saturation levels.</p>
                            
                            <div className="space-y-4 relative z-10">
                                {staff.slice(0, 4).map((member, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${member.activeDeals > 15 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                            <span className="text-xs font-bold text-slate-300">{member.name}</span>
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-tighter text-slate-500">
                                            {member.activeDeals > 15 ? 'Overloaded' : 'Optimum'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button className="w-full mt-8 py-3 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl relative z-10">
                                Balance Loads
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
