import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function generateYears(): number[] {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + 5;

  const years: number[] = [];
  for (let year = currentYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

export function generateMonths(): { month: string; code: string }[] {
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  return months.map((month, index) => ({
    month,
    code: String(index + 1).padStart(2, '0')
  }));
}

export function generateWeekDays(): { day: string; code: number }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return days.map((day, index) => ({
    day,
    code: index
  }));
}


export function convertShortDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function convertLongDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}



export const formatMoney = (value:number) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0.00";
  }

  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};