
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, MessageType, SenderType, MessageThread, Counselor, Message, Attachment } from '../types';
import { 
    Info, Paperclip, Send, FileDown, Loader2, Users, Building2, EyeOff, 
    StickyNote, MessageCircle, Calculator, FileSearch, Calendar, 
    Handshake, ArrowRightLeft, ShieldCheck, X, User, Zap, AlertTriangle, Flag,
    ChevronDown, MoreHorizontal, ShieldAlert, Mail, Clock, LayoutTemplate,
    AtSign, Trash2, CheckCircle, ChevronRight
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
  const [isExporting, setIsExporting] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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
    
    // Reset composer
    setInputText('');
    setSubject('');
    setScheduledDate('');
    setAttachments([]);
    setShowScheduler(false);
    setShowTemplates(false);
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
        name: `Document_${attachments.length + 1}.pdf`,
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
      
      {/* HEADER */}
      <div className={`z-30 transition-colors duration-500 border-b border-slate-100 ${
          activeChannel === 'team_discussion' ? 'bg-purple-50/20' : 
          activeChannel === 'upstream' ? 'bg-indigo-50/20' : 
          activeChannel === 'email' ? 'bg-amber-50/20' : 'bg-white'
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
                            activeChannel === 'email' ? 'bg-amber-600 text-white' :
                            'bg-blue-50 text-blue-600'
                        }`}>
                            {activeChannel === 'team_discussion' ? 'Team Room' : activeChannel === 'upstream' ? 'Provider Feed' : activeChannel === 'email' ? 'Email Inbox' : 'Direct Chat'}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Score: {conversation.gsScore}%</span>
                    </div>
                </div>
            </div>

            {/* CHANNEL SELECTOR */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center border border-slate-200/50">
                <button 
                    onClick={() => setActiveChannel('source')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'source' ? 'bg-white text-blue-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button 
                    onClick={() => setActiveChannel('email')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'email' ? 'bg-white text-amber-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <Mail className="w-4 h-4" /> Email
                </button>
                <button 
                    onClick={() => setActiveChannel('team_discussion')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'team_discussion' ? 'bg-white text-purple-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <ShieldCheck className="w-4 h-4" /> Team
                </button>
                <button 
                    onClick={() => setActiveChannel('upstream')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeChannel === 'upstream' ? 'bg-white text-indigo-600 shadow-md border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
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

        {/* STATUS BAR */}
        <div className={`px-6 py-2 border-t border-slate-100/50 flex items-center justify-between transition-colors ${
            activeChannel === 'team_discussion' ? 'bg-purple-100/20' : 
            activeChannel === 'upstream' ? 'bg-indigo-100/20' : 
            activeChannel === 'email' ? 'bg-amber-100/20' :
            'bg-slate-50/30'
        }`}>
            <div className="flex items-center gap-4">
                {activeChannel === 'source' ? (
                    <button 
                        onClick={() => setIsInternalMode(!isInternalMode)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${isInternalMode ? 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-200/50' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm'}`}
                    >
                        {isInternalMode ? <EyeOff className="w-3.5 h-3.5" /> : <StickyNote className="w-3.5 h-3.5" />}
                        {isInternalMode ? 'Internal Mode ON' : 'Add Case Note'}
                    </button>
                ) : activeChannel === 'email' ? (
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">Sync: {conversation.client.email}</span>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Multi-Channel Feed</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                <User className="w-3.5 h-3.5" /> Owner: {currentCounselor?.name}
            </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className={`flex-1 overflow-y-auto px-6 py-10 space-y-8 custom-scrollbar ${
          activeChannel === 'upstream' ? 'bg-slate-50/30' : 
          activeChannel === 'team_discussion' ? 'bg-slate-50/30' : 'bg-white'
      }`} ref={scrollRef}>
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center select-none">
                <div className={`p-10 rounded-[40px] mb-4 ${activeChannel === 'email' ? 'bg-amber-50' : 'bg-slate-50'}`}>
                    {activeChannel === 'email' ? <Mail className="w-16 h-16 text-amber-400" /> : <MessageCircle className="w-16 h-16 text-slate-400" />}
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs">{activeChannel === 'email' ? 'No Email History' : 'Channel Initialized'}</h3>
                <p className="text-[10px] font-bold mt-2 max-w-[200px] leading-relaxed">Start communicating with the client. All history is auto-logged for compliance.</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
                const isMe = msg.sender === SenderType.AGENT;
                const isInternal = msg.thread === 'internal';
                const isEmail = msg.type === MessageType.EMAIL;
                const author = getAuthorDetails(msg.authorId);

                if (isEmail) {
                    return (
                        <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`bg-white border border-slate-200 rounded-[32px] p-6 max-w-[80%] shadow-sm group hover:shadow-md transition-all ${isMe ? 'border-amber-200' : ''}`}>
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Mail className="w-4 h-4" /></div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 tracking-tight">{msg.subject || 'No Subject'}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">From: {isMe ? 'Stitch CRM' : conversation.client.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 uppercase">{new Date(msg.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                    {msg.content}
                                </div>
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                                        {msg.attachments.map(att => (
                                            <div key={att.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 transition-all cursor-pointer group/att">
                                                <Paperclip className="w-3 h-3 text-slate-400 group-hover/att:text-blue-500" />
                                                <span className="text-[10px] font-black text-slate-600">{att.name}</span>
                                                <span className="text-[9px] text-slate-300">({att.size})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-3.5 rounded-[24px] text-sm leading-relaxed shadow-sm group relative transition-all ${
                                    isInternal 
                                        ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-br-none' 
                                        : isMe 
                                            ? 'bg-slate-900 text-white rounded-br-none' 
                                            : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50'
                                }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[9px] font-bold text-slate-300 uppercase mt-1.5 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })
          )}
      </div>

      {/* COMPOSER AREA */}
      <div className={`p-8 border-t border-slate-100 bg-white transition-all duration-300 ${activeChannel === 'email' ? 'h-auto' : ''}`}>
        
        {/* EMAIL COMPOSER FIELDS */}
        {activeChannel === 'email' && (
            <div className="space-y-4 mb-6 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Subject:</span>
                    <input 
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder={`Regarding ${conversation.client.qualificationTarget}...`}
                        className="flex-1 bg-transparent border-none py-1 text-xs font-bold text-slate-700 outline-none"
                    />
                </div>
                
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-1">
                        {attachments.map(att => (
                            <div key={att.id} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 animate-in zoom-in">
                                <Paperclip className="w-3 h-3" />
                                <span className="text-[10px] font-black">{att.name}</span>
                                <button onClick={() => setAttachments(attachments.filter(a => a.id !== att.id))} className="p-0.5 hover:bg-blue-200 rounded-full"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        <div className={`relative transition-all ${activeChannel === 'email' ? 'ring-4 ring-amber-500/5 rounded-[32px]' : ''}`}>
            <div className={`flex items-start gap-4 p-3 rounded-[32px] border transition-all shadow-sm ${
                activeChannel === 'email' ? 'bg-white border-amber-300' : 'bg-slate-50 border-slate-200'
            }`}>
                <div className="flex flex-col gap-1 mt-1">
                    <button onClick={addAttachment} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    {activeChannel === 'email' && (
                        <button onClick={() => setShowTemplates(!showTemplates)} className={`p-2.5 rounded-full transition-all ${showTemplates ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}>
                            <LayoutTemplate className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={activeChannel === 'email' ? "Compose professional email..." : isInternalMode ? "Write a private case note..." : "Message client..."}
                    className={`flex-1 bg-transparent border-none py-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 resize-none custom-scrollbar ${activeChannel === 'email' ? 'h-32' : 'h-12'}`}
                />

                <div className="flex flex-col items-center gap-2 mt-1">
                    <button onClick={handleSend} disabled={!inputText.trim()} className={`p-4 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-20 ${
                        activeChannel === 'email' ? 'bg-amber-600 text-white shadow-amber-200/50' : 'bg-slate-900 text-white shadow-slate-200'
                    } hover:scale-105`}>
                        <Send className="w-5 h-5 fill-current" />
                    </button>
                    {activeChannel === 'email' && (
                        <button onClick={() => setShowScheduler(!showScheduler)} className={`p-2 rounded-xl transition-all ${showScheduler ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}>
                            <Clock className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* TEMPLATE PICKER */}
            {showTemplates && (
                <div className="absolute bottom-full left-0 mb-4 w-72 bg-white border border-slate-200 rounded-[28px] shadow-2xl p-4 animate-in slide-in-from-bottom-4 z-50">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smart Templates</span>
                        <button onClick={() => setShowTemplates(false)}><X className="w-4 h-4 text-slate-300 hover:text-slate-900" /></button>
                    </div>
                    <div className="space-y-2">
                        {EMAIL_TEMPLATES.map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => applyTemplate(t)}
                                className="w-full text-left p-3 hover:bg-amber-50 rounded-2xl border border-transparent hover:border-amber-100 transition-all group"
                            >
                                <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">{t.name}</p>
                                <p className="text-[10px] text-slate-400 truncate font-medium">{t.subject}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* SCHEDULER POPUP */}
            {showScheduler && (
                <div className="absolute bottom-full right-0 mb-4 w-64 bg-white border border-slate-200 rounded-[28px] shadow-2xl p-6 animate-in slide-in-from-bottom-4 z-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Schedule Email</h4>
                    <input 
                        type="datetime-local"
                        value={scheduledDate}
                        onChange={e => setScheduledDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/20 mb-4"
                    />
                    <button 
                        onClick={() => setShowScheduler(false)}
                        className="w-full py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200"
                    >
                        Apply Schedule
                    </button>
                </div>
            )}
        </div>

        {/* QUICK SHORTCUTS */}
        {activeChannel !== 'email' && (
            <div className="flex gap-2.5 mt-5 overflow-x-auto no-scrollbar pb-1">
                {[
                    { label: 'Check GTE Audit', icon: FileSearch, color: 'text-blue-500', bg: 'bg-blue-50/80' },
                    { label: 'Verify Funds', icon: Calculator, color: 'text-emerald-500', bg: 'bg-emerald-50/80' },
                    { label: 'Escalate Case', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50/80' },
                    { label: 'Peer Review', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50/80' }
                ].map((cmd, i) => (
                    <button 
                    key={i} 
                    onClick={() => onSendMessage(`${cmd.label} requested.`)} 
                    className={`flex items-center gap-2.5 px-4 py-2 ${cmd.bg} border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-slate-300 hover:bg-white transition-all shadow-sm shrink-0 active:scale-95`}
                    >
                        <cmd.icon className={`w-3.5 h-3.5 ${cmd.color}`} /> {cmd.label}
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* HAND-OFF MODAL */}
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
                            onClick={() => { onAssignCounselor(c.id); setIsHandoffOpen(false); }}
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
