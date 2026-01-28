// ============================================
// Детали задания + форма отклика
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Input, Textarea, Avatar, Modal } from '../../components/ui';
import { SUBSCRIPTION_PLANS } from '../../constants';
import {
    ArrowLeft,
    Briefcase,
    Clock,
    Calendar,
    DollarSign,
    Send,
    CheckCircle,
    AlertCircle,
    Star,
    ExternalLink,
    Zap
} from 'lucide-react';

interface JobDetailsProps {
    jobId: string;
    onNavigate: (view: string, data?: any) => void;
}

export function JobDetails({ jobId, onNavigate }: JobDetailsProps) {
    const { user, canApply, getRemainingApplications, incrementApplicationCount } = useAuth();
    const { getJob, hasApplied, createApplication, getApplicationsByJob } = useData();
    const { t, language } = useI18n();

    const [showApplyForm, setShowApplyForm] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [priceText, setPriceText] = useState('');
    const [etaText, setEtaText] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const job = getJob(jobId);
    const isClient = user?.role === 'CLIENT';
    const isFreelancer = user?.role === 'FREELANCER';
    const alreadyApplied = user ? hasApplied(jobId, user.id) : false;
    const jobApplications = getApplicationsByJob(jobId);
    const remainingApps = getRemainingApplications();

    if (!job) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20">
                <p className="text-slate-500">{language === 'ru' ? 'Задание не найдено' : 'Job not found'}</p>
                <Button variant="outline" className="mt-4" onClick={() => onNavigate('SEARCH')}>
                    {t.common.back}
                </Button>
            </div>
        );
    }

    const handleApplyClick = () => {
        if (!canApply()) {
            setShowPaywall(true);
            return;
        }
        setShowApplyForm(true);
    };

    const handleSubmitApplication = async () => {
        if (!user || !priceText || !etaText || message.length < 50) return;

        setIsSubmitting(true);

        // Симуляция отправки
        await new Promise(resolve => setTimeout(resolve, 1000));

        createApplication({
            jobId: job.id,
            jobTitle: job.title,
            freelancerId: user.id,
            freelancerName: user.displayName,
            freelancerAvatar: user.avatarUrl,
            priceText,
            etaText,
            message,
            portfolioLinks: user.portfolioLinks
        });

        incrementApplicationCount();
        setIsSubmitting(false);
        setSubmitted(true);
        setShowApplyForm(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => onNavigate('SEARCH')}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
                {t.common.back}
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Header */}
                    <Card>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                        color={job.status === 'PUBLISHED' ? 'green' : job.status === 'PAUSED' ? 'yellow' : 'gray'}
                                    >
                                        {t.jobs.status[job.status.toLowerCase() as keyof typeof t.jobs.status]}
                                    </Badge>
                                    <Badge color="blue">{job.category}</Badge>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <Avatar src={job.clientAvatar} name={job.clientName} size="md" />
                            <div>
                                <p className="font-medium text-slate-900">{job.clientName}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(job.createdAt)}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pt-4">
                            <h2 className="font-semibold text-slate-900 mb-3">{t.jobs.description}</h2>
                            <div className="text-slate-600 whitespace-pre-line leading-relaxed">
                                {job.description}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <h2 className="font-semibold text-slate-900 mb-3">{t.jobs.skills}</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map(skill => (
                                    <Badge key={skill} color="gray">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Applications (Client view) */}
                    {isClient && job.clientId === user?.id && (
                        <Card padding="none">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">
                                    {t.applications.title} ({jobApplications.length})
                                </h2>
                            </div>

                            {jobApplications.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {jobApplications.map(app => (
                                        <div key={app.id} className="p-5">
                                            <div className="flex items-start gap-4">
                                                <Avatar src={app.freelancerAvatar} name={app.freelancerName} size="md" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{app.freelancerName}</p>
                                                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <DollarSign className="w-4 h-4" />
                                                                    {app.priceText}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    {app.etaText}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            color={
                                                                app.status === 'ACCEPTED' ? 'green' :
                                                                    app.status === 'REJECTED' ? 'red' :
                                                                        'blue'
                                                            }
                                                        >
                                                            {t.applications.status[app.status.toLowerCase() as keyof typeof t.applications.status]}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-slate-600 mt-3">{app.message}</p>

                                                    {app.status === 'SENT' && (
                                                        <div className="flex gap-2 mt-4">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => onNavigate('CREATE_DEAL', { applicationId: app.id })}
                                                            >
                                                                {t.applications.accept}
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                {t.applications.reject}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    {t.applications.noApplications}
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Budget Card */}
                    <Card>
                        <h3 className="font-semibold text-slate-900 mb-4">{t.jobs.budget}</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">{t.jobs.budgetType}</span>
                                <span className="font-medium text-slate-900">
                                    {job.budgetType === 'FIXED' ? t.jobs.fixed :
                                        job.budgetType === 'HOURLY' ? t.jobs.hourly :
                                            t.jobs.discuss}
                                </span>
                            </div>

                            {job.budgetValue && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t.jobs.budget}</span>
                                    <span className="text-xl font-bold text-slate-900">{job.budgetValue}</span>
                                </div>
                            )}

                            {job.deadline && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t.jobs.deadline}</span>
                                    <span className="font-medium text-slate-900">{job.deadline}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">{t.jobs.applications}</span>
                                <span className="font-medium text-slate-900">{job.applicationCount}</span>
                            </div>
                        </div>

                        {/* Apply Button */}
                        {isFreelancer && job.status === 'PUBLISHED' && (
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                {submitted || alreadyApplied ? (
                                    <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                                        <CheckCircle className="w-5 h-5" />
                                        {t.applications.applicationSent}
                                    </div>
                                ) : (
                                    <>
                                        <Button
                                            fullWidth
                                            size="lg"
                                            onClick={handleApplyClick}
                                            leftIcon={<Send className="w-5 h-5" />}
                                        >
                                            {t.applications.apply}
                                        </Button>
                                        {remainingApps !== null && (
                                            <p className="text-center text-sm text-slate-500 mt-2">
                                                {t.limits.applicationsLeft}: {remainingApps}/3
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Client Actions */}
                    {isClient && job.clientId === user?.id && (
                        <Card>
                            <h3 className="font-semibold text-slate-900 mb-4">
                                {language === 'ru' ? 'Управление' : 'Actions'}
                            </h3>
                            <div className="space-y-2">
                                <Button variant="outline" fullWidth>
                                    {t.jobs.editJob}
                                </Button>
                                {job.status === 'PUBLISHED' && (
                                    <Button variant="outline" fullWidth>
                                        {t.jobs.pause}
                                    </Button>
                                )}
                                {job.status === 'PAUSED' && (
                                    <Button variant="outline" fullWidth>
                                        {t.jobs.publish}
                                    </Button>
                                )}
                                <Button variant="danger" fullWidth>
                                    {t.jobs.close}
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            <Modal
                isOpen={showApplyForm}
                onClose={() => setShowApplyForm(false)}
                title={t.applications.apply}
                size="lg"
            >
                <div className="p-5 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t.applications.yourPrice}
                            value={priceText}
                            onChange={e => setPriceText(e.target.value)}
                            placeholder="150 000 ₽"
                        />
                        <Input
                            label={t.applications.estimatedTime}
                            value={etaText}
                            onChange={e => setEtaText(e.target.value)}
                            placeholder="2 недели"
                        />
                    </div>

                    <Textarea
                        label={t.applications.coverLetter}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder={language === 'ru'
                            ? 'Расскажите, почему вы подходите для этого задания...'
                            : 'Tell why you are a good fit for this job...'
                        }
                        hint={language === 'ru' ? 'Минимум 50 символов' : 'Minimum 50 characters'}
                        error={message.length > 0 && message.length < 50
                            ? (language === 'ru' ? 'Слишком короткое сообщение' : 'Message too short')
                            : undefined
                        }
                    />

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <AlertCircle className="w-4 h-4" />
                        {remainingApps !== null
                            ? `${t.limits.applicationsLeft}: ${remainingApps}/3`
                            : `∞ ${t.common.unlimited}`
                        }
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Button
                            variant="outline"
                            onClick={() => setShowApplyForm(false)}
                            className="flex-1"
                        >
                            {t.common.cancel}
                        </Button>
                        <Button
                            onClick={handleSubmitApplication}
                            loading={isSubmitting}
                            disabled={!priceText || !etaText || message.length < 50}
                            className="flex-1"
                        >
                            {t.applications.submitApplication}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Paywall Modal */}
            <Modal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                title={t.limits.limitReached}
                size="md"
            >
                <div className="p-5 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-amber-600" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {language === 'ru' ? 'Лимит откликов исчерпан' : 'Application limit reached'}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {language === 'ru'
                            ? 'Вы использовали все 3 бесплатных отклика на этой неделе. Оформите подписку для безлимита!'
                            : "You've used all 3 free applications this week. Subscribe for unlimited access!"
                        }
                    </p>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <p className="text-sm text-slate-500">Pro</p>
                                <p className="text-xl font-bold text-slate-900">990 ₽/мес</p>
                            </div>
                            <div className="w-px h-12 bg-slate-200" />
                            <div className="text-center">
                                <p className="text-sm text-slate-500">Premium</p>
                                <p className="text-xl font-bold text-slate-900">1990 ₽/мес</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowPaywall(false)}
                            className="flex-1"
                        >
                            {t.common.close}
                        </Button>
                        <Button
                            onClick={() => {
                                setShowPaywall(false);
                                onNavigate('SUBSCRIPTION');
                            }}
                            className="flex-1"
                        >
                            {t.subscription.choosePlan}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
