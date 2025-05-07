import { ChevronDown, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  userName?: string;
  userInitials?: string;
}

const DropdownMenu = ({
  userName = "Tempo Designer (Admin)",
  userInitials = "TD",
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
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

  const handleProfileClick = () => {
    // Navigate to profile page
    window.location.href = "/profile";
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    console.log("Logout clicked");
    window.location.href = "/stafflogin";
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex flex-col items-end">
          <span className="font-medium text-neutral-800">{userName}</span>
          <span className="text-sm text-neutral-500">Groom Club</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-groom-charcoal flex items-center justify-center text-white font-medium">
          {userInitials}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg py-2 z-10 border border-neutral-100">
          <button
            onClick={handleProfileClick}
            className="flex w-full items-center px-4 py-2 text-sm text-groom-charcoal hover:bg-groom-cream transition-colors duration-150"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </button>
          <div className="my-1 border-t border-neutral-100"></div>
          <button
            onClick={handleLogoutClick}
            className="flex w-full items-center px-4 py-2 text-sm text-groom-charcoal hover:bg-groom-cream transition-colors duration-150"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
