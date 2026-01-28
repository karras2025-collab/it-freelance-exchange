// ============================================
// Страница чата (Premium)
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button, Avatar, EmptyState, Input } from '../../components/ui';
import {
    MessageSquare,
    Send,
    Lock,
    Zap,
    Paperclip,
    Image,
    MoreVertical,
    Phone,
    Video,
    Info,
    Check,
    CheckCheck
} from 'lucide-react';

interface ChatPageProps {
    initialDealId?: string;
    onNavigate: (view: string) => void;
}

export function ChatPage({ initialDealId, onNavigate }: ChatPageProps) {
    const { user, hasPremiumChat } = useAuth();
    const { deals, getDealsByUser, getMessagesByDeal, sendMessage } = useData();
    const { t, language } = useI18n();

    const [selectedDealId, setSelectedDealId] = useState<string | null>(initialDealId || null);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isFreelancer = user?.role === 'FREELANCER';
    const isPremium = hasPremiumChat();
    const myDeals = user ? getDealsByUser(user.id) : [];
    const activeDeals = myDeals.filter(d => d.status === 'IN_PROGRESS');

    const selectedDeal = selectedDealId ? deals.find(d => d.id === selectedDealId) : null;
    const messages = selectedDealId ? getMessagesByDeal(selectedDealId) : [];

    // Auto-select first deal
    useEffect(() => {
        if (!selectedDealId && activeDeals.length > 0 && isPremium) {
            setSelectedDealId(activeDeals[0].id);
        }
    }, [activeDeals, selectedDealId, isPremium]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedDealId || !user) return;

        sendMessage(selectedDealId, user.id, user.displayName, messageText.trim());
        setMessageText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return language === 'ru' ? 'Сегодня' : 'Today';
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return language === 'ru' ? 'Вчера' : 'Yesterday';
        }
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
            day: 'numeric',
            month: 'long'
        });
    };

    // Premium Lock for Freelancers
    if (isFreelancer && !isPremium) {
        return (
            <div className="max-w-lg mx-auto text-center py-20">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    {t.chat.premiumRequired}
                </h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    {t.chat.upgradeForChat}
                </p>
                <Button
                    size="lg"
                    onClick={() => onNavigate('SUBSCRIPTION')}
                    leftIcon={<Zap className="w-5 h-5" />}
                >
                    {t.subscription.upgrade}
                </Button>
            </div>
        );
    }

    // No deals
    if (activeDeals.length === 0) {
        return (
            <div className="max-w-lg mx-auto py-20">
                <EmptyState
                    icon={<MessageSquare className="w-10 h-10" />}
                    title={t.chat.noChats}
                    description={
                        language === 'ru'
                            ? 'Чаты появятся после создания сделки'
                            : 'Chats will appear after a deal is created'
                    }
                    action={
                        <Button variant="outline" onClick={() => onNavigate('SEARCH')}>
                            {t.jobs.findJobs}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Deals List Sidebar */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 bg-white">
                    <h2 className="text-lg font-bold text-slate-900">{t.chat.title}</h2>
                    <p className="text-sm text-slate-500">{activeDeals.length} {language === 'ru' ? 'активных' : 'active'}</p>
                </div>

                {/* Deals List */}
                <div className="flex-1 overflow-y-auto">
                    {activeDeals.map(deal => {
                        const isSelected = deal.id === selectedDealId;
                        const otherParty = user?.role === 'CLIENT' ? deal.freelancerName : deal.clientName;
                        const otherAvatar = user?.role === 'CLIENT' ? deal.freelancerAvatar : deal.clientAvatar;

                        return (
                            <div
                                key={deal.id}
                                onClick={() => setSelectedDealId(deal.id)}
                                className={`
                  p-4 cursor-pointer transition-colors border-b border-slate-100
                  ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-white'}
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar src={otherAvatar} name={otherParty} size="md" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{otherParty}</p>
                                        <p className="text-sm text-slate-500 truncate">{deal.jobTitle}</p>
                                    </div>
                                    <Badge color="blue" size="sm">
                                        {t.deals.status.inProgress || 'Active'}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedDeal ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={user?.role === 'CLIENT' ? selectedDeal.freelancerAvatar : selectedDeal.clientAvatar}
                                    name={user?.role === 'CLIENT' ? selectedDeal.freelancerName : selectedDeal.clientName}
                                    size="md"
                                />
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {user?.role === 'CLIENT' ? selectedDeal.freelancerName : selectedDeal.clientName}
                                    </p>
                                    <p className="text-sm text-slate-500">{selectedDeal.jobTitle}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                    <Info className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.length === 0 ? (
                                <div className="text-center py-10">
                                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500">
                                        {language === 'ru' ? 'Начните диалог!' : 'Start the conversation!'}
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.senderId === user?.id;
                                    const showDate = index === 0 ||
                                        formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

                                    return (
                                        <React.Fragment key={msg.id}>
                                            {showDate && (
                                                <div className="text-center my-4">
                                                    <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                                        {formatDate(msg.createdAt)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`
                          max-w-[70%] rounded-2xl px-4 py-2.5
                          ${isMe
                                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm'
                                                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                                                    }
                        `}>
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'
                                                        }`}>
                                                        <span className="text-xs">{formatTime(msg.createdAt)}</span>
                                                        {isMe && <CheckCheck className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex items-center gap-3">
                                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                    <Image className="w-5 h-5" />
                                </button>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={t.chat.typeMessage}
                                        className="w-full px-4 py-2.5 bg-slate-100 border-0 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!messageText.trim()}
                                    className="rounded-full w-10 h-10 p-0"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-slate-50">
                        <div className="text-center">
                            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">
                                {language === 'ru' ? 'Выберите чат слева' : 'Select a chat from the left'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
