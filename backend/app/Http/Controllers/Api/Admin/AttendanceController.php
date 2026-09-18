<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(private readonly AttendanceService $attendanceService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $records = Attendance::query()
            ->with(['user', 'markedBy'])
            ->when($request->filled('date'), fn ($query) => $query->where('date', $request->string('date')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('user_id'), fn ($query) => $query->where('user_id', $request->integer('user_id')))
            ->orderByDesc('date')
            ->paginate($request->integer('per_page', 20));

        return response()->json(AttendanceResource::collection($records)->response()->getData(true));
    }

    public function store(StoreAttendanceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['marked_by'] = $request->user()->id;

        $attendance = $this->attendanceService->createOrUpdate($data);

        return response()->json(['attendance' => new AttendanceResource($attendance)], 201);
    }

    public function update(UpdateAttendanceRequest $request, Attendance $attendance): JsonResponse
    {
        $data = $request->validated();
        $data['marked_by'] = $request->user()->id;

        $attendance = $this->attendanceService->createOrUpdate($data, $attendance);

        return response()->json(['attendance' => new AttendanceResource($attendance)]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json(['message' => 'Attendance record deleted successfully.']);
    }
}
