<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\AttendanceStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Holiday;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function daily(Request $request): JsonResponse
    {
        $date = $request->string('date', Carbon::today()->toDateString())->toString();
        [$holidayName, $report] = $this->buildDailyReport($date);

        return response()->json([
            'date' => $date,
            'holiday_name' => $holidayName,
            'report' => $report,
        ]);
    }

    public function dailyExport(Request $request): StreamedResponse
    {
        $date = $request->string('date', Carbon::today()->toDateString())->toString();
        [, $report] = $this->buildDailyReport($date);

        return response()->streamDownload(function () use ($report) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Employee', 'Code', 'Department', 'Status', 'Punch In', 'Punch Out', 'Total Hours']);

            foreach ($report as $row) {
                fputcsv($handle, [
                    $row['employee_name'],
                    $row['employee_code'],
                    $row['department'],
                    $row['status'],
                    $row['login_time'],
                    $row['logout_time'],
                    $row['total_hours'],
                ]);
            }

            fclose($handle);
        }, "daily-attendance-{$date}.csv", ['Content-Type' => 'text/csv']);
    }

    public function monthly(Request $request): JsonResponse
    {
        $month = $request->integer('month', Carbon::today()->month);
        $year = $request->integer('year', Carbon::today()->year);
        $report = $this->buildMonthlyReport($month, $year);

        return response()->json([
            'month' => $month,
            'year' => $year,
            'report' => $report,
        ]);
    }

    public function monthlyExport(Request $request): StreamedResponse
    {
        $month = $request->integer('month', Carbon::today()->month);
        $year = $request->integer('year', Carbon::today()->year);
        $report = $this->buildMonthlyReport($month, $year);

        return response()->streamDownload(function () use ($report) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Employee', 'Code', 'Department', 'Present', 'Absent', 'Half Day', 'Leave', 'Holiday', 'Total Hours']);

            foreach ($report as $row) {
                fputcsv($handle, [
                    $row['employee_name'],
                    $row['employee_code'],
                    $row['department'],
                    $row['present_days'],
                    $row['absent_days'],
                    $row['half_days'],
                    $row['leave_days'],
                    $row['holiday_days'],
                    $row['total_hours'],
                ]);
            }

            fclose($handle);
        }, "monthly-attendance-{$year}-{$month}.csv", ['Content-Type' => 'text/csv']);
    }

    private function buildDailyReport(string $date): array
    {
        $holiday = Holiday::onDate($date);

        $employees = User::where('role', UserRole::Employee)
            ->where('is_active', true)
            ->with(['attendances' => fn ($query) => $query->where('date', $date)])
            ->orderBy('name')
            ->get();

        $report = $employees->map(function (User $employee) use ($holiday) {
            $attendance = $employee->attendances->first();

            return [
                'user_id' => $employee->id,
                'employee_name' => $employee->name,
                'employee_code' => $employee->employee_code,
                'department' => $employee->department,
                'status' => $attendance?->status?->value ?? ($holiday ? 'holiday' : 'not_marked'),
                'login_time' => $attendance?->login_time?->format('H:i'),
                'logout_time' => $attendance?->logout_time?->format('H:i'),
                'total_hours' => $attendance?->total_hours !== null ? (float) $attendance->total_hours : null,
            ];
        })->values()->all();

        return [$holiday?->name, $report];
    }

    private function buildMonthlyReport(int $month, int $year): array
    {
        $holidayDates = Holiday::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->pluck('date')
            ->map(fn ($date) => $date->toDateString());

        $employees = User::where('role', UserRole::Employee)
            ->where('is_active', true)
            ->with(['attendances' => fn ($query) => $query->whereMonth('date', $month)->whereYear('date', $year)])
            ->orderBy('name')
            ->get();

        return $employees->map(function (User $employee) use ($holidayDates) {
            $records = $employee->attendances;

            $coveredDates = $records->map(fn ($record) => $record->date->toDateString());
            $implicitHolidays = $holidayDates->diff($coveredDates)->count();

            return [
                'user_id' => $employee->id,
                'employee_name' => $employee->name,
                'employee_code' => $employee->employee_code,
                'department' => $employee->department,
                'present_days' => $records->where('status', AttendanceStatus::Present)->count(),
                'absent_days' => $records->where('status', AttendanceStatus::Absent)->count(),
                'half_days' => $records->where('status', AttendanceStatus::HalfDay)->count(),
                'leave_days' => $records->where('status', AttendanceStatus::Leave)->count(),
                'holiday_days' => $records->where('status', AttendanceStatus::Holiday)->count() + $implicitHolidays,
                'total_hours' => round((float) $records->sum('total_hours'), 2),
            ];
        })->values()->all();
    }
}
