
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread } from '../types';
import { MOCK_COUNSELORS } from '../constants';
// Added CheckCircle2 to imports from lucide-react
import { Info, Paperclip, Mic, Send, Sparkles, FileText, Download, Phone, Video, ChevronDown, MoreVertical, CheckCircle2 } from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* Header with High-End Navigation */}
      <div className="bg-white border-b border-slate-100 z-30">
        <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <img src={conversation.client.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:scale-105 transition-transform" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h2 className="font-bold text-slate-900 leading-tight text-base">{conversation.client.name}</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{conversation.client.qualificationTarget}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 mr-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"><Phone className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"><Video className="w-5 h-5" /></button>
                </div>
                <button 
                    className={`flex items-center gap-2 pl-2 pr-4 py-2 rounded-xl border transition-all text-xs font-bold ${isInfoOpen ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    onClick={onToggleInfo}
                >
                    <Info className="w-4 h-4" /> File Insight
                </button>
            </div>
        </div>

        {/* Premium Segmented Thread Switcher */}
        <div className="flex justify-center pb-3">
            <div className="bg-slate-100 p-1 rounded-2xl flex relative w-full max-w-[340px] border border-slate-100 shadow-inner">
                {/* Sliding Background */}
                <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-md transition-all duration-300 ease-out ${activeThread === 'source' ? 'left-1' : 'left-[calc(50%+3px)]'}`}
                ></div>
                
                <button 
                    onClick={() => setActiveThread('source')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${activeThread === 'source' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <UserIcon className="w-3.5 h-3.5" /> Client Desk
                </button>
                <button 
                    onClick={() => setActiveThread('upstream')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${activeThread === 'upstream' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <LandmarkIcon className="w-3.5 h-3.5" /> RTO Portal
                </button>
            </div>
        </div>
      </div>

      {/* Messages - Beautiful Scrolled Space */}
      <div className={`flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar transition-colors duration-500 ${activeThread === 'upstream' ? 'bg-indigo-50/20' : 'bg-white'}`} ref={scrollRef}>
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}>
               {msg.sender === SenderType.SYSTEM ? (
                   <div className="w-full flex justify-center my-6">
                       <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-6 py-2 rounded-full uppercase tracking-[0.15em] border border-slate-100">
                           {msg.content}
                       </span>
                   </div>
               ) : (
                <div className={`flex max-w-[80%] lg:max-w-[70%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end group`}>
                    {msg.sender !== SenderType.AGENT && (
                         <img src={conversation.client.avatar} className="w-7 h-7 rounded-full mb-1 border border-slate-200" />
                    )}
                    <div className={`flex flex-col ${msg.sender === SenderType.AGENT ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all duration-300 ${msg.sender === SenderType.AGENT 
                        ? `${activeThread === 'upstream' ? 'bg-indigo-600' : 'bg-[#0084FF]'} text-white rounded-br-none hover:shadow-lg` 
                        : 'bg-slate-100 text-slate-800 rounded-bl-none hover:bg-slate-200'}`}>
                          {msg.type === MessageType.DOCUMENT ? (
                              <div className="flex items-center gap-4 min-w-[200px]">
                                  <div className={`p-2 rounded-xl ${msg.sender === SenderType.AGENT ? 'bg-white/10' : 'bg-white'}`}><FileText className="w-6 h-6" /></div>
                                  <div className="flex-1 min-w-0">
                                      <p className="font-bold text-xs truncate uppercase tracking-tight">{msg.fileName}</p>
                                      <span className="text-[10px] opacity-70 font-medium">{msg.fileSize} • AI Verified</span>
                                  </div>
                                  <button className={`p-1.5 rounded-lg ${msg.sender === SenderType.AGENT ? 'hover:bg-white/20' : 'hover:bg-black/5'}`}><Download className="w-4 h-4" /></button>
                              </div>
                          ) : ( <p className="font-medium tracking-tight">{msg.content}</p> )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {/* Correctly using the now imported CheckCircle2 icon */}
                        {msg.sender === SenderType.AGENT && <CheckCircle2 className="w-3 h-3 text-blue-500 opacity-50" />}
                      </div>
                    </div>
                </div>
               )}
            </div>
          ))}
      </div>

      {/* Input Console */}
      <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        {suggestions.length > 0 && activeThread === 'source' && (
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {suggestions.map((sug, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setInputText(sug)} 
                        className="whitespace-nowrap px-4 py-2 bg-slate-50 text-blue-600 text-[11px] font-black uppercase tracking-widest rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        <Sparkles className="w-3 h-3 inline mr-2" /> {sug}
                    </button>
                ))}
            </div>
        )}
        <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:border-blue-200 transition-all duration-300">
          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"><Paperclip className="w-5 h-5" /></button>
          <div className="flex-1 px-2">
              <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
                  placeholder={`Send secure message to ${activeThread === 'source' ? 'Client' : 'Partner'}...`}
                  className="w-full bg-transparent border-none py-2 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
              />
          </div>
          <button 
            onClick={handleSend} 
            disabled={!inputText.trim()} 
            className={`p-3 rounded-xl transition-all shadow-md active:scale-90 ${activeThread === 'upstream' ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' : 'bg-[#0084FF] text-white shadow-blue-100 hover:bg-blue-600'}`}
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Icons
const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const LandmarkIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="7" x2="21" y2="7"/><path d="M5 21V7"/><path d="M9 21V7"/><path d="M15 21V7"/><path d="M19 21V7"/><path d="M3 7l9-4 9 4"/></svg>
);

export default ChatWindow;
