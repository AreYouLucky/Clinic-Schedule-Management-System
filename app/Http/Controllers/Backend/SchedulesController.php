<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MonthlySchedule;
use App\Models\DailySchedule;
use App\Models\MonthScheduleSetting;
use App\Models\WeeklyDisabledDate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Models\Booking;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingCancellationRegret;

class SchedulesController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    function generateUniqueCode()
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (DB::table('daily_schedules')->where('schedule_code', $code)->exists());

        return $code;
    }
    public function index()
    {
        return MonthlySchedule::where('is_active', 1)
            ->withCount([
                'dailySchedules as available_count' => function ($query) {
                    $query->where('status', true);
                }
            ])
            ->orderBy('month_code', 'desc')
            ->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('schedule/partials/schedule-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'year' => 'required | numeric',
            'month' => 'required | numeric',
            'opening_time' => 'required | string',
            'closing_time' => 'required | string',
            'time_per_session' => 'required | string',
        ]);
        if (MonthlySchedule::where('month_code', $request->month . '-' . $request->year)->exists()) {
            return response()->json(['message' => 'Schedule already exists'], 422);
        }

        try {
            DB::beginTransaction();
            $month = MonthlySchedule::create([
                'year' => $request->year,
                'month' => $request->month,
                'status' => 'active',
                'is_active' => 1,
                'month_code' => $request->month . '-' . $request->year
            ]);

            foreach ($request->schedules as $schedule) {
                DailySchedule::create([
                    'month_code' => $month->month_code,
                    'date' => $schedule['date'],
                    'start_time' => $schedule['start'],
                    'end_time' => $schedule['end'],
                    'is_available' => 1,
                    'status' => $schedule['status'],
                    'schedule_code' => $this->generateUniqueCode()
                ]);
            }

            MonthScheduleSetting::create([
                'month_code' => $month->month_code,
                'opening_time' => $request->opening_time,
                'noon_break_start' => $request->noon_break_start,
                'noon_break_end' => $request->noon_break_end,
                'closing_time' => $request->closing_time,
                'time_per_session' => $request->time_per_session
            ]);

            foreach ($request->dayoffs as $dayoff) {
                WeeklyDisabledDate::create([
                    'month_code' => $month->month_code,
                    'day_code' => $dayoff
                ]);
            }
            DB::commit();
            return response()->json(['status' => 'Schedule created successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $schedule = DailySchedule::where('month_code', $id)
            ->whereDate('date', '>=', Carbon::today())
            ->get();
        $weeky_disabled = WeeklyDisabledDate::where('month_code', $id)->pluck('day_code')->toArray();


        return Inertia::render('schedule/partials/update-schedule-form', [
            'schedules' => $schedule,
            'weeky_disabled' => $weeky_disabled,
            'month_code' => $id
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            DB::beginTransaction();

            foreach ($request->schedules as $schedule) {
                $scheduleFound = DailySchedule::where('month_code', $id)
                    ->where('schedule_code', $schedule['schedule_code'])
                    ->first();

                if ($scheduleFound->is_available !== 1 && $schedule['status'] == false) {
                    $booking = Booking::where('schedule_code', $schedule->schedule_code)->where('status', 0)->first();

                    Mail::to($booking->email)->send(new BookingCancellationRegret($booking, $scheduleFound));
                }

                $scheduleFound->update([
                    'status' => $schedule['status'],
                ]);
            }

            DB::commit();
            return response()->json(['status' => 'Schedule updated successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
