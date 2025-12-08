import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useLocale } from '@/hooks/use-locale';
import { Head, Link } from '@inertiajs/react';

type InvoiceListItem = {
    id: number;
    order_number: string;
    customer: { name: string };
    status: string;
    payment_status: string;
    total: number | string;
    currency: string;
    created_at: string;
};

export default function InvoicesIndex({
    orders,
}: {
    orders: { data: InvoiceListItem[] };
}) {
    const { t } = useLocale();

    return (
        <AppLayout>
            <Head title={t('invoice')} />
            <Card>
                <CardHeader>
                    <CardTitle>{t('invoice')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {orders.data?.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-col gap-2 rounded-lg border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-800 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <div className="font-semibold">
                                    #{order.order_number}
                                </div>
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {order.customer.name} · {order.created_at}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium dark:bg-neutral-800">
                                    {order.status}
                                </span>
                                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium dark:bg-neutral-800">
                                    {order.payment_status}
                                </span>
                                <span className="text-sm font-semibold">
                                    {Number(order.total).toFixed(2)} KWD
                                </span>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                >
                                    <Link href={`/admin/orders/${order.id}`}>
                                        Details
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    <Link href={`/admin/orders/${order.id}/invoice`}>
                                        {t('invoice')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </AppLayout>
    );
}

