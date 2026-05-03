<!DOCTYPE html>
<html>

<body style="margin:0;padding:0;font-family:Arial, Helvetica, sans-serif;font-size:12px;color:#1f2937;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">

                <!-- Receipt Container -->
                <table width="320" cellpadding="0" cellspacing="0" style="padding:15px;">

                    <!-- Logo -->
                    <tr>
                        <td align="center">
                            <img src="{{ public_path('/storage/logos/logo.png') }}" width="100">
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-top:8px;">
                            <strong style="font-size:14px;">APPOINTMENT CONFIRMED</strong><br>
                            <span style="font-size:11px;color:#6b7280;">Receipt</span>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:10px 0;">
                            <hr style="border:none;border-top:1px dashed #000;">
                        </td>
                    </tr>

                    <!-- Customer -->
                    <tr>
                        <td>
                            <strong>{{ $booking->fname }} {{ $booking->lname }}</strong>
                        </td>
                    </tr>

                    <tr><td height="8"></td></tr>

                    <!-- Details -->
                    <tr>
                        <td>
                            <table width="100%" cellpadding="4" cellspacing="0">

                                <tr>
                                    <td>Date</td>
                                    <td align="right">
                                        {{ \Carbon\Carbon::parse($schedule->date)->format('M d, Y') }}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Time</td>
                                    <td align="right">
                                        {{ \Carbon\Carbon::parse($schedule->start_time)->format('h:i A') }}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Reason</td>
                                    <td align="right">
                                        {{ $booking->booking_reason }}
                                    </td>
                                </tr>

                                <tr>
                                    <td>Status</td>
                                    <td align="right">
                                        Approved
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:10px 0;">
                            <hr style="border:none;border-top:1px dashed #000;">
                        </td>
                    </tr>

                    <!-- Notes -->
                    <tr>
                        <td style="font-size:11px;line-height:1.4;">
                            Arrive 10 minutes early.<br>
                            Contact clinic for changes.
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top:10px;font-size:10px;color:#6b7280;">
                            Thank you!
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>