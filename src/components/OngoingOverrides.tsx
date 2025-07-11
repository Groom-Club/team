import { format } from "date-fns";
import { StaffMember } from "./StaffTableRow";
import {toDate} from "date-fns"

type Props = {
  staffMember: StaffMember;
};

const OngoingOverrides = ({ staffMember }: Props) => {
  const OngoingOverrides=staffMember?.schedule_overrides?.filter(override=>toDate(override.override_date)>=new Date())
  if (OngoingOverrides?.length) {
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
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {OngoingOverrides.map((override, index) => {
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
                      ? `${override.start_time} – ${override.end_time}`
                      : "Not working"}
                  </td>

                  <td className="py-3 px-4 text-sm">
                    {override.start_time ? (
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
              );
            })}
          </tbody>
        </table>
      </div>
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
