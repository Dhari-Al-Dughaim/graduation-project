import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useToast } from '@/components/toast-provider';
import { useCart } from '@/hooks/use-cart';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

type Meal = {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    category: string | null;
    price: number;
    image_url?: string | null;
};

// Skeleton loader for meal cards
function MealCardSkeleton() {
    return (
        <Card className="flex h-full flex-col overflow-hidden border border-neutral-200/80 bg-white/90 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/90">
            <CardHeader>
                <div className="skeleton h-6 w-3/4 mb-2" />
                <div className="skeleton h-4 w-1/4" />
            </CardHeader>
            <div className="h-40 w-full px-4 pb-1">
                <div className="skeleton h-full w-full rounded-xl" />
            </div>
            <CardContent className="grow">
                <div className="space-y-2">
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-2/3" />
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2">
                <div className="skeleton h-6 w-20" />
                <div className="skeleton h-9 w-24" />
            </CardFooter>
        </Card>
    );
}

export default function Home({ meals = [], locale }: { meals: Meal[]; locale: string }) {
    const { t } = useLocale();
    const cart = useCart();
    const { show } = useToast();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Small delay to show loading animation
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <StoreLayout title={t('customer_portal')}>
            <Head title={t('customer_portal')} />

            {/* Hero Section with animation */}
            <section className="animate-fade-in-up mb-8 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-r from-white via-amber-50/60 to-amber-100/70 shadow-sm dark:border-neutral-800 dark:bg-gradient-to-r dark:from-neutral-900 dark:via-neutral-900/80 dark:to-neutral-950">
                <div className="relative px-6 py-6 md:px-10 md:py-8">
                    <PlaceholderPattern className="pointer-events-none absolute -right-10 -top-8 h-40 w-56 text-amber-200/80 mix-blend-multiply dark:text-amber-500/40" />
                    <PlaceholderPattern className="pointer-events-none absolute -left-16 bottom-0 h-32 w-40 text-amber-100/80 mix-blend-multiply dark:text-amber-500/25" />
                    <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="animate-fade-in text-xs font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
                                {t('app_name')}
                            </p>
                            <h1 className="animate-fade-in-up animation-delay-100 mt-1 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                                {t('cta_start_order')}
                            </h1>
                            <p className="animate-fade-in-up animation-delay-200 mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-300">
                                {t('hero_subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meals Grid with staggered animations */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {!isLoaded ? (
                    // Show skeleton loaders while loading
                    Array.from({ length: 6 }).map((_, index) => (
                        <MealCardSkeleton key={index} />
                    ))
                ) : (
                    meals.map((meal, index) => (
                        <Card
                            key={meal.id}
                            className="group flex h-full flex-col overflow-hidden border border-neutral-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-amber-500/40 opacity-0 animate-fade-in-up"
                            style={{
                                animationDelay: `${150 + index * 100}ms`,
                                animationFillMode: 'forwards'
                            }}
                        >
                            <CardHeader>
                                <CardTitle className="text-lg transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                                    {meal.name}
                                </CardTitle>
                                {meal.category && (
                                    <CardDescription className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                                        {meal.category}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            {meal.image_url && (
                                <div className="h-40 w-full overflow-hidden px-4 pb-1">
                                    <img
                                        src={meal.image_url}
                                        alt={meal.name}
                                        className="h-full w-full rounded-xl object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardContent className="grow">
                                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                    {meal.description}
                                </p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between gap-2">
                                <span className="text-base font-semibold">
                                    {meal.price.toFixed(2)} {t('currency_code')}
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                                    onClick={() => {
                                        cart.addItem({
                                            meal_id: meal.id,
                                            name: meal.name,
                                            price: meal.price,
                                            quantity: 1,
                                        });
                                        show({
                                            title: 'Added to cart',
                                            description: `${meal.name} has been added to your order.`,
                                            variant: 'success',
                                        });
                                    }}
                                >
                                    {t('add_to_cart')}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </section>
        </StoreLayout>
    );
}
