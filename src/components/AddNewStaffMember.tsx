import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Upload,
  Calendar,
  User,
  MapPin,
  Cat,
  Briefcase,
  FileText,
  Dog,
  Plus,
  Minus,
} from "lucide-react";
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
  const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
  const [loveLanguage, setLoveLanguage] = useState("");
  const [about, setAbout] = useState("");
  const [trustElements, setTrustElements] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [pups, setPups] = useState<
    { name: string; breed: string; age: string | number; photo: string }[]
  >([]);
  const [pupUploaderOpen, setPupUploaderOpen] = useState<number | null>(null);
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

        {/* Experience & Communication Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <Briefcase className="h-6 w-6 text-groom-charcoal" />
            <h2 className="text-xl font-semibold text-groom-charcoal">
              Experience & Communication
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  placeholder="Enter years of experience"
                  min="0"
                  value={yearsOfExperience}
                  onChange={(e) =>
                    setYearsOfExperience(
                      e.target.value ? parseInt(e.target.value) : "",
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loveLanguage">Love Language</Label>
                <Input
                  id="loveLanguage"
                  placeholder="Enter love language (1-3 words)"
                  value={loveLanguage}
                  onChange={(e) => setLoveLanguage(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bio & Trust Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="h-6 w-6 text-groom-charcoal" />
            <h2 className="text-xl font-semibold text-groom-charcoal">
              Bio & Trust
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                placeholder="Write about yourself..."
                className="min-h-[150px]"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Trust Elements ({trustElements.length}/5)</Label>
                {trustElements.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTrustElements([...trustElements, ""])}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Element
                  </Button>
                )}
              </div>

              {trustElements.map((element, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={element}
                    onChange={(e) => {
                      const newElements = [...trustElements];
                      newElements[index] = e.target.value;
                      setTrustElements(newElements);
                    }}
                    placeholder={`Trust element ${index + 1}`}
                    className="flex-1"
                  />
                  {trustElements.length > 3 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newElements = [...trustElements];
                        newElements.splice(index, 1);
                        setTrustElements(newElements);
                      }}
                      className="h-9 w-9"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pup Family Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <Dog className="h-6 w-6 text-groom-charcoal" />
            <h2 className="text-xl font-semibold text-groom-charcoal">Pups</h2>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {pups.length}/8 pups added
              </p>
              {pups.length < 8 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPups([
                      ...pups,
                      { name: "", breed: "", age: "", photo: "" },
                    ])
                  }
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Pup
                </Button>
              )}
            </div>

            {pups.length > 0 && (
              <div className="space-y-8">
                {pups.map((pup, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Pup {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newPups = [...pups];
                          newPups.splice(index, 1);
                          setPups(newPups);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Pup Photo Upload */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => setPupUploaderOpen(index)}
                          className="w-20 h-20 rounded-full bg-groom-light flex items-center justify-center mb-2 border-2 border-dashed border-gray-300 overflow-hidden"
                          type="button"
                        >
                          {pup.photo ? (
                            <img
                              src={pup.photo}
                              alt={`Pup ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="h-6 w-6 text-gray-400" />
                          )}
                        </button>
                        <span
                          className="text-sm text-gray-500 cursor-pointer"
                          onClick={() => setPupUploaderOpen(index)}
                        >
                          Upload photo
                        </span>
                        {pupUploaderOpen === index && (
                          <ProfileImageUploader
                            isOpen={true}
                            onClose={() => setPupUploaderOpen(null)}
                            onImageSave={(image) => {
                              const newPups = [...pups];
                              newPups[index].photo = image;
                              setPups(newPups);
                              setPupUploaderOpen(null);
                            }}
                          />
                        )}
                      </div>

                      {/* Pup Details */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`pupName-${index}`}>Name</Label>
                            <Input
                              id={`pupName-${index}`}
                              placeholder="Enter pup name"
                              value={pup.name}
                              onChange={(e) => {
                                const newPups = [...pups];
                                newPups[index].name = e.target.value;
                                setPups(newPups);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`pupBreed-${index}`}>Breed</Label>
                            <Input
                              id={`pupBreed-${index}`}
                              placeholder="Enter pup breed"
                              value={pup.breed}
                              onChange={(e) => {
                                const newPups = [...pups];
                                newPups[index].breed = e.target.value;
                                setPups(newPups);
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`pupAge-${index}`}>Age</Label>
                          <Input
                            id={`pupAge-${index}`}
                            type="number"
                            placeholder="Enter pup age"
                            min="0"
                            value={pup.age}
                            onChange={(e) => {
                              const newPups = [...pups];
                              newPups[index].age = e.target.value
                                ? parseInt(e.target.value)
                                : "";
                              setPups(newPups);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
