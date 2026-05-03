import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import PaginatedSearchTable from '@/components/custom/data-table';
import { Booking } from '@/types/models';
import { useGetBookings, useUpdateBookingStatus } from './hooks/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ban, CheckCircle2, Clock3 } from 'lucide-react';
import { cn, convertShortDate } from '@/lib/utils';
import ConfirmationDialog from '@/components/custom/confirmation-dialog';
import AppointmentHeader from './partials/header';
import DataSection from './partials/data-section';
import PaymentDialog from './partials/payment-dialog';
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Appointments', href: '/view-appointments' },
];

function AppointmentsPage() {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
    const [attendedBookingId, setAttendedBookingId] = useState<number | null>(null);
    const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
    const [paidAmount, setPaidAmount] = useState("");
    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const { data, isFetching, refetch } = useGetBookings(selectedDate, selectedStatus);
    const updateStatus = useUpdateBookingStatus();
    const schedules = data ?? [];

    const formatTime = (time?: string) => {
        if (!time) return "-";
        const [hourStr, minute] = time.split(":");
        const hour = Number(hourStr);
        const period = hour >= 12 ? "PM" : "AM";
        const adjusted = hour % 12 || 12;
        return `${adjusted}:${minute} ${period}`;
    };

    const getStatusCode = (status: number | boolean) => Number(status);
    const isAttended = (status: number | boolean) => getStatusCode(status) === 1;
    const isCancelled = (status: number | boolean) => getStatusCode(status) === 2;
    const isPaid = (status: number | boolean) => getStatusCode(status) === 3;

    const pendingCount = schedules.filter((item) => getStatusCode(item.status) === 0).length;
    const attendedCount = schedules.filter((item) => getStatusCode(item.status) === 1).length;
    const paidCount = schedules.filter((item) => getStatusCode(item.status) === 3).length;
    const totalCollected = schedules.reduce((sum, item) => {
        const amount = item.paid_amount !== null && item.paid_amount !== undefined ? Number(item.paid_amount) : 0;
        return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const setBookingStatus = (id: number, status: number, paid_amount?: number | null) => {
        updateStatus.mutate(
            { id, status, paid_amount },
            {
                onSuccess: () => {
                    setAttendedBookingId(null);
                    setPaymentBooking(null);
                    setPaidAmount("");
                }
            }
        );
    };

    const confirmCancel = () => {
        if (cancelBookingId === null) return;
        setBookingStatus(cancelBookingId, 2);
        setCancelBookingId(null);
    };

    const confirmAttended = () => {
        if (attendedBookingId === null) return;
        setBookingStatus(attendedBookingId, 1);
    };

    const openPaymentDialog = (booking: Booking) => {
        setPaymentBooking(booking);
        setPaidAmount(booking.paid_amount !== null && booking.paid_amount !== undefined ? String(booking.paid_amount) : "");
    };

    const confirmPayment = () => {
        if (!paymentBooking) return;

        const parsedAmount = Number(paidAmount);
        if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
            return;
        }

        setBookingStatus(paymentBooking.id, 3, parsedAmount);
    };

    return (
        <div className='w-full space-y-5 bg-linear-to-b from-sky-50 via-white to-white p-4 lg:p-6'>
            <AppointmentHeader no_schedules={schedules.length} total_paid={totalCollected} />
            <DataSection pendingCount={pendingCount} attendedCount={attendedCount} paidCount={paidCount} selectedDate={selectedDate} convertShortDate={convertShortDate} />


            <section className='rounded-lg border border-sky-200 bg-white p-5  lg:p-6'>
                <div className='flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between'>
                    <div>
                        <Button
                            type='button'
                            onClick={() => setShowWalkInModal(true)}
                            className='rounded-lg border border-white/20 bg-white/12 p-4 text-left text-white shadow-none backdrop-blur-sm hover:bg-white/20 sm:col-span-2'
                        >
                            <span className='block text-xs uppercase tracking-[0.18em] text-sky-50/80'>Quick Action</span>
                            <span className='mt-3 block text-lg font-semibold'>Add Walk-In</span>
                            <span className='mt-1 block text-sm text-sky-50/85'>Create a same-day slot and appointment from the desk.</span>
                        </Button>
                    </div>
                    <div className='flex flex-wrap items-end gap-3'>
                        <div className='w-full sm:w-auto'>
                            <label className='text-xs font-semibold text-slate-700'>Filter by date</label>
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className='mt-1 h-11 w-full border-sky-200 bg-sky-50/70 md:w-55'
                            />
                        </div>
                        <div className='w-full sm:w-auto grid'>
                            <label className='text-xs font-semibold text-slate-700'>Filter by status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className='mt-1 h-11 w-full rounded-md border border-sky-200 bg-sky-50/70 px-3 text-sm text-slate-700 md:w-55'
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="attended">Attended</option>
                                <option value="paid">Paid</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <Button
                            type='button'
                            variant='outline'
                            className='h-11 border-sky-200 bg-white text-sky-700 hover:bg-sky-50'
                            onClick={() => {
                                setSelectedDate("");
                                setSelectedStatus("all");
                            }}
                            disabled={!selectedDate && selectedStatus === "all"}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </section>

            <section className='rounded-lg border border-sky-200 bg-white p-4 shadow-[0_20px_45px_-30px_rgba(14,116,144,0.35)] lg:p-5'>

                <PaginatedSearchTable<Booking>
                    items={schedules}
                    headers={[
                        { name: "Patient", position: "left" },
                        { name: "Contact Information", position: "left" },
                        { name: "Date", position: "center" },
                        { name: "Time", position: "center" },
                        { name: "Reason", position: "left" },
                        { name: "Status", position: "center" },
                        { name: "Amount", position: "center" },
                        { name: "Action", position: "center" },
                    ]}
                    searchBy={(item) => `${item.schedule_code} ${item.fname} ${item.lname} ${item.mname} ${item.email} ${item.booking_reason}`}
                    renderRow={(r) => (
                        <tr key={r.id} className="border-b border-sky-50 text-sm transition-colors duration-300 hover:bg-sky-50/50">
                            <td className='px-4 py-4'>
                                <div className='font-medium text-slate-900'>
                                    {r.lname}, {r.fname}{r.mname ? ` ${r.mname}` : ""}
                                </div>
                                <div className='mt-1 text-xs text-slate-500'>Code: {r.schedule_code}</div>
                            </td>
                            <td className='px-4 py-4 text-slate-700'>
                                <div>
                                    {r.email}
                                </div>
                                <div className='mt-1 text-xs text-slate-500'>
                                    {r.contact}
                                </div>
                            </td>
                            <td className='py-4 text-center'>{r.date ? convertShortDate(r.date) : "-"}</td>
                            <td className='py-4 text-center'>
                                <span className='inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700'>
                                    {formatTime(r.start_time)} - {formatTime(r.end_time)}
                                </span>
                            </td>
                            <td className='px-4 py-4 text-slate-700'>{r.booking_reason || "-"}</td>
                            <td className='py-4 text-center'>
                                {isCancelled(r.status) ? (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold'>
                                        <Ban size={14} /> Cancelled
                                    </span>
                                ) : isPaid(r.status) ? (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-cyan-100 text-cyan-700 px-3 py-1 text-xs font-semibold'>
                                        <CheckCircle2 size={14} /> Paid
                                    </span>
                                ) : isAttended(r.status) ? (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold'>
                                        <CheckCircle2 size={14} /> Attended
                                    </span>
                                ) : (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold'>
                                        <Clock3 size={14} /> Pending
                                    </span>
                                )}
                            </td>
                            <td className='py-4 text-center'>
                                <span className='font-medium text-slate-700'>
                                    {r.paid_amount !== null && r.paid_amount !== undefined ? `PHP ${Number(r.paid_amount).toFixed(2)}` : "-"}
                                </span>
                            </td>
                            <td className='py-4 text-center'>
                                <div className='flex items-center justify-center gap-2'>
                                    <Button
                                        type='button'
                                        size='sm'
                                        onClick={() => {
                                            if (isAttended(r.status)) {
                                                openPaymentDialog(r);
                                                return;
                                            }

                                            if (!isCancelled(r.status) && !isPaid(r.status)) {
                                                setAttendedBookingId(r.id);
                                            }
                                        }}
                                        disabled={updateStatus.isPending || isCancelled(r.status) || isPaid(r.status)}
                                        className={cn(
                                            'min-w-28 text-white shadow-sm',
                                            isCancelled(r.status) || isPaid(r.status)
                                                ? 'bg-slate-400 hover:bg-slate-400 cursor-not-allowed'
                                                : isAttended(r.status)
                                                    ? 'bg-cyan-600 hover:bg-cyan-700'
                                                    : 'bg-emerald-600 hover:bg-emerald-700'
                                        )}
                                    >
                                        {isCancelled(r.status)
                                            ? "Cancelled"
                                            : isPaid(r.status)
                                                ? "Paid"
                                                : isAttended(r.status)
                                                    ? "Mark Paid"
                                                    : "Mark Attended"}
                                    </Button>
                                    {!isCancelled(r.status) && !isPaid(r.status) && (
                                        <Button
                                            type='button'
                                            size='sm'
                                            onClick={() => setCancelBookingId(r.id)}
                                            disabled={updateStatus.isPending}
                                            className='min-w-20 bg-rose-600/90 text-white hover:bg-rose-700'
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )}
                    itemsPerPage={10}
                    searchPlaceholder="Search patient information"
                    onRefresh={() => refetch()}
                    isLoading={isFetching}
                />
            </section>
            <ConfirmationDialog
                show={attendedBookingId !== null}
                type={2}
                message='Are you sure you want to mark this appointment as attended?'
                onConfirm={confirmAttended}
                onClose={() => setAttendedBookingId(null)}
            />
            <ConfirmationDialog
                show={cancelBookingId !== null}
                type={2}
                message='Are you sure you want to cancel this appointment?'
                onConfirm={confirmCancel}
                onClose={() => setCancelBookingId(null)}
            />
            <PaymentDialog
                paymentBooking={paymentBooking}
                setPaymentBooking={setPaymentBooking}
                paidAmount={paidAmount}
                setPaidAmount={setPaidAmount}
                confirmPayment={confirmPayment}
                updateStatus={updateStatus}
            />

        </div>
    )
}
AppointmentsPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
export default AppointmentsPage
