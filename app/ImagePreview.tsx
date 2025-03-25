import { useState, useEffect } from "react";
import heic2any from "heic2any";
import { Card } from "../components/ui/card";

type Props = {
  file: File;
  onSelect?: (selected: boolean, isShiftKey: boolean) => void;
  selected?: boolean;
  index?: number;
  lastSelectedIndex?: number | null;
  gyazoUrl?: string;
};

export const ImagePreview = ({
  file,
  onSelect,
  selected,
  index,
  lastSelectedIndex,
  gyazoUrl,
}: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const processFile = async () => {
      if (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });
          const reader = new FileReader();
          reader.onload = () => setPreviewUrl(reader.result as string);
          reader.readAsDataURL(convertedBlob as Blob);
        } catch (error) {
          console.error("HEIC conversion failed:", error);
          // Fallback to regular processing
          readAsDataURL(file);
        }
      } else {
        readAsDataURL(file);
      }
    };

    const readAsDataURL = (file: File) => {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    };

    processFile();
  }, [file]);

  return (
    <Card
      className={`p-2 ${selected
        ? "ring-2 ring-blue-500"
        : index !== undefined &&
          lastSelectedIndex !== null &&
          lastSelectedIndex !== undefined &&
          ((index >= lastSelectedIndex && index <= lastSelectedIndex) ||
            (index <= lastSelectedIndex && index >= lastSelectedIndex))
          ? "bg-blue-50"
          : ""
        } cursor-pointer`}
      onClick={(e) => {
        if (onSelect) {
          onSelect(!selected, e.shiftKey);
        }
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          {previewUrl && (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <div className="flex-grow flex flex-col justify-between h-24">
          <div>
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-gray-500 text-xs">
              {new Date(file.lastModified).toLocaleString()}
            </p>
            {gyazoUrl && (
              <p className="text-blue-500 text-xs truncate">
                <a href={gyazoUrl} target="_blank" rel="noopener noreferrer">
                  {gyazoUrl}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
