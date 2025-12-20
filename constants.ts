
import { Conversation, MessageType, SenderType, Partner, Counselor, CommissionRecord } from './types';

// Exported mock data for counselors
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

// Exported mock data for partners
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
    logo: 'https://ui-avatars.com/api/?name=GE&background=random',
    successRate: 92,
    commissionPaid: 45000,
    commissionPending: 12000
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
    logo: 'https://ui-avatars.com/api/?name=SP&background=random',
    successRate: 96,
    commissionPaid: 32000,
    commissionPending: 5400
  },
  {
    id: 'p3',
    name: 'Monash University',
    type: 'University',
    contactPerson: 'David Jones',
    email: 'monash@example.edu.au',
    activeStudents: 85,
    commissionRate: '10%',
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=MU&background=random',
    successRate: 88,
    commissionPaid: 120000,
    commissionPending: 45000
  },
  {
    id: 'p4',
    name: 'Elite Careers BD',
    type: 'Sub-Agent',
    contactPerson: 'Tanvir Ahmed',
    email: 'elite@example.com',
    activeStudents: 15,
    commissionRate: '18%',
    status: 'active',
    logo: 'https://ui-avatars.com/api/?name=EC&background=random',
    successRate: 74,
    commissionPaid: 15000,
    commissionPending: 8200
  }
];

