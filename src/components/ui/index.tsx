// ============================================
// UI-компоненты (базовые)
// ============================================

import React, { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react';

// ==================== BUTTON ====================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}, ref) => {
    const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg shadow-blue-500/25',
        secondary: 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500',
        outline: 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-500',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg shadow-red-500/25',
        success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2.5'
    };

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
});

Button.displayName = 'Button';

// ==================== INPUT ====================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full rounded-xl border bg-white text-slate-900 placeholder-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${rightIcon ? 'pr-10' : 'pr-4'}
            py-2.5
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'}
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {hint && !error && (
                <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
            )}
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

// ==================== TEXTAREA ====================

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
    label,
    error,
    hint,
    className = '',
    id,
    ...props
}, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                className={`
          w-full rounded-xl border bg-white text-slate-900 placeholder-slate-400
          transition-all duration-200 resize-y min-h-[100px]
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          px-4 py-2.5
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'}
          ${className}
        `}
                {...props}
            />
            {hint && !error && (
                <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
            )}
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

// ==================== CARD ====================

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className = '', padding = 'md', hover = false, onClick }: CardProps) {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6'
    };

    return (
        <div
            onClick={onClick}
            className={`
        bg-white rounded-2xl border border-slate-200 shadow-sm
        ${hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

// ==================== BADGE ====================

interface BadgeProps {
    children: ReactNode;
    color?: 'blue' | 'green' | 'red' | 'gray' | 'yellow' | 'purple' | 'orange';
    size?: 'sm' | 'md';
    className?: string;
}

export function Badge({ children, color = 'gray', size = 'md', className = '' }: BadgeProps) {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        red: 'bg-red-50 text-red-700 ring-red-600/20',
        gray: 'bg-slate-100 text-slate-700 ring-slate-600/20',
        yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
        orange: 'bg-orange-50 text-orange-700 ring-orange-600/20'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs'
    };

    return (
        <span className={`
      inline-flex items-center font-medium rounded-full ring-1 ring-inset
      ${colors[color]} ${sizes[size]} ${className}
    `}>
            {children}
        </span>
    );
}

// ==================== AVATAR ====================

interface AvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg'
    };

    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`rounded-full object-cover ${sizes[size]} ${className}`}
            />
        );
    }

    return (
        <div className={`
      rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white
      flex items-center justify-center font-semibold
      ${sizes[size]} ${className}
    `}>
            {initials}
        </div>
    );
}

// ==================== MODAL ====================

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal content */}
                <div className={`
          relative bg-white rounded-2xl shadow-2xl w-full
          transform transition-all
          ${sizes[size]}
        `}>
                    {title && (
                        <div className="flex items-center justify-between p-5 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className={!title ? 'p-5' : ''}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== TABS ====================

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
    return (
        <div className={`flex space-x-1 bg-slate-100 p-1 rounded-xl ${className}`}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${activeTab === tab.id
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }
          `}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ==================== EMPTY STATE ====================

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && (
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            {description && (
                <p className="text-slate-500 max-w-md mb-6">{description}</p>
            )}
            {action}
        </div>
    );
}

// ==================== SKELETON ====================

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ width, height, className = '', variant = 'rectangular' }: SkeletonProps) {
    const variants = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl'
    };

    return (
        <div
            className={`bg-slate-200 animate-pulse ${variants[variant]} ${className}`}
            style={{ width, height }}
        />
    );
}

// ==================== DIVIDER ====================

interface DividerProps {
    text?: string;
    className?: string;
}

export function Divider({ text, className = '' }: DividerProps) {
    if (text) {
        return (
            <div className={`relative flex items-center ${className}`}>
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink-0 px-4 text-sm text-slate-500">{text}</span>
                <div className="flex-grow border-t border-slate-200" />
            </div>
        );
    }

    return <hr className={`border-slate-200 ${className}`} />;
}

// ==================== SELECT ====================

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
}

export function Select({ label, options, value, onChange, placeholder, error, className = '' }: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`
          w-full rounded-xl border bg-white text-slate-900
          transition-all duration-200 px-4 py-2.5
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-300' : 'border-slate-200'}
          ${className}
        `}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
