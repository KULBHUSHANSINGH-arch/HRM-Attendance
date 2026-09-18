<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'employee_name' => $this->user?->name,
            'employee_code' => $this->user?->employee_code,
            'department' => $this->user?->department,
            'date' => $this->date?->toDateString(),
            'login_time' => $this->login_time?->format('H:i'),
            'login_location' => $this->formatLocation($this->login_latitude, $this->login_longitude),
            'logout_time' => $this->logout_time?->format('H:i'),
            'logout_location' => $this->formatLocation($this->logout_latitude, $this->logout_longitude),
            'total_hours' => $this->total_hours !== null ? (float) $this->total_hours : null,
            'status' => $this->status,
            'is_late' => $this->isLate(),
            'remarks' => $this->remarks,
            'marked_by' => $this->markedBy?->name,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function formatLocation(?float $latitude, ?float $longitude): ?array
    {
        if ($latitude === null || $longitude === null) {
            return null;
        }

        return ['lat' => $latitude, 'lng' => $longitude];
    }

    private function isLate(): bool
    {
        if (! $this->login_time) {
            return false;
        }

        return $this->login_time->format('H:i') > config('attendance.office_start_time', '09:30');
    }
}
