import { ScheduleFormType, ScheduleSlot } from "@/types/models";
export const timeToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

export const minutesToTime = (mins: number) => {
    const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
};

export const formatDate = (year: number, month: number, day: number) => {
    const d = new Date(year, month - 1, day);
    return d.toISOString().split("T")[0];
};

export const canGenerateSchedule = (item: ScheduleFormType) => {
    return (
        item.month !== null &&
        item.year !== null &&
        item.dayoffs.length >= 0 &&
        item.opening_time &&
        item.closing_time &&
        item.time_per_session !== null
    );
};
export const generateMonthlySchedules = (
    item: ScheduleFormType
): ScheduleSlot[] => {

    const month = Number(item.month);
    const year = Number(item.year);
    const session = Number(item.time_per_session);

    if (
        !month ||
        !year ||
        !item.opening_time ||
        !item.closing_time ||
        !session ||
        isNaN(session)
    ) {
        return [];
    }

    const open = Number(timeToMinutes(item.opening_time));
    const close = Number(timeToMinutes(item.closing_time));

    if (isNaN(open) || isNaN(close) || open >= close) {
        return [];
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const breakStartRaw =
        item.noon_break_start && item.noon_break_start !== ""
            ? Number(timeToMinutes(item.noon_break_start))
            : null;

    const breakEndRaw =
        item.noon_break_end && item.noon_break_end !== ""
            ? Number(timeToMinutes(item.noon_break_end))
            : null;

    const hasValidBreak =
        breakStartRaw !== null &&
        breakEndRaw !== null &&
        !isNaN(breakStartRaw) &&
        !isNaN(breakEndRaw) &&
        breakStartRaw < breakEndRaw;

    const breakStart = hasValidBreak ? breakStartRaw : null;
    const breakEnd = hasValidBreak ? breakEndRaw : null;
    const dayoffs: number[] = (item.dayoffs ?? []).map(Number);
    const schedules: ScheduleSlot[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const current = new Date(year, month - 1, day);
        if (current < today) continue;
        const weekday = current.getDay();
        if (dayoffs.includes(weekday)) continue;

        const dateStr = formatDate(year, month, day);

        const ranges =
            breakStart !== null && breakEnd !== null
                ? [
                    { start: open, end: breakStart },
                    { start: breakEnd, end: close },
                ]
                : [{ start: open, end: close }];

        for (const range of ranges) {
            let cursor = range.start;

            while (cursor + session <= range.end) {
                const next = cursor + session;

                schedules.push({
                    start: minutesToTime(cursor),
                    end: minutesToTime(next),
                    date: dateStr,
                    status: true,
                });

                cursor = next;
            }
        }
    }
    return schedules;
};



export const filterSchedulesByDate = (
    schedules: ScheduleSlot[],
    selected?: Date
) => {
    if (!selected) return [];

    const dateStr = selected.toISOString().split("T")[0];

    return schedules.filter((s) => s.date === dateStr);
};

export const toggleScheduleStatus = (
    setItem: React.Dispatch<React.SetStateAction<ScheduleFormType>>,
    target: ScheduleSlot
) => {
    setItem((prev) => ({
        ...prev,
        schedules: prev.schedules.map((s) =>
            s.date === target.date &&
                s.start === target.start &&
                s.end === target.end
                ? { ...s, status: !s.status }
                : s
        ),
    }));
};

