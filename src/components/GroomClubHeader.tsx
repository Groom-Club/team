import { User, ChevronDown } from "lucide-react";
import { useState } from "react";

function GroomClubHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-6 flex justify-between items-center">
      <div></div>
      <div className="flex items-center">
        <div className="flex items-center relative">
          <div className="w-8 h-8 bg-[#DCE5B8] rounded-full flex items-center justify-center mr-2">
            <User size={16} className="text-[#5F6C37]" />
          </div>
          <div className="mr-2">
            <div className="text-sm font-medium text-neutral-900">
              Tempo Designer
            </div>
            <div className="text-xs text-neutral-500">(Admin)</div>
          </div>
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center p-1 hover:bg-neutral-100 rounded-full focus:outline-none"
          >
            <ChevronDown size={16} className="text-neutral-500" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 z-10">
              <div className="py-1">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default GroomClubHeader;
