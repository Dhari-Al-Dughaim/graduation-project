import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Package,
    MapPin,
    CreditCard,
    Clock,
    ArrowRight,
    Home,
    Receipt,
    ShoppingBag
} from 'lucide-react';

type OrderItem = {
    id: number;
    quantity: number;
    unit_price: number | string;
    meal: {
        name?: string;
        name_en?: string;
        name_ar?: string;
        image_url?: string;
    };
};

type Payment = {
    id: number;
    amount: number | string;
    status: string;
    reference?: string;
    method?: string;
};

type Customer = {
    name: string;
    email?: string;
    phone?: string;
};

type Order = {
    id: number;
    order_number: string;
    total: number | string;
    status: string;
    payment_status: string;
    delivery_address?: string;
    delivery_city?: string;
    created_at: string;
    items?: OrderItem[];
    payment?: Payment;
    customer?: Customer;
};

export default function OrderSuccess({ order }: { order: Order }) {
    const { t, locale } = useLocale();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-KW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMealName = (meal: OrderItem['meal']) => {
        if (locale === 'ar' && meal.name_ar) return meal.name_ar;
        if (meal.name_en) return meal.name_en;
        return meal.name || 'Item';
    };

    return (
        <StoreLayout title={t('order_success')}>
            <div className="mx-auto max-w-2xl">
                {/* Success Header */}
                <div className="mb-8 text-center">
                    <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                        {/* Animated rings */}
                        <div className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
                        <div className="absolute inset-2 animate-pulse rounded-full bg-green-400/40" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        {t('payment_successful')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {t('thank_you_for_order')}
                    </p>
                </div>

                {/* Order Info Card */}
                <Card className="mb-6 overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                    {/* Order Number Banner */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-100">{t('order_number')}</p>
                                <p className="text-xl font-bold">#{order.order_number}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                <Receipt className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-6">
                        {/* Order Details Grid */}
                        <div className="mb-6 grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('order_date')}</p>
                                    <p className="font-medium text-neutral-900 dark:text-white">
                                        {formatDate(order.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('payment_status')}</p>
                                    <p className="font-medium text-green-600 dark:text-green-400">
                                        {t('paid')}
                                    </p>
                                </div>
                            </div>

                            {order.delivery_address && (
                                <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50 sm:col-span-2">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('delivery_address')}</p>
                                        <p className="font-medium text-neutral-900 dark:text-white">
                                            {order.delivery_address}
                                            {order.delivery_city && `, ${order.delivery_city}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                            <div className="mb-6">
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                    <ShoppingBag className="h-5 w-5 text-amber-500" />
                                    {t('order_items')}
                                </h3>
                                <div className="divide-y divide-neutral-200/50 rounded-lg border border-neutral-200/50 dark:divide-neutral-700/50 dark:border-neutral-700/50">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-3">
                                            {item.meal?.image_url && (
                                                <img
                                                    src={item.meal.image_url}
                                                    alt={getMealName(item.meal)}
                                                    className="h-14 w-14 rounded-lg object-cover"
                                                />
                                            )}
                                            {!item.meal?.image_url && (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                                    <Package className="h-6 w-6 text-amber-600" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-neutral-900 dark:text-white">
                                                    {getMealName(item.meal)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    x{item.quantity} @ {Number(item.unit_price).toFixed(2)} {t('currency_code')}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-neutral-900 dark:text-white">
                                                {(item.quantity * Number(item.unit_price)).toFixed(2)} {t('currency_code')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Total */}
                        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20">
                            <span className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                                {t('total')}
                            </span>
                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {Number(order.total).toFixed(2)} {t('currency_code')}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-base font-semibold text-white shadow-lg hover:from-amber-600 hover:to-orange-600"
                    >
                        <Link href={`/orders/${order.id}/track`}>
                            <Package className="mr-2 h-5 w-5" />
                            {t('track_order')}
                            <ArrowRight className="ml-2 h-5 w-5" />
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
                    {t('order_confirmation_sent')}
                </p>
            </div>
        </StoreLayout>
    );
}
