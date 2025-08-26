import { format, toDate } from "date-fns";
import { useMemo, useState } from "react";
import { StaffMember } from "./StaffTableRow";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
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
import useApi from "@/api";
import { toast } from "./ui/use-toast";
import { formatTime } from "@/lib/utils";

type Props = {
  staffMember: StaffMember;
  updateStaffMember?: (staffMember: StaffMember) => void;
};




const HistoryOverrides = ({ staffMember, updateStaffMember }: Props) => {
  const [deleteOverrideId, setDeleteOverrideId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const api = useApi();

  const HistoryOverrides = staffMember?.schedule_overrides?.filter(
    (override) => toDate(override.override_date) < new Date()
  );
  const sortedOverrides = useMemo(
    () =>
      HistoryOverrides?.sort((a, b) =>
        a.override_date.localeCompare(b.override_date)
      ),
    [HistoryOverrides]
  );

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
        // console.error("Error deleting override:", error);
        toast({
          title: "Error deleting override",
          description: "Please try again",
          variant: "destructive",
        });
        // You could add a toast notification here for better UX
      }
    }
  };

  const cancelDelete = () => {
    setDeleteOverrideId(null);
    setIsDeleteModalOpen(false);
  };

  if (HistoryOverrides?.length) {
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

export default HistoryOverrides;
