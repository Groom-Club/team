import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Trash,
} from "lucide-react";
import TimePicker from "./TimePicker";
import { format, addMonths, subMonths, isSameDay, getDay,isBefore, } from "date-fns";
import { Button } from "./ui/button";

interface WorkingHours {
  startTime: string;
  endTime: string;
}

interface DateOverride {
  is_working: boolean;
  date: Date;
  workingHours: WorkingHours | null; // null means not working
}

interface DateOverrideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  staffName?: string;
  staffId?: number;
  onSave: (dateOverrides: DateOverride[]) => void;
}

const DateOverrideDrawer = ({
  isOpen,
  onClose,
  staffName,
  staffId,
  onSave,
}: DateOverrideDrawerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([]);
  // Service areas removed as per requirements

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    if (isSameDay(selectedDate, date)) {
      return;
    }
    setSelectedDate(date);
    if(selectedDates.some((d)=>isSameDay(d,date))){
      return
    }
    setSelectedDates([...selectedDates, date]);
    setDateOverrides([
      ...dateOverrides,
      {
        date,
        workingHours: null,
        is_working: false,
      },
    ]);
  };

  // Check if staff normally works on a given day
  const staffNormallyWorks = (date: Date): boolean => {
    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = getDay(date);
    // Assume staff works Monday-Friday (1-5)
    return dayOfWeek > 0 && dayOfWeek < 6;
  };

  // Add or update working hours for a date
  const handleAddWorkingHours = (date: Date) => {
    const existingOverrideIndex = dateOverrides.findIndex((override) =>
      isSameDay(override.date, date)
    );

    const defaultWorkingHours = {
      startTime: "9:00 AM",
      endTime: "5:00 PM",
    };

    if (existingOverrideIndex === -1) {
      // Add new override
      setDateOverrides([
        ...dateOverrides,
        {
          date,
          workingHours: defaultWorkingHours,
          is_working: true,
        },
      ]);
    } else {
      // Update existing override if it was set to not working
      const updatedOverrides = [...dateOverrides];
      if (updatedOverrides[existingOverrideIndex].workingHours === null) {
        updatedOverrides[existingOverrideIndex].workingHours =
          defaultWorkingHours;
        updatedOverrides[existingOverrideIndex].is_working = true;
        setDateOverrides(updatedOverrides);
      }
    }
  };

  // Remove working hours for a date
  const handleRemoveWorkingHours = (date: Date) => {
    const existingOverrideIndex = dateOverrides.findIndex((override) =>
      isSameDay(override.date, date)
    );

    if (existingOverrideIndex !== -1) {
      const updatedOverrides = [...dateOverrides];
      updatedOverrides[existingOverrideIndex].workingHours = null;
      setDateOverrides(updatedOverrides);
    }
  };

  // Update working hours for a date
  const handleUpdateWorkingHours = (
    date: Date,
    field: keyof WorkingHours,
    value: string
  ) => {
    const existingOverrideIndex = dateOverrides.findIndex((override) =>
      isSameDay(override.date, date)
    );

    if (
      existingOverrideIndex !== -1 &&
      dateOverrides[existingOverrideIndex].workingHours
    ) {
      const updatedOverrides = [...dateOverrides];
      updatedOverrides[existingOverrideIndex].workingHours = {
        ...updatedOverrides[existingOverrideIndex].workingHours!,
        [field]: value,
      };
      setDateOverrides(updatedOverrides);
    }
  };

  // Get working hours for a date
  const getWorkingHoursForDate = (date: Date): WorkingHours | null => {
    const override = dateOverrides.find((override) =>
      isSameDay(override.date, date)
    );
    return override ? override.workingHours : null;
  };

  const handleSave = () => {
    onSave(dateOverrides);
    onClose();
    setSelectedDate(null)
    setSelectedDates([])
    setDateOverrides([])
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Total days in the month
    const daysInMonth = lastDay.getDate();

    // Array to hold all calendar days
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };
  const handleRemoveDate=(date:Date)=>{
    setDateOverrides(dateOverrides.filter((override)=>!isSameDay(override.date,date)))
    setSelectedDates(selectedDates.filter((d)=>!isSameDay(d,date)))
    setSelectedDate(null)
  }

  const calendarDays = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[450px] bg-white h-full overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 text-neutral-500 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
          <div className="ml-8">
            <h2 className="text-2xl font-bold text-groom-charcoal mb-2">
              Add date override
            </h2>
            <p className="text-neutral-600">
              Date override updates the working hours and online booking
              availability.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* User Preview */}
          <div className="bg-neutral-50 rounded-xl p-4 flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-bold mr-3">
              {staffName.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-neutral-900">{staffName}</p>
              <p className="text-sm text-neutral-500">Owner</p>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Select the override date(s)
            </label>

            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-lg font-medium text-neutral-900">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                onClick={handleNextMonth}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Weekday Headers */}
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm text-neutral-500 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day ? (
                    <button
                      onClick={() => handleDateClick(day)}
                      className={`w-full h-full flex items-center justify-center rounded-full text-sm disabled:opacity-50 ${
                        isSameDay(day, selectedDate || new Date(0))
                          ? "bg-groom-yellow text-groom-charcoal"
                          : selectedDates.some((d) => isSameDay(d, day))
                          ? "bg-groom-yellow/30 text-groom-charcoal"
                          : "hover:bg-neutral-100"
                      }`}
                      disabled={isBefore(day,new Date())}
                    >
                      {day.getDate()}
                    </button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Working Hours Section */}
          {selectedDate && (
            <div className="mb-6 border border-neutral-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-neutral-900 mb-3">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDate(selectedDate)}
                >
                  <Trash2
                    size={16}
                    className="text-neutral-400 hover:text-neutral-600"
                  />
                </Button>
              </div>

              {/* Working Hours Content */}
              {(() => {
                const workingHours = getWorkingHoursForDate(selectedDate);
                const normallyWorks = staffNormallyWorks(selectedDate);

                if (workingHours) {
                  // Show editable working hours
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="block text-sm font-medium text-neutral-700">
                          Working hours
                        </label>
                        <button
                          onClick={() => handleRemoveWorkingHours(selectedDate)}
                          className="text-neutral-400 hover:text-neutral-600"
                          aria-label="Remove working hours"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex gap-2 items-center mb-4">
                        <TimePicker
                          value={workingHours.startTime}
                          onChange={(time) =>
                            handleUpdateWorkingHours(
                              selectedDate,
                              "startTime",
                              time
                            )
                          }
                        />
                        <span className="text-sm">–</span>
                        <TimePicker
                          value={workingHours.endTime}
                          onChange={(time) =>
                            handleUpdateWorkingHours(
                              selectedDate,
                              "endTime",
                              time
                            )
                          }
                        />
                      </div>

                      {/* Service Area Dropdown removed as per requirements */}
                    </div>
                  );
                } else {
                  // Show not working message with add button
                  return (
                    <div className="flex flex-col gap-2">
                      <p className="text-neutral-600">
                        Not working on {format(selectedDate, "MM/dd/yyyy EEEE")}
                      </p>
                      <button
                        onClick={() => handleAddWorkingHours(selectedDate)}
                        className="text-neutral-700 underline hover:text-neutral-900 flex items-center gap-1 w-fit"
                      >
                        <Plus size={16} />
                        <span>Add working hours</span>
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={()=>{
              setSelectedDate(null)
              setSelectedDates([])
              setDateOverrides([])
              onClose()
            }}
            className="px-4 py-2 border border-neutral-200 rounded-md text-neutral-700 hover:bg-neutral-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedDates.length === 0}
            className={`px-4 py-2 rounded-md font-medium ${
              selectedDates.length === 0
                ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                : "bg-groom-charcoal text-white hover:bg-groom-charcoal/90"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateOverrideDrawer;
