export function StoreLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex h-10 w-10 items-center justify-center">
                <img src="/logo.png" alt="" className="h-full w-full" />
            </div>
        </div>
    );
}
