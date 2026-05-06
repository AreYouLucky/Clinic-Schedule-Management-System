import React from 'react'
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ScheduleFormType } from '@/types/models';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useHandleChange } from '@/hooks/use-handle-change';
import { generateYears, generateMonths, generateWeekDays } from '@/lib/utils';
import InputError from '@/components/input-error';
import { MultiSelect } from '@/components/custom/multiselect';
import { Input } from '@/components/ui/input';
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useState, useMemo } from 'react';
import { generateMonthlySchedules, filterSchedulesByDate, toggleScheduleStatus, formatDate } from './utils';
import { UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useCreateSchedule } from '../hooks/hooks';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/custom/confirmation-dialog';
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/view-schedules' },
    { title: 'Schedule Form', href: '/schedule/create' },
];



function ScheduleForm() {
    const { item, setItem, errors, handleChange } = useHandleChange<ScheduleFormType>({
        month: null,
        dayoffs: [],
        year: null,
        opening_time: null,
        closing_time: null,
        noon_break_start: null,
        noon_break_end: null,
        time_per_session: null,
        schedules: []
    });
    const months = generateMonths();
    const years = generateYears();
    const weekDays = generateWeekDays();
    const isScheduleReady =
        item.month !== null &&
        item.year !== null &&
        item.opening_time &&
        item.closing_time &&
        item.time_per_session !== null;
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const generateSchedules = () => {
        const newSchedules = generateMonthlySchedules(item);
        setItem(prev => ({
            ...prev,
            schedules: newSchedules
        }));
    };

    const toggleAllSchedulesForDate = (
        setItem: React.Dispatch<React.SetStateAction<ScheduleFormType>>,
        selectedDate: Date | undefined,
        checked: boolean
    ) => {
        if (!selectedDate) return;

        const weekdayDate = formatDate(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            selectedDate.getDate()
        );

        setItem(prev => ({
            ...prev,
            schedules: prev.schedules.map(slot =>
                slot.date === weekdayDate
                    ? { ...slot, status: checked }
                    : slot
            )
        }));
    };

    const daySchedules = useMemo(
        () => filterSchedulesByDate(item.schedules, selectedDate),
        [item.schedules, selectedDate]
    );

    const isAllChecked = useMemo(() => {
        if (!daySchedules.length) return false;
        return daySchedules.every(s => s.status === true);
    }, [daySchedules]);

    const createSchedule = useCreateSchedule();

    const createScheduleFn = () => {
        createSchedule.mutate(item, {
            onSuccess: () => {
                setShowConfirmation(false);
                toast.success('Schedule created successfully');
                window.location.href = '/view-schedules';
            },
            onError: (err) => {
                toast.error(err.response?.data?.message ?? 'Something went wrong');
            }
        });
    }
    return (
        <div className="space-y-6 p-2 md:p-4 lg:p-6">
            <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm lg:p-10 md:p-6 p-4 space-y-4">
                <div className="flex gap-1 justify-between flex-row mb-5">
                    <div>
                        <h1 className='text-xl font-bold text-sky-700'>
                            Schedule Form
                        </h1>
                        <p className='text-sm text-slate-500'>
                            Configure monthly schedule availability and manage time slots.
                        </p>
                    </div>
                    {isScheduleReady && (
                        <div>
                            <Button onClick={generateSchedules} className='bg-sky-500 shadow-md flex gap-2 items-center border-0'>
                                Generate Time Slots
                            </Button>
                        </div>
                    )}
                </div>
                <section className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Month
                        </Label>

                        <Select
                            value={
                                item.month !== null
                                    ? String(item.month).padStart(2, "0")
                                    : undefined
                            }
                            onValueChange={(value) =>
                                setItem((prev) => ({ ...prev, month: Number(value) }))
                            }
                        >
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>

                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem
                                        key={month.code}
                                        value={month.code.toString()}
                                    >
                                        {month.month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.month as string} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Year
                        </Label>

                        <Select
                            value={item.year !== null ? String(item.year) : undefined}
                            onValueChange={(value) =>
                                setItem((prev) => ({ ...prev, year: Number(value) }))
                            }
                        >
                            <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>

                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.year as string} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Day Off
                        </Label>
                        <MultiSelect
                            options={weekDays}
                            selectedIds={item.dayoffs ?? []}
                            onChange={(values) =>
                                setItem((prev) => ({ ...prev, dayoffs: values as number[] }))
                            }
                            getOptionValue={(o) => o.code}
                            getOptionLabel={(o) => o.day}
                        />
                        <InputError message={errors.dayoffs as string} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Time per Session <span className='font-regular'>(Minutes)</span>
                        </Label>
                        <Input
                            type="number"
                            name='time_per_session'
                            value={item.time_per_session ?? 0}
                            onChange={handleChange}
                        />
                        <InputError message={errors.time_per_session as string} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Opening Time
                        </Label>
                        <Input
                            type="time"
                            name='opening_time'
                            value={item.opening_time ?? ""}
                            onChange={handleChange}
                        />
                        <InputError message={errors.opening_time as string} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Closing Time
                        </Label>
                        <Input
                            type="time"
                            name='closing_time'
                            value={item.closing_time ?? ""}
                            onChange={handleChange}
                        />
                        <InputError message={errors.closing_time as string} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Noon Break Start
                        </Label>
                        <Input
                            type="time"
                            name='noon_break_start'
                            value={item.noon_break_start ?? ""}
                            onChange={handleChange}
                        />
                        <InputError message={errors.noon_break_start as string} />
                    </div>
                    <div className="grid gap-2">
                        <Label className="inc-semibold text-gray-700">
                            Noon Break End
                        </Label>
                        <Input
                            type="time"
                            name='noon_break_end'
                            value={item.noon_break_end ?? ""}
                            onChange={handleChange}
                        />
                        <InputError message={errors.noon_break_end as string} />
                    </div>
                </section>


                {isScheduleReady && item.schedules.length > 0 && (

                    <>
                        <section>
                            <div className="flex lg:flex-row flex-col gap-6">

                                <div className='border rounded-2xl overflow-hidden'>
                                    <DayPicker
                                        mode="single"
                                        month={item.month && item.year ? new Date(item.year, item.month - 1) : undefined}
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={[
                                            { before: new Date() },
                                            { dayOfWeek: item.dayoffs ?? [] }
                                        ]}
                                        classNames={{
                                            month: "bg-white p-4 rounded-2xl shadow-md",
                                            caption: "flex justify-between items-center mb-4",
                                            caption_label: "font-semibold text-lg text-gray-800",
                                            nav: "hidden",
                                            table: "w-full border-collapse",
                                            head_cell: "text-gray-400 text-sm font-medium",
                                            cell: "text-center p-1",
                                            day: "h-10 w-10 rounded-full transition hover:bg-sky-100",
                                            selected: `bg-sky-500 text-white rounded-full`,
                                            day_disabled: "text-gray-200 line-through",
                                        }}
                                    />
                                </div>

                                <div className="flex-1">
                                    {daySchedules.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            Select a date to manage schedules.
                                        </p>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-sm font-medium">
                                                    Open on selected date?
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={isAllChecked}
                                                    onChange={(e) =>
                                                        toggleAllSchedulesForDate(setItem, selectedDate, e.target.checked)
                                                    }
                                                />
                                            </div>
                                            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                                                {daySchedules.map((slot) => (
                                                    <label
                                                        key={`${slot.date}-${slot.start}`}
                                                        className="border rounded-lg p-3 flex items-center justify-between"
                                                    >
                                                        <span>
                                                            {slot.start} - {slot.end}
                                                        </span>

                                                        <input
                                                            type="checkbox"
                                                            checked={slot.status}
                                                            onChange={() =>
                                                                toggleScheduleStatus(setItem, slot)
                                                            }
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                        <section>
                            <Button className='uppercase mt-5 flex items-center gap-2 bg-sky-500'
                                onClick={() => setShowConfirmation(true)}
                                disabled={createSchedule.isPending}>
                                {createSchedule.isPending ? <Spinner /> : <UploadIcon />} Save Slots
                            </Button>
                        </section>
                    </>
                )}
                <ConfirmationDialog show={showConfirmation}
                    message={'Are you sure you want finalize this schedule? (this action cannot be undone)'}
                    type={2} onConfirm={createScheduleFn}
                    onClose={() => setShowConfirmation(false)}
                />
            </div>
        </div>
    );

}

ScheduleForm.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
export default ScheduleForm

