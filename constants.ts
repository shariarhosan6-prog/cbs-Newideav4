
import { Conversation, MessageType, SenderType, Partner, CommissionRecord, Counselor, ActivityLog } from './types';

export const MOCK_COUNSELORS: Counselor[] = [
    { 
        id: 's1', name: 'Jessica Wu', avatar: 'https://ui-avatars.com/api/?name=Jessica+Wu&background=ffb6c1&color=fff', 
        role: 'Senior Counselor', department: 'RPL', totalSales: 45000, commissionEarned: 4500, activeDeals: 12, 
        lastActive: new Date(), status: 'online',
        tasks: [{ id: 't1', title: 'Verify Sarah USI', priority: 'high', dueDate: new Date(), status: 'pending' }]
    },
    { 
        id: 's2', name: 'Tom Hardy', avatar: 'https://ui-avatars.com/api/?name=Tom+Hardy&background=add8e6&color=fff', 
        role: 'Junior Counselor', department: 'Admissions', totalSales: 32000, commissionEarned: 3200, activeDeals: 18, 
        lastActive: new Date(Date.now() - 3600000), status: 'busy',
        tasks: []
    },
    { 
        id: 's3', name: 'Amanda Lee', avatar: 'https://ui-avatars.com/api/?name=Amanda+Lee&background=90ee90&color=fff', 
        role: 'Migration Agent', department: 'Legal', totalSales: 58000, commissionEarned: 5800, activeDeals: 8, 
        lastActive: new Date(), status: 'online',
        tasks: []
    },
    { 
        id: 's4', name: 'David Kim', avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=f0e68c&color=fff', 
        role: 'Junior Counselor', department: 'RPL', totalSales: 21000, commissionEarned: 2100, activeDeals: 5, 
        lastActive: new Date(Date.now() - 86400000), status: 'offline',
        tasks: []
    },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    assignedCounselorId: 's1',
    client: {
      id: 'u1',
      name: 'Sarah Jenkins',
      avatar: 'https://picsum.photos/seed/sarah/200/200',
      email: 'sarah.j@example.com',
      phone: '+61 400 123 456',
      location: 'Melbourne, VIC',
      visaStatus: 'Subclass 482',
      visaExpiry: '2024-11-15',
      qualificationTarget: 'Diploma of Project Management',
      experienceYears: 5,
      educationHistory: [
          { id: 'e1', level: 'Year 12', institution: 'Melbourne High', startYear: 2014, endYear: 2015 },
          { id: 'e2', level: 'Bachelor', institution: 'RMIT University', startYear: 2016, endYear: 2019 },
          { id: 'e3', level: 'Masters', institution: 'Monash University', startYear: 2022, endYear: 2024 }
      ]
    },
    source: 'direct',
    superAgentStatus: 'processing',
    unreadCount: 1,
    status: 'active',
    priority: 'high',
    lastActive: new Date(),
    progressStage: 60,
    currentStep: 'Mediator Review',
    paymentTotal: 2500,
    paymentPaid: 1250,
    activities: [
        { id: 'a1', staffId: 'admin', staffName: 'Alex (Admin)', action: 'Assigned file to Jessica Wu', timestamp: new Date(Date.now() - 86400000 * 3) },
        { id: 'a2', staffId: 's1', staffName: 'Jessica Wu', action: 'Requested missing USI Transcript', timestamp: new Date(Date.now() - 86400000) }
    ],
    documents: [
      { id: 'd1', name: 'Resume / CV', status: 'verified', uploadDate: new Date('2024-05-10'), confidence: 98 },
      { id: 'd2', name: 'Employment Reference 1', status: 'verified', uploadDate: new Date('2024-05-12'), confidence: 95 },
      { id: 'd4', name: 'Photo ID', status: 'verified', uploadDate: new Date('2024-05-01'), confidence: 99 },
      { id: 'd5', name: 'USI Transcript', status: 'missing' }
    ],
    messages: [
      { id: 'm1', sender: SenderType.AGENT, type: MessageType.TEXT, content: "Hi Sarah! I'm reviewing your file before sending it to the main processing team.", timestamp: new Date(Date.now() - 86400000 * 2), read: true, thread: 'source' },
      { id: 'sa1', sender: SenderType.SUPER_AGENT, type: MessageType.TEXT, content: "Hey, we received the initial intake for Sarah Jenkins. Do you have the USI yet?", timestamp: new Date(Date.now() - 7200000), read: true, thread: 'upstream' },
    ],
  },
  {
    id: 'c2',
    assignedCounselorId: 's2',
    client: {
      id: 'u2',
      name: 'Michael Chen',
      avatar: 'https://picsum.photos/seed/michael/200/200',
      email: 'm.chen@example.com',
      phone: '+61 411 987 654',
      location: 'Sydney, NSW',
      visaStatus: 'Student 500',
      visaExpiry: '2025-02-20',
      qualificationTarget: 'Cert IV in Commercial Cookery',
      experienceYears: 3,
      educationHistory: []
    },
    source: 'sub_agent',
    subAgentName: 'Global Ed Consultancy',
    superAgentStatus: 'not_started',
    unreadCount: 0,
    status: 'lead',
    priority: 'medium',
    lastActive: new Date(Date.now() - 86400000),
    progressStage: 10,
    currentStep: 'Initial Assessment',
    paymentTotal: 3000,
    paymentPaid: 0,
    activities: [
        { id: 'b1', staffId: 's2', staffName: 'Tom Hardy', action: 'Initiated first contact', timestamp: new Date(Date.now() - 86400000) }
    ],
    documents: [],
    messages: [],
  }
];

export const PROGRESS_STEPS = ['Intake', 'Doc Check', 'Mediator Verified', 'Super Agent', 'Complete'];

export const MOCK_PARTNERS: Partner[] = [
    { id: 'p1', name: 'StudyPath RTO', type: 'RTO', contactPerson: 'David Ross', email: 'admissions@studypath.edu.au', activeStudents: 12, commissionRate: '25%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Study+Path&background=6366f1&color=fff' },
    { id: 'p2', name: 'Global Ed Consultancy', type: 'Sub-Agent', contactPerson: 'Priya Kapoor', email: 'priya@globaled.com', activeStudents: 8, commissionRate: '15%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Global+Ed&background=f59e0b&color=fff' },
];

export const MOCK_COMMISSIONS: CommissionRecord[] = [
    { id: 'tx1', clientId: 'u1', clientName: 'Sarah Jenkins', description: 'Commission from StudyPath RTO', amount: 800, type: 'incoming', status: 'pending', dueDate: new Date('2024-06-01'), relatedEntityName: 'StudyPath RTO' },
];
