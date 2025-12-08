import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { Link } from '@inertiajs/react';
import { ShoppingBag, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart() {
    const { t } = useLocale();
    const cart = useCart();

    return (
        <StoreLayout title={t('view_cart')}>
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {t('view_cart')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {!cart.hydrated && (
                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                            <p className="mt-4 text-muted-foreground">Loading your cart...</p>
                        </CardContent>
                    </Card>
                )}

                {/* Empty Cart */}
                {cart.hydrated && cart.items.length === 0 && (
                    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                                <ShoppingBag className="h-12 w-12 text-amber-500" />
                            </div>
                            <h2 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">
                                {t('cart_empty_title')}
                            </h2>
                            <p className="mb-6 text-center text-muted-foreground">
                                {t('cart_empty_description')}
                            </p>
                            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                                <Link href="/">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    {t('start_shopping')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Cart Items */}
                {cart.hydrated && cart.items.length > 0 && (
                    <div className="space-y-6">
                        <Card className="overflow-hidden border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-neutral-900/80">
                            <CardHeader className="border-b border-neutral-200/50 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:border-neutral-700/50 dark:from-neutral-800/80 dark:to-neutral-800/50">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ShoppingBag className="h-5 w-5 text-amber-600" />
                                    {t('your_items')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y divide-neutral-200/50 p-0 dark:divide-neutral-700/50">
                                {cart.items.map((item) => (
                                    <div
                                        key={item.meal_id}
                                        className="group flex items-center gap-4 p-4 transition-colors hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
                                    >
                                        {/* Product Image */}
                                        {item.image_url && (
                                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 shadow-md dark:bg-neutral-800">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                        )}
                                        {!item.image_url && (
                                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                                                <ShoppingBag className="h-8 w-8 text-amber-500" />
                                            </div>
                                        )}

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-neutral-900 dark:text-white truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                                {item.price.toFixed(2)} {t('currency_code')}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-full border-neutral-300 hover:bg-amber-100 hover:text-amber-700 dark:border-neutral-600 dark:hover:bg-amber-900/30"
                                                onClick={() => cart.updateQuantity(item.meal_id, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 rounded-full border-neutral-300 hover:bg-amber-100 hover:text-amber-700 dark:border-neutral-600 dark:hover:bg-amber-900/30"
                                                onClick={() => cart.updateQuantity(item.meal_id, item.quantity + 1)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="w-24 text-right">
                                            <p className="font-bold text-neutral-900 dark:text-white">
                                                {(item.quantity * item.price).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{t('currency_code')}</p>
                                        </div>

                                        {/* Remove Button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-neutral-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                            onClick={() => cart.removeItem(item.meal_id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-amber-100">{t('order_total')}</p>
                                        <p className="text-3xl font-bold">
                                            {cart.total.toFixed(2)} {t('currency_code')}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={cart.clear}
                                            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {t('clear_cart')}
                                        </Button>
                                        <Button
                                            asChild
                                            className="bg-white text-amber-600 hover:bg-amber-50"
                                        >
                                            <Link href="/checkout">
                                                {t('checkout')}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
