import { LanguageSwitcher } from '@/components/language-switcher';
import { StoreLogo } from '@/components/store-logo';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';
import { useLocale } from '@/hooks/use-locale';
import { useCart } from '@/hooks/use-cart';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { logout } from '@/routes';
import { Menu, Home, Package, ShoppingCart, LogIn, UserPlus, ClipboardList, User, LayoutDashboard, LogOut } from 'lucide-react';

interface StoreLayoutProps extends PropsWithChildren {
    title?: string;
}

export function StoreLayout({ children, title }: StoreLayoutProps) {
    const { t, direction } = useLocale();
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const cart = useCart();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const cartCount = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cyan-50/70 via-white to-white text-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
            <div className="pointer-events-none absolute inset-0 bg-pattern-dots opacity-60" />
            {/* Floating gradient orbs */}
            <div className="bg-glow-orb absolute -top-32 -right-32 h-96 w-96 bg-[#00a0a3]/20 dark:bg-[#00a0a3]/10" />
            <div className="bg-glow-orb absolute top-1/3 -left-32 h-80 w-80 bg-[#008789]/15 dark:bg-[#008789]/8" style={{ animationDelay: '2s' }} />
            <div className="bg-glow-orb absolute bottom-0 right-1/4 h-72 w-72 bg-cyan-300/10 dark:bg-cyan-500/5" style={{ animationDelay: '4s' }} />
            <Head title={title ?? t('app_name')} />

            <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/90 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/80">
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <StoreLogo />
                        <span className="hidden sm:inline">{t('app_name')}</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-3">
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
                            className="relative border-[#00a0a3]/70 bg-cyan-50/80 px-3 text-xs font-semibold text-[#00a0a3] shadow-sm hover:bg-cyan-100 dark:border-[#00a0a3]/70 dark:bg-transparent dark:text-cyan-300 dark:hover:bg-cyan-900/30"
                        >
                            <Link href="/cart">
                                <span>{t('view_cart')}</span>
                                {cartCount > 0 && (
                                    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#00a0a3] px-1.5 text-[10px] font-bold text-white dark:bg-[#00a0a3]">
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

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Cart button for mobile */}
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="relative border-[#00a0a3]/70 bg-cyan-50/80 px-2 text-xs font-semibold text-[#00a0a3] shadow-sm hover:bg-cyan-100 dark:border-[#00a0a3]/70 dark:bg-transparent dark:text-cyan-300 dark:hover:bg-cyan-900/30"
                        >
                            <Link href="/cart">
                                <ShoppingCart className="h-4 w-4" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[#00a0a3] px-1 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        {/* Hamburger menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(true)}
                            className="p-2"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side={direction === 'rtl' ? 'left' : 'right'} className="w-[280px] p-0">
                    <SheetHeader className="border-b border-neutral-200 dark:border-neutral-800 p-4">
                        <SheetTitle className="flex items-center gap-2">
                            <StoreLogo />
                            <span>{t('app_name')}</span>
                        </SheetTitle>
                    </SheetHeader>

                    <nav className="flex flex-col p-4">
                        {/* Main navigation links */}
                        <SheetClose asChild>
                            <Link
                                href="/"
                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                onClick={closeSidebar}
                            >
                                <Home className="h-5 w-5" />
                                {t('home')}
                            </Link>
                        </SheetClose>

                        <SheetClose asChild>
                            <Link
                                href="/track"
                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                onClick={closeSidebar}
                            >
                                <Package className="h-5 w-5" />
                                {t('order_tracking')}
                            </Link>
                        </SheetClose>

                        <SheetClose asChild>
                            <Link
                                href="/cart"
                                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                onClick={closeSidebar}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {t('view_cart')}
                                {cartCount > 0 && (
                                    <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-[#00a0a3] px-1.5 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </SheetClose>

                        {/* Divider */}
                        <div className="my-3 h-px bg-neutral-200 dark:bg-neutral-800" />

                        {/* Auth links */}
                        {!user && (
                            <>
                                <SheetClose asChild>
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                        onClick={closeSidebar}
                                    >
                                        <LogIn className="h-5 w-5" />
                                        {t('log_in')}
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/register"
                                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                        onClick={closeSidebar}
                                    >
                                        <UserPlus className="h-5 w-5" />
                                        {t('sign_up')}
                                    </Link>
                                </SheetClose>
                            </>
                        )}

                        {/* Logged in user links */}
                        {user && (
                            <>
                                {/* User info */}
                                <div className="flex items-center gap-3 rounded-lg bg-neutral-100 px-3 py-3 dark:bg-neutral-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a0a3] text-white">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="my-3 h-px bg-neutral-200 dark:bg-neutral-800" />

                                {user.is_admin && (
                                    <SheetClose asChild>
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                            onClick={closeSidebar}
                                        >
                                            <LayoutDashboard className="h-5 w-5" />
                                            {t('dashboard')}
                                        </Link>
                                    </SheetClose>
                                )}

                                {!user.is_admin && (
                                    <SheetClose asChild>
                                        <Link
                                            href="/my-orders"
                                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                            onClick={closeSidebar}
                                        >
                                            <ClipboardList className="h-5 w-5" />
                                            {t('my_orders')}
                                        </Link>
                                    </SheetClose>
                                )}

                                <SheetClose asChild>
                                    <Link
                                        href={user.is_admin ? '/settings/profile' : '/account'}
                                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-neutral-700 hover:bg-cyan-50 hover:text-[#00a0a3] dark:text-neutral-200 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-300"
                                        onClick={closeSidebar}
                                    >
                                        <User className="h-5 w-5" />
                                        {t('profile')}
                                    </Link>
                                </SheetClose>

                                <SheetClose asChild>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                        onClick={closeSidebar}
                                    >
                                        <LogOut className="h-5 w-5" />
                                        {t('log_out')}
                                    </Link>
                                </SheetClose>
                            </>
                        )}

                        {/* Divider */}
                        <div className="my-3 h-px bg-neutral-200 dark:bg-neutral-800" />

                        {/* Language Switcher */}
                        <div className="px-3 py-2">
                            <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                {t('language')}
                            </p>
                            <LanguageSwitcher className="w-full" />
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>

            <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        </div>
    );
}
