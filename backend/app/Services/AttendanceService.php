<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Exceptions\AttendanceRuleException;
use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\User;
use Carbon\Carbon;

class AttendanceService
{
    private const FULL_DAY_HOURS = 8;

    public function markLogin(User $user, ?float $latitude = null, ?float $longitude = null): Attendance
    {
        $today = Carbon::today()->toDateString();

        $holiday = Holiday::onDate($today);

        if ($holiday) {
            throw new AttendanceRuleException("Today is a company holiday ({$holiday->name}). Attendance cannot be marked.");
        }

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if ($attendance && $attendance->login_time) {
            throw new AttendanceRuleException('Login has already been marked for today.');
        }

        $now = Carbon::now();

        if ($attendance) {
            $attendance->login_time = $now;
            $attendance->login_latitude = $latitude;
            $attendance->login_longitude = $longitude;
            $attendance->status = AttendanceStatus::Present;
            $attendance->save();

            return $attendance;
        }

        return Attendance::create([
            'user_id' => $user->id,
            'date' => $today,
            'login_time' => $now,
            'login_latitude' => $latitude,
            'login_longitude' => $longitude,
            'status' => AttendanceStatus::Present,
        ]);
    }

    public function markLogout(User $user, ?float $latitude = null, ?float $longitude = null): Attendance
    {
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (! $attendance || ! $attendance->login_time) {
            throw new AttendanceRuleException('You must mark login before marking logout.');
        }

        if ($attendance->logout_time) {
            throw new AttendanceRuleException('Logout has already been marked for today.');
        }

        $now = Carbon::now();

        if ($now->lessThan($attendance->login_time)) {
            throw new AttendanceRuleException('Logout time cannot be earlier than login time.');
        }

        $attendance->logout_time = $now;
        $attendance->logout_latitude = $latitude;
        $attendance->logout_longitude = $longitude;
        $this->applyWorkedHours($attendance);
        $attendance->status = $this->deriveStatusFromHours((float) $attendance->total_hours);
        $attendance->save();

        return $attendance;
    }

    public function createOrUpdate(array $data, ?Attendance $attendance = null): Attendance
    {
        $userId = $attendance?->user_id ?? $data['user_id'];
        $date = $data['date'] ?? $attendance?->date?->toDateString();

        $duplicate = Attendance::where('user_id', $userId)
            ->where('date', $date)
            ->when($attendance, fn ($query) => $query->whereKeyNot($attendance->id))
            ->exists();

        if ($duplicate) {
            throw new AttendanceRuleException('Attendance for this employee on this date already exists.');
        }

        $loginTime = $this->combine($date, $data['login_time'] ?? null);
        $logoutTime = $this->combine($date, $data['logout_time'] ?? null);

        if ($logoutTime && ! $loginTime) {
            throw new AttendanceRuleException('Logout cannot be marked without a login time.');
        }

        if ($loginTime && $logoutTime && $loginTime->greaterThan($logoutTime)) {
            throw new AttendanceRuleException('Login time cannot be later than logout time.');
        }

        $attendance = $attendance ?: new Attendance();
        $attendance->user_id = $userId;
        $attendance->date = $date;
        $attendance->login_time = $loginTime;
        $attendance->logout_time = $logoutTime;
        $attendance->status = AttendanceStatus::from($data['status']);
        $attendance->remarks = $data['remarks'] ?? null;
        $attendance->marked_by = $data['marked_by'] ?? null;

        $this->applyWorkedHours($attendance);

        $attendance->save();

        return $attendance;
    }

    public function applyWorkedHours(Attendance $attendance): void
    {
        $attendance->total_hours = ($attendance->login_time && $attendance->logout_time)
            ? round($attendance->login_time->diffInMinutes($attendance->logout_time) / 60, 2)
            : null;
    }

    private function deriveStatusFromHours(float $hours): AttendanceStatus
    {
        return $hours >= self::FULL_DAY_HOURS ? AttendanceStatus::Present : AttendanceStatus::HalfDay;
    }

    private function combine(string $date, ?string $time): ?Carbon
    {
        if (! $time) {
            return null;
        }

        return Carbon::parse($date.' '.$time);
    }
}
