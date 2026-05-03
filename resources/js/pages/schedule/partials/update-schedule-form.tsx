import React, { useMemo, useState, useEffect } from 'react'
import { DailySchedule, ScheduleSlotUpdate } from '@/types/models'
import { usePage } from '@inertiajs/react'
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { formatDate, formatLocalDate, parseDateString } from './utils';
import { useHandleChange } from '@/hooks/use-handle-change';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useUpdateSchedule } from '../hooks/hooks';
import { FaSave } from 'react-icons/fa';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Schedules', href: '/view-schedules' },
  { title: 'Update Schedule Form', href: '/schedule/create' },
];


function UpdateScheduleForm() {

  const { props } = usePage<{ schedules?: DailySchedule[] | null, weeky_disabled?: number[], month_code?: string }>()
  const schedules = props.schedules ?? []
  const weeky_disabled = props.weeky_disabled ?? []
  const month_code = props.month_code ?? ""
  const disabledWeekDays = (weeky_disabled ?? []).map(Number);
  const { item, setItem } = useHandleChange<{ schedules: ScheduleSlotUpdate[] }>({
    schedules: []
  })


  const formattedSchedules: ScheduleSlotUpdate[] = useMemo(() => {
    return schedules.map((slot) => ({
      id: slot.id,
      date: slot.date,
      start: slot.start_time.slice(0, 5),
      end: slot.end_time.slice(0, 5),
      status: slot.status === 1,
      schedule_code: slot.schedule_code
    }))
  }, [schedules])

  useEffect(() => {
    setItem(prev => ({
      ...prev,
      schedules: formattedSchedules
    }))
  }, [formattedSchedules])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (formattedSchedules.length > 0) {
      setSelectedDate(parseDateString(formattedSchedules[0].date))
    }
  }, [formattedSchedules])

  const daySchedules = useMemo(() => {
    if (!selectedDate) return []

    const formatted = formatLocalDate(selectedDate)

    return item.schedules.filter(s => s.date === formatted)

  }, [item.schedules, selectedDate])

  const toggleSlot = (slotId: number) => {
    setItem(prev => ({
      ...prev,
      schedules: prev.schedules.map(slot =>
        slot.id === slotId
          ? { ...slot, status: !slot.status }
          : slot
      )
    }))
  }

  const toggleAllForDate = (checked: boolean) => {
    if (!selectedDate) return

    const formatted = formatDate(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      selectedDate.getDate()
    )

    setItem(prev => ({
      ...prev,
      schedules: prev.schedules.map(slot =>
        slot.date === formatted
          ? { ...slot, status: checked }
          : slot
      )
    }))
  }

  const isAllChecked = daySchedules.length > 0 &&
    daySchedules.every(s => s.status === true)

  const updateSchedule = useUpdateSchedule()

  const updateScheduleFn = () => {
    updateSchedule.mutate({
      month_code,
      schedules: item.schedules
    }, {
      onSuccess: () => {
        toast.success('Schedule updated successfully');
        window.location.href = '/view-schedules';
      },
      onError: (err) => {
        toast.error(err.response?.data?.message ?? 'Something went wrong');
      }
    })
  }

  return (
    <section className='w-full p-4'>
      <div className="space-y-6 p-2 md:p-4 lg:p-6 bg-white rounded-2xl">
        <div>
          <h1 className='text-2xl font-bold text-sky-500'>
            Update Schedule
          </h1>
          <p className='text-sm text-slate-500'>
            Manage available time slots and schedule status.
          </p>
        </div>

        <div className="flex lg:flex-row flex-col gap-6">

          {/* Calendar */}
          <div className='border h-fit rounded-2xl overflow-hidden'>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={[
                { dayOfWeek: disabledWeekDays ?? [] }
              ]}
              month={
                item.schedules.length
                  ? parseDateString(item.schedules[0].date)
                  : undefined
              }
              classNames={{
                month: "bg-white p-4 rounded-2xl shadow-md",
                caption: "flex justify-between items-center mb-4",
                caption_label: "font-semibold text-lg text-gray-800",
                nav: "hidden",
                table: "w-full border-collapse",
                head_cell: "text-gray-400 text-sm font-medium",
                cell: "text-center p-1",
                day: "h-10 w-10  hover:bg-blue-100   rounded-full transition",
                selected: `bg-sky-500 text-white rounded-full`,
                day_disabled: "text-gray-200 line-through",
              }}
            />
          </div>

          {/* Schedule Grid */}
          <div className="flex-1">

            {daySchedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Select a date to manage schedules.
              </p>
            ) : (
              <>
                {/* Toggle All */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">
                    Open on selected date?
                  </span>
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={(e) => toggleAllForDate(e.target.checked)}
                  />
                </div>

                {/* Slots */}
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                  {daySchedules.map((slot) => (
                    <label
                      key={slot.id}
                      className="border rounded-lg p-3 flex items-center justify-between"
                    >
                      <span>
                        {slot.start} - {slot.end}
                      </span>

                      <input
                        type="checkbox"
                        checked={slot.status}
                        onChange={() => toggleSlot(slot.id)}
                      />
                    </label>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

        <Button
          onClick={updateScheduleFn}
          disabled={updateSchedule.isPending}
          className="bg-sky-500 mt-4"
        > {updateSchedule.isPending ? <Spinner className="mr-2 h-4 w-4 animate-spin" /> : <FaSave className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>

      </div>
    </section>
  )
}


UpdateScheduleForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
export default UpdateScheduleForm
