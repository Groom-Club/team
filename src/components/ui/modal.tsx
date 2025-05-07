import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveButtonText?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  saveButtonText = "Save",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-2xl font-bold text-groom-charcoal">{title}</h2>
          <div className="flex items-center gap-4">
            {onSave && (
              <button
                onClick={onSave}
                className="bg-groom-charcoal text-white hover:bg-groom-charcoal/90 px-4 py-2 rounded-md font-medium"
              >
                {saveButtonText}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
