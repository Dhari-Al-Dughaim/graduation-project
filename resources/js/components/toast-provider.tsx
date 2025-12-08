import { cn } from '@/lib/utils';
import { CheckCircle2, Info, X } from 'lucide-react';
import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
} from 'react';

type ToastVariant = 'success' | 'info';

type Toast = {
    id: number;
    title: string;
    description?: string;
    variant?: ToastVariant;
};

type ToastContextValue = {
    show: (toast: Omit<Toast, 'id'> & { durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        const dir =
            document.documentElement.getAttribute('dir') === 'rtl'
                ? 'rtl'
                : 'ltr';
        setDirection(dir);
    }, []);

    const show = useCallback(
        ({ durationMs = 2600, ...input }: Omit<Toast, 'id'> & { durationMs?: number }) => {
            const id = Date.now() + Math.random();
            const toast: Toast = {
                id,
                variant: 'info',
                ...input,
            };

            setToasts((current) => [...current, toast]);

            window.setTimeout(() => {
                setToasts((current) => current.filter((t) => t.id !== id));
            }, durationMs);
        },
        [],
    );

    const value = useMemo<ToastContextValue>(() => ({ show }), [show]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                className={cn(
                    'pointer-events-none fixed inset-x-0 top-4 z-40 flex px-4 sm:px-6',
                    direction === 'rtl'
                        ? 'justify-start sm:justify-start'
                        : 'justify-end sm:justify-end',
                )}
            >
                <div className="flex max-w-sm flex-col gap-2">
                    {toasts.map((toast) => {
                        const Icon =
                            toast.variant === 'success' ? CheckCircle2 : Info;

                        return (
                            <div
                                key={toast.id}
                                className={cn(
                                    'pointer-events-auto flex items-start gap-3 rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur-sm',
                                    'bg-white/90 text-neutral-900 border-neutral-200/80 dark:bg-neutral-900/90 dark:text-neutral-50 dark:border-neutral-700/80',
                                    'transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl',
                                )}
                            >
                                <Icon className="mt-0.5 size-4 text-emerald-500 dark:text-emerald-400" />
                                <div className="flex-1">
                                    <p className="font-medium leading-snug">
                                        {toast.title}
                                    </p>
                                    {toast.description && (
                                        <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-300">
                                            {toast.description}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    aria-label="Dismiss"
                                    onClick={() =>
                                        setToasts((current) =>
                                            current.filter(
                                                (t) => t.id !== toast.id,
                                            ),
                                        )
                                    }
                                    className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }

    return ctx;
}
