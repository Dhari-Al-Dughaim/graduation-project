<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();

        $ordersThisMonth = Order::whereBetween('created_at', [$startOfMonth, $now])->count();
        $revenueThisMonth = (float) Order::whereBetween('created_at', [$startOfMonth, $now])->sum('total');
        $openOrders = Order::whereIn('status', [
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'out_for_delivery',
        ])->count();
        $averageOrderValue = $ordersThisMonth > 0
            ? round($revenueThisMonth / $ordersThisMonth, 2)
            : 0.0;

        $ordersByDay = Order::selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'label' => Carbon::parse($row->date)->format('M j'),
                'value' => (int) $row->total,
            ])
            ->values();

        $statusBreakdown = Order::selectRaw('status, COUNT(*) as total, SUM(total) as revenue')
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn ($row) => [
                'status' => $row->status,
                'label' => $this->formatStatus($row->status),
                'value' => (int) $row->total,
                'revenue' => (float) $row->revenue,
            ])
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'ordersThisMonth' => $ordersThisMonth,
                'revenueThisMonth' => round($revenueThisMonth, 2),
                'averageOrderValue' => $averageOrderValue,
                'openOrders' => $openOrders,
                'currency' => config('app.currency', 'KWD'),
            ],
            'charts' => [
                'ordersByDay' => $ordersByDay,
                'statusBreakdown' => $statusBreakdown,
            ],
        ]);
    }

    protected function formatStatus(string $status): string
    {
        return ucwords(str_replace('_', ' ', $status));
    }
}
