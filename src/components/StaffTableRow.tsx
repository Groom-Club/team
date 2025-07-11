import { MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import StaffTableRowDropdown from "./StaffTableRowDropdown";

export interface StaffMember {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  initials: string;
  capacity?: number;
  travelTime?: number;
  maxTravelTime?: number;
  bufferTime?: number;
  startLocation?: string;
  endLocation?: string;
  proBreeds?: string[];
  conBreeds?: string[];
  max_travel_time_mins?: string;
  max_travel_time_from_start_geo_location_mins?: string;
  buffer_time_mins?: string;
  weekly_shifts: {
    created_at?: number;
    day_of_week: string;
    end_time?: string;
    id: number;
    is_working: boolean;
    start_time?: string;
    tcp_id: number;
  }[];
  schedule_overrides: {
    end_time: string;
    id: number;
    override_date: string;
    override_type: string;
    start_time: string;
    tcp_id: number;
  }[];
}

interface StaffTableRowProps {
  staff: StaffMember;
  onEditStaff?: (staff: StaffMember) => void;
}

const StaffTableRow = ({ staff, onEditStaff }: StaffTableRowProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent opening the modal if clicking on the dropdown button
    if (
      dropdownTriggerRef.current &&
      dropdownTriggerRef.current.contains(e.target as Node)
    ) {
      return;
    }

    if (onEditStaff) {
      onEditStaff(staff);
    }
  };

  return (
    <tr
      className="border-b border-neutral-200 hover:bg-neutral-50 cursor-pointer"
      onClick={handleRowClick}
    >
      <td className="py-4 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white text-xs">
            {staff.first_name?.[0]}
            {staff.last_name?.[0]}
          </div>
          <div>
            <div className="font-medium text-neutral-900">
              {staff.first_name}
              {""}
              {staff.last_name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 text-neutral-700">{staff.email}</td>
      <td className="px-3 py-4 text-neutral-700">{staff?.capacity}</td>
      <td className="px-3 py-4 text-neutral-700">
        {staff?.max_travel_time_mins}
      </td>
      <td className="px-3 py-4 text-neutral-700">
        {staff?.max_travel_time_from_start_geo_location_mins}
      </td>
      <td className="px-3 py-4 text-neutral-700">{staff?.buffer_time_mins}</td>
      <td className="py-4 pl-3 pr-6">
        <div className="flex justify-end">
          <button
            ref={dropdownTriggerRef}
            className="p-1 rounded-full hover:bg-neutral-100"
            onClick={toggleDropdown}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <MoreVertical size={18} className="text-neutral-500" />
          </button>
          <StaffTableRowDropdown
            isOpen={isDropdownOpen}
            onClose={closeDropdown}
            triggerRef={dropdownTriggerRef}
          />
        </div>
      </td>
    </tr>
  );
};

export default StaffTableRow;
