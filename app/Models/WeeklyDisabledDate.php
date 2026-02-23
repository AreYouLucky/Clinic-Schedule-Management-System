<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeeklyDisabledDate extends Model
{
    protected $table = 'weekly_disabled_dates';
    protected $fillable = [
        'month_code',
        'day_code'
    ];
}
