import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { Link } from '@inertiajs/react';
import {
    Package,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    ChefHat,
    Receipt,
    CreditCard,
    User,
    Phone,
    Home,
    ShoppingBag,
    FileText,
    Calendar,
    RefreshCw
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
    } | null;
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

type DeliveryTracking = {
    status?: string;
    location?: string | null;
    eta?: string | null;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total: number | string;
    delivery_address?: string;
    delivery_city?: string;
    notes?: string;
    created_at: string;
    items?: OrderItem[];
    payment?: Payment;
    customer?: Customer;
    delivery_tracking?: DeliveryTracking;
};

const statusConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string; labelAr: string }> = {
    pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Pending', labelAr: 'قيد الانتظار' },
    confirmed: { icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: 'Confirmed', labelAr: 'تم التأكيد' },
    preparing: { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', label: 'Preparing', labelAr: 'جاري التحضير' },
    ready: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', label: 'Ready', labelAr: 'جاهز' },
    out_for_delivery: { icon: Truck, color: 'text-indigo-600', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', label: 'Out for Delivery', labelAr: 'في الطريق' },
    delivered: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', label: 'Delivered', labelAr: 'تم التوصيل' },
    cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', label: 'Cancelled', labelAr: 'ملغي' },
};

const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function TrackOrder({ order }: { order: Order }) {
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
        if (!meal) return 'Item';
        if (locale === 'ar' && meal.name_ar) return meal.name_ar;
        if (meal.name_en) return meal.name_en;
        return meal.name || 'Item';
    };

    const getStatusInfo = (status: string) => {
        return statusConfig[status] || statusConfig.pending;
    };

    const getCurrentStatusIndex = () => {
        return statusOrder.indexOf(order.status);
    };

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;
    const currentStatusIndex = getCurrentStatusIndex();
    const isCancelled = order.status === 'cancelled';

    return (
        <StoreLayout title={t('order_tracking')}>
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                        <div className={`absolute inset-0 animate-pulse rounded-full ${statusInfo.bgColor}`} />
                        <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${isCancelled ? 'bg-gradient-to-br from-red-400 to-red-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'} shadow-lg ${isCancelled ? 'shadow-red-500/30' : 'shadow-amber-500/30'}`}>
                            <StatusIcon className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
                        {t('order_tracking')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {locale === 'ar' ? statusInfo.labelAr : statusInfo.label}
                    </p>
                </div>

                {/* Order Number Banner */}
                <Card className="mb-6 overflow-hidden border-0 shadow-xl">
                    <div className={`${isCancelled ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'} px-6 py-4 text-white`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${isCancelled ? 'text-red-100' : 'text-amber-100'}`}>{t('order_number')}</p>
                                <p className="text-2xl font-bold">#{order.order_number}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                <Receipt className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Status Timeline */}
                {!isCancelled && (
                    <Card className="mb-6 border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80">
                        <CardContent className="p-6">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                <RefreshCw className="h-5 w-5 text-amber-500" />
                                {locale === 'ar' ? 'حالة الطلب' : 'Order Progress'}
                            </h3>
                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute top-5 h-1 w-full rounded-full bg-neutral-200 dark:bg-neutral-700" style={{ left: 0, right: 0 }}>
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                        style={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
                                    />
                                </div>
                                {/* Status Steps */}
                                <div className="relative flex justify-between">
                                    {statusOrder.map((status, index) => {
                                        const config = statusConfig[status];
                                        const Icon = config.icon;
                                        const isCompleted = index <= currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;

                                        return (
                                            <div key={status} className="flex flex-col items-center">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                                                        isCompleted
                                                            ? 'border-amber-500 bg-amber-500 text-white'
                                                            : 'border-neutral-300 bg-white text-neutral-400 dark:border-neutral-600 dark:bg-neutral-800'
                                                    } ${isCurrent ? 'ring-4 ring-amber-200 dark:ring-amber-800' : ''}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className={`mt-2 text-xs font-medium ${isCompleted ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-500'}`}>
                                                    {locale === 'ar' ? config.labelAr : config.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Order Info Grid */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    {/* Delivery Info */}
                    {(order.delivery_address || order.delivery_tracking?.eta || order.delivery_tracking?.location) && (
                        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80">
                            <CardContent className="p-6">
                                <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                    <Truck className="h-5 w-5 text-blue-500" />
                                    {t('delivery_information')}
                                </h3>
                                <div className="space-y-3">
                                    {order.delivery_address && (
                                        <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                                            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">{t('delivery_address')}</p>
                                                <p className="font-medium text-neutral-900 dark:text-white">
                                                    {order.delivery_address}
                                                    {order.delivery_city && `, ${order.delivery_city}`}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {order.delivery_tracking?.eta && (
                                        <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                                            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'الوقت المتوقع' : 'Estimated Time'}</p>
                                                <p className="font-medium text-neutral-900 dark:text-white">
                                                    {order.delivery_tracking.eta}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {order.delivery_tracking?.location && (
                                        <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                                            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'الموقع الحالي' : 'Current Location'}</p>
                                                <p className="font-medium text-neutral-900 dark:text-white">
                                                    {order.delivery_tracking.location}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Customer & Order Info */}
                    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80">
                        <CardContent className="p-6">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                <FileText className="h-5 w-5 text-green-500" />
                                {locale === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                                    <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('order_date')}</p>
                                        <p className="font-medium text-neutral-900 dark:text-white">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                                    <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('payment_status')}</p>
                                        <p className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                            {order.payment_status === 'paid' ? t('paid') : order.payment_status}
                                        </p>
                                    </div>
                                </div>
                                {order.customer?.name && (
                                    <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                                        <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('name')}</p>
                                            <p className="font-medium text-neutral-900 dark:text-white">
                                                {order.customer.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {order.customer?.phone && (
                                    <div className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                                        <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('phone')}</p>
                                            <p className="font-medium text-neutral-900 dark:text-white">
                                                {order.customer.phone}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                    <Card className="mb-6 border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80">
                        <CardContent className="p-6">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                <ShoppingBag className="h-5 w-5 text-amber-500" />
                                {t('order_items')}
                            </h3>
                            <div className="divide-y divide-neutral-200/50 rounded-lg border border-neutral-200/50 dark:divide-neutral-700/50 dark:border-neutral-700/50">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4">
                                        {item.meal?.image_url ? (
                                            <img
                                                src={item.meal.image_url}
                                                alt={getMealName(item.meal)}
                                                className="h-16 w-16 rounded-lg object-cover shadow-md"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                                <Package className="h-8 w-8 text-amber-600" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-neutral-900 dark:text-white">
                                                {getMealName(item.meal)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                                                    x{item.quantity}
                                                </span>
                                                <span className="mx-2">@</span>
                                                {Number(item.unit_price).toFixed(2)} {t('currency_code')}
                                            </p>
                                        </div>
                                        <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                                            {(item.quantity * Number(item.unit_price)).toFixed(2)} {t('currency_code')}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20">
                                <span className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
                                    {t('total')}
                                </span>
                                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                    {Number(order.total).toFixed(2)} {t('currency_code')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Notes */}
                {order.notes && (
                    <Card className="mb-6 border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80">
                        <CardContent className="p-6">
                            <h3 className="mb-3 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                                <FileText className="h-5 w-5 text-purple-500" />
                                {t('notes')}
                            </h3>
                            <p className="rounded-lg bg-neutral-50 p-4 text-muted-foreground dark:bg-neutral-800/50">
                                {order.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1 border-neutral-300 py-6 text-base dark:border-neutral-600"
                    >
                        <Link href={`/orders/${order.id}/invoice`}>
                            <Receipt className="mr-2 h-5 w-5" />
                            {t('invoice')}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-base font-semibold text-white shadow-lg hover:from-amber-600 hover:to-orange-600"
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
