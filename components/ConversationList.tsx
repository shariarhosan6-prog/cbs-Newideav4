
import React from 'react';
import { Conversation } from '../types';
import { Search, Filter, Circle } from 'lucide-react';

interface Props {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
}

const ConversationList: React.FC<Props> = ({ conversations, selectedId, onSelect, isOpen }) => {
  return (
    <div className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      fixed lg:static inset-y-0 left-0 z-40
      w-80 h-full bg-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-200
    `}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-slate-900">Chats</h1>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Filter className="w-5 h-5" />
            </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Messenger"
            className="w-full bg-slate-100 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`
              p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-colors
              ${selectedId === conv.id ? 'bg-blue-50' : 'hover:bg-slate-50'}
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
                {conv.unreadCount > 0 && (
                   <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 ml-2"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
