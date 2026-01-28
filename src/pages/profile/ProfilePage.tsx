// ============================================
// Профиль пользователя (фрилансер/заказчик)
// ============================================

import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Input, Textarea, Select, Avatar, Modal } from '../../components/ui';
import { CATEGORIES, SKILLS_BY_CATEGORY, SUBSCRIPTION_PLANS } from '../../constants';
import { Category, UserProfile } from '../../types';
import {
    Camera,
    Edit3,
    Save,
    X,
    Plus,
    Star,
    MapPin,
    Calendar,
    Link as LinkIcon,
    ExternalLink,
    Mail,
    Globe,
    Briefcase,
    Award,
    TrendingUp,
    Shield,
    Settings,
    Bell,
    CreditCard,
    LogOut,
    Zap,
    CheckCircle,
    AlertCircle,
    User,
    Building
} from 'lucide-react';

interface ProfilePageProps {
    onNavigate: (view: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
    const { user, subscription, updateProfile, logout } = useAuth();
    const { getApplicationsByFreelancer, getJobsByClient, getDealsByUser } = useData();
    const { t, language, toggleLanguage } = useI18n();

    const [isEditing, setIsEditing] = useState(false);
    const [activeSection, setActiveSection] = useState<'profile' | 'settings' | 'notifications'>('profile');
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        displayName: user?.displayName || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        categories: (user as any)?.categories || [],
        skills: user?.skills || [],
        level: (user as any)?.level || 'MIDDLE',
        hourlyRate: (user as any)?.hourlyRate || '',
        portfolioLinks: user?.portfolioLinks || [],
        companyName: (user as any)?.companyName || '',
        companyDescription: (user as any)?.companyDescription || ''
    });

    const [newSkill, setNewSkill] = useState('');
    const [newPortfolioLink, setNewPortfolioLink] = useState('');

    if (!user) return null;

    const isFreelancer = user.role === 'FREELANCER';
    const isClient = user.role === 'CLIENT';
    const currentPlan = subscription
        ? SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId)
        : SUBSCRIPTION_PLANS[0];

    // Stats
    const applications = isFreelancer ? getApplicationsByFreelancer(user.id) : [];
    const jobs = isClient ? getJobsByClient(user.id) : [];
    const deals = getDealsByUser(user.id);

    const stats = isFreelancer ? {
        totalApplications: applications.length,
        acceptedApplications: applications.filter(a => a.status === 'ACCEPTED').length,
        completedDeals: deals.filter(d => d.status === 'COMPLETED').length,
        rating: user.rating || 0,
        reviewCount: user.reviewCount || 0
    } : {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'PUBLISHED').length,
        completedDeals: deals.filter(d => d.status === 'COMPLETED').length,
        totalSpent: '450 000 ₽' // mock
    };

    // Handlers
    const handleSave = () => {
        updateProfile({
            displayName: editForm.displayName,
            bio: editForm.bio,
            location: editForm.location,
            website: editForm.website,
            skills: editForm.skills,
            portfolioLinks: editForm.portfolioLinks,
            ...(isFreelancer && {
                categories: editForm.categories,
                level: editForm.level,
                hourlyRate: editForm.hourlyRate
            }),
            ...(isClient && {
                companyName: editForm.companyName,
                companyDescription: editForm.companyDescription
            })
        } as Partial<UserProfile>);
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setEditForm({
            displayName: user?.displayName || '',
            bio: user?.bio || '',
            location: user?.location || '',
            website: user?.website || '',
            categories: (user as any)?.categories || [],
            skills: user?.skills || [],
            level: (user as any)?.level || 'MIDDLE',
            hourlyRate: (user as any)?.hourlyRate || '',
            portfolioLinks: user?.portfolioLinks || [],
            companyName: (user as any)?.companyName || '',
            companyDescription: (user as any)?.companyDescription || ''
        });
        setIsEditing(false);
    };

    const addSkill = () => {
        if (newSkill.trim() && !editForm.skills.includes(newSkill.trim()) && editForm.skills.length < 15) {
            setEditForm({ ...editForm, skills: [...editForm.skills, newSkill.trim()] });
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skill) });
    };

    const addPortfolioLink = () => {
        if (newPortfolioLink.trim() && editForm.portfolioLinks.length < 5) {
            setEditForm({ ...editForm, portfolioLinks: [...editForm.portfolioLinks, newPortfolioLink.trim()] });
            setNewPortfolioLink('');
        }
    };

    const removePortfolioLink = (link: string) => {
        setEditForm({ ...editForm, portfolioLinks: editForm.portfolioLinks.filter(l => l !== link) });
    };

    const suggestedSkills = editForm.categories.length > 0
        ? editForm.categories.flatMap(cat => SKILLS_BY_CATEGORY[cat as Category] || [])
            .filter(s => !editForm.skills.includes(s))
            .slice(0, 10)
        : [];

    const memberSince = new Date(user.createdAt).toLocaleDateString(
        language === 'ru' ? 'ru-RU' : 'en-US',
        { month: 'long', year: 'numeric' }
    );

    // --- Render Sections ---

    const renderProfileSection = () => (
        <div className="space-y-6">
            {/* Header Card */}
            <Card padding="none" className="overflow-hidden">
                {/* Cover */}
                <div className="h-32 md:h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

                {/* Profile Info */}
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 md:-mt-12">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-xl">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.displayName}
                                        className="w-full h-full rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                                        {user.displayName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => setShowAvatarModal(true)}
                                    className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Name & Info */}
                        <div className="flex-1 pt-4 md:pt-0 md:pb-2">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    {isEditing ? (
                                        <Input
                                            value={editForm.displayName}
                                            onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                                            className="text-xl font-bold"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-bold text-slate-900">{user.displayName}</h1>
                                            {currentPlan?.id !== 'FREE' && (
                                                <Badge color={currentPlan?.id === 'PREMIUM' ? 'yellow' : 'blue'}>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {currentPlan?.name}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                                        {isFreelancer ? (
                                            <>
                                                <User className="w-4 h-4" />
                                                {t.roles.freelancer}
                                            </>
                                        ) : (
                                            <>
                                                <Building className="w-4 h-4" />
                                                {t.roles.client}
                                            </>
                                        )}
                                        {user.location && (
                                            <>
                                                <span>•</span>
                                                <MapPin className="w-4 h-4" />
                                                {user.location}
                                            </>
                                        )}
                                    </p>
                                </div>

                                {!isEditing && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                        leftIcon={<Edit3 className="w-4 h-4" />}
                                    >
                                        {t.profile.editProfile}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
                        {isFreelancer ? (
                            <>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-amber-500">
                                        <Star className="w-5 h-5 fill-current" />
                                        <span className="text-2xl font-bold text-slate-900">
                                            {stats.rating?.toFixed(1) || '—'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-500">{stats.reviewCount} {t.profile.reviews}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-900">{stats.totalApplications}</div>
                                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Откликов' : 'Applications'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">{stats.acceptedApplications}</div>
                                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Принято' : 'Accepted'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.completedDeals}</div>
                                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Проектов' : 'Projects'}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-900">{stats.totalJobs}</div>
                                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Заданий' : 'Jobs'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-600">{stats.activeJobs}</div>
                                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Активных' : 'Active'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.completedDeals}</div>
                                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Выполнено' : 'Completed'}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{stats.totalSpent}</div>
                                    <div className="text-sm text-slate-500">{language === 'ru' ? 'Потрачено' : 'Spent'}</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            {/* Bio & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About */}
                    <Card>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">{t.profile.bio}</h2>
                        {isEditing ? (
                            <Textarea
                                value={editForm.bio}
                                onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                placeholder={language === 'ru' ? 'Расскажите о себе...' : 'Tell about yourself...'}
                                className="min-h-[120px]"
                            />
                        ) : (
                            <p className="text-slate-600 whitespace-pre-line">
                                {user.bio || (language === 'ru' ? 'Нет описания' : 'No bio yet')}
                            </p>
                        )}
                    </Card>

                    {/* Skills (Freelancer) */}
                    {isFreelancer && (
                        <Card>
                            <h2 className="text-lg font-bold text-slate-900 mb-4">{t.profile.skills}</h2>

                            {isEditing ? (
                                <div className="space-y-4">
                                    {/* Selected skills */}
                                    {editForm.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {editForm.skills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                    <button onClick={() => removeSkill(skill)} className="p-0.5 hover:bg-blue-100 rounded-full">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add skill */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder={language === 'ru' ? 'Добавить навык...' : 'Add skill...'}
                                            value={newSkill}
                                            onChange={e => setNewSkill(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <Button variant="outline" onClick={addSkill}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* Suggested */}
                                    {suggestedSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedSkills.map(skill => (
                                                <button
                                                    key={skill}
                                                    onClick={() => setEditForm({ ...editForm, skills: [...editForm.skills, skill] })}
                                                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200"
                                                >
                                                    + {skill}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map(skill => (
                                            <Badge key={skill} color="blue">{skill}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-slate-500">{language === 'ru' ? 'Навыки не указаны' : 'No skills added'}</p>
                                    )}
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Portfolio (Freelancer) */}
                    {isFreelancer && (
                        <Card>
                            <h2 className="text-lg font-bold text-slate-900 mb-4">{t.profile.portfolio}</h2>

                            {isEditing ? (
                                <div className="space-y-4">
                                    {editForm.portfolioLinks.map((link, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                                            <LinkIcon className="w-4 h-4 text-slate-400" />
                                            <span className="flex-1 text-slate-700 truncate">{link}</span>
                                            <button
                                                onClick={() => removePortfolioLink(link)}
                                                className="p-1 text-slate-400 hover:text-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://..."
                                            value={newPortfolioLink}
                                            onChange={e => setNewPortfolioLink(e.target.value)}
                                        />
                                        <Button variant="outline" onClick={addPortfolioLink}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {user.portfolioLinks && user.portfolioLinks.length > 0 ? (
                                        user.portfolioLinks.map((link, i) => (
                                            <a
                                                key={i}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4 text-blue-500" />
                                                <span className="text-blue-600 truncate">{link}</span>
                                            </a>
                                        ))
                                    ) : (
                                        <p className="text-slate-500">{language === 'ru' ? 'Портфолио не указано' : 'No portfolio links'}</p>
                                    )}
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Company Info (Client) */}
                    {isClient && (
                        <Card>
                            <h2 className="text-lg font-bold text-slate-900 mb-4">
                                {language === 'ru' ? 'О компании' : 'About Company'}
                            </h2>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <Input
                                        label={language === 'ru' ? 'Название компании' : 'Company Name'}
                                        value={editForm.companyName}
                                        onChange={e => setEditForm({ ...editForm, companyName: e.target.value })}
                                        placeholder={language === 'ru' ? 'ООО «Компания»' : 'Company LLC'}
                                    />
                                    <Textarea
                                        label={language === 'ru' ? 'Описание' : 'Description'}
                                        value={editForm.companyDescription}
                                        onChange={e => setEditForm({ ...editForm, companyDescription: e.target.value })}
                                        placeholder={language === 'ru' ? 'Чем занимается ваша компания...' : 'What does your company do...'}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {(user as any).companyName && (
                                        <div>
                                            <span className="text-sm text-slate-500">{language === 'ru' ? 'Компания:' : 'Company:'}</span>
                                            <p className="font-semibold text-slate-900">{(user as any).companyName}</p>
                                        </div>
                                    )}
                                    <p className="text-slate-600">
                                        {(user as any).companyDescription || (language === 'ru' ? 'Описание не указано' : 'No description')}
                                    </p>
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card>
                        <h3 className="font-semibold text-slate-900 mb-4">{language === 'ru' ? 'Контакты' : 'Contact Info'}</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="truncate">{user.email}</span>
                            </div>

                            {isEditing ? (
                                <>
                                    <Input
                                        placeholder={language === 'ru' ? 'Город' : 'City'}
                                        leftIcon={<MapPin className="w-4 h-4" />}
                                        value={editForm.location}
                                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                    />
                                    <Input
                                        placeholder="https://yoursite.com"
                                        leftIcon={<Globe className="w-4 h-4" />}
                                        value={editForm.website}
                                        onChange={e => setEditForm({ ...editForm, website: e.target.value })}
                                    />
                                </>
                            ) : (
                                <>
                                    {user.location && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{user.location}</span>
                                        </div>
                                    )}
                                    {user.website && (
                                        <a
                                            href={user.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                                        >
                                            <Globe className="w-4 h-4" />
                                            <span className="truncate">{user.website}</span>
                                        </a>
                                    )}
                                </>
                            )}

                            <div className="flex items-center gap-3 text-slate-500 pt-2 border-t border-slate-100">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                    {language === 'ru' ? 'На платформе с' : 'Member since'} {memberSince}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Subscription */}
                    {isFreelancer && (
                        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{currentPlan?.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {currentPlan?.id === 'FREE'
                                            ? (language === 'ru' ? 'Бесплатный план' : 'Free plan')
                                            : (language === 'ru' ? 'Активная подписка' : 'Active subscription')
                                        }
                                    </p>
                                </div>
                            </div>
                            {currentPlan?.id === 'FREE' && (
                                <Button
                                    fullWidth
                                    onClick={() => onNavigate('SUBSCRIPTION')}
                                    leftIcon={<Zap className="w-4 h-4" />}
                                >
                                    {t.subscription.upgrade}
                                </Button>
                            )}
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card>
                        <h3 className="font-semibold text-slate-900 mb-4">{language === 'ru' ? 'Быстрые действия' : 'Quick Actions'}</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveSection('settings')}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            >
                                <Settings className="w-5 h-5 text-slate-500" />
                                <span>{language === 'ru' ? 'Настройки' : 'Settings'}</span>
                            </button>
                            <button
                                onClick={() => onNavigate('SUBSCRIPTION')}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            >
                                <CreditCard className="w-5 h-5 text-slate-500" />
                                <span>{language === 'ru' ? 'Подписка' : 'Subscription'}</span>
                            </button>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left text-red-600"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>{t.common.logout}</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
                <div className="flex gap-3 justify-end sticky bottom-4 bg-white p-4 rounded-2xl shadow-lg border border-slate-200">
                    <Button variant="outline" onClick={cancelEdit} leftIcon={<X className="w-4 h-4" />}>
                        {t.common.cancel}
                    </Button>
                    <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                        {t.common.save}
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {activeSection === 'profile' && renderProfileSection()}
        </div>
    );
}
