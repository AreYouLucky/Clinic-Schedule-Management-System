<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;


class BookingCancellationSuccess extends Mailable
{
    public $booking;
    public $schedule;

    public function __construct($booking, $schedule)
    {
        $this->booking = $booking;
        $this->schedule = $schedule;
    }

    public function build()
    {
        return $this->subject('Your Appointment is Cancelled')
            ->view('emails.cancel-success');
    }
}
