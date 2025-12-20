
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread, Counselor } from '../types';
import { 
    Info, Paperclip, Send, FileDown, Loader2, Users, Building2, EyeOff, 
    StickyNote, MessageCircle, Calculator, FileSearch, Calendar, 
    Handshake, ArrowRightLeft, ShieldCheck, X, User, Zap, AlertTriangle, Flag,
    ChevronDown, MoreHorizontal, ShieldAlert
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
  
  const currentCounselor = MOCK_COUNSELORS.find(c => c.id === conversation.assignedCounselorId);

  const activeMessages = conversation.messages.filter(m => {
      if (activeChannel === 'source') return m.thread === 'source' || m.thread === 'internal';
      if (activeChannel === 'team_discussion') return m.thread === 'team_discussion';
      return m.thread === 'upstream';
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeMessages.length, conversation.id, activeChannel]);

  const handleSend = (overrideText?: string) => {
    const text = overrideText || inputText;
    if (!text.trim()) return;
    let thread: MessageThread = activeChannel;
    if (activeChannel === 'source') {
        thread = isInternalMode ? 'internal' : 'source';
    }
    onSendMessage(text, MessageType.TEXT, undefined, thread);
    if (!overrideText) setInputText('');
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
    setActiveChannel('team_discussion');
    onSendMessage(`File handed over to ${MOCK_COUNSELORS.find(c => c.id === counselorId)?.name}. Previous owner: Alex (Admin)`, MessageType.SYSTEM, undefined, 'team_discussion');
  };

  const getAuthorDetails = (authorId?: string) => {
      if (!authorId) return { name: 'Agent', avatar: '', role: 'Counselor' };
      const c = MOCK_COUNSELORS.find(x => x.id === authorId);
      return c ? { name: c.name, avatar: c.avatar, role: c.role } : { name: 'Alex (Admin)', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0F172A&color=fff', role: 'Lead Agent' };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* HEADER: REFINED FOR CLARITY */}
      <div className={`z-30 transition-colors duration-500 border-b border-slate-100 ${
          activeChannel === 'team_discussion' ? 'bg-purple-50/20' : 
          activeChannel === 'upstream' ? 'bg-indigo-50/20' : 'bg-white'
      }`}>
        <div className="h-20 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={onToggleInfo}>
                    <img src={conversation.client.avatar} className="w-12 h-12 rounded-[20px] object-cover ring-4 ring-white shadow-sm transition-transform group-hover:scale-105" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                    <h2 className="font-bold text-slate-900 text-lg leading-tight">{conversation.client.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                            activeChannel === 'team_discussion' ? 'bg-purple-600 text-white' : 
                            activeChannel === 'upstream' ? 'bg-indigo-600 text-white' : 
                            'bg-blue-50 text-blue-600'
                        }`}>
                            {activeChannel === 'team_discussion' ? 'Team Room' : activeChannel === 'upstream' ? 'Provider Feed' : 'Direct Chat'}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Score: {conversation.gsScore}%</span>
                    </div>
                </div>
            </div>

            {/* CHANNEL SELECTOR: MODERN SEGMENTED STYLE */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center border border-slate-200/50">
                <button 
                    onClick={() => setActiveChannel('source')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'source' ? 'bg-white text-blue-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <Users className="w-4 h-4" /> Client
                </button>
                <button 
                    onClick={() => setActiveChannel('team_discussion')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'team_discussion' ? 'bg-white text-purple-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <ShieldCheck className="w-4 h-4" /> Team
                </button>
                <button 
                    onClick={() => setActiveChannel('upstream')}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'upstream' ? 'bg-white text-indigo-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <Building2 className="w-4 h-4" /> Partner
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => setIsHandoffOpen(true)} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all hover:bg-white hover:shadow-sm" title="Handoff Case">
                    <ArrowRightLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button onClick={onToggleInfo} className={`p-3 rounded-2xl transition-all ${isInfoOpen ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-white hover:text-slate-900'}`}>
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* CONTEXTUAL STATUS BAR */}
        <div className={`px-6 py-2 border-t border-slate-100/50 flex items-center justify-between transition-colors ${
            activeChannel === 'team_discussion' ? 'bg-purple-100/20' : 
            activeChannel === 'upstream' ? 'bg-indigo-100/20' : 
            'bg-slate-50/30'
        }`}>
            <div className="flex items-center gap-4">
                {activeChannel === 'source' ? (
                    <button 
                        onClick={() => setIsInternalMode(!isInternalMode)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${isInternalMode ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-200/50' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm'}`}
                    >
                        {isInternalMode ? <EyeOff className="w-3.5 h-3.5" /> : <StickyNote className="w-3.5 h-3.5" />}
                        {isInternalMode ? 'Secure Note Mode ON' : 'Add Secure Case Note'}
                    </button>
                ) : activeChannel === 'team_discussion' ? (
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            {MOCK_COUNSELORS.slice(0, 2).map(c => (
                                <img key={c.id} src={c.avatar} className="w-5 h-5 rounded-full border border-white ring-1 ring-purple-200" title={c.name} />
                            ))}
                        </div>
                        <span className="text-[9px] font-black text-purple-600 uppercase tracking-[0.2em]">Active Team Discussion</span>
                    </div>
                ) : (
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" /> Direct Provider Liaison Feed
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                <User className="w-3.5 h-3.5" /> Owner: {currentCounselor?.name}
            </div>
        </div>
      </div>

      {/* MESSAGES AREA: SPACIOUS & CLEAN */}
      <div className={`flex-1 overflow-y-auto px-6 py-10 space-y-8 custom-scrollbar ${
          activeChannel === 'upstream' ? 'bg-slate-50/30' : 
          activeChannel === 'team_discussion' ? 'bg-slate-50/30' : 'bg-white'
      }`} ref={scrollRef}>
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center select-none">
                <div className={`p-10 rounded-[40px] mb-4 ${activeChannel === 'team_discussion' ? 'bg-purple-50' : 'bg-slate-50'}`}>
                    <MessageCircle className={`w-16 h-16 ${activeChannel === 'team_discussion' ? 'text-purple-400' : 'text-slate-400'}`} />
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs">Secure Channel Initialized</h3>
                <p className="text-[10px] font-bold mt-2 max-w-[200px] leading-relaxed">Start the discussion. All communications here are encrypted and archived for compliance.</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
                const isMe = msg.sender === SenderType.AGENT;
                const isInternal = msg.thread === 'internal';
                const isTeamChat = msg.thread === 'team_discussion';
                const isSystem = msg.type === MessageType.SYSTEM;
                const author = getAuthorDetails(msg.authorId);

                if (isSystem) {
                    return (
                        <div key={msg.id} className="flex justify-center my-6 scale-95">
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{msg.content}</span>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                            
                            {!isMe && (isTeamChat || activeChannel === 'upstream') && (
                                <img src={author.avatar || 'https://ui-avatars.com/api/?name=User'} className="w-8 h-8 rounded-xl shadow-md mb-6 shrink-0" alt="" />
                            )}

                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {(isInternal || isTeamChat) && (
                                    <div className={`flex items-center gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${isInternal ? 'text-amber-600' : 'text-purple-600'}`}>
                                            {isInternal ? 'SECURE CASE NOTE' : author.name}
                                        </span>
                                        {isTeamChat && <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">{author.role}</span>}
                                    </div>
                                )}

                                <div className={`px-5 py-3.5 rounded-[24px] text-sm leading-relaxed shadow-sm group relative transition-all ${
                                    isInternal 
                                        ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-br-none shadow-amber-200/5' 
                                        : isTeamChat
                                            ? 'bg-purple-900 text-white rounded-br-none border border-purple-800 shadow-purple-900/10'
                                            : isMe 
                                                ? activeChannel === 'upstream' ? 'bg-indigo-900 text-white rounded-br-none' : 'bg-slate-900 text-white rounded-br-none' 
                                                : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50'
                                }`}>
                                    {msg.content}
                                    <div className={`absolute bottom-0 ${isMe ? 'right-full mr-2' : 'left-full ml-2'} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                                        <span className="text-[9px] font-black text-slate-300 uppercase">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                                
                                <span className="text-[9px] font-bold text-slate-300 uppercase mt-1.5 px-1 select-none">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })
          )}
      </div>

      {/* CONSOLE AREA: INTEGRATED & MINIMAL */}
      <div className={`p-8 border-t border-slate-100 transition-colors duration-500 ${
          isInternalMode && activeChannel === 'source' ? 'bg-amber-50/50' : 
          activeChannel === 'team_discussion' ? 'bg-purple-50/50' : 
          activeChannel === 'upstream' ? 'bg-indigo-50/50' : 'bg-white'
      }`}>
        <div className={`flex items-center gap-4 p-2.5 rounded-[28px] border transition-all shadow-sm ${
            isInternalMode && activeChannel === 'source' ? 'bg-white border-amber-300 ring-4 ring-amber-500/10 shadow-lg shadow-amber-200/20' : 
            activeChannel === 'team_discussion' ? 'bg-white border-purple-300 ring-4 ring-purple-500/10 shadow-lg shadow-purple-200/20' :
            activeChannel === 'upstream' ? 'bg-white border-indigo-300 ring-4 ring-indigo-500/10 shadow-lg shadow-indigo-200/20' :
            'bg-slate-50 border-slate-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-200'
        }`}>
          <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
              placeholder={
                  activeChannel === 'upstream' ? "Coordinate with Providers..." : 
                  activeChannel === 'team_discussion' ? "Collaborate with the case team..." :
                  isInternalMode ? "Write a private case insight..." : "Message Client..."
              }
              className="flex-1 bg-transparent border-none py-2 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300"
          />

          <button onClick={() => handleSend()} disabled={!inputText.trim()} className={`p-3 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-20 shrink-0 ${
              isInternalMode && activeChannel === 'source' ? 'bg-amber-500 text-white shadow-amber-200/50' : 
              activeChannel === 'team_discussion' ? 'bg-purple-600 text-white shadow-purple-200/50' :
              activeChannel === 'upstream' ? 'bg-indigo-600 text-white shadow-indigo-200/50' : 'bg-blue-600 text-white shadow-blue-200/50'
          } hover:scale-105`}>
            <Send className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* QUICK SHORTCUTS: CLEAN CHIPS */}
        <div className="flex gap-2.5 mt-5 overflow-x-auto no-scrollbar pb-1">
            {[
                { label: 'Check GTE Audit', icon: FileSearch, color: 'text-blue-500', bg: 'bg-blue-50/80' },
                { label: 'Verify Funds', icon: Calculator, color: 'text-emerald-500', bg: 'bg-emerald-50/80' },
                { label: 'Escalate Case', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50/80' },
                { label: 'Peer Review', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50/80' }
            ].map((cmd, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(`${cmd.label} requested.`)} 
                  className={`flex items-center gap-2.5 px-4 py-2 ${cmd.bg} border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-slate-300 hover:bg-white transition-all shadow-sm shrink-0 active:scale-95`}
                >
                    <cmd.icon className={`w-3.5 h-3.5 ${cmd.color}`} /> {cmd.label}
                </button>
            ))}
        </div>
      </div>

      {/* HAND-OFF MODAL: CONSISTENT DESIGN */}
      {isHandoffOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl border border-slate-100 p-10 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-start mb-8">
                      <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                              <ArrowRightLeft className="w-6 h-6 text-indigo-600" /> Transfer File
                          </h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">Assign to a specialized Counselor</p>
                      </div>
                      <button onClick={() => setIsHandoffOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-2 mb-8">
                      {MOCK_COUNSELORS.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => handleHandoff(c.id)}
                            className={`w-full flex items-center justify-between p-5 rounded-[28px] border transition-all group ${conversation.assignedCounselorId === c.id ? 'bg-blue-50 border-blue-200 pointer-events-none opacity-50' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5'}`}
                          >
                              <div className="flex items-center gap-4">
                                  <img src={c.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                                  <div className="text-left">
                                      <p className="text-sm font-bold text-slate-900 leading-tight">{c.name}</p>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.role}</p>
                                  </div>
                              </div>
                              <div className={`w-2.5 h-2.5 rounded-full ${c.status === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></div>
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setIsHandoffOpen(false)} className="w-full py-4.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Cancel Transfer</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default ChatWindow;
