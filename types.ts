

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DOCUMENT = 'document',
  SYSTEM = 'system',
}

export enum SenderType {
  CLIENT = 'client', 
  AGENT = 'agent',   
  SUPER_AGENT = 'super_agent',
  AI = 'ai',
  SYSTEM = 'system',
}

export type LeadSource = 'direct' | 'sub_agent';
export type MessageThread = 'source' | 'upstream' | 'internal'; 

export type ViewState = 'dashboard' | 'pipeline' | 'inbox' | 'partners' | 'finance' | 'team';

export type ApplicationType = 'rpl' | 'admission' | 'visa' | 'onshore_transfer' | 'professional_year';

export type ApplicationStage = 
  | 'lead' 
  | 'gs_assessment'       // Genuine Student Check
  | 'financial_audit'     // Bank Statement/Source of Funds Verification
  | 'sop_drafting'        // Statement of Purpose iterations
  | 'rto_submission' 
  | 'conditional_offer'
  | 'payment_confirmed'
  | 'coe_issued'
  | 'visa_lodged'
  | 'biometrics_booked'   // VFS Appointment
  | 'medical_completed'   // IOM/Bupa Check
  | 'visa_granted'
  | 'onshore_arrival'
  | 'b2b_settlement'      // Sub-agent commission payout
  | 'certified';

export interface JourneyMilestone {
    id: string;
    serviceType: ApplicationType;
    title: string;
    status: 'completed' | 'active' | 'upcoming';
    startDate: Date;
    endDate?: Date;
    outcome?: string;
}

export interface Conversation {
  id: string;
  client: ClientProfile;
  source: LeadSource;
  subAgentName?: string;
  assignedCounselorId: string;
  unreadCount: number;
  status: 'active' | 'lead' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  currentStage: ApplicationStage;
  lastActive: Date;
  documents: DocumentStatus[];
  paymentTotal: number;
  paymentPaid: number;
  isB2BSettled?: boolean;
  onshoreStatus?: 'offshore' | 'landed' | 'resident';
  visaRiskLevel?: 'low' | 'medium' | 'high' | 'critical';
  customCategory?: string;
  // Missing pieces added:
  gsScore?: number; // 0-100 Genuine Student Score
  medicalStatus?: 'pending' | 'booked' | 'completed';
  biometricStatus?: 'pending' | 'booked' | 'completed';
  sopStatus?: 'not_started' | 'drafting' | 'review_required' | 'finalized';
  journey: JourneyMilestone[];
  messages: Message[];
}

export interface Message {
  id: string;
  sender: SenderType;
  type: MessageType;
  content: string;
  timestamp: Date;
  thread: MessageThread;
}

export interface DocumentStatus {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'missing' | 'rejected';
  type: 'identity' | 'academic' | 'financial' | 'sop' | 'employment';
  uploadDate?: Date;
}

export interface EducationEntry {
  id: string;
  level: string;
  institution: string;
  startYear: number;
  endYear: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  visaStatus: string;
  qualificationTarget: string;
  experienceYears: number;
  educationHistory: EducationEntry[];
}

export interface Partner {
  id: string;
  name: string;
  type: 'RTO' | 'Sub-Agent' | 'University' | 'Insurance';
  contactPerson: string;
  email: string; // Added field for partner profile
  activeStudents: number;
  commissionRate: string;
  status: 'active' | 'inactive';
  logo: string;
}

/**
 * Team Task structure for managing counselor workloads
 */
export interface TeamTask {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  status: 'pending' | 'completed';
}

export interface Counselor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string; // Added field for team filtering
  activeDeals: number;
  commissionEarned: number; // Added field for financial tracking
  totalSales: number; // Added field for performance tracking
  status: 'online' | 'offline' | 'busy';
  tasks: TeamTask[];
}

/**
 * Financial structures for the Commission Hub
 */
export type TransactionType = 'incoming' | 'outgoing_sub_agent' | 'outgoing_staff';

export interface CommissionRecord {
  id: string;
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
  type: TransactionType;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: Date;
  relatedEntityName: string;
}