// Exported mock data for commissions
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
        { id: 'd3', name: 'Experience Certificate', status: 'requested', type: 'employment', requestedDate: new Date(), deadline: new Date(Date.now() + 86400000 * 3), autoReminder: true }
    ],
    messages: [
        { id: 'm1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Has my SOP been reviewed yet?", timestamp: new Date(), thread: 'source' }
    ],
    notes: [
      { id: 'n1', content: "Client requested fast-track for RPL as current visa subclass 482 is expiring soon. @Jessica confirm if trade assessment is needed.", authorName: "Alex", timestamp: new Date(Date.now() - 86400000), color: 'yellow', mentions: ['Jessica'] },
      { id: 'n2', content: "GTE Risk: Bangladesh source of funds needs double verification. 3 months bank statements showing regular deposits are critical.", authorName: "Jessica", timestamp: new Date(Date.now() - 43200000), color: 'red' }
    ],
    activities: [
      { id: 'a1', type: 'payment_received', content: 'Payment of $1,500 processed via Flywire', actorName: 'System', timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: 'a2', type: 'stage_change', content: 'Moved from Financial Audit to SOP Drafting', actorName: 'Jessica Wu', timestamp: new Date(Date.now() - 86400000) },
      { id: 'a3', type: 'doc_verified', content: 'Passport Main Page verified against AU Home Affairs standard', actorName: 'System (AI)', timestamp: new Date(Date.now() - 43200000) },
      { id: 'a4', type: 'assignment_changed', content: 'File reassigned from Alex to Jessica Wu', actorName: 'Admin', timestamp: new Date(Date.now() - 172800000) }
    ],
    journey: [], onshoreStatus: 'landed',
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c2', assignedCounselorId: 's1',
    client: {
      id: 'u2', name: 'Tanvir Ahmed', avatar: 'https://i.pravatar.cc/150?u=tanvir',
      email: 'tanvir.a@example.com', phone: '+880 1711 000000', location: 'Dhaka, BD',
      visaStatus: 'Offshore', qualificationTarget: 'Masters of Data Science',
      experienceYears: 2, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Elite Careers BD', unreadCount: 0, status: 'active', priority: 'medium', 
    currentStage: 'gs_assessment', lastActive: new Date(Date.now() - 3600000), paymentTotal: 12000, paymentPaid: 0,
    visaRiskLevel: 'low', gsScore: 94, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'not_started',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c3', assignedCounselorId: 's2',
    client: {
      id: 'u3', name: 'Chloe Thompson', avatar: 'https://i.pravatar.cc/150?u=chloe',
      email: 'chloe.t@example.com', phone: '+61 411 222 333', location: 'Sydney, NSW',
      visaStatus: 'Student 500', qualificationTarget: 'Cert IV in Commercial Cookery',
      experienceYears: 1, educationHistory: []
    },
    source: 'direct', unreadCount: 3, status: 'active', priority: 'high', 
    currentStage: 'payment_confirmed', lastActive: new Date(Date.now() - 7200000), paymentTotal: 8500, paymentPaid: 8500,
    visaRiskLevel: 'low', gsScore: 88, medicalStatus: 'completed', biometricStatus: 'completed', sopStatus: 'finalized',
    documents: [{ id: 'd10', name: 'COE Issued', status: 'verified', type: 'academic' }],
    messages: [
        { id: 'm10', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "I just sent the payment receipt. Please check.", timestamp: new Date(), thread: 'source' }
    ],
    journey: [], onshoreStatus: 'landed',
    notes: [
      { id: 'n3', content: "Confirmed $8500 tuition payment. Proceed to COE issuance immediately.", authorName: "Finance Team", timestamp: new Date(), color: 'green' }
    ],
    activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c4', assignedCounselorId: 's2',
    client: {
      id: 'u4', name: 'Liam Wilson', avatar: 'https://i.pravatar.cc/150?u=liam',
      email: 'liam.w@example.com', phone: '+61 433 444 555', location: 'Perth, WA',
      visaStatus: 'Graduate 485', qualificationTarget: 'Professional Year - IT',
      experienceYears: 0, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'active', priority: 'low', 
    currentStage: 'rto_submission', lastActive: new Date(Date.now() - 86400000), paymentTotal: 1200, paymentPaid: 600,
    visaRiskLevel: 'low', gsScore: 91, medicalStatus: 'completed', biometricStatus: 'completed', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'landed',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c5', assignedCounselorId: 's1',
    client: {
      id: 'u5', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?u=priya',
      email: 'priya.s@example.com', phone: '+91 98765 43210', location: 'Mumbai, IN',
      visaStatus: 'Offshore', qualificationTarget: 'Bachelor of Nursing',
      experienceYears: 4, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'India Global Ed', unreadCount: 1, status: 'review', priority: 'high', 
    currentStage: 'visa_lodged', lastActive: new Date(Date.now() - 120000), paymentTotal: 25000, paymentPaid: 25000,
    visaRiskLevel: 'medium', gsScore: 78, medicalStatus: 'completed', biometricStatus: 'booked', sopStatus: 'finalized',
    documents: [], messages: [
        { id: 'm20', sender: SenderType.SYSTEM, type: MessageType.SYSTEM, content: "Visa Application Lodged Successfully.", timestamp: new Date(), thread: 'source' }
    ],
    journey: [], onshoreStatus: 'offshore',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c6', assignedCounselorId: 's1',
    client: {
      id: 'u6', name: 'Marcus Aurelius', avatar: 'https://i.pravatar.cc/150?u=marcus',
      email: 'marcus@rome.it', phone: '+39 06 123456', location: 'Rome, IT',
      visaStatus: 'Visitor 600', qualificationTarget: 'MBA Global Business',
      experienceYears: 10, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'active', priority: 'medium', 
    currentStage: 'financial_audit', lastActive: new Date(Date.now() - 172800000), paymentTotal: 45000, paymentPaid: 5000,
    visaRiskLevel: 'low', gsScore: 98, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'drafting',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c7', assignedCounselorId: 's2',
    client: {
      id: 'u7', name: 'Fatima Zahra', avatar: 'https://i.pravatar.cc/150?u=fatima',
      email: 'fatima@example.ae', phone: '+971 50 1234567', location: 'Dubai, AE',
      visaStatus: 'Offshore', qualificationTarget: 'Masters of Public Health',
      experienceYears: 3, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Gulf Scholars', unreadCount: 2, status: 'active', priority: 'high', 
    currentStage: 'conditional_offer', lastActive: new Date(Date.now() - 43200000), paymentTotal: 18000, paymentPaid: 0,
    visaRiskLevel: 'low', gsScore: 92, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'finalized',
    documents: [], messages: [
        { id: 'm30', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Can I pay the tuition in installments?", timestamp: new Date(), thread: 'source' }
    ],
    journey: [], onshoreStatus: 'offshore',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c8', assignedCounselorId: 's1',
    client: {
      id: 'u8', name: 'Hiroshi Tanaka', avatar: 'https://i.pravatar.cc/150?u=hiroshi',
      email: 'hiroshi@example.jp', phone: '+81 90 1234 5678', location: 'Tokyo, JP',
      visaStatus: 'Working Holiday', qualificationTarget: 'Diploma of Information Technology',
      experienceYears: 2, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'active', priority: 'low', 
    currentStage: 'lead', lastActive: new Date(Date.now() - 604800000), paymentTotal: 9000, paymentPaid: 0,
    visaRiskLevel: 'low', gsScore: 95, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'not_started',
    documents: [], messages: [], journey: [], onshoreStatus: 'landed',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c9', assignedCounselorId: 's2',
    client: {
      id: 'u9', name: 'Elena Petrova', avatar: 'https://i.pravatar.cc/150?u=elena',
      email: 'elena@example.ru', phone: '+7 900 123 45 67', location: 'Moscow, RU',
      visaStatus: 'Offshore', qualificationTarget: 'Bachelor of Civil Engineering',
      experienceYears: 0, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'EuroEdu Russia', unreadCount: 0, status: 'active', priority: 'medium', 
    currentStage: 'visa_granted', lastActive: new Date(Date.now() - 259200000), paymentTotal: 32000, paymentPaid: 32000,
    visaRiskLevel: 'high', gsScore: 65, medicalStatus: 'completed', biometricStatus: 'completed', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c10', assignedCounselorId: 's1',
    client: {
      id: 'u10', name: 'Zainab Abbas', avatar: 'https://i.pravatar.cc/150?u=zainab',
      email: 'zainab@example.pk', phone: '+92 300 1234567', location: 'Lahore, PK',
      visaStatus: 'Offshore', qualificationTarget: 'Masters of Cyber Security',
      experienceYears: 5, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Global Ed Pakistan', unreadCount: 5, status: 'active', priority: 'high', 
    currentStage: 'financial_audit', lastActive: new Date(), paymentTotal: 22000, paymentPaid: 0,
    visaRiskLevel: 'critical', gsScore: 54, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'review_required',
    documents: [
        { id: 'd40', name: 'Bank Statement', status: 'rejected', type: 'financial' }
    ],
    messages: [
        { id: 'm40', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Why was my bank statement rejected?", timestamp: new Date(), thread: 'source' }
    ],
    journey: [], onshoreStatus: 'offshore',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  },
  {
    id: 'c11', assignedCounselorId: 's2',
    client: {
      id: 'u11', name: 'David Smith', avatar: 'https://i.pravatar.cc/150?u=david',
      email: 'david.smith@example.com', phone: '+61 455 666 777', location: 'Brisbane, QLD',
      visaStatus: 'Graduate 485', qualificationTarget: 'Cert III in Automotive Tech',
      experienceYears: 3, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'completed', priority: 'medium', 
    currentStage: 'certified', lastActive: new Date(Date.now() - 31536000000), paymentTotal: 4000, paymentPaid: 4000,
    visaRiskLevel: 'low', gsScore: 90, medicalStatus: 'completed', biometricStatus: 'completed', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'landed',
    notes: [], activities: [],
    // Added missing tasks property
    tasks: []
  }
];

export const PROGRESS_STEPS = ['Intake', 'Doc Check', 'Mediator Verified', 'Super Agent', 'Complete'];
