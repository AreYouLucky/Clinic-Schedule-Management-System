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
                                Email Verification
                            </h2>
                        </td>
                    </tr>

                    <tr>
                        <td height="20"></td>
                    </tr>

                    <tr>
                        <td style="color:#6b7280;font-size:15px;">
                            Please use the verification code below to continue your appointment booking.
                        </td>
                    </tr>

                    <tr>
                        <td height="30"></td>
                    </tr>

                    <tr>
                        <td>
                            <div
                                style="display:inline-block; padding:18px 40px; font-size:30px; font-weight:bold; letter-spacing:8px; background:#2563eb; color:#ffffff; border-radius:10px;">
                                {{ $code }}
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td height="30"></td>
                    </tr>

                    <tr>
                        <td style="color:#9ca3af;font-size:13px;">
                            This code will expire in 5 minutes.
                        </td>
                    </tr>

                    <tr>
                        <td height="20"></td>
                    </tr>

                    <tr>
                        <td style="color:#d1d5db;font-size:12px;">
                            If you did not request this code, you may safely ignore this email.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
