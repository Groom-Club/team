import { useState } from "react";
import StaffTableRow, { StaffMember } from "./StaffTableRow";
import EditStaffModal from "./EditStaffModal";

type Props = {
  staffData: StaffMember[];
  setStaffData: (val: any) => void;
};
const StaffTable = ({ staffData, setStaffData }: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedStaff(null);
  };

  const handleSaveStaff = (updatedStaff: StaffMember) => {
    setStaffData(
      staffData.map((staff) =>
        staff.id === updatedStaff.id ? updatedStaff : staff,
      ),
    );
    handleCloseModal();
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 text-left text-sm font-medium text-neutral-500">
              <th className="py-3 pl-6 pr-3">Total Care Partner</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Capacity</th>
              <th className="px-3 py-3">Travel time</th>
              <th className="px-3 py-3">Max travel time</th>
              <th className="px-3 py-3">Buffer time (minutes)</th>
              <th className="py-3 pl-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffData &&
              Array.isArray(staffData) &&
              staffData.map((staff) => (
                <StaffTableRow
                  key={staff.id}
                  staff={staff}
                  onEditStaff={handleEditStaff}
                />
              ))}
          </tbody>
        </table>
      </div>

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        staff={selectedStaff}
        onSave={handleSaveStaff}
      />
    </>
  );
};

export default StaffTable;
