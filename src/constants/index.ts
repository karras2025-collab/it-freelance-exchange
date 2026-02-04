// ============================================
// Биржа IT-фриланса - Константы
// ============================================

import {
    Category,
    SubscriptionPlanInfo,
    UserProfile,
    Job,
    Application,
    Deal,
    Message,
    WeeklyLimit,
    Subscription
} from '../types';

// --- Планы подписки ---
export const SUBSCRIPTION_PLANS: SubscriptionPlanInfo[] = [
    {
        id: 'FREE',
        name: 'Бесплатный',
        nameEn: 'Free',
        priceMonthly: 0,
        currency: 'RUB',
        applicationsPerWeek: 3,
        chatEnabled: false,
        features: [
            '3 отклика в неделю',
            'Базовый профиль',
            'Поиск заданий'
        ],
        featuresEn: [
            '3 applications per week',
            'Basic profile',
            'Job search'
        ]
    },
    {
        id: 'PRO',
        name: 'Pro',
        nameEn: 'Pro',
        priceMonthly: 990,
        currency: 'RUB',
        applicationsPerWeek: null, // безлимит
        chatEnabled: false,
        features: [
            'Безлимит откликов',
            'Приоритет в поиске',
            'Значок "Verified"'
        ],
        featuresEn: [
            'Unlimited applications',
            'Priority in search',
            'Verified badge'
        ]
    },
    {
        id: 'PREMIUM',
        name: 'Premium',
        nameEn: 'Premium',
        priceMonthly: 1990,
        currency: 'RUB',
        applicationsPerWeek: null, // безлимит
        chatEnabled: true,
        features: [
            'Всё из Pro',
            'Чат с заказчиками',
            'Приоритетная поддержка'
        ],
        featuresEn: [
            'Everything in Pro',
            'Chat with clients',
            'Priority support'
        ]
    }
];

// --- Категории ---
export const CATEGORIES = Object.values(Category);

// --- Навыки по категориям ---
export const SKILLS_BY_CATEGORY: Record<Category, string[]> = {
    // IT-сфера
    [Category.DESIGN]: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing'],
    [Category.GRAPHIC]: ['Photoshop', 'Illustrator', 'Logo Design', 'Branding', 'Print Design'],
    [Category.WEB]: ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js', 'Next.js', 'PHP', 'Laravel', 'Django', 'FastAPI'],
    [Category.MOBILE]: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
    [Category.BOTS]: ['Python', 'Aiogram', 'Telegraf', 'Discord.js', 'Selenium', 'Puppeteer'],
    [Category.QA]: ['Manual Testing', 'Automation', 'Selenium', 'Cypress', 'Jest', 'Pytest'],
    [Category.DEVOPS]: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Terraform'],
    [Category.DATA]: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas', 'Spark', 'MLOps'],
    [Category.SECURITY]: ['Penetration Testing', 'OWASP', 'Network Security', 'Cryptography'],
    [Category.WRITING]: ['Technical Writing', 'API Documentation', 'User Guides', 'Markdown'],
    // Услуги
    [Category.COURIER]: ['Пешая доставка', 'Авто доставка', 'Срочная доставка', 'Доставка еды', 'Доставка документов', 'Межгородская доставка'],
    [Category.CLEANING]: ['Уборка квартир', 'Уборка офисов', 'Генеральная уборка', 'Мойка окон', 'Химчистка', 'Уборка после ремонта'],
    [Category.TRANSFER]: ['Такси', 'Трансфер в аэропорт', 'Грузоперевозки', 'Переезд', 'Междугородние перевозки', 'Вывоз мусора'],
    [Category.CONSTRUCTION]: ['Ремонт квартир', 'Электрика', 'Сантехника', 'Малярные работы', 'Плиточные работы', 'Сборка мебели', 'Отделка', 'Строительство'],
    [Category.OTHER]: []
};

// --- Причины жалоб ---
export const REPORT_REASONS = [
    { id: 'spam', label: 'Спам', labelEn: 'Spam' },
    { id: 'inappropriate', label: 'Неуместный контент', labelEn: 'Inappropriate content' },
    { id: 'fraud', label: 'Мошенничество', labelEn: 'Fraud' },
    { id: 'harassment', label: 'Оскорбления', labelEn: 'Harassment' },
    { id: 'other', label: 'Другое', labelEn: 'Other' }
];

