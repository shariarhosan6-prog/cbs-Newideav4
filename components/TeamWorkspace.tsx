
import React, { useState, useRef, useEffect } from 'react';
import { 
    Hash, Lock, MessageSquare, Send, Paperclip, Search, 
    MoreHorizontal, UserPlus, Info, AtSign, Zap, 
    Link as LinkIcon, User, Circle, ShieldCheck, 
    CheckCircle2, Folder, X, Smile, Phone, Video,
    Plus, ChevronRight
} from 'lucide-react';
import { Counselor, Message, TeamChannel, SenderType, MessageType, Conversation } from '../types';

interface Props {
    staff: Counselor[];
    conversations: Conversation[];
    onSendMessage: (channelId: string, text: string, linkedCaseId?: string) => void;
}

const MOCK_CHANNELS: TeamChannel[] = [
    { id: 'ch-general', name: 'general', type: 'public', description: 'Company-wide announcements and discussion', unreadCount: 0, members: [] },
    { id: 'ch-rpl', name: 'rpl-department', type: 'public', description: 'RPL specific compliance and strategy', unreadCount: 2, members: [] },
    { id: 'ch-visa', name: 'visa-updates', type: 'public', description: 'Home Affairs latest visa news', unreadCount: 0, members: [] },
    { id: 'ch-management', name: 'management-only', type: 'private', description: 'Executive and Lead Agent coordination', unreadCount: 0, members: [] },
];

