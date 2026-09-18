<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['date', 'name'])]
class Holiday extends Model
{
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public static function onDate(string $date): ?self
    {
        return static::where('date', $date)->first();
    }
}
