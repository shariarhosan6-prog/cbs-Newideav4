
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
import NewLeadModal from './components/NewLeadModal';
import { MOCK_CONVERSATIONS, MOCK_COUNSELORS, MOCK_PARTNERS } from './constants';
import { Conversation, MessageType, SenderType, MessageThread, ViewState, ApplicationStage, Counselor, TeamTask, Partner, ClientProfile, ApplicationType } from './types';
import { analyzeDocumentMock, generatePartnerEmail } from './services/geminiService';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>(
    MOCK_CONVERSATIONS.map(c => ({
      ...c,
      isB2BSettled: c.source === 'sub_agent',
      onshoreStatus: 'offshore',
      journey: [
        { id: 'j1', serviceType: 'admission', title: 'Subclass 500 Offshore', status: 'completed', startDate: new Date(2023, 11, 1) }
      ]
    }))
  );
  const [counselors, setCounselors] = useState<Counselor[]>(MOCK_COUNSELORS);
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [jumpHighlight, setJumpHighlight] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Urgent Follow-ups', 'Prospects', 'Onboarding', 'Waiting on RTO']);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  
  const [pipelinePartnerFilter, setPipelinePartnerFilter] = useState<string | null>(null);

  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];
  const unreadCount = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  const handleSelectFromPipeline = (id: string) => {
    setSelectedId(id);
    setCurrentView('inbox');
    setJumpHighlight(true);
    setTimeout(() => setJumpHighlight(false), 3000);
  };

  const handleUpdateStatus = async (id: string, newStage: ApplicationStage) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          currentStage: newStage,
          currentStep: newStage.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          onshoreStatus: newStage === 'onshore_arrival' ? 'landed' : c.onshoreStatus
        };
      }
      return c;
    }));
  };

  const handleSpawnService = (type: ApplicationType, target: string) => {
      setConversations(prev => prev.map(c => {
          if (c.id === selectedId) {
              const newMilestone = {
                  id: `j_${Date.now()}`,
                  serviceType: type,
                  title: target,
                  status: 'active' as const,
                  startDate: new Date()
              };
              
              const systemMsg = {
                  id: `sys_spawn_${Date.now()}`,
                  sender: SenderType.SYSTEM,
                  type: MessageType.SYSTEM,
                  content: `🤖 JOURNEY UPDATE: Student transitioning to Onshore ${type.replace(/_/g, ' ')}. New File Spawned.`,
                  timestamp: new Date(),
                  thread: 'source' as MessageThread
              };

              return {
                  ...c,
                  journey: [...c.journey, newMilestone],
                  currentStage: 'lead',
                  currentStep: 'Lifecycle Transition',
                  messages: [...c.messages, systemMsg],
                  paymentTotal: c.paymentTotal + 1500, // Onshore service fee
                  lastActive: new Date()
              };
          }
          return c;
      }));
      setCurrentView('pipeline');
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
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onOpenNewLead={() => setIsNewLeadModalOpen(true)} />;
      case 'pipeline': return (
        <Kanban 
          conversations={conversations} 
          onSelectCard={handleSelectFromPipeline} 
          filterPartnerId={pipelinePartnerFilter}
          onClearFilter={() => setPipelinePartnerFilter(null)}
          onAddLead={() => setIsNewLeadModalOpen(true)}
        />
      );
      case 'team': return <TeamManagement staff={counselors} onAddTask={() => {}} onToggleTaskStatus={() => {}} onDeleteTask={() => {}} />;
      case 'inbox':
        return (
          <div className="flex h-full w-full overflow-hidden relative">
            <div className="hidden lg:block h-full">
                <ConversationList 
                    conversations={conversations} 
                    selectedId={selectedId} 
                    onSelect={setSelectedId} 
                    isOpen={true} 
                    categories={categories}
                    onMoveToCategory={() => {}}
                    onAddCategory={() => {}}
                />
            </div>
            <div className="flex-1 flex flex-col h-full relative overflow-hidden min-w-0 bg-white">
                 <ChatWindow 
                    key={selectedConversation.id} 
                    conversation={selectedConversation} 
                    onSendMessage={handleSendMessage}
                    onToggleInfo={() => setRightPanelOpen(!rightPanelOpen)}
                    onAssignCounselor={() => {}}
                    isInfoOpen={rightPanelOpen}
                />
            </div>
            <div className={`absolute lg:static inset-y-0 right-0 z-30 w-full sm:w-96 bg-white border-l border-slate-200 transition-all duration-300 transform ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}`}>
                <ClientIntelligence 
                    conversation={selectedConversation} 
                    isOpen={true} 
                    onAddDocument={() => {}} 
                    onAddEducation={() => {}} 
                    onUpdateStatus={(status) => handleUpdateStatus(selectedId, status)}
                    onSpawnService={handleSpawnService}
                />
            </div>
          </div>
        );
      case 'partners': return <Partners partners={partners} onUpdatePartner={() => {}} onAddPartner={() => {}} onViewApplications={() => {}} />;
      case 'finance': return <Finance />;
      default: return <Dashboard onOpenNewLead={() => setIsNewLeadModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar currentView={currentView} onChangeView={(v) => { setCurrentView(v); setPipelinePartnerFilter(null); }} unreadCount={unreadCount} />
      </div>
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
         {renderContent()}
      </main>
      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => setIsNewLeadModalOpen(false)} 
        onSubmit={(leadData) => {
            const newId = `c_${Date.now()}`;
            const newC: Conversation = {
                id: newId,
                client: {
                    ...leadData,
                    id: `u_${Date.now()}`,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(leadData.name || 'New')}`,
                    experienceYears: 0,
                    educationHistory: []
                } as any,
                source: 'direct',
                assignedCounselorId: counselors[0].id,
                superAgentStatus: 'not_started',
                messages: [],
                unreadCount: 0,
                status: 'lead',
                priority: 'medium',
                currentStage: 'lead',
                lastActive: new Date(),
                progressStage: 0,
                currentStep: 'Lead Captured',
                documents: [],
                paymentTotal: 0,
                paymentPaid: 0,
                activities: [],
                journey: [],
                onshoreStatus: 'offshore'
            };
            setConversations([newC, ...conversations]);
            setSelectedId(newId);
            setCurrentView('inbox');
            setIsNewLeadModalOpen(false);
        }} 
      />
    </div>
  );
}

export default App;
