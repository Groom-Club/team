import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "./ui/button";

interface ImageCropperModalProps {
  open: boolean;
  image: File | null;
  onClose: () => void;
  onSave: (croppedFile: File | Blob) => void;
}

const defaultCrop: Crop = {
  unit: "px",
  width: 200,
  height: 200,
  x: 0,
  y: 0,
};

const getCroppedImg = async (
  image: HTMLImageElement,
  crop: PixelCrop,
  name: string
): Promise<File> => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.clientWidth;
  const scaleY = image.naturalHeight / image.clientHeight;

  const pixelCropWidth = crop.width * scaleX;
  const pixelCropHeight = crop.height * scaleY;

  canvas.width = pixelCropWidth;
  canvas.height = pixelCropHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context is null");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    pixelCropWidth,
    pixelCropHeight,
    0,
    0,
    pixelCropWidth,
    pixelCropHeight
  );

  const blobImage: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/jpeg",
      1
    ); // Set quality to 1 (max)
  });

  return new File([blobImage], name, { type: "image/jpeg" });
};

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  open,
  image,
  onClose,
  onSave,
}) => {
  const [crop, setCrop] = useState<Crop>(defaultCrop);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (typeof image === "string") setImgSrc(image);
    else if (image instanceof File) setImgSrc(URL.createObjectURL(image));
    else setImgSrc("");
    setCrop(defaultCrop); // Reset crop on new image
  }, [image]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      // Center the crop on the image
      const { width, height } = e.currentTarget;
      setCrop({
        ...defaultCrop,
        x: Math.max(0, Math.floor((width - 100) / 2)),
        y: Math.max(0, Math.floor((height - 100) / 2)),
      });
    },
    []
  );

  const handleSave = async () => {
    if (imgRef.current && completedCrop) {
      const croppedBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
        image?.name ?? ""
      );
      onSave(croppedBlob);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-lg p-4 min-w-[21.25rem] min-h-[26.25rem] relative">
        <h3 className="mb-3">Upload Profile Picture</h3>
        <div className="relative w-80 h-80 mx-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop={true}
            minWidth={150}
            minHeight={150}
            style={{ width: "20rem", height: "20rem" }}
          >
            {imgSrc && (
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Crop"
                className="w-80 h-80 object-cover"
                onLoad={onImageLoad}
              />
            )}
          </ReactCrop>
        </div>
        <div className="flex items-center gap-2 justify-end mt-4">
          <Button
            onClick={onClose}
            className="bg-white border border-primary text-charcoal!"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!completedCrop}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
