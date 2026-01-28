// ============================================
// Контекст локализации
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations, Language, getBrowserLanguage } from './translations';

type TranslationsType = typeof translations.ru;

interface I18nContextType {
    language: Language;
    t: TranslationsType;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
    defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage }: I18nProviderProps) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (defaultLanguage) return defaultLanguage;
        // Проверяем localStorage
        const saved = localStorage.getItem('language') as Language | null;
        if (saved && (saved === 'ru' || saved === 'en')) return saved;
        // Иначе определяем по браузеру
        return getBrowserLanguage();
    });

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage(language === 'ru' ? 'en' : 'ru');
    }, [language, setLanguage]);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const t = translations[language];

    return (
        <I18nContext.Provider value={{ language, t, setLanguage, toggleLanguage }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

// Компонент переключателя языка
export function LanguageSwitcher({ className = '' }: { className?: string }) {
    const { language, toggleLanguage } = useI18n();

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
        bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors ${className}`}
            title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
        >
            <span className="text-base">{language === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
            <span className="uppercase">{language}</span>
        </button>
    );
}
