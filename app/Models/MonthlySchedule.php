<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthlySchedule extends Model
{
    protected $table = 'monthly_schedules';

    protected $fillable = [
        'month_code',
        'month',
        'year',
        'status',
        'is_active'
    ];

    public function dailySchedules()
    {
        return $this->hasMany(DailySchedule::class, 'month_code', 'month_code');
    }
}