// ============================================
// MOCK DATA (для разработки без Supabase)
// ============================================

export const MOCK_CLIENT: UserProfile = {
    id: 'client-1',
    email: 'client@example.com',
    role: 'CLIENT',
    displayName: 'Алексей Петров',
    company: 'ТехноСтарт',
    bio: 'Ищем талантливых разработчиков для наших проектов.',
    avatarUrl: 'https://i.pravatar.cc/150?u=client1',
    timezone: 'Europe/Moscow',
    rating: 4.8,
    reviewCount: 12,
    createdAt: '2024-01-15T10:00:00Z'
};

export const MOCK_FREELANCER: UserProfile = {
    id: 'freelancer-1',
    email: 'freelancer@example.com',
    role: 'FREELANCER',
    displayName: 'Мария Иванова',
    bio: 'Frontend-разработчик с 5-летним опытом. Специализируюсь на React и TypeScript.',
    avatarUrl: 'https://i.pravatar.cc/150?u=freelancer1',
    categories: [Category.WEB, Category.MOBILE],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js'],
    level: 'SENIOR',
    rate: '3000 ₽/час',
    portfolioLinks: ['https://github.com/example', 'https://portfolio.example.com'],
    timezone: 'Europe/Moscow',
    rating: 4.9,
    reviewCount: 28,
    createdAt: '2023-06-10T10:00:00Z'
};

export const MOCK_SUBSCRIPTION: Subscription = {
    id: 'sub-1',
    userId: 'freelancer-1',
    planId: 'FREE',
    status: 'ACTIVE',
    startsAt: '2024-01-01T00:00:00Z'
};

export const MOCK_WEEKLY_LIMIT: WeeklyLimit = {
    userId: 'freelancer-1',
    weekStart: getWeekStart(new Date()).toISOString(),
    applicationsCount: 1
};

export const MOCK_JOBS: Job[] = [
    {
        id: 'job-1',
        clientId: 'client-1',
        clientName: 'ТехноСтарт',
        clientAvatar: 'https://i.pravatar.cc/150?u=client1',
        title: 'Разработка интернет-магазина на React',
        category: Category.WEB,
        skills: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
        description: `Ищем опытного frontend-разработчика для создания современного интернет-магазина.

Требования:
• Опыт работы с React 3+ лет
• Знание TypeScript
• Опыт интеграции с REST API
• Адаптивная вёрстка

Задачи:
• Разработка каталога товаров
• Корзина и оформление заказа
• Личный кабинет пользователя
• Интеграция с платёжной системой`,
        budgetType: 'FIXED',
        budgetValue: '150 000 ₽',
        deadline: '1 месяц',
        status: 'PUBLISHED',
        applicationCount: 5,
        createdAt: '2024-01-18T10:00:00Z',
        updatedAt: '2024-01-18T10:00:00Z'
    },
    {
        id: 'job-2',
        clientId: 'client-2',
        clientName: 'Startup X',
        clientAvatar: 'https://i.pravatar.cc/150?u=client2',
        title: 'Telegram-бот для отслеживания криптовалют',
        category: Category.BOTS,
        skills: ['Python', 'Aiogram', 'Redis', 'PostgreSQL'],
        description: `Нужен бот для мониторинга криптокошельков с уведомлениями.

Функционал:
• Добавление кошельков для отслеживания
• Уведомления о транзакциях
• Статистика за период
• Интеграция с CoinGecko API`,
        budgetType: 'HOURLY',
        budgetValue: '2000 ₽/час',
        deadline: 'ASAP',
        status: 'PUBLISHED',
        applicationCount: 2,
        createdAt: '2024-01-17T14:00:00Z',
        updatedAt: '2024-01-17T14:00:00Z'
    },
    {
        id: 'job-3',
        clientId: 'client-1',
        clientName: 'ТехноСтарт',
        clientAvatar: 'https://i.pravatar.cc/150?u=client1',
        title: 'Мобильное приложение на Flutter (MVP)',
        category: Category.MOBILE,
        skills: ['Flutter', 'Dart', 'Firebase', 'REST API'],
        description: `Разработка MVP мобильного приложения для презентации инвесторам.

Основные экраны:
• Онбординг
• Авторизация
• Главная лента
• Профиль пользователя

Срок: 3-4 недели`,
        budgetType: 'DISCUSS',
        deadline: '1 месяц',
        status: 'PUBLISHED',
        applicationCount: 8,
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z'
    },
    {
        id: 'job-4',
        clientId: 'client-3',
        clientName: 'DigitalAgency',
        clientAvatar: 'https://i.pravatar.cc/150?u=client3',
        title: 'Редизайн корпоративного сайта',
        category: Category.DESIGN,
        skills: ['Figma', 'UI/UX', 'Prototyping', 'Design System'],
        description: `Полный редизайн корпоративного сайта IT-компании.

Что нужно:
• Анализ текущего сайта
• Новый UI Kit
• Макеты всех страниц (10-15 экранов)
• Адаптив для мобильных`,
        budgetType: 'FIXED',
        budgetValue: '80 000 ₽',
        deadline: '2 недели',
        status: 'PUBLISHED',
        applicationCount: 12,
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
    }
];

