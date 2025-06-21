import { Calendar, Users, Settings, TestTube } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../images/logo.svg?react";

function GroomClubSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-6">
        <Logo className="mb-4 h-10 w-32" />
      </div>
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/appointments"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${path === "/appointments" ? "bg-[#DCE5B8] text-[#5F6C37]" : "text-neutral-700 hover:bg-neutral-100"}`}
            >
              <Calendar
                size={18}
                className={`mr-2 ${path === "/appointments" ? "text-[#5F6C37]" : "text-neutral-500"}`}
              />
              Appointments
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${path === "/" ? "bg-[#DCE5B8] text-[#5F6C37]" : "text-neutral-700 hover:bg-neutral-100"}`}
            >
              <Users
                size={18}
                className={`mr-2 ${path === "/" ? "text-[#5F6C37]" : "text-neutral-500"}`}
              />
              Shift Management
            </Link>
          </li>
          <li>
            <Link
              to="/pricing-appointments"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${path === "/pricing-appointments" ? "bg-[#DCE5B8] text-[#5F6C37]" : "text-neutral-700 hover:bg-neutral-100"}`}
            >
              <Settings
                size={18}
                className={`mr-2 ${path === "/pricing-appointments" ? "text-[#5F6C37]" : "text-neutral-500"}`}
              />
              Pricing & Appointments
            </Link>
          </li>
          <li>
            <Link
              to="/testing"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${path === "/testing" ? "bg-[#DCE5B8] text-[#5F6C37]" : "text-neutral-700 hover:bg-neutral-100"}`}
            >
              <TestTube
                size={18}
                className={`mr-2 ${path === "/testing" ? "text-[#5F6C37]" : "text-neutral-500"}`}
              />
              Testing
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default GroomClubSidebar;
