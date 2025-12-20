
import { Conversation, MessageType, SenderType, Partner, Counselor, CommissionRecord } from './types';

// Exported mock data for counselors as required by App.tsx and Finance.tsx
export const MOCK_COUNSELORS: Counselor[] = [
  {
    id: 's1',
    name: 'Jessica Wu',
    avatar: 'https://i.pravatar.cc/150?u=jessica',
    role: 'Senior Counselor',
    department: 'RPL',
    activeDeals: 18,
    commissionEarned: 14200,
    totalSales: 150000,
    status: 'online',
    tasks: [
      { id: 't1', title: 'Review compliance for Sarah Jenkins', priority: 'high', dueDate: new Date(), status: 'pending' },
      { id: 't2', title: 'Verify GTE documents', priority: 'medium', dueDate: new Date(Date.now() + 86400000), status: 'pending' }
    ]
  },
  {
    id: 's2',
    name: 'Tom Hardy',
    avatar: 'https://i.pravatar.cc/150?u=tom',
    role: 'Junior Counselor',
    department: 'Admissions',
    activeDeals: 12,
    commissionEarned: 8500,
    totalSales: 95000,
    status: 'busy',
    tasks: [
      { id: 't3', title: 'Follow up with StudyPath RTO', priority: 'medium', dueDate: new Date(), status: 'pending' }
    ]
  }
];

// Exported mock data for partners as required by App.tsx
export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Global Ed BD',
    type: 'Sub-Agent',
    contactPerson: 'Rahman Khan',
    email: 'admissions@globaledbd.com',
    activeStudents: 42,
    commissionRate: '15%',
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=GE&background=random'
  },
  {
    id: 'p2',
    name: 'StudyPath RTO',
    type: 'RTO',
    contactPerson: 'Sarah Miller',
    email: 'enrol@studypath.edu.au',
    activeStudents: 28,
    commissionRate: '20%',
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=SP&background=random'
  }
];

// Exported mock data for commissions as required by Finance.tsx
export const MOCK_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'tx1',
    clientId: 'u1',
    clientName: 'Sarah Jenkins',
    description: 'Initial Deposit Received',
    amount: 1500,
    type: 'incoming',
    status: 'paid',
    dueDate: new Date(Date.now() - 86400000 * 5),
    relatedEntityName: 'StudyPath RTO'
  },
  {
    id: 'tx2',
    clientId: 'u1',
    clientName: 'Sarah Jenkins',
    description: 'Sub-Agent Lead Commission',
    amount: 225,
    type: 'outgoing_sub_agent',
    status: 'pending',
    dueDate: new Date(Date.now() + 86400000 * 7),
    relatedEntityName: 'Global Ed BD'
  },
  {
    id: 'tx3',
    clientId: 'u1',
    clientName: 'Sarah Jenkins',
    description: 'Counselor Performance Bonus',
    amount: 150,
    type: 'outgoing_staff',
    status: 'pending',
    dueDate: new Date(Date.now() + 86400000 * 14),
    relatedEntityName: 'Jessica Wu'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', assignedCounselorId: 's1',
    client: {
      id: 'u1', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah',
      email: 'sarah.j@example.com', phone: '+61 400 123 456', location: 'Melbourne, VIC',
      visaStatus: 'Subclass 482', qualificationTarget: 'Diploma of Project Management',
      experienceYears: 5, 
      educationHistory: [{ id: 'e1', level: 'Bachelor', institution: 'NSU Bangladesh', startYear: 2016, endYear: 2020 }]
    },
    source: 'sub_agent', subAgentName: 'Global Ed Bangladesh', unreadCount: 1, status: 'active', priority: 'high', 
    currentStage: 'sop_drafting', lastActive: new Date(), paymentTotal: 4500, paymentPaid: 2500,
    visaRiskLevel: 'high', gsScore: 82, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'review_required',
    documents: [
        { id: 'd1', name: 'Passport Main Page', status: 'verified', type: 'identity', uploadDate: new Date() },
        { id: 'd2', name: 'Bank Stmt (3 Months)', status: 'pending', type: 'financial', uploadDate: new Date() },
        { id: 'd3', name: 'Experience Certificate', status: 'requested', type: 'employment', requestedDate: new Date(), deadline: new Date(Date.now() + 86400000 * 3), autoReminder: true },
        { id: 'd4', name: 'English Test Results', status: 'missing', type: 'academic' }
    ],
    messages: [
        { id: 'm1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Has my SOP been reviewed yet?", timestamp: new Date(), thread: 'source' },
        { id: 'm2', sender: SenderType.AGENT, type: MessageType.TEXT, content: "Reviewing it now with the Head Counselor. Will update shortly.", timestamp: new Date(), thread: 'internal' }
    ],
    journey: [], onshoreStatus: 'landed'
  }
];
