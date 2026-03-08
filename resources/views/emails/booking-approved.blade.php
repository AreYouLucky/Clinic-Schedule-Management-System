<!DOCTYPE html>
<html>

<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
            <td align="center">

                <table width="480" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:12px;padding:40px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.05);">

                    <tr>
                        <td align="center">
                            <img src="{{ $message->embed(public_path('/storage/logos/logo.png')) }}" alt="Clinic Logo"
                                width="180" style="margin-bottom:10px;">
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <h2 style="margin:0;color:#1f2937;">
                                Appointment Confirmed
                            </h2>
                        </td>
                    </tr>

                    <tr>
                        <td height="20"></td>
                    </tr>

                    <tr>
                        <td style="color:#6b7280;font-size:15px;">
                            Hello <strong>{{ $booking->fname }} {{ $booking->lname }}</strong>,<br><br>
                            Your appointment has been <strong>approved and confirmed</strong>.
                            Please see your schedule details below.
                        </td>
                    </tr>

                    <tr>
                        <td height="30"></td>
                    </tr>

                    <tr>
                        <td>

                            <table width="100%" cellpadding="10" cellspacing="0"
                                style="background:#f9fafb;border-radius:10px;font-size:14px;color:#374151;">

                                <tr>
                                    <td align="left"><strong>Date</strong></td>
                                    <td align="right">
                                        {{ \Carbon\Carbon::parse($schedule->date)->format('F d, Y') }}
                                    </td>
                                </tr>

                                <tr>
                                    <td align="left"><strong>Time</strong></td>
                                    <td align="right">
                                        {{ \Carbon\Carbon::parse($schedule->start_time)->format('h:i A') }} -
                                        {{ \Carbon\Carbon::parse($schedule->end_time)->format('h:i A') }}
                                    </td>
                                </tr>

                                <tr>
                                    <td align="left"><strong>Reason</strong></td>
                                    <td align="right">
                                        {{ $booking->booking_reason }}
                                    </td>
                                </tr>

                                <tr>
                                    <td align="left"><strong>Status</strong></td>
                                    <td align="right">
                                        <span
                                            style="background:#16a34a;color:#ffffff;padding:4px 10px;border-radius:6px;font-size:12px;">
                                            Approved
                                        </span>
                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>

                    <tr>
                        <td height="30"></td>
                    </tr>

                    <tr>
                        <td style="color:#6b7280;font-size:14px;">
                            Please arrive at least <strong>10 minutes before your scheduled time</strong>.
                        </td>
                    </tr>

                    <tr>
                        <td height="20"></td>
                    </tr>

                    <tr>
                        <td style="color:#9ca3af;font-size:12px;">
                            If you need to reschedule or cancel your appointment, please contact the clinic.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
