// ============================================
// Биржа IT-фриланса - Типы данных
// ============================================

// --- Роли и планы ---
export type Role = 'CLIENT' | 'FREELANCER' | 'ADMIN';
export type SubscriptionPlan = 'FREE' | 'PRO' | 'PREMIUM';

// --- Статусы ---
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED';
export type ApplicationStatus = 'SENT' | 'VIEWED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
export type DealStatus = 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED';

// --- Категории ---
export enum Category {
    // IT-сфера
    DESIGN = 'UI/UX, Product Design',
    GRAPHIC = 'Графический дизайн / Брендинг',
    WEB = 'Веб-разработка',
    MOBILE = 'Мобильная разработка',
    BOTS = 'Боты / Автоматизация',
    QA = 'QA / Тестирование',
    DEVOPS = 'DevOps / Cloud',
    DATA = 'Data / ML',
    SECURITY = 'Кибербезопасность',
    WRITING = 'Техписательство / Документация',
    // Услуги
    COURIER = 'Курьерские услуги',
    CLEANING = 'Уборка',
    TRANSFER = 'Трансфер / Перевозки',
    CONSTRUCTION = 'Строительство и ремонт',
    OTHER = 'Другое'
}

// --- Уровни фрилансера ---
export type FreelancerLevel = 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'EXPERT';

// --- Профиль пользователя ---
export interface UserProfile {
    id: string;
    email: string;
    role: Role;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    timezone: string;
    rating: number;
    reviewCount: number;
    createdAt: string;

    // Поля фрилансера
    categories?: Category[];
    skills?: string[];
    level?: FreelancerLevel;
    rate?: string;
    portfolioLinks?: string[];

    // Поля заказчика
    company?: string;
}

// --- Подписка ---
export interface Subscription {
    id: string;
    userId: string;
    planId: SubscriptionPlan;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    startsAt: string;
    endsAt?: string;
}

// --- Лимит откликов ---
export interface WeeklyLimit {
    userId: string;
    weekStart: string; // Понедельник
    applicationsCount: number;
}

// --- Задание ---
export interface Job {
    id: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    title: string;
    category: Category;
    skills: string[];
    description: string;
    budgetType: 'FIXED' | 'HOURLY' | 'DISCUSS';
    budgetValue?: string;
    deadline?: string;
    attachments?: string[];
    status: JobStatus;
    applicationCount: number;
    createdAt: string;
    updatedAt: string;
}

// --- Отклик ---
export interface Application {
    id: string;
    jobId: string;
    jobTitle: string;
    freelancerId: string;
    freelancerName: string;
    freelancerAvatar?: string;
    priceText: string;
    etaText: string;
    message: string;
    portfolioLinks?: string[];
    status: ApplicationStatus;
    createdAt: string;
}

// --- Сделка ---
export interface Deal {
    id: string;
    jobId: string;
    jobTitle: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    freelancerId: string;
    freelancerName: string;
    freelancerAvatar?: string;
    applicationId: string;
    status: DealStatus;
    createdAt: string;
    completedAt?: string;
}

// --- Сообщение ---
export interface Message {
    id: string;
    dealId: string;
    senderId: string;
    senderName: string;
    content: string;
    messageType: 'TEXT' | 'IMAGE' | 'FILE';
    fileUrl?: string;
    createdAt: string;
}

// --- Отзыв ---
export interface Review {
    id: string;
    dealId: string;
    reviewerId: string;
    reviewerName: string;
    revieweeId: string;
    rating: number; // 1-5
    text?: string;
    createdAt: string;
}

// --- Жалоба ---
export interface Report {
    id: string;
    reporterId: string;
    reason: string;
    comment?: string;
    targetType: 'JOB' | 'USER' | 'MESSAGE';
    targetId: string;
    status: ReportStatus;
    createdAt: string;
}

// --- План подписки ---
export interface SubscriptionPlanInfo {
    id: SubscriptionPlan;
    name: string;
    nameEn: string;
    priceMonthly: number;
    currency: string;
    applicationsPerWeek: number | null; // null = безлимит
    chatEnabled: boolean;
    features: string[];
    featuresEn: string[];
}

// --- Auth контекст ---
export interface AuthState {
    user: UserProfile | null;
    subscription: Subscription | null;
    weeklyLimit: WeeklyLimit | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
