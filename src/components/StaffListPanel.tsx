import { StaffMember } from "./StaffTableRow";

interface StaffListPanelProps {
  staffData: StaffMember[];
  activeStaffId?: number;
  onSelectStaff?: (staffId: number) => void;
}

const StaffListPanel = ({
  staffData,
  activeStaffId=0,
  onSelectStaff = () => {},
}: StaffListPanelProps) => {
  return (
    <div className="w-full h-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="p-4 border-b border-neutral-100">
        <h2 className="text-lg font-semibold text-neutral-900">
          Staff Members
        </h2>
      </div>
      <div className="overflow-y-auto max-h-full">
        {staffData.map((staff) => (
          <div
            key={staff.id}
            className={`flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-neutral-50 ${activeStaffId === staff.id ? "bg-[#FCF9F5] shadow-sm" : ""}`}
            onClick={() => onSelectStaff(staff.id)}
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: getAvatarColor(staff.id) }}
            >
              {staff?.first_name?.[0]}{staff?.last_name?.[0]}
            </div>
            <div>
              <p className="font-medium text-neutral-900">{staff?.first_name}{""}{staff?.last_name}</p>
              <p className="text-sm text-neutral-500">{staff.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Function to generate consistent avatar colors based on staff ID
const getAvatarColor = (id: number) => {
  const colors = [
    "#F3E6BC", // Yellow
    "#DCE5B8", // Green
    "#EACBAC", // Red/Orange
    "#C2D1E8", // Blue
    "#E2D4E9", // Purple
  ];

  // Simple hash function to get a consistent color for each ID
  const colorIndex = id % colors.length;
  return colors[colorIndex];
};

export default StaffListPanel;
