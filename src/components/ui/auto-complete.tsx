import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { X } from "lucide-react";

interface AutoCompleteSelectProps {
  id?: string;
  options: {
    label: string;
    value: string;
    [key: string]: any;
  }[];
  value: any[] | null;
  onChange: (value: any[], rest?: { [key: string]: any }) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export const AutoCompleteSelect: React.FC<AutoCompleteSelectProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  className,
  onSearch,
  isLoading = false,
  leftIcon,
  rightIcon,
  containerClassName,
  disabled = false,
  multiple = true,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedValues = value || [];
  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

  React.useEffect(() => {
    if (!multiple && selectedOptions.length > 0) {
      setSearchQuery(selectedOptions[0].label);
    }
  }, [selectedOptions, multiple]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
    setShowSuggestions(true);
  };

  const handleSelect = (option: (typeof options)[0]) => {
    const { value: optionValue, ...rest } = option;
    
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues, { ...rest });
      setSearchQuery("");
    } else {
      onChange([optionValue], { ...rest });
      setSearchQuery(option.label);
      setShowSuggestions(false);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    onChange(newValues);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!multiple || !selectedValues.includes(option.value))
  );

  return (
    <div className="relative">
      <div
        className={cn(
          `flex items-center ${
            leftIcon || rightIcon ? "px-2" : ""
          } w-full gap-2 border border-input rounded-md bg-white min-h-[40px]`,
          containerClassName
        )}
      >
        {leftIcon}
        
        {/* Selected items display */}
        {multiple && selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-1 p-1">
            {selectedOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
              >
                <span>{option.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(option.value)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={multiple && selectedOptions.length > 0 ? "Add more..." : placeholder}
          className={cn(
            "flex-1 w-full bg-white border-none h-auto!",
            className
          )}
          disabled={disabled}
        />
        {rightIcon}
      </div>
      
      {showSuggestions && searchQuery && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-30 overflow-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                  selectedValues.includes(option.value) && "bg-blue-50 text-blue-600"
                )}
                onClick={() => handleSelect(option)}
              >
                {option.label}
                {selectedValues.includes(option.value) && (
                  <span className="ml-2 text-blue-600">✓</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
