import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { Head, Link } from '@inertiajs/react';
import {
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    ChefHat,
    Receipt,
    MapPin,
    CreditCard,
    ShoppingBag,
    ArrowRight,
    Calendar
} from 'lucide-react';

type OrderListItem = {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total: number | string;
    currency: string;
    created_at: string;
    items_count?: number;
};

const statusConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; textColor: string; label: string; labelAr: string }> = {
    pending: { icon: Clock, color: 'border-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', textColor: 'text-yellow-600 dark:text-yellow-400', label: 'Pending', labelAr: 'قيد الانتظار' },
    confirmed: { icon: CheckCircle2, color: 'border-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-400', label: 'Confirmed', labelAr: 'تم التأكيد' },
    preparing: { icon: ChefHat, color: 'border-cyan-600', bgColor: 'bg-teal-100 dark:bg-teal-900/30', textColor: 'text-cyan-700 dark:text-cyan-500', label: 'Preparing', labelAr: 'جاري التحضير' },
    ready: { icon: Package, color: 'border-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600 dark:text-purple-400', label: 'Ready', labelAr: 'جاهز' },
    out_for_delivery: { icon: Truck, color: 'border-indigo-500', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', textColor: 'text-indigo-600 dark:text-indigo-400', label: 'Out for Delivery', labelAr: 'في الطريق' },
    delivered: { icon: CheckCircle2, color: 'border-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600 dark:text-green-400', label: 'Delivered', labelAr: 'تم التوصيل' },
    cancelled: { icon: XCircle, color: 'border-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-600 dark:text-red-400', label: 'Cancelled', labelAr: 'ملغي' },
};

const paymentStatusConfig: Record<string, { bgColor: string; textColor: string; label: string; labelAr: string }> = {
    pending: { bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', textColor: 'text-yellow-700 dark:text-yellow-300', label: 'Pending', labelAr: 'قيد الانتظار' },
    paid: { bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-700 dark:text-green-300', label: 'Paid', labelAr: 'مدفوع' },
    failed: { bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-300', label: 'Failed', labelAr: 'فشل' },
    refunded: { bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-700 dark:text-purple-300', label: 'Refunded', labelAr: 'مسترد' },
};

export default function MyOrders({ orders }: { orders: { data: OrderListItem[] } }) {
    const { t, locale } = useLocale();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-KW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusInfo = (status: string) => {
        return statusConfig[status] || statusConfig.pending;
    };

    const getPaymentStatusInfo = (status: string) => {
        return paymentStatusConfig[status] || paymentStatusConfig.pending;
    };

    return (
        <StoreLayout title={t('my_orders')}>
            <Head title={t('my_orders')} />

            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-100 dark:bg-cyan-900/30" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-[#00a0a3]/30">
                            <ShoppingBag className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        {t('my_orders')}
                    </h1>
                    <p className="text-muted-foreground">
                        {locale === 'ar' ? 'تتبع وإدارة جميع طلباتك' : 'Track and manage all your orders'}
                    </p>
                </div>

                {/* Empty State */}
                {orders.data?.length === 0 && (
                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Package className="h-12 w-12 text-neutral-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">
                                {locale === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                            </h3>
                            <p className="mb-6 text-center text-muted-foreground">
                                {locale === 'ar'
                                    ? 'ابدأ بتصفح قائمتنا الشهية واطلب وجبتك المفضلة!'
                                    : 'Start browsing our delicious menu and place your first order!'}
                            </p>
                            <Button asChild className="bg-gradient-to-r from-[#00a0a3] to-cyan-600 text-white shadow-lg hover:from-[#00a0a3] hover:to-cyan-700">
                                <Link href="/">
                                    {t('start_shopping')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Orders List */}
                {orders.data?.length > 0 && (
                    <div className="space-y-4">
                        {orders.data?.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            const paymentInfo = getPaymentStatusInfo(order.payment_status);
                            const StatusIcon = statusInfo.icon;

                            return (
                                <Card
                                    key={order.id}
                                    className={`overflow-hidden border-0 border-l-4 ${statusInfo.color} bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:bg-neutral-900/80`}
                                >
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Order Info Section */}
                                            <div className="flex-1 p-5">
                                                <div className="mb-4 flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-neutral-900 dark:text-white">
                                                                #{order.order_number}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(order.created_at)}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-[#00a0a3] dark:text-cyan-400">
                                                            {Number(order.total).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">{t('currency_code')}</p>
                                                    </div>
                                                </div>

                                                {/* Status Badges */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {/* Order Status */}
                                                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${statusInfo.bgColor}`}>
                                                        <StatusIcon className={`h-4 w-4 ${statusInfo.textColor}`} />
                                                        <span className={`text-sm font-medium ${statusInfo.textColor}`}>
                                                            {locale === 'ar' ? statusInfo.labelAr : statusInfo.label}
                                                        </span>
                                                    </div>

                                                    {/* Payment Status */}
                                                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${paymentInfo.bgColor}`}>
                                                        <CreditCard className={`h-4 w-4 ${paymentInfo.textColor}`} />
                                                        <span className={`text-sm font-medium ${paymentInfo.textColor}`}>
                                                            {locale === 'ar' ? paymentInfo.labelAr : paymentInfo.label}
                                                        </span>
                                                    </div>

                                                    {/* Items Count */}
                                                    {order.items_count && (
                                                        <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 dark:bg-neutral-800">
                                                            <Package className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                                {order.items_count} {locale === 'ar' ? 'عناصر' : 'items'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions Section */}
                                            <div className="flex flex-row items-center gap-2 border-t border-neutral-200/50 bg-neutral-50/50 p-4 dark:border-neutral-700/50 dark:bg-neutral-800/30 md:flex-col md:justify-center md:border-l md:border-t-0">
                                                <Button
                                                    asChild
                                                    className="flex-1 bg-gradient-to-r from-[#00a0a3] to-cyan-600 text-white shadow hover:from-[#00a0a3] hover:to-cyan-700 md:w-full md:flex-none"
                                                >
                                                    <Link href={`/orders/${order.id}/track`}>
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        {t('track_order')}
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="flex-1 border-neutral-300 dark:border-neutral-600 md:w-full md:flex-none"
                                                >
                                                    <Link href={`/orders/${order.id}/invoice`}>
                                                        <Receipt className="mr-2 h-4 w-4" />
                                                        {t('invoice')}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Help Text */}
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    {t('need_help_contact_support')}
                </p>
            </div>
        </StoreLayout>
    );
}
