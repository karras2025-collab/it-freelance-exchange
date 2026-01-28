// ============================================
// Мои задания (для заказчика)
// ============================================

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Avatar, Modal, Tabs, EmptyState } from '../../components/ui';
import { Job, JobStatus } from '../../types';
import {
    Plus,
    Eye,
    Pause,
    Play,
    Trash2,
    Edit3,
    Users,
    MessageSquare,
    MoreVertical,
    Calendar,
    DollarSign,
    Clock,
    ArrowRight,
    ChevronDown,
    Filter,
    Search,
    CheckCircle,
    XCircle,
    AlertCircle,
    Briefcase
} from 'lucide-react';

interface MyJobsProps {
    onNavigate: (view: string, data?: any) => void;
}

export function MyJobs({ onNavigate }: MyJobsProps) {
    const { user } = useAuth();
    const { jobs, getJobsByClient, getApplicationsByJob, updateJobStatus } = useData();
    const { t, language } = useI18n();

    const [activeTab, setActiveTab] = useState<'all' | 'published' | 'paused' | 'closed'>('all');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showActionsModal, setShowActionsModal] = useState(false);
    const [sortBy, setSortBy] = useState<'recent' | 'applications' | 'budget'>('recent');

    const myJobs = user ? getJobsByClient(user.id) : [];

    // Фильтрация по статусу
    const filteredJobs = useMemo(() => {
        let filtered = myJobs;

        if (activeTab !== 'all') {
            filtered = filtered.filter(job => job.status.toLowerCase() === activeTab);
        }

        // Сортировка
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'applications':
                    return b.applicationCount - a.applicationCount;
                case 'budget':
                    const aVal = parseInt(a.budgetValue?.replace(/\D/g, '') || '0');
                    const bVal = parseInt(b.budgetValue?.replace(/\D/g, '') || '0');
                    return bVal - aVal;
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return filtered;
    }, [myJobs, activeTab, sortBy]);

    const stats = useMemo(() => ({
        total: myJobs.length,
        published: myJobs.filter(j => j.status === 'PUBLISHED').length,
        paused: myJobs.filter(j => j.status === 'PAUSED').length,
        closed: myJobs.filter(j => j.status === 'CLOSED').length,
        totalApplications: myJobs.reduce((sum, j) => sum + j.applicationCount, 0)
    }), [myJobs]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return language === 'ru' ? 'Сегодня' : 'Today';
        if (diffDays === 1) return language === 'ru' ? 'Вчера' : 'Yesterday';
        if (diffDays < 7) return language === 'ru' ? `${diffDays} дн. назад` : `${diffDays}d ago`;
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
    };

    const getStatusBadge = (status: JobStatus) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge color="green">{t.jobs.status.published}</Badge>;
            case 'PAUSED':
                return <Badge color="yellow">{t.jobs.status.paused}</Badge>;
            case 'CLOSED':
                return <Badge color="gray">{t.jobs.status.closed}</Badge>;
            default:
                return <Badge color="gray">{status}</Badge>;
        }
    };

    const handleStatusChange = (job: Job, newStatus: JobStatus) => {
        updateJobStatus(job.id, newStatus);
        setShowActionsModal(false);
        setSelectedJob(null);
    };

    const tabs = [
        { id: 'all', label: language === 'ru' ? `Все (${stats.total})` : `All (${stats.total})` },
        { id: 'published', label: language === 'ru' ? `Активные (${stats.published})` : `Active (${stats.published})` },
        { id: 'paused', label: language === 'ru' ? `На паузе (${stats.paused})` : `Paused (${stats.paused})` },
        { id: 'closed', label: language === 'ru' ? `Закрытые (${stats.closed})` : `Closed (${stats.closed})` }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t.nav.myJobs}</h1>
                    <p className="text-slate-500 mt-1">
                        {stats.totalApplications} {language === 'ru' ? 'откликов' : 'applications'} {language === 'ru' ? 'на ваши задания' : 'on your jobs'}
                    </p>
                </div>
                <Button
                    size="lg"
                    onClick={() => onNavigate('CREATE_JOB')}
                    leftIcon={<Plus className="w-5 h-5" />}
                >
                    {t.jobs.createJob}
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Всего' : 'Total'}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">{stats.published}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Активных' : 'Active'}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-amber-600">{stats.paused}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'На паузе' : 'Paused'}</div>
                </Card>
                <Card className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalApplications}</div>
                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Откликов' : 'Applications'}</div>
                </Card>
            </div>

            {/* Tabs & Filters */}
            <Card padding="none">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Tabs */}
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                  px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors
                  ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{language === 'ru' ? 'Сортировка:' : 'Sort:'}</span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as any)}
                            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="recent">{language === 'ru' ? 'По дате' : 'Recent'}</option>
                            <option value="applications">{language === 'ru' ? 'По откликам' : 'By applications'}</option>
                            <option value="budget">{language === 'ru' ? 'По бюджету' : 'By budget'}</option>
                        </select>
                    </div>
                </div>

                {/* Jobs List */}
                {filteredJobs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredJobs.map(job => {
                            const applications = getApplicationsByJob(job.id);
                            const pendingApplications = applications.filter(a => a.status === 'SENT').length;

                            return (
                                <div
                                    key={job.id}
                                    className="p-5 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Main Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getStatusBadge(job.status)}
                                                <Badge color="blue" size="sm">{job.category}</Badge>
                                            </div>

                                            <h3
                                                className="text-lg font-semibold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors mb-2"
                                                onClick={() => onNavigate('JOB_DETAILS', { jobId: job.id })}
                                            >
                                                {job.title}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(job.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    {job.budgetValue || (language === 'ru' ? 'Договорная' : 'Negotiable')}
                                                </span>
                                                {job.deadline && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {job.deadline}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Skills */}
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {job.skills.slice(0, 4).map(skill => (
                                                    <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills.length > 4 && (
                                                    <span className="text-xs text-slate-400">+{job.skills.length - 4}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions Column */}
                                        <div className="flex flex-col items-end gap-3">
                                            {/* Applications Counter */}
                                            <button
                                                onClick={() => onNavigate('JOB_DETAILS', { jobId: job.id })}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                            >
                                                <Users className="w-4 h-4 text-slate-600" />
                                                <span className="font-semibold text-slate-900">{job.applicationCount}</span>
                                                {pendingApplications > 0 && (
                                                    <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                                                        {pendingApplications}
                                                    </span>
                                                )}
                                            </button>

                                            {/* Quick Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onNavigate('JOB_DETAILS', { jobId: job.id })}
                                                    title={language === 'ru' ? 'Просмотр' : 'View'}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>

                                                {job.status === 'PUBLISHED' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleStatusChange(job, 'PAUSED')}
                                                        title={language === 'ru' ? 'Пауза' : 'Pause'}
                                                    >
                                                        <Pause className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                {job.status === 'PAUSED' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleStatusChange(job, 'PUBLISHED')}
                                                        title={language === 'ru' ? 'Возобновить' : 'Resume'}
                                                    >
                                                        <Play className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setShowActionsModal(true);
                                                    }}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
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
                            title={language === 'ru' ? 'Нет заданий' : 'No jobs yet'}
                            description={
                                activeTab === 'all'
                                    ? (language === 'ru'
                                        ? 'Создайте первое задание и найдите исполнителя'
                                        : 'Create your first job and find a freelancer')
                                    : (language === 'ru'
                                        ? 'В этой категории пока нет заданий'
                                        : 'No jobs in this category yet')
                            }
                            action={activeTab === 'all' && (
                                <Button onClick={() => onNavigate('CREATE_JOB')} leftIcon={<Plus className="w-4 h-4" />}>
                                    {t.jobs.createJob}
                                </Button>
                            )}
                        />
                    </div>
                )}
            </Card>

            {/* Actions Modal */}
            <Modal
                isOpen={showActionsModal}
                onClose={() => {
                    setShowActionsModal(false);
                    setSelectedJob(null);
                }}
                title={language === 'ru' ? 'Действия с заданием' : 'Job Actions'}
                size="sm"
            >
                {selectedJob && (
                    <div className="p-4 space-y-2">
                        <p className="text-slate-600 mb-4 font-medium">{selectedJob.title}</p>

                        <button
                            onClick={() => onNavigate('JOB_DETAILS', { jobId: selectedJob.id })}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                        >
                            <Eye className="w-5 h-5 text-slate-500" />
                            <span>{language === 'ru' ? 'Просмотреть' : 'View'}</span>
                        </button>

                        <button
                            onClick={() => { }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                        >
                            <Edit3 className="w-5 h-5 text-slate-500" />
                            <span>{language === 'ru' ? 'Редактировать' : 'Edit'}</span>
                        </button>

                        {selectedJob.status === 'PUBLISHED' && (
                            <button
                                onClick={() => handleStatusChange(selectedJob, 'PAUSED')}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors text-left text-amber-700"
                            >
                                <Pause className="w-5 h-5" />
                                <span>{language === 'ru' ? 'Поставить на паузу' : 'Pause'}</span>
                            </button>
                        )}

                        {selectedJob.status === 'PAUSED' && (
                            <button
                                onClick={() => handleStatusChange(selectedJob, 'PUBLISHED')}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors text-left text-emerald-700"
                            >
                                <Play className="w-5 h-5" />
                                <span>{language === 'ru' ? 'Возобновить' : 'Resume'}</span>
                            </button>
                        )}

                        {selectedJob.status !== 'CLOSED' && (
                            <button
                                onClick={() => handleStatusChange(selectedJob, 'CLOSED')}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left text-red-600"
                            >
                                <XCircle className="w-5 h-5" />
                                <span>{language === 'ru' ? 'Закрыть задание' : 'Close job'}</span>
                            </button>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
