import useApi from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Cat, MapPin, Upload, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProfileImageUploader from "./ProfileImageUploader";
import { StaffMember } from "./StaffTableRow";
import { AutoCompleteSelect } from "./ui/auto-complete";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useDebounce } from "@/lib/useDebounce";

// Zod schema for form validation
const staffMemberSchema = z.object({
  photo: z.any().optional(),
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  capacity: z.coerce
    .number()
    .min(0, "Capacity must be 0 or greater")
    .optional(),
  buffer_time_mins: z
    .number()
    .min(0, "Buffer time must be 0 or greater")
    .optional(),
  max_travel_time_from_start_geo_location_mins: z.coerce
    .number()
    .min(0, "Travel time must be 0 or greater")
    .optional(),
  max_travel_time_to_end_geo_location_mins: z.coerce
    .number()
    .min(0, "Travel time must be 0 or greater")
    .optional(),
  start_location: z.array(z.number()).length(2).optional(),
  end_location: z.array(z.number()).length(2).optional(),
  endLocation: z.string().optional(),
  startLocation: z.string().optional(),
  about: z.string().optional(),
  preferred_breeds: z.array(z.number()).optional(),
  restricted_breeds: z.array(z.number()).optional(),
});

type StaffMemberFormData = z.infer<typeof staffMemberSchema>;

interface AddNewStaffMemberProps {
  onSave?: (data: StaffMemberFormData) => void;
  selectedStaff?: StaffMember;
}

