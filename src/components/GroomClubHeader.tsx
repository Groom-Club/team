import { UserButton } from "@clerk/clerk-react";

function GroomClubHeader() {
  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-6 flex justify-between items-center">
      <div></div>
      <div className="flex items-center">
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8",
              userButtonTrigger: "focus:outline-none"
            }
          }}
        />
      </div>
    </header>
  );
}

export default GroomClubHeader;
