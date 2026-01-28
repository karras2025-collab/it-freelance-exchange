// ============================================
// Контекст авторизации (с mock данными)
// ============================================

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
    UserProfile,
    Subscription,
    WeeklyLimit,
    AuthState,
    Role,
    SubscriptionPlan
} from '../types';
import {
    MOCK_CLIENT,
    MOCK_FREELANCER,
    MOCK_SUBSCRIPTION,
    MOCK_WEEKLY_LIMIT,
    SUBSCRIPTION_PLANS,
    getCurrentWeekStart
} from '../constants';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: Role) => Promise<void>;
    logout: () => void;
    switchRole: () => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    upgradeSubscription: (plan: SubscriptionPlan) => void;
    incrementApplicationCount: () => void;
    canApply: () => boolean;
    getRemainingApplications: () => number | null;
    hasPremiumChat: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [weeklyLimit, setWeeklyLimit] = useState<WeeklyLimit | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Восстановление сессии при загрузке
    useEffect(() => {
        const savedUser = localStorage.getItem('auth_user');
        const savedSubscription = localStorage.getItem('auth_subscription');
        const savedWeeklyLimit = localStorage.getItem('auth_weekly_limit');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
            if (savedSubscription) setSubscription(JSON.parse(savedSubscription));
            if (savedWeeklyLimit) {
                const limit = JSON.parse(savedWeeklyLimit) as WeeklyLimit;
                // Проверяем, не устарел ли лимит (новая неделя)
                const currentWeek = getCurrentWeekStart();
                if (limit.weekStart !== currentWeek) {
                    // Новая неделя — сбрасываем счётчик
                    const newLimit: WeeklyLimit = {
                        ...limit,
                        weekStart: currentWeek,
                        applicationsCount: 0
                    };
                    setWeeklyLimit(newLimit);
                    localStorage.setItem('auth_weekly_limit', JSON.stringify(newLimit));
                } else {
                    setWeeklyLimit(limit);
                }
            }
        }
        setIsLoading(false);
    }, []);

    // Сохранение в localStorage при изменении
    useEffect(() => {
        if (user) {
            localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('auth_user');
        }
    }, [user]);

    useEffect(() => {
        if (subscription) {
            localStorage.setItem('auth_subscription', JSON.stringify(subscription));
        } else {
            localStorage.removeItem('auth_subscription');
        }
    }, [subscription]);

    useEffect(() => {
        if (weeklyLimit) {
            localStorage.setItem('auth_weekly_limit', JSON.stringify(weeklyLimit));
        } else {
            localStorage.removeItem('auth_weekly_limit');
        }
    }, [weeklyLimit]);

    // --- Mock login ---
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        // Симуляция запроса
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock: определяем роль по email
        const mockUser = email.includes('client') ? MOCK_CLIENT : MOCK_FREELANCER;
        setUser({ ...mockUser, email });

        if (mockUser.role === 'FREELANCER') {
            setSubscription(MOCK_SUBSCRIPTION);
            setWeeklyLimit(MOCK_WEEKLY_LIMIT);
        }

        setIsLoading(false);
    }, []);

    // --- Mock register ---
    const register = useCallback(async (email: string, password: string, role: Role) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const newUser: UserProfile = {
            id: `user-${Date.now()}`,
            email,
            role,
            displayName: email.split('@')[0],
            timezone: 'Europe/Moscow',
            rating: 0,
            reviewCount: 0,
            createdAt: new Date().toISOString(),
            ...(role === 'FREELANCER' ? {
                categories: [],
                skills: [],
                level: 'MIDDLE' as const,
                portfolioLinks: []
            } : {})
        };

        setUser(newUser);

        if (role === 'FREELANCER') {
            setSubscription({
                id: `sub-${Date.now()}`,
                userId: newUser.id,
                planId: 'FREE',
                status: 'ACTIVE',
                startsAt: new Date().toISOString()
            });
            setWeeklyLimit({
                userId: newUser.id,
                weekStart: getCurrentWeekStart(),
                applicationsCount: 0
            });
        }

        setIsLoading(false);
    }, []);

    // --- Logout ---
    const logout = useCallback(() => {
        setUser(null);
        setSubscription(null);
        setWeeklyLimit(null);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_subscription');
        localStorage.removeItem('auth_weekly_limit');
    }, []);

    // --- Switch role (для демо) ---
    const switchRole = useCallback(() => {
        if (!user) return;

        if (user.role === 'CLIENT') {
            setUser({ ...MOCK_FREELANCER, email: user.email });
            setSubscription(MOCK_SUBSCRIPTION);
            setWeeklyLimit(MOCK_WEEKLY_LIMIT);
        } else {
            setUser({ ...MOCK_CLIENT, email: user.email });
            setSubscription(null);
            setWeeklyLimit(null);
        }
    }, [user]);

    // --- Update profile ---
    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        if (!user) return;
        setUser({ ...user, ...updates });
    }, [user]);

    // --- Upgrade subscription ---
    const upgradeSubscription = useCallback((plan: SubscriptionPlan) => {
        if (!user || !subscription) return;

        const newSubscription: Subscription = {
            ...subscription,
            planId: plan,
            status: 'ACTIVE',
            startsAt: new Date().toISOString(),
            endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 дней
        };

        setSubscription(newSubscription);
    }, [user, subscription]);

    // --- Increment application count ---
    const incrementApplicationCount = useCallback(() => {
        if (!weeklyLimit) return;

        setWeeklyLimit({
            ...weeklyLimit,
            applicationsCount: weeklyLimit.applicationsCount + 1
        });
    }, [weeklyLimit]);

    // --- Check if can apply ---
    const canApplyCheck = useCallback((): boolean => {
        if (!subscription) return true;

        const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);
        if (!plan) return true;
        if (plan.applicationsPerWeek === null) return true; // безлимит
        if (!weeklyLimit) return true;

        return weeklyLimit.applicationsCount < plan.applicationsPerWeek;
    }, [subscription, weeklyLimit]);

    // --- Get remaining applications ---
    const getRemainingApplicationsCount = useCallback((): number | null => {
        if (!subscription) return null;

        const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);
        if (!plan) return null;
        if (plan.applicationsPerWeek === null) return null; // безлимит
        if (!weeklyLimit) return plan.applicationsPerWeek;

        return Math.max(0, plan.applicationsPerWeek - weeklyLimit.applicationsCount);
    }, [subscription, weeklyLimit]);

    // --- Check premium chat ---
    const hasPremiumChat = useCallback((): boolean => {
        if (!subscription) return false;
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);
        return plan?.chatEnabled ?? false;
    }, [subscription]);

    const value: AuthContextType = {
        user,
        subscription,
        weeklyLimit,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
        updateProfile,
        upgradeSubscription,
        incrementApplicationCount,
        canApply: canApplyCheck,
        getRemainingApplications: getRemainingApplicationsCount,
        hasPremiumChat
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
