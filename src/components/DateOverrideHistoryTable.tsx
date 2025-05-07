import { format } from "date-fns";

interface WorkingHours {
  start_time: string;
  end_time: string;
  serviceArea?: string;
}

interface DateOverride {
  date: Date;
  workingHours: WorkingHours | null; // null means not working
}

interface DateOverrideHistoryTableProps {
  historyData: DateOverride[];
}

const DateOverrideHistoryTable = ({
  historyData,
}: DateOverrideHistoryTableProps) => {
  if (historyData.length === 0) {
    return (
      <div className="bg-[#FCF9F5] border border-neutral-200 rounded-lg p-8 text-center">
        <p className="text-neutral-600">No history of date overrides found.</p>
      </div>
    );
  }

  return (
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
              Service Area
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((override, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
            >
              <td className="py-3 px-4 text-sm text-neutral-700">
                {format(override.date, "MMM d, yyyy")}
              </td>
              <td className="py-3 px-4 text-sm text-neutral-700">
                {override.workingHours
                  ? `${override.workingHours.start_time} – ${override.workingHours.end_time}`
                  : "Not working"}
              </td>
              <td className="py-3 px-4 text-sm text-neutral-700">
                {override.workingHours?.serviceArea || "—"}
              </td>
              <td className="py-3 px-4 text-sm">
                {override.workingHours ? (
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                    Available
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                    Unavailable
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DateOverrideHistoryTable;
