
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ApplicationStage, Counselor } from '../types';
import { 
  Search, Filter, Folder, MoreHorizontal, Pin, 
  Tag, LayoutGrid, CheckCircle2, Circle, UserPlus, 
  RefreshCw, Archive, ChevronRight, X, User
} from 'lucide-react';
import { MOCK_COUNSELORS } from '../constants';

interface Props {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  categories: string[];
  onMoveToCategory: (id: string, category: string | undefined) => void;
  onAddCategory: (name: string) => void;
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onUpdateStatus: (id: string, status: ApplicationStage) => void;
  onAssignCounselor: (id: string, counselorId: string) => void;
  onArchive: (id: string) => void;
}

const ConversationList: React.FC<Props> = ({ 
  conversations, 
  selectedId, 
  onSelect, 
  isOpen, 
  categories,
  onMoveToCategory,
  onAddCategory,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onUpdateStatus,
  onAssignCounselor,
  onArchive
}) => {
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, id: string } | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<'assign' | 'stage' | 'folder' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredConversations = (activeTab === 'all' 
    ? conversations 
    : conversations.filter(c => c.customCategory === activeTab)).filter(c => c.status !== 'archived');

  const allFilteredSelected = filteredConversations.length > 0 && filteredConversations.every(c => selectedIds.includes(c.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
        setActiveSubMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, id });
    setActiveSubMenu(null);
  };

  const STAGES: { id: ApplicationStage, label: string }[] = [
    { id: 'lead', label: 'Intake' },
    { id: 'gs_assessment', label: 'GS Audit' },
    { id: 'financial_audit', label: 'Finance' },
    { id: 'sop_drafting', label: 'SOP Drafting' },
    { id: 'rto_submission', label: 'Submission' },
    { id: 'visa_lodged', label: 'Visa Lodged' },
    { id: 'visa_granted', label: 'Granted' }
  ];

  const renderCard = (conv: Conversation) => {
    const isSelected = selectedIds.includes(conv.id);
    
    return (
      <div
        key={conv.id}
        onClick={() => onSelect(conv.id)}
        onContextMenu={(e) => handleContextMenu(e, conv.id)}
        className={`
          relative p-3 mx-2 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 group
          ${selectedId === conv.id ? 'bg-blue-50 shadow-sm' : 'hover:bg-slate-50'}
          ${isSelected ? 'ring-2 ring-blue-500/30' : ''}
        `}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection(conv.id);
          }}
          className={`shrink-0 transition-all ${isSelected ? 'scale-110' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isSelected ? (
            <div className="bg-blue-600 rounded-lg p-1 text-white shadow-lg shadow-blue-200">
               <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="bg-white border-2 border-slate-200 rounded-lg p-1 text-slate-300 hover:border-blue-300">
               <Circle className="w-4 h-4" />
            </div>
          )}
        </button>

        <div className="relative shrink-0">
          <img
            src={conv.client.avatar}
            alt={conv.client.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-100"
          />
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${conv.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className={`text-sm truncate font-semibold ${conv.unreadCount > 0 ? 'text-slate-900' : 'text-slate-700'}`}>
              {conv.client.name}
            </h3>
            <span className="text-[10px] text-slate-400">
                {new Date(conv.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <p className={`text-[11px] truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
              {conv.client.qualificationTarget}
            </p>
            {conv.unreadCount > 0 && !isSelected && selectedId !== conv.id && (
               <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 ml-2"></div>
            )}
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenu(e as any, conv.id);
          }}
          className={`p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-200 transition-all ${contextMenu?.id === conv.id ? 'opacity-100 bg-slate-100 text-slate-600' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:static inset-y-0 left-0 z-40
      w-80 h-full bg-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-200
    `}>
      <div className="p-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-slate-900">Inbox</h1>
            <div className="flex gap-1">
                <button 
                  onClick={onSelectAll}
                  className={`p-2 rounded-full transition-all ${allFilteredSelected ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                  title="Select All"
                >
                    <CheckCircle2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                    <Filter className="w-5 h-5" />
                </button>
            </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-slate-100 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all border border-transparent focus:bg-white focus:border-slate-200"
          />
        </div>
      </div>

      <div className="p-2 border-b border-slate-50 bg-slate-50/30 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pb-1">
           <button 
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <LayoutGrid className="w-3.5 h-3.5" /> All
           </button>
           {categories.map(cat => (
             <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === cat ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Folder className={`w-3.5 h-3.5 ${activeTab === cat ? 'text-blue-500' : 'text-slate-400'}`} /> {cat}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-10 space-y-1">
        <div className="px-4 py-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {activeTab === 'all' ? 'Recent Conversations' : `${activeTab} Folder`}
            </h4>
        </div>
        
        {filteredConversations.length > 0 ? (
          filteredConversations.map(renderCard)
        ) : (
          <div className="p-8 text-center">
              <Folder className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Folder Empty</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => onAddCategory("New Folder")}
            className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl border border-dashed border-slate-300 transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Manage Folders
          </button>
      </div>

      {/* --- QUICK ACTION CONTEXT MENU --- */}
      {contextMenu && (
        <div 
          ref={menuRef}
          style={{ top: Math.min(contextMenu.y, window.innerHeight - 300), left: contextMenu.x }}
          className="fixed z-[100] w-64 bg-slate-900 text-white rounded-[24px] shadow-2xl border border-white/10 p-1.5 animate-in zoom-in-95 duration-150 backdrop-blur-xl"
        >
          <div className="px-3 py-2 border-b border-white/5 mb-1 flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Quick Actions</span>
            <button onClick={() => setContextMenu(null)} className="text-slate-500 hover:text-white"><X className="w-3 h-3" /></button>
          </div>

          <div className="space-y-0.5 relative">
            {/* ASSIGN COUNSELOR */}
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveSubMenu('assign')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeSubMenu === 'assign' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
              >
                <div className="flex items-center gap-3"><UserPlus className="w-4 h-4" /> Assign Agent</div>
                <ChevronRight className="w-3 h-3" />
              </button>
              {activeSubMenu === 'assign' && (
                <div className="absolute left-full top-0 ml-1 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-1.5 animate-in slide-in-from-left-2">
                  {MOCK_COUNSELORS.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => { onAssignCounselor(contextMenu.id, c.id); setContextMenu(null); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-left group"
                    >
                      <img src={c.avatar} className="w-6 h-6 rounded-lg object-cover" />
                      <div className="truncate">
                        <p className="text-[11px] font-bold text-white group-hover:text-blue-400">{c.name}</p>
                        <p className="text-[8px] font-black text-slate-500 uppercase">{c.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CHANGE STAGE */}
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveSubMenu('stage')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeSubMenu === 'stage' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
              >
                <div className="flex items-center gap-3"><RefreshCw className="w-4 h-4" /> Change Stage</div>
                <ChevronRight className="w-3 h-3" />
              </button>
              {activeSubMenu === 'stage' && (
                <div className="absolute left-full top-0 ml-1 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-1.5 animate-in slide-in-from-left-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {STAGES.map(s => (
                    <button 
                      key={s.id} 
                      onClick={() => { onUpdateStatus(contextMenu.id, s.id); setContextMenu(null); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-[11px] font-bold text-slate-300 hover:text-white"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MOVE TO FOLDER */}
            <div className="relative">
              <button 
                onMouseEnter={() => setActiveSubMenu('folder')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeSubMenu === 'folder' ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
              >
                <div className="flex items-center gap-3"><Tag className="w-4 h-4" /> Move to Folder</div>
                <ChevronRight className="w-3 h-3" />
              </button>
              {activeSubMenu === 'folder' && (
                <div className="absolute left-full top-0 ml-1 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-1.5 animate-in slide-in-from-left-2">
                  <button 
                    onClick={() => { onMoveToCategory(contextMenu.id, undefined); setContextMenu(null); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-2"
                  >
                    <Folder className="w-3.5 h-3.5" /> Inbox
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => { onMoveToCategory(contextMenu.id, cat); setContextMenu(null); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-2"
                    >
                      <Tag className="w-3.5 h-3.5" /> {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-white/5 my-1.5"></div>

            {/* PIN/ARCHIVE */}
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all">
              <Pin className="w-4 h-4" /> Pin File
            </button>
            <button 
              onClick={() => { onArchive(contextMenu.id); setContextMenu(null); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Archive className="w-4 h-4" /> Quick Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
);

export default ConversationList;
