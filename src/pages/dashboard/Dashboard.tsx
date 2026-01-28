// ============================================
// Dashboard страница
// ============================================

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Avatar, EmptyState } from '../../components/ui';
import { SUBSCRIPTION_PLANS } from '../../constants';
import {
    Briefcase,
    Send,
    MessageSquare,
    TrendingUp,
    Clock,
    ArrowRight,
    Star,
    Zap
} from 'lucide-react';

interface DashboardProps {
    onNavigate: (view: string, data?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
    const { user, subscription, getRemainingApplications } = useAuth();
    const { jobs, applications, deals, getJobsByClient, getApplicationsByFreelancer, getDealsByUser } = useData();
    const { t, language } = useI18n();

    if (!user) return null;

    const isClient = user.role === 'CLIENT';
    const isFreelancer = user.role === 'FREELANCER';

    const currentPlan = subscription
        ? SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId)
        : SUBSCRIPTION_PLANS[0];

    const remainingApps = getRemainingApplications();
    const myJobs = isClient ? getJobsByClient(user.id) : [];
    const myApplications = isFreelancer ? getApplicationsByFreelancer(user.id) : [];
    const myDeals = getDealsByUser(user.id);
    const publishedJobs = jobs.filter(j => j.status === 'PUBLISHED').slice(0, 3);

    // Stats
    const clientStats = {
        activeJobs: myJobs.filter(j => j.status === 'PUBLISHED').length,
        totalApplications: myJobs.reduce((sum, j) => sum + j.applicationCount, 0),
        activeDeals: myDeals.filter(d => d.status === 'IN_PROGRESS').length
    };

