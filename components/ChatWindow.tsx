
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread } from '../types';
import { MOCK_COUNSELORS } from '../constants';
import { Info, Paperclip, Mic, Send, Sparkles, FileText, Download, User, Landmark, ChevronDown, Phone, Video } from 'lucide-react';
import { getSmartSuggestions } from '../services/geminiService';

interface Props {
  conversation: Conversation;
  onSendMessage: (text: string, type?: MessageType, fileData?: { name: string, size: string }, thread?: MessageThread) => void;
  onToggleInfo: () => void;
  onAssignCounselor: (counselorId: string) => void;
  isInfoOpen?: boolean;
}

const ChatWindow: React.FC<Props> = ({ conversation, onSendMessage, onToggleInfo, onAssignCounselor, isInfoOpen = false }) => {
  const [inputText, setInputText] = useState('');
  const [activeThread, setActiveThread] = useState<MessageThread>('source');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const currentCounselor = MOCK_COUNSELORS.find(c => c.id === conversation.assignedCounselorId) || MOCK_COUNSELORS[0];
  const activeMessages = conversation.messages.filter(m => (m.thread || 'source') === activeThread);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeMessages.length, activeThread, conversation.id]);

  useEffect(() => {
    if (activeThread === 'source') {
        const fetchSuggestions = async () => {
            const newSuggestions = await getSmartSuggestions(activeMessages, conversation.client.name, conversation.client.qualificationTarget);
            setSuggestions(newSuggestions);
        };
        const lastMsg = activeMessages[activeMessages.length - 1];
        if (lastMsg && lastMsg.sender !== SenderType.AGENT) fetchSuggestions();
        else setSuggestions([]);
    } else setSuggestions([]);
  }, [activeMessages.length, conversation.id, activeThread]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, MessageType.TEXT, undefined, activeThread);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      
      {/* Natural Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
            <div className="relative">
                <img src={conversation.client.avatar} className="w-10 h-10 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
                <h2 className="font-bold text-slate-900 leading-tight">{conversation.client.name}</h2>
                <p className="text-[11px] text-slate-500">{conversation.client.qualificationTarget}</p>
            </div>
        </div>

        <div className="flex items-center gap-1">
            <button className="p-2 text-blue-600 hover:bg-slate-100 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
            <button className="p-2 text-blue-600 hover:bg-slate-100 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
            <button 
                className={`p-2 rounded-full transition-colors ${isInfoOpen ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-100'}`}
                onClick={onToggleInfo}
            >
                <Info className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Thread Switcher */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-hidden">
          <button 
            onClick={() => setActiveThread('source')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeThread === 'source' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Client Thread
          </button>
          <button 
            onClick={() => setActiveThread('upstream')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeThread === 'upstream' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            RTO Channel
          </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar" ref={scrollRef}>
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}>
               {msg.sender === SenderType.SYSTEM ? (
                   <div className="w-full flex justify-center my-4">
                       <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-4 py-1 rounded-full uppercase tracking-wider">
                           {msg.content}
                       </span>
                   </div>
               ) : (
                <div className={`flex max-w-[75%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-2 items-end`}>
                    {msg.sender !== SenderType.AGENT && (
                         <img src={conversation.client.avatar} className="w-6 h-6 rounded-full mb-1" />
                    )}
                    <div className={`flex flex-col ${msg.sender === SenderType.AGENT ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.sender === SenderType.AGENT ? `bg-[#0084FF] text-white rounded-br-none` : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                          {msg.type === MessageType.DOCUMENT ? (
                              <div className="flex items-center gap-3 min-w-[150px]">
                                  <FileText className="w-5 h-5" />
                                  <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold truncate">{msg.fileName}</p>
                                      <span className="text-[10px] opacity-70">{msg.fileSize}</span>
                                  </div>
                                  <button className="p-1 hover:bg-black/10 rounded-lg"><Download className="w-4 h-4" /></button>
                              </div>
                          ) : ( <p>{msg.content}</p> )}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 uppercase">
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                </div>
               )}
            </div>
          ))}
      </div>

      {/* Natural Input Bar */}
      <div className="p-4 border-t border-slate-200">
        {suggestions.length > 0 && activeThread === 'source' && (
            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                {suggestions.map((sug, idx) => (
                    <button key={idx} onClick={() => setInputText(sug)} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100 hover:bg-blue-50 transition-all">
                        {sug}
                    </button>
                ))}
            </div>
        )}
        <div className="flex items-center gap-2">
          <button className="p-2 text-blue-600 hover:bg-slate-100 rounded-full transition-colors"><Paperclip className="w-5 h-5" /></button>
          <button className="p-2 text-blue-600 hover:bg-slate-100 rounded-full transition-colors"><Mic className="w-5 h-5" /></button>
          <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4">
              <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
                  placeholder="Aa"
                  className="w-full bg-transparent border-none py-2.5 text-sm outline-none"
              />
              <Sparkles className="w-4 h-4 text-blue-400 ml-2" />
          </div>
          <button 
            onClick={handleSend} 
            disabled={!inputText.trim()} 
            className="p-2 text-blue-600 disabled:opacity-30 transition-all"
          >
            <Send className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
