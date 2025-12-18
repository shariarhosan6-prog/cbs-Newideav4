
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Kanban from './components/Kanban';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import ClientIntelligence from './components/ClientIntelligence';
import Partners from './components/Partners';
import Finance from './components/Finance';
import TeamManagement from './components/TeamManagement';
import { MOCK_CONVERSATIONS, MOCK_COUNSELORS } from './constants';
import { Conversation, MessageType, SenderType, MessageThread, ViewState, EducationEntry } from './types';
import { Menu, X } from 'lucide-react';
import { analyzeDocumentMock } from './services/geminiService';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];
  const unreadCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  // Deep link from Kanban to Chat
  const handleSelectFromPipeline = (id: string) => {
    // We assume IDs match between ApplicationCards and Conversations
    setSelectedId(id);
    setCurrentView('inbox');
  };

  const handleSendMessage = async (text: string, type: MessageType = MessageType.TEXT, fileData?: { name: string, size: string }, thread: MessageThread = 'source') => {
    const newMessage = {
      id: Date.now().toString(),
      sender: SenderType.AGENT,
      type: type,
      content: text,
      timestamp: new Date(),
      read: false,
      fileName: fileData?.name,
      fileSize: fileData?.size,
      thread: thread
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) return { ...c, messages: [...c.messages, newMessage], lastActive: new Date() };
      return c;
    }));

    setTimeout(async () => {
       if (thread === 'source') {
           if (type === MessageType.DOCUMENT && fileData) {
                const analysis = await analyzeDocumentMock(fileData.name);
                const systemMsg = { id: (Date.now() + 1).toString(), sender: SenderType.SYSTEM, type: MessageType.SYSTEM, content: `AI Analysis: Identified as ${analysis.type} (${analysis.confidence}% confidence).`, timestamp: new Date(), thread: 'source' as MessageThread };
                setConversations(prev => prev.map(c => {
                    if(c.id === selectedId) return { ...c, messages: [...c.messages, systemMsg], documents: c.documents.map(d => d.status === 'missing' && analysis.type.toLowerCase().includes(d.name.toLowerCase().split(' ')[0]) ? { ...d, status: 'verified', confidence: analysis.confidence } : d) };
                    return c;
                }));
           } else {
                const replyMsg = { id: (Date.now() + 1).toString(), sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Thanks for the update. I'll get on that right away.", timestamp: new Date(), read: true, thread: 'source' as MessageThread };
                setConversations(prev => prev.map(c => {
                    if (c.id === selectedId) return { ...c, messages: [...c.messages, replyMsg] };
                    return c;
                }));
           }
       } else if (thread === 'upstream') {
            const replyMsg = { id: (Date.now() + 1).toString(), sender: SenderType.SUPER_AGENT, type: MessageType.TEXT, content: "Acknowledged. File status updated.", timestamp: new Date(), read: true, thread: 'upstream' as MessageThread };
            setConversations(prev => prev.map(c => {
                if (c.id === selectedId) return { ...c, messages: [...c.messages, replyMsg] };
                return c;
            }));
       }
    }, 2000);
  };

  const handleAssignCounselor = (counselorId: string) => {
      const staff = MOCK_COUNSELORS.find(s => s.id === counselorId);
      if (!staff) return;

      const newLog = {
          id: `log_${Date.now()}`,
          staffId: 'admin',
          staffName: 'Alex (Admin)',
          action: `Assigned file to ${staff.name}`,
          timestamp: new Date()
      };

      setConversations(prev => prev.map(c => {
          if (c.id === selectedId) {
              return { ...c, assignedCounselorId: counselorId, activities: [newLog, ...(c.activities || [])] };
          }
          return c;
      }));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'pipeline': return <Kanban onSelectCard={handleSelectFromPipeline} />;
      case 'team': return <TeamManagement />;
      case 'inbox':
        return (
          <div className="flex h-full w-full overflow-hidden relative">
            <div className="hidden lg:block h-full">
                <ConversationList conversations={conversations} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); }} isOpen={true} />
            </div>
            <div className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0">
                 <ChatWindow 
                    key={selectedConversation.id} 
                    conversation={selectedConversation} 
                    onSendMessage={handleSendMessage}
                    onToggleInfo={() => setRightPanelOpen(!rightPanelOpen)}
                    onAssignCounselor={handleAssignCounselor}
                    isInfoOpen={rightPanelOpen}
                />
            </div>
            <div className={`absolute lg:static inset-y-0 right-0 z-30 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl lg:shadow-none transition-all duration-300 transform ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}`}>
                <ClientIntelligence 
                    conversation={selectedConversation} 
                    isOpen={true} 
                    onAddDocument={() => {}} 
                    onAddEducation={() => {}} 
                />
            </div>
          </div>
        );
      case 'partners': return <Partners />;
      case 'finance': return <Finance />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="hidden lg:block h-full">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} unreadCount={unreadCount} />
      </div>
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
         {renderContent()}
      </main>
    </div>
  );
}

export default App;
