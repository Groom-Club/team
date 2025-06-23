import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { StaffMember } from "./StaffTableRow";

interface AppointmentData {
  priority: string;
  tcpName: string;
  date: string;
  time: string;
  adjustedDriveTime: string;
  distance: string;
  bonusPenalty: string;
  duration: string;
}

const TestingPage = () => {
  const [serviceDuration, setServiceDuration] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock TCP data - in real implementation, this would come from props or API
  const mockTCPs: StaffMember[] = [
    {
      id: 1,
      name: "John Doe",
      first_name: "John",
      last_name: "Doe",
      role: "TCP",
      email: "john.doe@example.com",
      initials: "JD",
      weekly_shifts: [],
    },
    {
      id: 2,
      name: "Jane Smith",
      first_name: "Jane",
      last_name: "Smith",
      role: "TCP",
      email: "jane.smith@example.com",
      initials: "JS",
      weekly_shifts: [],
    },
    {
      id: 3,
      name: "Mike Johnson",
      first_name: "Mike",
      last_name: "Johnson",
      role: "TCP",
      email: "mike.johnson@example.com",
      initials: "MJ",
      weekly_shifts: [],
    },
  ];

  const handleGetAppointments = async () => {
    setIsLoading(true);

    // Mock API call - replace with actual API implementation
    setTimeout(() => {
      const mockAppointments: AppointmentData[] = [
        {
          priority: "High",
          tcpName: "John Doe",
          date: "2024-01-15",
          time: "09:00 AM",
          adjustedDriveTime: "15 min",
          distance: "5.2 miles",
          bonusPenalty: "+$5.00",
          duration: "60 min",
        },
        {
          priority: "Medium",
          tcpName: "Jane Smith",
          date: "2024-01-15",
          time: "10:30 AM",
          adjustedDriveTime: "22 min",
          distance: "8.1 miles",
          bonusPenalty: "-$2.50",
          duration: "45 min",
        },
        {
          priority: "Low",
          tcpName: "Mike Johnson",
          date: "2024-01-15",
          time: "02:00 PM",
          adjustedDriveTime: "18 min",
          distance: "6.7 miles",
          bonusPenalty: "$0.00",
          duration: "30 min",
        },
      ];

      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 1000);
  };

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
                <Label htmlFor="serviceDuration">
                  Service Duration (minutes)
                </Label>
                <Input
                  id="serviceDuration"
                  type="number"
                  placeholder="Enter duration in minutes"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select
                  value={selectedProvider}
                  onValueChange={setSelectedProvider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All TCPs</SelectItem>
                    {mockTCPs &&
                      Array.isArray(mockTCPs) &&
                      mockTCPs.map((tcp) => (
                        <SelectItem key={tcp.id} value={tcp.id.toString()}>
                          {tcp.first_name} {tcp.last_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePickerWithRange />
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
                    <TableHead>Adjusted Drive Time</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Bonus/Penalty</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {appointment.priority}
                      </TableCell>
                      <TableCell>{appointment.tcpName}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.adjustedDriveTime}</TableCell>
                      <TableCell>{appointment.distance}</TableCell>
                      <TableCell
                        className={`font-medium ${
                          appointment.bonusPenalty.startsWith("+")
                            ? "text-green-600"
                            : appointment.bonusPenalty.startsWith("-")
                              ? "text-red-600"
                              : "text-neutral-600"
                        }`}
                      >
                        {appointment.bonusPenalty}
                      </TableCell>
                      <TableCell>{appointment.duration}</TableCell>
                    </TableRow>
                  ))}
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
