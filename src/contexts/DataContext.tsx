// ============================================
// Контекст данных (Jobs, Applications, Deals)
// ============================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Job, Application, Deal, Message, JobStatus, ApplicationStatus, DealStatus } from '../types';
import { MOCK_JOBS, MOCK_APPLICATIONS, MOCK_DEALS, MOCK_MESSAGES } from '../constants';

interface DataContextType {
    // --- Jobs ---
    jobs: Job[];
    getJob: (id: string) => Job | undefined;
    getJobsByClient: (clientId: string) => Job[];
    getPublishedJobs: () => Job[];
    createJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicationCount'>) => Job;
    updateJob: (id: string, updates: Partial<Job>) => void;
    updateJobStatus: (id: string, status: JobStatus) => void;

    // --- Applications ---
    applications: Application[];
    getApplication: (id: string) => Application | undefined;
    getApplicationsByJob: (jobId: string) => Application[];
    getApplicationsByFreelancer: (freelancerId: string) => Application[];
    hasApplied: (jobId: string, freelancerId: string) => boolean;
    createApplication: (app: Omit<Application, 'id' | 'createdAt' | 'status'>) => Application;
    updateApplicationStatus: (id: string, status: ApplicationStatus) => void;

    // --- Deals ---
    deals: Deal[];
    getDeal: (id: string) => Deal | undefined;
    getDealsByUser: (userId: string) => Deal[];
    createDeal: (applicationId: string) => Deal | null;
    updateDealStatus: (id: string, status: DealStatus) => void;

    // --- Messages ---
    messages: Message[];
    getMessagesByDeal: (dealId: string) => Message[];
    sendMessage: (dealId: string, senderId: string, senderName: string, content: string) => Message;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
    const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
    const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

    // ==================== JOBS ====================

    const getJob = useCallback((id: string) => {
        return jobs.find(j => j.id === id);
    }, [jobs]);

    const getJobsByClient = useCallback((clientId: string) => {
        return jobs.filter(j => j.clientId === clientId);
    }, [jobs]);

    const getPublishedJobs = useCallback(() => {
        return jobs.filter(j => j.status === 'PUBLISHED');
    }, [jobs]);

    const createJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicationCount'>): Job => {
        const newJob: Job = {
            ...jobData,
            id: `job-${Date.now()}`,
            applicationCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setJobs(prev => [newJob, ...prev]);
        return newJob;
    }, []);

    const updateJob = useCallback((id: string, updates: Partial<Job>) => {
        setJobs(prev => prev.map(j =>
            j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
        ));
    }, []);

    const updateJobStatus = useCallback((id: string, status: JobStatus) => {
        updateJob(id, { status });
    }, [updateJob]);

    // ==================== APPLICATIONS ====================

    const getApplication = useCallback((id: string) => {
        return applications.find(a => a.id === id);
    }, [applications]);

    const getApplicationsByJob = useCallback((jobId: string) => {
        return applications.filter(a => a.jobId === jobId);
    }, [applications]);

    const getApplicationsByFreelancer = useCallback((freelancerId: string) => {
        return applications.filter(a => a.freelancerId === freelancerId);
    }, [applications]);

    const hasApplied = useCallback((jobId: string, freelancerId: string) => {
        return applications.some(a => a.jobId === jobId && a.freelancerId === freelancerId);
    }, [applications]);

    const createApplication = useCallback((appData: Omit<Application, 'id' | 'createdAt' | 'status'>): Application => {
        const newApp: Application = {
            ...appData,
            id: `app-${Date.now()}`,
            status: 'SENT',
            createdAt: new Date().toISOString()
        };
        setApplications(prev => [newApp, ...prev]);

        // Увеличиваем счётчик откликов у задания
        setJobs(prev => prev.map(j =>
            j.id === appData.jobId ? { ...j, applicationCount: j.applicationCount + 1 } : j
        ));

        return newApp;
    }, []);

    const updateApplicationStatus = useCallback((id: string, status: ApplicationStatus) => {
        setApplications(prev => prev.map(a =>
            a.id === id ? { ...a, status } : a
        ));
    }, []);

    // ==================== DEALS ====================

    const getDeal = useCallback((id: string) => {
        return deals.find(d => d.id === id);
    }, [deals]);

    const getDealsByUser = useCallback((userId: string) => {
        return deals.filter(d => d.clientId === userId || d.freelancerId === userId);
    }, [deals]);

    const createDeal = useCallback((applicationId: string): Deal | null => {
        const app = applications.find(a => a.id === applicationId);
        if (!app) return null;

        const job = jobs.find(j => j.id === app.jobId);
        if (!job) return null;

        // Обновляем статус отклика
        updateApplicationStatus(applicationId, 'ACCEPTED');

        // Ставим задание на паузу
        updateJobStatus(job.id, 'PAUSED');

        const newDeal: Deal = {
            id: `deal-${Date.now()}`,
            jobId: job.id,
            jobTitle: job.title,
            clientId: job.clientId,
            clientName: job.clientName,
            clientAvatar: job.clientAvatar,
            freelancerId: app.freelancerId,
            freelancerName: app.freelancerName,
            freelancerAvatar: app.freelancerAvatar,
            applicationId,
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString()
        };

        setDeals(prev => [newDeal, ...prev]);
        return newDeal;
    }, [applications, jobs, updateApplicationStatus, updateJobStatus]);

    const updateDealStatus = useCallback((id: string, status: DealStatus) => {
        setDeals(prev => prev.map(d =>
            d.id === id ? {
                ...d,
                status,
                completedAt: status === 'COMPLETED' ? new Date().toISOString() : d.completedAt
            } : d
        ));
    }, []);

    // ==================== MESSAGES ====================

    const getMessagesByDeal = useCallback((dealId: string) => {
        return messages.filter(m => m.dealId === dealId).sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }, [messages]);

    const sendMessage = useCallback((
        dealId: string,
        senderId: string,
        senderName: string,
        content: string
    ): Message => {
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            dealId,
            senderId,
            senderName,
            content,
            messageType: 'TEXT',
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    }, []);

    const value: DataContextType = {
        jobs,
        getJob,
        getJobsByClient,
        getPublishedJobs,
        createJob,
        updateJob,
        updateJobStatus,

        applications,
        getApplication,
        getApplicationsByJob,
        getApplicationsByFreelancer,
        hasApplied,
        createApplication,
        updateApplicationStatus,

        deals,
        getDeal,
        getDealsByUser,
        createDeal,
        updateDealStatus,

        messages,
        getMessagesByDeal,
        sendMessage
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
