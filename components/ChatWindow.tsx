import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread, Counselor, Message, Attachment } from '../types';
import { 
    Info, Paperclip, Send, FileDown, Loader2, Users, Building2, EyeOff, 
    StickyNote, MessageCircle, Calculator, FileSearch, Calendar, 
    Handshake, ArrowRightLeft, ShieldCheck, X, User, Zap, AlertTriangle, Flag,
    ChevronDown, MoreHorizontal, ShieldAlert, Mail, Clock, LayoutTemplate,
    AtSign, Trash2, CheckCircle, ChevronRight, MessageSquare
} from 'lucide-react';
import { MOCK_COUNSELORS, EMAIL_TEMPLATES } from '../constants';

interface Props {
  conversation: Conversation;
  onSendMessage: (text: string, type?: MessageType, fileData?: any, thread?: MessageThread, extra?: any) => void;
  onToggleInfo: () => void;
  onAssignCounselor: (counselorId: string) => void;
  isInfoOpen?: boolean;
}

const ChatWindow: React.FC<Props> = ({ conversation, onSendMessage, onToggleInfo, onAssignCounselor, isInfoOpen = false }) => {
  const [inputText, setInputText] = useState('');
  const [subject, setSubject] = useState('');
  const [activeChannel, setActiveChannel] = useState<MessageThread>('source');
  const [isInternalMode, setIsInternalMode] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const currentCounselor = MOCK_COUNSELORS.find(c => c.id === conversation.assignedCounselorId);

  const activeMessages = conversation.messages.filter(m => {
      if (activeChannel === 'source') return m.thread === 'source' || m.thread === 'internal';
      if (activeChannel === 'team_discussion') return m.thread === 'team_discussion';
      if (activeChannel === 'email') return m.thread === 'email';
      return m.thread === 'upstream';
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeMessages.length, conversation.id, activeChannel]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    setIsSending(true);
    
    // Artificial delay to show high-end "sending" state
    setTimeout(() => {
        let type = MessageType.TEXT;
        let thread: MessageThread = activeChannel;
        const extra: any = {};

        if (activeChannel === 'email') {
            type = MessageType.EMAIL;
            extra.subject = subject || `RE: ${conversation.client.qualificationTarget}`;
            if (scheduledDate) extra.scheduledAt = new Date(scheduledDate);
        } else if (activeChannel === 'source' && isInternalMode) {
            thread = 'internal';
        }

        onSendMessage(inputText, type, attachments, thread, extra);
        
        setIsSending(false);
        setSendSuccess(true);
        
        // Reset composer
        setInputText('');
        setSubject('');
        setScheduledDate('');
        setAttachments([]);
        setShowScheduler(false);
        setShowTemplates(false);

        // Remove success check after 2 seconds
        setTimeout(() => setSendSuccess(false), 2000);
    }, 1200);
  };

  const applyTemplate = (template: typeof EMAIL_TEMPLATES[0]) => {
    let body = template.body
        .replace('{name}', conversation.client.name)
        .replace('{qualification}', conversation.client.qualificationTarget)
        .replace('{balance}', `$${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}`);
    
    setSubject(template.subject.replace('{name}', conversation.client.name));
    setInputText(body);
    setShowTemplates(false);
  };

  const addAttachment = () => {
    const newAttach: Attachment = {
        id: `att-${Date.now()}`,
        name: `Doc_${attachments.length + 1}.pdf`,
        size: '1.2 MB',
        type: 'application/pdf'
    };
    setAttachments([...attachments, newAttach]);
  };

  const getAuthorDetails = (authorId?: string) => {
      if (!authorId) return { name: 'Agent', avatar: '', role: 'Counselor' };
      const c = MOCK_COUNSELORS.find(x => x.id === authorId);
      return c ? { name: c.name, avatar: c.avatar, role: c.role } : { name: 'Alex (Admin)', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0F172A&color=fff', role: 'Lead Agent' };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* SENDING OVERLAY: PREMIUM FEEL */}
      {isSending && (
          <div className="absolute inset-0 z-[100] glass-panel flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="relative">
                  <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-indigo-600 animate-bounce" />
                  </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-6 tracking-tight">Syncing Communication...</h3>
              <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Encrypting through Stitch Intelligence</p>
          </div>
      )}

      {sendSuccess && (
           <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10">
               <CheckCircle className="w-6 h-6" />
               <span className="font-black text-sm uppercase tracking-widest">Message Dispatched Successfully</span>
           </div>
      )}

      {/* HEADER */}
      <div className={`z-30 transition-all duration-500 border-b border-slate-100 ${
          activeChannel === 'team_discussion' ? 'bg-purple-50/20' : 
          activeChannel === 'upstream' ? 'bg-indigo-50/20' : 
          activeChannel === 'email' ? 'bg-amber-50/20' : 'bg-white'
      }`}>
        <div className="h-24 flex items-center justify-between px-8">
            <div className="flex items-center gap-5">
                <div className="relative group cursor-pointer" onClick={onToggleInfo}>
                    <img src={conversation.client.avatar} className="w-14 h-14 rounded-[24px] object-cover ring-4 ring-white shadow-xl transition-transform group-hover:scale-110" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1.5">{conversation.client.name}</h2>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                            activeChannel === 'team_discussion' ? 'bg-purple-600 text-white' : 
                            activeChannel === 'upstream' ? 'bg-indigo-600 text-white' : 
                            activeChannel === 'email' ? 'bg-amber-600 text-white' :
                            'bg-blue-600 text-white'
                        }`}>
                            {activeChannel === 'team_discussion' ? 'Team' : activeChannel === 'upstream' ? 'Partner' : activeChannel === 'email' ? 'Email' : 'Chat'}
                        </span>
                        <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GTE: {conversation.gsScore}%</span>
                    </div>
                </div>
            </div>

            {/* CHANNEL SELECTOR: PREMIUM HUD */}
            <div className="glass-panel p-1.5 rounded-[24px] flex items-center border border-slate-200 shadow-sm">
                {[
                    { id: 'source', label: 'Chat', icon: MessageCircle },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'team_discussion', label: 'Team', icon: ShieldCheck },
                    { id: 'upstream', label: 'Partner', icon: Building2 }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveChannel(tab.id as MessageThread)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'}`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <button onClick={() => setIsHandoffOpen(true)} className="p-3.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:-translate-y-0.5 border border-transparent hover:border-indigo-100" title="Handoff Case">
                    <ArrowRightLeft className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-slate-100 mx-1"></div>
                <button onClick={onToggleInfo} className={`p-3.5 rounded-2xl transition-all ${isInfoOpen ? 'bg-slate-900 text-white shadow-2xl' : 'bg-slate-50 text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-xl'}`}>
                    <Info className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* STATUS BAR */}
        <div className={`px-8 py-2.5 border-t border-slate-100/50 flex items-center justify-between transition-colors ${
            activeChannel === 'team_discussion' ? 'bg-purple-100/10' : 
            activeChannel === 'upstream' ? 'bg-indigo-100/10' : 
            activeChannel === 'email' ? 'bg-amber-100/10' :
            'bg-slate-50/50'
        }`}>
            <div className="flex items-center gap-6">
                {activeChannel === 'source' ? (
                    <button 
                        onClick={() => setIsInternalMode(!isInternalMode)}
                        className={`flex items-center gap-2.5 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isInternalMode ? 'bg-amber-500 border-amber-600 text-white shadow-xl shadow-amber-200' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:shadow-md'}`}
                    >
                        {isInternalMode ? <EyeOff className="w-3.5 h-3.5" /> : <StickyNote className="w-3.5 h-3.5" />}
                        {isInternalMode ? 'Secure Strategy Mode' : 'Add Strategic Note'}
                    </button>
                ) : activeChannel === 'email' ? (
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.15em] bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">Liaison: {conversation.client.email}</span>
                        <div className="flex gap-1">
                            {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
                        </div>
                    </div>
                ) : (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Multi-Channel Intelligence Feed</span>
                )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <User className="w-3.5 h-3.5 text-indigo-500" /> Lead: {currentCounselor?.name}
            </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className={`flex-1 overflow-y-auto px-10 py-12 space-y-10 custom-scrollbar mask-fade-bottom ${
          activeChannel === 'upstream' ? 'bg-[#F8FAFC]' : 
          activeChannel === 'team_discussion' ? 'bg-[#F8FAFC]' : 'bg-white'
      }`} ref={scrollRef}>
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center select-none animate-in zoom-in-95 duration-700">
                <div className={`p-14 rounded-[60px] mb-8 animate-float ${activeChannel === 'email' ? 'bg-amber-50' : 'bg-indigo-50'}`}>
                    {activeChannel === 'email' ? <Mail className="w-24 h-24 text-amber-500" /> : <MessageSquare className="w-24 h-24 text-indigo-500" />}
                </div>
                <h3 className="font-black uppercase tracking-[0.3em] text-sm text-slate-900">{activeChannel === 'email' ? 'Vaulting Email History' : 'Secure Thread Initialized'}</h3>
                <p className="text-xs font-bold mt-4 max-w-[300px] leading-relaxed text-slate-500 uppercase tracking-widest">Communications in this channel are encrypted and logged for agency compliance.</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
                const isMe = msg.sender === SenderType.AGENT;
                const isInternal = msg.thread === 'internal';
                const isEmail = msg.type === MessageType.EMAIL;
                const author = getAuthorDetails(msg.authorId);

                if (isEmail) {
                    return (
                        <div key={msg.id} className={`flex w-full animate-in slide-in-from-bottom-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`bg-white border border-slate-200 rounded-[40px] p-8 max-w-[85%] shadow-premium group hover:shadow-2xl transition-all duration-500 ${isMe ? 'border-amber-200' : ''}`}>
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-inner"><Mail className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{msg.subject || 'No Subject'}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">FROM: {isMe ? 'STITCH AUTOMATION' : conversation.client.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{new Date(msg.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-slate-700 leading-loose font-medium whitespace-pre-line">
                                    {msg.content}
                                </div>
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap gap-3">
                                        {msg.attachments.map(att => (
                                            <div key={att.id} className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer group/att">
                                                <Paperclip className="w-4 h-4 text-slate-400 group-hover/att:text-indigo-600" />
                                                <span className="text-[10px] font-black text-slate-700">{att.name}</span>
                                                <span className="text-[10px] font-bold text-slate-300">{att.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex w-full animate-in slide-in-from-bottom-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-4`}>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`px-7 py-4.5 rounded-[32px] text-sm font-semibold leading-relaxed shadow-soft group relative transition-all duration-300 ${
                                    isInternal 
                                        ? 'bg-amber-50 border-2 border-amber-100 text-amber-900 rounded-br-none' 
                                        : isMe 
                                            ? 'bg-slate-900 text-white rounded-br-none shadow-xl shadow-slate-900/10' 
                                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/30'
                                }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase mt-2.5 px-2 tracking-tighter">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })
          )}
      </div>

      {/* COMPOSER AREA: ULTRA SLEEK */}
      <div className={`p-10 border-t border-slate-100 bg-white transition-all duration-500 ${activeChannel === 'email' ? 'h-auto' : ''}`}>
        
        {activeChannel === 'email' && (
            <div className="space-y-4 mb-8 animate-in slide-in-from-bottom-6 duration-500">
                <div className="flex items-center gap-5 bg-slate-50/50 rounded-[20px] px-6 py-3 border border-slate-200 shadow-inner">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-20">Subject:</span>
                    <input 
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder={`Application Follow-up: ${conversation.client.qualificationTarget}`}
                        className="flex-1 bg-transparent border-none py-1 text-xs font-black text-slate-700 outline-none placeholder:text-slate-300"
                    />
                </div>
                
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 px-2">
                        {attachments.map(att => (
                            <div key={att.id} className="flex items-center gap-2.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 animate-in zoom-in shadow-sm">
                                <Paperclip className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black">{att.name}</span>
                                <button onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))} className="p-1 hover:bg-indigo-200 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        <div className={`relative transition-all duration-500 ${activeChannel === 'email' ? 'ring-[8px] ring-amber-500/5 rounded-[40px]' : ''}`}>
            <div className={`flex items-start gap-5 p-4 rounded-[40px] border transition-all duration-500 shadow-premium ${
                activeChannel === 'email' ? 'bg-white border-amber-300 shadow-amber-900/5' : 'bg-slate-50/80 border-slate-200 focus-within:bg-white focus-within:ring-[8px] focus-within:ring-indigo-500/5 focus-within:border-indigo-200 focus-within:shadow-2xl'
            }`}>
                <div className="flex flex-col gap-2 mt-2">
                    <button onClick={addAttachment} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                        <Paperclip className="w-5.5 h-5.5" />
                    </button>
                    {activeChannel === 'email' && (
                        <button onClick={() => setShowTemplates(!showTemplates)} className={`p-3 rounded-full transition-all ${showTemplates ? 'bg-amber-100 text-amber-700 shadow-inner' : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'}`}>
                            <LayoutTemplate className="w-5.5 h-5.5" />
                        </button>
                    )}
                </div>
                
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={activeChannel === 'email' ? "Compose professional email through Stitch AI..." : isInternalMode ? "Log high-level strategic insight..." : "Type response to client..."}
                    className={`flex-1 bg-transparent border-none py-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300 resize-none custom-scrollbar transition-all ${activeChannel === 'email' ? 'h-40' : 'h-14'}`}
                />

                <div className="flex flex-col items-center gap-3 mt-2">
                    <button 
                        onClick={handleSend} 
                        disabled={!inputText.trim() || isSending} 
                        className={`p-5 rounded-full shadow-2xl transition-all active:scale-90 disabled:opacity-10 group ${
                            activeChannel === 'email' ? 'bg-amber-600 text-white shadow-amber-200' : 'bg-slate-900 text-white shadow-slate-300'
                        } hover:scale-110 hover:-rotate-6`}
                    >
                        <Send className="w-6 h-6 fill-current transition-transform group-hover:translate-x-1" />
                    </button>
                    {activeChannel === 'email' && (
                        <button onClick={() => setShowTemplates(!showScheduler)} className={`p-2.5 rounded-[14px] transition-all border border-transparent ${showScheduler ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-inner' : 'text-slate-400 hover:text-amber-700 hover:bg-white hover:border-amber-100 hover:shadow-md'}`}>
                            <Clock className="w-4.5 h-4.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* TEMPLATE PICKER: MODERN POPUP */}
            {showTemplates && (
                <div className="absolute bottom-full left-0 mb-6 w-80 bg-white border border-slate-200 rounded-[40px] shadow-premium p-6 animate-in slide-in-from-bottom-8 duration-500 z-50">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Smart Templates</h4>
                        <button onClick={() => setShowTemplates(false)} className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-slate-900 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2.5">
                        {EMAIL_TEMPLATES.map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => applyTemplate(t)}
                                className="w-full text-left p-4 hover:bg-amber-50/50 rounded-[24px] border border-transparent hover:border-amber-200 transition-all group active:scale-[0.98]"
                            >
                                <p className="text-sm font-black text-slate-900 group-hover:text-amber-700">{t.name}</p>
                                <p className="text-[10px] text-slate-400 truncate font-bold uppercase mt-1 tracking-tight">{t.subject}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* QUICK ACTION CHIPS */}
        {activeChannel !== 'email' && (
            <div className="flex gap-3.5 mt-8 overflow-x-auto no-scrollbar pb-2">
                {[
                    { label: 'GTE Compliance Audit', icon: FileSearch, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
                    { label: 'Financial Verification', icon: Calculator, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
                    { label: 'Case Escalation', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100' },
                    { label: 'Peer Case Review', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100' }
                ].map((cmd, i) => (
                    <button 
                        key={i} 
                        onClick={() => onSendMessage(`${cmd.label} requested.`)} 
                        className={`flex items-center gap-3 px-6 py-3 ${cmd.bg} ${cmd.border} border rounded-[22px] text-[11px] font-black uppercase tracking-widest text-slate-700 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all shrink-0 active:scale-95`}
                    >
                        <cmd.icon className={`w-4 h-4 ${cmd.color}`} /> {cmd.label}
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;