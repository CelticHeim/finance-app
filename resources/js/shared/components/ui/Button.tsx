import { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonStyle = 'primary' | 'success' | 'danger' | 'cancel';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    style?: ButtonStyle;
    size?: ButtonSize;
    isLoading?: boolean;
}

export default function Button({
    children,
    style = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    const styleClasses: Record<ButtonStyle, string> = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500',
        success: 'bg-green-500 text-white hover:bg-green-600 dark:hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500',
        cancel: 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-red-500 hover:text-white dark:hover:bg-red-600 focus:ring-red-500',
    };

    const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-95 cursor-pointer disabled:cursor-not-allowed';

    const disabledClasses = disabled || isLoading ? 'opacity-60 disabled:active:scale-100' : '';

    const finalClassName = `${baseClasses} ${sizeClasses[size]} ${styleClasses[style]} ${disabledClasses} ${className}`;

    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={finalClassName}
        >
            {isLoading ? 'Procesando...' : children}
        </button>
    );
}
