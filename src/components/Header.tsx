import DropdownMenu from "./DropdownMenu";

const Header = () => {
  return (
    <div className="flex justify-end items-center p-6 border-b border-neutral-200 bg-white">
      <DropdownMenu />
    </div>
  );
};

export default Header;
