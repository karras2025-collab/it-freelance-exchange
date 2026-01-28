// ============================================
// Layout Components - Sidebar, Header
// ============================================

import React, { useState, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n, LanguageSwitcher } from '../../i18n';
import { Avatar, Badge, Button } from '../ui';
import { SUBSCRIPTION_PLANS } from '../../constants';
import {
    LayoutDashboard,
    Search,
    Briefcase,
    PlusCircle,
    Send,
    MessageSquare,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Users,
    Flag,
    BarChart3,
    ChevronRight
} from 'lucide-react';

// ==================== SIDEBAR ====================

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    badge?: number;
    locked?: boolean;
    onClick: () => void;
}

function NavItem({ icon: Icon, label, active, badge, locked, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`
        flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl mb-1
        transition-all duration-200 group
        ${active
                    ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
      `}
        >
            <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span className="flex-1 text-left">{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                    {badge}
                </span>
            )}
            {locked && (
                <span className="ml-2 text-xs text-amber-600">PRO</span>
            )}
        </button>
    );
}

interface SidebarProps {
    currentView: string;
    onNavigate: (view: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ currentView, onNavigate, isOpen, onClose }: SidebarProps) {
    const { user, subscription, logout, switchRole, getRemainingApplications } = useAuth();
    const { t, language } = useI18n();

    if (!user) return null;

    const isClient = user.role === 'CLIENT';
    const isFreelancer = user.role === 'FREELANCER';
    const isAdmin = user.role === 'ADMIN';

    const currentPlan = subscription
        ? SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId)
        : SUBSCRIPTION_PLANS[0];

    const remainingApps = getRemainingApplications();

    const handleNavigate = (view: string) => {
        onNavigate(view);
        onClose();
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-blue-500/25">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <div>
                                <span className="text-lg font-bold text-slate-900">FreelanceHub</span>
                                <span className="block text-xs text-slate-500">IT Биржа</span>
                            </div>
                        </div>
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 overflow-y-auto">
                        {/* Client Navigation */}
                        {isClient && (
                            <>
                                <NavItem
                                    icon={LayoutDashboard}
                                    label={t.nav.home}
                                    active={currentView === 'DASHBOARD'}
                                    onClick={() => handleNavigate('DASHBOARD')}
                                />
                                <NavItem
                                    icon={PlusCircle}
                                    label={t.jobs.createJob}
                                    active={currentView === 'CREATE_JOB'}
                                    onClick={() => handleNavigate('CREATE_JOB')}
                                />
                                <NavItem
                                    icon={Briefcase}
                                    label={t.nav.myJobs}
                                    active={currentView === 'MY_JOBS'}
                                    onClick={() => handleNavigate('MY_JOBS')}
                                />
                                <NavItem
                                    icon={MessageSquare}
                                    label={t.nav.chat}
                                    active={currentView === 'CHAT'}
                                    onClick={() => handleNavigate('CHAT')}
                                />
                                <NavItem
                                    icon={Briefcase}
                                    label={language === 'ru' ? 'Мои сделки' : 'My Deals'}
                                    active={currentView === 'DEALS'}
                                    onClick={() => handleNavigate('DEALS')}
                                />
                            </>
                        )}

                        {/* Freelancer Navigation */}
                        {isFreelancer && (
                            <>
                                <NavItem
                                    icon={LayoutDashboard}
                                    label={t.nav.home}
                                    active={currentView === 'DASHBOARD'}
                                    onClick={() => handleNavigate('DASHBOARD')}
                                />
                                <NavItem
                                    icon={Search}
                                    label={t.jobs.findJobs}
                                    active={currentView === 'SEARCH'}
                                    onClick={() => handleNavigate('SEARCH')}
                                />
                                <NavItem
                                    icon={Send}
                                    label={t.nav.myApplications}
                                    active={currentView === 'APPLICATIONS'}
                                    onClick={() => handleNavigate('APPLICATIONS')}
                                />
                                <NavItem
                                    icon={MessageSquare}
                                    label={t.nav.chat}
                                    active={currentView === 'CHAT'}
                                    locked={!currentPlan?.chatEnabled}
                                    onClick={() => handleNavigate('CHAT')}
                                />
                                <NavItem
                                    icon={Briefcase}
                                    label={language === 'ru' ? 'Мои сделки' : 'My Deals'}
                                    active={currentView === 'DEALS'}
                                    onClick={() => handleNavigate('DEALS')}
                                />
                                <NavItem
                                    icon={CreditCard}
                                    label={t.nav.subscription}
                                    active={currentView === 'SUBSCRIPTION'}
                                    onClick={() => handleNavigate('SUBSCRIPTION')}
                                />
                            </>
                        )}

                        {/* Admin Navigation */}
                        {isAdmin && (
                            <>
                                <NavItem
                                    icon={LayoutDashboard}
                                    label="Dashboard"
                                    active={currentView === 'ADMIN_DASHBOARD'}
                                    onClick={() => handleNavigate('ADMIN_DASHBOARD')}
                                />
                                <NavItem
                                    icon={Users}
                                    label="Users"
                                    active={currentView === 'ADMIN_USERS'}
                                    onClick={() => handleNavigate('ADMIN_USERS')}
                                />
                                <NavItem
                                    icon={Briefcase}
                                    label="Jobs"
                                    active={currentView === 'ADMIN_JOBS'}
                                    onClick={() => handleNavigate('ADMIN_JOBS')}
                                />
                                <NavItem
                                    icon={Flag}
                                    label="Reports"
                                    active={currentView === 'ADMIN_REPORTS'}
                                    onClick={() => handleNavigate('ADMIN_REPORTS')}
                                />
                                <NavItem
                                    icon={BarChart3}
                                    label="Analytics"
                                    active={currentView === 'ADMIN_ANALYTICS'}
                                    onClick={() => handleNavigate('ADMIN_ANALYTICS')}
                                />
                            </>
                        )}

                        <div className="my-4 border-t border-slate-100" />

                        <NavItem
                            icon={Settings}
                            label={t.nav.profile}
                            active={currentView === 'PROFILE'}
                            onClick={() => handleNavigate('PROFILE')}
                        />
                    </nav>

                    {/* Weekly Limit (Freelancer only) */}
                    {isFreelancer && currentPlan && (
                        <div className="px-4 pb-2">
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-slate-600">{t.limits.applicationsLeft}</span>
                                    <Badge color={currentPlan.applicationsPerWeek === null ? 'green' : 'blue'} size="sm">
                                        {currentPlan.name}
                                    </Badge>
                                </div>
                                {remainingApps !== null ? (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all"
                                                style={{ width: `${(remainingApps / 3) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{remainingApps}/3</span>
                                    </div>
                                ) : (
                                    <div className="text-sm font-semibold text-emerald-600">
                                        ∞ {t.common.unlimited}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* User Card */}
                    <div className="p-4 border-t border-slate-200">
                        <div
                            className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer mb-3"
                            onClick={() => handleNavigate('PROFILE')}
                        >
                            <Avatar src={user.avatarUrl} name={user.displayName} size="md" />
                            <div className="flex-1 min-w-0 ml-3">
                                <p className="text-sm font-semibold text-slate-900 truncate">{user.displayName}</p>
                                <p className="text-xs text-slate-500 truncate">
                                    {isClient ? t.roles.client : isFreelancer ? t.roles.freelancer : t.roles.admin}
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={switchRole}
                            >
                                {isClient ? '→ Фрилансер' : '→ Заказчик'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

// ==================== HEADER ====================

interface HeaderProps {
    title?: string;
    onMenuClick: () => void;
    actions?: ReactNode;
}

export function Header({ title, onMenuClick, actions }: HeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
                <button
                    className="md:hidden p-2 mr-2 rounded-lg hover:bg-slate-100"
                    onClick={onMenuClick}
                >
                    <Menu className="w-6 h-6 text-slate-600" />
                </button>
                {title && (
                    <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                )}
            </div>

            <div className="flex items-center gap-3">
                <LanguageSwitcher />
                {actions}
            </div>
        </header>
    );
}

// ==================== MAIN LAYOUT ====================

interface LayoutProps {
    children: ReactNode;
    currentView: string;
    onNavigate: (view: string) => void;
    title?: string;
    headerActions?: ReactNode;
}

export function Layout({ children, currentView, onNavigate, title, headerActions }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar
                currentView={currentView}
                onNavigate={onNavigate}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                    actions={headerActions}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
