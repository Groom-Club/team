import { useState } from "react";
import StaffTableRow, { StaffMember } from "./StaffTableRow";
import EditStaffModal from "./EditStaffModal";
import DeleteStaffModal from "./DeleteStaffModal";
import useApi from "@/api";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  staffData: StaffMember[];
  setStaffData: (val: any) => void;
  gettcps: () => Promise<void>;
};
const StaffTable = ({ staffData, setStaffData, gettcps }: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const api = useApi();
  const { toast } = useToast();

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleDeleteStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedStaff(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStaff(null);
  };

  const handleSaveStaff = async (updatedStaff: StaffMember) => {
    await gettcps();
    handleCloseModal();
  };

  const handleConfirmDelete = async (staffToDelete: StaffMember) => {
    let res = await api.tcps.deleteStaffMember(staffToDelete.id);
    handleCloseDeleteModal();
    setStaffData(staffData.filter((staff) => staff.id !== staffToDelete.id));

    // Show success toast
    toast({
      title: "Success",
      description: "User has been deleted successfully",
      variant: "default",
    });
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
              <th className="px-3 py-3">Max travel time</th>
              <th className="px-3 py-3">Buffer time (minutes)</th>
              <th className="px-3 py-3">Status</th>
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
                  onDeleteStaff={handleDeleteStaff}
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
      <DeleteStaffModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        staff={selectedStaff}
        onDelete={handleConfirmDelete}
      />
    </>
  );
};

export default StaffTable;
