import { Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { format, parse } from "date-fns";
import CopyWorkingHoursModal from "./CopyWorkingHoursModal";
import DateOverrideDrawer from "./DateOverrideDrawer";
import DateOverrideHistoryTable from "./DateOverrideHistoryTable";
import OngoingOverrides from "./OngoingOverrides";
import { StaffMember } from "./StaffTableRow";
import TimePicker from "./TimePicker";
import { debounce } from "lodash";
import useApi from "@/api";
import { convertTo24HourFormat, convertTo12HourFormat } from "@/lib/utils";

interface ShiftScheduleEditorProps {
  staffMember: StaffMember;
  updateStaffMember: (staffMember: StaffMember) => void;
}

interface DaySchedule {
  id?: number;
  is_working: boolean;
  start_time: string;
  end_time: string;
  day_of_week: string;
  shift_schedule: string;
}

const ShiftScheduleEditor = ({
  staffMember,
  updateStaffMember,
}: ShiftScheduleEditorProps) => {
  const api = useApi();

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
    staffMember?.weekly_shifts?.map((day, index) => {
      return {
        id: day?.id,
        day_of_week: day.day_of_week,
        is_working: day?.is_working, // Mon-Fri working by default
        start_time: day?.start_time,
        end_time: day?.end_time,
        shift_schedule: "Weekly",
      };
    })
  );

  // Determine which days have working hours (for the copy modal)
  const daysWithWorkingHours = days.filter(
    (day) => schedules?.find(schedule=>schedule.day_of_week===day)?.is_working
  );

  const handleCopyClick = (index: number) => {
    setActiveDayIndex(index);
    setIsCopyModalOpen(true);
  };

  const handleApplyCopy = async (selectedDays: string[]) => {
    const activeDaySchedule = schedules?.find(
      (day) => day.day_of_week === days[activeDayIndex!]
    );
    
    
    
    try {
      const res = await Promise.all(
        selectedDays.map(async (day) => {
          const isSchedulePresent=schedules?.find(schedule=>schedule.day_of_week===day)
          if (!isSchedulePresent) {
            if (!activeDaySchedule?.is_working) {
              const createRes = await api.tcps.createShiftData(staffMember.id, {
                day_of_week: day,
                is_working: false,
                start_time: null,
                end_time: null,
              });
              return createRes.data;
            }
            const createRes = await api.tcps.createShiftData(staffMember.id, {
              day_of_week: day,
              is_working: true,
              start_time: activeDaySchedule?.start_time,
              end_time: activeDaySchedule?.end_time,
            });
            return createRes.data;
          }
          if (!activeDaySchedule?.is_working) {
            const editRes = await api.tcps.editShiftData(isSchedulePresent.id, {
              ...isSchedulePresent,
              tcp_id: staffMember.id,
              is_working: false,
              start_time: null,
              end_time: null,
            });
            return editRes.data;
          }
          const editRes = await api.tcps.editShiftData(isSchedulePresent.id, {
            ...isSchedulePresent,
            tcp_id: staffMember.id,
            is_working: true,
            start_time: activeDaySchedule?.start_time,
            end_time: activeDaySchedule?.end_time,
          });
          return editRes.data;
        })
      );

      // Update staff member with new data
      const updatedWeeklyShifts = staffMember.weekly_shifts?.map((schedule: any) => {
        const updatedSchedule = res.find((newSchedule: any) => 
          newSchedule.day_of_week === schedule.day_of_week
        );
        if (updatedSchedule) {
          return {
            ...schedule,
            ...updatedSchedule,
            tcp_id: staffMember.id,
          };
        }
        return schedule;
      });

      // Add new schedules that don't exist yet
      const existingDayNames = staffMember.weekly_shifts?.map((s: any) => s.day_of_week) || [];
      const newSchedules = res.filter((schedule: any) => 
        !existingDayNames.includes(schedule.day_of_week)
      );

      updateStaffMember({
        ...staffMember,
        weekly_shifts: [...(updatedWeeklyShifts || []), ...newSchedules],
      });

      console.log(selectedDays, "selectedDays");
      console.log(
        `Copying hours from ${days[activeDayIndex!]} to:`,
        selectedDays
      );
    } catch (error) {
      console.error("Error copying schedule:", error);
    }
  };

  // Convert 12-hour time format to 24-hour format using date-fns

  const handleSaveDateOverrides = async (dateOverrides: any[]) => {
    // Here you would implement the logic to save the date overrides
    console.log("Saving date overrides:", dateOverrides);
    try {
      const res = await Promise.all(
        dateOverrides.map(async (override) => {
          return (
            await api.tcps.createScheduleOverride(staffMember.id, {
              override_date: format(override.date, "yyyy-MM-dd"),
              override_type: override?.is_working ? "working" : "not_working",
              start_time: override.workingHours?.startTime
                ? override.workingHours.startTime
                : null,
              end_time: override.workingHours?.endTime
                ? override.workingHours.endTime
                : null,
            })
          )?.data;
        })
      );

      const staffMemberData = {
        ...staffMember,
        schedule_overrides: [...staffMember.schedule_overrides, ...res],
      };
      updateStaffMember(staffMemberData);
    } catch (err) {
      console.error("Error saving date overrides:", err);
    }
  };

  // Sample history data - in a real app, this would come from an API or database

  const handleWorkingChange = (index: number, is_working: boolean) => {
    const oldSchedule=schedules?.find(schedule=>schedule.day_of_week===days[index])
    
    setSchedules((prev) => {
      if(oldSchedule){
        debouncedScheduleSave({ ...oldSchedule, is_working });
        return prev?.map(schedule=>{
          if(schedule.id===oldSchedule.id){
            return {
              ...oldSchedule,
              is_working
            }
          }
          return schedule
        })
      }
      debouncedScheduleSave({ is_working, day_of_week:days[index], start_time:null, end_time:null, shift_schedule:"Weekly" });
      return [...prev,{
        is_working:is_working,
        day_of_week:days[index],
        start_time:null,
        end_time:null,
        shift_schedule:"Weekly"
      }];
    });
  };

  const debouncedScheduleSave = useCallback(
    debounce(async (schedule: DaySchedule) => {
      try {
        if (!schedule?.id) {
         let res= await api.tcps.createShiftData(staffMember.id, {
            ...schedule,
          });
          updateStaffMember({...staffMember,weekly_shifts:[...staffMember.weekly_shifts,{
            ...schedule,
            id:res?.data?.id,
            tcp_id:staffMember?.id
          }]})
          return
        }
        if (!schedule?.is_working) {
          let res= await api.tcps.editShiftData(schedule.id, {
            ...schedule,
            tcp_id:staffMember.id,
            start_time: null,
            end_time: null,
          });
          updateStaffMember({...staffMember,weekly_shifts:[...staffMember.weekly_shifts?.map(schedule=>{
            if(schedule.id===res?.data?.id){
              return {
                ...res?.data,
              }
            }
            return schedule
          })]})
          return;
        }
        if (!schedule.start_time || !schedule.end_time) {
          return;
        }

        let res=await api.tcps.editShiftData(schedule.id, {...schedule,tcp_id:staffMember.id});
        updateStaffMember({...staffMember,weekly_shifts:[...staffMember.weekly_shifts?.map(schedule=>{
          if(schedule.id===res?.data?.id){
            return {
              ...res?.data,
            }
          }
          return schedule
        })]})
        return;
      } catch (error) {
        console.error("Error saving schedule:", error);
      }
    }, 1000),
    [staffMember]
  );

  const handleTimeChange = (
    index: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    const oldSchedule = schedules?.find(schedule => schedule.day_of_week === days[index]);
    
    setSchedules((prev) => {
      if (oldSchedule) {
        debouncedScheduleSave({ ...oldSchedule, [field]: convertTo24HourFormat(value) });
        return prev?.map(schedule => {
          if (schedule.id === oldSchedule.id) {
            return {
              ...oldSchedule,
              [field]: convertTo24HourFormat(value)
            };
          }
          return schedule;
        });
      }
      debouncedScheduleSave({ 
        is_working: true,
        [field]: convertTo24HourFormat(value), 
        day_of_week: days[index], 
        start_time: field === "start_time" ? convertTo24HourFormat(value) : null,
        end_time: field === "end_time" ? convertTo24HourFormat(value) : null,
        shift_schedule: "Weekly" 
      });
      return [...prev, {
        is_working: true,
        [field]: convertTo24HourFormat(value),
        day_of_week: days[index],
        start_time: field === "start_time" ? convertTo24HourFormat(value) : null,
        end_time: field === "end_time" ? convertTo24HourFormat(value) : null,
        shift_schedule: "Weekly"
      }];
    });
  };
  useEffect(() => {
    setSchedules(
      staffMember?.weekly_shifts?.map((day, index) => {
        return {
          id: day?.id,
          day_of_week: day.day_of_week,
          is_working: day?.is_working, // Mon-Fri working by default
          start_time: day?.start_time,
          end_time: day?.end_time,
          shift_schedule: "Weekly",
        };
      })
    );
  }, [staffMember]);

  return (
    <div className="w-full h-full bg-white rounded-lg border border-neutral-200 p-6">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">
        {staffMember?.first_name ? `${staffMember?.first_name}'s` : "Member's"}{" "}
        regular working hours
      </h2>
      {/* Rotating Frequency Dropdown */}
      {/* <div className="mb-8">
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
      </div> */}
      {/* Day Schedule Blocks */}
      <div className="space-y-4">
        {days.map((day, index) => {
          const schedule=schedules?.find(schedule=>schedule.day_of_week===day)
        
          return(
          <div
            key={day}
            className="flex items-center justify-between p-3 rounded-md bg-neutral-50"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`day-${index}`}
                className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500"
                checked={schedule?.is_working}
                onChange={(e) => handleWorkingChange(index, e.target.checked)}
              />
              <div>
                <label
                  htmlFor={`day-${index}`}
                  className="font-medium text-neutral-900"
                >
                  {day}
                </label>
                {!schedule?.is_working ? (
                  <p className="text-sm text-neutral-500">
                    Not working on {day}
                  </p>
                ) : (
                  <div className="flex gap-2 mt-1">
                    <TimePicker
                      value={convertTo12HourFormat(
                        schedule.start_time
                      )}
                      onChange={(time) =>
                        handleTimeChange(index, "start_time", time)
                      }
                      disabled={!schedule?.is_working}
                    />
                    <span className="text-sm">–</span>
                    <TimePicker
                      value={convertTo12HourFormat(schedule.end_time)}
                      onChange={(time) =>
                        handleTimeChange(index, "end_time", time)
                      }
                      disabled={!schedule?.is_working}
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
          </div>)
        })}
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
          <OngoingOverrides staffMember={staffMember} />
        ) : (
          <DateOverrideHistoryTable staffMember={staffMember} />
        )}
      </div>
      {/* Copy Working Hours Modal */}
      <CopyWorkingHoursModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        onApply={handleApplyCopy}
       
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