export const MOCK_APPLICATIONS: Application[] = [
    {
        id: 'app-1',
        jobId: 'job-1',
        jobTitle: 'Разработка интернет-магазина на React',
        freelancerId: 'freelancer-1',
        freelancerName: 'Мария Иванова',
        freelancerAvatar: 'https://i.pravatar.cc/150?u=freelancer1',
        priceText: '140 000 ₽',
        etaText: '3 недели',
        message: 'Здравствуйте! Имею большой опыт в разработке e-commerce проектов на React. В портфолио есть похожие кейсы. Готова приступить сразу.',
        portfolioLinks: ['https://github.com/example'],
        status: 'SENT',
        createdAt: '2024-01-18T12:00:00Z'
    }
];

export const MOCK_DEALS: Deal[] = [
    {
        id: 'deal-1',
        jobId: 'job-2',
        jobTitle: 'Telegram-бот для отслеживания криптовалют',
        clientId: 'client-2',
        clientName: 'Startup X',
        clientAvatar: 'https://i.pravatar.cc/150?u=client2',
        freelancerId: 'freelancer-1',
        freelancerName: 'Мария Иванова',
        freelancerAvatar: 'https://i.pravatar.cc/150?u=freelancer1',
        applicationId: 'app-2',
        status: 'IN_PROGRESS',
        createdAt: '2024-01-17T16:00:00Z'
    }
];

export const MOCK_MESSAGES: Message[] = [
    {
        id: 'msg-1',
        dealId: 'deal-1',
        senderId: 'client-2',
        senderName: 'Startup X',
        content: 'Привет! Рады начать работу. Готовы обсудить детали?',
        messageType: 'TEXT',
        createdAt: '2024-01-17T16:30:00Z'
    },
    {
        id: 'msg-2',
        dealId: 'deal-1',
        senderId: 'freelancer-1',
        senderName: 'Мария Иванова',
        content: 'Добрый день! Да, изучила ТЗ. Есть пара вопросов по интеграции с API бирж.',
        messageType: 'TEXT',
        createdAt: '2024-01-17T16:35:00Z'
    }
];

// --- Helpers ---
function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function getCurrentWeekStart(): string {
    return getWeekStart(new Date()).toISOString().split('T')[0];
}

export function canApply(weeklyLimit: WeeklyLimit | null, plan: SubscriptionPlanInfo): boolean {
    if (plan.applicationsPerWeek === null) return true; // безлимит
    if (!weeklyLimit) return true;
    return weeklyLimit.applicationsCount < plan.applicationsPerWeek;
}

export function getRemainingApplications(weeklyLimit: WeeklyLimit | null, plan: SubscriptionPlanInfo): number | null {
    if (plan.applicationsPerWeek === null) return null; // безлимит
    if (!weeklyLimit) return plan.applicationsPerWeek;
    return Math.max(0, plan.applicationsPerWeek - weeklyLimit.applicationsCount);
}
