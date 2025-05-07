import { useState } from "react";
import Modal from "./ui/modal";
import AddNewStaffMember from "./AddNewStaffMember";
import { StaffMember } from "./StaffTableRow";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onSave?: (updatedStaff: StaffMember) => void;
}

const EditStaffModal = ({
  isOpen,
  onClose,
  staff,
  onSave,
}: EditStaffModalProps) => {
  const [updatedStaff, setUpdatedStaff] = useState<StaffMember | null>(staff);

  const handleSave = () => {
    if (updatedStaff && onSave) {
      onSave(updatedStaff);
    }
    onClose();
  };

  if (!staff) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Staff: ${staff.name}`}
      onSave={handleSave}
      saveButtonText="Save Changes"
    >
      <AddNewStaffMember onSave={handleSave} />
    </Modal>
  );
};

export default EditStaffModal;
