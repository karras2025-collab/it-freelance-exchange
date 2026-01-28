// ============================================
// Создание задания - Полнофункциональный визард
// ============================================

import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Input, Textarea, Select } from '../../components/ui';
import { Category, Job } from '../../types';
import { CATEGORIES, SKILLS_BY_CATEGORY } from '../../constants';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Briefcase,
    Tag,
    FileText,
    DollarSign,
    Clock,
    Paperclip,
    Sparkles,
    AlertCircle,
    X,
    Plus,
    Zap,
    Eye
} from 'lucide-react';

interface CreateJobProps {
    onNavigate: (view: string, data?: any) => void;
}

// Шаги визарда
type Step = 'basics' | 'details' | 'budget' | 'preview';

const STEPS: Step[] = ['basics', 'details', 'budget', 'preview'];

export function CreateJob({ onNavigate }: CreateJobProps) {
    const { user } = useAuth();
    const { createJob } = useData();
    const { t, language } = useI18n();

    // Текущий шаг
    const [currentStep, setCurrentStep] = useState<Step>('basics');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Данные формы
    const [formData, setFormData] = useState({
        title: '',
        category: '' as Category | '',
        skills: [] as string[],
        description: '',
        budgetType: 'FIXED' as 'FIXED' | 'HOURLY' | 'DISCUSS',
        budgetMin: '',
        budgetMax: '',
        deadline: '',
        deadlineType: 'flexible' as 'strict' | 'flexible' | 'asap',
        attachments: [] as string[],
        visibility: 'public' as 'public' | 'private' | 'invite',
        experienceLevel: 'any' as 'any' | 'junior' | 'middle' | 'senior' | 'expert',
        projectType: 'one-time' as 'one-time' | 'ongoing' | 'full-time'
    });

    // Валидация
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Новый тег
    const [newSkill, setNewSkill] = useState('');

    // --- Handlers ---

    const updateField = <K extends keyof typeof formData>(
        field: K,
        value: typeof formData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const addSkill = (skill: string) => {
        if (skill && !formData.skills.includes(skill) && formData.skills.length < 10) {
            updateField('skills', [...formData.skills, skill]);
        }
        setNewSkill('');
    };

    const removeSkill = (skill: string) => {
        updateField('skills', formData.skills.filter(s => s !== skill));
    };

    const validateStep = (step: Step): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 'basics':
                if (!formData.title.trim()) {
                    newErrors.title = language === 'ru' ? 'Введите название' : 'Enter title';
                } else if (formData.title.length < 10) {
                    newErrors.title = language === 'ru' ? 'Минимум 10 символов' : 'At least 10 characters';
                }
                if (!formData.category) {
                    newErrors.category = language === 'ru' ? 'Выберите категорию' : 'Select category';
                }
                break;

            case 'details':
                if (!formData.description.trim()) {
                    newErrors.description = language === 'ru' ? 'Введите описание' : 'Enter description';
                } else if (formData.description.length < 100) {
                    newErrors.description = language === 'ru' ? 'Минимум 100 символов' : 'At least 100 characters';
                }
                if (formData.skills.length === 0) {
                    newErrors.skills = language === 'ru' ? 'Добавьте хотя бы 1 навык' : 'Add at least 1 skill';
                }
                break;

            case 'budget':
                if (formData.budgetType !== 'DISCUSS') {
                    if (!formData.budgetMin) {
                        newErrors.budgetMin = language === 'ru' ? 'Укажите бюджет' : 'Enter budget';
                    }
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const goToStep = (step: Step) => {
        const currentIndex = STEPS.indexOf(currentStep);
        const targetIndex = STEPS.indexOf(step);

        // Валидация при движении вперёд
        if (targetIndex > currentIndex) {
            for (let i = currentIndex; i < targetIndex; i++) {
                if (!validateStep(STEPS[i])) {
                    setCurrentStep(STEPS[i]);
                    return;
                }
            }
        }

        setCurrentStep(step);
    };

    const nextStep = () => {
        const currentIndex = STEPS.indexOf(currentStep);
        if (currentIndex < STEPS.length - 1 && validateStep(currentStep)) {
            setCurrentStep(STEPS[currentIndex + 1]);
        }
    };

    const prevStep = () => {
        const currentIndex = STEPS.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(STEPS[currentIndex - 1]);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;

        setIsSubmitting(true);

        // Формируем бюджет
        let budgetValue = '';
        if (formData.budgetType === 'DISCUSS') {
            budgetValue = '';
        } else if (formData.budgetType === 'FIXED') {
            budgetValue = formData.budgetMax
                ? `${formData.budgetMin} - ${formData.budgetMax} ₽`
                : `${formData.budgetMin} ₽`;
        } else {
            budgetValue = `${formData.budgetMin} ₽/час`;
        }

        // Формируем дедлайн
        let deadline = '';
        if (formData.deadlineType === 'asap') {
            deadline = language === 'ru' ? 'ASAP' : 'ASAP';
        } else if (formData.deadline) {
            deadline = formData.deadline;
        } else {
            deadline = language === 'ru' ? 'Гибкий срок' : 'Flexible';
        }

        const newJob = createJob({
            title: formData.title,
            category: formData.category as Category,
            skills: formData.skills,
            description: formData.description,
            budgetType: formData.budgetType,
            budgetValue,
            deadline,
            attachments: formData.attachments,
            status: 'PUBLISHED',
            clientId: user.id,
            clientName: user.displayName,
            clientAvatar: user.avatarUrl
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        onNavigate('JOB_DETAILS', { jobId: newJob.id });
    };

    // --- Suggested Skills ---
    const suggestedSkills = formData.category
        ? SKILLS_BY_CATEGORY[formData.category as Category]?.filter(s => !formData.skills.includes(s)) || []
        : [];

    // --- Progress ---
    const stepIndex = STEPS.indexOf(currentStep);
    const progress = ((stepIndex + 1) / STEPS.length) * 100;

    // --- Render Steps ---

    const renderStepIndicator = () => (
        <div className="mb-8">
            {/* Progress Bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Steps */}
            <div className="flex justify-between">
                {[
                    { id: 'basics', icon: Briefcase, label: language === 'ru' ? 'Основное' : 'Basics' },
                    { id: 'details', icon: FileText, label: language === 'ru' ? 'Детали' : 'Details' },
                    { id: 'budget', icon: DollarSign, label: language === 'ru' ? 'Бюджет' : 'Budget' },
                    { id: 'preview', icon: Eye, label: language === 'ru' ? 'Превью' : 'Preview' }
                ].map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = stepIndex > index;

                    return (
                        <button
                            key={step.id}
                            onClick={() => goToStep(step.id as Step)}
                            className={`flex flex-col items-center gap-2 transition-colors ${isActive
                                    ? 'text-blue-600'
                                    : isCompleted
                                        ? 'text-emerald-600 cursor-pointer'
                                        : 'text-slate-400'
                                }`}
                        >
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${isActive
                                    ? 'bg-blue-100 ring-4 ring-blue-500/20'
                                    : isCompleted
                                        ? 'bg-emerald-100'
                                        : 'bg-slate-100'
                                }
              `}>
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className="text-xs font-medium hidden sm:block">{step.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderBasicsStep = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {language === 'ru' ? 'Основная информация' : 'Basic Information'}
                </h2>
                <p className="text-slate-500">
                    {language === 'ru'
                        ? 'Начните с названия и категории вашего проекта'
                        : 'Start with the title and category of your project'
                    }
                </p>
            </div>

            {/* Title */}
            <div>
                <Input
                    label={language === 'ru' ? 'Название задания *' : 'Job Title *'}
                    placeholder={language === 'ru'
                        ? 'Например: Разработка интернет-магазина на React'
                        : 'e.g., Build an e-commerce website with React'
                    }
                    value={formData.title}
                    onChange={e => updateField('title', e.target.value)}
                    error={errors.title}
                />
                <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-slate-500">
                        {language === 'ru' ? 'Чётко опишите суть задания' : 'Clearly describe the job'}
                    </span>
                    <span className={`text-xs ${formData.title.length < 10 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {formData.title.length}/80
                    </span>
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Категория *' : 'Category *'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => updateField('category', cat)}
                            className={`
                px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all
                ${formData.category === cat
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                                    : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                }
              `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                {errors.category && (
                    <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                )}
            </div>

            {/* Project Type */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Тип проекта' : 'Project Type'}
                </label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'one-time', label: language === 'ru' ? 'Разовый проект' : 'One-time project' },
                        { id: 'ongoing', label: language === 'ru' ? 'Длительное сотрудничество' : 'Ongoing work' },
                        { id: 'full-time', label: language === 'ru' ? 'Полная занятость' : 'Full-time' }
                    ].map(type => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => updateField('projectType', type.id as any)}
                            className={`
                px-4 py-2 rounded-full border text-sm font-medium transition-all
                ${formData.projectType === type.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }
              `}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Experience Level */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Требуемый уровень' : 'Required Experience'}
                </label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'any', label: language === 'ru' ? 'Любой' : 'Any' },
                        { id: 'junior', label: 'Junior' },
                        { id: 'middle', label: 'Middle' },
                        { id: 'senior', label: 'Senior' },
                        { id: 'expert', label: 'Expert' }
                    ].map(level => (
                        <button
                            key={level.id}
                            type="button"
                            onClick={() => updateField('experienceLevel', level.id as any)}
                            className={`
                px-4 py-2 rounded-full border text-sm font-medium transition-all
                ${formData.experienceLevel === level.id
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }
              `}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {language === 'ru' ? 'Детали проекта' : 'Project Details'}
                </h2>
                <p className="text-slate-500">
                    {language === 'ru'
                        ? 'Подробно опишите задачу и укажите необходимые навыки'
                        : 'Describe the task in detail and specify required skills'
                    }
                </p>
            </div>

            {/* Description */}
            <div>
                <Textarea
                    label={language === 'ru' ? 'Описание задания *' : 'Job Description *'}
                    placeholder={language === 'ru'
                        ? `Опишите:
• Что нужно сделать
• Какие требования к результату
• Есть ли готовые материалы/ТЗ
• Ваши ожидания от исполнителя`
                        : `Describe:
• What needs to be done
• Requirements for the result
• Do you have materials/specifications
• Your expectations`
                    }
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    error={errors.description}
                    className="min-h-[200px]"
                />
                <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-slate-500">
                        {language === 'ru' ? 'Чем подробнее — тем лучше отклики' : 'The more detailed — the better applications'}
                    </span>
                    <span className={`text-xs ${formData.description.length < 100 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {formData.description.length}/2000
                    </span>
                </div>
            </div>

            {/* Skills */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Необходимые навыки *' : 'Required Skills *'}
                </label>

                {/* Selected skills */}
                {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.map(skill => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                            >
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Add skill input */}
                <div className="flex gap-2 mb-3">
                    <Input
                        placeholder={language === 'ru' ? 'Добавить навык...' : 'Add skill...'}
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill(newSkill.trim());
                            }
                        }}
                    />
                    <Button
                        variant="outline"
                        onClick={() => addSkill(newSkill.trim())}
                        disabled={!newSkill.trim() || formData.skills.length >= 10}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Suggested skills */}
                {suggestedSkills.length > 0 && (
                    <div>
                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            {language === 'ru' ? 'Рекомендуемые:' : 'Suggested:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedSkills.slice(0, 8).map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => addSkill(skill)}
                                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 transition-colors"
                                >
                                    + {skill}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {errors.skills && (
                    <p className="mt-2 text-sm text-red-600">{errors.skills}</p>
                )}
            </div>

            {/* Attachments placeholder */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Вложения' : 'Attachments'}
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-300 transition-colors cursor-pointer">
                    <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 text-sm">
                        {language === 'ru'
                            ? 'Перетащите файлы или нажмите для загрузки'
                            : 'Drag files or click to upload'
                        }
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        PDF, DOC, ZIP, Images (до 10MB)
                    </p>
                </div>
            </div>
        </div>
    );

    const renderBudgetStep = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {language === 'ru' ? 'Бюджет и сроки' : 'Budget & Timeline'}
                </h2>
                <p className="text-slate-500">
                    {language === 'ru'
                        ? 'Укажите бюджет и желаемые сроки выполнения'
                        : 'Specify the budget and desired timeline'
                    }
                </p>
            </div>

            {/* Budget Type */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Тип оплаты' : 'Payment Type'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'FIXED', icon: '💰', label: language === 'ru' ? 'Фикс' : 'Fixed', desc: language === 'ru' ? 'За весь проект' : 'For the project' },
                        { id: 'HOURLY', icon: '⏰', label: language === 'ru' ? 'Почасовая' : 'Hourly', desc: language === 'ru' ? 'За час работы' : 'Per hour' },
                        { id: 'DISCUSS', icon: '💬', label: language === 'ru' ? 'Договорная' : 'Negotiable', desc: language === 'ru' ? 'Обсудим' : "Let's discuss" }
                    ].map(type => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => updateField('budgetType', type.id as any)}
                            className={`
                p-4 rounded-xl border text-center transition-all
                ${formData.budgetType === type.id
                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }
              `}
                        >
                            <span className="text-2xl block mb-2">{type.icon}</span>
                            <span className="font-semibold text-slate-900 block">{type.label}</span>
                            <span className="text-xs text-slate-500">{type.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget Amount */}
            {formData.budgetType !== 'DISCUSS' && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {formData.budgetType === 'FIXED'
                            ? (language === 'ru' ? 'Бюджет (₽)' : 'Budget (₽)')
                            : (language === 'ru' ? 'Ставка (₽/час)' : 'Rate (₽/hour)')
                        }
                    </label>
                    <div className="flex gap-3 items-center">
                        <Input
                            type="number"
                            placeholder={formData.budgetType === 'FIXED' ? '50000' : '1500'}
                            value={formData.budgetMin}
                            onChange={e => updateField('budgetMin', e.target.value)}
                            error={errors.budgetMin}
                            className="flex-1"
                        />
                        {formData.budgetType === 'FIXED' && (
                            <>
                                <span className="text-slate-400">—</span>
                                <Input
                                    type="number"
                                    placeholder={language === 'ru' ? 'Макс (опц.)' : 'Max (opt.)'}
                                    value={formData.budgetMax}
                                    onChange={e => updateField('budgetMax', e.target.value)}
                                    className="flex-1"
                                />
                            </>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        {language === 'ru'
                            ? '💡 Средняя ставка для ' + (formData.category || 'категории') + ': 1500-3000 ₽/час'
                            : '💡 Average rate for ' + (formData.category || 'category') + ': 1500-3000 ₽/hour'
                        }
                    </p>
                </div>
            )}

            {/* Deadline */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Сроки' : 'Timeline'}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {[
                        { id: 'asap', label: 'ASAP' },
                        { id: 'flexible', label: language === 'ru' ? 'Гибкий' : 'Flexible' },
                        { id: 'strict', label: language === 'ru' ? 'Жёсткий' : 'Strict' }
                    ].map(type => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => updateField('deadlineType', type.id as any)}
                            className={`
                px-4 py-2 rounded-full border text-sm font-medium transition-all
                ${formData.deadlineType === type.id
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }
              `}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {formData.deadlineType !== 'asap' && (
                    <Input
                        type="text"
                        placeholder={language === 'ru' ? 'Например: 2 недели, до 1 февраля' : 'e.g., 2 weeks, by Feb 1'}
                        value={formData.deadline}
                        onChange={e => updateField('deadline', e.target.value)}
                    />
                )}
            </div>

            {/* Visibility */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === 'ru' ? 'Видимость' : 'Visibility'}
                </label>
                <div className="space-y-2">
                    {[
                        { id: 'public', icon: '🌍', label: language === 'ru' ? 'Публичное' : 'Public', desc: language === 'ru' ? 'Видно всем фрилансерам' : 'Visible to all freelancers' },
                        { id: 'invite', icon: '✉️', label: language === 'ru' ? 'По приглашению' : 'Invite only', desc: language === 'ru' ? 'Только приглашённые' : 'Only invited freelancers' }
                    ].map(vis => (
                        <button
                            key={vis.id}
                            type="button"
                            onClick={() => updateField('visibility', vis.id as any)}
                            className={`
                w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all
                ${formData.visibility === vis.id
                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                                    : 'border-slate-200 hover:border-slate-300'
                                }
              `}
                        >
                            <span className="text-2xl">{vis.icon}</span>
                            <div>
                                <span className="font-semibold text-slate-900 block">{vis.label}</span>
                                <span className="text-sm text-slate-500">{vis.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPreviewStep = () => {
        const budgetDisplay = formData.budgetType === 'DISCUSS'
            ? (language === 'ru' ? 'Договорная' : 'Negotiable')
            : formData.budgetType === 'FIXED'
                ? formData.budgetMax
                    ? `${formData.budgetMin} - ${formData.budgetMax} ₽`
                    : `${formData.budgetMin} ₽`
                : `${formData.budgetMin} ₽/час`;

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        {language === 'ru' ? 'Предпросмотр' : 'Preview'}
                    </h2>
                    <p className="text-slate-500">
                        {language === 'ru'
                            ? 'Проверьте задание перед публикацией'
                            : 'Review your job before publishing'
                        }
                    </p>
                </div>

                {/* Preview Card */}
                <Card className="border-2 border-blue-200 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge color="green">
                            {language === 'ru' ? 'Превью' : 'Preview'}
                        </Badge>
                        <Badge color="blue">{formData.category}</Badge>
                        {formData.projectType === 'ongoing' && (
                            <Badge color="purple">
                                {language === 'ru' ? 'Длительный' : 'Ongoing'}
                            </Badge>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {formData.title || (language === 'ru' ? 'Без названия' : 'Untitled')}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <span>{user?.displayName}</span>
                        <span>•</span>
                        <span>{language === 'ru' ? 'Только что' : 'Just now'}</span>
                    </div>

                    <p className="text-slate-600 mb-4 whitespace-pre-line">
                        {formData.description || (language === 'ru' ? 'Нет описания' : 'No description')}
                    </p>

                    {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.skills.map(skill => (
                                <Badge key={skill} color="gray">{skill}</Badge>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">{t.jobs.budget}</p>
                            <p className="font-bold text-slate-900">{budgetDisplay}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">{t.jobs.deadline}</p>
                            <p className="font-medium text-slate-900">
                                {formData.deadlineType === 'asap'
                                    ? 'ASAP'
                                    : formData.deadline || (language === 'ru' ? 'Гибкий' : 'Flexible')
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">{language === 'ru' ? 'Уровень' : 'Level'}</p>
                            <p className="font-medium text-slate-900 capitalize">{formData.experienceLevel}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">{language === 'ru' ? 'Видимость' : 'Visibility'}</p>
                            <p className="font-medium text-slate-900 capitalize">
                                {formData.visibility === 'public'
                                    ? '🌍 ' + (language === 'ru' ? 'Публичное' : 'Public')
                                    : '✉️ ' + (language === 'ru' ? 'Приглашение' : 'Invite')
                                }
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Submit Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-amber-800">
                            {language === 'ru' ? 'После публикации' : 'After publishing'}
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                            {language === 'ru'
                                ? 'Задание появится в каталоге и фрилансеры смогут откликаться. Вы сможете отредактировать или закрыть его в любой момент.'
                                : 'The job will appear in the catalog and freelancers will be able to apply. You can edit or close it at any time.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => onNavigate('DASHBOARD')}
                    className="p-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t.jobs.createJob}</h1>
                    <p className="text-slate-500">
                        {language === 'ru' ? 'Шаг' : 'Step'} {stepIndex + 1} {language === 'ru' ? 'из' : 'of'} {STEPS.length}
                    </p>
                </div>
            </div>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Step Content */}
            <Card className="mb-6">
                {currentStep === 'basics' && renderBasicsStep()}
                {currentStep === 'details' && renderDetailsStep()}
                {currentStep === 'budget' && renderBudgetStep()}
                {currentStep === 'preview' && renderPreviewStep()}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={stepIndex === 0}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                    {t.common.back}
                </Button>

                {currentStep === 'preview' ? (
                    <Button
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        leftIcon={<Zap className="w-4 h-4" />}
                        size="lg"
                    >
                        {language === 'ru' ? 'Опубликовать задание' : 'Publish Job'}
                    </Button>
                ) : (
                    <Button
                        onClick={nextStep}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        {t.common.next}
                    </Button>
                )}
            </div>
        </div>
    );
}
