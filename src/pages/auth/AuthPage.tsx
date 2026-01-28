// ============================================
// Страница авторизации
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n';
import { Button, Input, Card, Divider } from '../../components/ui';
import { Role } from '../../types';
import { Mail, Lock, Briefcase, User, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'selectRole' | 'forgotPassword';

export function AuthPage() {
    const { login, register, isLoading } = useAuth();
    const { t, toggleLanguage, language } = useI18n();

    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError(t.errors.required);
            return;
        }

        try {
            await login(email, password);
        } catch (err) {
            setError(t.errors.somethingWentWrong);
        }
    };

    const handleSelectRole = (role: Role) => {
        setSelectedRole(role);
        handleRegister(role);
    };

    const handleRegister = async (role: Role) => {
        setError('');

        if (!email || !password) {
            setError(t.errors.required);
            return;
        }

        if (password.length < 6) {
            setError(t.errors.passwordTooShort);
            return;
        }

        if (password !== confirmPassword) {
            setError(t.errors.passwordsDoNotMatch);
            return;
        }

        try {
            await register(email, password, role);
        } catch (err) {
            setError(t.errors.somethingWentWrong);
        }
    };

    const goToRegister = () => {
        if (!email || !password || password !== confirmPassword || password.length < 6) {
            if (!email) setError(t.errors.required);
            else if (password.length < 6) setError(t.errors.passwordTooShort);
            else if (password !== confirmPassword) setError(t.errors.passwordsDoNotMatch);
            return;
        }
        setError('');
        setMode('selectRole');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

            <div className="relative w-full max-w-md">
                {/* Language switcher */}
                <button
                    onClick={toggleLanguage}
                    className="absolute -top-12 right-0 text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                    {language === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
                </button>

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl shadow-blue-500/30 mb-4">
                        <span className="text-white font-bold text-2xl">F</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">FreelanceHub</h1>
                    <p className="text-slate-400 mt-1">IT Биржа фрилансеров</p>
                </div>

                <Card className="backdrop-blur-xl bg-white/95 border-0 shadow-2xl">
                    {/* Login Form */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="p-6 space-y-5">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">{t.auth.welcomeBack}</h2>
                                <p className="text-slate-500 text-sm mt-1">{t.auth.login}</p>
                            </div>

                            <Input
                                label={t.auth.email}
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                leftIcon={<Mail className="w-5 h-5" />}
                                error={error && !email ? error : undefined}
                            />

                            <Input
                                label={t.auth.password}
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                leftIcon={<Lock className="w-5 h-5" />}
                                error={error && email && !password ? error : undefined}
                            />

                            {error && email && password && (
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            )}

                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => setMode('forgotPassword')}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {t.auth.forgotPassword}
                                </button>
                            </div>

                            <Button type="submit" fullWidth size="lg" loading={isLoading}>
                                {t.auth.login}
                            </Button>

                            <Divider text={t.auth.orContinueWith} className="my-6" />

                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                leftIcon={
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                }
                            >
                                {t.auth.loginWithGoogle}
                            </Button>

                            <p className="text-center text-sm text-slate-600 mt-6">
                                {t.auth.noAccount}{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('register')}
                                    className="text-blue-600 font-medium hover:text-blue-700"
                                >
                                    {t.auth.register}
                                </button>
                            </p>
                        </form>
                    )}

                    {/* Register Form */}
                    {mode === 'register' && (
                        <form onSubmit={e => { e.preventDefault(); goToRegister(); }} className="p-6 space-y-5">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">{t.auth.createYourAccount}</h2>
                                <p className="text-slate-500 text-sm mt-1">{t.auth.register}</p>
                            </div>

                            <Input
                                label={t.auth.email}
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                leftIcon={<Mail className="w-5 h-5" />}
                            />

                            <Input
                                label={t.auth.password}
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                leftIcon={<Lock className="w-5 h-5" />}
                                hint={language === 'ru' ? 'Минимум 6 символов' : 'At least 6 characters'}
                            />

                            <Input
                                label={t.auth.confirmPassword}
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                leftIcon={<Lock className="w-5 h-5" />}
                            />

                            {error && (
                                <p className="text-sm text-red-600 text-center">{error}</p>
                            )}

                            <Button type="submit" fullWidth size="lg" loading={isLoading}>
                                {t.common.next}
                            </Button>

                            <p className="text-center text-sm text-slate-600 mt-6">
                                {t.auth.alreadyHaveAccount}{' '}
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    className="text-blue-600 font-medium hover:text-blue-700"
                                >
                                    {t.auth.login}
                                </button>
                            </p>
                        </form>
                    )}

                    {/* Select Role */}
                    {mode === 'selectRole' && (
                        <div className="p-6">
                            <button
                                onClick={() => setMode('register')}
                                className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                {t.common.back}
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-slate-900">{t.roles.chooseRole}</h2>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleSelectRole('CLIENT')}
                                    disabled={isLoading}
                                    className="w-full p-5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                                            <Briefcase className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{t.roles.iAmClient}</h3>
                                            <p className="text-sm text-slate-500">{t.roles.clientDesc}</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleSelectRole('FREELANCER')}
                                    disabled={isLoading}
                                    className="w-full p-5 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                                            <User className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{t.roles.iAmFreelancer}</h3>
                                            <p className="text-sm text-slate-500">{t.roles.freelancerDesc}</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Forgot Password */}
                    {mode === 'forgotPassword' && (
                        <div className="p-6 space-y-5">
                            <button
                                onClick={() => setMode('login')}
                                className="flex items-center text-slate-600 hover:text-slate-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                {t.common.back}
                            </button>

                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">{t.auth.resetPassword}</h2>
                                <p className="text-slate-500 text-sm mt-2">
                                    {language === 'ru'
                                        ? 'Введите email, и мы отправим вам ссылку для восстановления пароля'
                                        : "Enter your email and we'll send you a password reset link"
                                    }
                                </p>
                            </div>

                            <Input
                                label={t.auth.email}
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                leftIcon={<Mail className="w-5 h-5" />}
                            />

                            <Button fullWidth size="lg">
                                {t.auth.resetPassword}
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Demo hint */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    {language === 'ru'
                        ? 'Демо: введите любой email для входа'
                        : 'Demo: enter any email to login'
                    }
                </p>
            </div>
        </div>
    );
}