const TeamWorkspace: React.FC<Props> = ({ staff, conversations, onSendMessage }) => {
    const [activeId, setActiveId] = useState<string>('ch-general');
    const [inputText, setInputText] = useState('');
    const [isLinkingCase, setIsLinkingCase] = useState(false);
    const [linkedCaseId, setLinkedCaseId] = useState<string | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock messages for workspace
    const [workspaceMessages, setWorkspaceMessages] = useState<Record<string, Message[]>>({
        'ch-general': [
            { id: 'm1', sender: SenderType.AGENT, authorName: 'Jessica Wu', authorId: 's1', content: 'Good morning team! Let’s crush the monthly intake goals.', timestamp: new Date(Date.now() - 3600000), thread: 'ch-general', type: MessageType.TEXT },
            { id: 'm2', sender: SenderType.SYSTEM, content: 'Alex (Admin) joined the channel', timestamp: new Date(Date.now() - 7200000), thread: 'ch-general', type: MessageType.SYSTEM },
        ],
        'ch-rpl': [
            { id: 'r1', sender: SenderType.AGENT, authorName: 'Tom Hardy', authorId: 's2', content: 'Does anyone have the latest Trade Recognition checklist for automotive?', timestamp: new Date(Date.now() - 1800000), thread: 'ch-rpl', type: MessageType.TEXT },
        ],
        's1': [
            { id: 'dm1', sender: SenderType.AGENT, authorName: 'Jessica Wu', authorId: 's1', content: 'Hey, did you review Sarah Jenkins document yet?', timestamp: new Date(Date.now() - 300000), thread: 's1', type: MessageType.TEXT },
        ]
    });

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [activeId, workspaceMessages]);

    const activeChannel = MOCK_CHANNELS.find(c => c.id === activeId);
    const activeStaff = staff.find(s => s.id === activeId);
    const currentMessages = workspaceMessages[activeId] || [];

    const handleSend = () => {
        if (!inputText.trim()) return;
        const msg: Message = {
            id: `msg-${Date.now()}`,
            sender: SenderType.AGENT,
            authorName: 'Alex (Admin)',
            authorId: 'admin',
            content: inputText,
            timestamp: new Date(),
            thread: activeId,
            type: MessageType.TEXT,
            linkedCaseId
        };
        setWorkspaceMessages(prev => ({
            ...prev,
            [activeId]: [...(prev[activeId] || []), msg]
        }));
        onSendMessage(activeId, inputText, linkedCaseId);
        setInputText('');
        setLinkedCaseId(undefined);
    };

    const handleLinkCase = (id: string) => {
        setLinkedCaseId(id);
        setIsLinkingCase(false);
    };

    const linkedCase = linkedCaseId ? conversations.find(c => c.id === linkedCaseId) : null;

    return (
        <div className="flex h-full bg-white overflow-hidden animate-in fade-in duration-500">
            {/* 1. WORKSPACE SIDEBAR */}
            <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Zap className="w-5 h-5 text-messenger-blue fill-current" /> Workspace
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-8">
                    {/* SEARCH */}
                    <div className="px-2">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Jump to..."
                                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                    </div>

                    {/* CHANNELS */}
                    <div className="space-y-1">
                        <div className="px-4 flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Channels</span>
                            {/* Added Plus icon import to fix the error */}
                            <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><Plus className="w-3 h-3" /></button>
                        </div>
                        {MOCK_CHANNELS.map(ch => (
                            <button
                                key={ch.id}
                                onClick={() => setActiveId(ch.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all group ${activeId === ch.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                <div className="flex items-center gap-2">
                                    {ch.type === 'private' ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4 opacity-50" />}
                                    <span className="truncate">{ch.name}</span>
                                </div>
                                {ch.unreadCount > 0 && activeId !== ch.id && (
                                    <span className="bg-blue-600 text-white text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full ring-2 ring-slate-50">{ch.unreadCount}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* DIRECT MESSAGES */}
                    <div className="space-y-1">
                        <div className="px-4 flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Messages</span>
                            <button className="p-1 hover:bg-slate-200 rounded text-slate-400"><Search className="w-3 h-3" /></button>
                        </div>
                        {staff.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveId(s.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all group ${activeId === s.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                <div className="relative">
                                    <img src={s.avatar} className="w-6 h-6 rounded-lg object-cover" alt="" />
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-slate-50 ${s.status === 'online' ? 'bg-emerald-500' : s.status === 'busy' ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                                </div>
                                <span className="truncate">{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* USER PROFILE MINIBAR */}
                <div className="p-4 bg-slate-100 border-t border-slate-200">
                    <div className="flex items-center gap-3 p-2 hover:bg-white rounded-2xl transition-all cursor-pointer group">
                        <div className="relative">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=2563EB&color=fff" className="w-8 h-8 rounded-xl object-cover" alt="" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-100 rounded-full"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-900 truncate">Alex (Admin)</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Available</p>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>

            {/* 2. CHAT WINDOW */}
            <div className="flex-1 flex flex-col h-full bg-white relative">
                {/* CHANNEL HEADER */}
                <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-900 border border-slate-100 shadow-sm">
                            {activeChannel ? (activeChannel.type === 'private' ? <Lock className="w-5 h-5" /> : <Hash className="w-5 h-5" />) : <User className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                {activeChannel?.name || activeStaff?.name}
                                {activeStaff && <Circle className={`w-2 h-2 fill-current ${activeStaff.status === 'online' ? 'text-emerald-500' : 'text-slate-300'}`} />}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[400px]">
                                {activeChannel?.description || activeStaff?.role}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"><Phone className="w-5 h-5" /></button>
                        <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"><Video className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-slate-100 mx-2"></div>
                        <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"><Info className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* MESSAGES LIST */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-10 space-y-10 custom-scrollbar">
                    {currentMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center select-none">
                            <div className="p-10 rounded-[48px] bg-slate-50 mb-6">
                                <MessageSquare className="w-20 h-20 text-slate-400" />
                            </div>
                            <h3 className="font-black uppercase tracking-[0.2em] text-sm">Secure Team Thread</h3>
                            <p className="text-[11px] font-bold mt-2 max-w-[240px] leading-relaxed">This is the beginning of the conversation. Messages are encrypted and stored for administrative audit.</p>
                        </div>
                    ) : (
                        currentMessages.map((msg) => {
                            const isMe = msg.authorId === 'admin';
                            const author = staff.find(s => s.id === msg.authorId);
                            const isSystem = msg.type === MessageType.SYSTEM;

                            if (isSystem) {
                                return (
                                    <div key={msg.id} className="flex justify-center my-6">
                                        <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.content}</span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className="flex gap-4 group">
                                    <div className="relative shrink-0 pt-1">
                                        <img src={author?.avatar || 'https://ui-avatars.com/api/?name=Admin'} className="w-10 h-10 rounded-2xl shadow-sm border border-slate-100 transition-transform group-hover:scale-110" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="text-sm font-black text-slate-900">{msg.authorName}</span>
                                            <span className="text-[10px] font-bold text-slate-300">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {msg.linkedCaseId && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                                                    <LinkIcon className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">Case Linked</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-700 leading-relaxed font-medium">
                                            {msg.content}
                                        </div>
                                        
                                        {/* Linked Case Preview if available */}
                                        {msg.linkedCaseId && conversations.find(c => c.id === msg.linkedCaseId) && (
                                            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md flex items-center justify-between group/case cursor-pointer hover:bg-white transition-all shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <img src={conversations.find(c => c.id === msg.linkedCaseId)?.client.avatar} className="w-8 h-8 rounded-lg" alt="" />
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 leading-none">{conversations.find(c => c.id === msg.linkedCaseId)?.client.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{conversations.find(c => c.id === msg.linkedCaseId)?.client.qualificationTarget}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded tracking-tighter">{conversations.find(c => c.id === msg.linkedCaseId)?.currentStage.replace(/_/g, ' ')}</span>
                                                    {/* Added ChevronRight icon import to fix the error */}
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover/case:text-blue-600 transition-colors" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* WORKSPACE INPUT CONSOLE */}
                <div className="p-8 border-t border-slate-100 bg-white">
                    {linkedCase && (
                        <div className="mb-4 flex items-center justify-between px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-3">
                                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Linked Case: {linkedCase.client.name}</span>
                            </div>
                            <button onClick={() => setLinkedCaseId(undefined)} className="text-blue-400 hover:text-blue-600"><X className="w-3.5 h-3.5" /></button>
                        </div>
                    )}

                    <div className="relative">
                        <div className="flex items-center gap-4 p-3 rounded-[28px] border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-300 transition-all bg-slate-50 focus-within:bg-white shadow-sm">
                            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all shrink-0"><Paperclip className="w-5 h-5" /></button>
                            <input 
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={`Message ${activeChannel?.name || activeStaff?.name}...`}
                                className="flex-1 bg-transparent border-none py-2 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
                            />
                            <div className="flex items-center gap-1.5">
                                <button className="p-2.5 text-slate-400 hover:text-blue-600 rounded-full"><Smile className="w-5 h-5" /></button>
                                <button onClick={() => setIsLinkingCase(true)} className={`p-2.5 rounded-full transition-all ${linkedCaseId ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`} title="Link Client Case"><LinkIcon className="w-5 h-5" /></button>
                                <button onClick={handleSend} disabled={!inputText.trim()} className="p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shrink-0">
                                    <Send className="w-5 h-5 fill-current" />
                                </button>
                            </div>
                        </div>

                        {/* CASE LINKER PICKER OVERLAY */}
                        {isLinkingCase && (
                            <div className="absolute bottom-full left-0 mb-4 w-80 bg-white border border-slate-200 rounded-[32px] shadow-2xl p-6 animate-in slide-in-from-bottom-4 z-20">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Link Active Case</h4>
                                    <button onClick={() => setIsLinkingCase(false)} className="text-slate-400 hover:text-slate-900"><X className="w-4 h-4" /></button>
                                </div>
                                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                                    {conversations.filter(c => c.status === 'active').map(conv => (
                                        <button 
                                            key={conv.id}
                                            onClick={() => handleLinkCase(conv.id)}
                                            className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-blue-200 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={conv.client.avatar} className="w-8 h-8 rounded-lg shadow-sm" alt="" />
                                                <div className="overflow-hidden">
                                                    <p className="text-[11px] font-black text-slate-900 truncate">{conv.client.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 truncate uppercase">{conv.client.qualificationTarget}</p>
                                                </div>
                                            </div>
                                            {/* Added ChevronRight icon import to fix the error */}
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. WORKSPACE CONTEXT PANEL (RIGHT) */}
            <div className="w-80 border-l border-slate-100 flex flex-col shrink-0 bg-slate-50/50">
                <div className="p-8 space-y-10">
                    <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                            Channel Details
                            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[8px]">{staff.length + 1} Members</span>
                        </h4>
                        <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="p-4 bg-slate-50 rounded-[28px] border border-slate-100 mb-4">
                                    {activeChannel ? <Hash className="w-8 h-8 text-slate-900" /> : <img src={activeStaff?.avatar} className="w-16 h-16 rounded-[28px] shadow-lg border-4 border-white" />}
                                </div>
                                <h4 className="text-base font-black text-slate-900 tracking-tight">{activeChannel?.name || activeStaff?.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{activeChannel ? 'Team Channel' : 'Direct Liaison'}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <button className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
                                    Search Thread
                                </button>
                                <button className="w-full py-3.5 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95">
                                    Manage Members
                                </button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                            Active Members
                            <div className="flex -space-x-2">
                                {staff.slice(0, 3).map(s => <img key={s.id} src={s.avatar} className="w-5 h-5 rounded-full border border-white ring-1 ring-slate-100" alt="" />)}
                            </div>
                        </h4>
                        <div className="space-y-3">
                            {staff.map(s => (
                                <div key={s.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl group cursor-pointer hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3">
                                        <img src={s.avatar} className="w-7 h-7 rounded-lg object-cover" alt="" />
                                        <div>
                                            <p className="text-[11px] font-black text-slate-800">{s.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{s.department}</p>
                                        </div>
                                    </div>
                                    <Circle className={`w-2 h-2 fill-current ${s.status === 'online' ? 'text-emerald-500' : s.status === 'busy' ? 'text-orange-500' : 'text-slate-300'}`} />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Integrations</h4>
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-[28px] flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm"><Zap className="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p className="text-[11px] font-black text-indigo-900 leading-tight">Gemini Strategy Sync</p>
                                <p className="text-[9px] font-bold text-indigo-600/60 uppercase mt-0.5 tracking-tighter">Automating Team Briefs</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TeamWorkspace;
