<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function viewReports()
    {
        return Inertia::render('reports/reports-page');
    }

    public function getReports(Request $request)
    {
        return $this->buildReportQuery($request)->get();
    }

    public function exportReportsCsv(Request $request)
    {
        $rows = $this->buildReportQuery($request)->get();
        $filename = 'booking-reports-' . now()->format('Ymd-His') . '.csv';

        return response()->streamDownload(function () use ($rows) {
            $output = fopen('php://output', 'w');
            fputcsv($output, ['Patient', 'Email', 'Date', 'Start Time', 'End Time', 'Reason', 'Status', 'Paid Amount', 'Schedule Code']);

            foreach ($rows as $row) {
                $status = match ((int) $row->status) {
                    1 => 'Attended',
                    2 => 'Cancelled',
                    3 => 'Paid',
                    default => 'Pending',
                };

                fputcsv($output, [
                    trim($row->lname . ', ' . $row->fname . ' ' . ($row->mname ?? '')),
                    $row->email,
                    $row->date,
                    $row->start_time,
                    $row->end_time,
                    $row->booking_reason,
                    $status,
                    $row->paid_amount,
                    $row->schedule_code,
                ]);
            }

            fclose($output);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function exportReportsPdf(Request $request)
    {
        $rows = $this->buildReportQuery($request)->get();
        $fromDate = $request->filled('from_date') ? Carbon::parse($request->from_date)->toDateString() : null;
        $toDate = $request->filled('to_date') ? Carbon::parse($request->to_date)->toDateString() : null;

        return response()->view('reports.booking-report-print', [
            'rows' => $rows,
            'fromDate' => $fromDate,
            'toDate' => $toDate,
            'generatedAt' => now()->toDateTimeString(),
        ]);
    }

    private function buildReportQuery(Request $request)
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
                'bookings.paid_amount',
                'bookings.booking_reason',
                'bookings.additional_info',
                'bookings.created_at',
                'bookings.updated_at',
                'da.month_code',
                'da.date',
                'da.start_time',
                'da.end_time'
            )
            ->orderBy('da.date', 'desc')
            ->orderBy('da.start_time', 'desc');

        if ($request->filled('from_date')) {
            $fromDate = Carbon::parse($request->from_date)->toDateString();
            $query->whereDate('da.date', '>=', $fromDate);
        }

        if ($request->filled('to_date')) {
            $toDate = Carbon::parse($request->to_date)->toDateString();
            $query->whereDate('da.date', '<=', $toDate);
        }

        return $query;
    }
}
