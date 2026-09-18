<?php

namespace Database\Seeders;

use App\Enums\AttendanceStatus;
use App\Models\Attendance;
use App\Models\Holiday;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $departments = [
            ['name' => 'Aarav Sharma', 'department' => 'Engineering', 'designation' => 'Backend Developer'],
            ['name' => 'Priya Patel', 'department' => 'Engineering', 'designation' => 'Frontend Developer'],
            ['name' => 'Rohan Mehta', 'department' => 'Sales', 'designation' => 'Sales Executive'],
            ['name' => 'Sneha Iyer', 'department' => 'Support', 'designation' => 'Support Specialist'],
            ['name' => 'Kabir Nair', 'department' => 'HR', 'designation' => 'HR Coordinator'],
            ['name' => 'Ananya Gupta', 'department' => 'Finance', 'designation' => 'Accountant'],
        ];

        $employees = collect($departments)->map(function (array $data, int $index) {
            return User::factory()->create([
                'name' => $data['name'],
                'email' => 'employee'.($index + 1).'@example.com',
                'password' => 'password',
                'employee_code' => 'EMP-'.str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                'department' => $data['department'],
                'designation' => $data['designation'],
            ]);
        });

        $today = Carbon::today();

        $companyHolidayDate = $today->copy()->subDays(12);
        while ($companyHolidayDate->isWeekend()) {
            $companyHolidayDate->subDay();
        }

        Holiday::create(['date' => $companyHolidayDate->toDateString(), 'name' => 'Founders Day']);
        Holiday::create(['date' => $today->copy()->addDays(20)->toDateString(), 'name' => 'Public Holiday']);

        foreach ($employees as $employee) {
            for ($daysAgo = 30; $daysAgo >= 1; $daysAgo--) {
                $date = $today->copy()->subDays($daysAgo);

                if ($date->isSameDay($companyHolidayDate)) {
                    continue;
                }

                if ($date->isWeekend()) {
                    Attendance::create([
                        'user_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'status' => AttendanceStatus::Holiday,
                    ]);

                    continue;
                }

                $roll = random_int(1, 100);

                if ($roll <= 75) {
                    $login = $date->copy()->setTime(9, random_int(0, 20));
                    $logout = $login->copy()->addHours(8)->addMinutes(random_int(0, 45));

                    Attendance::create([
                        'user_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'login_time' => $login,
                        'logout_time' => $logout,
                        'total_hours' => round($login->diffInMinutes($logout) / 60, 2),
                        'status' => AttendanceStatus::Present,
                    ]);
                } elseif ($roll <= 88) {
                    $login = $date->copy()->setTime(10, random_int(0, 30));
                    $logout = $login->copy()->addHours(random_int(2, 3))->addMinutes(random_int(0, 45));

                    Attendance::create([
                        'user_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'login_time' => $login,
                        'logout_time' => $logout,
                        'total_hours' => round($login->diffInMinutes($logout) / 60, 2),
                        'status' => AttendanceStatus::HalfDay,
                    ]);
                } elseif ($roll <= 96) {
                    Attendance::create([
                        'user_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'status' => AttendanceStatus::Leave,
                        'remarks' => 'Approved leave',
                    ]);
                } else {
                    Attendance::create([
                        'user_id' => $employee->id,
                        'date' => $date->toDateString(),
                        'status' => AttendanceStatus::Absent,
                    ]);
                }
            }
        }
    }
}
