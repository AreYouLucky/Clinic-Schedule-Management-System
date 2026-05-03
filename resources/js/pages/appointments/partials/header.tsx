
import {  CreditCard, Users } from 'lucide-react';


export default function AppointmentHeader({ no_schedules, total_paid }: { no_schedules: number, total_paid: number }) {
    return (
        <section className='relative overflow-hidden rounded-lg border border-sky-200/80 bg-sky-700  p-6 text-white  lg:p-8'>
            <div className='absolute -right-12 -top-12 h-40 w-40 rounded-lg bg-white/10 blur-2xl' />
            <div className='absolute bottom-0 right-0 h-32 w-32 translate-x-10 translate-y-10 rounded-lg bg-cyan-200/20 blur-2xl' />
            <div className='relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between'>
                <div className='max-w-2xl space-y-3'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight lg:text-4xl'>Clinic Appointments</h1>
                        <p className='mt-2 max-w-xl text-sm leading-6 text-sky-50/90 lg:text-base'>
                            Manage patient bookings, confirm arrivals, record payments, and keep daily visit flow organized in one place.
                        </p>
                    </div>
                </div>
                <div className='grid gap-3 sm:grid-cols-2 xl:min-w-105'>
                    <div className='rounded-lg border border-white/20 bg-white/12 p-4 backdrop-blur-sm'>
                        <div className='flex items-center justify-between text-sky-50/80'>
                            <span className='text-xs uppercase tracking-[0.18em]'>Total Bookings</span>
                            <Users size={16} />
                        </div>
                        <p className='mt-3 text-3xl font-semibold'>{no_schedules}</p>
                    </div>
                    <div className='rounded-lg border border-white/20 bg-white/12 p-4 backdrop-blur-sm'>
                        <div className='flex items-center justify-between text-sky-50/80'>
                            <span className='text-xs uppercase tracking-[0.18em]'>Collected</span>
                            <CreditCard size={16} />
                        </div>
                        <p className='mt-3 text-3xl font-semibold'>PHP {total_paid}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
