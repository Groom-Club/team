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
 // Helper function to format military time strings to readable format
export const formatTime = (timeString: string) => {
  // Create a date object with the time string (assuming today's date)
  const today = new Date();
  const [hours, minutes] = timeString.split(":").map(Number);
  const dateWithTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hours,
    minutes
  );
  return format(dateWithTime, "h:mm a");
};
export const formatTimeToMilitary = (timeString: string) => {
  if (!timeString) return null;
  
  try {
    // Parse the time string (e.g., "12:15 PM", "9:30 AM")
    const parsedTime = parse(timeString, "h:mm a", new Date());
    
    // Format to HH:mm (24-hour format)
    return format(parsedTime, "HH:mm");
  } catch (error) {
    console.error("Error parsing time string:", timeString, error);
    return null;
  }
};