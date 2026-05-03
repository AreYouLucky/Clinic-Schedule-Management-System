<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = 'bookings';
    protected $fillable = [
        'fname',
        'lname',
        'mname',
        'email',
        'contact',
        'schedule_code',
        'status',
        'paid_amount',
        'booking_reason',
        'additional_info',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
        'paid_amount' => 'decimal:2',
    ];

    public function schedule()
    {
        return $this->belongsTo(DailySchedule::class, 'schedule_code', 'schedule_code');
    }
}
