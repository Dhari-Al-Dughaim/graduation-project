import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    Clock3,
    ShoppingBag,
    Wallet2,
} from 'lucide-react';
import { type ReactNode } from 'react';

type ChartPoint = {
    label: string;
    value: number;
    status?: string;
    revenue?: number;
};

type DashboardPageProps = SharedData & {
    stats: {
        ordersThisMonth: number;
        revenueThisMonth: number;
        averageOrderValue: number;
        openOrders: number;
        currency: string;
    };
    charts: {
        ordersByDay: ChartPoint[];
        statusBreakdown: ChartPoint[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const statusEmojiMap: Record<string, string> = {
    pending: '🕐',
    confirmed: '✅',
    preparing: '👨‍🍳',
    ready: '📦',
    out_for_delivery: '🛵',
    delivered: '🎉',
    cancelled: '❌',
};

export default function Dashboard() {
    const { stats, charts } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Orders this month"
                        value={stats.ordersThisMonth.toLocaleString()}
                        description="Total orders created since the 1st"
                        icon={<ShoppingBag className="h-5 w-5" />}
                        accent="from-cyan-500/15 via-cyan-500/5 to-transparent"
                    />
                    <StatCard
                        title="Revenue this month"
                        value={formatMoney(stats.revenueThisMonth, stats.currency)}
                        description="Gross revenue of all orders"
                        icon={<Wallet2 className="h-5 w-5" />}
                        accent="from-emerald-500/15 via-emerald-500/5 to-transparent"
                    />
                    <StatCard
                        title="Average order value"
                        value={formatMoney(stats.averageOrderValue, stats.currency)}
                        description="Average ticket size for the month"
                        icon={<Activity className="h-5 w-5" />}
                        accent="from-amber-500/15 via-amber-500/5 to-transparent"
                    />
                    <StatCard
                        title="Active orders"
                        value={stats.openOrders.toLocaleString()}
                        description="Pending, preparing, or on the way"
                        icon={<Clock3 className="h-5 w-5" />}
                        accent="from-indigo-500/15 via-indigo-500/5 to-transparent"
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader className="flex items-start justify-between space-y-0">
                            <div>
                                <CardTitle>Daily orders (this month)</CardTitle>
                                <CardDescription>
                                    Track order volume day by day
                                </CardDescription>
                            </div>
                            <div className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-100 dark:ring-cyan-900">
                                Live
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TrendLineChart data={charts.ordersByDay} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="flex items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Order status mix</CardTitle>
                                <CardDescription>
                                    Where orders sit right now
                                </CardDescription>
                            </div>
                            <div className="rounded-full bg-neutral-900/5 p-2 dark:bg-white/5">
                                <BarChart3 className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <StatusBarChart
                                data={charts.statusBreakdown}
                                currency={stats.currency}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    description,
    icon,
    accent,
}: {
    title: string;
    value: string;
    description: string;
    icon: ReactNode;
    accent: string;
}) {
    return (
        <Card className="relative overflow-hidden border border-sidebar-border/60 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
            <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`}
            />
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardDescription className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        {title}
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold">{value}</CardTitle>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {description}
                    </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-neutral-100 backdrop-blur dark:bg-neutral-900/80 dark:ring-neutral-800">
                    {icon}
                </div>
            </CardHeader>
        </Card>
    );
}

function TrendLineChart({ data }: { data: ChartPoint[] }) {
    if (!data.length) {
        return (
            <ChartEmptyState message="No orders yet this month. New activity will appear here." />
        );
    }

    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const points = data.map((item, index) => {
        const x =
            data.length === 1 ? 50 : (index / Math.max(data.length - 1, 1)) * 100;
        const y = 100 - (item.value / maxValue) * 80 - 5;

        return { ...item, x, y };
    });

    const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ');

    return (
        <div className="space-y-4">
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-b from-cyan-50 to-white ring-1 ring-neutral-100 dark:from-neutral-900 dark:to-neutral-950 dark:ring-neutral-800">
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full text-cyan-500"
                >
                    <defs>
                        <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polyline
                        points={polylinePoints}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="drop-shadow-sm"
                    />
                    <polygon
                        points={`${polylinePoints} 100,100 0,100`}
                        fill="url(#lineGradient)"
                        stroke="none"
                        opacity="0.8"
                    />
                    {points.map((point, index) => (
                        <g key={`${point.label}-${index}`}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r={1.6}
                                className="fill-white stroke-current stroke-[0.8] drop-shadow-sm dark:fill-neutral-900"
                            />
                        </g>
                    ))}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold uppercase tracking-wide text-cyan-700/70 dark:text-cyan-100/70">
                    {data.reduce((total, item) => total + item.value, 0).toLocaleString()}{' '}
                    orders
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                {points.slice(-8).map((point) => (
                    <div key={point.label} className="flex flex-col rounded-lg bg-neutral-100/60 px-2 py-1.5 text-center dark:bg-neutral-900/70">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {point.value}
                        </span>
                        <span className="truncate text-[11px]">{point.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusBarChart({
    data,
    currency,
}: {
    data: ChartPoint[];
    currency: string;
}) {
    if (!data.length) {
        return (
            <ChartEmptyState message="No orders yet to visualize. Status counts will appear here." />
        );
    }

    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const totalCount = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="space-y-3">
            {data.map((item) => {
                const width = `${(item.value / maxValue) * 100}%`;
                const emoji = item.status ? statusEmojiMap[item.status] ?? '📦' : '📦';
                const share = totalCount > 0 ? (item.value / totalCount) * 100 : 0;

                return (
                    <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm font-medium">
                            <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                                <span className="text-lg">{emoji}</span>
                                <span>{item.label}</span>
                            </div>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {item.revenue !== undefined
                                    ? formatMoney(item.revenue, currency)
                                    : ''}
                            </span>
                        </div>
                        <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-900">
                            <div
                                className="h-3 rounded-full bg-gradient-to-r from-[#00a0a3] via-cyan-500 to-cyan-400 shadow-[0_0_0.5rem_rgba(0,160,163,0.35)]"
                                style={{ width }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                            <span>{item.value} orders</span>
                            <span>
                                {share.toFixed(0)}%
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ChartEmptyState({ message }: { message: string }) {
    return (
        <p className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
            {message}
        </p>
    );
}

function formatMoney(amount: number, currency: string): string {
    return `${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ${currency}`;
}
