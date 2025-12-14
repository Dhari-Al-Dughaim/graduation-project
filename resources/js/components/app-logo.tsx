import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name } = usePage<SharedData>().props;

    return (
        <>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700">
                <img
                    src="/logo.png"
                    alt={name ?? 'Store logo'}
                    className="h-full w-full object-contain"
                    loading="lazy"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-neutral-900 dark:text-white">
                    {name ?? 'Store'}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Admin dashboard
                </span>
            </div>
        </>
    );
}
