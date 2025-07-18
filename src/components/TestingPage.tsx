import useApi from "@/api";
import { AutoCompleteSelect } from "@/components/ui/auto-complete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface TcpData {
  id: number;
  first_name?: string;
  last_name?: string;
  total_service_cost?: number;
  total_service_duration?: number;
  appointments: AppointmentData[];
}

interface AppointmentData {
  adjustments?: string[];
  travelTimeMins?: number;
  adjustedTravelTime?: number;
  travelDistance?: number;
}

const TestingPage = () => {
  const [selectedMember, setSelectedMember] = useState<number | undefined>(
    undefined
  );
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [tcps, setTcps] = useState<TcpData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);
  const api = useApi();
  const getMembers = async () => {
    const res = await api.test.getMember();
    setMembers(res.data);
  };
  const getDogs = async (memberId: number) => {
    const res = await api.test.getDogs(memberId);
    setDogs(res.data);
  };
  useEffect(() => {
    getMembers();
  }, []);
  useEffect(() => {
    if (selectedMember) {
      getDogs(selectedMember);
    }
  }, [selectedMember]);

  const handleGetAppointments = async () => {
    setIsLoading(true);
    const res = await api.test.getAppointmentSuggestions(selectedMember, {
      start_date: selectedDate,
      dog_ids: selectedDogs,
    });
    setTcps(res.data);
    setIsLoading(false);
  };
  const appointments = tcps.reduce((acc, tcp) => {
    return acc.concat(
      ...tcp?.appointments?.map((app) => {
        return {
          ...app,
          tcpName: tcp.first_name + " " + tcp.last_name,
          totalCost: tcp.total_service_cost || 0,
          totalDuration: tcp.total_service_duration || 0,
        };
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Testing</h1>

        {/* Input Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member">Member</Label>
                <AutoCompleteSelect
                  options={[
                    ...(members && Array.isArray(members)
                      ? members.map((tcp) => ({
                          label: `${tcp.first_name} ${tcp.last_name}`,
                          value: tcp.id,
                        }))
                      : []),
                  ]}
                  value={[selectedMember]}
                  onChange={(value) => setSelectedMember(value[0] as number)}
                  placeholder="Search for member..."
                  multiple={false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dogs">Dogs</Label>
                <AutoCompleteSelect
                  options={[
                    ...(dogs && Array.isArray(dogs)
                      ? dogs.map((dog) => ({
                          label: dog.dog_name,
                          value: dog.id.toString(),
                        }))
                      : []),
                  ]}
                  value={selectedDogs.map((id) => id.toString())}
                  onChange={(value) =>
                    setSelectedDogs(value.map((v) => parseInt(v)))
                  }
                  placeholder="Select dogs..."
                  multiple={true}
                  withoutSearch={true}
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={(date) => setSelectedDate(date)}
                />
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                onClick={handleGetAppointments}
                disabled={isLoading}
                className="px-6"
              >
                {isLoading ? "Loading..." : "Get Appointments"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        {appointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>TCP Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Adjustments</TableHead>
                    <TableHead>Travel Time</TableHead>
                    <TableHead>Adjusted Drive Time</TableHead>
                    <TableHead>Bonus/Penalty</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((app, index) => {
                    return (
                      <>
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{app.tcpName}</TableCell>
                          <TableCell>
                            {app.timeSlotDateAndTime?.split("T")[0]}
                          </TableCell>
                          <TableCell>
                            {app.timeSlotDateAndTime?.split("T")[1]}
                          </TableCell>
                          <TableCell>{app.adjustments?.join(", ")}</TableCell>
                          <TableCell>{app.travelTimeMins}</TableCell>
                          <TableCell>{app.adjustedTravelTime}</TableCell>
                          <TableCell
                            className={
                              app.travelTimeMins - app.adjustedTravelTime > 0
                                ? "text-green-600"
                                : app.travelTimeMins - app.adjustedTravelTime <
                                  0
                                ? "text-red-600"
                                : ""
                            }
                          >
                            {app.travelTimeMins - app.adjustedTravelTime}
                          </TableCell>
                          <TableCell>{app.travelDistance}</TableCell>

                          <TableCell>${app.totalCost}</TableCell>
                          <TableCell>{app.totalDuration} minutes</TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestingPage;
