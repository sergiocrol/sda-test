import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { FALLBACK_IMAGE } from "@/pages";

export function InputFile({
  id,
  className,
  onSelectImage,
}: {
  id: string;
  className: string;
  onSelectImage: (img: File | null) => void;
}) {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const onHandleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files && e.target.files[0];
    if (!img) return;

    setSelectedImage(img);
    setPreviewUrl(URL.createObjectURL(img));
    onSelectImage(img);
  };

  return (
    <div
      className={`flex justify-between w-full max-w-sm items-center gap-1.5 ${className}`}
    >
      <div className="w-3/5 cursor-pointer">
        <Label htmlFor="id" className=" cursor-pointer">
          Picture
        </Label>
        <Input
          id="id"
          type="file"
          accept="image/*"
          className="my-1  cursor-pointer"
          onChange={(e) => onHandleImage(e)}
        />
      </div>

      <Card className="w-24 h-24 cursor-pointer">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage src={previewUrl || FALLBACK_IMAGE} />
          <AvatarFallback>QR</AvatarFallback>
        </Avatar>
      </Card>
    </div>
  );
}
