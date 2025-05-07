import { Camera, Save } from "lucide-react";
import ProfileNavBar from "./ProfileNavBar";
import { useState } from "react";
import ProfileImageUploader from "./ProfileImageUploader";

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const handleImageSave = (imageData: string) => {
    setProfileImage(imageData);
  };

  return (
    <div className="bg-groom-cream min-h-screen">
      <ProfileNavBar />
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        {/* User Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-groom-charcoal flex items-center justify-center text-white text-2xl font-medium overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                "TD"
              )}
            </div>
            <button
              className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-groom-light transition-colors"
              onClick={() => setIsUploaderOpen(true)}
            >
              <Camera className="h-5 w-5 text-groom-charcoal" />
            </button>
            <ProfileImageUploader
              isOpen={isUploaderOpen}
              onClose={() => setIsUploaderOpen(false)}
              onImageSave={handleImageSave}
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-groom-charcoal">
              Temp Design
            </h1>
            <p className="text-neutral-500">design@tempolabs.ai</p>
          </div>
        </div>

        {/* Tab Heading */}
        <div className="border-b border-neutral-200 mb-8">
          <div className="inline-block pb-2 border-b-2 border-groom-charcoal">
            <h2 className="text-lg font-semibold text-groom-charcoal">
              Settings
            </h2>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-groom-charcoal mb-6">
            Basic info
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-groom-charcoal mb-1"
                >
                  First name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value="Temp"
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-groom-charcoal"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-groom-charcoal mb-1"
                >
                  Last name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value="Design"
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-groom-charcoal"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                disabled
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-200 text-neutral-400 cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="pt-6 border-t border-neutral-200">
          <h3 className="text-lg font-semibold text-groom-charcoal mb-6">
            Security
          </h3>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="font-medium text-groom-charcoal">Password</h4>
                <p className="text-sm text-neutral-500">
                  Last updated 0 day ago
                </p>
              </div>
              <button className="mt-4 md:mt-0 px-5 py-2 rounded-full bg-groom-light text-groom-charcoal hover:bg-neutral-200 transition-colors">
                Change password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
