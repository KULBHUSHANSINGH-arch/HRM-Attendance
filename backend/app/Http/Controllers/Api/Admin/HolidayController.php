<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Holiday\StoreHolidayRequest;
use App\Models\Holiday;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $holidays = Holiday::query()
            ->when($request->filled('year'), fn ($query) => $query->whereYear('date', $request->integer('year')))
            ->orderBy('date')
            ->get();

        return response()->json(['holidays' => $holidays]);
    }

    public function store(StoreHolidayRequest $request): JsonResponse
    {
        $holiday = Holiday::create($request->validated());

        return response()->json(['holiday' => $holiday], 201);
    }

    public function destroy(Holiday $holiday): JsonResponse
    {
        $holiday->delete();

        return response()->json(['message' => 'Holiday removed successfully.']);
    }
}
