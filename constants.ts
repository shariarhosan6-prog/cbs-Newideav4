
import { Conversation, MessageType, SenderType, Partner, CommissionRecord, Counselor, ActivityLog } from './types';

export const MOCK_COUNSELORS: Counselor[] = [
    { 
        id: 's1', name: 'Jessica Wu', avatar: 'https://ui-avatars.com/api/?name=Jessica+Wu&background=ffb6c1&color=fff', 
        role: 'Senior Counselor', department: 'RPL', totalSales: 45000, commissionEarned: 4500, activeDeals: 12, 
        lastActive: new Date(), status: 'online', tasks: []
    },
    { 
        id: 's2', name: 'Tom Hardy', avatar: 'https://ui-avatars.com/api/?name=Tom+Hardy&background=add8e6&color=fff', 
        role: 'Junior Counselor', department: 'Admissions', totalSales: 32000, commissionEarned: 3200, activeDeals: 18, 
        lastActive: new Date(), status: 'busy', tasks: []
    },
    { 
        id: 's3', name: 'Amanda Lee', avatar: 'https://ui-avatars.com/api/?name=Amanda+Lee&background=90ee90&color=fff', 
        role: 'Migration Agent', department: 'Legal', totalSales: 58000, commissionEarned: 5800, activeDeals: 8, 
        lastActive: new Date(), status: 'online', tasks: []
    },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'StudyPath RTO', type: 'RTO', contactPerson: 'David Ross', email: 'admissions@studypath.edu.au', activeStudents: 12, commissionRate: '25%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Study+Path&background=6366f1&color=fff' },
  { id: 'p3', name: 'Victoria University', type: 'University', contactPerson: 'Mark Sloan', email: 'international@vu.edu.au', activeStudents: 45, commissionRate: '15%', status: 'active', logo: 'https://ui-avatars.com/api/?name=Victoria+Uni&background=000&color=fff' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  // --- EXISTING 15 FILES ---
  {
    id: 'c1', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
      id: 'u1', name: 'Sarah Jenkins', avatar: 'https://picsum.photos/seed/sarah/200/200',
      email: 'sarah.j@example.com', phone: '+61 400 123 456', location: 'Melbourne, VIC',
      visaStatus: 'Subclass 482', visaExpiry: '2024-11-15', qualificationTarget: 'Diploma of Project Management',
      experienceYears: 5, educationHistory: [{ id: 'e1', level: 'Year 12', institution: 'Melbourne High', startYear: 2014, endYear: 2015 }, { id: 'e2', level: 'Bachelor', institution: 'RMIT', startYear: 2016, endYear: 2019 }]
    },
    source: 'direct', superAgentStatus: 'processing', unreadCount: 1, status: 'active', priority: 'high', currentStage: 'mediator_review', lastActive: new Date(), progressStage: 60, currentStep: 'Mediator Review', paymentTotal: 2500, paymentPaid: 1250,
    sentiment: 'anxious', visaRiskLevel: 'high', activities: [], documents: [{ id: 'd1', name: 'Resume', status: 'verified' }, { id: 'd2', name: 'USI', status: 'missing' }],
    messages: [{ id: 'm1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "My visa is expiring soon, can we hurry?", timestamp: new Date(), read: false, thread: 'source' }],
  },
  {
    id: 'c2', assignedCounselorId: 's2', partnerId: 'p1',
    client: {
      id: 'u2', name: 'Michael Chen', avatar: 'https://picsum.photos/seed/michael/200/200',
      email: 'm.chen@example.com', phone: '+61 411 987 654', location: 'Sydney, NSW',
      visaStatus: 'Student 500', visaExpiry: '2025-06-20', qualificationTarget: 'Cert IV in Commercial Cookery',
      experienceYears: 3, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Global Ed', superAgentStatus: 'not_started', unreadCount: 0, status: 'lead', priority: 'medium', currentStage: 'lead', lastActive: new Date(Date.now() - 3600000 * 5), progressStage: 10, currentStep: 'Initial Assessment', paymentTotal: 3000, paymentPaid: 0,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c3', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u3', name: 'David Brown', avatar: 'https://picsum.photos/seed/david/200/200',
        email: 'd.brown@example.com', phone: '+61 422 111 222', location: 'Brisbane, QLD',
        visaStatus: 'Subclass 485', visaExpiry: '2025-08-10', qualificationTarget: 'Cert III in Carpentry',
        experienceYears: 10, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'evidence_collection', lastActive: new Date(Date.now() - 86400000), progressStage: 30, currentStep: 'Evidence Collection', paymentTotal: 4500, paymentPaid: 1000,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [{ id: 'd30', name: 'Work Photos', status: 'pending' }], messages: [],
  },
  {
    id: 'c5', assignedCounselorId: 's3', partnerId: 'p1',
    client: {
        id: 'u5', name: 'Samuel Lee', avatar: 'https://picsum.photos/seed/samuel/200/200',
        email: 'sam.lee@example.com', phone: '+61 499 888 777', location: 'Perth, WA',
        visaStatus: 'Subclass 482', visaExpiry: '2026-01-20', qualificationTarget: 'Dip. of Leadership & Mgmt',
        experienceYears: 8, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'rto_submission', lastActive: new Date(), progressStage: 85, currentStep: 'RTO Processing', paymentTotal: 2200, paymentPaid: 2200,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [{ id: 'd50', name: 'Ref Letter', status: 'verified' }], messages: [],
  },
  {
    id: 'c7', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u7', name: 'Ahmed Khan', avatar: 'https://picsum.photos/seed/ahmed/200/200',
        email: 'ahmed.k@example.com', phone: '+61 488 111 000', location: 'Sydney, NSW',
        visaStatus: 'Graduate 485', visaExpiry: '2025-09-12', qualificationTarget: 'Cert III in Electrotechnology',
        experienceYears: 6, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'evidence_collection', lastActive: new Date(), progressStage: 20, currentStep: 'Evidence Collection', paymentTotal: 5000, paymentPaid: 2500,
    sentiment: 'urgent', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
  },
  {
    id: 'c8', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u8', name: 'Maria Garcia', avatar: 'https://picsum.photos/seed/maria/200/200',
        email: 'maria.g@example.com', phone: '+61 477 222 333', location: 'Melbourne, VIC',
        visaStatus: 'Visitor 600', visaExpiry: '2024-10-30', qualificationTarget: 'Cert III in Early Childhood',
        experienceYears: 4, educationHistory: []
    },
    // Fixed: 'medi_review' is not a valid ApplicationStage, changed to 'mediator_review'
    source: 'sub_agent', subAgentName: 'VisaReady', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'mediator_review', lastActive: new Date(), progressStage: 55, currentStep: 'Mediator Review', paymentTotal: 1800, paymentPaid: 1800,
    sentiment: 'positive', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
  },
  {
    id: 'c9', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u9', name: 'Wei Zhang', avatar: 'https://picsum.photos/seed/wei/200/200',
        email: 'wei.z@example.com', phone: '+61 466 555 444', location: 'Hobart, TAS',
        visaStatus: 'Student 500', visaExpiry: '2025-07-20', qualificationTarget: 'Diploma of ICT Support',
        experienceYears: 7, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'certified', lastActive: new Date(), progressStage: 100, currentStep: 'Certified', paymentTotal: 3200, paymentPaid: 3200,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c10', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u10', name: 'Fatima Al-Farsi', avatar: 'https://picsum.photos/seed/fatima/200/200',
        email: 'fatima.f@example.com', phone: '+61 455 111 222', location: 'Gold Coast, QLD',
        visaStatus: 'Subclass 482', visaExpiry: '2026-11-01', qualificationTarget: 'Cert IV in Business Admin',
        experienceYears: 5, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Elite', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'evidence_collection', lastActive: new Date(), progressStage: 25, currentStep: 'Evidence Collection', paymentTotal: 2000, paymentPaid: 500,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },

  // --- NEW RPL FILES (6 MORE) ---
  {
    id: 'c16', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u16', name: 'Rohan Gupta', avatar: 'https://picsum.photos/seed/rohan/200/200',
        email: 'rohan.g@example.com', phone: '+61 433 999 000', location: 'Darwin, NT',
        visaStatus: 'Student 500', visaExpiry: '2025-03-10', qualificationTarget: 'Cert III in Plumbing',
        experienceYears: 12, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'evidence_collection', lastActive: new Date(), progressStage: 15, currentStep: 'Evidence Collection', paymentTotal: 4800, paymentPaid: 1000,
    sentiment: 'urgent', visaRiskLevel: 'high', activities: [], documents: [], messages: [],
  },
  {
    id: 'c17', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u17', name: 'Liam Wilson', avatar: 'https://picsum.photos/seed/liam/200/200',
        email: 'liam.w@example.com', phone: '+61 422 777 666', location: 'Sunshine Coast, QLD',
        visaStatus: 'Student 500', visaExpiry: '2025-10-05', qualificationTarget: 'Cert III in Painting',
        experienceYears: 8, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'evidence_collection', lastActive: new Date(), progressStage: 35, currentStep: 'Evidence Collection', paymentTotal: 3500, paymentPaid: 1500,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c18', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u18', name: 'Diego Torres', avatar: 'https://picsum.photos/seed/diego/200/200',
        email: 'diego.t@example.com', phone: '+61 411 555 333', location: 'Sydney, NSW',
        visaStatus: 'Subclass 482', visaExpiry: '2026-04-20', qualificationTarget: 'Cert III in Automotive',
        experienceYears: 15, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'TradeLink', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'mediator_review', lastActive: new Date(), progressStage: 50, currentStep: 'Mediator Review', paymentTotal: 5200, paymentPaid: 2600,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c19', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u19', name: 'Anya Ivanova', avatar: 'https://picsum.photos/seed/anya/200/200',
        email: 'anya.i@example.com', phone: '+61 400 333 111', location: 'Melbourne, VIC',
        visaStatus: 'Student 500', visaExpiry: '2024-12-25', qualificationTarget: 'Diploma of Early Childhood',
        experienceYears: 6, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 1, status: 'active', priority: 'high', currentStage: 'evidence_collection', lastActive: new Date(), progressStage: 20, currentStep: 'Evidence Collection', paymentTotal: 2800, paymentPaid: 800,
    sentiment: 'anxious', visaRiskLevel: 'high', activities: [], documents: [], messages: [{ id: 'anya_m1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Can I use my overseas transcript for RPL?", timestamp: new Date(), read: false, thread: 'source' }],
  },
  {
    id: 'c20', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u20', name: 'Raj Patel', avatar: 'https://picsum.photos/seed/raj/200/200',
        email: 'raj.p@example.com', phone: '+61 499 111 222', location: 'Perth, WA',
        visaStatus: 'Subclass 485', visaExpiry: '2025-07-15', qualificationTarget: 'Diploma of Hospitality Mgmt',
        experienceYears: 9, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Global Ed', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'rto_submission', lastActive: new Date(), progressStage: 80, currentStep: 'RTO Processing', paymentTotal: 3400, paymentPaid: 3400,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c21', assignedCounselorId: 's1', partnerId: 'p1',
    client: {
        id: 'u21', name: 'Hassan Mahmoud', avatar: 'https://picsum.photos/seed/hassan/200/200',
        email: 'hassan.m@example.com', phone: '+61 488 222 333', location: 'Adelaide, SA',
        visaStatus: 'Subclass 482', visaExpiry: '2026-09-12', qualificationTarget: 'Cert IV in Kitchen Mgmt',
        experienceYears: 7, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'lead', lastActive: new Date(), progressStage: 5, currentStep: 'Intake Enquiry', paymentTotal: 3100, paymentPaid: 0,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },

  // --- ADMISSIONS CATEGORY (9 TOTAL FILES) ---
  {
    id: 'c4', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u4', name: 'Elena Rodriguez', avatar: 'https://picsum.photos/seed/elena/200/200',
        email: 'elena.r@example.com', phone: '+61 455 666 777', location: 'Adelaide, SA',
        visaStatus: 'Visitor 600', visaExpiry: '2024-12-01', qualificationTarget: 'Master of Public Health',
        experienceYears: 2, educationHistory: [{ id: 'e4', level: 'Bachelor', institution: 'Madrid Uni', startYear: 2018, endYear: 2022 }]
    },
    source: 'sub_agent', subAgentName: 'VisaFast', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'app_lodged', lastActive: new Date(Date.now() - 3600000), progressStage: 40, currentStep: 'App Lodged', paymentTotal: 38000, paymentPaid: 5000,
    sentiment: 'anxious', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
  },
  {
    id: 'c6', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u6', name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/priya/200/200',
        email: 'priya.s@example.com', phone: '+61 433 222 111', location: 'Darwin, NT',
        visaStatus: 'Student 500', visaExpiry: '2027-02-15', qualificationTarget: 'Bachelor of Nursing',
        experienceYears: 1, educationHistory: [{ id: 'e6', level: 'Year 12', institution: 'DPS India', startYear: 2021, endYear: 2023 }]
    },
    source: 'sub_agent', subAgentName: 'Global Ed', superAgentStatus: 'accepted', unreadCount: 0, status: 'completed', priority: 'low', currentStage: 'coe_issued', lastActive: new Date(Date.now() - 172800000), progressStage: 100, currentStep: 'CoE Issued', paymentTotal: 45000, paymentPaid: 45000,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c11', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u11', name: 'Yuki Tanaka', avatar: 'https://picsum.photos/seed/yuki/200/200',
        email: 'yuki.t@example.com', phone: '+61 422 999 000', location: 'Sydney, NSW',
        visaStatus: 'Student 500', visaExpiry: '2025-05-10', qualificationTarget: 'Master of Data Science',
        experienceYears: 3, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'conditional_offer', lastActive: new Date(), progressStage: 60, currentStep: 'Conditional Offer', paymentTotal: 42000, paymentPaid: 10000,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c12', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u12', name: 'Kevin O\'Connor', avatar: 'https://picsum.photos/seed/kevin/200/200',
        email: 'kevin.o@example.com', phone: '+61 411 777 888', location: 'Melbourne, VIC',
        visaStatus: 'Student 500', visaExpiry: '2026-03-20', qualificationTarget: 'Master of Nursing (GE)',
        experienceYears: 2, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Global Ed', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'gte_assessment', lastActive: new Date(), progressStage: 75, currentStep: 'GTE / GS Check', paymentTotal: 48000, paymentPaid: 15000,
    sentiment: 'anxious', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
  },
  {
    id: 'c13', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u13', name: 'Linda Ng', avatar: 'https://picsum.photos/seed/linda/200/200',
        email: 'linda.n@example.com', phone: '+61 400 555 666', location: 'Brisbane, QLD',
        visaStatus: 'Subclass 485', visaExpiry: '2025-12-10', qualificationTarget: 'MBA (Executive)',
        experienceYears: 10, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'lead', lastActive: new Date(), progressStage: 5, currentStep: 'Uni Enquiry', paymentTotal: 55000, paymentPaid: 0,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c14', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u14', name: 'Arjun Singh', avatar: 'https://picsum.photos/seed/arjun/200/200',
        email: 'arjun.s@example.com', phone: '+61 499 123 321', location: 'Melbourne, VIC',
        visaStatus: 'Student 500', visaExpiry: '2027-01-15', qualificationTarget: 'Master of Accounting',
        experienceYears: 1, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'VisaFast', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'app_lodged', lastActive: new Date(), progressStage: 45, currentStep: 'App Lodged', paymentTotal: 32000, paymentPaid: 5000,
    sentiment: 'urgent', visaRiskLevel: 'high', activities: [], documents: [], messages: [],
  },
  {
    id: 'c15', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u15', name: 'Chloe Dubois', avatar: 'https://picsum.photos/seed/chloe/200/200',
        email: 'chloe.d@example.com', phone: '+61 477 666 555', location: 'Hobart, TAS',
        visaStatus: 'Visitor 600', visaExpiry: '2024-11-20', qualificationTarget: 'PhD in Education',
        experienceYears: 5, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'conditional_offer', lastActive: new Date(), progressStage: 65, currentStep: 'Offer Received', paymentTotal: 60000, paymentPaid: 20000,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c22', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u22', name: 'James Kim', avatar: 'https://picsum.photos/seed/james/200/200',
        email: 'james.k@example.com', phone: '+61 466 333 444', location: 'Melbourne, VIC',
        visaStatus: 'Student 500', visaExpiry: '2025-02-14', qualificationTarget: 'Bachelor of IT',
        experienceYears: 0, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'high', currentStage: 'app_lodged', lastActive: new Date(), progressStage: 40, currentStep: 'App Lodged', paymentTotal: 35000, paymentPaid: 5000,
    sentiment: 'anxious', visaRiskLevel: 'medium', activities: [], documents: [], messages: [],
  },
  {
    id: 'c23', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u23', name: 'Sophie Martin', avatar: 'https://picsum.photos/seed/sophie/200/200',
        email: 'sophie.m@example.com', phone: '+61 455 222 111', location: 'Sydney, NSW',
        visaStatus: 'Visitor 600', visaExpiry: '2024-10-10', qualificationTarget: 'Master of Law (LLM)',
        experienceYears: 4, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Elite', superAgentStatus: 'processing', unreadCount: 1, status: 'active', priority: 'high', currentStage: 'conditional_offer', lastActive: new Date(), progressStage: 60, currentStep: 'Conditional Offer', paymentTotal: 52000, paymentPaid: 15000,
    sentiment: 'urgent', visaRiskLevel: 'critical', activities: [], documents: [], messages: [{ id: 'sophie_m1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Can I accept my offer today?", timestamp: new Date(), read: false, thread: 'source' }],
  },
  {
    id: 'c24', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u24', name: 'Ali Rezai', avatar: 'https://picsum.photos/seed/ali/200/200',
        email: 'ali.r@example.com', phone: '+61 444 888 999', location: 'Perth, WA',
        visaStatus: 'Student 500', visaExpiry: '2026-08-20', qualificationTarget: 'Bachelor of Engineering',
        experienceYears: 2, educationHistory: []
    },
    source: 'direct', superAgentStatus: 'not_started', unreadCount: 0, status: 'active', priority: 'low', currentStage: 'gte_assessment', lastActive: new Date(), progressStage: 70, currentStep: 'GTE Assessment', paymentTotal: 41000, paymentPaid: 10000,
    sentiment: 'neutral', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  },
  {
    id: 'c25', assignedCounselorId: 's2', partnerId: 'p3',
    client: {
        id: 'u25', name: 'Fatima Al-Sayed', avatar: 'https://picsum.photos/seed/fatima2/200/200',
        email: 'fatima.s@example.com', phone: '+61 477 999 888', location: 'Brisbane, QLD',
        visaStatus: 'Student 500', visaExpiry: '2025-11-30', qualificationTarget: 'Master of Social Work',
        experienceYears: 3, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Global Ed', superAgentStatus: 'processing', unreadCount: 0, status: 'active', priority: 'medium', currentStage: 'app_lodged', lastActive: new Date(), progressStage: 45, currentStep: 'App Lodged', paymentTotal: 38000, paymentPaid: 5000,
    sentiment: 'positive', visaRiskLevel: 'low', activities: [], documents: [], messages: [],
  }
];

export const PROGRESS_STEPS = ['Intake', 'Doc Check', 'Mediator Verified', 'Super Agent', 'Complete'];

export const MOCK_COMMISSIONS: CommissionRecord[] = [
    { id: 'tx1', clientId: 'u1', clientName: 'Sarah Jenkins', description: 'Commission from StudyPath RTO', amount: 800, type: 'incoming', status: 'pending', dueDate: new Date('2024-06-01'), relatedEntityName: 'StudyPath RTO' },
];