    const freelancerStats = {
        sentApplications: myApplications.length,
        acceptedApplications: myApplications.filter(a => a.status === 'ACCEPTED').length,
        activeDeals: myDeals.filter(d => d.status === 'IN_PROGRESS').length
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {language === 'ru' ? 'Добро пожаловать' : 'Welcome'}, {user.displayName}! 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {language === 'ru'
                            ? 'Вот что происходит на платформе сегодня'
                            : "Here's what's happening today"
                        }
                    </p>
                </div>

                {isClient && (
                    <Button
                        size="lg"
                        leftIcon={<Briefcase className="w-5 h-5" />}
                        onClick={() => onNavigate('CREATE_JOB')}
                    >
                        {t.jobs.createJob}
                    </Button>
                )}

                {isFreelancer && (
                    <Button
                        size="lg"
                        leftIcon={<Send className="w-5 h-5" />}
                        onClick={() => onNavigate('SEARCH')}
                    >
                        {t.jobs.findJobs}
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isClient && (
                    <>
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">{t.nav.myJobs}</p>
                                    <p className="text-3xl font-bold mt-1">{clientStats.activeJobs}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">{t.nav.applications}</p>
                                    <p className="text-3xl font-bold mt-1">{clientStats.totalApplications}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Send className="w-6 h-6" />
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium">{t.nav.deals}</p>
                                    <p className="text-3xl font-bold mt-1">{clientStats.activeDeals}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                        </Card>
                    </>
                )}

                {isFreelancer && (
                    <>
                        <Card className="relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">{t.limits.applicationsLeft}</p>
                                    <p className="text-3xl font-bold mt-1 text-slate-900">
                                        {remainingApps !== null ? `${remainingApps}/3` : '∞'}
                                    </p>
                                    <Badge
                                        color={currentPlan?.id === 'PREMIUM' ? 'yellow' : currentPlan?.id === 'PRO' ? 'blue' : 'gray'}
                                        className="mt-2"
                                    >
                                        {currentPlan?.name}
                                    </Badge>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Send className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            {remainingApps !== null && remainingApps === 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        fullWidth
                                        onClick={() => onNavigate('SUBSCRIPTION')}
                                    >
                                        {t.subscription.upgrade}
                                    </Button>
                                </div>
                            )}
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">{t.applications.title}</p>
                                    <p className="text-3xl font-bold mt-1 text-slate-900">{freelancerStats.sentApplications}</p>
                                    <p className="text-sm text-emerald-600 mt-1">
                                        {freelancerStats.acceptedApplications} {language === 'ru' ? 'принято' : 'accepted'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Star className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium">{t.deals.title}</p>
                                    <p className="text-3xl font-bold mt-1 text-slate-900">{freelancerStats.activeDeals}</p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {language === 'ru' ? 'в работе' : 'in progress'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Jobs/Applications */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Freelancer: Recommended Jobs */}
                    {isFreelancer && (
                        <Card padding="none">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {language === 'ru' ? 'Рекомендуемые задания' : 'Recommended Jobs'}
                                </h2>
                                <button
                                    onClick={() => onNavigate('SEARCH')}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center"
                                >
                                    {t.common.more}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>

                            {publishedJobs.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {publishedJobs.map(job => (
                                        <div
                                            key={job.id}
                                            onClick={() => onNavigate('JOB_DETAILS', { jobId: job.id })}
                                            className="p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-sm text-slate-500">{job.clientName}</span>
                                                        <Badge color="blue" size="sm">{job.category}</Badge>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {job.skills.slice(0, 4).map(skill => (
                                                            <Badge key={skill} color="gray" size="sm">{skill}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="font-bold text-slate-900">
                                                        {job.budgetType === 'DISCUSS'
                                                            ? (language === 'ru' ? 'Договорная' : 'Negotiable')
                                                            : job.budgetValue
                                                        }
                                                    </p>
                                                    <p className="text-xs text-slate-500 capitalize mt-1">
                                                        {job.budgetType === 'HOURLY' ? t.jobs.hourly : job.budgetType === 'FIXED' ? t.jobs.fixed : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<Briefcase className="w-8 h-8" />}
                                    title={t.jobs.noJobs}
                                />
                            )}
                        </Card>
                    )}

                    {/* Client: My Jobs */}
                    {isClient && (
                        <Card padding="none">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">{t.nav.myJobs}</h2>
                                <button
                                    onClick={() => onNavigate('MY_JOBS')}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center"
                                >
                                    {t.common.more}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>

                            {myJobs.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {myJobs.slice(0, 3).map(job => (
                                        <div
                                            key={job.id}
                                            onClick={() => onNavigate('JOB_DETAILS', { jobId: job.id })}
                                            className="p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <Badge
                                                            color={job.status === 'PUBLISHED' ? 'green' : job.status === 'PAUSED' ? 'yellow' : 'gray'}
                                                            size="sm"
                                                        >
                                                            {t.jobs.status[job.status.toLowerCase() as keyof typeof t.jobs.status]}
                                                        </Badge>
                                                        <span className="text-sm text-slate-500">
                                                            {job.applicationCount} {t.jobs.applications}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-slate-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <EmptyState
                                        icon={<Briefcase className="w-8 h-8" />}
                                        title={t.jobs.noJobs}
                                        action={
                                            <Button onClick={() => onNavigate('CREATE_JOB')}>
                                                {t.jobs.createJob}
                                            </Button>
                                        }
                                    />
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Active Deals */}
                    <Card padding="none">
                        <div className="p-5 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">{t.deals.title}</h2>
                        </div>

                        {myDeals.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {myDeals.slice(0, 3).map(deal => (
                                    <div
                                        key={deal.id}
                                        onClick={() => onNavigate('CHAT', { dealId: deal.id })}
                                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={isClient ? deal.freelancerAvatar : deal.clientAvatar}
                                                name={isClient ? deal.freelancerName : deal.clientName}
                                                size="sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{deal.jobTitle}</p>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {isClient ? deal.freelancerName : deal.clientName}
                                                </p>
                                            </div>
                                            <Badge
                                                color={deal.status === 'IN_PROGRESS' ? 'blue' : deal.status === 'COMPLETED' ? 'green' : 'gray'}
                                                size="sm"
                                            >
                                                {t.deals.status[deal.status.toLowerCase().replace('_', '') as keyof typeof t.deals.status] || deal.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-slate-500 text-sm">{t.deals.noDeals}</p>
                            </div>
                        )}
                    </Card>

                    {/* Upgrade Card (Freelancer only) */}
                    {isFreelancer && currentPlan?.id !== 'PREMIUM' && (
                        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {language === 'ru' ? 'Откройте Premium' : 'Unlock Premium'}
                                    </h3>
                                    <p className="text-sm text-slate-600 mt-1">
                                        {language === 'ru'
                                            ? 'Безлимит откликов и прямой чат с заказчиками'
                                            : 'Unlimited applications and direct chat with clients'
                                        }
                                    </p>
                                    <Button
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => onNavigate('SUBSCRIPTION')}
                                    >
                                        {t.subscription.upgrade}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Quick Tips */}
                    <Card>
                        <h3 className="font-bold text-slate-900 mb-4">
                            {language === 'ru' ? '💡 Советы' : '💡 Quick Tips'}
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                {language === 'ru'
                                    ? 'Заполните профиль для лучших откликов'
                                    : 'Complete your profile for better responses'
                                }
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                {language === 'ru'
                                    ? 'Добавьте портфолио с примерами работ'
                                    : 'Add portfolio with work samples'
                                }
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                {language === 'ru'
                                    ? 'Отвечайте быстро на сообщения'
                                    : 'Respond quickly to messages'
                                }
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
}
