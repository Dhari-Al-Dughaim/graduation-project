import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { CartProvider } from './hooks/use-cart';
import { ToastProvider } from '@/components/toast-provider';
import { PageTransition } from '@/components/page-transition';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ToastProvider>
                    <CartProvider>
                        <PageTransition>
                            <App {...props} />
                        </PageTransition>
                    </CartProvider>
                </ToastProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#F59E0B',
        showSpinner: true,
    },
});

// This will set light / dark mode on load...
initializeTheme();
