import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Upload, Calendar, User, MapPin, Cat } from "lucide-react";
import { useState } from "react";
import ProfileImageUploader from "./ProfileImageUploader";

interface AddNewStaffMemberProps {
  onSave?: () => void;
}

const AddNewStaffMember = ({ onSave }: AddNewStaffMemberProps) => {
  const [profileImage, setProfileImage] = useState<string>("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return (
    <>
      <div className="space-y-8 max-w-4xl">
        {/* Profile Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <User className="h-6 w-6 text-groom-charcoal" />
            <h2 className="text-xl font-semibold text-groom-charcoal">
              Profile
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsUploaderOpen(true)}
                className="w-24 h-24 rounded-full bg-groom-light flex items-center justify-center mb-2 border-2 border-dashed border-gray-300 overflow-hidden"
                type="button"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : firstName || lastName ? (
                  <span className="text-xl font-semibold text-groom-charcoal">
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
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
                onImageSave={(image) => setProfileImage(image)}
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
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                />
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bufferTime">Buffer time (minutes)</Label>
                <Input
                  id="bufferTime"
                  type="number"
                  placeholder="Enter buffer time"
                  min="0"
                />
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
                />
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startLocation">
                Start location (radar-verified)
              </Label>
              <div className="relative">
                <Input
                  id="startLocation"
                  placeholder="Enter start address"
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endLocation">End location (radar-verified)</Label>
              <div className="relative">
                <Input
                  id="endLocation"
                  placeholder="Enter end address"
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this staff member"
                className="min-h-[100px]"
              />
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
              <Input id="proBreeds" placeholder="Enter preferred breeds" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conBreeds">Con Breeds</Label>
              <Input id="conBreeds" placeholder="Enter non-preferred breeds" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AddNewStaffMember;
