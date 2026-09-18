<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\AttendanceStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $today = Carbon::today()->toDateString();

        $holiday = Holiday::onDate($today);

        $totalEmployees = User::where('role', UserRole::Employee)->where('is_active', true)->count();

        $statusCounts = Attendance::where('date', $today)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $markedToday = array_sum($statusCounts->toArray());

        $holidayToday = $holiday ? $totalEmployees : (int) ($statusCounts[AttendanceStatus::Holiday->value] ?? 0);

        return response()->json([
            'total_employees' => $totalEmployees,
            'present_today' => (int) ($statusCounts[AttendanceStatus::Present->value] ?? 0),
            'absent_today' => (int) ($statusCounts[AttendanceStatus::Absent->value] ?? 0),
            'half_day_today' => (int) ($statusCounts[AttendanceStatus::HalfDay->value] ?? 0),
            'on_leave_today' => (int) ($statusCounts[AttendanceStatus::Leave->value] ?? 0),
            'holiday_today' => $holidayToday,
            'not_marked_today' => $holiday ? 0 : max($totalEmployees - $markedToday, 0),
            'is_holiday_today' => (bool) $holiday,
            'holiday_name' => $holiday?->name,
        ]);
    }
}
