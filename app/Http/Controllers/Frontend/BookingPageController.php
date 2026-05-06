<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DailySchedule;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use App\Models\EmailVerification;
use App\Mail\VerificationCodeMail;
use App\Models\Booking;
use App\Mail\BookingConfirmationMail;

class BookingPageController extends Controller
{

    public function index()
    {
        $dates = DailySchedule::select("date")
            ->whereDate('date', '>=', Carbon::today())
            ->where('is_available', 1)
            ->where('status', 1)
            ->groupBy('date')
            ->get();

        return Inertia::render('homepage/home', [
            'dates' => $dates
        ]);
    }

    public function sendVerificationCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);
        $email = $request->email;
        $record = EmailVerification::where('email', $email)->first();
        if ($record && $record->last_sent_at) {
            $secondsLeft = 60 - now()->diffInSeconds($record->last_sent_at);

            if ($secondsLeft > 0) {
                return response()->json([
                    'message' => "Please wait {$secondsLeft} seconds before requesting again.",
                    'cooldown' => $secondsLeft
                ], 422);
            }
        }

        $code = random_int(100000, 999999);

        EmailVerification::updateOrCreate(
            ['email' => $email],
            [
                'code' => bcrypt($code),
                'expires_at' => now()->addMinutes(5),
                'last_sent_at' => now(),
            ]
        );

        Mail::to($email)->send(new VerificationCodeMail($code));
        return response()->json([
            'message' => 'Verification code sent. Check your email.',
            'cooldown' => 300
        ]);
    }

    public function submitAppointment(Request $request)
    {
        $request->validate([
            'email' => ['nullable', 'email'],
            'contact' => ['required', 'regex:/^(09|\+639|639)\d{9}$/'],
            'fname' => ['required', 'string'],
            'lname' => ['required', 'string'],
            'mname' => ['nullable', 'string'],
            'schedule_code' => ['required', 'string'],
            'booking_reason' => ['nullable', 'string'],
        ], [
            'contact.required' => 'Contact number is required.',
            'contact.regex' => 'Invalid contact number.',
        ]);
        $schedule = DailySchedule::where('schedule_code', $request->schedule_code)->first();
        if(!$schedule || $schedule->is_available == 0 || $schedule->status == 0) {
            return response()->json(['message' => 'Selected schedule is not available. Please choose another schedule.'], 422);
         }

        $booking = Booking::create([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'mname' => $request->mname,
            'email' => $request->email ?? "",
            'contact' => $request->contact,
            'booking_reason' => $request->reason ?? "",
            'schedule_code' => $request->schedule_code,
            'status' => 0
        ]);
        $schedule->update([
            'is_available' => 0
        ]);

        if ($request->filled('email')) {

            Mail::to($booking->email)->send(
                new BookingConfirmationMail($booking, $schedule)
            );
        }
        return response()->json(['message' => 'Booking successful, check your email for more information.', 'booking' => $booking, 'schedule' => $schedule], 200);
    }

    public function getSchedules(String $date)
    {
        $date = Carbon::parse($date)->toDateString();

        $query = DailySchedule::select('schedule_code', 'start_time', 'end_time')
            ->whereDate('date', $date)
            ->where('is_available', 1)
            ->where('status', 1);

        // If the selected date is today, exclude past times
        if ($date === Carbon::today()->toDateString()) {
            $query->whereTime('start_time', '>', Carbon::now()->toTimeString());
        }

        $schedules = $query->orderBy('start_time', 'asc')->get();

        return response()->json($schedules);
    }

    public function downloadAppointment($id)
    {
        $booking = Booking::where('schedule_code', $id)->first();

        $schedule = DailySchedule::where('schedule_code', $booking->schedule_code)
            ->first();

        $pdf = Pdf::loadView('emails.booking-approved', [
            'booking' => $booking,
            'schedule' => $schedule
        ]);

        return $pdf->setPaper([0, 0, 380, 400])->download('appointment.pdf');
    }
}
