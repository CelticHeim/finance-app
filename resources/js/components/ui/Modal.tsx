import { ReactNode, useState } from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
    title?: string;
    children?: ReactNode;
    onClose?: () => void;
}

interface ModalBodyProps {
    children: ReactNode;
}

interface ModalFooterProps {
    children: ReactNode;
}

interface ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

function ModalHeader({ title, children, onClose }: ModalHeaderProps) {
    // Si solo hay título, mostrar un header simple con título y botón de cerrar
    if (title && !children) {
        return (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    aria-label="Cerrar modal"
                >
                    <X size={20} />
                </button>
            </div>
        );
    }

    // Si hay contenido personalizado, mostrar el contenido
    return <div className="border-b border-gray-200 dark:border-gray-700">{children}</div>;
}

function ModalBody({ children }: ModalBodyProps) {
    return <div className="px-6 py-4">{children}</div>;
}

function ModalFooter({ children }: ModalFooterProps) {
    return (
        <div className="border-t border-gray-200 px-6 py-4 rounded-b-lg dark:border-gray-700">
            {children}
        </div>
    );
}

function ModalContent({ isOpen, onOpenChange, children }: ModalProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}

export function Modal({ isOpen, onOpenChange, children }: ModalProps) {
    return (
        <ModalContent isOpen={isOpen} onOpenChange={onOpenChange}>
            {children}
        </ModalContent>
    );
}

export function useModal(initialState = false) {
    const [isOpen, setIsOpen] = useState(initialState);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(!isOpen);

    return {
        isOpen,
        onOpenChange: setIsOpen,
        open,
        close,
        toggle,
    };
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
