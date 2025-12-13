import { StoreLogo } from '@/components/store-logo';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-cyan-50/70 via-background to-background p-6 md:p-10 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
            <div className="pointer-events-none absolute inset-0 bg-pattern-dots opacity-50" />
            {/* Floating gradient orbs */}
            <div className="bg-glow-orb absolute -top-20 -right-20 h-72 w-72 bg-cyan-300/25 dark:bg-[#00a0a3]/10" />
            <div className="bg-glow-orb absolute -bottom-20 -left-20 h-64 w-64 bg-cyan-400/20 dark:bg-cyan-600/8" style={{ animationDelay: '3s' }} />
            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <StoreLogo className="scale-125" />
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
