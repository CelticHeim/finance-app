import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose?: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const startTime = Date.now();
        let animationFrameId: number;

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (elapsed < duration) {
                animationFrameId = requestAnimationFrame(updateProgress);
            } else {
                setIsExiting(true);
            }
        };

        animationFrameId = requestAnimationFrame(updateProgress);

        return () => cancelAnimationFrame(animationFrameId);
    }, [duration]);

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isExiting, onClose]);

    if (!isVisible) return null;

    const typeStyles = {
        success: {
            bg: 'bg-green-500 dark:bg-green-600',
            icon: '✓',
            border: 'border-green-600 dark:border-green-700',
            progressBg: 'bg-green-600 dark:bg-green-700',
        },
        error: {
            bg: 'bg-red-500 dark:bg-red-600',
            icon: '✕',
            border: 'border-red-600 dark:border-red-700',
            progressBg: 'bg-red-600 dark:bg-red-700',
        },
        info: {
            bg: 'bg-blue-500 dark:bg-blue-600',
            icon: 'ℹ',
            border: 'border-blue-600 dark:border-blue-700',
            progressBg: 'bg-blue-600 dark:bg-blue-700',
        },
        warning: {
            bg: 'bg-yellow-500 dark:bg-yellow-600',
            icon: '⚠',
            border: 'border-yellow-600 dark:border-yellow-700',
            progressBg: 'bg-yellow-600 dark:bg-yellow-700',
        },
    };

    const style = typeStyles[type];

    return (
        <div
            className={`fixed top-6 right-6 flex flex-col overflow-hidden rounded-lg shadow-lg border ${style.bg} ${style.border} text-white font-medium z-50 max-w-sm transition-all duration-300 ${
                isExiting 
                    ? 'opacity-0 -translate-y-full' 
                    : 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-top-4 duration-300'
            }`}
        >
            <div className="flex items-center gap-3 px-6 py-4">
                <span className="text-lg font-bold flex-shrink-0">{style.icon}</span>
                <span className="flex-1">{message}</span>
                <button
                    onClick={() => {
                        setIsExiting(true);
                    }}
                    className="ml-2 flex-shrink-0 text-xl font-bold hover:opacity-80 transition-opacity"
                    aria-label="Cerrar"
                >
                    ✕
                </button>
            </div>
            <div className={`h-1 ${style.progressBg}`} style={{ width: `${progress}%` }} />
        </div>
    );
}
