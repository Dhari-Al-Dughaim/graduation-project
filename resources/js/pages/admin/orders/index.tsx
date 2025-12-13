import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

type OrderListItem = {
    id: number;
    order_number: string;
    customer: { name: string; locale: string };
    status: string;
    payment_status: string;
    total: string;
    created_at: string;
};

export default function OrdersIndex({ orders }: { orders: { data: OrderListItem[] } }) {
    return (
        <AppLayout>
            <Head title="Orders" />
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {orders.data?.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800"
                        >
                            <div>
                                <div className="text-sm font-semibold">
                                    <Link href={`/admin/orders/${order.id}`}>
                                        #{order.order_number}
                                    </Link>
                                </div>
                                <div className="text-xs text-neutral-500">
                                    {order.customer.name} — {order.customer.locale}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="rounded bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
                                    {order.status}
                                </span>
                                <span className="rounded bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
                                    {order.payment_status}
                                </span>
                                <span className="font-semibold">
                                    {order.total} KWD
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-cyan-300 text-xs font-medium text-[#008789] hover:bg-cyan-50 dark:border-[#00a0a3]/60 dark:text-cyan-300 dark:hover:bg-cyan-900/40"
                                    onClick={() =>
                                        router.patch(
                                            `/admin/orders/${order.id}/status`,
                                            {
                                                status:
                                                    order.status === 'pending'
                                                        ? 'confirmed'
                                                        : order.status ===
                                                            'confirmed'
                                                          ? 'preparing'
                                                          : order.status ===
                                                              'preparing'
                                                            ? 'out_for_delivery'
                                                            : order.status ===
                                                                'out_for_delivery'
                                                              ? 'delivered'
                                                              : 'delivered',
                                            },
                                        )
                                    }
                                >
                                    Advance status
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
