import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    ChefHat,
    Clock,
    MapPin,
    Package,
    Search,
    Truck,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

type OrderItem = {
    id: number;
    quantity: number;
    unit_price: string;
    total: string;
    meal: {
        id: number;
        name_en: string;
        name_ar: string;
        image_url?: string | null;
    } | null;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total: string;
    currency: string;
    delivery_address?: string;
    delivery_city?: string;
    created_at: string;
    items: OrderItem[];
    delivery_tracking?: {
        status?: string;
        location?: string | null;
        eta?: string | null;
    } | null;
    customer?: {
        name: string;
        phone?: string;
    } | null;
};

const statusConfig: Record<
    string,
    { icon: React.ElementType; color: string; bgColor: string }
> = {
    pending: {
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    confirmed: {
        icon: CheckCircle2,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    preparing: {
        icon: ChefHat,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    ready: {
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    out_for_delivery: {
        icon: Truck,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    },
    delivered: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    cancelled: {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
};

export default function TrackOrderLookup() {
    const { t, locale } = useLocale();
    const [orderCode, setOrderCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const code = orderCode.trim();
        if (!code) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const response = await fetch('/track/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ order_number: code }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Order not found');
                return;
            }

            setOrder(data.order);
        } catch (err) {
            setError('Failed to fetch order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status: string) => {
        return statusConfig[status] || statusConfig.pending;
    };

    const getMealName = (item: OrderItem) => {
        if (!item.meal) return 'Unknown Item';
        return locale === 'ar' ? item.meal.name_ar : item.meal.name_en;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(
            locale === 'ar' ? 'ar-KW' : 'en-KW',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            },
        );
    };

    const statusInfo = order ? getStatusInfo(order.status) : null;
    const StatusIcon = statusInfo?.icon || Clock;

    return (
        <StoreLayout title={t('order_tracking')}>
            <div className="space-y-6">
                {/* Search Card */}
                <Card className="mx-auto max-w-md border-amber-200/50 bg-white/80 backdrop-blur-sm dark:border-amber-800/30 dark:bg-neutral-900/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-amber-600" />
                            {t('order_tracking')}
                        </CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-3">
                            <label
                                htmlFor="order_id"
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
                            >
                                Order ID
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    id="order_id"
                                    value={orderCode}
                                    onChange={(e) =>
                                        setOrderCode(e.target.value)
                                    }
                                    placeholder="e.g. ORD-5E7"
                                    className="flex-1"
                                />
                                <Button
                                    type="submit"
                                    disabled={!orderCode.trim() || loading}
                                >
                                    {loading ? (
                                        <Spinner className="h-4 w-4" />
                                    ) : (
                                        'Track'
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Use the order number shown on your receipt or
                                confirmation screen.
                            </p>
                        </CardContent>
                    </form>
                </Card>

                {/* Error Message */}
                {error && (
                    <Card className="mx-auto max-w-2xl border-red-200 bg-red-50/80 dark:border-red-800/30 dark:bg-red-900/20">
                        <CardContent className="flex items-center gap-3 py-4">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-sm text-red-700 dark:text-red-400">
                                {error}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Order Results */}
                {order && (
                    <div className="mx-auto max-w-2xl space-y-4">
                        {/* Status Card */}
                        <Card className="overflow-hidden border-0 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg dark:from-neutral-900 dark:to-neutral-800">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        Order #{order.order_number}
                                    </CardTitle>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(order.created_at)}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Status Badge */}
                                <div
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${statusInfo?.bgColor}`}
                                >
                                    <StatusIcon
                                        className={`h-5 w-5 ${statusInfo?.color}`}
                                    />
                                    <span
                                        className={`text-sm font-semibold capitalize ${statusInfo?.color}`}
                                    >
                                        {order.delivery_tracking?.status ||
                                            order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                {/* Tracking Details */}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {order.delivery_tracking?.eta && (
                                        <div className="flex items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-neutral-800/60">
                                            <Clock className="h-4 w-4 text-amber-600" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Estimated Arrival
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {
                                                        order.delivery_tracking
                                                            .eta
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {order.delivery_tracking?.location && (
                                        <div className="flex items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-neutral-800/60">
                                            <MapPin className="h-4 w-4 text-amber-600" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Current Location
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {
                                                        order.delivery_tracking
                                                            .location
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {order.delivery_address && (
                                        <div className="flex items-center gap-2 rounded-lg bg-white/60 p-3 sm:col-span-2 dark:bg-neutral-800/60">
                                            <Truck className="h-4 w-4 text-amber-600" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Delivery Address
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {order.delivery_address}
                                                    {order.delivery_city &&
                                                        `, ${order.delivery_city}`}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card className="border-neutral-200/50 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {t('order_summary')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.meal?.image_url && (
                                                <img
                                                    src={item.meal.image_url}
                                                    alt={getMealName(item)}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {getMealName(item)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                                                        x{item.quantity}
                                                    </span>
                                                    <span className="ml-2">
                                                        @{' '}
                                                        {Number(
                                                            item.unit_price,
                                                        ).toFixed(2)}{' '}
                                                        {t('currency_code')}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {Number(item.total).toFixed(2)}{' '}
                                            {t('currency_code')}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4 border-t pt-4">
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-medium text-muted-foreground">
                                        {t('order_total')}
                                    </span>
                                    <span className="text-lg font-bold text-amber-600">
                                        {Number(order.total).toFixed(2)}{' '}
                                        {t('currency_code')}
                                    </span>
                                </div>
                                <div className="flex w-full gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="flex-1"
                                    >
                                        <Link
                                            href={`/orders/${order.id}/details`}
                                        >
                                            View Details
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="flex-1"
                                    >
                                        <Link
                                            href={`/orders/${order.id}/invoice`}
                                        >
                                            {t('invoice')}
                                        </Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
