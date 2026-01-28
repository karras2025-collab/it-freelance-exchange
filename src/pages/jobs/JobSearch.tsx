// ============================================
// Поиск заданий (для фрилансера)
// ============================================

import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Input, Select, EmptyState } from '../../components/ui';
import { Category } from '../../types';
import { CATEGORIES } from '../../constants';
import {
    Search,
    Filter,
    Briefcase,
    Clock,
    MapPin,
    ArrowRight,
    X,
    SlidersHorizontal
} from 'lucide-react';

interface JobSearchProps {
    onNavigate: (view: string, data?: any) => void;
}

export function JobSearch({ onNavigate }: JobSearchProps) {
    const { getPublishedJobs } = useData();
    const { t, language } = useI18n();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [budgetType, setBudgetType] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    const allJobs = getPublishedJobs();

    // Фильтрация заданий
    const filteredJobs = useMemo(() => {
        return allJobs.filter(job => {
            // Поиск по названию, описанию и навыкам
            const matchesSearch = !searchQuery ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

            // Фильтр по категории
            const matchesCategory = !selectedCategory || job.category === selectedCategory;

            // Фильтр по типу бюджета
            const matchesBudgetType = !budgetType || job.budgetType === budgetType;

            return matchesSearch && matchesCategory && matchesBudgetType;
        });
    }, [allJobs, searchQuery, selectedCategory, budgetType]);

    const categoryOptions = [
        { value: '', label: language === 'ru' ? 'Все категории' : 'All categories' },
        ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
    ];

    const budgetTypeOptions = [
        { value: '', label: language === 'ru' ? 'Любой бюджет' : 'Any budget' },
        { value: 'FIXED', label: t.jobs.fixed },
        { value: 'HOURLY', label: t.jobs.hourly },
        { value: 'DISCUSS', label: t.jobs.discuss }
    ];

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setBudgetType('');
    };

    const hasActiveFilters = searchQuery || selectedCategory || budgetType;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return language === 'ru' ? 'Сегодня' : 'Today';
        if (diffDays === 1) return language === 'ru' ? 'Вчера' : 'Yesterday';
        if (diffDays < 7) return language === 'ru' ? `${diffDays} дн. назад` : `${diffDays}d ago`;
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t.jobs.findJobs}</h1>
                    <p className="text-slate-500 mt-1">
                        {filteredJobs.length} {language === 'ru' ? 'заданий доступно' : 'jobs available'}
                    </p>
                </div>
            </div>

            {/* Search & Filters */}
            <Card padding="none" className="overflow-visible">
                <div className="p-4 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <Input
                                placeholder={language === 'ru' ? 'Поиск по навыкам, названию...' : 'Search by skills, title...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-5 h-5" />}
                                rightIcon={
                                    searchQuery ? (
                                        <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-100 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    ) : undefined
                                }
                            />
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden md:flex items-center gap-3">
                            <Select
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                className="w-48"
                            />
                            <Select
                                options={budgetTypeOptions}
                                value={budgetType}
                                onChange={setBudgetType}
                                className="w-40"
                            />
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    <X className="w-4 h-4 mr-1" />
                                    {language === 'ru' ? 'Сбросить' : 'Clear'}
                                </Button>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <Button
                            variant="outline"
                            className="md:hidden"
                            onClick={() => setShowFilters(!showFilters)}
                            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                        >
                            {t.common.filter}
                            {hasActiveFilters && (
                                <span className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {[selectedCategory, budgetType].filter(Boolean).length}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Mobile Filters Dropdown */}
                    {showFilters && (
                        <div className="md:hidden mt-4 pt-4 border-t border-slate-100 space-y-4">
                            <Select
                                label={t.jobs.category}
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                            />
                            <Select
                                label={t.jobs.budgetType}
                                options={budgetTypeOptions}
                                value={budgetType}
                                onChange={setBudgetType}
                            />
                            {hasActiveFilters && (
                                <Button variant="outline" fullWidth onClick={clearFilters}>
                                    {language === 'ru' ? 'Сбросить фильтры' : 'Clear filters'}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Jobs List */}
                {filteredJobs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredJobs.map(job => (
                            <article
                                key={job.id}
                                className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                                onClick={() => onNavigate('JOB_DETAILS', { jobId: job.id })}
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                    {/* Main Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {job.title}
                                                </h2>
                                                <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        {job.clientName}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDate(job.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Budget - Desktop */}
                                            <div className="hidden md:block text-right">
                                                <p className="text-lg font-bold text-slate-900">
                                                    {job.budgetType === 'DISCUSS'
                                                        ? (language === 'ru' ? 'Договорная' : 'Negotiable')
                                                        : job.budgetValue
                                                    }
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {job.budgetType === 'HOURLY' ? t.jobs.hourly : job.budgetType === 'FIXED' ? t.jobs.fixed : ''}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-600 mt-3 line-clamp-2">
                                            {job.description}
                                        </p>

                                        {/* Tags & Meta */}
                                        <div className="flex flex-wrap items-center gap-3 mt-4">
                                            <Badge color="blue" size="sm">{job.category}</Badge>
                                            {job.skills.slice(0, 4).map(skill => (
                                                <Badge key={skill} color="gray" size="sm">{skill}</Badge>
                                            ))}
                                            {job.skills.length > 4 && (
                                                <span className="text-sm text-slate-500">
                                                    +{job.skills.length - 4}
                                                </span>
                                            )}
                                        </div>

                                        {/* Budget - Mobile */}
                                        <div className="md:hidden flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                            <div>
                                                <p className="font-bold text-slate-900">
                                                    {job.budgetType === 'DISCUSS'
                                                        ? (language === 'ru' ? 'Договорная' : 'Negotiable')
                                                        : job.budgetValue
                                                    }
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {job.budgetType === 'HOURLY' ? t.jobs.hourly : job.budgetType === 'FIXED' ? t.jobs.fixed : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-500">
                                                {job.applicationCount} {t.jobs.applications}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow - Desktop */}
                                    <div className="hidden md:flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="py-16">
                        <EmptyState
                            icon={<Search className="w-8 h-8" />}
                            title={language === 'ru' ? 'Задания не найдены' : 'No jobs found'}
                            description={
                                hasActiveFilters
                                    ? (language === 'ru' ? 'Попробуйте изменить фильтры' : 'Try adjusting your filters')
                                    : (language === 'ru' ? 'Скоро здесь появятся новые задания' : 'New jobs will appear here soon')
                            }
                            action={
                                hasActiveFilters ? (
                                    <Button variant="outline" onClick={clearFilters}>
                                        {language === 'ru' ? 'Сбросить фильтры' : 'Clear filters'}
                                    </Button>
                                ) : undefined
                            }
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}
