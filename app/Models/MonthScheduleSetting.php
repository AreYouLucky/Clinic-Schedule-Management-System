<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthScheduleSetting extends Model
{
    protected $table = 'month_schedule_settings';
    protected $fillable = [
        'month_code',
        'opening_time',
        'closing_time',
        'noon_break_start',
        'noon_break_end',
        'time_per_session',
    ];
}
