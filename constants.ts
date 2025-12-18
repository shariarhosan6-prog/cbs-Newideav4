
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

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'StudyPath RTO', type: 'RTO', contactPerson: 'David Ross', email: 'admissions@studypath.edu.au', activeStudents: 12, commissionRate: '25%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Study+Path&background=6366f1&color=fff' },
  { id: 'p2', name: 'Global Ed Consultancy', type: 'Sub-Agent', contactPerson: 'Priya Kapoor', email: 'priya@globaled.com', activeStudents: 8, commissionRate: '15%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Global+Ed&background=f59e0b&color=fff' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    assignedCounselorId: 's1',
    partnerId: 'p1',
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
      ]
    },
    source: 'direct',
    superAgentStatus: 'processing',
    unreadCount: 1,
    status: 'active',
    priority: 'high',
    currentStage: 'mediator_review',
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
      { id: 'd5', name: 'USI Transcript', status: 'missing' }
    ],
    messages: [
      { id: 'm1', sender: SenderType.AGENT, type: MessageType.TEXT, content: "Hi Sarah! I'm reviewing your file before sending it to the main processing team.", timestamp: new Date(Date.now() - 86400000 * 2), read: true, thread: 'source' },
    ],
  },
  {
    id: 'c2',
    assignedCounselorId: 's2',
    partnerId: 'p2',
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
    currentStage: 'lead',
    lastActive: new Date(Date.now() - 3600000 * 5),
    progressStage: 10,
    currentStep: 'Initial Assessment',
    paymentTotal: 3000,
    paymentPaid: 0,
    activities: [
        { id: 'b1', staffId: 's2', staffName: 'Tom Hardy', action: 'Initiated first contact', timestamp: new Date(Date.now() - 3600000 * 5) }
    ],
    documents: [
        { id: 'd20', name: 'Photo ID', status: 'missing' },
        { id: 'd21', name: 'Current Visa', status: 'missing' }
    ],
    messages: [
        { id: 'mc1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Hello, I want to apply for the RPL for my cooking experience.", timestamp: new Date(Date.now() - 3600000 * 5), read: true, thread: 'source' }
    ],
  },
  {
    id: 'c3',
    assignedCounselorId: 's3',
    partnerId: 'p1',
    client: {
        id: 'u3',
        name: 'David Brown',
        avatar: 'https://picsum.photos/seed/david/200/200',
        email: 'd.brown@example.com',
        phone: '+61 422 111 222',
        location: 'Brisbane, QLD',
        visaStatus: 'Subclass 485',
        visaExpiry: '2025-08-10',
        qualificationTarget: 'Cert III in Carpentry',
        experienceYears: 10,
        educationHistory: []
    },
    source: 'direct',
    superAgentStatus: 'not_started',
    unreadCount: 0,
    status: 'active',
    priority: 'low',
    currentStage: 'evidence_collection',
    lastActive: new Date(Date.now() - 86400000),
    progressStage: 30,
    currentStep: 'Collecting Evidence',
    paymentTotal: 4500,
    paymentPaid: 1000,
    activities: [
        { id: 'db1', staffId: 's3', staffName: 'Amanda Lee', action: 'Verified initial work photos', timestamp: new Date(Date.now() - 86400000) }
    ],
    documents: [
        { id: 'd30', name: 'Trade Certificate', status: 'pending' },
        { id: 'd31', name: 'Tax Invoices', status: 'verified', uploadDate: new Date() }
    ],
    messages: [],
  },
  {
    id: 'c4',
    assignedCounselorId: 's2',
    partnerId: 'p1',
    client: {
        id: 'u4',
        name: 'Elena Rodriguez',
        avatar: 'https://picsum.photos/seed/elena/200/200',
        email: 'elena.r@example.com',
        phone: '+61 455 666 777',
        location: 'Adelaide, SA',
        visaStatus: 'Visitor 600',
        visaExpiry: '2024-12-01',
        qualificationTarget: 'Master of Public Health',
        experienceYears: 2,
        educationHistory: [
            { id: 'e4', level: 'Bachelor', institution: 'University of Madrid', startYear: 2018, endYear: 2022 }
        ]
    },
    source: 'sub_agent',
    subAgentName: 'VisaFast Agency',
    superAgentStatus: 'processing',
    unreadCount: 0,
    status: 'active',
    priority: 'high',
    currentStage: 'app_lodged',
    lastActive: new Date(Date.now() - 3600000),
    progressStage: 40,
    currentStep: 'App Lodged',
    paymentTotal: 38000,
    paymentPaid: 5000,
    activities: [
        { id: 'er1', staffId: 's2', staffName: 'Tom Hardy', action: 'Lodged application with Flinders Uni', timestamp: new Date(Date.now() - 3600000) }
    ],
    documents: [
        { id: 'd40', name: 'Academic Transcript', status: 'verified' },
        { id: 'd41', name: 'Passport', status: 'verified' }
    ],
    messages: [
        { id: 'er_m1', sender: SenderType.AGENT, type: MessageType.TEXT, content: "Elena, your application for Public Health has been lodged. We'll wait for the letter of offer.", timestamp: new Date(Date.now() - 3600000), read: true, thread: 'source' }
    ],
  },
  {
    id: 'c5',
    assignedCounselorId: 's1',
    partnerId: 'p1',
    client: {
        id: 'u5',
        name: 'Samuel Lee',
        avatar: 'https://picsum.photos/seed/samuel/200/200',
        email: 'sam.lee@example.com',
        phone: '+61 499 888 777',
        location: 'Perth, WA',
        visaStatus: 'Subclass 482',
        visaExpiry: '2026-01-20',
        qualificationTarget: 'Dip. of Leadership & Mgmt',
        experienceYears: 8,
        educationHistory: []
    },
    source: 'direct',
    superAgentStatus: 'processing',
    unreadCount: 0,
    status: 'active',
    priority: 'medium',
    currentStage: 'rto_submission',
    lastActive: new Date(),
    progressStage: 85,
    currentStep: 'RTO Processing',
    paymentTotal: 2200,
    paymentPaid: 2200,
    activities: [
        { id: 'sl1', staffId: 'admin', staffName: 'AI Automator', action: 'Auto-sent file to StudyPath RTO', timestamp: new Date(Date.now() - 7200000) }
    ],
    documents: [
        { id: 'd50', name: 'Experience Letter', status: 'verified' },
        { id: 'd51', name: 'Resume', status: 'verified' }
    ],
    messages: [
        { id: 'sl_m1', sender: SenderType.SYSTEM, type: MessageType.SYSTEM, content: "📧 AI AUTOMATION: Professional email sent to StudyPath RTO.", timestamp: new Date(Date.now() - 7200000), thread: 'source' }
    ],
  },
  {
    id: 'c6',
    assignedCounselorId: 's3',
    partnerId: 'p1',
    client: {
        id: 'u6',
        name: 'Priya Sharma',
        avatar: 'https://picsum.photos/seed/priya/200/200',
        email: 'priya.s@example.com',
        phone: '+61 433 222 111',
        location: 'Darwin, NT',
        visaStatus: 'Student 500',
        visaExpiry: '2027-02-15',
        qualificationTarget: 'Bachelor of Nursing',
        experienceYears: 1,
        educationHistory: [
            { id: 'e6', level: 'Year 12', institution: 'DPS India', startYear: 2021, endYear: 2023 }
        ]
    },
    source: 'sub_agent',
    subAgentName: 'Global Ed Consultancy',
    superAgentStatus: 'accepted',
    unreadCount: 2,
    status: 'completed',
    priority: 'low',
    currentStage: 'coe_issued',
    lastActive: new Date(Date.now() - 172800000),
    progressStage: 100,
    currentStep: 'CoE Issued',
    paymentTotal: 45000,
    paymentPaid: 45000,
    activities: [
        { id: 'ps1', staffId: 's3', staffName: 'Amanda Lee', action: 'CoE received and forwarded to student', timestamp: new Date(Date.now() - 172800000) }
    ],
    documents: [
        { id: 'd60', name: 'IELTS Result', status: 'verified' },
        { id: 'd61', name: 'Financial Statement', status: 'verified' }
    ],
    messages: [
        { id: 'ps_m1', sender: SenderType.AGENT, type: MessageType.TEXT, content: "Congratulations Priya! Your CoE is issued.", timestamp: new Date(Date.now() - 172800000), read: false, thread: 'source' }
    ],
  }
];

export const PROGRESS_STEPS = ['Intake', 'Doc Check', 'Mediator Verified', 'Super Agent', 'Complete'];

export const MOCK_COMMISSIONS: CommissionRecord[] = [
    { id: 'tx1', clientId: 'u1', clientName: 'Sarah Jenkins', description: 'Commission from StudyPath RTO', amount: 800, type: 'incoming', status: 'pending', dueDate: new Date('2024-06-01'), relatedEntityName: 'StudyPath RTO' },
];
