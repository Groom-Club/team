import { ArrowRightToLine, Eye, Trash, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StaffTableRowDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  onEditStaff: () => void;
  onDeleteStaff: () => void;
}

const StaffTableRowDropdown = ({
  isOpen,
  onClose,
  triggerRef,
  onEditStaff,
  onDeleteStaff,
}: StaffTableRowDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

  useEffect(() => {
    // Position the dropdown with overflow detection
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 120; // Approximate height of the dropdown
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Check if dropdown would overflow below the viewport
      const wouldOverflowBelow =
        triggerRect.bottom + dropdownHeight > viewportHeight + scrollY;

      // Determine placement (top or bottom)
      const newPlacement = wouldOverflowBelow ? "top" : "bottom";
      setPlacement(newPlacement);

      // Calculate position based on placement
      let top: number;
      if (newPlacement === "bottom") {
        top = triggerRect.bottom + scrollY + 5;
      } else {
        top = triggerRect.top + scrollY - dropdownHeight - 5;
      }

      setPosition({
        top,
        right: window.innerWidth - triggerRect.right - window.scrollX,
      });
    }

    // Add event listeners for outside clicks and escape key
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 w-auto min-w-[180px] rounded-lg bg-white shadow-md border border-neutral-100"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        <button
          className="flex w-full items-center px-4 py-3 text-sm text-neutral-900 hover:bg-neutral-50 rounded-md mx-1 my-1 focus:outline-none focus:bg-neutral-100"
          role="menuitem"
          tabIndex={0}
          onClick={onEditStaff}
        >
          <Eye size={16} className="mr-3 text-neutral-500" />
          View detail
        </button>
        <button
          className="flex w-full items-center px-4 py-3 text-sm text-red-500 hover:bg-neutral-50 rounded-md mx-1 my-1 focus:outline-none focus:bg-neutral-100"
          role="menuitem"
          tabIndex={2}
          onClick={onDeleteStaff}
        >
          <Trash size={16} className="mr-3 text-red-500" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default StaffTableRowDropdown;
