export type Role = 'CLIENT' | 'FREELANCER';
export type SubscriptionPlan = 'FREE' | 'PRO' | 'PREMIUM';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED';
export type ApplicationStatus = 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED';
export type DealStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export enum Category {
  DESIGN = 'UI/UX, Design',
  WEB = 'Web Development',
  MOBILE = 'Mobile Development',
  BOTS = 'Bots & Automation',
  QA = 'QA & Testing',
  DEVOPS = 'DevOps & Cloud',
  DATA = 'Data & ML',
  SECURITY = 'Cybersecurity',
  WRITING = 'Technical Writing',
  OTHER = 'Other'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  plan: SubscriptionPlan;
  weeklyApplicationsUsed: number;
  avatar?: string;
  // Profile specific fields (simplified intersection)
  company?: string; // Client
  bio?: string;
  skills?: string[]; // Freelancer
  rate?: string; // Freelancer
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  category: Category;
  skills: string[];
  description: string;
  budgetType: 'FIXED' | 'HOURLY' | 'DISCUSS';
  budgetValue?: string;
  deadline: string;
  status: JobStatus;
  createdAt: string;
  applicationCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  price: string;
  eta: string;
  message: string;
  status: ApplicationStatus;
}

export interface Deal {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  freelancerId: string;
  freelancerName: string;
  clientName: string;
  status: DealStatus;
}

export interface Message {
  id: string;
  dealId: string;
  fromUserId: string;
  text: string;
  createdAt: string;
}
