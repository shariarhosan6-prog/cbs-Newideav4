
import React, { useState } from 'react';
import { Conversation } from '../types';
import { Search, Filter, ChevronDown, ChevronRight, Folder, MoreHorizontal, Pin, Archive, Tag, LayoutGrid } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  categories: string[];
  onMoveToCategory: (id: string, category: string | undefined) => void;
  onAddCategory: (name: string) => void;
}

const ConversationList: React.FC<Props> = ({ 
  conversations, 
  selectedId, 
  onSelect, 
  isOpen, 
  categories,
  onMoveToCategory,
  onAddCategory 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | string>('all');
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);

  const filteredConversations = activeTab === 'all' 
    ? conversations 
    : conversations.filter(c => c.customCategory === activeTab);

  const renderCard = (conv: Conversation) => (
    <div
      key={conv.id}
      onClick={() => onSelect(conv.id)}
      className={`
        relative p-3 mx-2 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 group
        ${selectedId === conv.id ? 'bg-blue-50 shadow-sm' : 'hover:bg-slate-50'}
      `}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={conv.client.avatar}
          alt={conv.client.name}
          className="w-12 h-12 rounded-full object-cover border border-slate-100"
        />
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${conv.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
      </div>

      {/* Content */}
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
          <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
            {conv.client.qualificationTarget}
          </p>
          {conv.unreadCount > 0 && selectedId !== conv.id && (
             <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 ml-2"></div>
          )}
        </div>
      </div>

      {/* Card Options Menu */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionsId(showOptionsId === conv.id ? null : conv.id);
        }}
        className={`p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-200 transition-all ${showOptionsId === conv.id ? 'opacity-100 bg-slate-100 text-slate-600' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Contextual Action Menu */}
      {showOptionsId === conv.id && (
        <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-1 animate-in zoom-in-95 duration-200">
           <div className="p-2 border-b border-slate-50">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Organize File</p>
           </div>
           <button className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-2">
               <Pin className="w-3.5 h-3.5" /> Pin Conversation
           </button>
           <div className="my-1 border-t border-slate-50"></div>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest p-2">Move to Folder</p>
           <button 
              onClick={(e) => { e.stopPropagation(); onMoveToCategory(conv.id, undefined); setShowOptionsId(null); }}
              className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-2 ${!conv.customCategory ? 'text-blue-600' : 'text-slate-600'}`}
           >
              <Folder className="w-3.5 h-3.5" /> Default Inbox
           </button>
           {categories.map(cat => (
             <button 
                key={cat}
                onClick={(e) => { e.stopPropagation(); onMoveToCategory(conv.id, cat); setShowOptionsId(null); }}
                className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-2 ${conv.customCategory === cat ? 'text-blue-600' : 'text-slate-600'}`}
             >
                <Tag className="w-3.5 h-3.5" /> {cat}
             </button>
           ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:static inset-y-0 left-0 z-40
      w-80 h-full bg-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-200
    `}>
      {/* Header Area */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-slate-900">Inbox</h1>
            <div className="flex gap-1">
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

      {/* Top Folders Navigation */}
      <div className="p-2 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
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

      {/* Conversation List */}
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
              <p className="text-xs text-slate-400 font-medium">No conversations in this folder.</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => onAddCategory("New Folder")}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl border border-dashed border-slate-300 transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Manage Folders
          </button>
      </div>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
);

export default ConversationList;
