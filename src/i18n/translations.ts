// ============================================
// i18n - Локализация RU/EN
// ============================================

export const translations = {
    ru: {
        // --- Общее ---
        common: {
            loading: 'Загрузка...',
            save: 'Сохранить',
            cancel: 'Отмена',
            delete: 'Удалить',
            edit: 'Редактировать',
            back: 'Назад',
            next: 'Далее',
            submit: 'Отправить',
            search: 'Поиск',
            filter: 'Фильтр',
            all: 'Все',
            more: 'Ещё',
            close: 'Закрыть',
            yes: 'Да',
            no: 'Нет',
            or: 'или',
            and: 'и',
            from: 'от',
            to: 'до',
            perWeek: 'в неделю',
            perMonth: 'в месяц',
            perHour: 'в час',
            unlimited: 'Безлимит',
            free: 'Бесплатно',
        },

        // --- Навигация ---
        nav: {
            home: 'Главная',
            jobs: 'Задания',
            myJobs: 'Мои задания',
            applications: 'Отклики',
            myApplications: 'Мои отклики',
            deals: 'Сделки',
            chat: 'Чат',
            profile: 'Профиль',
            subscription: 'Подписка',
            settings: 'Настройки',
            admin: 'Админ',
            login: 'Войти',
            register: 'Регистрация',
            logout: 'Выйти',
        },

        // --- Роли ---
        roles: {
            client: 'Заказчик',
            freelancer: 'Фрилансер',
            admin: 'Администратор',
            chooseRole: 'Выберите роль',
            iAmClient: 'Я заказчик',
            iAmFreelancer: 'Я фрилансер',
            clientDesc: 'Размещаю задания и ищу исполнителей',
            freelancerDesc: 'Выполняю задания и ищу заказы',
        },

        // --- Авторизация ---
        auth: {
            login: 'Вход',
            register: 'Регистрация',
            email: 'Email',
            password: 'Пароль',
            confirmPassword: 'Подтвердите пароль',
            forgotPassword: 'Забыли пароль?',
            resetPassword: 'Восстановить пароль',
            createAccount: 'Создать аккаунт',
            alreadyHaveAccount: 'Уже есть аккаунт?',
            noAccount: 'Нет аккаунта?',
            loginWithGoogle: 'Войти через Google',
            orContinueWith: 'или продолжить с',
            welcomeBack: 'С возвращением!',
            createYourAccount: 'Создайте аккаунт',
        },

        // --- Профиль ---
        profile: {
            title: 'Профиль',
            editProfile: 'Редактировать профиль',
            displayName: 'Имя',
            company: 'Компания',
            bio: 'О себе',
            categories: 'Категории',
            skills: 'Навыки',
            level: 'Уровень',
            rate: 'Ставка',
            portfolio: 'Портфолио',
            rating: 'Рейтинг',
            reviews: 'отзывов',
            memberSince: 'На платформе с',
            publicProfile: 'Публичный профиль',
            levels: {
                junior: 'Junior',
                middle: 'Middle',
                senior: 'Senior',
                expert: 'Expert',
            },
        },

        // --- Задания ---
        jobs: {
            title: 'Задания',
            createJob: 'Создать задание',
            editJob: 'Редактировать задание',
            myJobs: 'Мои задания',
            findJobs: 'Найти задания',
            jobDetails: 'Детали задания',
            jobTitle: 'Название задания',
            category: 'Категория',
            skills: 'Навыки',
            description: 'Описание',
            budget: 'Бюджет',
            budgetType: 'Тип бюджета',
            fixed: 'Фикс',
            hourly: 'Почасовая',
            discuss: 'Договорная',
            deadline: 'Срок',
            attachments: 'Вложения',
            publish: 'Опубликовать',
            pause: 'Приостановить',
            close: 'Закрыть',
            applications: 'откликов',
            noJobs: 'Заданий пока нет',
            status: {
                draft: 'Черновик',
                published: 'Опубликовано',
                paused: 'На паузе',
                closed: 'Закрыто',
            },
        },

        // --- Отклики ---
        applications: {
            title: 'Отклики',
            apply: 'Откликнуться',
            myApplications: 'Мои отклики',
            yourPrice: 'Ваша цена',
            estimatedTime: 'Срок выполнения',
            coverLetter: 'Сопроводительное письмо',
            portfolioLinks: 'Ссылки на портфолио',
            submitApplication: 'Отправить отклик',
            applicationSent: 'Отклик отправлен',
            alreadyApplied: 'Вы уже откликнулись',
            viewApplication: 'Посмотреть отклик',
            noApplications: 'Откликов пока нет',
            accept: 'Принять',
            reject: 'Отклонить',
            status: {
                sent: 'Отправлен',
                viewed: 'Просмотрен',
                shortlisted: 'В избранном',
                accepted: 'Принят',
                rejected: 'Отклонён',
            },
        },

        // --- Лимиты ---
        limits: {
            applicationsLeft: 'Осталось откликов',
            weeklyLimit: 'Лимит на неделю',
            limitReached: 'Лимит исчерпан',
            upgradeToUnlock: 'Оформите подписку для безлимита',
            resetsOn: 'Сброс в понедельник',
        },

        // --- Сделки ---
        deals: {
            title: 'Сделки',
            myDeals: 'Мои сделки',
            startDeal: 'Начать сделку',
            completeDeal: 'Завершить сделку',
            cancelDeal: 'Отменить сделку',
            noDeals: 'Сделок пока нет',
            status: {
                inProgress: 'В работе',
                delivered: 'Сдано',
                completed: 'Завершено',
                cancelled: 'Отменено',
            },
        },

        // --- Чат ---
        chat: {
            title: 'Чат',
            noChats: 'Чатов пока нет',
            typeMessage: 'Введите сообщение...',
            send: 'Отправить',
            premiumRequired: 'Чат доступен только в Premium',
            upgradeForChat: 'Оформите Premium для доступа к чату',
        },

        // --- Подписка ---
        subscription: {
            title: 'Подписка',
            currentPlan: 'Текущий план',
            upgrade: 'Улучшить',
            choosePlan: 'Выберите план',
            bestValue: 'Лучшее предложение',
            popular: 'Популярный',
            features: 'Возможности',
            subscribe: 'Оформить подписку',
            manage: 'Управление подпиской',
            expiresOn: 'Действует до',
            autoRenewal: 'Автопродление',
        },

        // --- Отзывы ---
        reviews: {
            title: 'Отзывы',
            leaveReview: 'Оставить отзыв',
            yourRating: 'Ваша оценка',
            yourReview: 'Ваш отзыв',
            noReviews: 'Отзывов пока нет',
        },

        // --- Жалобы ---
        reports: {
            report: 'Пожаловаться',
            reason: 'Причина',
            comment: 'Комментарий',
            submit: 'Отправить жалобу',
        },

        // --- Ошибки ---
        errors: {
            required: 'Обязательное поле',
            invalidEmail: 'Некорректный email',
            passwordTooShort: 'Пароль слишком короткий (мин. 6 символов)',
            passwordsDoNotMatch: 'Пароли не совпадают',
            somethingWentWrong: 'Что-то пошло не так',
            tryAgain: 'Попробуйте ещё раз',
        },
    },

    en: {
        // --- Common ---
        common: {
            loading: 'Loading...',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            back: 'Back',
            next: 'Next',
            submit: 'Submit',
            search: 'Search',
            filter: 'Filter',
            all: 'All',
            more: 'More',
            close: 'Close',
            yes: 'Yes',
            no: 'No',
            or: 'or',
            and: 'and',
            from: 'from',
            to: 'to',
            perWeek: 'per week',
            perMonth: 'per month',
            perHour: 'per hour',
            unlimited: 'Unlimited',
            free: 'Free',
        },

        // --- Navigation ---
        nav: {
            home: 'Home',
            jobs: 'Jobs',
            myJobs: 'My Jobs',
            applications: 'Applications',
            myApplications: 'My Applications',
            deals: 'Deals',
            chat: 'Chat',
            profile: 'Profile',
            subscription: 'Subscription',
            settings: 'Settings',
            admin: 'Admin',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
        },

        // --- Roles ---
        roles: {
            client: 'Client',
            freelancer: 'Freelancer',
            admin: 'Administrator',
            chooseRole: 'Choose your role',
            iAmClient: "I'm a client",
            iAmFreelancer: "I'm a freelancer",
            clientDesc: 'I post jobs and look for freelancers',
            freelancerDesc: 'I complete jobs and look for work',
        },

        // --- Auth ---
        auth: {
            login: 'Login',
            register: 'Register',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm password',
            forgotPassword: 'Forgot password?',
            resetPassword: 'Reset password',
            createAccount: 'Create account',
            alreadyHaveAccount: 'Already have an account?',
            noAccount: "Don't have an account?",
            loginWithGoogle: 'Continue with Google',
            orContinueWith: 'or continue with',
            welcomeBack: 'Welcome back!',
            createYourAccount: 'Create your account',
        },

        // --- Profile ---
        profile: {
            title: 'Profile',
            editProfile: 'Edit profile',
            displayName: 'Name',
            company: 'Company',
            bio: 'About',
            categories: 'Categories',
            skills: 'Skills',
            level: 'Level',
            rate: 'Rate',
            portfolio: 'Portfolio',
            rating: 'Rating',
            reviews: 'reviews',
            memberSince: 'Member since',
            publicProfile: 'Public profile',
            levels: {
                junior: 'Junior',
                middle: 'Middle',
                senior: 'Senior',
                expert: 'Expert',
            },
        },

        // --- Jobs ---
        jobs: {
            title: 'Jobs',
            createJob: 'Create job',
            editJob: 'Edit job',
            myJobs: 'My jobs',
            findJobs: 'Find jobs',
            jobDetails: 'Job details',
            jobTitle: 'Job title',
            category: 'Category',
            skills: 'Skills',
            description: 'Description',
            budget: 'Budget',
            budgetType: 'Budget type',
            fixed: 'Fixed',
            hourly: 'Hourly',
            discuss: 'Negotiable',
            deadline: 'Deadline',
            attachments: 'Attachments',
            publish: 'Publish',
            pause: 'Pause',
            close: 'Close',
            applications: 'applications',
            noJobs: 'No jobs yet',
            status: {
                draft: 'Draft',
                published: 'Published',
                paused: 'Paused',
                closed: 'Closed',
            },
        },

        // --- Applications ---
        applications: {
            title: 'Applications',
            apply: 'Apply',
            myApplications: 'My applications',
            yourPrice: 'Your price',
            estimatedTime: 'Estimated time',
            coverLetter: 'Cover letter',
            portfolioLinks: 'Portfolio links',
            submitApplication: 'Submit application',
            applicationSent: 'Application sent',
            alreadyApplied: 'Already applied',
            viewApplication: 'View application',
            noApplications: 'No applications yet',
            accept: 'Accept',
            reject: 'Reject',
            status: {
                sent: 'Sent',
                viewed: 'Viewed',
                shortlisted: 'Shortlisted',
                accepted: 'Accepted',
                rejected: 'Rejected',
            },
        },

        // --- Limits ---
        limits: {
            applicationsLeft: 'Applications left',
            weeklyLimit: 'Weekly limit',
            limitReached: 'Limit reached',
            upgradeToUnlock: 'Upgrade for unlimited',
            resetsOn: 'Resets on Monday',
        },

        // --- Deals ---
        deals: {
            title: 'Deals',
            myDeals: 'My deals',
            startDeal: 'Start deal',
            completeDeal: 'Complete deal',
            cancelDeal: 'Cancel deal',
            noDeals: 'No deals yet',
            status: {
                inProgress: 'In Progress',
                delivered: 'Delivered',
                completed: 'Completed',
                cancelled: 'Cancelled',
            },
        },

        // --- Chat ---
        chat: {
            title: 'Chat',
            noChats: 'No chats yet',
            typeMessage: 'Type a message...',
            send: 'Send',
            premiumRequired: 'Chat requires Premium',
            upgradeForChat: 'Upgrade to Premium for chat access',
        },

        // --- Subscription ---
        subscription: {
            title: 'Subscription',
            currentPlan: 'Current plan',
            upgrade: 'Upgrade',
            choosePlan: 'Choose a plan',
            bestValue: 'Best value',
            popular: 'Popular',
            features: 'Features',
            subscribe: 'Subscribe',
            manage: 'Manage subscription',
            expiresOn: 'Expires on',
            autoRenewal: 'Auto-renewal',
        },

        // --- Reviews ---
        reviews: {
            title: 'Reviews',
            leaveReview: 'Leave a review',
            yourRating: 'Your rating',
            yourReview: 'Your review',
            noReviews: 'No reviews yet',
        },

        // --- Reports ---
        reports: {
            report: 'Report',
            reason: 'Reason',
            comment: 'Comment',
            submit: 'Submit report',
        },

        // --- Errors ---
        errors: {
            required: 'Required field',
            invalidEmail: 'Invalid email',
            passwordTooShort: 'Password too short (min. 6 characters)',
            passwordsDoNotMatch: 'Passwords do not match',
            somethingWentWrong: 'Something went wrong',
            tryAgain: 'Please try again',
        },
    },
};

export type Language = 'ru' | 'en';
export type TranslationKey = keyof typeof translations.ru;

// --- Хелпер для получения текущего языка ---
export function getBrowserLanguage(): Language {
    const lang = navigator.language.split('-')[0];
    return lang === 'ru' ? 'ru' : 'en';
}
