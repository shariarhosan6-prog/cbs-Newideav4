
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, MessageType, SenderType, MessageThread, Counselor } from '../types';
import { MOCK_COUNSELORS } from '../constants';
import { Info, Paperclip, Mic, Smile, Send, Sparkles, FileText, Download, Building2, User, Globe, Briefcase, ArrowRight, PanelRightClose, PanelRightOpen, UserPlus, ShieldCheck, ChevronDown, Activity, AlertTriangle, Lightbulb, Landmark } from 'lucide-react';
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
  const [isAssigning, setIsAssigning] = useState(false);
  const [showAIContext, setShowAIContext] = useState(true);
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

  const getSentimentLabel = () => {
      const s = conversation.sentiment || 'neutral';
      if (s === 'urgent') return { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50' };
      if (s === 'anxious') return { label: 'Anxious', color: 'text-orange-600', bg: 'bg-orange-50' };
      if (s === 'positive') return { label: 'Positive', color: 'text-emerald-600', bg: 'bg-emerald-50' };
      return { label: 'Neutral', color: 'text-slate-400', bg: 'bg-slate-50' };
  };

  const sentiment = getSentimentLabel();

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      
      {/* Header Container */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="h-20 flex items-center justify-between px-8">
            <div className="flex items-center gap-5">
                <div className="relative">
                    <img src={conversation.client.avatar} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-black text-slate-900 text-lg leading-tight tracking-tight">{conversation.client.name}</h2>
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${sentiment.bg} ${sentiment.color} border border-current opacity-70`}>
                           <Activity className="w-2.5 h-2.5" /> Pulse: {sentiment.label}
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{conversation.client.qualificationTarget}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <button 
                        onClick={() => setIsAssigning(!isAssigning)}
                        className="flex items-center gap-2.5 px-4 py-2 bg-slate-100/50 hover:bg-slate-100 transition-all rounded-2xl border border-slate-200 group"
                    >
                        <img src={currentCounselor.avatar} className="w-6 h-6 rounded-lg" />
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{currentCounselor.name.split(' ')[0]}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isAssigning ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isAssigning && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 animate-in zoom-in-95 fade-in z-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3 border-b border-slate-50 mb-1">Transfer Ownership</p>
                            {MOCK_COUNSELORS.map(staff => (
                                <button 
                                    key={staff.id}
                                    onClick={() => { onAssignCounselor(staff.id); setIsAssigning(false); }}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${staff.id === conversation.assignedCounselorId ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3 text-left">
                                        <img src={staff.avatar} className="w-8 h-8 rounded-lg" />
                                        <div>
                                            <p className="text-xs font-black text-slate-800 leading-none">{staff.name}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1">{staff.role}</p>
                                        </div>
                                    </div>
                                    {staff.id === conversation.assignedCounselorId && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    className={`p-3 rounded-2xl transition-all border ${isInfoOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-900'}`}
                    onClick={onToggleInfo}
                >
                    {isInfoOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
                </button>
            </div>
        </div>

        {/* AI Briefing - Slimmer Design */}
        {showAIContext && (
            <div className="px-8 pb-4">
                <div className="bg-indigo-600 rounded-[28px] p-4 flex items-center gap-4 shadow-xl shadow-indigo-100">
                    <div className="p-2.5 bg-white/20 rounded-2xl text-white"><Lightbulb className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                            <h4 className="text-[10px] font-black text-white/70 uppercase tracking-widest">AI Intelligence Summary</h4>
                            <button onClick={() => setShowAIContext(false)} className="text-[9px] font-black text-white/50 hover:text-white uppercase tracking-widest">Dismiss</button>
                        </div>
                        <p className="text-xs text-white font-bold truncate">
                            Visa risk: {conversation.visaRiskLevel}. {conversation.documents.filter(d => d.status === 'missing').length} items pending for {conversation.client.name}.
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="px-8 pb-4">
            <div className="bg-slate-100/50 p-1 rounded-2xl flex relative border border-slate-100">
                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-500 ease-out ${activeThread === 'source' ? 'left-1' : 'left-[calc(50%+3px)]'}`}></div>
                <button onClick={() => setActiveThread('source')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${activeThread === 'source' ? 'text-slate-900' : 'text-slate-400'}`}>
                    {conversation.source === 'sub_agent' ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    Client Channel
                </button>
                <button onClick={() => setActiveThread('upstream')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${activeThread === 'upstream' ? 'text-blue-600' : 'text-slate-400'}`}>
                    <Landmark className="w-3.5 h-3.5" /> Partner Comms
                </button>
            </div>
        </div>
      </div>

      <div className={`shrink-0 transition-all duration-500 ${showAIContext ? 'h-[248px]' : 'h-[168px]'}`}></div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar" ref={scrollRef}>
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}>
               {msg.sender === SenderType.SYSTEM ? (
                   <div className="w-full flex justify-center my-8">
                       <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-5 py-2 rounded-full uppercase tracking-widest border border-slate-100">
                           {msg.content}
                       </span>
                   </div>
               ) : (
                <div className={`flex max-w-[80%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-3 group`}>
                    <div className="flex flex-col gap-1.5">
                      <div className={`relative px-5 py-4 shadow-sm text-sm transition-all ${msg.sender === SenderType.AGENT ? `bg-slate-900 text-white rounded-[24px] rounded-tr-sm shadow-slate-200` : 'bg-slate-50 text-slate-800 rounded-[24px] rounded-tl-sm border border-slate-100 group-hover:bg-white group-hover:shadow-md'}`}>
                          {msg.type === MessageType.DOCUMENT ? (
                              <div className="flex items-center gap-4 min-w-[200px]">
                                  <div className={`p-3 rounded-2xl ${msg.sender === SenderType.AGENT ? 'bg-white/10 text-white' : 'bg-white text-blue-600 shadow-sm'}`}><FileText className="w-6 h-6" /></div>
                                  <div className="flex-1 min-w-0">
                                      <p className="font-black text-xs truncate uppercase tracking-tight">{msg.fileName}</p>
                                      <span className="text-[9px] font-bold text-slate-400 opacity-80">{msg.fileSize} • Verified</span>
                                  </div>
                                  <button className="p-2 rounded-xl hover:bg-black/5 transition-colors"><Download className="w-4 h-4" /></button>
                              </div>
                          ) : ( <p className="font-bold leading-relaxed">{msg.content}</p> )}
                      </div>
                      <div className={`flex items-center gap-2 text-[9px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {msg.sender === SenderType.AGENT && <span className="text-emerald-500">Seen</span>}
                      </div>
                    </div>
                </div>
               )}
            </div>
          ))}
      </div>

      {/* Input Area - Minimal & Centered */}
      <div className="p-8 border-t border-slate-50 bg-white">
        {suggestions.length > 0 && activeThread === 'source' && (
            <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                {suggestions.map((sug, idx) => (
                    <button key={idx} onClick={() => setInputText(sug)} className="whitespace-nowrap px-4 py-2.5 bg-white text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 hover:border-blue-600 hover:text-blue-600 shadow-sm transition-all active:scale-95">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" /> {sug}
                    </button>
                ))}
            </div>
        )}
        <div className="flex items-end gap-4 max-w-4xl mx-auto bg-slate-100/50 p-2 rounded-[32px] border border-slate-100 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Write to ${conversation.client.name.split(' ')[0]}...`}
              className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold placeholder:text-slate-400 outline-none resize-none"
          />
          <button onClick={handleSend} disabled={!inputText.trim()} className={`p-4 text-white rounded-[24px] disabled:opacity-30 transition-all shadow-xl active:scale-90 ${activeThread === 'upstream' ? 'bg-blue-600 shadow-blue-100' : 'bg-slate-900 shadow-slate-200'}`}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
