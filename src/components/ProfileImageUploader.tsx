import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "./ui/button";
import { Camera, X } from "lucide-react";

interface ProfileImageUploaderProps {
  onImageSave: (croppedImage: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileImageUploader = ({
  onImageSave,
  isOpen,
  onClose,
}: ProfileImageUploaderProps) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (100 * 300) / width;
    const cropHeightInPercent = (100 * 300) / height;
    const crop = {
      unit: "%",
      width: cropWidthInPercent,
      height: cropHeightInPercent,
      x: (100 - cropWidthInPercent) / 2,
      y: (100 - cropHeightInPercent) / 2,
      aspect: 1,
    };
    setCrop(crop as Crop);
  };

  const getCroppedImg = () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    onImageSave(base64Image);
    onClose();
  };

  const handleClose = () => {
    setImgSrc("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {!imgSrc ? (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 rounded-lg">
              <Camera className="h-12 w-12 text-neutral-400 mb-2" />
              <p className="text-sm text-neutral-500 mb-4">
                Drag and drop an image or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                className="px-4 py-2 bg-groom-charcoal text-white rounded-full cursor-pointer hover:bg-opacity-90 transition-colors"
              >
                Select Image
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <button
                  onClick={() => setImgSrc("")}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md z-10"
                >
                  <X className="h-4 w-4" />
                </button>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Upload"
                    onLoad={onImageLoad}
                    className="max-h-[400px] w-auto mx-auto"
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={getCroppedImg}
                  className="bg-groom-charcoal text-white rounded-full hover:bg-opacity-90"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageUploader;
