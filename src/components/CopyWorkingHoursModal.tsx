import React from "react";
import Modal from "./ui/modal";

interface CopyWorkingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedDays: string[]) => void;
  
}

const CopyWorkingHoursModal = ({
  isOpen,
  onClose,
  onApply,
}: CopyWorkingHoursModalProps) => {
  const allDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [selectAll, setSelectAll] = React.useState(false);

  // Reset selections when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedDays([]);
      setSelectAll(false);
    }
  }, [isOpen]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDays([]);
    } else {
      setSelectedDays([...allDays]);
    }
    setSelectAll(!selectAll);
  };

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedDays, day];
      setSelectedDays(newSelected);
      setSelectAll(newSelected.length === allDays.length);
    }
  };

  const handleApply = () => {
    onApply(selectedDays);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Copy">
      <div className="flex flex-col space-y-6">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Copy working hours
          </h3>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500"
              />
              <label
                htmlFor="select-all"
                className="ml-3 font-medium text-neutral-900"
              >
                All days
              </label>
            </div>

            {allDays.map((day) => {
             
              return (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  
                    className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500"
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className={`ml-3 text-neutral-900`}
                  >
                    {day}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-full bg-groom-charcoal text-white hover:bg-groom-charcoal/90"
            disabled={selectedDays.length === 0}
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CopyWorkingHoursModal;
