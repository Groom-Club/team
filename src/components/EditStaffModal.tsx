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
  console.log({staff})



  const handleSave = (newStaff?: StaffMember) => {
    if (newStaff && onSave) {
      onSave(newStaff);
    }
    onClose();
  };

  if (!staff) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Staff: ${staff.first_name} ${staff.last_name}`}
    >
      <AddNewStaffMember onSave={handleSave} selectedStaff={staff} />
    </Modal>
  );
};

export default EditStaffModal;
