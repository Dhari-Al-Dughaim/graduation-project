import { LanguageSwitcher } from '@/components/language-switcher';
import { StoreLogo } from '@/components/store-logo';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale } from '@/hooks/use-locale';
import { useCart } from '@/hooks/use-cart';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { logout } from '@/routes';

interface StoreLayoutProps extends PropsWithChildren {
    title?: string;
}

export function StoreLayout({ children, title }: StoreLayoutProps) {
    const { t, direction } = useLocale();
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const cart = useCart();
    const cartCount = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-white text-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
            <div className="pointer-events-none absolute inset-0 bg-pattern-dots opacity-60" />
            {/* Floating gradient orbs */}
            <div className="bg-glow-orb absolute -top-32 -right-32 h-96 w-96 bg-amber-300/20 dark:bg-amber-500/10" />
            <div className="bg-glow-orb absolute top-1/3 -left-32 h-80 w-80 bg-orange-300/15 dark:bg-orange-500/8" style={{ animationDelay: '2s' }} />
            <div className="bg-glow-orb absolute bottom-0 right-1/4 h-72 w-72 bg-yellow-300/10 dark:bg-yellow-500/5" style={{ animationDelay: '4s' }} />
            <Head title={title ?? t('app_name')} />
            <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/90 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/80">
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <StoreLogo />
                        <span>{t('app_name')}</span>
                    </Link>
                    <nav className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
                        >
                            {t('home')}
                        </Link>
                        <Link
                            href="/track"
                            className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
                        >
                            {t('order_tracking')}
                        </Link>
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="relative border-amber-500/70 bg-amber-50/80 px-3 text-xs font-semibold text-amber-800 shadow-sm hover:bg-amber-100 dark:border-amber-400/70 dark:bg-transparent dark:text-amber-300 dark:hover:bg-amber-900/30"
                        >
                            <Link href="/cart">
                                <span>{t('view_cart')}</span>
                                {cartCount > 0 && (
                                    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white dark:bg-amber-400">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </Button>
                        {!user && (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium"
                                >
                                    {t('log_in')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm font-medium"
                                >
                                    {t('sign_up')}
                                </Link>
                            </>
                        )}
                        {user && !user.is_admin && (
                            <Link
                                href="/my-orders"
                                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
                            >
                                {t('my_orders')}
                            </Link>
                        )}
                        {user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-neutral-300 bg-white/50 text-xs font-medium dark:border-neutral-700 dark:bg-neutral-900/80"
                                    >
                                        {user.name}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align={
                                        direction === 'rtl' ? 'start' : 'end'
                                    }
                                >
                                    {user.is_admin && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">
                                                {t('dashboard')}
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href={user.is_admin ? '/settings/profile' : '/account'}>
                                            {t('profile')}
                                        </Link>
                                    </DropdownMenuItem>
                                    {!user.is_admin && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/my-orders">
                                                {t('my_orders')}
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={logout()}
                                            method="post"
                                            as="button"
                                        >
                                            {t('log_out')}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <LanguageSwitcher className="w-[140px]" />
                    </nav>
                </div>
            </header>
            <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        </div>
    );
}
