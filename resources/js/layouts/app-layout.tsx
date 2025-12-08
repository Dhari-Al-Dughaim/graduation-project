import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { useLocale } from '@/hooks/use-locale';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    // Ensure document lang/dir stay in sync for admin views.
    useLocale();

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
