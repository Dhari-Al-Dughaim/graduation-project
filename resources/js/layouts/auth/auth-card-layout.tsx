import { StoreLogo } from '@/components/store-logo';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-amber-50/70 via-muted to-background p-6 md:p-10 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
            <div className="pointer-events-none absolute inset-0 bg-pattern-dots opacity-50" />
            {/* Floating gradient orbs */}
            <div className="bg-glow-orb absolute -top-20 -right-20 h-72 w-72 bg-amber-300/25 dark:bg-amber-500/10" />
            <div className="bg-glow-orb absolute -bottom-20 -left-20 h-64 w-64 bg-orange-300/20 dark:bg-orange-500/8" style={{ animationDelay: '3s' }} />
            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <StoreLogo className="scale-125" />
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
