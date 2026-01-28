// ============================================
// Мои отклики (для фрилансера)
// ============================================

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Avatar, EmptyState, Modal } from '../../components/ui';
import { Application, ApplicationStatus } from '../../types';
import { SUBSCRIPTION_PLANS } from '../../constants';
import {
    Send,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    MessageSquare,
    DollarSign,
    Calendar,
    ArrowRight,
    Filter,
    TrendingUp,
    Zap,
    ExternalLink,
    Trash2,
    RefreshCw
} from 'lucide-react';

interface MyApplicationsProps {
    onNavigate: (view: string, data?: any) => void;
}

export function MyApplications({ onNavigate }: MyApplicationsProps) {
    const { user, subscription, getRemainingApplications, hasPremiumChat } = useAuth();
    const { applications, getApplicationsByFreelancer, getJob, getDealsByUser } = useData();
    const { t, language } = useI18n();

    const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'viewed' | 'accepted' | 'rejected'>('all');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const myApplications = user ? getApplicationsByFreelancer(user.id) : [];
    const myDeals = user ? getDealsByUser(user.id) : [];
    const remainingApps = getRemainingApplications();
    const currentPlan = subscription
        ? SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId)
        : SUBSCRIPTION_PLANS[0];

    // Фильтрация по статусу
    const filteredApplications = useMemo(() => {
        if (activeTab === 'all') return myApplications;
        return myApplications.filter(app => app.status.toLowerCase() === activeTab);
    }, [myApplications, activeTab]);

    // Статистика
    const stats = useMemo(() => ({
        total: myApplications.length,
        sent: myApplications.filter(a => a.status === 'SENT').length,
        viewed: myApplications.filter(a => a.status === 'VIEWED').length,
        accepted: myApplications.filter(a => a.status === 'ACCEPTED').length,
        rejected: myApplications.filter(a => a.status === 'REJECTED').length,
        successRate: myApplications.length > 0
            ? Math.round((myApplications.filter(a => a.status === 'ACCEPTED').length / myApplications.length) * 100)
            : 0
    }), [myApplications]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return language === 'ru' ? 'Только что' : 'Just now';
        if (diffHours < 24) return language === 'ru' ? `${diffHours} ч. назад` : `${diffHours}h ago`;
        if (diffDays === 1) return language === 'ru' ? 'Вчера' : 'Yesterday';
        if (diffDays < 7) return language === 'ru' ? `${diffDays} дн. назад` : `${diffDays}d ago`;
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
    };

    const getStatusBadge = (status: ApplicationStatus) => {
        switch (status) {
            case 'SENT':
                return (
                    <Badge color="blue" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.applications.status.sent}
                    </Badge>
                );
            case 'VIEWED':
                return (
                    <Badge color="purple" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {t.applications.status.viewed}
                    </Badge>
                );
            case 'ACCEPTED':
                return (
                    <Badge color="green" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {t.applications.status.accepted}
                    </Badge>
                );
            case 'REJECTED':
                return (
                    <Badge color="red" className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {t.applications.status.rejected}
                    </Badge>
                );
            default:
                return <Badge color="gray">{status}</Badge>;
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case 'SENT': return 'border-l-blue-500';
            case 'VIEWED': return 'border-l-purple-500';
            case 'ACCEPTED': return 'border-l-emerald-500';
            case 'REJECTED': return 'border-l-red-500';
            default: return 'border-l-slate-300';
        }
    };

    // Проверяем, есть ли сделка для этого отклика
    const hasDeal = (applicationId: string) => {
        return myDeals.some(d => d.applicationId === applicationId);
    };

    const openDetails = (app: Application) => {
        setSelectedApp(app);
        setShowDetailsModal(true);
    };

    const tabs = [
        { id: 'all', label: language === 'ru' ? 'Все' : 'All', count: stats.total },
        { id: 'sent', label: language === 'ru' ? 'Отправлено' : 'Sent', count: stats.sent },
        { id: 'viewed', label: language === 'ru' ? 'Просмотрено' : 'Viewed', count: stats.viewed },
        { id: 'accepted', label: language === 'ru' ? 'Принято' : 'Accepted', count: stats.accepted },
        { id: 'rejected', label: language === 'ru' ? 'Отклонено' : 'Rejected', count: stats.rejected }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t.nav.myApplications}</h1>
                    <p className="text-slate-500 mt-1">
                        {language === 'ru'
                            ? 'Отслеживайте статус ваших откликов'
                            : 'Track the status of your applications'
                        }
                    </p>
                </div>
                <Button
                    onClick={() => onNavigate('SEARCH')}
                    leftIcon={<Send className="w-4 h-4" />}
                >
                    {t.jobs.findJobs}
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Remaining Applications */}
                <Card className="col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between">
                            <Send className="w-6 h-6 text-blue-200" />
                            <Badge color="blue" className="bg-white/20 text-white border-0">
                                {currentPlan?.name}
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-bold">
                                {remainingApps !== null ? `${remainingApps}/3` : '∞'}
                            </div>
                            <div className="text-sm text-blue-100">{t.limits.applicationsLeft}</div>
                        </div>
                        {remainingApps !== null && remainingApps === 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 border-white/30 text-white hover:bg-white/10"
                                onClick={() => onNavigate('SUBSCRIPTION')}
                            >
                                {t.subscription.upgrade}
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Stats */}
                <Card className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Всего' : 'Total'}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.sent + stats.viewed}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'В ожидании' : 'Pending'}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.accepted}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Принято' : 'Accepted'}</div>
                </Card>
                <Card className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <TrendingUp className={`w-4 h-4 ${stats.successRate >= 30 ? 'text-emerald-500' : 'text-amber-500'}`} />
                        <span className="text-2xl font-bold text-slate-900">{stats.successRate}%</span>
                    </div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Успешность' : 'Success rate'}</div>
                </Card>
            </div>

            {/* Applications List */}
            <Card padding="none">
                {/* Tabs */}
                <div className="p-4 border-b border-slate-100 overflow-x-auto">
                    <div className="flex gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }
                `}
                            >
                                {tab.label}
                                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${activeTab === tab.id ? 'bg-blue-200' : 'bg-slate-200'}
                `}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {filteredApplications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredApplications.map(app => {
                            const job = getJob(app.jobId);
                            const dealExists = hasDeal(app.id);

                            return (
                                <div
                                    key={app.id}
                                    className={`p-5 hover:bg-slate-50 transition-colors border-l-4 ${getStatusColor(app.status)}`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        {/* Main Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusBadge(app.status)}
                                                <span className="text-sm text-slate-500">{formatDate(app.createdAt)}</span>
                                            </div>

                                            <h3
                                                className="text-lg font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors mb-1"
                                                onClick={() => onNavigate('JOB_DETAILS', { jobId: app.jobId })}
                                            >
                                                {app.jobTitle}
                                            </h3>

                                            {job && (
                                                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        {job.budgetValue || (language === 'ru' ? 'Договорная' : 'Negotiable')}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{job.category}</span>
                                                </div>
                                            )}

                                            {/* Your proposal */}
                                            <div className="bg-slate-50 rounded-xl p-3 mt-3">
                                                <p className="text-sm text-slate-600 font-medium mb-1">
                                                    {language === 'ru' ? 'Ваше предложение:' : 'Your proposal:'}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="font-semibold text-slate-900">{app.priceText}</span>
                                                    <span className="text-slate-500">•</span>
                                                    <span className="text-slate-600">{app.etaText}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{app.message}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col items-center md:items-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDetails(app)}
                                                leftIcon={<Eye className="w-4 h-4" />}
                                            >
                                                {language === 'ru' ? 'Детали' : 'Details'}
                                            </Button>

                                            {app.status === 'ACCEPTED' && dealExists && hasPremiumChat() && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => onNavigate('CHAT')}
                                                    leftIcon={<MessageSquare className="w-4 h-4" />}
                                                >
                                                    {language === 'ru' ? 'Чат' : 'Chat'}
                                                </Button>
                                            )}

                                            {app.status === 'ACCEPTED' && dealExists && !hasPremiumChat() && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onNavigate('SUBSCRIPTION')}
                                                    leftIcon={<Zap className="w-4 h-4" />}
                                                    className="text-amber-600 border-amber-300 hover:bg-amber-50"
                                                >
                                                    Premium
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onNavigate('JOB_DETAILS', { jobId: app.jobId })}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-16">
                        <EmptyState
                            icon={<Send className="w-10 h-10" />}
                            title={
                                activeTab === 'all'
                                    ? (language === 'ru' ? 'Нет откликов' : 'No applications yet')
                                    : (language === 'ru' ? 'Нет откликов в этой категории' : 'No applications in this category')
                            }
                            description={
                                activeTab === 'all'
                                    ? (language === 'ru'
                                        ? 'Найдите интересный проект и отправьте первый отклик'
                                        : 'Find an interesting project and submit your first application')
                                    : undefined
                            }
                            action={activeTab === 'all' && (
                                <Button onClick={() => onNavigate('SEARCH')} leftIcon={<Send className="w-4 h-4" />}>
                                    {t.jobs.findJobs}
                                </Button>
                            )}
                        />
                    </div>
                )}
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">
                            {language === 'ru' ? 'Советы для успешных откликов' : 'Tips for successful applications'}
                        </h3>
                        <ul className="text-sm text-slate-600 mt-2 space-y-1">
                            <li>• {language === 'ru' ? 'Пишите персонализированные сопроводительные письма' : 'Write personalized cover letters'}</li>
                            <li>• {language === 'ru' ? 'Указывайте релевантный опыт и портфолио' : 'Highlight relevant experience and portfolio'}</li>
                            <li>• {language === 'ru' ? 'Отвечайте в течение 24 часов' : 'Respond within 24 hours'}</li>
                            <li>• {language === 'ru' ? 'Будьте конкретны в сроках и стоимости' : 'Be specific about timeline and pricing'}</li>
                        </ul>
                    </div>
                </div>
            </Card>

            {/* Details Modal */}
            <Modal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedApp(null);
                }}
                title={language === 'ru' ? 'Детали отклика' : 'Application Details'}
                size="lg"
            >
                {selectedApp && (
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            {getStatusBadge(selectedApp.status)}
                            <span className="text-sm text-slate-500">{formatDate(selectedApp.createdAt)}</span>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">{selectedApp.jobTitle}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs text-slate-500 mb-1">{t.applications.yourPrice}</p>
                                <p className="font-bold text-slate-900">{selectedApp.priceText}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs text-slate-500 mb-1">{t.applications.estimatedTime}</p>
                                <p className="font-bold text-slate-900">{selectedApp.etaText}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500 mb-2">{t.applications.coverLetter}</p>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-slate-700 whitespace-pre-line">{selectedApp.message}</p>
                            </div>
                        </div>

                        {selectedApp.portfolioLinks && selectedApp.portfolioLinks.length > 0 && (
                            <div>
                                <p className="text-xs text-slate-500 mb-2">{language === 'ru' ? 'Портфолио:' : 'Portfolio:'}</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApp.portfolioLinks.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            {link}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => onNavigate('JOB_DETAILS', { jobId: selectedApp.jobId })}
                                leftIcon={<Eye className="w-4 h-4" />}
                            >
                                {language === 'ru' ? 'Открыть задание' : 'View Job'}
                            </Button>
                            {selectedApp.status === 'ACCEPTED' && hasPremiumChat() && (
                                <Button
                                    className="flex-1"
                                    onClick={() => onNavigate('CHAT')}
                                    leftIcon={<MessageSquare className="w-4 h-4" />}
                                >
                                    {language === 'ru' ? 'Перейти в чат' : 'Go to Chat'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
