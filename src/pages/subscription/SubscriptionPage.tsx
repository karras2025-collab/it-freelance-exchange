// ============================================
// Страница подписки
// ============================================

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n';
import { Card, Badge, Button } from '../../components/ui';
import { SUBSCRIPTION_PLANS } from '../../constants';
import { SubscriptionPlan } from '../../types';
import {
    Check,
    Zap,
    Crown,
    Star,
    MessageSquare,
    Send,
    Shield,
    Sparkles
} from 'lucide-react';

interface SubscriptionPageProps {
    onNavigate: (view: string) => void;
}

export function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
    const { subscription, upgradeSubscription } = useAuth();
    const { t, language } = useI18n();

    const currentPlanId = subscription?.planId || 'FREE';

    const handleUpgrade = (planId: SubscriptionPlan) => {
        if (planId === 'FREE' || planId === currentPlanId) return;

        // В реальном приложении здесь будет редирект на страницу оплаты
        // Для демо просто активируем подписку
        upgradeSubscription(planId);
    };

    const getPlanIcon = (planId: string) => {
        switch (planId) {
            case 'FREE': return <Star className="w-6 h-6" />;
            case 'PRO': return <Zap className="w-6 h-6" />;
            case 'PREMIUM': return <Crown className="w-6 h-6" />;
            default: return <Star className="w-6 h-6" />;
        }
    };

    const getPlanColors = (planId: string, isCurrent: boolean) => {
        if (isCurrent) {
            return {
                card: 'border-blue-500 ring-2 ring-blue-500/20',
                icon: 'bg-blue-100 text-blue-600',
                button: 'bg-slate-100 text-slate-500'
            };
        }
        switch (planId) {
            case 'FREE':
                return {
                    card: 'border-slate-200 hover:border-slate-300',
                    icon: 'bg-slate-100 text-slate-600',
                    button: 'bg-slate-800 text-white hover:bg-slate-900'
                };
            case 'PRO':
                return {
                    card: 'border-slate-200 hover:border-blue-300',
                    icon: 'bg-blue-100 text-blue-600',
                    button: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                };
            case 'PREMIUM':
                return {
                    card: 'border-amber-200 hover:border-amber-300 bg-gradient-to-br from-amber-50/50 to-orange-50/50',
                    icon: 'bg-amber-100 text-amber-600',
                    button: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
                };
            default:
                return {
                    card: 'border-slate-200',
                    icon: 'bg-slate-100 text-slate-600',
                    button: 'bg-slate-800 text-white'
                };
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                    {language === 'ru' ? 'Выберите подписку' : 'Choose your plan'}
                </h1>
                <p className="text-slate-500 mt-2 max-w-lg mx-auto">
                    {language === 'ru'
                        ? 'Откройте больше возможностей для работы на платформе'
                        : 'Unlock more features to grow your freelance career'
                    }
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUBSCRIPTION_PLANS.map(plan => {
                    const isCurrent = plan.id === currentPlanId;
                    const colors = getPlanColors(plan.id, isCurrent);
                    const features = language === 'ru' ? plan.features : plan.featuresEn;

                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col ${colors.card} transition-all duration-200`}
                            padding="lg"
                        >
                            {/* Best Value Badge */}
                            {plan.id === 'PREMIUM' && !isCurrent && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge color="yellow" className="shadow-lg">
                                        {t.subscription.bestValue}
                                    </Badge>
                                </div>
                            )}

                            {/* Current Plan Badge */}
                            {isCurrent && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge color="blue" className="shadow-lg">
                                        {t.subscription.currentPlan}
                                    </Badge>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center mb-6">
                                <div className={`w-14 h-14 rounded-2xl ${colors.icon} flex items-center justify-center mx-auto mb-4`}>
                                    {getPlanIcon(plan.id)}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {language === 'ru' ? plan.name : plan.nameEn}
                                </h3>
                                <div className="mt-2">
                                    <span className="text-4xl font-extrabold text-slate-900">
                                        {plan.priceMonthly === 0 ? (language === 'ru' ? '0' : 'Free') : `${plan.priceMonthly}`}
                                    </span>
                                    {plan.priceMonthly > 0 && (
                                        <span className="text-slate-500 ml-1">₽/{language === 'ru' ? 'мес' : 'mo'}</span>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 flex-1 mb-6">
                                {/* Application limit */}
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Send className="w-3 h-3 text-emerald-600" />
                                    </div>
                                    <span className="text-slate-700">
                                        {plan.applicationsPerWeek === null
                                            ? (language === 'ru' ? 'Безлимит откликов' : 'Unlimited applications')
                                            : (language === 'ru' ? `${plan.applicationsPerWeek} отклика в неделю` : `${plan.applicationsPerWeek} applications/week`)
                                        }
                                    </span>
                                </li>

                                {/* Chat */}
                                <li className="flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.chatEnabled ? 'bg-emerald-100' : 'bg-slate-100'
                                        }`}>
                                        <MessageSquare className={`w-3 h-3 ${plan.chatEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    </div>
                                    <span className={plan.chatEnabled ? 'text-slate-700' : 'text-slate-400'}>
                                        {plan.chatEnabled
                                            ? (language === 'ru' ? 'Чат с заказчиками' : 'Chat with clients')
                                            : (language === 'ru' ? 'Чат недоступен' : 'No chat access')
                                        }
                                    </span>
                                </li>

                                {/* Additional features */}
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-emerald-600" />
                                        </div>
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isCurrent || plan.id === 'FREE'}
                                className={`
                  w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200
                  disabled:cursor-not-allowed
                  ${isCurrent
                                        ? 'bg-slate-100 text-slate-500 cursor-default'
                                        : plan.id === 'FREE'
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : colors.button + ' shadow-lg'
                                    }
                `}
                            >
                                {isCurrent
                                    ? t.subscription.currentPlan
                                    : plan.id === 'FREE'
                                        ? t.common.free
                                        : t.subscription.subscribe
                                }
                            </button>
                        </Card>
                    );
                })}
            </div>

            {/* FAQ / Additional Info */}
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0">
                <div className="text-center">
                    <Shield className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-2">
                        {language === 'ru' ? 'Безопасная оплата' : 'Secure Payment'}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-lg mx-auto">
                        {language === 'ru'
                            ? 'Платежи обрабатываются через ЮKassa. Вы можете отменить подписку в любой момент.'
                            : 'Payments are processed securely via YooKassa. You can cancel anytime.'
                        }
                    </p>
                </div>
            </Card>

            {/* Comparison Table */}
            <Card padding="none">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                        {language === 'ru' ? 'Сравнение планов' : 'Compare Plans'}
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left py-3 px-5 font-medium text-slate-600">
                                    {language === 'ru' ? 'Возможность' : 'Feature'}
                                </th>
                                {SUBSCRIPTION_PLANS.map(plan => (
                                    <th key={plan.id} className="py-3 px-5 font-medium text-slate-600 text-center">
                                        {language === 'ru' ? plan.name : plan.nameEn}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="py-4 px-5 text-slate-700">
                                    {language === 'ru' ? 'Откликов в неделю' : 'Applications/week'}
                                </td>
                                {SUBSCRIPTION_PLANS.map(plan => (
                                    <td key={plan.id} className="py-4 px-5 text-center font-medium text-slate-900">
                                        {plan.applicationsPerWeek === null ? '∞' : plan.applicationsPerWeek}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-4 px-5 text-slate-700">
                                    {language === 'ru' ? 'Чат с заказчиками' : 'Client chat'}
                                </td>
                                {SUBSCRIPTION_PLANS.map(plan => (
                                    <td key={plan.id} className="py-4 px-5 text-center">
                                        {plan.chatEnabled
                                            ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                            : <span className="text-slate-300">—</span>
                                        }
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-4 px-5 text-slate-700">
                                    {language === 'ru' ? 'Приоритет в поиске' : 'Search priority'}
                                </td>
                                <td className="py-4 px-5 text-center"><span className="text-slate-300">—</span></td>
                                <td className="py-4 px-5 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                                <td className="py-4 px-5 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-4 px-5 text-slate-700">
                                    {language === 'ru' ? 'Значок Verified' : 'Verified badge'}
                                </td>
                                <td className="py-4 px-5 text-center"><span className="text-slate-300">—</span></td>
                                <td className="py-4 px-5 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                                <td className="py-4 px-5 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                            <tr>
                                <td className="py-4 px-5 text-slate-700">
                                    {language === 'ru' ? 'Приоритетная поддержка' : 'Priority support'}
                                </td>
                                <td className="py-4 px-5 text-center"><span className="text-slate-300">—</span></td>
                                <td className="py-4 px-5 text-center"><span className="text-slate-300">—</span></td>
                                <td className="py-4 px-5 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
