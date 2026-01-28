// ============================================
// Главный файл приложения
// ============================================

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { I18nProvider, useI18n } from './i18n';

// Layout
import { Layout } from './components/layout';

// Pages
import { AuthPage } from './pages/auth/AuthPage';
import { Dashboard } from './pages/dashboard/Dashboard';
import { JobSearch } from './pages/jobs/JobSearch';
import { JobDetails } from './pages/jobs/JobDetails';
import { CreateJob } from './pages/jobs/CreateJob';
import { MyJobs } from './pages/jobs/MyJobs';
import { MyApplications } from './pages/applications/MyApplications';
import { DealsPage } from './pages/deals/DealsPage';
import { SubscriptionPage } from './pages/subscription/SubscriptionPage';
import { ChatPage } from './pages/chat/ChatPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// --- View Types ---
type View =
    | 'DASHBOARD'
    | 'SEARCH'
    | 'JOB_DETAILS'
    | 'CREATE_JOB'
    | 'MY_JOBS'
    | 'APPLICATIONS'
    | 'DEALS'
    | 'SUBSCRIPTION'
    | 'CHAT'
    | 'PROFILE';

interface ViewData {
    jobId?: string;
    dealId?: string;
    applicationId?: string;
}

// --- Main App Content ---
function AppContent() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const { t, language } = useI18n();

    const [currentView, setCurrentView] = useState<View>('DASHBOARD');
    const [viewData, setViewData] = useState<ViewData>({});

    const handleNavigate = (view: string, data?: any) => {
        setCurrentView(view as View);
        if (data) {
            setViewData(data);
        } else {
            setViewData({});
        }
        // Scroll to top on navigation
        window.scrollTo(0, 0);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">{t.common.loading}</p>
                </div>
            </div>
        );
    }

    // Auth screen
    if (!isAuthenticated) {
        return <AuthPage />;
    }

    // Get page title
    const getPageTitle = () => {
        switch (currentView) {
            case 'DASHBOARD': return language === 'ru' ? 'Главная' : 'Dashboard';
            case 'SEARCH': return t.jobs.findJobs;
            case 'JOB_DETAILS': return t.jobs.jobDetails;
            case 'CREATE_JOB': return t.jobs.createJob;
            case 'MY_JOBS': return t.nav.myJobs;
            case 'APPLICATIONS': return t.nav.myApplications;
            case 'DEALS': return language === 'ru' ? 'Мои сделки' : 'My Deals';
            case 'SUBSCRIPTION': return t.nav.subscription;
            case 'CHAT': return t.nav.chat;
            case 'PROFILE': return t.nav.profile;
            default: return '';
        }
    };

    // Render current page
    const renderPage = () => {
        switch (currentView) {
            case 'DASHBOARD':
                return <Dashboard onNavigate={handleNavigate} />;

            case 'SEARCH':
                return <JobSearch onNavigate={handleNavigate} />;

            case 'JOB_DETAILS':
                return viewData.jobId
                    ? <JobDetails jobId={viewData.jobId} onNavigate={handleNavigate} />
                    : <JobSearch onNavigate={handleNavigate} />;

            case 'CREATE_JOB':
                return <CreateJob onNavigate={handleNavigate} />;

            case 'MY_JOBS':
                return <MyJobs onNavigate={handleNavigate} />;

            case 'APPLICATIONS':
                return <MyApplications onNavigate={handleNavigate} />;

            case 'DEALS':
                return <DealsPage onNavigate={handleNavigate} />;

            case 'SUBSCRIPTION':
                return <SubscriptionPage onNavigate={handleNavigate} />;

            case 'CHAT':
                return <ChatPage initialDealId={viewData.dealId} onNavigate={handleNavigate} />;

            case 'PROFILE':
                return <ProfilePage onNavigate={handleNavigate} />;

            default:
                return <Dashboard onNavigate={handleNavigate} />;
        }
    };

    return (
        <Layout
            currentView={currentView}
            onNavigate={handleNavigate}
            title={getPageTitle()}
        >
            {renderPage()}
        </Layout>
    );
}

// --- Root App with Providers ---
export default function App() {
    return (
        <I18nProvider>
            <AuthProvider>
                <DataProvider>
                    <AppContent />
                </DataProvider>
            </AuthProvider>
        </I18nProvider>
    );
}
