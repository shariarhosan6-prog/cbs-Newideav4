
import React from 'react';
import { Conversation } from '../types';
import { Search, Circle, Clock, CheckCircle2, MessageSquare, Filter, Building2, User } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
}

const ConversationList: React.FC<Props> = ({ conversations, selectedId, onSelect, isOpen }) => {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:static inset-y-0 left-0 z-40
      w-80 h-full bg-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-100
    `}>
      {/* Header & Search */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Inbox</h1>
            <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full bg-slate-50 text-xs font-bold text-slate-700 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white border border-transparent focus:border-blue-100 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 py-1 gap-6 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 mb-2">
        <button className="text-blue-600 relative pb-3 transition-colors">
            All Files
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
        </button>
        <button className="hover:text-slate-600 pb-3 transition-colors">Pending</button>
        <button className="hover:text-slate-600 pb-3 transition-colors">Archived</button>
      </div>

      {/* List - with vertical scroll fix */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`
              relative p-4 rounded-3xl flex items-center gap-4 cursor-pointer transition-all duration-300 group
              ${selectedId === conv.id 
                ? 'bg-blue-600 shadow-xl shadow-blue-100' 
                : 'hover:bg-slate-50'}
            `}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={conv.client.avatar}
                alt={conv.client.name}
                className={`w-12 h-12 rounded-2xl object-cover transition-transform duration-500 ${selectedId === conv.id ? 'ring-2 ring-white/50 scale-95' : 'ring-2 ring-slate-100'}`}
              />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${conv.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`text-sm truncate font-black tracking-tight ${selectedId === conv.id ? 'text-white' : 'text-slate-900'}`}>
                  {conv.client.name}
                </h3>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${selectedId === conv.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {new Date(conv.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className={`text-[11px] truncate mb-1 font-bold ${selectedId === conv.id ? 'text-blue-50' : 'text-slate-500'}`}>
                {conv.client.qualificationTarget}
              </p>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ${selectedId === conv.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {conv.currentStep}
                </div>
                {conv.unreadCount > 0 && selectedId !== conv.id && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Selection indicator bubble */}
            {conv.unreadCount > 0 && selectedId !== conv.id && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg">
                  {conv.unreadCount}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
