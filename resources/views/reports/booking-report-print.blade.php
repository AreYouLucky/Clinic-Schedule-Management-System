<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 24px;
            color: #0f172a;
        }
        h1 {
            margin: 0;
            font-size: 22px;
        }
        .meta {
            margin-top: 6px;
            font-size: 12px;
            color: #475569;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: left;
        }
        th {
            background: #e2e8f0;
        }
        .status-pending { color: #b45309; font-weight: 600; }
        .status-attended { color: #15803d; font-weight: 600; }
        .status-paid { color: #0f766e; font-weight: 600; }
        .status-cancelled { color: #be123c; font-weight: 600; }
        @media print {
            @page { margin: 12mm; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 12px;">
        <button onclick="window.print()">Print / Save as PDF</button>
    </div>

    <h1>Clinic Booking Report</h1>
    <div class="meta">
        <div>Date range:
            {{ $fromDate ?? 'Any' }} to {{ $toDate ?? 'Any' }}
        </div>
        <div>Generated at: {{ $generatedAt }}</div>
        <div>Total records: {{ $rows->count() }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Patient</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Paid Amount</th>
                <th>Schedule Code</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $row)
                @php
                    $statusCode = (int) $row->status;
                    $statusText = $statusCode === 2 ? 'Cancelled' : ($statusCode === 3 ? 'Paid' : ($statusCode === 1 ? 'Attended' : 'Pending'));
                    $statusClass = $statusCode === 2 ? 'status-cancelled' : ($statusCode === 3 ? 'status-paid' : ($statusCode === 1 ? 'status-attended' : 'status-pending'));
                @endphp
                <tr>
                    <td>{{ trim($row->lname . ', ' . $row->fname . ' ' . ($row->mname ?? '')) }}</td>
                    <td>{{ $row->email }}</td>
                    <td>{{ $row->date }}</td>
                    <td>{{ $row->start_time }} - {{ $row->end_time }}</td>
                    <td>{{ $row->booking_reason ?? '-' }}</td>
                    <td class="{{ $statusClass }}">{{ $statusText }}</td>
                    <td>{{ $row->paid_amount !== null ? number_format((float) $row->paid_amount, 2) : '-' }}</td>
                    <td>{{ $row->schedule_code }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8">No data found for selected range.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
