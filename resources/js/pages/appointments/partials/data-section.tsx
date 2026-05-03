import React from 'react'
import { CalendarDays, CheckCircle2, Clock3, CreditCard } from 'lucide-react';
export default function DataSection({ pendingCount, attendedCount, paidCount, selectedDate, convertShortDate }: { pendingCount: number; attendedCount: number; paidCount: number; selectedDate: string; convertShortDate: (date: string) => string }) {
  return (
    <section className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
                <div className='rounded-lg border border-sky-200 bg-white p-4 shadow-sm shadow-sky-100/40'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-500'>Pending</p>
                            <p className='mt-2 text-3xl font-semibold text-slate-900'>{pendingCount}</p>
                        </div>
                        <div className='rounded-2xl bg-amber-50 p-3 text-amber-600'>
                            <Clock3 size={18} />
                        </div>
                    </div>
                </div>
                <div className='rounded-2xl border border-sky-200 bg-white p-4 shadow-sm shadow-sky-100/40'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-500'>Attended</p>
                            <p className='mt-2 text-3xl font-semibold text-slate-900'>{attendedCount}</p>
                        </div>
                        <div className='rounded-2xl bg-emerald-50 p-3 text-emerald-600'>
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                </div>
                <div className='rounded-2xl border border-sky-200 bg-white p-4 shadow-sm shadow-sky-100/40'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-500'>Paid</p>
                            <p className='mt-2 text-3xl font-semibold text-slate-900'>{paidCount}</p>
                        </div>
                        <div className='rounded-2xl bg-cyan-50 p-3 text-cyan-600'>
                            <CreditCard size={18} />
                        </div>
                    </div>
                </div>
                <div className='rounded-2xl border border-sky-200 bg-white p-4 shadow-sm shadow-sky-100/40'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-500'>Filter Date</p>
                            <p className='mt-2 text-lg font-semibold text-slate-900'>{selectedDate ? convertShortDate(selectedDate) : 'All Dates'}</p>
                        </div>
                        <div className='rounded-2xl bg-sky-50 p-3 text-sky-700'>
                            <CalendarDays size={18} />
                        </div>
                    </div>
                </div>
            </section>
  )
}
