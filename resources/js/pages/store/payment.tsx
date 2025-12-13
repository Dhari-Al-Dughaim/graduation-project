import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useCart } from '@/hooks/use-cart';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type OrderItem = {
    id: number;
    quantity: number;
    unit_price: number | string;
    meal: { name?: string; image_url?: string };
};

type Order = {
    id: number;
    order_number: string;
    total: number | string;
    payment_status: string;
    items: OrderItem[];
};

export default function Payment({ order }: { order: Order }) {
    const { t } = useLocale();
    const cart = useCart();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/api/upayment/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({ order_id: order.id }),
            });

            const data = await response.json();

            if (response.ok && data.paymentUrl) {
                // Clear cart before redirecting
                cart.clear();
                // Redirect to external payment URL using full page navigation
                window.location.href = data.paymentUrl;
            } else {
                setError(data.message || t('payment_error'));
                setProcessing(false);
            }
        } catch (err) {
            setError(t('payment_error'));
            setProcessing(false);
        }
    };

    const total = Number(order.total);

    return (
        <StoreLayout title={t('pay_now')}>
            <div className="mx-auto max-w-lg">
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-neutral-900 dark:to-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a0a3] text-white">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">
                                    {t('pay_now')}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {order.order_number}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-3">
                            {order.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.meal?.image_url && (
                                            <img
                                                src={item.meal.image_url}
                                                alt={item.meal?.name}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {item.meal?.name ?? 'Item'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                x{item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-medium">
                                        {(Number(item.unit_price) * item.quantity).toFixed(2)}{' '}
                                        {t('currency_code')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold">
                            <span>{t('total')}</span>
                            <span className="text-[#00a0a3] dark:text-cyan-400">
                                {total.toFixed(2)} {t('currency_code')}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                            <span>{t('secure_payment_message')}</span>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t bg-neutral-50 p-4 dark:bg-neutral-900">
                        <form onSubmit={submit} className="w-full">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-[#00a0a3] to-cyan-600 font-semibold text-white hover:from-[#00a0a3] hover:to-cyan-700"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2 h-4 w-4" />
                                        {t('redirecting_to_payment')}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        {t('pay_now')} — {total.toFixed(2)} {t('currency_code')}
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </StoreLayout>
    );
}
