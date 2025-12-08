import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';

const statusOptions = [
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
];

const paymentOptions = ['unpaid', 'pending', 'paid', 'failed'];

type Order = {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total: string;
};

export default function OrderShow({ order }: { order: Order }) {
    const form = useForm({
        status: order.status,
        payment_status: order.payment_status,
        delivery_eta_minutes: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.patch(`/admin/orders/${order.id}/status`);
    };

    return (
        <AppLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Order #{order.order_number}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span>Status</span>
                        <span className="font-semibold">{order.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Payment</span>
                        <span className="font-semibold">{order.payment_status}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Total</span>
                        <span className="font-semibold">
                            {order.total} KWD
                        </span>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={submit} className="mt-6 space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            className="w-full rounded border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payment_status">Payment</Label>
                        <select
                            id="payment_status"
                            className="w-full rounded border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
                            value={form.data.payment_status}
                            onChange={(e) => form.setData('payment_status', e.target.value)}
                        >
                            {paymentOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="delivery_eta_minutes">ETA (minutes)</Label>
                        <Input
                            id="delivery_eta_minutes"
                            type="number"
                            min={0}
                            value={form.data.delivery_eta_minutes}
                            onChange={(e) => form.setData('delivery_eta_minutes', e.target.value)}
                        />
                    </div>
                </div>
                <CardFooter className="px-0">
                    <Button type="submit" disabled={form.processing}>
                        Update status
                    </Button>
                </CardFooter>
            </form>
        </AppLayout>
    );
}
