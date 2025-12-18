
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
export type MessageThread = 'source' | 'upstream'; 

export type ViewState = 'dashboard' | 'pipeline' | 'inbox' | 'partners' | 'finance' | 'team';

export type ApplicationType = 'rpl' | 'admission';

export type ApplicationStage = 
  | 'lead' 
  | 'evidence_collection' 
  | 'mediator_review' 
  | 'rto_submission' 
  | 'certified'
  | 'app_lodged'
  | 'conditional_offer'
  | 'gte_assessment'
  | 'coe_issued';

export interface ApplicationCard {
  id: string;
  type: ApplicationType;
  clientName: string;
  qualification: string;
  stage: ApplicationStage;
  tags: string[];
  source?: string;
  value: string;
  lastUpdate?: Date;
  daysInStage: number;
  missingDocs: number;
  counselorId: string;
}

export interface ActivityLog {
    id: string;
    staffId: string;
    staffName: string;
    action: string;
    timestamp: Date;
    details?: string;
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
    role: 'Junior Counselor' | 'Senior Counselor' | 'Migration Agent';
    department: 'RPL' | 'Admissions' | 'Legal';
    totalSales: number;
    commissionEarned: number;
    activeDeals: number;
    lastActive: Date;
    status: 'online' | 'offline' | 'busy';
    tasks: TeamTask[];
}

export interface Conversation {
  id: string;
  client: ClientProfile;
  source: LeadSource;
  subAgentName?: string;
  assignedCounselorId: string;
  partnerId?: string;
  superAgentStatus: 'not_started' | 'processing' | 'submitted' | 'accepted';
  messages: Message[];
  unreadCount: number;
  status: 'active' | 'lead' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  currentStage: ApplicationStage;
  lastActive: Date;
  progressStage: number;
  currentStep: string;
  documents: DocumentStatus[];
  paymentTotal: number;
  paymentPaid: number;
  activities: ActivityLog[];
  // AI Intelligent Fields
  sentiment?: 'positive' | 'neutral' | 'anxious' | 'urgent';
  visaRiskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Message {
  id: string;
  sender: SenderType;
  type: MessageType;
  content: string;
  timestamp: Date;
  fileName?: string;
  fileSize?: string;
  read?: boolean;
  thread: MessageThread;
}

export interface DocumentStatus {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'missing' | 'rejected';
  uploadDate?: Date;
  confidence?: number;
}

export interface EducationEntry {
  id: string;
  level: 'Year 10' | 'Year 12' | 'Diploma' | 'Bachelor' | 'Masters' | 'PhD';
  institution: string;
  startYear: number;
  endYear: number;
  isGapFiller?: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  visaStatus: string;
  visaExpiry: string;
  qualificationTarget: string;
  experienceYears: number;
  educationHistory: EducationEntry[];
}

export interface Partner {
  id: string;
  name: string;
  type: 'RTO' | 'Sub-Agent' | 'University';
  contactPerson: string;
  email: string;
  activeStudents: number;
  commissionRate: string;
  status: 'active' | 'inactive';
  logo: string;
}

export type TransactionType = 'incoming' | 'outgoing_sub_agent' | 'outgoing_staff';
export type TransactionStatus = 'pending' | 'paid' | 'overdue';

export interface CommissionRecord {
    id: string;
    clientId: string;
    clientName: string;
    description: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    dueDate: Date;
    relatedEntityName: string;
}
