import React from "react";
import Modal from "./ui/modal";
import { Button } from "./ui/button";
import { StaffMember } from "./StaffTableRow";

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onDelete: (staff: StaffMember) => void;
}

const DeleteStaffModal = ({
  isOpen,
  onClose,
  staff,
  onDelete,
}: DeleteStaffModalProps) => {
  if (!staff) return null;

  const handleDelete = () => {
    onDelete(staff);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Staff Member">
      <div className="flex flex-col items-center space-y-6 py-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Are you sure you want to delete this staff member?
          </h3>
          <p className="text-gray-600">
            {staff.first_name} {staff.last_name}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 w-full justify-center">
          <Button variant="outline" onClick={onClose} className="min-w-[100px]">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="min-w-[100px]"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteStaffModal;
