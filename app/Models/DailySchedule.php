<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailySchedule extends Model
{
    protected $table = 'daily_schedules';
    protected $fillable = [
        'month_code',
        'date',
        'schedule_code',
        'start_time',
        'end_time',
        'is_available',
        'status',

    ];
}
