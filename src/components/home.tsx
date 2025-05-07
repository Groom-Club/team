import api from "@/api";
import { useEffect, useState } from "react";
import AddNewStaffButton from "./AddNewStaffButton";
import AddNewStaffMember from "./AddNewStaffMember";
import ShiftScheduleEditor from "./ShiftScheduleEditor";
import StaffListPanel from "./StaffListPanel";
import StaffTable from "./StaffTable";
import Modal from "./ui/modal";



function Home() {
  const [activeTab, setActiveTab] = useState("shifts");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [tcps, setTcps] = useState([]);
  const [activeStaff,setActiveStaff]=useState(0)  
  const gettcps = async () => {
    try {
      let res = await api.tcps.getTcps();
      setTcps(res || []);
      setActiveStaff(res?.[0].id)
    } catch (error) {
      console.error("Error getting shift data:", error);
      setTcps([]);
    }
  };

  useEffect(() => {
    gettcps();
  }, []);

  const handleOpenAddStaffModal = () => setIsAddStaffModalOpen(true);
  const handleCloseAddStaffModal = () => setIsAddStaffModalOpen(false);
  const handleSaveStaff = () => {
    // Handle save logic here
    console.log("Saving staff member");
    handleCloseAddStaffModal();
  };

  return (
    <div className="w-full h-full">
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-neutral-900">
            Shift Management
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-white rounded-lg border border-neutral-200 p-1 w-fit">
          <button
            className={`px-4 py-2 rounded-md text-[#2E2F33] font-medium ${activeTab === "shifts" ? "bg-[#FCF9F5] shadow-sm" : "hover:bg-neutral-50"}`}
            onClick={() => setActiveTab("shifts")}
          >
            Staff Shift Management
          </button>
          <button
            className={`px-4 py-2 rounded-md text-[#2E2F33] font-medium ${activeTab === "members" ? "bg-[#FCF9F5] shadow-sm" : "hover:bg-neutral-50"}`}
            onClick={() => setActiveTab("members")}
          >
            Staff Members ({tcps?.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "members" ? (
          <>
            <div className="flex justify-end mb-4">
              <AddNewStaffButton onClick={handleOpenAddStaffModal} />
            </div>
            <StaffTable staffData={tcps} setStaffData={setTcps} />
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <StaffListPanel staffData={tcps} activeStaffId={activeStaff} onSelectStaff={setActiveStaff} />
            </div>
            <div className="lg:col-span-2">
              <ShiftScheduleEditor staffMember={tcps?.find(tcp=>tcp.id===activeStaff)} />
            </div>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddStaffModalOpen}
        onClose={handleCloseAddStaffModal}
        title="Add new staff member"
        onSave={handleSaveStaff}
      >
        <AddNewStaffMember onSave={handleSaveStaff} />
      </Modal>
    </div>
  );
}

export default Home;