const AddNewStaffMember = ({
  onSave,
  selectedStaff,
}: AddNewStaffMemberProps) => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const api = useApi();
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [endSearchQuery, setEndSearchQuery] = useState("");
  const [startSearchQuery, setStartSearchQuery] = useState("");
  const [endAddressOptions, setEndAddressOptions] = useState<any[]>([]);
  const [startAddressOptions, setStartAddressOptions] = useState<any[]>([]);
  const debouncedEndSearchQuery = useDebounce(endSearchQuery, 500);
  const debouncedStartSearchQuery = useDebounce(startSearchQuery, 500);

  const handleEndAddressSearch = async (query: string) => {
    setEndSearchQuery(query);
  };
  const handleStartAddressSearch = async (query: string) => {
    setStartSearchQuery(query);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (debouncedEndSearchQuery.length < 3) {
        setEndAddressOptions([]);
        return;
      }

      try {
        const addresses = await api.address.searchAddresses(
          debouncedEndSearchQuery
        );
        setEndAddressOptions(addresses);
      } catch (error) {
        console.error("Error searching addresses:", error);
        setEndAddressOptions([]);
      } 
    };

    fetchAddresses();
  }, [debouncedEndSearchQuery]);
  useEffect(() => {
    const fetchAddresses = async () => {
      if (debouncedStartSearchQuery.length < 3) {
        setStartAddressOptions([]);
        return;
      }

      try {
        const addresses = await api.address.searchAddresses(
          debouncedStartSearchQuery
        );
        setStartAddressOptions(addresses);
      } catch (error) {
        console.error("Error searching addresses:", error);
        setStartAddressOptions([]);
      }
    };

    fetchAddresses();
  }, [debouncedStartSearchQuery]);
  useEffect(() => {
    api.tcps.getBreeds().then((res) => {
      setBreeds(res.data);
    });
  }, []);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<StaffMemberFormData>({
    resolver: zodResolver(staffMemberSchema),
    defaultValues: {
      photo: selectedStaff?.photo || "",
      first_name: selectedStaff?.first_name || "",
      last_name: selectedStaff?.last_name || "",
      email: selectedStaff?.email || "",
      capacity: selectedStaff?.capacity || undefined,
      buffer_time_mins: selectedStaff?.buffer_time_mins || undefined,
      max_travel_time_from_start_geo_location_mins:
        selectedStaff?.max_travel_time_from_start_geo_location_mins ||
        undefined,
      max_travel_time_to_end_geo_location_mins:
        selectedStaff?.max_travel_time_to_end_geo_location_mins || undefined,
      start_location: selectedStaff?.start_location || [],
      end_location: selectedStaff?.end_location || [],
      endLocation: selectedStaff?.endLocation || "",
      startLocation: selectedStaff?.startLocation || "",
      about: selectedStaff?.about || "",
      preferred_breeds: selectedStaff?.preferred_breeds || [],
      restricted_breeds: selectedStaff?.restricted_breeds || [],
    },
  });

  const watchedValues = watch();
  const { first_name, last_name,photo,restricted_breeds,preferred_breeds,end_location,start_location,endLocation,startLocation   } = watchedValues;
  console.log({end_location,start_location,endLocation,startLocation})

  const onSubmit = async (data: StaffMemberFormData) => {
    try {
      console.log("Form data:", data);
      // Here you would typically send the data to your API
      onSave?.(data);
      reset();
    } catch (error) {
      console.error("Error saving staff member:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Profile Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <User className="h-6 w-6 text-groom-charcoal" />
          <h2 className="text-xl font-semibold text-groom-charcoal">Profile</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setIsUploaderOpen(true)}
              className="w-24 h-24 rounded-full bg-groom-light flex items-center justify-center mb-2 border-2 border-dashed border-gray-300 overflow-hidden"
              type="button"
            >
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : first_name || last_name ? (
                <span className="text-xl font-semibold text-groom-charcoal">
                  {first_name?.charAt(0) || ""}
                  {last_name?.charAt(0) || ""}
                </span>
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </button>
            <span
              className="text-sm text-gray-500 cursor-pointer"
              onClick={() => setIsUploaderOpen(true)}
            >
              Upload avatar
            </span>
            <ProfileImageUploader
              isOpen={isUploaderOpen}
              onClose={() => setIsUploaderOpen(false)}
              onImageSave={(image) => setValue("photo", image)}
            />
          </div>

          {/* Profile Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  {...register("first_name")}
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  {...register("last_name")}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Employment Details Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="h-6 w-6 text-groom-charcoal" />
          <h2 className="text-xl font-semibold text-groom-charcoal">
            Employment Details
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (minutes)</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="Enter capacity"
                min="0"
                {...register("capacity")}
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && (
                <p className="text-sm text-red-500">
                  {errors.capacity.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bufferTime">Buffer time (minutes)</Label>
              <Input
                id="bufferTime"
                type="number"
                placeholder="Enter buffer time"
                min="0"
                {...register("buffer_time_mins")}
                className={errors.buffer_time_mins ? "border-red-500" : ""}
              />
              {errors.buffer_time_mins && (
                <p className="text-sm text-red-500">
                  {errors.buffer_time_mins.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxTravelTimeFromStart">
                Max travel time from start (minutes)
              </Label>
              <Input
                id="maxTravelTimeFromStart"
                type="number"
                placeholder="Enter max travel time"
                min="0"
                {...register("max_travel_time_from_start_geo_location_mins")}
                className={
                  errors.max_travel_time_from_start_geo_location_mins ? "border-red-500" : ""
                }
              />
              {errors.max_travel_time_from_start_geo_location_mins && (
                <p className="text-sm text-red-500">
                  {errors.max_travel_time_from_start_geo_location_mins.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTravelTimeToEnd">
                Max travel time to end (minutes)
              </Label>
              <Input
                id="maxTravelTimeToEnd"
                type="number"
                placeholder="Enter max travel time"
                min="0"
                {...register("max_travel_time_to_end_geo_location_mins")}
                className={errors.max_travel_time_to_end_geo_location_mins ? "border-red-500" : ""}
              />
              {errors.max_travel_time_to_end_geo_location_mins && (
                <p className="text-sm text-red-500">
                  {errors.max_travel_time_to_end_geo_location_mins.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startLocation">
              Start location (radar-verified)
            </Label>
            <div className="relative">
              <AutoCompleteSelect
                id="startLocation"
                options={startAddressOptions}
                  value={startLocation?.length?[startLocation]:[]}  
                onChange={(value:any[]) => {
                  const selectedAddress = startAddressOptions?.find((v) => v.label === value[0])
                 
                  if(selectedAddress){
                    setValue("startLocation", selectedAddress?.value)
                    setValue("start_location", [selectedAddress?.latitude,selectedAddress.longitude])
                  }else{
                    setValue("startLocation", "")
                    setValue("start_location", [])
                  }
                }}
                onSearch={handleStartAddressSearch}
                multiple={false}  
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            {errors.start_location && (
              <p className="text-sm text-red-500">
                {errors.start_location.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endLocation">End location (radar-verified)</Label>
            <div className="relative">
              <AutoCompleteSelect
                id="endLocation"
                options={endAddressOptions}
                value={endLocation?.length?[endLocation]:[]}  
                onChange={(value:any[]) => {
                 
                  const selectedAddress = endAddressOptions?.find((v) => v.label === value[0])
                 
                  if(selectedAddress){
                    setValue("endLocation", selectedAddress?.value)
                    setValue("end_location", [selectedAddress?.latitude,selectedAddress.longitude])
                  }else{
                    setValue("endLocation", "")
                    setValue("end_location", [])
                  }
                }}
                onSearch={handleEndAddressSearch}
                multiple={false}
                className="pl-10"
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            {errors.end_location && (
              <p className="text-sm text-red-500">
                {errors.end_location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this staff member"
              className="min-h-[100px]"
              {...register("about")}
            />
            {errors.about && (
              <p className="text-sm text-red-500">{errors.about.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Breed Preferences Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <Cat className="h-6 w-6 text-groom-charcoal" />
          <h2 className="text-xl font-semibold text-groom-charcoal">
            Breed Preferences
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proBreeds">Pro Breeds</Label>
            <AutoCompleteSelect
              id="proBreeds"
              options={breeds.map((breed) => ({
                label: breed.name,
                value: breed.id.toString(),
              }))}
              value={preferred_breeds?.map((breed) => breed.toString()) || []}
              onChange={(value:any[]) => {
                setValue("preferred_breeds", (value).map((v) => Number(v)))
              }}
            />
            {errors.preferred_breeds && (
              <p className="text-sm text-red-500">{errors.preferred_breeds.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="conBreeds">Con Breeds</Label>
              <AutoCompleteSelect
                id="conBreeds"
                options={breeds.map((breed) => ({
                  label: breed.name,
                  value: breed.id.toString(),
                }))}
                value={restricted_breeds?.map((breed) => breed.toString()) || []}
                onChange={(value:any[]) => {
                  setValue("restricted_breeds", (value).map((v) => Number(v)))
                }}
                multiple={true}
              />
            {errors.restricted_breeds && (
              <p className="text-sm text-red-500">{errors.restricted_breeds.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Staff Member"}
        </Button>
      </div>
    </form>
  );
};

export default AddNewStaffMember;
