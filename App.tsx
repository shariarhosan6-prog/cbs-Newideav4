
import React, { useState, useEffect } from 'react';
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
  const [jumpHighlight, setJumpHighlight] = useState(false);

  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];
  const unreadCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  // Deep link with high-fidelity transition
  const handleSelectFromPipeline = (id: string) => {
    setSelectedId(id);
    setCurrentView('inbox');
    setJumpHighlight(true);
    setTimeout(() => setJumpHighlight(false), 3000); // Visual feedback for the "jump"
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

    // AI Automation Simulation
    setTimeout(async () => {
       if (thread === 'source') {
           if (type === MessageType.DOCUMENT && fileData) {
                const analysis = await analyzeDocumentMock(fileData.name);
                const systemMsg = { id: (Date.now() + 1).toString(), sender: SenderType.SYSTEM, type: MessageType.SYSTEM, content: `AI Verified: ${analysis.type} (${analysis.confidence}%). Document summary: ${analysis.summary}`, timestamp: new Date(), thread: 'source' as MessageThread };
                setConversations(prev => prev.map(c => {
                    if(c.id === selectedId) return { ...c, messages: [...c.messages, systemMsg], documents: c.documents.map(d => d.status === 'missing' && analysis.type.toLowerCase().includes(d.name.toLowerCase().split(' ')[0]) ? { ...d, status: 'verified', confidence: analysis.confidence } : d) };
                    return c;
                }));
           } else {
                const replyMsg = { id: (Date.now() + 1).toString(), sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Perfect, I'll get those files sent over by the end of the day.", timestamp: new Date(), read: true, thread: 'source' as MessageThread };
                setConversations(prev => prev.map(c => {
                    if (c.id === selectedId) return { ...c, messages: [...c.messages, replyMsg] };
                    return c;
                }));
           }
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
          action: `Handed over file to ${staff.name}`,
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
            <div className={`hidden lg:block h-full transition-all duration-500 ${jumpHighlight ? 'ring-4 ring-indigo-500/20' : ''}`}>
                <ConversationList conversations={conversations} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); }} isOpen={true} />
            </div>
            <div className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0 bg-white">
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} unreadCount={unreadCount} />
      </div>
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
         {renderContent()}
      </main>
    </div>
  );
}

export default App;
