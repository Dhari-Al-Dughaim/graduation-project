import { router } from '@inertiajs/react';
import { useEffect, useState, type PropsWithChildren } from 'react';

export function PageTransition({ children }: PropsWithChildren) {
    const [transitioning, setTransitioning] = useState(false);
    const [showContent, setShowContent] = useState(true);

    useEffect(() => {
        const handleStart = () => {
            setTransitioning(true);
            setShowContent(false);
        };

        const handleFinish = () => {
            // Small delay before revealing new content
            setTimeout(() => {
                setShowContent(true);
                setTimeout(() => {
                    setTransitioning(false);
                }, 300);
            }, 50);
        };

        const removeStart = router.on('start', handleStart);
        const removeFinish = router.on('finish', handleFinish);

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <>
            {/* Elegant loading overlay with animated gradient */}
            <div
                className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-all duration-300 ${
                    transitioning && !showContent
                        ? 'opacity-100 visible'
                        : 'opacity-0 invisible'
                }`}
            >
                {/* Backdrop blur */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm dark:bg-neutral-950/70" />

                {/* Loading indicator */}
                <div className="relative flex flex-col items-center gap-4">
                    {/* Animated dots */}
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#00a0a3] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#00a0a3] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#00a0a3] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>

            {/* Page content with fade animation */}
            <div
                className={`transition-all duration-300 ease-out ${
                    showContent
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-3'
                }`}
            >
                {children}
            </div>
        </>
    );
}
