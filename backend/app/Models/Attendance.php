<?php

namespace App\Models;

use App\Enums\AttendanceStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'date',
    'login_time',
    'login_latitude',
    'login_longitude',
    'logout_time',
    'logout_latitude',
    'logout_longitude',
    'total_hours',
    'status',
    'marked_by',
    'remarks',
])]
class Attendance extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'login_time' => 'datetime',
            'login_latitude' => 'float',
            'login_longitude' => 'float',
            'logout_time' => 'datetime',
            'logout_latitude' => 'float',
            'logout_longitude' => 'float',
            'total_hours' => 'decimal:2',
            'status' => AttendanceStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}
