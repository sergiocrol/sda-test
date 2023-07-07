import React from "react";

import {
  addQR,
  generateQRRequest,
  generateSDRequest,
  handleProcessingResult,
} from "@/lib/helpers";

import {
  StableDiffusionQRApiRequest,
  StableDiffusionQRApiResponse,
  StableDiffusionApiRequest,
  StableDiffusionApiResponse,
  StableDiffusionProcessingResponse,
} from "@/types/StableDiffusionApi";

const QR_CODE_URL =
  "https://res.cloudinary.com/dfdamn9df/image/upload/v1688666767/qrcode-test_u8ok5o.png";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_STABLE_DIFFUSION_WEBHOOK;

interface SDARequestProps {
  image?: string;
  prompt: string;
}

interface SDAReturnedValues {
  request: (requestProps: SDARequestProps) => void;
  qrData: undefined | string[];
  isLoading: boolean;
  isError: boolean;
}

export const useSDA = (): SDAReturnedValues => {
  const [data, setData] = React.useState<undefined | string[]>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const handleRequestWithTimeout = (
    time: number,
    url: string,
    callback: (data: StableDiffusionProcessingResponse) => void
  ) => {
    setTimeout(() => {
      handleProcessingResult(url).then(
        (data: StableDiffusionProcessingResponse) => {
          if (data?.status === "success") {
            callback(data);
            setIsLoading(false);
          } else if (data?.status === "processing") {
            handleRequestWithTimeout(5000, url, callback);
          } else {
            setIsLoading(false);
            throw new Error();
          }
        }
      );
    }, time);
  };

  const handleRequestWithImage = (prompt: string, image: string) => {
    const dataSDA: StableDiffusionQRApiRequest = {
      key: process.env.NEXT_PUBLIC_STABLE_DIFFUSION_API_KEY as string,
      controlnet_model: "qrcode",
      controlnet_type: "qrcode",
      model_id: "midjourney",
      auto_hint: "yes",
      guess_mode: "no",
      prompt,
      negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      init_image: image,
      control_image: QR_CODE_URL,
      width: 512,
      height: 512,
      controlnet_conditioning_scale: 1.9,
      samples: 4,
      scheduler: null,
      num_inference_steps: 31,
      safety_checker: "no",
      base64: "no",
      enhance_prompt: "no",
      guidance_scale: 7.5,
      strength: 0.55,
      webhook: WEBHOOK_URL,
      track_id: "track_id_test",
    };

    setIsLoading(true);
    generateQRRequest(dataSDA)
      .then((data: StableDiffusionQRApiResponse) => {
        if (data?.status === "success") {
          setData(data?.output);
          addQR({
            output: data?.output,
            prompt: data?.meta?.prompt || "",
            init_image: image,
            control_image: QR_CODE_URL,
          });
          setIsLoading(false);
        } else if (data?.status === "processing") {
          if (data?.fetch_result) {
            handleRequestWithTimeout(
              8000,
              data.fetch_result,
              (dataProcessing) => {
                setData(dataProcessing?.output);
                addQR({
                  output: dataProcessing?.output,
                  prompt: data?.meta?.prompt || "",
                  init_image: image,
                  control_image: QR_CODE_URL,
                });
              }
            );
          }
        } else {
          setIsLoading(false);
          throw new Error();
        }
      })
      .catch(() => (setIsError(true), setIsLoading(false)));
  };

  const handleRequestWithoutImage = (prompt: string) => {
    const dataSDA: StableDiffusionApiRequest = {
      key: process.env.NEXT_PUBLIC_STABLE_DIFFUSION_API_KEY as string,
      prompt,
      negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      width: 512,
      height: 512,
      samples: 1,
      num_inference_steps: 20,
      safety_checker: "no",
      enhance_prompt: "yes",
      seed: null,
      guidance_scale: 7.5,
      webhook: WEBHOOK_URL,
      track_id: "track_id_test",
    };

    setIsLoading(true);
    generateSDRequest(dataSDA)
      .then((data: StableDiffusionApiResponse) => {
        if (data?.status === "success") {
          handleRequestWithImage(prompt, data?.output[0]);
        } else if (data?.status === "processing") {
          if (data?.fetch_result) {
            handleRequestWithTimeout(8000, data.fetch_result, (data) =>
              handleRequestWithImage(prompt, data?.output[0])
            );
          }
        } else {
          setIsLoading(false);
          throw new Error();
        }
      })
      .catch(() => (setIsError(true), setIsLoading(false)));
  };

  const handleSDARequest = (requestProps: SDARequestProps) => {
    const { prompt, image } = requestProps;

    if (image) {
      handleRequestWithImage(prompt, image);
    } else {
      handleRequestWithoutImage(prompt);
    }
  };

  return {
    request: (requestProps: SDARequestProps) => handleSDARequest(requestProps),
    qrData: data,
    isLoading,
    isError,
  };
};
