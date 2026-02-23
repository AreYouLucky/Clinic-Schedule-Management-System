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
        'schedule_code',
        'status',
        'booking_reason',
        'additional_info',
        'status'
    ];
}