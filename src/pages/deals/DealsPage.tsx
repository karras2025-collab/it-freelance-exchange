// ============================================
// Мои сделки / Проекты
// ============================================

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Avatar, EmptyState, Modal, Textarea } from '../../components/ui';
import { Deal, DealStatus } from '../../types';
import {
    Briefcase,
    CheckCircle,
    Clock,
    XCircle,
    MessageSquare,
    Star,
    Calendar,
    DollarSign,
    ArrowRight,
    AlertCircle,
    FileText,
    Zap,
    Award,
    Eye,
    Send,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';

interface DealsPageProps {
    onNavigate: (view: string, data?: any) => void;
}

export function DealsPage({ onNavigate }: DealsPageProps) {
    const { user, hasPremiumChat } = useAuth();
    const { deals, getDealsByUser, updateDealStatus, getMessagesByDeal } = useData();
    const { t, language } = useI18n();

    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled' | 'all'>('active');
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    const isFreelancer = user?.role === 'FREELANCER';
    const isClient = user?.role === 'CLIENT';
    const myDeals = user ? getDealsByUser(user.id) : [];

    // Фильтрация
    const filteredDeals = useMemo(() => {
        switch (activeTab) {
            case 'active':
                return myDeals.filter(d => d.status === 'IN_PROGRESS');
            case 'completed':
                return myDeals.filter(d => d.status === 'COMPLETED');
            case 'cancelled':
                return myDeals.filter(d => d.status === 'CANCELLED');
            default:
                return myDeals;
        }
    }, [myDeals, activeTab]);

    // Статистика
    const stats = useMemo(() => ({
        active: myDeals.filter(d => d.status === 'IN_PROGRESS').length,
        completed: myDeals.filter(d => d.status === 'COMPLETED').length,
        cancelled: myDeals.filter(d => d.status === 'CANCELLED').length,
        totalEarned: myDeals
            .filter(d => d.status === 'COMPLETED')
            .reduce((sum, d) => sum + (parseInt(d.dealPrice?.replace(/\D/g, '') || '0')), 0)
    }), [myDeals]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return language === 'ru' ? 'Сегодня' : 'Today';
        if (diffDays === 1) return language === 'ru' ? 'Вчера' : 'Yesterday';
        if (diffDays < 7) return language === 'ru' ? `${diffDays} дн. назад` : `${diffDays}d ago`;
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
    };

    const getStatusBadge = (status: DealStatus) => {
        switch (status) {
            case 'IN_PROGRESS':
                return (
                    <Badge color="blue" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.deals.status.inProgress}
                    </Badge>
                );
            case 'COMPLETED':
                return (
                    <Badge color="green" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {t.deals.status.completed}
                    </Badge>
                );
            case 'CANCELLED':
                return (
                    <Badge color="red" className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {t.deals.status.cancelled}
                    </Badge>
                );
            default:
                return <Badge color="gray">{status}</Badge>;
        }
    };

    const handleComplete = (deal: Deal) => {
        setSelectedDeal(deal);
        if (isClient) {
            // Клиент завершает сделку и оставляет отзыв
            setShowReviewModal(true);
        } else {
            // Фрилансер запрашивает завершение
            setShowActionModal(true);
        }
    };

    const handleCancel = (deal: Deal) => {
        setSelectedDeal(deal);
        setShowActionModal(true);
    };

    const confirmComplete = () => {
        if (selectedDeal) {
            updateDealStatus(selectedDeal.id, 'COMPLETED');
            // TODO: Save review
            setShowReviewModal(false);
            setShowActionModal(false);
            setSelectedDeal(null);
            setReviewData({ rating: 5, comment: '' });
        }
    };

    const confirmCancel = () => {
        if (selectedDeal) {
            updateDealStatus(selectedDeal.id, 'CANCELLED');
            setShowActionModal(false);
            setSelectedDeal(null);
        }
    };

    const tabs = [
        { id: 'active', label: language === 'ru' ? 'Активные' : 'Active', count: stats.active, icon: Clock },
        { id: 'completed', label: language === 'ru' ? 'Завершённые' : 'Completed', count: stats.completed, icon: CheckCircle },
        { id: 'cancelled', label: language === 'ru' ? 'Отменённые' : 'Cancelled', count: stats.cancelled, icon: XCircle },
        { id: 'all', label: language === 'ru' ? 'Все' : 'All', count: myDeals.length, icon: Briefcase }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {language === 'ru' ? 'Мои сделки' : 'My Deals'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {language === 'ru'
                            ? 'Управляйте вашими проектами и сделками'
                            : 'Manage your projects and deals'
                        }
                    </p>
                </div>
                {isFreelancer && (
                    <Button
                        onClick={() => onNavigate('SEARCH')}
                        leftIcon={<Briefcase className="w-4 h-4" />}
                    >
                        {t.jobs.findJobs}
                    </Button>
                )}
                {isClient && (
                    <Button
                        onClick={() => onNavigate('CREATE_JOB')}
                        leftIcon={<Briefcase className="w-4 h-4" />}
                    >
                        {t.jobs.createJob}
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.active}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'В работе' : 'In progress'}</div>
                </Card>
                <Card className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Завершено' : 'Completed'}</div>
                </Card>
                <Card className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Отменено' : 'Cancelled'}</div>
                </Card>
                <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                        <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                        {stats.totalEarned.toLocaleString()} ₽
                    </div>
                    <div className="text-sm text-slate-500">
                        {isFreelancer ? (language === 'ru' ? 'Заработано' : 'Earned') : (language === 'ru' ? 'Потрачено' : 'Spent')}
                    </div>
                </Card>
            </div>

            {/* Deals List */}
            <Card padding="none">
                {/* Tabs */}
                <div className="p-4 border-b border-slate-100 overflow-x-auto">
                    <div className="flex gap-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
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
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    <span className={`
                    text-xs px-1.5 py-0.5 rounded-full
                    ${activeTab === tab.id ? 'bg-blue-200' : 'bg-slate-200'}
                  `}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* List */}
                {filteredDeals.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredDeals.map(deal => {
                            const messages = getMessagesByDeal(deal.id);
                            const otherParty = isFreelancer ? deal.clientName : deal.freelancerName;
                            const otherAvatar = isFreelancer ? deal.clientAvatar : deal.freelancerAvatar;

                            return (
                                <div key={deal.id} className="p-5 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        {/* Main Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusBadge(deal.status)}
                                                <span className="text-sm text-slate-500">{formatDate(deal.createdAt)}</span>
                                            </div>

                                            <h3
                                                className="text-lg font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors mb-2"
                                                onClick={() => onNavigate('JOB_DETAILS', { jobId: deal.jobId })}
                                            >
                                                {deal.jobTitle}
                                            </h3>

                                            {/* Partner Info */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <Avatar src={otherAvatar} name={otherParty} size="sm" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{otherParty}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {isFreelancer
                                                            ? (language === 'ru' ? 'Заказчик' : 'Client')
                                                            : (language === 'ru' ? 'Исполнитель' : 'Freelancer')
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Deal Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                                    <span className="font-semibold">{deal.dealPrice}</span>
                                                </span>
                                                {deal.dealDeadline && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        {deal.dealDeadline}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-4 h-4 text-slate-400" />
                                                    {messages.length} {language === 'ru' ? 'сообщ.' : 'messages'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2">
                                            {deal.status === 'IN_PROGRESS' && (
                                                <>
                                                    {hasPremiumChat() && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => onNavigate('CHAT', { dealId: deal.id })}
                                                            leftIcon={<MessageSquare className="w-4 h-4" />}
                                                        >
                                                            {language === 'ru' ? 'Чат' : 'Chat'}
                                                        </Button>
                                                    )}
                                                    {!hasPremiumChat() && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => onNavigate('SUBSCRIPTION')}
                                                            leftIcon={<Zap className="w-4 h-4" />}
                                                            className="text-amber-600 border-amber-300"
                                                        >
                                                            Premium
                                                        </Button>
                                                    )}

                                                    {isClient && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleComplete(deal)}
                                                            leftIcon={<CheckCircle className="w-4 h-4" />}
                                                            className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                                                        >
                                                            {language === 'ru' ? 'Завершить' : 'Complete'}
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleCancel(deal)}
                                                        className="text-red-600"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}

                                            {deal.status === 'COMPLETED' && (
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= 5 ? 'fill-current' : ''}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onNavigate('JOB_DETAILS', { jobId: deal.jobId })}
                                            >
                                                <Eye className="w-4 h-4" />
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
                            icon={<Briefcase className="w-10 h-10" />}
                            title={
                                activeTab === 'active'
                                    ? (language === 'ru' ? 'Нет активных сделок' : 'No active deals')
                                    : activeTab === 'completed'
                                        ? (language === 'ru' ? 'Нет завершённых сделок' : 'No completed deals')
                                        : activeTab === 'cancelled'
                                            ? (language === 'ru' ? 'Нет отменённых сделок' : 'No cancelled deals')
                                            : (language === 'ru' ? 'Нет сделок' : 'No deals yet')
                            }
                            description={
                                myDeals.length === 0
                                    ? (language === 'ru'
                                        ? isFreelancer
                                            ? 'Найдите задание и отправьте отклик, чтобы начать работу'
                                            : 'Создайте задание и выберите исполнителя'
                                        : isFreelancer
                                            ? 'Find a job and submit an application to start working'
                                            : 'Create a job and choose a freelancer')
                                    : undefined
                            }
                            action={myDeals.length === 0 && (
                                isFreelancer ? (
                                    <Button onClick={() => onNavigate('SEARCH')} leftIcon={<Briefcase className="w-4 h-4" />}>
                                        {t.jobs.findJobs}
                                    </Button>
                                ) : (
                                    <Button onClick={() => onNavigate('CREATE_JOB')} leftIcon={<Briefcase className="w-4 h-4" />}>
                                        {t.jobs.createJob}
                                    </Button>
                                )
                            )}
                        />
                    </div>
                )}
            </Card>

            {/* Action Modal (Cancel) */}
            <Modal
                isOpen={showActionModal}
                onClose={() => {
                    setShowActionModal(false);
                    setSelectedDeal(null);
                }}
                title={language === 'ru' ? 'Отменить сделку?' : 'Cancel deal?'}
                size="sm"
            >
                <div className="p-5">
                    <div className="bg-red-50 rounded-xl p-4 mb-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-red-800">
                                {language === 'ru' ? 'Это действие нельзя отменить' : 'This action cannot be undone'}
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                                {language === 'ru'
                                    ? 'Сделка будет помечена как отменённая. Это может повлиять на ваш рейтинг.'
                                    : 'The deal will be marked as cancelled. This may affect your rating.'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setShowActionModal(false);
                                setSelectedDeal(null);
                            }}
                        >
                            {t.common.cancel}
                        </Button>
                        <Button
                            variant="danger"
                            fullWidth
                            onClick={confirmCancel}
                            leftIcon={<XCircle className="w-4 h-4" />}
                        >
                            {language === 'ru' ? 'Отменить сделку' : 'Cancel Deal'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Review Modal */}
            <Modal
                isOpen={showReviewModal}
                onClose={() => {
                    setShowReviewModal(false);
                    setSelectedDeal(null);
                    setReviewData({ rating: 5, comment: '' });
                }}
                title={language === 'ru' ? 'Завершить сделку и оставить отзыв' : 'Complete deal and leave a review'}
                size="md"
            >
                <div className="p-5 space-y-5">
                    <div className="text-center">
                        <p className="text-slate-600 mb-4">
                            {language === 'ru' ? 'Как вы оцениваете работу исполнителя?' : 'How do you rate the freelancer\'s work?'}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= reviewData.rating
                                                ? 'text-amber-400 fill-current'
                                                : 'text-slate-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            {reviewData.rating === 5 ? '⭐ ' + (language === 'ru' ? 'Отлично!' : 'Excellent!') :
                                reviewData.rating === 4 ? '👍 ' + (language === 'ru' ? 'Хорошо' : 'Good') :
                                    reviewData.rating === 3 ? '😐 ' + (language === 'ru' ? 'Нормально' : 'Average') :
                                        reviewData.rating === 2 ? '👎 ' + (language === 'ru' ? 'Плохо' : 'Poor') :
                                            '😞 ' + (language === 'ru' ? 'Очень плохо' : 'Very poor')
                            }
                        </p>
                    </div>

                    <Textarea
                        label={language === 'ru' ? 'Комментарий (опционально)' : 'Comment (optional)'}
                        placeholder={language === 'ru'
                            ? 'Напишите, что понравилось или можно улучшить...'
                            : 'Write what you liked or what could be improved...'
                        }
                        value={reviewData.comment}
                        onChange={e => setReviewData({ ...reviewData, comment: e.target.value })}
                    />

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setShowReviewModal(false);
                                setSelectedDeal(null);
                                setReviewData({ rating: 5, comment: '' });
                            }}
                        >
                            {t.common.cancel}
                        </Button>
                        <Button
                            fullWidth
                            onClick={confirmComplete}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                            {language === 'ru' ? 'Завершить сделку' : 'Complete Deal'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
