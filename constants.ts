
import { Conversation, MessageType, SenderType, Partner, Counselor, CommissionRecord } from './types';

export const MOCK_COUNSELORS: Counselor[] = [
    { 
        id: 's1', 
        name: 'Jessica Wu', 
        avatar: 'https://ui-avatars.com/api/?name=Jessica+Wu&background=6366f1&color=fff', 
        role: 'Senior Counselor', 
        department: 'Admissions',
        activeDeals: 12, 
        commissionEarned: 2450, 
        totalSales: 45000, 
        status: 'online', 
        tasks: []
    }
];

export const MOCK_PARTNERS: Partner[] = [
  // --- UNIVERSITIES (Australia Focused) ---
  { 
    id: 'uni1', name: 'University of Melbourne', type: 'University', 
    contactPerson: 'Sarah Thompson', email: 'admissions@unimelb.edu.au', 
    activeStudents: 45, commissionRate: '10%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=UOM&background=002147&color=fff' 
  },
  { 
    id: 'uni2', name: 'Monash University', type: 'University', 
    contactPerson: 'David Miller', email: 'international@monash.edu', 
    activeStudents: 38, commissionRate: '12%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Monash&background=006dae&color=fff' 
  },
  { 
    id: 'uni3', name: 'RMIT University', type: 'University', 
    contactPerson: 'Emma Watson', email: 'apply@rmit.edu.au', 
    activeStudents: 52, commissionRate: '15%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=RMIT&background=e61e2a&color=fff' 
  },
  { 
    id: 'uni4', name: 'UNSW Sydney', type: 'University', 
    contactPerson: 'James Bond', email: 'enquiry@unsw.edu.au', 
    activeStudents: 29, commissionRate: '10%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=UNSW&background=ffcc00&color=000' 
  },
  { 
    id: 'uni5', name: 'University of Sydney', type: 'University', 
    contactPerson: 'Lucy Liu', email: 'global.office@sydney.edu.au', 
    activeStudents: 33, commissionRate: '11%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=USYD&background=e64626&color=fff' 
  },
  { 
    id: 'uni6', name: 'Curtin University', type: 'University', 
    contactPerson: 'Mark Ruffalo', email: 'international@curtin.edu.au', 
    activeStudents: 22, commissionRate: '15%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Curtin&background=444&color=ffcc00' 
  },
  { 
    id: 'uni7', name: 'QUT (Queensland Tech)', type: 'University', 
    contactPerson: 'Steve Rogers', email: 'admissions@qut.edu.au', 
    activeStudents: 18, commissionRate: '14%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=QUT&background=00407a&color=fff' 
  },
  { 
    id: 'uni8', name: 'Griffith University', type: 'University', 
    contactPerson: 'Natasha Romanoff', email: 'apply@griffith.edu.au', 
    activeStudents: 15, commissionRate: '15%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Griffith&background=cc0000&color=fff' 
  },
  { 
    id: 'uni9', name: 'Victoria University', type: 'University', 
    contactPerson: 'Peter Parker', email: 'vu.international@vu.edu.au', 
    activeStudents: 64, commissionRate: '18%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=VU&background=005eb8&color=fff' 
  },
  { 
    id: 'uni10', name: 'Western Sydney Uni', type: 'University', 
    contactPerson: 'Wanda Maximoff', email: 'international@westernsydney.edu.au', 
    activeStudents: 41, commissionRate: '16%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=WSU&background=990033&color=fff' 
  },

  // --- SUB-AGENTS (Lead Generators) ---
  { 
    id: 'sub1', name: 'Global Ed Bangladesh', type: 'Sub-Agent', 
    contactPerson: 'Masud Rana', email: 'dhaka@globaled.com', 
    activeStudents: 85, commissionRate: '25%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=GE+BD&background=006a4e&color=fff' 
  },
  { 
    id: 'sub2', name: 'Dhaka Scholars', type: 'Sub-Agent', 
    contactPerson: 'Fatima Zoya', email: 'admin@dhakascholars.bd', 
    activeStudents: 42, commissionRate: '20%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=DS&background=f42a41&color=fff' 
  },
  { 
    id: 'sub3', name: 'Mumbai Education Hub', type: 'Sub-Agent', 
    contactPerson: 'Amit Patel', email: 'contact@mumbaiedu.in', 
    activeStudents: 31, commissionRate: '30%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=MEH&background=ff9933&color=fff' 
  },
  { 
    id: 'sub4', name: 'Hanoi Gateway', type: 'Sub-Agent', 
    contactPerson: 'Tran Minh', email: 'hanoi@gatewayedu.vn', 
    activeStudents: 19, commissionRate: '25%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Hanoi&background=da251d&color=ff0' 
  },
  { 
    id: 'sub5', name: 'Lahore Consultancy', type: 'Sub-Agent', 
    contactPerson: 'Zaid Khan', email: 'info@lahoreedu.pk', 
    activeStudents: 24, commissionRate: '22%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Lahore&background=01411c&color=fff' 
  },
  { 
    id: 'sub6', name: 'Persian Education', type: 'Sub-Agent', 
    contactPerson: 'Nasser Ali', email: 'nasser@persianedu.ir', 
    activeStudents: 12, commissionRate: '35%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Persian&background=239f40&color=fff' 
  },

  // --- RTOs ---
  { 
    id: 'p1', name: 'StudyPath RTO', type: 'RTO', 
    contactPerson: 'David Ross', email: 'admissions@studypath.edu.au',
    activeStudents: 12, commissionRate: '25%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Study+Path&background=6366f1&color=fff' 
  },
  { 
    id: 'p2', name: 'Skills Australia', type: 'RTO', 
    contactPerson: 'Brendan Smith', email: 'apply@skills.edu.au',
    activeStudents: 56, commissionRate: '20%', status: 'active', 
    logo: 'https://ui-avatars.com/api/?name=Skills+AU&background=ffcc00&color=000' 
  }
];

