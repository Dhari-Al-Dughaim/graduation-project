import { useLocale } from '@/hooks/use-locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe2 } from 'lucide-react';

interface LanguageSwitcherProps {
    className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const { locale, availableLocales, switchLocale, t } = useLocale();

    return (
        <Select value={locale} onValueChange={switchLocale}>
            <SelectTrigger className={className}>
                <div className="flex items-center gap-2">
                    <Globe2 className="size-4 opacity-70" />
                    <SelectValue placeholder={t('language')} />
                </div>
            </SelectTrigger>
            <SelectContent align="end">
                {availableLocales.map((code) => (
                    <SelectItem key={code} value={code}>
                        {code === 'ar' ? t('arabic') : t('english')}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
