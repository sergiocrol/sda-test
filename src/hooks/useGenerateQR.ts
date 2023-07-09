/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import {
  initialVariables,
  InitialVariablesMenu,
} from "@/components/menuAttributes";

import { useCloudinary } from "./useCloudinary";
import { useSDA } from "./useSDA";

export const useGenerateQR = () => {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [prompt, setPrompt] = React.useState<string | null>(null);
  const [variables, setVariables] =
    React.useState<InitialVariablesMenu>(initialVariables);

  const {
    request: requestUploadToCloudinary,
    imageData,
    isLoading: isCloudinaryLoading,
  } = useCloudinary(selectedImage);
  const {
    request: requestGenerateQR,
    qrData,
    setQrData,
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
        resetValues();
        requestGenerateQR({ image: undefined, prompt, variables });
      }
    }
  }, [selectedImage, prompt]);

  React.useEffect(() => {
    if (imageData && selectedImage && prompt) {
      resetValues();
      requestGenerateQR({ image: imageData.secure_url, prompt, variables });
    }
  }, [imageData]);

  return {
    request: (
      prompt: string | null,
      image: File | null,
      variables: InitialVariablesMenu
    ) => (setSelectedImage(image), setPrompt(prompt), setVariables(variables)),
    data: qrData,
    setData: (qrData: undefined | string[]) => setQrData(qrData),
    isLoading: isQRLoading || isCloudinaryLoading,
  };
};
