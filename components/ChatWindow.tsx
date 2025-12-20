
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread, ApplicationStage } from '../types';
import { 
    Info, Paperclip, Mic, Send, Sparkles, FileText, Download, Phone, Video, 
    ChevronDown, MoreVertical, CheckCircle2, Zap, Image as ImageIcon, Loader2,
    ShieldCheck, Building2, ExternalLink, AlertTriangle, Clock, Fingerprint, Stethoscope, 
    Calculator, Star, Search, MessageCircle, Users, FileSearch, Calendar, EyeOff, StickyNote,
    Handshake
} from 'lucide-react';
import { getSmartSuggestions, fastRewrite, analyzeUploadedImage } from '../services/geminiService';

interface Props {
  conversation: Conversation;
  onSendMessage: (text: string, type?: MessageType, fileData?: { name: string, size: string }, thread?: MessageThread) => void;
  onToggleInfo: () => void;
  onAssignCounselor: (counselorId: string) => void;
  isInfoOpen?: boolean;
}

const ChatWindow: React.FC<Props> = ({ conversation, onSendMessage, onToggleInfo, onAssignCounselor, isInfoOpen = false }) => {
  const [inputText, setInputText] = useState('');
  const [activeChannel, setActiveChannel] = useState<MessageThread>('source');
  const [isInternalMode, setIsInternalMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Show messages for the active channel (Client/Sub-Agent or Provider)
  const activeMessages = conversation.messages.filter(m => {
      if (activeChannel === 'source') return m.thread === 'source' || m.thread === 'internal';
      return m.thread === 'upstream';
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeMessages.length, conversation.id, activeChannel]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    // For Client channel: can be 'source' or 'internal'. For Provider channel: 'upstream'.
    const thread = activeChannel === 'source' ? (isInternalMode ? 'internal' : 'source') : 'upstream';
    onSendMessage(inputText, MessageType.TEXT, undefined, thread);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* CHANNEL SELECTOR HEADER */}
      <div className="bg-white border-b border-slate-100 z-30 shadow-sm">
        <div className="h-20 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img src={conversation.client.avatar} className="w-12 h-12 rounded-[18px] object-cover ring-4 ring-slate-50" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h2 className="font-black text-slate-900 text-lg leading-tight">{conversation.client.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">GS: {conversation.gsScore || 85}%</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stage: {conversation.currentStage.replace(/_/g, ' ')}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Unified Channel Switcher: Only 2 options */}
                <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-100 mr-2">
                    <button 
                        onClick={() => setActiveChannel('source')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'source' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Users className="w-3.5 h-3.5" /> Client & Sub-Agent
                    </button>
                    <button 
                        onClick={() => setActiveChannel('upstream')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'upstream' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Building2 className="w-3.5 h-3.5" /> Providers (Uni/RTO)
                    </button>
                </div>

                <button 
                    onClick={onToggleInfo}
                    className={`p-3 rounded-2xl transition-all ${isInfoOpen ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* INTERNAL TOGGLE (Only visible in Client channel) */}
        {activeChannel === 'source' && (
            <div className="flex justify-center pb-2 bg-slate-50/50">
                <button 
                    onClick={() => setIsInternalMode(!isInternalMode)}
                    className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${isInternalMode ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                >
                    {isInternalMode ? <EyeOff className="w-3.5 h-3.5" /> : <StickyNote className="w-3.5 h-3.5" />}
                    {isInternalMode ? 'Mode: Private Counselor Note' : 'Add Internal Note'}
                </button>
            </div>
        )}
      </div>

      {/* MESSAGES AREA */}
      <div className={`flex-1 overflow-y-auto px-8 py-10 space-y-8 custom-scrollbar ${activeChannel === 'upstream' ? 'bg-indigo-50/10' : 'bg-white'}`} ref={scrollRef}>
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                <MessageCircle className="w-16 h-16 mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">No activity in this channel yet</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
                const isInternal = msg.thread === 'internal';
                return (
                    <div key={msg.id} className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[75%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-4 items-end`}>
                            <div className={`flex flex-col ${msg.sender === SenderType.AGENT ? 'items-end' : 'items-start'}`}>
                                {isInternal && (
                                    <span className="text-[8px] font-black text-amber-600 uppercase mb-1 flex items-center gap-1 ml-1">
                                        <EyeOff className="w-2.5 h-2.5" /> Internal Note
                                    </span>
                                )}
                                <div className={`px-5 py-3.5 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                                    isInternal 
                                        ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-br-none' 
                                        : msg.sender === SenderType.AGENT 
                                            ? activeChannel === 'upstream' ? 'bg-indigo-900 text-white rounded-br-none' : 'bg-slate-900 text-white rounded-br-none' 
                                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50'
                                }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] font-bold text-slate-300 uppercase mt-1 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })
          )}
      </div>

      {/* INTELLIGENT INPUT CONSOLE */}
      <div className={`p-8 border-t border-slate-100 transition-colors duration-300 ${isInternalMode && activeChannel === 'source' ? 'bg-amber-50' : 'bg-white'}`}>
        <div className={`flex items-center gap-4 p-2.5 rounded-[32px] border transition-all ${isInternalMode && activeChannel === 'source' ? 'bg-white border-amber-300 ring-4 ring-amber-500/5' : 'bg-slate-50 border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5'}`}>
          <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-all shadow-sm">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
              placeholder={activeChannel === 'upstream' ? "Communicate with RTO Admissions..." : isInternalMode ? "Add a private case note..." : "Reply to Student / Sub-Agent..."}
              className="flex-1 bg-transparent border-none py-3 text-sm font-bold text-slate-700 outline-none"
          />

          <div className="flex items-center gap-2">
              <button onClick={handleSend} disabled={!inputText.trim()} className={`p-3.5 rounded-full shadow-xl transition-all active:scale-95 ${
                  isInternalMode && activeChannel === 'source' ? 'bg-amber-500 text-white shadow-amber-200' : 
                  activeChannel === 'upstream' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-blue-600 text-white shadow-blue-200'
              } hover:scale-105`}>
                <Send className="w-5 h-5 fill-current" />
              </button>
          </div>
        </div>

        {/* COUNSELOR QUICK SHORTCUTS */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {[
                { label: 'Verify Statement', icon: Calculator },
                { label: 'Audit SOP Version', icon: FileSearch },
                { label: 'Check VFS Slot', icon: Calendar },
                { label: 'Notify Sub-Agent', icon: Handshake }
            ].map((cmd, i) => (
                <button key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm shrink-0">
                    <cmd.icon className="w-3 h-3" /> {cmd.label}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
