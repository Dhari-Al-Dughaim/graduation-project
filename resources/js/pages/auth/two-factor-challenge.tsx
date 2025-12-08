import AuthLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';

export default function TwoFactorChallenge() {
    return (
        <AuthLayout
            title="Two-Factor Disabled"
            description="Login uses email and password only."
        >
            <Head title="Two-Factor Disabled" />
            <div className="space-y-4 text-center text-sm text-neutral-600 dark:text-neutral-300">
                <p>Two-factor authentication is turned off in this app.</p>
                <Link
                    href="/login"
                    className="text-foreground underline underline-offset-4"
                >
                    Go to login
                </Link>
            </div>
        </AuthLayout>
    );
}
