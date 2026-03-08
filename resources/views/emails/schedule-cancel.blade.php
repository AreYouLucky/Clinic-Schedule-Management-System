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
                                Appointment Cancelled
                            </h2>
                        </td>
                    </tr>

                    <tr>
                        <td height="20"></td>
                    </tr>

                    <tr>
                        <td style="color:#6b7280;font-size:15px;text-align:left;">
                            Hello <strong>{{ $booking->fname }} {{ $booking->lname }}</strong>,<br><br>

                            We sincerely regret to inform you that your scheduled appointment had to be
                            <strong>cancelled due to an unexpected change in the clinic’s schedule</strong>.
                            Unfortunately, the clinic will be unavailable during the selected time.
                            <br><br>

                            We truly apologize for the inconvenience this may have caused and appreciate your
                            understanding.
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
                                        {{ $booking->reason }}
                                    </td>
                                </tr>

                                <tr>
                                    <td align="left"><strong>Status</strong></td>
                                    <td align="right">
                                        <span
                                            style="background:#dc2626;color:#ffffff;padding:4px 10px;border-radius:6px;font-size:12px;">
                                            Cancelled by Clinic
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
                        <td style="color:#6b7280;font-size:14px;text-align:left;">
                            We sincerely hope you can <strong>book a new appointment at a more convenient time</strong>.
                            Our clinic will be happy to assist you with your next visit.
                        </td>
                    </tr>

                    <tr>
                        <td height="20"></td>
                    </tr>

                    <tr>
                        <td style="color:#9ca3af;font-size:12px;text-align:left;">
                            Thank you for your patience and understanding.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