export const MOCK_COMMISSIONS: CommissionRecord[] = [
  {
    id: 'tx1',
    clientId: 'u1',
    clientName: 'Sarah Jenkins',
    description: 'RPL Fee Payment',
    amount: 4500,
    type: 'incoming',
    status: 'paid',
    dueDate: new Date(),
    relatedEntityName: 'Sarah Jenkins'
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
        { id: 'd1', name: 'Passport Main Page', status: 'verified', type: 'identity' },
        { id: 'd2', name: 'Bank Stmt (3 Months)', status: 'pending', type: 'financial' },
        { id: 'd3', name: 'SOP Draft V1', status: 'pending', type: 'sop' }
    ],
    messages: [
        { id: 'm1', sender: SenderType.CLIENT, type: MessageType.TEXT, content: "Has my SOP been reviewed yet?", timestamp: new Date(), thread: 'source' },
        { id: 'm2', sender: SenderType.AGENT, type: MessageType.TEXT, content: "Reviewing it now with the Head Counselor. Will update shortly.", timestamp: new Date(), thread: 'internal' }
    ],
    journey: [], onshoreStatus: 'landed'
  },
  {
    id: 'c2', assignedCounselorId: 's1',
    client: {
      id: 'u2', name: 'Tanvir Ahmed', avatar: 'https://i.pravatar.cc/150?u=tanvir',
      email: 'tanvir.a@example.com', phone: '+880 1711 222 333', location: 'Dhaka, BD',
      visaStatus: 'Visitor 600', qualificationTarget: 'Cert IV in Kitchen Management',
      experienceYears: 3, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Dhaka Scholars', unreadCount: 0, status: 'active', priority: 'medium', 
    currentStage: 'gs_assessment', lastActive: new Date(), paymentTotal: 3200, paymentPaid: 0,
    visaRiskLevel: 'medium', gsScore: 65, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'not_started',
    documents: [{ id: 'd4', name: 'Academic Transcripts', status: 'verified', type: 'academic' }],
    messages: [], journey: [], onshoreStatus: 'offshore'
  },
  {
    id: 'c3', assignedCounselorId: 's1',
    client: {
      id: 'u3', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?u=priya',
      email: 'priya.s@example.com', phone: '+91 98765 43210', location: 'Delhi, India',
      visaStatus: 'Offshore', qualificationTarget: 'Master of IT',
      experienceYears: 2, educationHistory: []
    },
    source: 'direct', unreadCount: 2, status: 'active', priority: 'high', 
    currentStage: 'visa_lodged', lastActive: new Date(), paymentTotal: 18500, paymentPaid: 18500,
    visaRiskLevel: 'low', gsScore: 94, medicalStatus: 'completed', biometricStatus: 'booked', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore'
  },
  {
    id: 'c4', assignedCounselorId: 's1',
    client: {
      id: 'u4', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=michael',
      email: 'm.chen@example.com', phone: '+61 411 222 333', location: 'Sydney, NSW',
      visaStatus: 'Student 500', qualificationTarget: 'Adv. Diploma of Civil Construction',
      experienceYears: 8, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'active', priority: 'low', 
    currentStage: 'rto_submission', lastActive: new Date(), paymentTotal: 5500, paymentPaid: 1500,
    visaRiskLevel: 'low', gsScore: 98, medicalStatus: 'completed', biometricStatus: 'completed', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'landed'
  },
  {
    id: 'c5', assignedCounselorId: 's1',
    client: {
      id: 'u5', name: 'Anjali Gupta', avatar: 'https://i.pravatar.cc/150?u=anjali',
      email: 'anjali@example.com', phone: '+91 1122334455', location: 'Mumbai, IN',
      visaStatus: 'Offshore', qualificationTarget: 'Bachelor of Nursing',
      experienceYears: 0, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Mumbai Edu Hub', unreadCount: 0, status: 'active', priority: 'medium', 
    currentStage: 'financial_audit', lastActive: new Date(), paymentTotal: 22000, paymentPaid: 0,
    visaRiskLevel: 'high', gsScore: 45, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'drafting',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore'
  },
  {
    id: 'c6', assignedCounselorId: 's1',
    client: {
      id: 'u6', name: 'David Wilson', avatar: 'https://i.pravatar.cc/150?u=david',
      email: 'david.w@example.com', phone: '+44 7700 900000', location: 'London, UK',
      visaStatus: 'Working Holiday', qualificationTarget: 'Diploma of Leadership',
      experienceYears: 10, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'active', priority: 'low', 
    currentStage: 'conditional_offer', lastActive: new Date(), paymentTotal: 4000, paymentPaid: 2000,
    visaRiskLevel: 'low', gsScore: 100, medicalStatus: 'completed', biometricStatus: 'completed', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'landed'
  },
  {
    id: 'c7', assignedCounselorId: 's1',
    client: {
      id: 'u7', name: 'Nguyen Van Minh', avatar: 'https://i.pravatar.cc/150?u=minh',
      email: 'minh.v@example.com', phone: '+84 24 3823 0000', location: 'Hanoi, VN',
      visaStatus: 'Offshore', qualificationTarget: 'Cert III in Carpentry',
      experienceYears: 4, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Hanoi Gateway', unreadCount: 5, status: 'active', priority: 'high', 
    currentStage: 'lead', lastActive: new Date(), paymentTotal: 12000, paymentPaid: 0,
    visaRiskLevel: 'medium', gsScore: 72, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'not_started',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore'
  },
  {
    id: 'c8', assignedCounselorId: 's1',
    client: {
      id: 'u8', name: 'Zahra Khan', avatar: 'https://i.pravatar.cc/150?u=zahra',
      email: 'zahra.k@example.com', phone: '+92 300 1234567', location: 'Lahore, PK',
      visaStatus: 'Offshore', qualificationTarget: 'Diploma of IT',
      experienceYears: 1, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Lahore Consultancy', unreadCount: 0, status: 'active', priority: 'medium', 
    currentStage: 'coe_issued', lastActive: new Date(), paymentTotal: 14500, paymentPaid: 14500,
    visaRiskLevel: 'high', gsScore: 58, medicalStatus: 'completed', biometricStatus: 'pending', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore'
  },
  {
    id: 'c9', assignedCounselorId: 's1',
    client: {
      id: 'u9', name: 'Robert Smith', avatar: 'https://i.pravatar.cc/150?u=robert',
      email: 'robert.s@example.com', phone: '+61 433 444 555', location: 'Perth, WA',
      visaStatus: 'Student 500', qualificationTarget: 'Graduate Diploma of Management',
      experienceYears: 6, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'active', priority: 'low', 
    currentStage: 'visa_granted', lastActive: new Date(), paymentTotal: 9000, paymentPaid: 9000,
    visaRiskLevel: 'low', gsScore: 99, medicalStatus: 'completed', biometricStatus: 'completed', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'landed'
  },
  {
    id: 'c10', assignedCounselorId: 's1',
    client: {
      id: 'u10', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria',
      email: 'm.garcia@example.com', phone: '+34 91 123 45 67', location: 'Madrid, ES',
      visaStatus: 'Offshore', qualificationTarget: 'Diploma of Hospitality',
      experienceYears: 3, educationHistory: []
    },
    source: 'direct', unreadCount: 1, status: 'active', priority: 'medium', 
    currentStage: 'rto_submission', lastActive: new Date(), paymentTotal: 6000, paymentPaid: 3000,
    visaRiskLevel: 'low', gsScore: 95, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'finalized',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore'
  },
  {
    id: 'c11', assignedCounselorId: 's1',
    client: {
      id: 'u11', name: 'Ali Rezai', avatar: 'https://i.pravatar.cc/150?u=ali',
      email: 'ali.r@example.com', phone: '+98 21 1234 5678', location: 'Tehran, IR',
      visaStatus: 'Offshore', qualificationTarget: 'Master of Engineering',
      experienceYears: 5, educationHistory: []
    },
    source: 'sub_agent', subAgentName: 'Persian Education', unreadCount: 0, status: 'active', priority: 'high', 
    currentStage: 'gs_assessment', lastActive: new Date(), paymentTotal: 25000, paymentPaid: 0,
    visaRiskLevel: 'critical', gsScore: 35, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'drafting',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore'
  },
  {
    id: 'c12', assignedCounselorId: 's1',
    client: {
      id: 'u12', name: 'Yuki Sato', avatar: 'https://i.pravatar.cc/150?u=yuki',
      email: 'yuki.s@example.com', phone: '+81 3 1234 5678', location: 'Tokyo, JP',
      visaStatus: 'Offshore', qualificationTarget: 'Diploma of Yoga',
      experienceYears: 2, educationHistory: []
    },
    source: 'direct', unreadCount: 0, status: 'active', priority: 'low', 
    currentStage: 'lead', lastActive: new Date(), paymentTotal: 5000, paymentPaid: 0,
    visaRiskLevel: 'low', gsScore: 100, medicalStatus: 'pending', biometricStatus: 'pending', sopStatus: 'not_started',
    documents: [], messages: [], journey: [], onshoreStatus: 'offshore'
  }
];
