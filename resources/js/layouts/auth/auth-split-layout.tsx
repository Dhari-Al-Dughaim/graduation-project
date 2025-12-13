import { StoreLogo } from '@/components/store-logo';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center overflow-hidden px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-gradient-to-br from-[#008789] via-[#006b6d] to-cyan-900" />
                <div className="pointer-events-none absolute inset-0 bg-pattern-grid opacity-20" />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-lg font-medium"
                >
                    <StoreLogo />
                    <span className="text-white">{name}</span>
                </Link>
                {quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;{quote.message}&rdquo;
                            </p>
                            <footer className="text-sm text-neutral-300">
                                {quote.author}
                            </footer>
                        </blockquote>
                    </div>
                )}
            </div>
            <div className="relative w-full lg:p-8">
                {/* Decorative background for right panel */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-50" />
                <div className="pointer-events-none absolute inset-0 bg-pattern-dots opacity-30" />
                <div className="bg-glow-orb absolute -top-20 -right-20 h-56 w-56 bg-cyan-300/20 dark:bg-[#00a0a3]/10" />
                <div className="bg-glow-orb absolute -bottom-20 -left-20 h-48 w-48 bg-cyan-400/15 dark:bg-cyan-600/8" style={{ animationDelay: '3s' }} />
                <div className="relative z-10 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <StoreLogo className="scale-125" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
