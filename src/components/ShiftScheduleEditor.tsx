import { ChevronDown, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import CopyWorkingHoursModal from "./CopyWorkingHoursModal";
import DateOverrideDrawer from "./DateOverrideDrawer";
import DateOverrideHistoryTable from "./DateOverrideHistoryTable";
import TimePicker from "./TimePicker";
import { StaffMember } from "./StaffTableRow";

interface ShiftScheduleEditorProps {
  staffMember: StaffMember;
}

interface DaySchedule {
  is_working: boolean;
  start_time: string;
  end_time: string;
}

const ShiftScheduleEditor = ({ staffMember }: ShiftScheduleEditorProps) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const [isDateOverrideDrawerOpen, setIsDateOverrideDrawerOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState<"ongoing" | "history">("ongoing");
  const [schedules, setSchedules] = useState<DaySchedule[]>(
    staffMember?.weekly_shifts?.map((day) => {
      return {
        is_working: day?.is_working, // Mon-Fri working by default
        start_time: day?.start_time,
        end_time: day?.end_time,
      };
    })
  );

  // Determine which days have working hours (for the copy modal)
  const daysWithWorkingHours = days.filter(
    (_, index) => schedules?.[index].is_working
  );

  const handleCopyClick = (index: number) => {
    setActiveDayIndex(index);
    setIsCopyModalOpen(true);
  };

  const handleApplyCopy = (selectedDays: string[]) => {
    // Here you would implement the logic to copy the working hours
    // from the active day to the selected days
    console.log(
      `Copying hours from ${days[activeDayIndex!]} to:`,
      selectedDays
    );
  };

  const handleSaveDateOverrides = (dateOverrides: any[]) => {
    // Here you would implement the logic to save the date overrides
    console.log("Saving date overrides:", dateOverrides);
  };

  // Sample history data - in a real app, this would come from an API or database
  const [historyData, setHistoryData] = useState([
    {
      date: new Date(2023, 11, 25), // Christmas
      workingHours: null, // Not working
    },
    {
      date: new Date(2023, 11, 31), // New Year's Eve
      workingHours: {
        start_time: "9:00 AM",
        end_time: "3:00 PM",
        serviceArea: "Haircut",
      },
    },
    {
      date: new Date(2024, 0, 1), // New Year's Day
      workingHours: null, // Not working
    },
    {
      date: new Date(2024, 1, 14), // Valentine's Day
      workingHours: {
        start_time: "10:00 AM",
        end_time: "7:00 PM",
        serviceArea: "All services",
      },
    },
  ]);

  const handleWorkingChange = (index: number, is_working: boolean) => {
    setSchedules((prev) => {
      const newSchedules = [...prev];
      newSchedules[index] = {
        ...newSchedules?.[index],
        is_working,
      };
      return newSchedules;
    });
  };

  const handleTimeChange = (
    index: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    setSchedules((prev) => {
      const newSchedules = [...prev];
      newSchedules[index] = {
        ...newSchedules?.[index],
        [field]: value,
      };
      return newSchedules;
    });
  };
  useEffect(() => {
    setSchedules(
      staffMember?.weekly_shifts?.map((day) => {
        return {
          is_working: day?.is_working, // Mon-Fri working by default
          start_time: day?.start_time,
          end_time: day?.end_time,
        };
      })
    );
  }, [staffMember]);
  console.log(staffMember, "props", schedules);

  return (
    <div className="w-full h-full bg-white rounded-lg border border-neutral-200 p-6">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">
        {staffMember?.first_name}'s regular working hours
      </h2>
      {/* Rotating Frequency Dropdown */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Rotating frequency
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-md border border-neutral-200 bg-white py-2 pl-3 pr-10 text-neutral-900 focus:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-300"
            defaultValue="weekly"
          >
            <option value="weekly">Every week</option>
            <option value="biweekly">Every two weeks</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
      {/* Day Schedule Blocks */}
      <div className="space-y-4">
        {days.map((day, index) => (
          <div
            key={day}
            className="flex items-center justify-between p-3 rounded-md bg-neutral-50"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`day-${index}`}
                className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500"
                checked={schedules?.[index].is_working}
                onChange={(e) => handleWorkingChange(index, e.target.checked)}
              />
              <div>
                <label
                  htmlFor={`day-${index}`}
                  className="font-medium text-neutral-900"
                >
                  {day}
                </label>
                {!schedules?.[index].is_working ? (
                  <p className="text-sm text-neutral-500">
                    Not working on {day}
                  </p>
                ) : (
                  <div className="flex gap-2 mt-1">
                    <TimePicker
                      value={schedules?.[index].start_time}
                      onChange={(time) =>
                        handleTimeChange(index, "start_time", time)
                      }
                      disabled={!schedules?.[index].is_working}
                    />
                    <span className="text-sm">–</span>
                    <TimePicker
                      value={schedules?.[index].end_time}
                      onChange={(time) =>
                        handleTimeChange(index, "end_time", time)
                      }
                      disabled={!schedules?.[index].is_working}
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              className="text-neutral-400 hover:text-neutral-600"
              onClick={() => handleCopyClick(index)}
              aria-label={`Copy ${day} working hours`}
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
      {/* Date Override Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <div className="flex space-x-6 mb-[-1px]">
              <button
                className={`px-4 py-3 ${
                  activeTab === "ongoing"
                    ? "text-[#2E2F33] font-bold border-b-2 border-neutral-900"
                    : "text-[#9CA3AF] font-normal hover:text-neutral-700"
                } rounded-none`}
                onClick={() => setActiveTab("ongoing")}
              >
                Ongoing
              </button>
              <button
                className={`px-4 py-3 ${
                  activeTab === "history"
                    ? "text-[#2E2F33] font-bold border-b-2 border-neutral-900"
                    : "text-[#9CA3AF] font-normal hover:text-neutral-700"
                } rounded-none`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-200"></div>
          </div>
          {activeTab === "ongoing" && (
            <button
              className="text-neutral-700 font-medium hover:text-neutral-900"
              onClick={() => setIsDateOverrideDrawerOpen(true)}
            >
              + Add date override
            </button>
          )}
        </div>

        {activeTab === "ongoing" ? (
          <div className="bg-[#FCF9F5] border border-neutral-200 rounded-lg p-8 text-center">
            <p className="text-neutral-600">
              Add dates when your availability changes from your regular working
              hours.
            </p>
          </div>
        ) : (
          <DateOverrideHistoryTable historyData={historyData} />
        )}
      </div>
      {/* Copy Working Hours Modal */}
      <CopyWorkingHoursModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        onApply={handleApplyCopy}
        availableDays={daysWithWorkingHours}
      />
      {/* Date Override Drawer */}
      <DateOverrideDrawer
        isOpen={isDateOverrideDrawerOpen}
        onClose={() => setIsDateOverrideDrawerOpen(false)}
        staffName={staffMember?.first_name}
        staffId={staffMember?.id}
        onSave={handleSaveDateOverrides}
      />
    </div>
  );
};

export default ShiftScheduleEditor;
