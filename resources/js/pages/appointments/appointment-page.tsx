import React, { useMemo, useState } from 'react'
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Appointments', href: '/view-appointments' },
];

function AppointmentsPage() {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
    const { data, isFetching, refetch } = useGetBookings(selectedDate, selectedStatus);
    const updateStatus = useUpdateBookingStatus();
    const schedules = data ?? [];
    const statusLabel = useMemo(
        () =>
            selectedStatus === "attended"
                ? "Attended"
                : selectedStatus === "pending"
                    ? "Pending"
                    : selectedStatus === "cancelled"
                        ? "Cancelled"
                    : "All Status",
        [selectedStatus]
    );
    const dateFilterLabel = useMemo(
        () => (selectedDate ? convertShortDate(selectedDate) : "All Dates"),
        [selectedDate]
    );

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

    const setBookingStatus = (id: number, status: number) => {
        updateStatus.mutate({ id, status });
    };

    const confirmCancel = () => {
        if (cancelBookingId === null) return;
        setBookingStatus(cancelBookingId, 2);
        setCancelBookingId(null);
    };

    return (
        <div className='w-full p-4 space-y-4'>
            <section className='bg-white rounded-xl shadow-sm border border-slate-100 p-5 lg:p-6 flex flex-row justify-between'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h1 className='text-xl lg:text-2xl font-bold text-sky-500 mt-1'>Clinic Appointments</h1>
                        <p className='text-sm text-slate-500 mt-1'>Manage patient bookings and mark visit status as pending or attended.</p>
                    </div>
                </div>
                <div className='mb-3 flex flex-wrap items-end gap-3'>
                    <div className='w-full sm:w-auto'>
                        <label className='text-xs font-semibold text-slate-600'>Filter by date</label>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className='mt-1 w-full md:w-55'
                        />
                    </div>
                    <div className='w-full sm:w-auto grid'>
                        <label className='text-xs font-semibold text-slate-600'>Filter by status</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className='mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700  md:w-55'
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="attended">Attended</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <Button
                        type='button'
                        variant='outline'
                        className='h-10 bg-gray-500 text-white'
                        onClick={() => {
                            setSelectedDate("");
                            setSelectedStatus("all");
                        }}
                        disabled={!selectedDate && selectedStatus === "all"}
                    >
                        Clear Filters
                    </Button>
                </div>
            </section>
            <section className='bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-5'>


                <PaginatedSearchTable<Booking>
                    items={schedules}
                    headers={[
                        { name: "Patient", position: "left" },
                        { name: "Email", position: "left" },
                        { name: "Date", position: "center" },
                        { name: "Time", position: "center" },
                        { name: "Reason", position: "left" },
                        { name: "Status", position: "center" },
                        { name: "Action", position: "center" },
                    ]}
                    searchBy={(item) => `${item.schedule_code} ${item.fname} ${item.lname} ${item.mname} ${item.email} ${item.booking_reason}`}
                    renderRow={(r) => (
                        <tr key={r.id} className="border-b duration-300 hover:bg-slate-50 text-sm">
                            <td className='py-3 px-4 font-medium text-slate-800'>
                                {r.lname}, {r.fname}{r.mname ? ` ${r.mname}` : ""}
                            </td>
                            <td className='py-3 px-4 text-slate-700'>{r.email}</td>
                            <td className='text-center py-3'>{r.date ? convertShortDate(r.date) : "-"}</td>
                            <td className='text-center py-3'>{formatTime(r.start_time)} - {formatTime(r.end_time)}</td>
                            <td className='py-3 px-4 text-slate-700'>{r.booking_reason || "-"}</td>
                            <td className='text-center py-3'>
                                {isCancelled(r.status) ? (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold'>
                                        <Ban size={14} /> Cancelled
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
                            <td className='text-center py-3'>
                                <div className='flex items-center justify-center gap-3'>
                                    <Button
                                        type='button'
                                        size='sm'
                                        onClick={() => setBookingStatus(r.id, isAttended(r.status) ? 0 : 1)}
                                        disabled={updateStatus.isPending || isCancelled(r.status)}
                                        className={cn(
                                            'text-white',
                                            isCancelled(r.status)
                                                ? 'bg-slate-400 hover:bg-slate-400 cursor-not-allowed'
                                                : isAttended(r.status)
                                                    ? 'bg-amber-500 hover:bg-amber-600'
                                                    : 'bg-emerald-600 hover:bg-emerald-700'
                                        )}
                                    >
                                        {isCancelled(r.status)
                                            ? "Cancelled"
                                            : isAttended(r.status)
                                                ? "Set Pending"
                                                : "Mark Attended"}
                                    </Button>
                                    {!isCancelled(r.status) && (
                                        <Button
                                            type='button'
                                            size='sm'
                                            onClick={() => setCancelBookingId(r.id)}
                                            disabled={updateStatus.isPending}
                                            className='bg-rose-600/80 hover:bg-rose-700 text-white'
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
                show={cancelBookingId !== null}
                type={2}
                message='Are you sure you want to cancel this appointment?'
                onConfirm={confirmCancel}
                onClose={() => setCancelBookingId(null)}
            />
        </div>
    )
}
AppointmentsPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
export default AppointmentsPage
