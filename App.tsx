
import React, { useState, useEffect, useMemo } from 'react';
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
import AIChatBot from './components/AIChatBot';
import AdvancedSearch from './components/AdvancedSearch';
import CalendarTimeline from './components/CalendarTimeline';
import BulkActionToolbar from './components/BulkActionToolbar';
import { MOCK_CONVERSATIONS, MOCK_COUNSELORS, MOCK_PARTNERS } from './constants';
import { Conversation, MessageType, SenderType, MessageThread, ViewState, ApplicationStage, Counselor, Partner, SearchFilters, InternalNote } from './types';
import { Menu } from 'lucide-react';

const INITIAL_FILTERS: SearchFilters = {
  query: '',
  stages: [],
  priorities: [],
  sources: [],
};

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [counselors] = useState<Counselor[]>(MOCK_COUNSELORS);
  const [partners] = useState<Partner[]>(MOCK_PARTNERS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState<string[]>(['Urgent Follow-ups', 'Prospects', 'Onboarding', 'Waiting on RTO']);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  
  // SELECTION STATE FOR BULK ACTIONS
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // GLOBAL SEARCH STATE
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);

  // MEMOIZED FILTERING LOGIC
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      // 1. Text Query (Name, Email, Sub-Agent)
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const matchesName = c.client.name.toLowerCase().includes(q);
        const matchesEmail = c.client.email.toLowerCase().includes(q);
        const matchesSubAgent = c.subAgentName?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesSubAgent) return false;
      }

      // 2. Stages
      if (filters.stages.length > 0 && !filters.stages.includes(c.currentStage)) return false;

      // 3. Priority
      if (filters.priorities.length > 0 && !filters.priorities.includes(c.priority)) return false;

      // 4. Sources
      if (filters.sources.length > 0 && !filters.sources.includes(c.source)) return false;

      return true;
    });
  }, [conversations, filters]);

  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0];
  const unreadCount = filteredConversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  const handleUpdateStatus = (id: string, newStage: ApplicationStage) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, currentStage: newStage } : c));
  };

  const handleAddNote = (id: string, noteData: Omit<InternalNote, 'id' | 'timestamp'>) => {
    const newNote: InternalNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      timestamp: new Date()
    };
    setConversations(prev => prev.map(c => c.id === id ? { ...c, notes: [newNote, ...c.notes] } : c));
    
    // Also post it as an internal message in the chat for the stream
    const newMessage = { 
      id: `msg-note-${Date.now()}`, 
      sender: SenderType.AGENT, 
      type: MessageType.TEXT, 
      content: `[Internal Note]: ${noteData.content}`, 
      timestamp: new Date(), 
      thread: 'internal' as MessageThread 
    };
    setConversations(prev => prev.map(c => c.id === id ? { ...c, messages: [...c.messages, newMessage] } : c));
  };

  const handleSendMessage = (text: string, type: MessageType = MessageType.TEXT, fileData?: { name: string, size: string }, thread: MessageThread = 'source') => {
    const newMessage = { id: Date.now().toString(), sender: SenderType.AGENT, type, content: text, timestamp: new Date(), thread };
    setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, newMessage], lastActive: new Date() } : c));
    
    // If it's an internal note sent via chat, also add it to the notes history
    if (thread === 'internal') {
        const newNote: InternalNote = {
            id: `note-chat-${Date.now()}`,
            content: text,
            authorName: "Alex (Admin)",
            timestamp: new Date(),
            color: 'blue'
        };
        setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, notes: [newNote, ...c.notes] } : c));
    }
  };

  // --- BULK ACTION HANDLERS ---
  const handleToggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredConversations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredConversations.map(c => c.id));
    }
  };

  const handleBulkAssign = (counselorId: string) => {
    setConversations(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, assignedCounselorId: counselorId } : c));
    setSelectedIds([]);
  };

  const handleBulkMove = (category: string | undefined) => {
    setConversations(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, customCategory: category } : c));
    setSelectedIds([]);
  };

  const handleBulkMessage = (text: string) => {
    const timestamp = new Date();
    setConversations(prev => prev.map(c => {
      if (selectedIds.includes(c.id)) {
        const newMessage = { id: `bulk-${Date.now()}-${c.id}`, sender: SenderType.AGENT, type: MessageType.TEXT, content: text, timestamp, thread: 'source' as MessageThread };
        return { ...c, messages: [...c.messages, newMessage], lastActive: timestamp };
      }
      return c;
    }));
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const exportData = conversations.filter(c => selectedIds.includes(c.id));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stitch_export_${Date.now()}.json`;
    a.click();
    setSelectedIds([]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onOpenNewLead={() => setIsNewLeadModalOpen(true)} />;
      case 'pipeline': 
        return (
          <div className="flex flex-col h-full">
            <AdvancedSearch filters={filters} onFilterChange={setFilters} onClear={() => setFilters(INITIAL_FILTERS)} />
            <div className="flex-1 overflow-hidden">
              <Kanban conversations={filteredConversations} onSelectCard={(id) => { setSelectedId(id); setCurrentView('inbox'); }} onAddLead={() => setIsNewLeadModalOpen(true)} />
            </div>
          </div>
        );
      case 'inbox':
        return (
          <div className="flex flex-col h-full">
            <AdvancedSearch filters={filters} onFilterChange={setFilters} onClear={() => setFilters(INITIAL_FILTERS)} />
            <div className="flex-1 flex h-full w-full overflow-hidden relative">
              <div className="hidden lg:block h-full">
                  <ConversationList 
                    conversations={filteredConversations} 
                    selectedId={selectedId} 
                    onSelect={setSelectedId} 
                    isOpen={true} 
                    categories={categories} 
                    onMoveToCategory={(id, cat) => setConversations(prev => prev.map(c => c.id === id ? { ...c, customCategory: cat } : c))} 
                    onAddCategory={(name) => setCategories([...categories, name])}
                    selectedIds={selectedIds}
                    onToggleSelection={handleToggleSelection}
                    onSelectAll={handleSelectAll}
                  />
              </div>
              <div className="flex-1 flex flex-col h-full bg-white">
                   <ChatWindow key={selectedConversation.id} conversation={selectedConversation} onSendMessage={handleSendMessage} onToggleInfo={() => setRightPanelOpen(!rightPanelOpen)} onAssignCounselor={() => {}} isInfoOpen={rightPanelOpen} />
              </div>
              <div className={`absolute lg:static inset-y-0 right-0 z-30 w-full sm:w-96 bg-white border-l border-slate-200 transition-all duration-300 transform ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}`}>
                  <ClientIntelligence 
                    conversation={selectedConversation} 
                    isOpen={true} 
                    onUpdateStatus={(status) => handleUpdateStatus(selectedId, status)} 
                    onAddNote={(note) => handleAddNote(selectedId, note)}
                  />
              </div>
            </div>
            {/* BULK ACTION BAR */}
            <BulkActionToolbar 
              selectedCount={selectedIds.length} 
              onClear={() => setSelectedIds([])}
              counselors={counselors}
              categories={categories}
              onBulkAssign={handleBulkAssign}
              onBulkMove={handleBulkMove}
              onBulkMessage={handleBulkMessage}
              onBulkExport={handleBulkExport}
            />
          </div>
        );
      case 'calendar':
        return <CalendarTimeline conversations={conversations} onSelectStudent={(id) => { setSelectedId(id); setCurrentView('inbox'); }} />;
      case 'partners': return <Partners partners={partners} onUpdatePartner={() => {}} onAddPartner={() => {}} onViewApplications={() => {}} />;
      case 'finance': return <Finance />;
      case 'team': return <TeamManagement staff={counselors} onAddTask={() => {}} onToggleTaskStatus={() => {}} onDeleteTask={() => {}} />;
      default: return <Dashboard onOpenNewLead={() => setIsNewLeadModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className={`transition-all duration-300 ease-in-out shrink-0 h-full bg-slate-900 z-50 overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar 
          currentView={currentView} 
          onChangeView={setCurrentView} 
          unreadCount={unreadCount} 
          onToggleCollapse={() => setIsSidebarOpen(false)}
        />
      </div>

      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-6 left-6 z-[60] p-3 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-left-4"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
         {renderContent()}
      </main>
      <NewLeadModal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} onSubmit={() => {}} />
      <AIChatBot />
    </div>
  );
}

export default App;
