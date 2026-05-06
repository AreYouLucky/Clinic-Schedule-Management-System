<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use App\Mail\BookingCancellationSuccess;
use App\Models\DailySchedule;
use App\Models\MonthlySchedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AppointmentController extends Controller
{
    private function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (DailySchedule::where('schedule_code', $code)->exists());

        return $code;
    }

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
                'bookings.contact',
                'bookings.schedule_code',
                'bookings.status',
                'bookings.paid_amount',
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
            } elseif ($status === 'paid') {
                $query->where('bookings.status', 3);
            } elseif ($status === 'cancelled') {
                $query->where('bookings.status', 2);
            }
        }

        return $query->get();
    }

    public function updateBookingStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'integer', 'in:0,1,2,3'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        $booking = Booking::findOrFail($id);
        $schedule = DailySchedule::where('schedule_code', $booking->schedule_code)->first();

        if ($validated['status'] === 2) {
            if ($booking->email) {
                Mail::to($booking->email)->send(new BookingCancellationSuccess($booking, $schedule));
            }
            if ($schedule) {
                $schedule->update([
                    'is_available' => 1
                ]);
                $schedule->save();
            }
        }

        if ($validated['status'] === 3 && ! $request->filled('paid_amount')) {
            return response()->json([
                'message' => 'Paid amount is required when marking an appointment as paid.',
            ], 422);
        }

        $booking->update([
            'status' => $validated['status'],
            'paid_amount' => $validated['status'] === 3
                ? $validated['paid_amount']
                : ($validated['status'] === 0 ? null : $booking->paid_amount),
        ]);

        return response()->json(['status' => 'Appointment status updated successfully'], 200);
    }

    public function createWalkIn(Request $request)
    {
        $validated = $request->validate([
            'fname' => ['required', 'string'],
            'lname' => ['required', 'string'],
            'mname' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'contact' => ['required', 'regex:/^(09|\+639|639)\d{9}$/'],
            'reason' => ['required', 'string'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ], [
            'contact.required' => 'Contact number is required.',
            'contact.regex' => 'Invalid contact number.',
        ]);

        $today = Carbon::today();
        $monthCode = $today->month . '-' . $today->year;

        $result = DB::transaction(function () use ($validated, $today, $monthCode) {
            MonthlySchedule::firstOrCreate(
                ['month_code' => $monthCode],
                [
                    'month' => $today->month,
                    'year' => $today->year,
                    'status' => 'active',
                    'is_active' => 1,
                ]
            );

            $schedule = DailySchedule::create([
                'month_code' => $monthCode,
                'date' => $today->toDateString(),
                'schedule_code' => $this->generateUniqueCode(),
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'is_available' => 0,
                'status' => 1,
            ]);

            $booking = Booking::create([
                'fname' => $validated['fname'],
                'lname' => $validated['lname'],
                'mname' => $validated['mname'] ?? null,
                'email' => $validated['email'] ?? '',
                'contact' => $validated['contact'],
                'booking_reason' => $validated['reason'],
                'schedule_code' => $schedule->schedule_code,
                'status' => 0,
            ]);

            return compact('booking', 'schedule');
        });

        return response()->json([
            'message' => 'Walk-in appointment created successfully.',
            'booking' => $result['booking'],
            'schedule' => $result['schedule'],
        ], 201);
    }

    public function viewAppointments()
    {
        return Inertia::render('appointments/appointment-page');
    }
}
