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
import { useDebounce } from "@/lib/useDebounce";
import { useEffect, useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

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

// Query history interfaces
interface QueryHistoryItem {
  id: string;
  timestamp: number;
  inputs: {
    member: string[];
    dogs: number[];
    startDate?: Date;
  };
  response: TcpData[];
  memberName?: string;
  dogNames?: string[];
  dogsOptions: Array<{ id: number; dog_name: string }>; // Store the dogs options data
}

interface QueryHistoryState {
  queries: QueryHistoryItem[];
  currentQueryId?: string;
}

// Form validation schema
const appointmentFormSchema = z
  .object({
    member: z.array(z.string()).min(1, "Member is required"),
    dogs: z.array(z.number()).min(1, "At least one dog must be selected"),
    startDate: z.date().optional(),
  })
  .refine(
    (data) => {
      // Additional validation: ensure member is selected before dogs
      if (data.dogs.length > 0 && data.member.length === 0) {
        return false;
      }
      return true;
    },
    {
      message: "Please select a member before selecting dogs",
      path: ["dogs"],
    }
  );

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

const TestingPage = () => {
  const [tcps, setTcps] = useState<TcpData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [dogs, setDogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryState>({
    queries: [],
  });
  const [showHistory, setShowHistory] = useState(false);
  const [isRestoringFromHistory, setIsRestoringFromHistory] = useState(false);
  const memberChangeSource = useRef<"manual" | "history" | null>(null);
  const api = useApi();
  const [appointmentRankConfig, setAppointmentRankConfig] = useState<any>(null);
  // Local storage key
  const QUERY_HISTORY_KEY = "appointment_query_history";

  // Load query history from localStorage on component mount
  useEffect(() => {
    const loadQueryHistory = () => {
      try {
        const stored = localStorage.getItem(QUERY_HISTORY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Convert timestamp strings back to numbers and date strings back to Date objects
          const queries = parsed.queries.map((query: any) => ({
            ...query,
            timestamp: Number(query.timestamp),
            inputs: {
              ...query.inputs,
              startDate: query.inputs.startDate
                ? new Date(query.inputs.startDate)
                : undefined,
            },
          }));
          setQueryHistory({ queries, currentQueryId: parsed.currentQueryId });
        }
      } catch (error) {
        console.error("Error loading query history:", error);
        setQueryHistory({ queries: [] });
      }
    };

    loadQueryHistory();
  }, []);

  // Function to save a query to history
  const saveQueryToHistory = (
    inputs: AppointmentFormData,
    response: TcpData[]
  ) => {
    const member = allMembers.find(
      (m) => m.id?.toString() === inputs.member[0]
    );
    const memberName = member
      ? `${member.first_name} ${member.last_name}`
      : "Unknown Member";

    const dogNames = inputs.dogs.map((dogId) => {
      const dog = dogs.find((d) => d.id === dogId);
      return dog ? dog.dog_name : "Unknown Dog";
    });

    const newQuery: QueryHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs: {
        member: inputs.member,
        dogs: inputs.dogs,
        startDate: inputs.startDate,
      },
      response,
      memberName,
      dogNames,
      dogsOptions: dogs, // Store the current dogs options data
    };

    const updatedHistory = {
      queries: [newQuery, ...queryHistory.queries.slice(0, 9)], // Keep only last 10 queries
      currentQueryId: undefined, // Don't set as current when saving new queries
    };

    setQueryHistory(updatedHistory);

    // Save to localStorage immediately
    try {
      localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving query history to localStorage:", error);
    }
  };

  // Function to restore a query from history
  const restoreQueryFromHistory = (query: QueryHistoryItem) => {
    console.log("Restoring from history, setting source to history");
    memberChangeSource.current = "history";

    // Set form values without triggering API call
    setValue("member", query.inputs.member);
    setValue("dogs", query.inputs.dogs);
    setValue("startDate", query.inputs.startDate);

    // Set the dogs options from history
    setDogs(query.dogsOptions);

    // Set the response data
    setTcps(query.response);

    // Update current query ID
    setQueryHistory((prev) => ({
      ...prev,
      currentQueryId: query.id,
    }));

    // Close history panel
    setShowHistory(false);

    // Reset the source after a short delay to ensure all state updates are complete
    setTimeout(() => {
      console.log("Resetting source to null");
      memberChangeSource.current = null;
    }, 100);
  };

  // Function to clear query history
  const clearQueryHistory = () => {
    const clearedHistory = { queries: [] };
    setQueryHistory(clearedHistory);
    setTcps([]);

    // Save to localStorage immediately
    try {
      localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(clearedHistory));
    } catch (error) {
      console.error("Error clearing query history from localStorage:", error);
    }
  };

  // Initialize react-hook-form with zod validation
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      member: [],
      dogs: [],
      startDate: undefined,
    },
  });

  const {
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;
  const selectedMember = watch("member");
  const selectedDogs = watch("dogs");
  const selectedDate = watch("startDate");

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load all members on component mount
  useEffect(() => {
    const loadAllMembers = async () => {
      setIsLoadingMembers(true);
      try {
        const res = await api.test.getMember();
        setAllMembers(res.data);
        setFilteredMembers(res.data);
      } catch (error) {
        console.error("Error loading members:", error);
        setAllMembers([]);
        setFilteredMembers([]);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadAllMembers();
  }, []);

  // Filter members based on search query
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredMembers(allMembers);
    } else {
      const filtered = allMembers.filter((member) => {
        const firstName = member.first_name?.toLowerCase() || "";
        const lastName = member.last_name?.toLowerCase() || "";
        const searchLower = debouncedSearchQuery.toLowerCase();

        return (
          firstName.includes(searchLower) || lastName.includes(searchLower)
        );
      });
      setFilteredMembers(filtered);
    }
  }, [debouncedSearchQuery, allMembers]);

  const getDogs = async (memberId: number) => {
    const res = await api.test.getDogs(memberId);
    setDogs(res.data);
  };

  useEffect(() => {
    // Only fetch dogs if:
    // 1. Member is selected
    // 2. This is a manual member change (not from history restoration)
    if (
      selectedMember &&
      selectedMember.length > 0 &&
      memberChangeSource.current === "manual"
    ) {
      console.log("Fetching dogs for manual member change:", selectedMember[0]);
      getDogs(parseInt(selectedMember[0]));
      // Clear dogs when member changes (but not when restoring from history)
      setValue("dogs", []);
    }
  }, [selectedMember, setValue]);

  const handleGetAppointments = async (data: AppointmentFormData) => {
    setIsLoading(true);
    try {
      const res = await api.test.getAppointmentSuggestions(
        parseInt(data.member[0]),
        {
          start_date: data.startDate,
          dog_ids: data.dogs,
        }
      );
      setTcps(res.data);
      // Save successful query to history
      saveQueryToHistory(data, res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // You could add a toast notification here for better UX
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberSearch = (query: string) => {
    setSearchQuery(query);
    // If query is empty and we have a selected member, deselect it
    if (!query.trim() && selectedMember && selectedMember.length > 0) {
      memberChangeSource.current = "manual"; // Set source when manually clearing
      setValue("member", []);
      setValue("dogs", []);
      setDogs([]);
    }
  };

  const handleMemberChange = (value: string[]) => {
    console.log("Manual member change, setting source to manual");
    memberChangeSource.current = "manual"; // Set the source when manually changing member
    setValue("member", value);
    // Clear search query when member is selected
    if (value && value.length > 0) {
      setSearchQuery("");
    } else {
      // When member is deselected, clear dogs and search query
      setValue("dogs", []);
      setDogs([]);
      setSearchQuery("");
    }
  };

  const handleDogsChange = (value: string[]) => {
    setValue(
      "dogs",
      value.map((v) => parseInt(v))
    );
  };

  const handleDateChange = (date: Date | undefined) => {
    setValue("startDate", date);
  };

  // Reset form when member changes
  const resetForm = () => {
    memberChangeSource.current = null; // Reset the source
    form.reset({
      member: [],
      dogs: [],
      startDate: undefined,
    });
    setDogs([]);
    setSearchQuery("");
    setTcps([]);
    // Clear current query history state
    setQueryHistory((prev) => ({
      ...prev,
      currentQueryId: undefined,
    }));
  };

  // Check if form is valid for button state
  const isFormValid =
    selectedMember &&
    selectedMember.length > 0 &&
    selectedDogs &&
    selectedDogs.length > 0 &&
    selectedDate;

  const appointments = tcps.reduce((acc, tcp) => {
    return acc.concat(
      ...tcp?.appointments?.map((app) => {
        return {
          ...app,
          tcpName: tcp.first_name,
          totalCost: tcp.total_service_cost || 0,
          totalDuration: tcp.total_service_duration || 0,
        };
      })
    );
  }, []);

  const sortedAppointments = useMemo(() => {
    return appointments.sort((a, b) => {
      if (appointmentRankConfig?.status === "ACTIVE") {
        return a.adjustedTravelTime - b.adjustedTravelTime;
      }
      return a.travelTimeMins - b.travelTimeMins;
    });
  }, [appointments, appointmentRankConfig]);

  const getAppointmentRankConfig = async () => {
    const res = await api.config.getAppointmentRankConfig();
    setAppointmentRankConfig(res.data[0]);
  };

  useEffect(() => {
    getAppointmentRankConfig();
  }, []);
  console.log(appointmentRankConfig, "appointmentRankConfig");

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Testing</h1>

        {/* Input Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Test Parameters</CardTitle>
              {queryHistory.currentQueryId && (
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Viewing from history
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={form.handleSubmit(handleGetAppointments)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member">Member *</Label>
                  <AutoCompleteSelect
                    options={[
                      ...(filteredMembers && Array.isArray(filteredMembers)
                        ? filteredMembers.map((tcp) => ({
                            label: `${tcp.first_name} ${tcp.last_name}`,
                            value: tcp.id?.toString(),
                          }))
                        : []),
                    ]}
                    value={selectedMember}
                    onChange={handleMemberChange}
                    placeholder="Search for member..."
                    onSearch={handleMemberSearch}
                    isLoading={isLoadingMembers}
                  />
                  {errors.member && (
                    <p className="text-sm text-red-600">
                      {errors.member.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dogs">Dogs *</Label>
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
                    onChange={handleDogsChange}
                    placeholder="Select dogs..."
                    multiple={true}
                    withoutSearch={true}
                  />
                  {errors.dogs && (
                    <p className="text-sm text-red-600">
                      {errors.dogs.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={handleDateChange}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-start gap-4">
                <Button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="px-6"
                >
                  {isLoading ? "Loading..." : "Get Appointments"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="px-6"
                >
                  Reset Form
                </Button>
                {!isFormValid && (
                  <p className="ml-4 text-sm text-amber-600 self-center">
                    Please select a member, at least one dog, and a start date
                    to continue
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Query History Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Query History
                {queryHistory.queries.length > 0 && (
                  <span className="ml-2 text-sm text-neutral-500">
                    ({queryHistory.queries.length}/10)
                  </span>
                )}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? "Hide History" : "Show History"}
                </Button>
                {queryHistory.queries.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearQueryHistory}
                  >
                    Clear History
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          {showHistory && (
            <CardContent>
              {queryHistory.queries.length === 0 ? (
                <p className="text-neutral-500 text-center py-4">
                  No query history available
                </p>
              ) : (
                <div className="space-y-3">
                  {queryHistory.queries.map((query) => (
                    <div
                      key={query.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        query.id === queryHistory.currentQueryId
                          ? "border-blue-500 bg-blue-50"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                      onClick={() => restoreQueryFromHistory(query)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">
                            {query.memberName}
                          </div>
                          <div className="text-sm text-neutral-600">
                            Dogs: {query.dogNames?.join(", ")}
                          </div>
                          {query.inputs.startDate && (
                            <div className="text-sm text-neutral-600">
                              Date:{" "}
                              {query.inputs.startDate.toLocaleDateString()}
                            </div>
                          )}
                          <div className="text-sm text-neutral-500">
                            Results:{" "}
                            {query.response?.reduce((acc, val) => {
                              return acc + val.appointments.length;
                            }, 0)}{" "}
                            appointments
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-neutral-500">
                            {new Date(query.timestamp).toLocaleString()}
                          </div>
                          {query.id === queryHistory.currentQueryId && (
                            <div className="text-xs text-blue-600 font-medium">
                              Current
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Results Table */}
        {sortedAppointments.length > 0 && (
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
                    <TableHead>Start Time</TableHead>
                    {/* <TableHead>Adjustments</TableHead> */}
                    <TableHead>Drive Time</TableHead>
                    <TableHead>Bonus/Penalty</TableHead>
                    <TableHead>Adjusted Drive Time</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAppointments.map((app, index) => {
                    return (
                      <>
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{app.tcpName}</TableCell>
                          <TableCell>
                            {format(app.timeSlotDateAndTime, "M/d/yyyy") ||
                              "N/A"}
                          </TableCell>
                          <TableCell>
                            {format(app.timeSlotDateAndTime, "h:mm a") || "N/A"}
                          </TableCell>
                          {/* <TableCell>{app.adjustments?.join(", ")}</TableCell> */}
                          <TableCell>{app.travelTimeMins}</TableCell>
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
                          <TableCell>{app.adjustedTravelTime}</TableCell>
                          <TableCell>{app.travelDistance.toFixed(1)}</TableCell>

                          <TableCell>${app.totalCost}</TableCell>
                          <TableCell>{app.totalDuration}</TableCell>
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
