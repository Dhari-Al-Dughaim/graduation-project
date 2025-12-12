import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type InvoiceItem = {
    id: number;
    quantity: number;
    unit_price: number | string;
    total: number | string;
    meal: { name?: string | null } | null;
};

type InvoiceOrder = {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total: number | string;
    currency: string;
    created_at: string;
    customer?: {
        name: string;
        phone?: string | null;
        email?: string | null;
    } | null;
    items: InvoiceItem[];
};

export default function AdminOrderInvoice({ order }: { order: InvoiceOrder }) {
    const total = Number(order.total);

    return (
        <AppLayout>
            <Head title={`Invoice #${order.order_number}`} />
            <Card>
                <CardHeader>
                    <CardTitle>Invoice #{order.order_number}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="font-semibold">
                                Ai Powered Restaurant
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Status: {order.status} · Payment:{' '}
                                {order.payment_status}
                            </p>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            <p>Created at</p>
                            <p className="font-medium text-neutral-700 dark:text-neutral-200">
                                {order.created_at}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-lg border border-neutral-200 bg-neutral-50/70 p-3 md:grid-cols-2 dark:border-neutral-700 dark:bg-neutral-900/60">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                Customer
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {order.customer?.name ?? 'Guest'}
                            </p>
                            {order.customer?.email && (
                                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                                    {order.customer.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                                Total
                            </p>
                            <p className="mt-1 text-sm">
                                {total.toFixed(2)} KWD
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <table className="min-w-full divide-y divide-neutral-200 text-xs dark:divide-neutral-700">
                            <thead className="bg-neutral-50/80 dark:bg-neutral-900/60">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium text-neutral-600 dark:text-neutral-300">
                                        Item
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium text-neutral-600 dark:text-neutral-300">
                                        Qty
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium text-neutral-600 dark:text-neutral-300">
                                        Unit
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium text-neutral-600 dark:text-neutral-300">
                                        Line total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 bg-white/80 dark:divide-neutral-800 dark:bg-neutral-900/60">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-3 py-2 text-left">
                                            {item.meal?.name ?? 'Item'}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            {item.quantity}
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            {Number(item.unit_price).toFixed(2)}{' '}
                                            KWD
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            {Number(item.total).toFixed(2)} KWD
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-neutral-50/90 dark:bg-neutral-900">
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-3 py-2 text-right text-xs font-medium text-neutral-600 dark:text-neutral-300"
                                    >
                                        Total
                                    </td>
                                    <td className="px-3 py-2 text-right text-sm font-semibold">
                                        {total.toFixed(2)} KWD
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                        >
                            Print invoice
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
