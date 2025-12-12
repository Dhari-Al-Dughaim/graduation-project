import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useCart } from '@/hooks/use-cart';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { type SharedData } from '@/types';
import { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import {
    User,
    Phone,
    Mail,
    MessageCircle,
    MapPin,
    Building2,
    FileText,
    ShoppingBag,
    CreditCard,
    Lock,
    CheckCircle2
} from 'lucide-react';

type MealOption = {
    id: number;
    name: string;
    price: number;
    image_url?: string | null;
};

export default function Checkout({ meals = [] }: { meals: MealOption[] }) {
    const { t, locale } = useLocale();
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const cart = useCart();
    const form = useForm({
        customer: {
            name: user?.name ?? '',
            phone: user?.mobile ?? '',
            email: user?.email ?? '',
            whatsapp_number: user?.mobile ?? '',
            locale,
        },
        delivery_address: '',
        delivery_city: '',
        delivery_notes: '',
        items:
            cart.items.length > 0
                ? cart.items.map((item) => ({
                      meal_id: item.meal_id,
                      quantity: item.quantity,
                  }))
                : [{ meal_id: meals[0]?.id ?? null, quantity: 1 }],
    });

    useEffect(() => {
        if (cart.items.length) {
            form.setData(
                'items',
                cart.items.map((item) => ({
                    meal_id: item.meal_id,
                    quantity: item.quantity,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart.items.length]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/checkout', {
            onSuccess: () => cart.clear(),
        });
    };

    const orderItemsWithMeal = (form.data.items as any[]).map((item) => ({
        ...item,
        meal: meals.find((meal) => meal.id === item.meal_id),
    }));

    const orderTotal = orderItemsWithMeal.reduce(
        (sum, item) =>
            item.meal ? sum + item.quantity * Number(item.meal.price ?? 0) : sum,
        0,
    );

    return (
        <StoreLayout title={t('checkout')}>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {t('checkout')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('complete_your_order')}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid gap-8 lg:grid-cols-5">
                        {/* Customer Information - Left Column */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Contact Information */}
                            <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                                <CardHeader className="border-b border-neutral-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:border-neutral-700/50 dark:from-neutral-800/80 dark:to-neutral-800/50">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="h-5 w-5 text-amber-600" />
                                        {t('contact_information')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-5 p-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer.name" className="flex items-center gap-2 text-sm font-medium">
                                            <User className="h-4 w-4 text-amber-500" />
                                            {t('name')}
                                        </Label>
                                        <Input
                                            id="customer.name"
                                            value={form.data.customer.name}
                                            onChange={(e) =>
                                                form.setData('customer', {
                                                    ...form.data.customer,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="border-neutral-300 bg-white/50 focus:border-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-800/50"
                                            placeholder={t('enter_your_name')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer.phone" className="flex items-center gap-2 text-sm font-medium">
                                            <Phone className="h-4 w-4 text-amber-500" />
                                            {t('phone')}
                                        </Label>
                                        <Input
                                            id="customer.phone"
                                            value={form.data.customer.phone}
                                            onChange={(e) =>
                                                form.setData('customer', {
                                                    ...form.data.customer,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="border-neutral-300 bg-white/50 focus:border-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-800/50"
                                            placeholder="+965 XXXX XXXX"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer.email" className="flex items-center gap-2 text-sm font-medium">
                                            <Mail className="h-4 w-4 text-amber-500" />
                                            {t('email_address')}
                                        </Label>
                                        <Input
                                            id="customer.email"
                                            type="email"
                                            value={form.data.customer.email}
                                            onChange={(e) =>
                                                form.setData('customer', {
                                                    ...form.data.customer,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="border-neutral-300 bg-white/50 focus:border-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-800/50"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customer.whatsapp" className="flex items-center gap-2 text-sm font-medium">
                                            <MessageCircle className="h-4 w-4 text-green-500" />
                                            {t('whatsapp_number')}
                                        </Label>
                                        <Input
                                            id="customer.whatsapp"
                                            value={form.data.customer.whatsapp_number}
                                            onChange={(e) =>
                                                form.setData('customer', {
                                                    ...form.data.customer,
                                                    whatsapp_number: e.target.value,
                                                })
                                            }
                                            className="border-neutral-300 bg-white/50 focus:border-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-800/50"
                                            placeholder="+965 XXXX XXXX"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Delivery Information */}
                            <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                                <CardHeader className="border-b border-neutral-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:border-neutral-700/50 dark:from-neutral-800/80 dark:to-neutral-800/50">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <MapPin className="h-5 w-5 text-amber-600" />
                                        {t('delivery_information')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-5 p-6 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="delivery_address" className="flex items-center gap-2 text-sm font-medium">
                                            <MapPin className="h-4 w-4 text-amber-500" />
                                            {t('address')}
                                        </Label>
                                        <Input
                                            id="delivery_address"
                                            value={form.data.delivery_address}
                                            onChange={(e) => form.setData('delivery_address', e.target.value)}
                                            className="border-neutral-300 bg-white/50 focus:border-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-800/50"
                                            placeholder={t('enter_your_address')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery_city" className="flex items-center gap-2 text-sm font-medium">
                                            <Building2 className="h-4 w-4 text-amber-500" />
                                            {t('city')}
                                        </Label>
                                        <Input
                                            id="delivery_city"
                                            value={form.data.delivery_city}
                                            onChange={(e) => form.setData('delivery_city', e.target.value)}
                                            className="border-neutral-300 bg-white/50 focus:border-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-800/50"
                                            placeholder={t('enter_city')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery_notes" className="flex items-center gap-2 text-sm font-medium">
                                            <FileText className="h-4 w-4 text-amber-500" />
                                            {t('notes')}
                                        </Label>
                                        <Input
                                            id="delivery_notes"
                                            value={form.data.delivery_notes}
                                            onChange={(e) => form.setData('delivery_notes', e.target.value)}
                                            className="border-neutral-300 bg-white/50 focus:border-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-800/50"
                                            placeholder={t('special_instructions')}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary - Right Column */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 space-y-6">
                                {orderItemsWithMeal.length > 0 && (
                                    <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                                        <CardHeader className="border-b border-neutral-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:border-neutral-700/50 dark:from-neutral-800/80 dark:to-neutral-800/50">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <ShoppingBag className="h-5 w-5 text-amber-600" />
                                                {t('order_summary')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="divide-y divide-neutral-200/50 p-0 dark:divide-neutral-700/50">
                                            {orderItemsWithMeal.map((item, index) =>
                                                item.meal ? (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4 p-4"
                                                    >
                                                        {item.meal.image_url && (
                                                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-md dark:bg-neutral-800">
                                                                <img
                                                                    src={item.meal.image_url}
                                                                    alt={item.meal.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        {!item.meal.image_url && (
                                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                                                                <ShoppingBag className="h-6 w-6 text-amber-500" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-neutral-900 dark:text-white truncate">
                                                                {item.meal.name}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                                                                    x{item.quantity}
                                                                </span>
                                                                <span>@ {Number(item.meal.price).toFixed(2)} {t('currency_code')}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-neutral-900 dark:text-white">
                                                                {(item.quantity * item.meal.price).toFixed(2)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{t('currency_code')}</p>
                                                        </div>
                                                    </div>
                                                ) : null,
                                            )}
                                        </CardContent>
                                        <CardFooter className="flex flex-col gap-4 border-t border-neutral-200/50 bg-neutral-50/50 p-6 dark:border-neutral-700/50 dark:bg-neutral-800/30">
                                            <div className="flex w-full items-center justify-between">
                                                <span className="text-lg font-medium text-muted-foreground">
                                                    {t('order_total')}
                                                </span>
                                                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                    {orderTotal.toFixed(2)} {t('currency_code')}
                                                </span>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={form.processing}
                                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
                                            >
                                                {form.processing ? (
                                                    <>
                                                        <Spinner className="mr-2 h-5 w-5" />
                                                        {t('placing_order')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="mr-2 h-5 w-5" />
                                                        {t('pay_now')} — {orderTotal.toFixed(2)} {t('currency_code')}
                                                    </>
                                                )}
                                            </Button>

                                            {/* Security Badge */}
                                            <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                <Lock className="h-4 w-4" />
                                                <span>{t('secure_checkout')}</span>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                )}

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200/50 bg-white/50 p-3 dark:border-neutral-700/50 dark:bg-neutral-800/50">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="text-xs text-muted-foreground">{t('fast_delivery')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-lg border border-neutral-200/50 bg-white/50 p-3 dark:border-neutral-700/50 dark:bg-neutral-800/50">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="text-xs text-muted-foreground">{t('fresh_ingredients')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Loading Overlay */}
                {form.processing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl dark:bg-neutral-900">
                            <div className="relative">
                                <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
                                <ShoppingBag className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-amber-500" />
                            </div>
                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                {t('sending_burger_order')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t('please_wait')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
