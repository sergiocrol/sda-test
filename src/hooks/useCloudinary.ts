import React from "react";

import { uploadImage } from "@/lib/helpers";

export function useCloudinary(img: File | null): any {
  const [data, setData] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const cloudinaryBaseUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const file = img;
  const uploadPreset = process.env
    .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

  const makeRequest = () => {
    if (file) {
      setIsError(false);
      setIsLoading(true);
      uploadImage(cloudinaryBaseUrl, file, uploadPreset)
        .then((data) => setData(data))
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  };

  return {
    request: () => makeRequest(),
    imageData: data,
    isLoading,
    isError,
  };
}
