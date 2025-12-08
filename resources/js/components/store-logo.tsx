export function StoreLogo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex h-10 w-10 items-center justify-center">
                <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full drop-shadow-md"
                >
                    {/* Background circle with gradient */}
                    <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F59E0B" />
                            <stop offset="50%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                        <linearGradient id="bunTop" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FCD34D" />
                            <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                        <linearGradient id="bunBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="patty" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#78350F" />
                            <stop offset="100%" stopColor="#451A03" />
                        </linearGradient>
                        <linearGradient id="lettuce" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4ADE80" />
                            <stop offset="100%" stopColor="#22C55E" />
                        </linearGradient>
                        <linearGradient id="cheese" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FDE047" />
                            <stop offset="100%" stopColor="#FACC15" />
                        </linearGradient>
                    </defs>

                    {/* Outer ring */}
                    <circle cx="24" cy="24" r="23" fill="url(#bgGradient)" />
                    <circle cx="24" cy="24" r="21" fill="#FFFBEB" className="dark:fill-neutral-900" />

                    {/* Top bun */}
                    <path
                        d="M12 22C12 16 16 12 24 12C32 12 36 16 36 22H12Z"
                        fill="url(#bunTop)"
                    />
                    {/* Sesame seeds */}
                    <ellipse cx="18" cy="16" rx="1.5" ry="1" fill="#FEFCE8" />
                    <ellipse cx="24" cy="14" rx="1.5" ry="1" fill="#FEFCE8" />
                    <ellipse cx="30" cy="16" rx="1.5" ry="1" fill="#FEFCE8" />
                    <ellipse cx="21" cy="18" rx="1.5" ry="1" fill="#FEFCE8" />
                    <ellipse cx="27" cy="18" rx="1.5" ry="1" fill="#FEFCE8" />

                    {/* Lettuce layer */}
                    <path
                        d="M10 24C10 24 12 22 14 24C16 26 18 22 20 24C22 26 24 22 26 24C28 26 30 22 32 24C34 26 36 22 38 24V26H10V24Z"
                        fill="url(#lettuce)"
                    />

                    {/* Cheese layer */}
                    <path
                        d="M11 26H37V28L35 30H33L31 28H29L27 30H25L23 28H21L19 30H17L15 28H13L11 30V26Z"
                        fill="url(#cheese)"
                    />

                    {/* Patty */}
                    <rect x="11" y="29" width="26" height="5" rx="2" fill="url(#patty)" />

                    {/* Bottom bun */}
                    <path
                        d="M12 34H36C36 34 36 38 24 38C12 38 12 34 12 34Z"
                        fill="url(#bunBottom)"
                    />
                </svg>
            </div>
        </div>
    );
}

