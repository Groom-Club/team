import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface AutoCompleteSelectProps {
  id?: string;
  options: {
    label: string;
    value: string;
    [key: string]: any;
  }[];
  value: string[] | null;
  onChange: (value: string[], rest?: { [key: string]: any }) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  disabled?: boolean;
  emptyDataComponent?: (
    searchQuery: string,
    onClose: () => void
  ) => React.ReactNode;
  multiple?: boolean;
  withoutSearch?: boolean;
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
  emptyDataComponent,
  multiple = false,
  withoutSearch = false,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = options.filter((opt) => value?.includes(opt.value) || false);

  React.useEffect(() => {
    if (!multiple && selected.length > 0) {
      setSearchQuery(selected[0].label);
    }
  }, [selected, multiple]);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  const handleSearch = (query: string) => {
    if (disabled) return;
    setSearchQuery(query);
    onSearch?.(query);
    setShowSuggestions(true);
  };

  const handleSelect = (option: (typeof options)[0]) => {
    const { value: optionValue, ...rest } = option;

    if (multiple) {
      const currentValues = value || [];
      const isSelected = currentValues.includes(optionValue);

      let newValues: string[];
      if (isSelected) {
        // Remove if already selected
        newValues = currentValues.filter((v) => v !== optionValue);
      } else {
        // Add if not selected
        newValues = [...currentValues, optionValue];
      }

      onChange(newValues, { ...rest });
      setSearchQuery(""); // Clear search query for multiple selection
    } else {
      // Single selection
      onChange([optionValue], { ...rest });
      setSearchQuery(option.label);
      setShowSuggestions(false);
    }
  };

  const handleRemoveSelected = (selectedValue: string) => {
    if (disabled || !value) return;
    const newValues = value.filter((v) => v !== selectedValue);
    onChange(newValues);
    setSearchQuery(""); // Clear search query when removing items
  };

  const filteredOptions = options.filter((option) => {
    if (withoutSearch) {
      // Show all options when withoutSearch is true
      if (multiple) {
        // For multiple selection, don't show already selected items in dropdown
        const isSelected = value?.includes(option.value) || false;
        return !isSelected;
      }
      return true;
    }

    const matchesSearch = option.label
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (multiple) {
      // For multiple selection, don't show already selected items in dropdown
      const isSelected = value?.includes(option.value) || false;
      return matchesSearch && !isSelected;
    }
    return matchesSearch;
  });

  const getDisplayValue = () => {
    if (multiple) {
      return searchQuery;
    }
    return searchQuery;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          `flex items-center ${
            leftIcon || rightIcon ? "px-2" : ""
          } w-full gap-2 border border-primary rounded-md bg-white min-h-[40px]`,
          !multiple && value && value.length > 0 && "p-1",
          containerClassName
        )}
      >
        {leftIcon}

        {/* Selected items display for both single and multiple selection */}
        {value && value.length > 0 && (
          <div className="flex flex-wrap gap-1 p-1">
            {selected.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
              >
                {item.label}
                <button
                  type="button"
                  onClick={() => handleRemoveSelected(item.value)}
                  disabled={disabled}
                  className={cn(
                    "ml-1.5 text-gray-500 hover:text-gray-700 font-medium",
                    disabled &&
                      "text-gray-300 cursor-not-allowed hover:text-gray-300"
                  )}
                  aria-label={`Remove ${item.label}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {((!multiple && (!value || value.length === 0)) || multiple) && (
          <Input
            ref={inputRef}
            id={id}
            type="text"
            value={getDisplayValue()}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => !disabled && setShowSuggestions(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex-1 w-full p-0 px-2 bg-white border-none focus:outline-none h-auto!",
              disabled && "bg-gray-50 cursor-not-allowed",
              className
            )}
          />
        )}
        {rightIcon}
      </div>

      {showSuggestions && (searchQuery || withoutSearch) && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-30 overflow-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>
          ) : filteredOptions.length === 0 ? (
            emptyDataComponent ? (
              emptyDataComponent(searchQuery, () => setShowSuggestions(false))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options found
              </div>
            )
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
