import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/hooks/use-locale';
import { StoreLayout } from '@/layouts/store/layout';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { User, Mail, Calendar } from 'lucide-react';

export default function Profile() {
    const { t } = useLocale();
    const { auth } = usePage<SharedData>().props;
    const user = auth.user!;

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/account');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <StoreLayout title={t('profile')}>
            <Head title={t('profile')} />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* User Info Card */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-2xl font-bold text-white shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <CardTitle className="text-xl">
                                    {user.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" />
                                    {user.email}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {t('member_since')}: {formatDate(user.created_at)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Profile Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {t('edit_profile')}
                        </CardTitle>
                        <CardDescription>
                            {t('update_profile_info')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('name')}</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    autoComplete="name"
                                    placeholder={t('name')}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    autoComplete="email"
                                    placeholder={t('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-amber-600 hover:bg-amber-700"
                                >
                                    {processing ? t('saving') : t('save')}
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out duration-300"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        {t('saved')}
                                    </p>
                                </Transition>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </StoreLayout>
    );
}
