import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileNavBar = () => {
  return (
    <div className="p-6">
      <Link
        to="/"
        className="flex items-center text-[#2E2F33] hover:text-neutral-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span>Back to home page</span>
      </Link>
    </div>
  );
};

export default ProfileNavBar;
