
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread, Counselor } from '../types';
import { 
    Info, Paperclip, Send, FileDown, Loader2, Users, Building2, EyeOff, 
    StickyNote, MessageCircle, Calculator, FileSearch, Calendar, 
    Handshake, ArrowRightLeft, ShieldCheck, X, User
} from 'lucide-react';
import { MOCK_COUNSELORS } from '../constants';

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
  const [isExporting, setIsExporting] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Counselor assigned to this conversation
  const currentCounselor = MOCK_COUNSELORS.find(c => c.id === conversation.assignedCounselorId);

  const activeMessages = conversation.messages.filter(m => {
      if (activeChannel === 'source') return m.thread === 'source' || m.thread === 'internal';
      if (activeChannel === 'team_discussion') return m.thread === 'team_discussion';
      return m.thread === 'upstream';
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeMessages.length, conversation.id, activeChannel]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    let thread: MessageThread = activeChannel;
    if (activeChannel === 'source') {
        thread = isInternalMode ? 'internal' : 'source';
    }
    onSendMessage(inputText, MessageType.TEXT, undefined, thread);
    setInputText('');
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
        const blob = new Blob([JSON.stringify(conversation.messages, null, 2)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chat_Export_${conversation.client.name.replace(' ', '_')}.pdf`;
        a.click();
        setIsExporting(false);
    }, 2000);
  };

  const handleHandoff = (counselorId: string) => {
    onAssignCounselor(counselorId);
    setIsHandoffOpen(false);
    // Optionally auto-switch to team discussion to post a handover summary
    setActiveChannel('team_discussion');
    onSendMessage(`File handed over to ${MOCK_COUNSELORS.find(c => c.id === counselorId)?.name}. Previous owner: Alex (Admin)`, MessageType.SYSTEM, undefined, 'team_discussion');
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
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                           <User className="w-2 h-2" /> {currentCounselor?.name || 'Unassigned'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-100 mr-2">
                    <button 
                        onClick={() => setActiveChannel('source')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'source' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Users className="w-3.5 h-3.5" /> Client
                    </button>
                    <button 
                        onClick={() => setActiveChannel('upstream')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'upstream' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Building2 className="w-3.5 h-3.5" /> Providers
                    </button>
                    <button 
                        onClick={() => setActiveChannel('team_discussion')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'team_discussion' ? 'bg-white text-purple-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" /> Team Chat
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-2"></div>

                <button 
                    onClick={() => setIsHandoffOpen(true)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                    title="Agent Hand-off"
                >
                    <ArrowRightLeft className="w-5 h-5" />
                </button>

                <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all relative"
                    title="Export PDF"
                >
                    {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
                </button>

                <button 
                    onClick={onToggleInfo}
                    className={`p-3 rounded-2xl transition-all ${isInfoOpen ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}
                >
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* SUB-HEADER CONTEXT (Internal Mode Toggle) */}
        {activeChannel === 'source' && (
            <div className="flex justify-center pb-2 bg-slate-50/50">
                <button 
                    onClick={() => setIsInternalMode(!isInternalMode)}
                    className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${isInternalMode ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                >
                    {isInternalMode ? <EyeOff className="w-3.5 h-3.5" /> : <StickyNote className="w-3.5 h-3.5" />}
                    {isInternalMode ? 'Mode: Counselor Note (Private)' : 'Add Private Case Note'}
                </button>
            </div>
        )}

        {activeChannel === 'team_discussion' && (
            <div className="flex justify-center pb-2 bg-purple-50/50 border-b border-purple-100">
                <p className="text-[9px] font-black text-purple-600 uppercase tracking-[0.2em] flex items-center gap-2">
                   <ShieldCheck className="w-3 h-3" /> Secure Team-Only Discussion Thread
                </p>
            </div>
        )}
      </div>

      {/* HAND-OFF MODAL OVERLAY */}
      {isHandoffOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl border border-slate-100 p-10 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                              <ArrowRightLeft className="w-6 h-6 text-indigo-600" /> Case Hand-off
                          </h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select a counselor to take over this file</p>
                      </div>
                      <button onClick={() => setIsHandoffOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-8">
                      {MOCK_COUNSELORS.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => handleHandoff(c.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all group ${conversation.assignedCounselorId === c.id ? 'bg-blue-50 border-blue-200 pointer-events-none opacity-50' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1'}`}
                          >
                              <div className="flex items-center gap-4">
                                  <img src={c.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                  <div className="text-left">
                                      <p className="text-sm font-black text-slate-900 leading-tight">{c.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase">{c.role} • {c.activeDeals} Load</p>
                                  </div>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${c.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                          </button>
                      ))}
                  </div>

                  <button 
                    onClick={() => setIsHandoffOpen(false)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                  >
                      Cancel Hand-off
                  </button>
              </div>
          </div>
      )}

      {/* MESSAGES AREA */}
      <div className={`flex-1 overflow-y-auto px-8 py-10 space-y-8 custom-scrollbar ${
          activeChannel === 'upstream' ? 'bg-indigo-50/10' : 
          activeChannel === 'team_discussion' ? 'bg-purple-50/10' : 'bg-white'
      }`} ref={scrollRef}>
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                <MessageCircle className="w-16 h-16 mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">No activity in this channel yet</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
                const isInternal = msg.thread === 'internal';
                const isTeamChat = msg.thread === 'team_discussion';
                const isSystem = msg.type === MessageType.SYSTEM;

                if (isSystem) {
                    return (
                        <div key={msg.id} className="flex justify-center">
                            <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                                {msg.content}
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex w-full ${msg.sender === SenderType.AGENT ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[75%] ${msg.sender === SenderType.AGENT ? 'flex-row-reverse' : 'flex-row'} gap-4 items-end`}>
                            <div className={`flex flex-col ${msg.sender === SenderType.AGENT ? 'items-end' : 'items-start'}`}>
                                {(isInternal || isTeamChat) && (
                                    <span className={`text-[8px] font-black uppercase mb-1 flex items-center gap-1 ml-1 ${isInternal ? 'text-amber-600' : 'text-purple-600'}`}>
                                        {isInternal ? <EyeOff className="w-2.5 h-2.5" /> : <ShieldCheck className="w-2.5 h-2.5" />}
                                        {isInternal ? 'Private Case Note' : `Team: ${msg.authorName || 'Agent'}`}
                                    </span>
                                )}
                                <div className={`px-5 py-3.5 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                                    isInternal 
                                        ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-br-none' 
                                        : isTeamChat
                                            ? 'bg-purple-900 text-white rounded-br-none border border-purple-800'
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
      <div className={`p-8 border-t border-slate-100 transition-colors duration-300 ${
          isInternalMode && activeChannel === 'source' ? 'bg-amber-50' : 
          activeChannel === 'team_discussion' ? 'bg-purple-50' : 'bg-white'
      }`}>
        <div className={`flex items-center gap-4 p-2.5 rounded-[32px] border transition-all ${
            isInternalMode && activeChannel === 'source' ? 'bg-white border-amber-300 ring-4 ring-amber-500/5' : 
            activeChannel === 'team_discussion' ? 'bg-white border-purple-300 ring-4 ring-purple-500/5' :
            'bg-slate-50 border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5'
        }`}>
          <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-full transition-all shadow-sm">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
              placeholder={
                  activeChannel === 'upstream' ? "Communicate with Providers..." : 
                  activeChannel === 'team_discussion' ? "Discuss case with fellow agents..." :
                  isInternalMode ? "Add a private counselor note..." : "Reply to Student / Sub-Agent..."
              }
              className="flex-1 bg-transparent border-none py-3 text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
          />

          <div className="flex items-center gap-2">
              <button onClick={handleSend} disabled={!inputText.trim()} className={`p-3.5 rounded-full shadow-xl transition-all active:scale-95 ${
                  isInternalMode && activeChannel === 'source' ? 'bg-amber-500 text-white shadow-amber-200' : 
                  activeChannel === 'team_discussion' ? 'bg-purple-600 text-white shadow-purple-200' :
                  activeChannel === 'upstream' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-blue-600 text-white shadow-blue-200'
              } hover:scale-105 disabled:opacity-30 disabled:hover:scale-100`}>
                <Send className="w-5 h-5 fill-current" />
              </button>
          </div>
        </div>

        {/* COUNSELOR QUICK SHORTCUTS */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {[
                { label: 'Review Handover', icon: ArrowRightLeft },
                { label: 'Audit SOP Version', icon: FileSearch },
                { label: 'Check VFS Slot', icon: Calendar },
                { label: 'Ask Peer Help', icon: Handshake }
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
