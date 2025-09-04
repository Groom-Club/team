import { format } from "date-fns";
import { StaffMember } from "./StaffTableRow";
import { toDate } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import DateOverrideDrawer from "./DateOverrideDrawer";
import useApi from "@/api";
import { formatTime, formatTimeToMilitary } from "@/lib/utils";

type Props = {
  staffMember: StaffMember;
  updateStaffMember?: (staffMember: StaffMember) => void;
};

interface ScheduleOverride {
  id: number;
  override_date: string;
  override_type: string;
  start_time: string;
  end_time: string;
}

const OngoingOverrides = ({ staffMember, updateStaffMember }: Props) => {
  const [deleteOverrideId, setDeleteOverrideId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingOverride, setEditingOverride] =
    useState<ScheduleOverride | null>(null);
  const api = useApi();


  const OngoingOverrides: ScheduleOverride[] =
    staffMember?.schedule_overrides?.filter(
      (override) => toDate(override.override_date) >= new Date()
    );
  const sortedOverrides = useMemo(
    () =>
      OngoingOverrides?.sort((a, b) =>
        a.override_date.localeCompare(b.override_date)
      ),
    [OngoingOverrides]
  );

  const handleEditOverride = (override: ScheduleOverride) => {
    setEditingOverride(override);
    setIsEditDrawerOpen(true);
  };

  const handleDeleteOverride = (overrideId: number) => {
    setDeleteOverrideId(overrideId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteOverrideId) {
      try {
        await api.tcps.deleteScheduleOverride(deleteOverrideId);

        // Update local state
        if (updateStaffMember) {
          const updatedStaffMember = {
            ...staffMember,
            schedule_overrides: staffMember.schedule_overrides.filter(
              (override) => override.id !== deleteOverrideId
            ),
          };
          updateStaffMember(updatedStaffMember);
        }

        setDeleteOverrideId(null);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting override:", error);
        // You could add a toast notification here for better UX
      }
    }
  };

  const cancelDelete = () => {
    setDeleteOverrideId(null);
    setIsDeleteModalOpen(false);
  };

  const handleEditSave = async (dateOverrides: any[]) => {
    if (editingOverride && dateOverrides.length > 0) {
      try {
      
        const override = dateOverrides[0]; // We're editing a single override

        const updatedOverrideData = {
          tcp_id: staffMember.id, // Include tcp_id for backend API
          override_date: format(override.date, "yyyy-MM-dd"),
          override_type: override.is_working ? "working" : "not_working",
          start_time: formatTimeToMilitary(override.workingHours?.startTime) || null,
          end_time: formatTimeToMilitary(override.workingHours?.endTime) || null,
        };

        await api.tcps.editScheduleOverride(
          editingOverride.id,
          updatedOverrideData
        );

        // Update local state
        if (updateStaffMember) {
          const updatedStaffMember = {
            ...staffMember,
            schedule_overrides: staffMember.schedule_overrides.map((override) =>
              override.id === editingOverride.id
                ? {
                    ...override,
                    override_date: updatedOverrideData.override_date,
                    override_type: updatedOverrideData.override_type,
                    start_time: updatedOverrideData.start_time || "",
                    end_time: updatedOverrideData.end_time || "",
                  }
                : override
            ),
          };
          updateStaffMember(updatedStaffMember);
        }

        // Close drawer and reset state
        setIsEditDrawerOpen(false);
        setEditingOverride(null);
      } catch (error) {
        console.error("Error updating override:", error);
        // You could add a toast notification here for better UX
      }
    }
  };

  const handleEditClose = () => {
    setIsEditDrawerOpen(false);
    setEditingOverride(null);
  };

  if (OngoingOverrides?.length) {
    return (
      <>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
                  Working Hours
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOverrides?.map((override, index) => {
                const isWorking = override.override_type === "working";
                return (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                  >
                    <td className="py-3 px-4 text-sm text-neutral-700">
                      {format(override.override_date, "MMM d, yyyy")}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-700">
                      {isWorking
                        ? `${formatTime(override.start_time)} – ${formatTime(
                            override.end_time
                          )}`
                        : "Not working"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOverride(override)}
                          className="h-8 px-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOverride(override.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        <AlertDialog
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Override</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this schedule override? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDelete}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Override Drawer */}
        {editingOverride && (
          <DateOverrideDrawer
            isOpen={isEditDrawerOpen}
            onClose={handleEditClose}
            staffName={staffMember?.first_name}
            staffId={staffMember?.id}
            onSave={handleEditSave}
            editingOverride={editingOverride}
          />
        )}
      </>
    );
  }
  return (
    <div className="bg-[#FCF9F5] border border-neutral-200 rounded-lg p-8 text-center">
      <p className="text-neutral-600">
        Add dates when your availability changes from your regular working
        hours.
      </p>
    </div>
  );
};

export default OngoingOverrides;
