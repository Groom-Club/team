import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  className?: string;
}

const TimePicker = ({
  value,
  onChange,
  disabled = false,
  className = "",
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeOptions = generateTimeOptions();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    onChange(inputValue);
  };

  const handleTimeSelect = (time: string) => {
    setInputValue(time);
    onChange(time);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`flex items-center w-full cursor-${disabled ? "not-allowed" : "pointer"}`}
        onClick={toggleDropdown}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          className={`w-20 px-2 py-1 text-sm border border-neutral-200 rounded ${disabled ? "bg-neutral-100 text-neutral-400" : "bg-white"}`}
          readOnly
        />
        <div className="absolute right-1 pointer-events-none text-neutral-400">
          <ChevronDown size={14} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-24 max-h-48 overflow-y-auto bg-white border border-neutral-200 rounded shadow-lg">
          {timeOptions.map((time, index) => (
            <div
              key={index}
              className="px-2 py-1 text-sm hover:bg-neutral-100 cursor-pointer"
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function generateTimeOptions() {
  const options: string[] = [];
  const periods = ["AM", "PM"];

  for (let period of periods) {
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour;
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute} ${period}`);
      }
    }
  }

  return options;
}

export default TimePicker;
