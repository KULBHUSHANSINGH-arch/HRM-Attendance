<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\Holiday;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AttendanceSelfController extends Controller
{
    public function __construct(private readonly AttendanceService $attendanceService)
    {
    }

    public function markLogin(Request $request): JsonResponse
    {
        $coordinates = $this->validateCoordinates($request);

        $attendance = $this->attendanceService->markLogin(
            $request->user(),
            $coordinates['latitude'],
            $coordinates['longitude'],
        );

        return response()->json(['attendance' => new AttendanceResource($attendance)]);
    }

    public function markLogout(Request $request): JsonResponse
    {
        $coordinates = $this->validateCoordinates($request);

        $attendance = $this->attendanceService->markLogout(
            $request->user(),
            $coordinates['latitude'],
            $coordinates['longitude'],
        );

        return response()->json(['attendance' => new AttendanceResource($attendance)]);
    }

    public function today(Request $request): JsonResponse
    {
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $request->user()->id)
            ->where('date', $today)
            ->first();

        $holiday = Holiday::onDate($today);

        return response()->json([
            'attendance' => $attendance ? new AttendanceResource($attendance) : null,
            'holiday_name' => $holiday?->name,
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $records = Attendance::where('user_id', $request->user()->id)
            ->when($request->filled('month'), fn ($query) => $query->whereMonth('date', $request->integer('month')))
            ->when($request->filled('year'), fn ($query) => $query->whereYear('date', $request->integer('year')))
            ->orderByDesc('date')
            ->paginate($request->integer('per_page', 31));

        return response()->json(AttendanceResource::collection($records)->response()->getData(true));
    }

    private function validateCoordinates(Request $request): array
    {
        $validated = $request->validate([
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        return [
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ];
    }
}
