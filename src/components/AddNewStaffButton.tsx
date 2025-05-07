import { Plus } from "lucide-react";

interface AddNewStaffButtonProps {
  onClick?: () => void;
}

const AddNewStaffButton = ({ onClick }: AddNewStaffButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-2.5 bg-groom-charcoal hover:bg-opacity-90 text-white rounded-full transition-colors shadow-sm"
    >
      <Plus size={16} />
      <span className="font-medium">Add new staff</span>
    </button>
  );
};

export default AddNewStaffButton;
