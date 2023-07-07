/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { useCloudinary } from "./useCloudinary";
import { useSDA } from "./useSDA";

export const useGenerateQR = () => {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [prompt, setPrompt] = React.useState<string | null>(null);

  const {
    request: requestUploadToCloudinary,
    imageData,
    isLoading: isCloudinaryLoading,
  } = useCloudinary(selectedImage);
  const {
    request: requestGenerateQR,
    qrData,
    isLoading: isQRLoading,
  } = useSDA();

  const resetValues = () => {
    setSelectedImage(null);
    setPrompt(null);
  };

  React.useEffect(() => {
    if (prompt && !isCloudinaryLoading && !isQRLoading) {
      if (selectedImage) {
        requestUploadToCloudinary();
      } else {
        requestGenerateQR({ image: undefined, prompt });
        resetValues();
      }
    }
  }, [selectedImage, prompt]);

  React.useEffect(() => {
    if (imageData && selectedImage && prompt) {
      resetValues();
      requestGenerateQR({ image: imageData.secure_url, prompt });
    }
  }, [imageData]);

  return {
    request: (prompt: string | null, image: File | null) => (
      setSelectedImage(image), setPrompt(prompt)
    ),
    data: qrData,
    isLoading: isQRLoading || isCloudinaryLoading,
  };
};
