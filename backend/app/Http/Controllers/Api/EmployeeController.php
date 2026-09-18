<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $employees = User::query()
            ->where('role', UserRole::Employee)
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->string('search');
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_code', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('is_active', $request->input('status') === 'active');
            })
            ->when($request->filled('department'), fn ($query) => $query->where('department', $request->string('department')))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15));

        return response()->json(UserResource::collection($employees)->response()->getData(true));
    }

    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $data['role'] = UserRole::Employee;

        $employee = User::create($data);

        return response()->json(['employee' => new UserResource($employee)], 201);
    }

    public function show(User $employee): JsonResponse
    {
        return response()->json(['employee' => new UserResource($employee)]);
    }

    public function update(UpdateEmployeeRequest $request, User $employee): JsonResponse
    {
        $data = $request->validated();

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $employee->update($data);

        return response()->json(['employee' => new UserResource($employee)]);
    }

    public function destroy(User $employee): JsonResponse
    {
        $employee->update(['is_active' => false]);

        return response()->json(['message' => 'Employee deactivated successfully.']);
    }
}
