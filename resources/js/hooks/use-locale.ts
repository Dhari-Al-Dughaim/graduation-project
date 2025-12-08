import { router, usePage } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import { type SharedData } from '@/types';

export function useLocale() {
    const { locale, direction, availableLocales, translations } =
        usePage<SharedData>().props;

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = direction;
    }, [locale, direction]);

    const t = useMemo(
        () => (key: string, fallback?: string) =>
            translations?.app?.[key] ?? fallback ?? key,
        [translations],
    );

    const switchLocale = (nextLocale: string) => {
        router.post(
            '/locale',
            { locale: nextLocale },
            { preserveScroll: true, preserveState: true },
        );
    };

    return {
        locale,
        direction,
        availableLocales,
        translations,
        t,
        switchLocale,
    };
}
