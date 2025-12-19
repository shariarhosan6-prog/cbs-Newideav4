
import { Conversation, MessageType, SenderType, Partner, CommissionRecord, Counselor } from './types';

export const MOCK_COUNSELORS: Counselor[] = [
    { 
        id: 's1', name: 'Jessica Wu', avatar: 'https://ui-avatars.com/api/?name=Jessica+Wu&background=6366f1&color=fff', 
        role: 'Senior Counselor', department: 'RPL', totalSales: 45000, commissionEarned: 4500, activeDeals: 12, 
        lastActive: new Date(), status: 'online', tasks: []
    },
    { 
        id: 's2', name: 'Tom Hardy', avatar: 'https://ui-avatars.com/api/?name=Tom+Hardy&background=0f172a&color=fff', 
        role: 'Junior Counselor', department: 'Admissions', totalSales: 32000, commissionEarned: 3200, activeDeals: 18, 
        lastActive: new Date(), status: 'busy', tasks: []
    },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'StudyPath RTO', type: 'RTO', contactPerson: 'David Ross', email: 'admissions@studypath.edu.au', activeStudents: 12, commissionRate: '25%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Study+Path&background=6366f1&color=fff' },
  { id: 'p3', name: 'Victoria University', type: 'University', contactPerson: 'Mark Sloan', email: 'international@vu.edu.au', activeStudents: 45, commissionRate: '15%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Victoria+Uni&background=000&color=fff' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
      id: 'u1', name: 'Sarah Jenkins', avatar: 'https://picsum.photos/seed/sarah/200/200',
      email: 'sarah.j@example.com', phone: '+61 400 123 456', location: 'Melbourne, VIC',
      visaStatus: 'Subclass 482', visaExpiry: '2024-11-15', qualificationTarget: 'Diploma of Project Management',
      experienceYears: 5, 
      educationHistory: [
          { id: 'e1', level: 'Bachelor', institution: 'NSU Bangladesh', startYear: 2016, endYear: 2020 },
          { id: 'e2', level: 'Diploma', institution: 'Sydney Institute of Business', startYear: 2021, endYear: 2022 }
      ]
    },
    source: 'sub_agent', subAgentName: 'Global Ed Bangladesh', superAgentStatus: 'processing', unreadCount: 1, status: 'active', priority: 'high', currentStage: 'mediator_review', lastActive: new Date(), progressStage: 60, currentStep: 'Onshore Processing', paymentTotal: 4500, paymentPaid: 2500,
    sentiment: 'anxious', visaRiskLevel: 'high', activities: [], 
    documents: [
        { id: 'd1', name: 'Passport Main Page', status: 'verified', uploadDate: new Date(2023, 11, 15) },
        { id: 'd2', name: 'Updated CV 2024', status: 'verified', uploadDate: new Date(2024, 0, 5) },
        { id: 'd3', name: 'Reference Letter - Google', status: 'pending', uploadDate: new Date(2024, 1, 10) }
    ],
    messages: [{ id: 'm1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "I am now in Sydney, can we start my RPL?", timestamp: new Date(), read: false, thread: 'source' }],
    journey: [
        { id: 'j1', serviceType: 'admission', title: 'Offshore Enrollment (BD)', status: 'completed', startDate: new Date(2023, 5, 1) },
        { id: 'j2', serviceType: 'visa', title: 'Visa Grant (S500)', status: 'completed', startDate: new Date(2023, 9, 15) },
        { id: 'j3', serviceType: 'rpl', title: 'Diploma of PM (Onshore)', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: true, onshoreStatus: 'landed'
  },
  {
    id: 'c2', assignedCounselorId: 's1',
    client: {
      id: 'u2', name: 'Rafiqul Islam', avatar: 'https://ui-avatars.com/api/?name=Rafiqul+Islam&background=random',
      email: 'rafiq.bd@example.com', phone: '+880 1711 223344', location: 'Dhaka, Bangladesh',
      visaStatus: 'Applying', visaExpiry: '', qualificationTarget: 'Master of IT',
      experienceYears: 2, 
      educationHistory: [{ id: 'e3', level: 'Bachelor', institution: 'Dhaka University', startYear: 2018, endYear: 2022 }]
    },
    source: 'sub_agent', subAgentName: 'Elite Careers BD', superAgentStatus: 'not_started', unreadCount: 0, status: 'lead', priority: 'medium', currentStage: 'gte_assessment', lastActive: new Date(), progressStage: 10, currentStep: 'Offshore Intake', paymentTotal: 22000, paymentPaid: 0,
    sentiment: 'neutral', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j4', serviceType: 'admission', title: 'GTE Assessment Phase', status: 'active', startDate: new Date() },
        { id: 'j5', serviceType: 'visa', title: 'Subclass 500 Lodgement', status: 'upcoming', startDate: new Date() }
    ],
    isB2BSettled: false, onshoreStatus: 'offshore'
  },
  {
    id: 'c3', assignedCounselorId: 's2',
    client: {
      id: 'u3', name: 'Michael Chen', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
      email: 'm.chen@example.com', phone: '+61 411 222 333', location: 'Brisbane, QLD',
      visaStatus: 'Student 500', visaExpiry: '2025-12-01', qualificationTarget: 'Cert IV Commercial Cookery',
      experienceYears: 4, 
      educationHistory: [{ id: 'e4', level: 'Year 12', institution: 'Shanghai High', startYear: 2014, endYear: 2017 }]
    },
    source: 'direct', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'evidence_collection', lastActive: new Date(), progressStage: 40, currentStep: 'Evidence Phase', paymentTotal: 3500, paymentPaid: 1000,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [{ id: 'd_m1', name: 'Passport', status: 'verified', uploadDate: new Date() }], messages: [],
    journey: [
        { id: 'j6', serviceType: 'admission', title: 'Offshore Enrollment', status: 'completed', startDate: new Date(2022, 1, 1) },
        { id: 'j7', serviceType: 'visa', title: 'Visa Granted', status: 'completed', startDate: new Date(2022, 5, 1) },
        { id: 'j8', serviceType: 'rpl', title: 'Chef RPL (Onshore)', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: true, onshoreStatus: 'landed'
  },
  {
    id: 'c4', assignedCounselorId: 's1',
    client: {
      id: 'u4', name: 'Tanvir Ahmed', avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=random',
      email: 'tanvir@example.com', phone: '+61 455 666 777', location: 'Sydney, NSW',
      visaStatus: 'Graduate 485', visaExpiry: '2026-06-15', qualificationTarget: 'Migration Strategy: 189/190',
      experienceYears: 6, educationHistory: [{ id: 'e5', level: 'Masters', institution: 'Monash University', startYear: 2021, endYear: 2023 }]
    },
    source: 'sub_agent', subAgentName: 'Global Ed Bangladesh', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'lead', lastActive: new Date(), progressStage: 5, currentStep: 'Migration Plan', paymentTotal: 1500, paymentPaid: 1500,
    sentiment: 'urgent', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j9', serviceType: 'admission', title: 'Masters (Completed)', status: 'completed', startDate: new Date(2021, 1, 1) },
        { id: 'j10', serviceType: 'visa', title: 'Subclass 485 Granted', status: 'completed', startDate: new Date(2023, 7, 10) },
        { id: 'j11', serviceType: 'visa', title: 'PR Strategy (Onshore)', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: true, onshoreStatus: 'landed'
  },
  {
    id: 'c5', assignedCounselorId: 's2',
    client: {
      id: 'u5', name: 'Anika Rahman', avatar: 'https://ui-avatars.com/api/?name=Anika+Rahman&background=random',
      email: 'anika@example.com', phone: '+880 1819 000000', location: 'Chittagong, BD',
      visaStatus: 'Applying', visaExpiry: '', qualificationTarget: 'Bachelor of Nursing',
      experienceYears: 0, educationHistory: [{ id: 'e6', level: 'Year 12', institution: 'Cant Public College', startYear: 2019, endYear: 2021 }]
    },
    source: 'sub_agent', subAgentName: 'BD Scholars', superAgentStatus: 'processing', unreadCount: 3, status: 'review', priority: 'medium', currentStage: 'app_lodged', lastActive: new Date(), progressStage: 50, currentStep: 'Visa Lodged', paymentTotal: 28000, paymentPaid: 2000,
    sentiment: 'anxious', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j12', serviceType: 'admission', title: 'CoE Issued (Nursing)', status: 'completed', startDate: new Date(2023, 11, 1) },
        { id: 'j13', serviceType: 'visa', title: 'Visa Decision Pending', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: false, onshoreStatus: 'offshore'
  },
  {
    id: 'c6', assignedCounselorId: 's1',
    client: {
      id: 'u6', name: 'Suresh Kumar', avatar: 'https://ui-avatars.com/api/?name=Suresh+Kumar&background=random',
      email: 'suresh@example.com', phone: '+61 433 111 222', location: 'Perth, WA',
      visaStatus: 'Student 500', visaExpiry: '2025-01-10', qualificationTarget: 'Course Transfer to Automotive',
      experienceYears: 3, educationHistory: [{ id: 'e7', level: 'Diploma', institution: 'WA TAFE', startYear: 2022, endYear: 2023 }]
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'lead', lastActive: new Date(), progressStage: 20, currentStep: 'Release Letter', paymentTotal: 500, paymentPaid: 0,
    sentiment: 'neutral', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j14', serviceType: 'admission', title: 'Original Course', status: 'completed', startDate: new Date(2022, 1, 1) },
        { id: 'j15', serviceType: 'onshore_transfer', title: 'Automotive Switch', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: true, onshoreStatus: 'landed'
  },
  {
    id: 'c7', assignedCounselorId: 's2',
    client: {
      id: 'u7', name: 'Mehedi Hasan', avatar: 'https://ui-avatars.com/api/?name=Mehedi+Hasan&background=random',
      email: 'mehedi@example.com', phone: '+61 477 888 999', location: 'Adelaide, SA',
      visaStatus: 'Student 500', visaExpiry: '2025-08-30', qualificationTarget: 'Cert III Wall & Floor Tiling',
      experienceYears: 8, educationHistory: [{ id: 'e8', level: 'Bachelor', institution: 'RUET Bangladesh', startYear: 2012, endYear: 2016 }]
    },
    source: 'sub_agent', subAgentName: 'Global Ed Bangladesh', superAgentStatus: 'submitted', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'rto_submission', lastActive: new Date(), progressStage: 90, currentStep: 'RTO Pending', paymentTotal: 4200, paymentPaid: 4200,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j16', serviceType: 'admission', title: 'Offshore Admission', status: 'completed', startDate: new Date(2021, 5, 1) },
        { id: 'j17', serviceType: 'visa', title: 'Visa S500 Granted', status: 'completed', startDate: new Date(2021, 9, 10) },
        { id: 'j18', serviceType: 'rpl', title: 'Tiling RPL (Onshore)', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: true, onshoreStatus: 'landed'
  },
  {
    id: 'c8', assignedCounselorId: 's1',
    client: {
      id: 'u8', name: 'Zoya Khan', avatar: 'https://ui-avatars.com/api/?name=Zoya+Khan&background=random',
      email: 'zoya@example.com', phone: '+880 1611 000111', location: 'Dhaka, BD',
      visaStatus: 'Applying', visaExpiry: '', qualificationTarget: 'Master of Accounting',
      experienceYears: 1, educationHistory: [{ id: 'e9', level: 'Bachelor', institution: 'NSU', startYear: 2018, endYear: 2022 }]
    },
    source: 'sub_agent', subAgentName: 'Elite Careers BD', superAgentStatus: 'not_started', unreadCount: 0, status: 'lead', priority: 'medium', currentStage: 'gte_assessment', lastActive: new Date(), progressStage: 35, currentStep: 'GTE Assessment', paymentTotal: 32000, paymentPaid: 0,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j19', serviceType: 'admission', title: 'GTE Documentation', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: false, onshoreStatus: 'offshore'
  },
  {
    id: 'c9', assignedCounselorId: 's1',
    client: {
      id: 'u9', name: 'Liton Das', avatar: 'https://ui-avatars.com/api/?name=Liton+Das&background=random',
      email: 'liton@example.com', phone: '+61 400 999 888', location: 'Melbourne, VIC',
      visaStatus: 'Graduate 485', visaExpiry: '2025-03-20', qualificationTarget: 'Cert III Painting',
      experienceYears: 10, educationHistory: [{ id: 'e10', level: 'Year 12', institution: 'Dhaka College', startYear: 2010, endYear: 2012 }]
    },
    source: 'sub_agent', subAgentName: 'BD Scholars', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'evidence_collection', lastActive: new Date(), progressStage: 30, currentStep: 'Evidence Phase', paymentTotal: 3800, paymentPaid: 500,
    sentiment: 'urgent', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j20', serviceType: 'visa', title: 'Graduate Visa (485)', status: 'completed', startDate: new Date(2023, 3, 15) },
        { id: 'j21', serviceType: 'rpl', title: 'Painting RPL (Onshore)', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: true, onshoreStatus: 'landed'
  },
  {
    id: 'c10', assignedCounselorId: 's2',
    client: {
      id: 'u10', name: 'Fatima Zohra', avatar: 'https://ui-avatars.com/api/?name=Fatima+Zohra&background=random',
      email: 'fatima@example.com', phone: '+880 1911 333444', location: 'Sylhet, BD',
      visaStatus: 'Applying', visaExpiry: '', qualificationTarget: 'Dip of Early Childhood',
      experienceYears: 0, educationHistory: [{ id: 'e11', level: 'Year 12', institution: 'Sylhet Board', startYear: 2021, endYear: 2023 }]
    },
    source: 'sub_agent', subAgentName: 'Sylhet Global', superAgentStatus: 'not_started', unreadCount: 0, status: 'lead', priority: 'low', currentStage: 'lead', lastActive: new Date(), progressStage: 5, currentStep: 'Document Prep', paymentTotal: 12000, paymentPaid: 0,
    sentiment: 'neutral', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
    journey: [
        { id: 'j22', serviceType: 'admission', title: 'Application Started', status: 'active', startDate: new Date() }
    ],
    isB2BSettled: false, onshoreStatus: 'offshore'
  }
];

export const MOCK_COMMISSIONS: CommissionRecord[] = [
  { id: 'tx1', clientId: 'u1', clientName: 'Sarah Jenkins', description: 'RPL Service Fee', amount: 4500, type: 'incoming', status: 'paid', dueDate: new Date(2024, 5, 15), relatedEntityName: 'StudyPath RTO' }
];
