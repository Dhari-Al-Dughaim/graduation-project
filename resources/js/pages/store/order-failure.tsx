import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { Link } from '@inertiajs/react';
import {
    XCircle,
    CreditCard,
    RefreshCw,
    Home,
    HelpCircle,
    AlertTriangle
} from 'lucide-react';

type Order = {
    id: number;
    order_number: string;
    total?: number | string;
};

export default function OrderFailure({ order, errorMessage }: { order: Order; errorMessage?: string }) {
    const { t } = useLocale();

    return (
        <StoreLayout title={t('order_failure')}>
            <div className="mx-auto max-w-lg">
                {/* Failure Header */}
                <div className="mb-8 text-center">
                    <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                        {/* Animated rings */}
                        <div className="absolute inset-0 animate-pulse rounded-full bg-red-400/20" />
                        <div className="absolute inset-2 rounded-full bg-red-400/30" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-500/30">
                            <XCircle className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        {t('payment_failed')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {t('payment_not_completed')}
                    </p>
                </div>

                {/* Error Info Card */}
                <Card className="mb-6 overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                    {/* Order Number Banner */}
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-red-100">{t('order_number')}</p>
                                <p className="text-xl font-bold">#{order.order_number}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-6">
                        {/* Error Message */}
                        {errorMessage && (
                            <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                    <XCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-red-800 dark:text-red-300">
                                        {t('error_details')}
                                    </p>
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* What to do next */}
                        <div className="mb-6">
                            <h3 className="mb-3 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                <HelpCircle className="h-5 w-5 text-[#00a0a3]" />
                                {t('what_to_do_next')}
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-[#00a0a3] dark:bg-cyan-900/30 dark:text-cyan-400">
                                        1
                                    </span>
                                    {t('check_card_details')}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-[#00a0a3] dark:bg-cyan-900/30 dark:text-cyan-400">
                                        2
                                    </span>
                                    {t('ensure_sufficient_funds')}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-[#00a0a3] dark:bg-cyan-900/30 dark:text-cyan-400">
                                        3
                                    </span>
                                    {t('try_different_payment')}
                                </li>
                            </ul>
                        </div>

                        {/* Total if available */}
                        {order.total && (
                            <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {t('amount_to_pay')}
                                </span>
                                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                                    {Number(order.total).toFixed(2)} {t('currency_code')}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-[#00a0a3] to-cyan-600 py-6 text-base font-semibold text-white shadow-lg hover:from-[#00a0a3] hover:to-cyan-700"
                    >
                        <Link href={`/orders/${order.id}/payment`}>
                            <RefreshCw className="mr-2 h-5 w-5" />
                            {t('try_again')}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1 border-neutral-300 py-6 text-base dark:border-neutral-600"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            {t('back_to_home')}
                        </Link>
                    </Button>
                </div>

                {/* Help Text */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    {t('need_help_contact_support')}
                </p>
            </div>
        </StoreLayout>
    );
}
