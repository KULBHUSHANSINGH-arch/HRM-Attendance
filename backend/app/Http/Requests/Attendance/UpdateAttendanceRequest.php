<?php

namespace App\Http\Requests\Attendance;

use App\Enums\AttendanceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['sometimes', 'date'],
            'status' => ['required', new Enum(AttendanceStatus::class)],
            'login_time' => ['nullable', 'date_format:H:i'],
            'logout_time' => ['nullable', 'date_format:H:i'],
            'remarks' => ['nullable', 'string', 'max:500'],
        ];
    }
}
