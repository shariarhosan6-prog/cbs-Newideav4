
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, MessageType, SenderType, MessageThread, Counselor } from '../types';
import { MOCK_COUNSELORS } from '../constants';
// Added ChevronDown to the imports
import { Info, Paperclip, Mic, Smile, Send, Sparkles, FileText, Download, Building2, User, Globe, Briefcase, ArrowRight, PanelRightClose, PanelRightOpen, UserPlus, ShieldCheck, ChevronDown } from 'lucide-react';
import { getSmartSuggestions } from '../services/geminiService';

interface Props {
  conversation: Conversation;
  onSendMessage: (text: string, type?: MessageType, fileData?: { name: string, size: string }, thread?: MessageThread) => void;
  onToggleInfo: () => void;
  onAssignCounselor: (counselorId: string) => void; // New prop
  isInfoOpen?: boolean;
}

const ChatWindow: React.FC<Props> = ({ conversation, onSendMessage, onToggleInfo, onAssignCounselor, isInfoOpen = false }) => {
  const [inputText, setInputText] = useState('');
  const [activeThread, setActiveThread] = useState<MessageThread>('source');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Find assigned counselor details
  const currentCounselor = MOCK_COUNSELORS.find(c => c.id === conversation.assignedCounselorId) || MOCK_COUNSELORS[0];

  const activeMessages = conversation.messages.filter(m => (m.thread || 'source') === activeThread);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeMessages.length, activeThread, conversation.id]);

  useEffect(() => {
    if (activeThread === 'source') {
        const fetchSuggestions = async () => {
            setLoadingSuggestions(true);
            const newSuggestions = await getSmartSuggestions(activeMessages, conversation.client.name, conversation.client.qualificationTarget);
            setSuggestions(newSuggestions);
            setLoadingSuggestions(false);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onSendMessage(`Sent a file: ${file.name}`, MessageType.DOCUMENT, { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(2)} MB` }, activeThread);
    }
  };

  const theme = activeThread === 'source' 
    ? { primary: 'bg-messenger-blue', gradient: 'from-messenger-blue to-blue-500', light: 'bg-blue-50', text: 'text-messenger-blue' }
    : { primary: 'bg-indigo-600', gradient: 'from-indigo-600 to-purple-600', light: 'bg-indigo-50', text: 'text-indigo-600' };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      
      {/* Header Container */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100">
        <div className="h-16 flex items-center justify-between px-6 pt-2">
            <div className="flex items-center gap-4">
                <img src={conversation.client.avatar} className="w-10 h-10 rounded-full ring-2 ring-white shadow-md object-cover" />
                <div>
                    <h2 className="font-bold text-slate-800 text-base leading-tight">{conversation.client.name}</h2>
                    <p className="text-[11px] font-medium text-slate-500 tracking-wide">{conversation.client.qualificationTarget}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* ASSIGNMENT BADGE */}
                <div className="relative">
                    <button 
                        onClick={() => setIsAssigning(!isAssigning)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full border border-slate-200"
                    >
                        <img src={currentCounselor.avatar} className="w-5 h-5 rounded-full" />
                        <span className="text-[11px] font-bold text-slate-700">{currentCounselor.name.split(' ')[0]}</span>
                        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isAssigning ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* ASSIGNMENT DROPDOWN */}
                    {isAssigning && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in zoom-in-95 fade-in z-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Assign to Team Member</p>
                            {MOCK_COUNSELORS.map(staff => (
                                <button 
                                    key={staff.id}
                                    onClick={() => { onAssignCounselor(staff.id); setIsAssigning(false); }}
                                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${staff.id === conversation.assignedCounselorId ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="relative">
                                            <img src={staff.avatar} className="w-8 h-8 rounded-full" />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${staff.status === 'online' ? 'bg-green-500' : staff.status === 'busy' ? 'bg-orange-500' : 'bg-slate-400'}`}></div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{staff.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{staff.role}</p>
                                        </div>
                                    </div>
                                    {staff.id === conversation.assignedCounselorId && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    className={`p-2.5 rounded-full transition-all border ${isInfoOpen ? 'bg-blue-50 text-messenger-blue border-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:text-messenger-blue hover:shadow-md'}`}
                    onClick={onToggleInfo}
                >
                    {isInfoOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
                </button>
            </div>
        </div>

        {/* Channel Switcher */}
        <div className="px-6 pb-4">
            <div className="bg-slate-100 p-1.5 rounded-xl flex relative border border-slate-200/50">
                <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${activeThread === 'source' ? 'left-1.5' : 'left-[calc(50%+3px)] translate-x-0'}`}></div>
                <button onClick={() => setActiveThread('source')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold relative z-10 transition-colors ${activeThread === 'source' ? 'text-slate-800' : 'text-slate-500'}`}>
                    {conversation.source === 'sub_agent' ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    {conversation.source === 'sub_agent' ? 'Sub-Agent Channel' : 'Client Channel'}
                </button>
                <button onClick={() => setActiveThread('upstream')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold relative z-10 transition-colors ${activeThread === 'upstream' ? 'text-indigo-700' : 'text-slate-500'}`}>
                    <Briefcase className="w-3.5 h-3.5" /> Upstream / RTO
                </button>
            </div>
        </div>
      </div>

      {/* Spacer for Double Header */}
      <div className="h-[136px] shrink-0"></div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scroll-smooth" ref={scrollRef}>
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}>
               {msg.sender === SenderType.SYSTEM ? (
                   <div className="w-full flex justify-center my-4">
                       <span className="text-[10px] font-bold text-slate-500 bg-slate-100/80 px-4 py-1.5 rounded-full uppercase border border-white shadow-sm">
                           {msg.content}
                       </span>
                   </div>
               ) : (
                <div className={`flex max-w-[80%] md:max-w-[70%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-3 group`}>
                    <div className="flex flex-col gap-1">
                      <div className={`relative px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${msg.sender === SenderType.AGENT ? `bg-gradient-to-tr ${theme.gradient} text-white rounded-2xl rounded-tr-sm` : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'}`}>
                          {msg.type === MessageType.DOCUMENT ? (
                              <div className="flex items-center gap-3 min-w-[200px]">
                                  <div className={`p-2.5 rounded-xl ${msg.sender === SenderType.AGENT ? 'bg-white/20' : `${theme.light} ${theme.text}`}`}><FileText className="w-6 h-6" /></div>
                                  <div className="flex flex-col"><span className="font-semibold text-sm truncate max-w-[150px]">{msg.fileName}</span><span className={`text-xs ${msg.sender === SenderType.AGENT ? 'text-blue-100' : 'text-slate-400'}`}>{msg.fileSize}</span></div>
                                  <button className="ml-auto p-1.5 rounded-lg hover:bg-black/5 transition-colors"><Download className="w-4 h-4" /></button>
                              </div>
                          ) : ( <p className="whitespace-pre-wrap">{msg.content}</p> )}
                      </div>
                      <span className={`text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ${msg.sender === SenderType.AGENT ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                </div>
               )}
            </div>
          ))}
      </div>

      {/* Input Area (Similar to v3.0 but with theme support) */}
      <div className={`p-6 bg-white border-t transition-colors ${activeThread === 'upstream' ? 'border-indigo-100 bg-indigo-50/20' : 'border-slate-100'}`}>
        {suggestions.length > 0 && activeThread === 'source' && (
            <div className="flex gap-2 overflow-x-auto pb-4">
                {suggestions.map((sug, idx) => (
                    <button key={idx} onClick={() => setInputText(sug)} className="whitespace-nowrap px-4 py-2 bg-white text-messenger-blue text-xs font-semibold rounded-xl border border-blue-100 hover:bg-messenger-blue hover:text-white transition-all transform hover:-translate-y-0.5">
                        <Sparkles className="w-3.5 h-3.5" /> {sug}
                    </button>
                ))}
            </div>
        )}
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Type a message...`}
              className="flex-1 bg-white border-2 border-slate-100 rounded-[24px] px-6 py-3 text-sm focus:border-messenger-blue/30 focus:ring-0 outline-none transition-all"
          />
          <button onClick={handleSend} disabled={!inputText.trim()} className={`p-4 text-white rounded-2xl disabled:opacity-50 transition-all ${activeThread === 'upstream' ? 'bg-indigo-600' : 'bg-messenger-blue'}`}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
