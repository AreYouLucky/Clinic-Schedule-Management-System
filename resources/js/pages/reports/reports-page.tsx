import React, { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Booking } from '@/types/models';
import PaginatedSearchTable from '@/components/custom/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { convertShortDate } from '@/lib/utils';
import { useGetReports } from './hooks/hooks';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '/view-reports' },
];

function ReportsPage() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const { data, isFetching, refetch } = useGetReports(fromDate, toDate);
    const reports = data ?? [];

    const formatTime = (time?: string) => {
        if (!time) return '-';
        const [hourStr, minute] = time.split(':');
        const hour = Number(hourStr);
        const period = hour >= 12 ? 'PM' : 'AM';
        const adjusted = hour % 12 || 12;
        return `${adjusted}:${minute} ${period}`;
    };

    const summary = useMemo(() => {
        const total = reports.length;
        const pending = reports.filter((r) => Number(r.status) === 0).length;
        const attended = reports.filter((r) => Number(r.status) === 1).length;
        const cancelled = reports.filter((r) => Number(r.status) === 2).length;
        return { total, pending, attended, cancelled };
    }, [reports]);

    const getExportQuery = () => {
        const params = new URLSearchParams();
        if (fromDate) params.set('from_date', fromDate);
        if (toDate) params.set('to_date', toDate);
        return params.toString();
    };

    const handleExportCsv = () => {
        const q = getExportQuery();
        window.location.href = q ? `/get-reports/csv?${q}` : '/get-reports/csv';
    };

    const handleExportPdf = () => {
        const q = getExportQuery();
        window.open(q ? `/get-reports/pdf?${q}` : '/get-reports/pdf', '_blank');
    };

    return (
        <div className='w-full p-4 space-y-4'>
            <section className='bg-white rounded-xl shadow-sm border border-slate-100 p-5 lg:p-6 flex flex-row justify-between'>
                <div>
                    <h1 className='text-xl lg:text-2xl font-bold text-sky-600 mt-1'>Booking Reports</h1>
                    <p className='text-sm text-slate-500 mt-1'>Filter bookings by date range and review clinic appointment performance.</p>
                </div>
                <div className='mb-3 flex flex-wrap items-end gap-3'>
                    <div className='w-full sm:w-auto'>
                        <label className='text-xs font-semibold text-slate-600'>From date</label>
                        <Input
                            type='date'
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className='mt-1 w-full md:w-55'
                        />
                    </div>
                    <div className='w-full sm:w-auto'>
                        <label className='text-xs font-semibold text-slate-600'>To date</label>
                        <Input
                            type='date'
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className='mt-1 w-full md:w-55'
                        />
                    </div>
                    <Button
                        type='button'
                        variant='outline'
                        className='h-10'
                        onClick={() => {
                            setFromDate('');
                            setToDate('');
                        }}
                        disabled={!fromDate && !toDate}
                    >
                        Clear Range
                    </Button>
                    <Button
                        type='button'
                        className='h-10 bg-emerald-600 hover:bg-emerald-700 text-white'
                        onClick={handleExportCsv}
                    >
                        Export CSV
                    </Button>
                    <Button
                        type='button'
                        className='h-10 bg-rose-600 hover:bg-rose-700 text-white'
                        onClick={handleExportPdf}
                    >
                        Export PDF
                    </Button>
                </div>
            </section>

            <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <p className='text-xs text-slate-500 uppercase'>Total Bookings</p>
                    <p className='text-2xl font-bold text-slate-800 mt-1'>{summary.total}</p>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <p className='text-xs text-amber-700 uppercase'>Pending</p>
                    <p className='text-2xl font-bold text-amber-700 mt-1'>{summary.pending}</p>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <p className='text-xs text-emerald-700 uppercase'>Attended</p>
                    <p className='text-2xl font-bold text-emerald-700 mt-1'>{summary.attended}</p>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-4'>
                    <p className='text-xs text-rose-700 uppercase'>Cancelled</p>
                    <p className='text-2xl font-bold text-rose-700 mt-1'>{summary.cancelled}</p>
                </div>
            </section>

            <section className='bg-white rounded-xl shadow-sm border border-slate-100 p-4 lg:p-5'>


                <PaginatedSearchTable<Booking>
                    items={reports}
                    headers={[
                        { name: 'Patient', position: 'left' },
                        { name: 'Email', position: 'left' },
                        { name: 'Date', position: 'center' },
                        { name: 'Time', position: 'center' },
                        { name: 'Reason', position: 'left' },
                        { name: 'Status', position: 'center' },
                    ]}
                    searchBy={(item) => `${item.schedule_code} ${item.fname} ${item.lname} ${item.mname} ${item.email} ${item.booking_reason}`}
                    renderRow={(r) => (
                        <tr key={r.id} className='border-b duration-300 hover:bg-slate-50 text-sm'>
                            <td className='py-3 px-4 font-medium text-slate-800'>
                                {r.lname}, {r.fname}{r.mname ? ` ${r.mname}` : ''}
                            </td>
                            <td className='py-3 px-4 text-slate-700'>{r.email}</td>
                            <td className='text-center py-3'>{r.date ? convertShortDate(r.date) : '-'}</td>
                            <td className='text-center py-3'>{formatTime(r.start_time)} - {formatTime(r.end_time)}</td>
                            <td className='py-3 px-4 text-slate-700'>{r.booking_reason || '-'}</td>
                            <td className='text-center py-3'>
                                {Number(r.status) === 2 ? (
                                    <span className='inline-flex items-center rounded-full bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold'>Cancelled</span>
                                ) : Number(r.status) === 1 ? (
                                    <span className='inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold'>Attended</span>
                                ) : (
                                    <span className='inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold'>Pending</span>
                                )}
                            </td>
                        </tr>
                    )}
                    itemsPerPage={10}
                    searchPlaceholder='Search patient information'
                    onRefresh={() => refetch()}
                    isLoading={isFetching}
                />
            </section>
        </div>
    );
}

ReportsPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
export default ReportsPage;
