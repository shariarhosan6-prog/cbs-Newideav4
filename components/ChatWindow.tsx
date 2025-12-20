
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread, Counselor } from '../types';
import { 
    Info, Paperclip, Send, FileDown, Loader2, Users, Building2, EyeOff, 
    StickyNote, MessageCircle, Calculator, FileSearch, Calendar, 
    Handshake, ArrowRightLeft, ShieldCheck, X, User, Zap, AlertTriangle, Flag,
    ChevronDown, MoreHorizontal
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
      
      {/* --- HEADER --- */}
      <div className={`z-30 transition-colors duration-500 border-b border-slate-100 ${
          activeChannel === 'team_discussion' ? 'bg-purple-50/30' : 
          activeChannel === 'upstream' ? 'bg-indigo-50/30' : 'bg-white'
      }`}>
        <div className="h-20 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={onToggleInfo}>
                    <img src={conversation.client.avatar} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-slate-900 text-base leading-tight">{conversation.client.name}</h2>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                             activeChannel === 'team_discussion' ? 'bg-purple-600 text-white shadow-sm' : 
                             activeChannel === 'upstream' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-blue-50 text-blue-600'
                        }`}>
                            {activeChannel === 'team_discussion' ? 'War Room' : activeChannel === 'upstream' ? 'Partner Channel' : 'Client Mode'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                           <User className="w-2.5 h-2.5" /> 
                           <span className="truncate max-w-[100px]">{currentCounselor?.name || 'Unassigned'}</span>
                        </div>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Score: {conversation.gsScore}%</span>
                    </div>
                </div>
            </div>

            {/* CHANNEL SELECTOR SEGMENT */}
            <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center border border-slate-200/50 backdrop-blur-sm">
                <button 
                    onClick={() => setActiveChannel('source')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'source' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Users className="w-3 h-3" /> Client
                </button>
                <button 
                    onClick={() => setActiveChannel('team_discussion')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'team_discussion' ? 'bg-white text-purple-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ShieldCheck className="w-3 h-3" /> Team
                </button>
                <button 
                    onClick={() => setActiveChannel('upstream')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'upstream' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Building2 className="w-3 h-3" /> Partner
                </button>
            </div>

            <div className="flex items-center gap-1.5">
                <button 
                    onClick={() => setIsHandoffOpen(true)}
                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                    title="Transfer Case"
                >
                    <ArrowRightLeft className="w-4.5 h-4.5" />
                </button>

                <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative border border-transparent hover:border-blue-100"
                    title="Export History"
                >
                    {isExporting ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <FileDown className="w-4.5 h-4.5" />}
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                <button 
                    onClick={onToggleInfo}
                    className={`p-2.5 rounded-xl transition-all border ${isInfoOpen ? 'bg-slate-900 text-white shadow-md border-slate-900' : 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white border-transparent hover:border-slate-200'}`}
                >
                    <Info className="w-4.5 h-4.5" />
                </button>
            </div>
        </div>

        {/* --- CONTEXTUAL SUB-BAR --- */}
        <div className={`px-6 py-2 flex items-center justify-between border-t border-slate-100/50 ${
            activeChannel === 'team_discussion' ? 'bg-purple-100/30' : 
            activeChannel === 'upstream' ? 'bg-indigo-100/30' : 'bg-slate-50/50'
        }`}>
            {activeChannel === 'team_discussion' ? (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            {MOCK_COUNSELORS.slice(0, 2).map(c => (
                                <img key={c.id} src={c.avatar} className="w-5 h-5 rounded-full border border-white ring-1 ring-purple-200" title={c.name} />
                            ))}
                        </div>
                        <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Team Active</span>
                    </div>
                </div>
            ) : activeChannel === 'source' ? (
                <button 
                    onClick={() => setIsInternalMode(!isInternalMode)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${isInternalMode ? 'bg-amber-500 border-amber-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                >
                    {isInternalMode ? <EyeOff className="w-3 h-3" /> : <StickyNote className="w-3 h-3" />}
                    {isInternalMode ? 'Internal Mode ON' : 'Private Case Note'}
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Upstream Communications Hub</span>
                </div>
            )}

            {/* QUICK HEADER ACTIONS */}
            <div className="flex gap-3">
                {activeChannel === 'team_discussion' && (
                    <>
                    <button onClick={() => handleSend("🚩 Flagging potential GTE risk.")} className="text-[8px] font-black uppercase text-red-600 flex items-center gap-1 hover:underline">
                        <AlertTriangle className="w-2.5 h-2.5" /> Flag Risk
                    </button>
                    <button onClick={() => handleSend("⚠️ Requesting Compliance Review.")} className="text-[8px] font-black uppercase text-purple-600 flex items-center gap-1 hover:underline">
                        <ShieldCheck className="w-2.5 h-2.5" /> Request Audit
                    </button>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className={`flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar transition-colors duration-500 ${
          activeChannel === 'upstream' ? 'bg-slate-50' : 
          activeChannel === 'team_discussion' ? 'bg-slate-50' : 'bg-white'
      }`} ref={scrollRef}>
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center select-none">
                <div className={`p-8 rounded-[40px] mb-4 ${activeChannel === 'team_discussion' ? 'bg-purple-100/50' : 'bg-slate-100'}`}>
                    <MessageCircle className={`w-16 h-16 ${activeChannel === 'team_discussion' ? 'text-purple-400' : 'text-slate-400'}`} />
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs">No Messages Yet</h3>
                <p className="text-[10px] font-bold mt-1 max-w-[200px]">Secure channel initiated. Start the conversation above.</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
                const isInternal = msg.thread === 'internal';
                const isTeamChat = msg.thread === 'team_discussion';
                const isSystem = msg.type === MessageType.SYSTEM;
                const author = getAuthorDetails(msg.authorId);
                const isMe = msg.sender === SenderType.AGENT;

                if (isSystem) {
                    return (
                        <div key={msg.id} className="flex justify-center my-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                <Zap className="w-3 h-3 text-amber-500" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{msg.content}</span>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                            
                            {/* AVATAR FOR OTHERS IN TEAM/UPSTREAM */}
                            {!isMe && (isTeamChat || activeChannel === 'upstream') && (
                                <img src={author.avatar || 'https://ui-avatars.com/api/?name=User'} className="w-7 h-7 rounded-lg shadow-sm border border-white mb-5 shrink-0" alt="" />
                            )}

                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {/* SENDER NAME TAGS */}
                                {(isInternal || isTeamChat) && (
                                    <div className={`flex items-center gap-1.5 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${isInternal ? 'text-amber-600' : 'text-purple-600'}`}>
                                            {isInternal ? 'SECURE CASE NOTE' : author.name}
                                        </span>
                                        {isTeamChat && <span className="text-[7px] font-bold text-slate-400 bg-slate-100 px-1 py-0.5 rounded-md uppercase leading-none">{author.role}</span>}
                                    </div>
                                )}

                                {/* BUBBLE STYLING */}
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm group relative ${
                                    isInternal 
                                        ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-br-none' 
                                        : isTeamChat
                                            ? 'bg-purple-900 text-white rounded-br-none shadow-purple-900/10 border border-purple-800'
                                            : isMe 
                                                ? activeChannel === 'upstream' ? 'bg-indigo-900 text-white rounded-br-none' : 'bg-slate-900 text-white rounded-br-none' 
                                                : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50'
                                }`}>
                                    {msg.content}
                                    
                                    {/* MESSAGE TIME HOVER */}
                                    <div className={`absolute bottom-0 ${isMe ? 'right-full mr-2' : 'left-full ml-2'} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                                        <span className="text-[8px] font-black text-slate-300 uppercase">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* VISIBLE TIME FOR NON-HOVER */}
                                <span className="text-[8px] font-bold text-slate-300 uppercase mt-1 px-1 select-none">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })
          )}
      </div>

      {/* --- INPUT CONSOLE --- */}
      <div className={`p-6 border-t border-slate-100 transition-colors duration-500 ${
          isInternalMode && activeChannel === 'source' ? 'bg-amber-50/50' : 
          activeChannel === 'team_discussion' ? 'bg-purple-50/50' : 
          activeChannel === 'upstream' ? 'bg-indigo-50/50' : 'bg-white'
      }`}>
        <div className={`flex items-center gap-3 p-2 rounded-[24px] border transition-all shadow-sm ${
            isInternalMode && activeChannel === 'source' ? 'bg-white border-amber-300 ring-4 ring-amber-500/5' : 
            activeChannel === 'team_discussion' ? 'bg-white border-purple-300 ring-4 ring-purple-500/5' :
            activeChannel === 'upstream' ? 'bg-white border-indigo-300 ring-4 ring-indigo-500/5' :
            'bg-slate-50 border-slate-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-200'
        }`}>
          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
              placeholder={
                  activeChannel === 'upstream' ? "Coordinate with Providers..." : 
                  activeChannel === 'team_discussion' ? "Discuss strategy with the team..." :
                  isInternalMode ? "Write a private case summary..." : "Message Client..."
              }
              className="flex-1 bg-transparent border-none py-2 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300"
          />

          <button onClick={() => handleSend()} disabled={!inputText.trim()} className={`p-2.5 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-20 ${
              isInternalMode && activeChannel === 'source' ? 'bg-amber-500 text-white shadow-amber-200' : 
              activeChannel === 'team_discussion' ? 'bg-purple-600 text-white shadow-purple-200' :
              activeChannel === 'upstream' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-blue-600 text-white shadow-blue-200'
          } hover:scale-105`}>
            <Send className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* INTELLIGENT SHORTCUTS */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {[
                { label: 'Check GTE', icon: FileSearch, color: 'text-blue-500', bg: 'bg-blue-50/50' },
                { label: 'Peer Audit', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50/50' },
                { label: 'Review Handover', icon: ArrowRightLeft, color: 'text-indigo-500', bg: 'bg-indigo-50/50' },
                { label: 'Verify Funds', icon: Calculator, color: 'text-emerald-500', bg: 'bg-emerald-50/50' }
            ].map((cmd, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(`${cmd.label} requested.`)} 
                  className={`flex items-center gap-2 px-3 py-1.5 ${cmd.bg} border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-400 hover:bg-white transition-all shadow-sm shrink-0 active:scale-95`}
                >
                    <cmd.icon className={`w-3 h-3 ${cmd.color}`} /> {cmd.label}
                </button>
            ))}
        </div>
      </div>

      {/* --- HAND-OFF MODAL --- */}
      {isHandoffOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl border border-slate-100 p-8 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                              <ArrowRightLeft className="w-5 h-5 text-indigo-600" /> Case Transfer
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assign to a specialized Counselor</p>
                      </div>
                      <button onClick={() => setIsHandoffOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto custom-scrollbar pr-1 mb-6">
                      {MOCK_COUNSELORS.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => handleHandoff(c.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-3xl border transition-all group ${conversation.assignedCounselorId === c.id ? 'bg-blue-50 border-blue-200 pointer-events-none opacity-50' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-400 hover:shadow-lg'}`}
                          >
                              <div className="flex items-center gap-4">
                                  <img src={c.avatar} className="w-10 h-10 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                  <div className="text-left">
                                      <p className="text-sm font-bold text-slate-900 leading-tight">{c.name}</p>
                                      <p className="text-[9px] font-black text-slate-400 uppercase">{c.role}</p>
                                  </div>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${c.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setIsHandoffOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Cancel</button>
              </div>
          </div>
      )}
    </div>
  );
};

const CheckSquare = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>
);

export default ChatWindow;
