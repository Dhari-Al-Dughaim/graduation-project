import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                {/* Decorative background elements */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-70" />
                <div className="pointer-events-none absolute inset-0 bg-pattern-grid opacity-40" />
                {/* Floating gradient orbs */}
                <div className="bg-glow-orb absolute -top-32 right-1/4 h-80 w-80 bg-amber-200/15 dark:bg-amber-500/8" />
                <div className="bg-glow-orb absolute bottom-1/4 -left-20 h-64 w-64 bg-orange-200/10 dark:bg-orange-500/5" style={{ animationDelay: '4s' }} />
                <div className="relative z-10 flex min-h-screen w-full flex-col">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <div className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                {/* Decorative background elements */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-70" />
                <div className="pointer-events-none absolute inset-0 bg-pattern-grid opacity-40" />
                {/* Floating gradient orbs */}
                <div className="bg-glow-orb absolute -top-32 right-1/4 h-80 w-80 bg-amber-200/15 dark:bg-amber-500/8" />
                <div className="bg-glow-orb absolute bottom-1/4 -left-20 h-64 w-64 bg-orange-200/10 dark:bg-orange-500/5" style={{ animationDelay: '4s' }} />
                <div className="relative z-10 flex min-h-screen w-full">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}
