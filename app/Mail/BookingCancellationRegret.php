<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingCancellationRegret extends Mailable
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
        return $this->subject('Your Appointment was Cancelled')
            ->view('emails.schedule-cancel');
    }
}
