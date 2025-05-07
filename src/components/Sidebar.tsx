import { Calendar, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../images/logo.svg?react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  to: string;
}

const SidebarItem = ({
  icon,
  label,
  isActive = false,
  to,
}: SidebarItemProps) => {
  return (
    <Link to={to}>
      <div
        className={`flex items-center gap-3 px-5 py-3 mx-3 my-1 cursor-pointer transition-all rounded-md ${isActive ? "bg-[#DCE5B8] shadow-sm" : "hover:bg-white/50"}`}
      >
        <div className="text-charcoal">{icon}</div>
        <span
          className={`text-charcoal ${isActive ? "font-semibold" : "font-medium"}`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="h-screen w-64 bg-groom-cream flex flex-col py-6 border-r border-[#E0E0E0]">
      <div className="px-8 mb-6">
        <Logo className="mb-4 h-10 w-32" />
      </div>
      <div className="flex-1 px-2">
        <SidebarItem
          icon={<Calendar size={20} strokeWidth={1.5} />}
          label="Appointments"
          isActive={path === "/appointments"}
          to="/appointments"
        />
        <SidebarItem
          icon={<Settings size={20} strokeWidth={1.5} />}
          label="Shift Management"
          isActive={path === "/"}
          to="/"
        />
      </div>
    </div>
  );
};

export default Sidebar;
