import { ReactNode } from 'react';

interface AlertDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function AlertDialog({
    isOpen,
    onOpenChange,
    title,
    children,
    onConfirm,
    onCancel,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    isLoading = false,
}: AlertDialogProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 animate-fade-in"
                onClick={handleCancel}
            />

            {/* Alert Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-lg p-6 dark:border-gray-700 dark:bg-gray-800 animate-zoom-in">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h2>

                    <div className="text-gray-700 dark:text-gray-300 mb-6">
                        {children}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Procesando...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
