
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
import { Conversation, MessageType, SenderType, MessageThread, ViewState, ApplicationStage, Counselor, TeamTask, Partner, ClientProfile } from './types';
import { analyzeDocumentMock, generatePartnerEmail } from './services/geminiService';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [counselors, setCounselors] = useState<Counselor[]>(MOCK_COUNSELORS);
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [jumpHighlight, setJumpHighlight] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Urgent Follow-ups', 'Prospects', 'Onboarding', 'Waiting on RTO']);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  
  // Filtering state
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
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;

    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          currentStage: newStage,
          currentStep: newStage.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          activities: [
            { id: `act_${Date.now()}`, staffId: 'admin', staffName: 'AI Automator', action: `Status changed to ${newStage}`, timestamp: new Date() },
            ...c.activities
          ]
        };
      }
      return c;
    }));

    const isSubmission = newStage === 'rto_submission' || newStage === 'app_lodged';
    
    if (isSubmission) {
      const partner = partners.find(p => p.id === (conv.partnerId || 'p1'));
      if (partner) {
        const emailContent = await generatePartnerEmail(
          conv.client,
          partner,
          conv.documents.filter(d => d.status === 'verified')
        );

        const systemMsg = {
          id: `sys_email_${Date.now()}`,
          sender: SenderType.SYSTEM,
          type: MessageType.SYSTEM,
          content: `📧 AI AUTOMATION: Professional email sent to ${partner.name} (${partner.contactPerson}). Subject: "${emailContent.subject}". Attached ${conv.documents.filter(d => d.status === 'verified').length} verified documents.`,
          timestamp: new Date(),
          thread: 'source' as MessageThread
        };

        const upstreamMsg = {
          id: `sys_up_${Date.now()}`,
          sender: SenderType.SUPER_AGENT,
          type: MessageType.TEXT,
          content: `AUTO-LODGMENT: We've officially submitted ${conv.client.name}'s file to ${partner.name}. Awaiting initial feedback.`,
          timestamp: new Date(),
          thread: 'upstream' as MessageThread
        };

        setConversations(prev => prev.map(c => {
          if (c.id === id) return { ...c, messages: [...c.messages, systemMsg, upstreamMsg] };
          return c;
        }));
      }
    }
  };

  const handleMoveToCategory = (id: string, category: string | undefined) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, customCategory: category };
      return c;
    }));
  };

  const handleAddCategory = (name: string) => {
    if (name && !categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
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

    if (text.toLowerCase().includes("send this to") || text.toLowerCase().includes("submit to")) {
        setTimeout(() => {
            handleUpdateStatus(selectedId, selectedConversation.currentStage.includes('app') ? 'app_lodged' : 'rto_submission');
        }, 1000);
    }

    setTimeout(async () => {
       if (thread === 'source' && type === MessageType.DOCUMENT && fileData) {
            const analysis = await analyzeDocumentMock(fileData.name);
            const systemMsg = { 
              id: (Date.now() + 1).toString(), 
              sender: SenderType.SYSTEM, 
              type: MessageType.SYSTEM, 
              content: `AI Verified: ${analysis.type} (${analysis.confidence}%). Document summary: ${analysis.summary}`, 
              timestamp: new Date(), 
              thread: 'source' as MessageThread 
            };
            setConversations(prev => prev.map(c => {
                if(c.id === selectedId) return { 
                  ...c, 
                  messages: [...c.messages, systemMsg], 
                  documents: c.documents.map(d => d.status === 'missing' && analysis.type.toLowerCase().includes(d.name.toLowerCase().split(' ')[0]) ? { ...d, status: 'verified', confidence: analysis.confidence, uploadDate: new Date() } : d) 
                };
                return c;
            }));
       }
    }, 2000);
  };

  const handleAssignCounselor = (counselorId: string) => {
      const staff = counselors.find(s => s.id === counselorId);
      if (!staff) return;

      const newLog = {
          id: `log_${Date.now()}`,
          staffId: 'admin',
          staffName: 'Alex (Admin)',
          action: `Handed over file to ${staff.name}`,
          timestamp: new Date()
      };

      setConversations(prev => prev.map(c => {
          if (c.id === selectedId) return { ...c, assignedCounselorId: counselorId, activities: [newLog, ...(c.activities || [])] };
          return c;
      }));
  };

  const handleAddTask = (counselorId: string, task: Omit<TeamTask, 'id' | 'status'>) => {
    setCounselors(prev => prev.map(c => {
      if (c.id === counselorId) {
        return {
          ...c,
          tasks: [
            ...c.tasks,
            { ...task, id: `task_${Date.now()}`, status: 'pending' as const }
          ]
        };
      }
      return c;
    }));
  };

  const handleToggleTaskStatus = (counselorId: string, taskId: string) => {
    setCounselors(prev => prev.map(c => {
      if (c.id === counselorId) {
        return {
          ...c,
          tasks: c.tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t)
        };
      }
      return c;
    }));
  };

  const handleDeleteTask = (counselorId: string, taskId: string) => {
    setCounselors(prev => prev.map(c => {
      if (c.id === counselorId) {
        return {
          ...c,
          tasks: c.tasks.filter(t => t.id !== taskId)
        };
      }
      return c;
    }));
  };

  const handleUpdatePartner = (updatedPartner: Partner) => {
    setPartners(prev => prev.map(p => p.id === updatedPartner.id ? updatedPartner : p));
  };

  const handleAddPartner = (newPartner: Partner) => {
    setPartners(prev => [...prev, newPartner]);
  };
  
  const handleViewPartnerApplications = (partnerId: string) => {
    setPipelinePartnerFilter(partnerId);
    setCurrentView('pipeline');
  };

  const handleCreateLead = (leadData: Partial<ClientProfile>) => {
    const newId = `c_new_${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      assignedCounselorId: counselors[0].id, // Default to first counselor for now
      client: {
        id: `u_new_${Date.now()}`,
        name: leadData.name || 'New Lead',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(leadData.name || 'N L')}&background=random`,
        email: leadData.email || '',
        phone: leadData.phone || '',
        location: leadData.location || 'Unknown',
        visaStatus: leadData.visaStatus || 'TBA',
        visaExpiry: leadData.visaExpiry || '',
        qualificationTarget: leadData.qualificationTarget || 'General Enquiry',
        experienceYears: 0,
        educationHistory: []
      },
      source: 'direct',
      superAgentStatus: 'not_started',
      unreadCount: 1,
      status: 'lead',
      priority: 'medium',
      currentStage: 'lead',
      lastActive: new Date(),
      progressStage: 5,
      currentStep: 'Initial Assessment',
      paymentTotal: 0,
      paymentPaid: 0,
      activities: [{
        id: `act_init_${Date.now()}`,
        staffId: 'ai',
        staffName: 'AI System',
        action: 'New lead created via dashboard',
        timestamp: new Date()
      }],
      documents: [],
      messages: [{
        id: `msg_init_${Date.now()}`,
        sender: SenderType.SYSTEM,
        type: MessageType.SYSTEM,
        content: `New lead created for ${leadData.name}. Qualification target: ${leadData.qualificationTarget}`,
        timestamp: new Date(),
        thread: 'source'
      }]
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedId(newId);
    setCurrentView('inbox');
    setIsNewLeadModalOpen(false);
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
      case 'team': return (
        <TeamManagement 
          staff={counselors} 
          onAddTask={handleAddTask} 
          onToggleTaskStatus={handleToggleTaskStatus}
          onDeleteTask={handleDeleteTask}
        />
      );
      case 'inbox':
        return (
          <div className="flex h-full w-full overflow-hidden relative">
            <div className={`hidden lg:block h-full transition-all duration-500 ${jumpHighlight ? 'ring-4 ring-indigo-500/20' : ''}`}>
                <ConversationList 
                    conversations={conversations} 
                    selectedId={selectedId} 
                    onSelect={(id) => { setSelectedId(id); }} 
                    isOpen={true} 
                    categories={categories}
                    onMoveToCategory={handleMoveToCategory}
                    onAddCategory={handleAddCategory}
                />
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
                    onUpdateStatus={(status) => handleUpdateStatus(selectedId, status)}
                />
            </div>
          </div>
        );
      case 'partners': return (
        <Partners 
          partners={partners} 
          onUpdatePartner={handleUpdatePartner}
          onAddPartner={handleAddPartner}
          onViewApplications={handleViewPartnerApplications}
        />
      );
      case 'finance': return <Finance />;
      default: return <Dashboard onOpenNewLead={() => setIsNewLeadModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar currentView={currentView} onChangeView={(v) => { setCurrentView(v); setPipelinePartnerFilter(null); }} unreadCount={unreadCount} />
      </div>
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
         {renderContent()}
      </main>

      {/* New Lead Modal */}
      <NewLeadModal 
        isOpen={isNewLeadModalOpen} 
        onClose={() => setIsNewLeadModalOpen(false)} 
        onSubmit={handleCreateLead} 
      />
    </div>
  );
}

export default App;
