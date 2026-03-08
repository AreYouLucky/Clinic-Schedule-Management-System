<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use App\Mail\BookingCancellationSuccess;
use App\Models\DailySchedule;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    public function getBookings(Request $req)
    {
        $query = Booking::query()
            ->join('daily_schedules as da', 'da.schedule_code', '=', 'bookings.schedule_code')
            ->select(
                'bookings.id',
                'bookings.fname',
                'bookings.lname',
                'bookings.mname',
                'bookings.email',
                'bookings.schedule_code',
                'bookings.status',
                'bookings.booking_reason',
                'bookings.additional_info',
                'bookings.created_at',
                'bookings.updated_at',
                'da.month_code',
                'da.date',
                'da.start_time',
                'da.end_time',
                'da.is_available'
            )
            ->orderBy('da.date', 'asc')
            ->orderBy('da.start_time', 'asc');

        if ($req->filled('date')) {
            $date = Carbon::parse($req->date)->toDateString();
            $query->whereDate('da.date', $date);
        }

        if ($req->filled('status')) {
            $status = strtolower((string) $req->status);
            if ($status === 'pending') {
                $query->where('bookings.status', 0);
            } elseif ($status === 'attended') {
                $query->where('bookings.status', 1);
            } elseif ($status === 'cancelled') {
                $query->where('bookings.status', 2);
            }
        }

        return $query->get();
    }

    public function updateBookingStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'integer', 'in:0,1,2'],
        ]);

        $booking = Booking::findOrFail($id);
        $schedule = DailySchedule::where('schedule_code', $booking->schedule_code)->first();
        if ($validated['status'] === 2) {
            Mail::to($booking->email)->send(
                new BookingCancellationSuccess($booking, $schedule)
            );
            $schedule->update([
                'is_available' => 1
            ]);
            $schedule->save();
        }
        $booking->update([
            'status' => $validated['status'],
        ]);

        return response()->json(['status' => 'Appointment status updated successfully'], 200);
    }

    public function viewAppointments()
    {
        return Inertia::render('appointments/appointment-page');
    }
}
