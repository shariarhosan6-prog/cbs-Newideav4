
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
export type MessageThread = 'source' | 'upstream' | 'internal' | 'team_discussion'; 

export type ViewState = 'dashboard' | 'pipeline' | 'inbox' | 'partners' | 'finance' | 'team' | 'calendar' | 'workspace';

export type ApplicationType = 'rpl' | 'admission' | 'visa' | 'onshore_transfer' | 'professional_year';

export type ApplicationStage = 
  | 'lead' 
  | 'gs_assessment'       
  | 'financial_audit'     
  | 'sop_drafting'        
  | 'rto_submission' 
  | 'conditional_offer'
  | 'payment_confirmed'
  | 'coe_issued'
  | 'visa_lodged'
  | 'biometrics_booked'   
  | 'medical_completed'   
  | 'visa_granted'
  | 'onshore_arrival'
  | 'b2b_settlement'      
  | 'certified';

export type ActivityType = 
  | 'stage_change' 
  | 'doc_uploaded' 
  | 'doc_verified' 
  | 'payment_received' 
  | 'assignment_changed' 
  | 'note_added' 
  | 'system'
  | 'task_assigned'
  | 'task_completed';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  content: string;
  actorName: string;
  timestamp: Date;
  metadata?: any;
}

export interface SearchFilters {
  query: string;
  stages: ApplicationStage[];
  priorities: ('high' | 'medium' | 'low')[];
  sources: LeadSource[];
}

export interface JourneyMilestone {
    id: string;
    serviceType: ApplicationType;
    title: string;
    description?: string;
    status: 'completed' | 'active' | 'upcoming';
    date: Date; // Primary date for calendar/timeline
    type: 'deadline' | 'appointment' | 'payment' | 'milestone';
    studentName: string;
    studentId: string;
}

export interface InternalNote {
  id: string;
  content: string;
  authorName: string;
  timestamp: Date;
  color: 'yellow' | 'blue' | 'red' | 'green' | 'purple';
  mentions?: string[];
  isPinned?: boolean;
}

export interface FileTask {
  id: string;
  title: string;
  assignedToId: string;
  assignedToName: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

export interface Conversation {
  id: string;
  client: ClientProfile;
  source: LeadSource;
  subAgentName?: string;
  assignedCounselorId: string;
  unreadCount: number;
  status: 'active' | 'lead' | 'review' | 'completed' | 'archived';
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
  gsScore?: number; 
  medicalStatus?: 'pending' | 'booked' | 'completed';
  biometricStatus?: 'pending' | 'booked' | 'completed';
  sopStatus?: 'not_started' | 'drafting' | 'review_required' | 'finalized';
  journey: JourneyMilestone[];
  messages: Message[];
  notes: InternalNote[];
  activities: ActivityLog[];
  tasks: FileTask[];
  difficulty?: 'easy' | 'standard' | 'complex' | 'critical';
}

export interface Message {
  id: string;
  sender: SenderType;
  type: MessageType;
  content: string;
  timestamp: Date;
  thread: MessageThread | string; // Extended for workspace channels
  authorName?: string;
  authorId?: string; 
  linkedCaseId?: string; // Optional link to a client file
}

export interface TeamChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'dm';
  description?: string;
  unreadCount: number;
  members: string[]; // Counselor IDs
}

export interface DocumentStatus {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'missing' | 'rejected' | 'requested';
  type: 'identity' | 'academic' | 'financial' | 'sop' | 'employment';
  uploadDate?: Date;
  requestedDate?: Date;
  deadline?: Date;
  autoReminder?: boolean;
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
  email: string; 
  activeStudents: number;
  commissionRate: string;
  status: 'active' | 'inactive';
  logo: string;
  // Performance Metrics
  successRate?: number; // 0-100
  commissionPaid?: number;
  commissionPending?: number;
}

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
  department: string; 
  activeDeals: number;
  commissionEarned: number; 
  totalSales: number; 
  status: 'online' | 'offline' | 'busy' | 'away' | 'meeting';
  tasks: TeamTask[];
}

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
