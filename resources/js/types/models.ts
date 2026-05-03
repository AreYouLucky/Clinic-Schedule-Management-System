
export interface Booking {
  id: number;
  fname: string;
  lname: string;
  mname?: string | null;
  email: string;
  contact: string;
  schedule_code: string;
  booking_reason?: string | null;
  additional_info?: string | null;
  paid_amount?: string | number | null;
  created_at?: string;
  updated_at?: string;
  month_code?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  is_available?: number | boolean;
  status: number | boolean;
}

export interface DailySchedule {
  id: number;
  month_code: string;
  date: string;
  schedule_code: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  status: number;
  is_active: number;
}

export interface DateDisabled {
  month_code: string;
  date: string;
  reason?: string | null;
}

export interface MonthlySchedule {
  id: number;
  month_code: string;
  month: number; // 1 - 12
  year: number;
  available_count?: number
  status: string;
  is_active: boolean;
}

export interface MonthScheduleSettings {
  month_code: string;

  opening_time: string;
  closing_time: string;

  noon_break_start?: string | null;
  noon_break_end?: string | null;
}

export interface WeeklyDisabledDate {
  month_code: string;
  day_code: number;
}



export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type ScheduleSlot = {
  start: string;
  end: string;
  date: string;
  status: boolean;
};

export type ScheduleSlotUpdate = {
  id: number;
  start: string;
  end: string;
  date: string;
  status: boolean;
  schedule_code: string;
};

export type ScheduleFormType = {
  month: number | null;
  dayoffs: number[];
  year: number | null;
  opening_time: string | null;
  closing_time: string | null;
  noon_break_start: string | null;
  noon_break_end: string | null;
  time_per_session: number | null;
  schedules: ScheduleSlot[];
};

