import { Category, Job, User, Application, Deal, Message } from './types';

export const MOCK_USER_CLIENT: User = {
  id: 'u1',
  name: 'Alex Carter',
  role: 'CLIENT',
  plan: 'FREE',
  weeklyApplicationsUsed: 0,
  company: 'TechFlow Inc.',
  bio: 'Product Manager looking for agile developers.',
  avatar: 'https://picsum.photos/200/200'
};

export const MOCK_USER_FREELANCER: User = {
  id: 'u2',
  name: 'Sarah Jenkins',
  role: 'FREELANCER',
  plan: 'FREE', // Change to PRO or PREMIUM to test features
  weeklyApplicationsUsed: 1,
  skills: ['React', 'TypeScript', 'Node.js'],
  rate: '45 USD/hr',
  bio: 'Senior Frontend Developer with 5 years experience.',
  avatar: 'https://picsum.photos/201/201'
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    clientId: 'u1',
    clientName: 'TechFlow Inc.',
    title: 'E-commerce Redesign using React',
    category: Category.WEB,
    skills: ['React', 'Tailwind', 'UX'],
    description: 'We need to modernize our storefront. Seeking a developer with design eye.',
    budgetType: 'FIXED',
    budgetValue: '3000 USD',
    deadline: '2023-12-01',
    status: 'PUBLISHED',
    createdAt: '2023-11-01',
    applicationCount: 5
  },
  {
    id: 'j2',
    clientId: 'u3',
    clientName: 'Startup X',
    title: 'Telegram Bot for Crypto Tracking',
    category: Category.BOTS,
    skills: ['Python', 'Aiogram', 'Redis'],
    description: 'Simple bot to track wallet movements and alert users.',
    budgetType: 'HOURLY',
    budgetValue: '25 USD/hr',
    deadline: 'ASAP',
    status: 'PUBLISHED',
    createdAt: '2023-11-05',
    applicationCount: 2
  },
  {
    id: 'j3',
    clientId: 'u1',
    clientName: 'TechFlow Inc.',
    title: 'Mobile App MVP (Flutter)',
    category: Category.MOBILE,
    skills: ['Flutter', 'Firebase'],
    description: 'Need a prototype for investor pitch.',
    budgetType: 'DISCUSS',
    deadline: '1 month',
    status: 'CLOSED',
    createdAt: '2023-10-15',
    applicationCount: 12
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    freelancerId: 'u2',
    freelancerName: 'Sarah Jenkins',
    price: '2800 USD',
    eta: '2 weeks',
    message: 'I have done similar projects. Check my portfolio.',
    status: 'SENT'
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    jobId: 'j2', // Sarah accepted for the crypto bot job (hypothetically)
    jobTitle: 'Telegram Bot for Crypto Tracking',
    clientId: 'u3',
    clientName: 'Startup X',
    freelancerId: 'u2',
    freelancerName: 'Sarah Jenkins',
    status: 'IN_PROGRESS'
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    dealId: 'd1',
    fromUserId: 'u3',
    text: 'Hi Sarah, glad to start working with you!',
    createdAt: new Date(Date.now() - 10000000).toISOString()
  },
  {
    id: 'm2',
    dealId: 'd1',
    fromUserId: 'u2',
    text: 'Hello! I have reviewed the requirements. I can start today.',
    createdAt: new Date(Date.now() - 9000000).toISOString()
  }
];
