import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertTo24HourFormat = (time: string): string => {
  if (!time) return time;
  
  try {
    // Parse the time string (e.g., "9:00 AM") to a Date object
    const parsedTime = parse(time, 'h:mm a', new Date());
    // Format it to 24-hour format (HH:mm)
    return format(parsedTime, 'HH:mm');
  } catch (error) {
    console.error('Error parsing time:', time, error);
    return time;
  }
};
export const convertTo12HourFormat = (time: string): string => {
  if (!time) return time;
  const parsedTime = parse(time, 'HH:mm', new Date());
  return format(parsedTime, 'h:mm a');
};
