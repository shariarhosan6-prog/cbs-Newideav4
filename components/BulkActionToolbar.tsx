
import React, { useState } from 'react';
import { 
  Users, FolderInput, MessageSquareText, FileDown, X, 
  CheckCircle2, UserPlus, Zap, Mail
} from 'lucide-react';
import { Counselor } from '../types';

interface Props {
  selectedCount: number;
  onClear: () => void;
  counselors: Counselor[];
  categories: string[];
  onBulkAssign: (counselorId: string) => void;
  onBulkMove: (category: string | undefined) => void;
  onBulkMessage: (message: string) => void;
  onBulkExport: () => void;
}

const BulkActionToolbar: React.FC<Props> = ({ 
  selectedCount, 
  onClear, 
  counselors, 
  categories,
  onBulkAssign,
  onBulkMove,
  onBulkMessage,
  onBulkExport
}) => {
  const [activeMenu, setActiveMenu] = useState<'assign' | 'move' | 'message' | null>(null);
  const [bulkMessage, setBulkMessage] = useState('');

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-[32px] shadow-2xl shadow-blue-900/40 p-2 flex items-center gap-2 min-w-[500px] backdrop-blur-xl bg-slate-900/90">
        
        {/* COUNTER SECTION */}
        <div className="px-6 py-3 border-r border-slate-800 flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-black text-sm animate-pulse">
                {selectedCount}
            </div>
            <div className="hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Selected</p>
                <p className="text-xs font-bold whitespace-nowrap">Student Profiles</p>
            </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-1 px-2">
            <button 
                onClick={() => setActiveMenu(activeMenu === 'assign' ? null : 'assign')}
                className={`p-3 rounded-2xl transition-all flex items-center gap-2 hover:bg-slate-800 ${activeMenu === 'assign' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                title="Bulk Assign"
            >
                <UserPlus className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Assign</span>
            </button>

            <button 
                onClick={() => setActiveMenu(activeMenu === 'move' ? null : 'move')}
                className={`p-3 rounded-2xl transition-all flex items-center gap-2 hover:bg-slate-800 ${activeMenu === 'move' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                title="Bulk Move"
            >
                <FolderInput className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Move</span>
            </button>

            <button 
                onClick={() => setActiveMenu(activeMenu === 'message' ? null : 'message')}
                className={`p-3 rounded-2xl transition-all flex items-center gap-2 hover:bg-slate-800 ${activeMenu === 'message' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                title="Bulk Message"
            >
                <MessageSquareText className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Message</span>
            </button>

            <button 
                onClick={onBulkExport}
                className="p-3 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2"
                title="Bulk Export"
            >
                <FileDown className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Export</span>
            </button>
        </div>

        <button 
            onClick={onClear}
            className="ml-2 p-3 text-slate-500 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all"
        >
            <X className="w-5 h-5" />
        </button>

        {/* OVERLAY MENUS */}
        {activeMenu === 'assign' && (
            <div className="absolute bottom-full left-0 mb-4 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 animate-in slide-in-from-bottom-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Select Counselor</p>
                <div className="space-y-1">
                    {counselors.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => { onBulkAssign(c.id); setActiveMenu(null); }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-slate-800 rounded-xl transition-all text-left group"
                        >
                            <img src={c.avatar} className="w-8 h-8 rounded-full border border-slate-700" alt="" />
                            <div>
                                <p className="text-xs font-bold group-hover:text-blue-400">{c.name}</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase">{c.department}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {activeMenu === 'move' && (
            <div className="absolute bottom-full left-1/4 mb-4 w-56 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 animate-in slide-in-from-bottom-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Move to Folder</p>
                <div className="space-y-1">
                    <button 
                        onClick={() => { onBulkMove(undefined); setActiveMenu(null); }}
                        className="w-full text-left p-3 hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-300"
                    >
                        <FolderInput className="w-4 h-4" /> Default Inbox
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => { onBulkMove(cat); setActiveMenu(null); }}
                            className="w-full text-left p-3 hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-300"
                        >
                            <CheckCircle2 className="w-4 h-4 text-blue-500" /> {cat}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {activeMenu === 'message' && (
            <div className="absolute bottom-full right-0 mb-4 w-96 bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl p-6 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Broadcast</h4>
                    <span className="text-[8px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> AI Templates
                    </span>
                </div>
                <textarea 
                    autoFocus
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    placeholder="Type broadcast message..."
                    className="w-full h-32 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none mb-4"
                />
                <div className="flex gap-2">
                    <button 
                        onClick={() => { onBulkMessage(bulkMessage); setActiveMenu(null); setBulkMessage(''); }}
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                        <Mail className="w-3.5 h-3.5" /> Send to All
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default BulkActionToolbar;
