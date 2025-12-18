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
      case 'high': return 'bg-red-500 shadow-red-200';
      case 'medium': return 'bg-orange-500 shadow-orange-200';
      case 'low': return 'bg-green-500 shadow-green-200';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active': return <Clock className="w-3 h-3 text-orange-500" />;
        case 'completed': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
        default: return <MessageSquare className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <div className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:static inset-y-0 left-0 z-40
      w-80 h-full bg-white flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-100 shadow-[2px_0_20px_rgba(0,0,0,0.02)]
    `}>
      {/* Header & Search */}
      <div className="p-5 pb-2">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Messages</h1>
            <button className="p-2 text-gray-400 hover:text-messenger-blue hover:bg-blue-50 rounded-full transition-all">
                <Filter className="w-4 h-4" />
            </button>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-messenger-blue transition-colors" />
          <input
            type="text"
            placeholder="Search students..."
            className="w-full bg-slate-50 text-sm text-slate-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-messenger-blue/20 focus:bg-white border border-transparent focus:border-messenger-blue/20 transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 py-2 gap-6 text-sm font-medium text-gray-400 border-b border-gray-50 mb-2">
        <button className="text-messenger-blue relative pb-2 transition-colors">
            All
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-messenger-blue rounded-full"></span>
        </button>
        <button className="hover:text-slate-600 pb-2 transition-colors">Direct</button>
        <button className="hover:text-slate-600 pb-2 transition-colors">Sub-Agents</button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`
              relative p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-all duration-200 group
              ${selectedId === conv.id 
                ? 'bg-blue-50/80 shadow-sm ring-1 ring-blue-100' 
                : 'hover:bg-gray-50 border border-transparent'}
            `}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={conv.client.avatar}
                alt={conv.client.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${conv.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`text-sm truncate ${selectedId === conv.id ? 'font-semibold text-messenger-blue' : 'font-medium text-slate-900 group-hover:text-slate-700'}`}>
                  {conv.client.name}
                </h3>
                <span className={`text-[10px] whitespace-nowrap ${selectedId === conv.id ? 'text-blue-400' : 'text-gray-400'}`}>
                    {new Date(conv.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {/* Source Badge */}
              <div className="flex items-center gap-1.5 mb-1.5">
                 {conv.source === 'sub_agent' ? (
                     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-50/80 text-purple-700 text-[9px] font-bold tracking-wide border border-purple-100 uppercase">
                         <Building2 className="w-2.5 h-2.5" />
                         {conv.subAgentName || 'Sub-Agent'}
                     </span>
                 ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50/80 text-emerald-700 text-[9px] font-bold tracking-wide border border-emerald-100 uppercase">
                         <User className="w-2.5 h-2.5" />
                         Direct
                     </span>
                 )}
              </div>

              <p className={`text-xs truncate mb-2 ${conv.unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                {conv.messages[conv.messages.length - 1]?.content || 'No messages yet'}
              </p>
              
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shadow-sm ${getPriorityColor(conv.priority)}`}></span>
                <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium ${selectedId === conv.id ? 'bg-white/60 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    {getStatusIcon(conv.status)}
                    {conv.currentStep}
                </div>
              </div>
            </div>

            {/* Unread Badge */}
            {conv.unreadCount > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-6">
                <div className="w-5 h-5 bg-messenger-blue shadow-lg shadow-blue-200 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
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