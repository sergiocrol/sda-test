import React from "react";

import { useToast } from "@/components/ui/use-toast";
import { showApiErrorToast, showGenericToast } from "@/components/toasts";

import { generateQR } from "@/lib/helpers";

import { GENERATING_QR_ERROR_LIMIT_API } from "@/constants/api";

import { SDARequestProps, SDAReturnedValues } from "@/types/StableDiffusionApi";

export const useSDA = (): SDAReturnedValues => {
  const { toast } = useToast();

  const [data, setData] = React.useState<undefined | string[]>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError] = React.useState(false);

  const handleSDARequest = (requestProps: SDARequestProps) => {
    setIsLoading(true);
    generateQR(requestProps)
      .then((data) => {
        if (data?.status === "error") {
          data?.message === GENERATING_QR_ERROR_LIMIT_API.message
            ? showApiErrorToast(toast)
            : showGenericToast(toast, "Something went wrong", data.message);
        } else {
          setData(data?.output || data?.data?.output);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showGenericToast(toast, "Something went wrong", error.message);
      });
  };

  return {
    request: (requestProps: SDARequestProps) => handleSDARequest(requestProps),
    qrData: data,
    setQrData: (qrData) => setData(qrData),
    isLoading,
    isError,
  };
};
