import React, { useMemo } from 'react'
import AppLayout from '@/layouts/app-layout';
import {  Trash, PlusIcon, Pen } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import PaginatedSearchTable from '@/components/custom/data-table';
import { MonthlySchedule } from '@/types/models';
import { useFetchSchedules } from './hooks/hooks';
import { generateMonths } from '@/lib/utils';
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Schedules', href: '/view-schedules' },
];

type monthProps = {
  code: string,
  month: string,
}
function SchedulesPage() {
  const { data, isFetching, refetch } = useFetchSchedules();
  const months: monthProps[] = generateMonths();
  const schedules = data ?? [];

  return (
    <div className='w-full p-4 space-y-4'>
      <section className='bg-white rounded-xl shadow-sm border border-slate-100 p-5 lg:p-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-xl lg:text-2xl font-bold text-sky-700 mt-1'>Monthly Schedules</h1>
            <p className='text-sm text-slate-700 mt-1'>Track month setup, available slots, and schedule status in one place.</p>
          </div>
          <Link href="/schedules/create" className='bg-sky-700 text-gray-50 px-4 py-2.5 rounded-lg font-semibold uppercase text-sm inline-flex gap-2 items-center justify-center w-full sm:w-auto' >
            <PlusIcon className='w-4 h-4' />
            Create Schedule
          </Link>
        </div>
      </section>
      <section className='bg-white rounded-xl shadow-sm border border-slate-100 p-2 lg:p-4'>
        <PaginatedSearchTable<MonthlySchedule>
          items={schedules}
          headers={[
            { name: "Month Code", position: "center" },
            { name: "Month", position: "center" },
            { name: "Year", position: "center" },
            { name: "Available Slots", position: "center" },
            { name: "Status", position: "center" },
            { name: "Actions", position: "center" },
          ]}
          searchBy={(item) => `${item.month_code} ${item.year}`}
          renderRow={(r) => (
            <tr key={r.id} className="border-b duration-300 hover:bg-slate-50 text-sm">
              <td className='text-center py-3 font-semibold'>{r.month_code}</td>
              <td className='text-center py-3 '>{months.find((m) => Number(m.code) == r.month)?.month}</td>
              <td className='text-center py-3'>{r.year}</td>
              <td className='text-center py-3'>{r.available_count ?? 0}</td>
              <td className='text-center py-3 uppercase font-semibold text-[11px]'> <span className='bg-primary text-white px-3 py-1 rounded-full'>{r.status }</span></td>
              <td className='text-center py-3'>
                <div className='flex items-center justify-center gap-3'>
                  <Link href={`/schedules/${r.month_code}/edit`} className=' rounded-full'>
                    <Pen className='w-4 h-4 text-sky-500' />
                  </Link>
                  <button className='rounded-full'>
                    <Trash className='w-4 h-4 text-red-500' />
                  </button>
                </div>
              </td>
            </tr>
          )}
          itemsPerPage={10}
          searchPlaceholder="Search Month Code"
          onRefresh={() => refetch()}
          isLoading={isFetching}
        />
      </section>
    </div>
  )
}
SchedulesPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
export default SchedulesPage
