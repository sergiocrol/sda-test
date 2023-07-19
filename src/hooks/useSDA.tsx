import React from "react";

import { useToast } from "@/components/ui/use-toast";
import { showApiErrorToast, showGenericToast } from "@/components/toasts";

import {
  addToDB,
  generateImage,
  generateQR,
  generateQRCode,
  processingResult,
} from "@/lib/helpers";

import {
  GENERATING_QR_ERROR,
  GENERATING_QR_ERROR_LIMIT_API,
  GENERATING_QR_ERROR_MAX_ERRORS,
  QR_CODE_URL,
  TIME_TO_REQUEST,
} from "@/constants/api";

import {
  BooleanString,
  ControlNetType,
  ModelID,
  Scheduler,
  SDARequestProps,
  SDAReturnedValues,
  SDAVariableParameters,
  StableDiffusionApiResponse,
  StableDiffusionProcessingResponse,
  StableDiffusionQRApiResponse,
} from "@/types/StableDiffusionApi";
import generate from "@/pages/api/generate";
import { ErrorInterface } from "@/types/error";
import { formatError } from "@/server/helpers/error";
import { QR } from "@/types/qr";
import { addQR } from "@/server/helpers/db";

export const useSDA = (): SDAReturnedValues => {
  const { toast } = useToast();

  const [data, setData] = React.useState<undefined | string[]>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError] = React.useState(false);

  const handleRequestWithTimeout = async (
    time: number,
    url: string,
    callback: (data: StableDiffusionProcessingResponse) => void
  ) => {
    const MAX_ATTEMPTS = 100;
    let attempts = 0;

    const recursiveRequest = async () => {
      const processingData = await processingResult(url);

      if (processingData?.status === "success") {
        callback(processingData);
        return;
      } else if (processingData?.status === "processing") {
        return new Promise((resolve) => {
          setTimeout(async () => {
            attempts++;
            if (attempts <= MAX_ATTEMPTS) {
              const result = await recursiveRequest();
              resolve(result);
            } else {
              showGenericToast(
                toast,
                "Something went wrong",
                GENERATING_QR_ERROR_MAX_ERRORS.message
              );
              setIsLoading(false);
              resolve(formatError(GENERATING_QR_ERROR_MAX_ERRORS));
            }
          }, time);
        });
      } else {
        showGenericToast(
          toast,
          "Something went wrong",
          GENERATING_QR_ERROR.message
        );
        setIsLoading(false);
        return;
      }
    };

    return recursiveRequest();
  };

  const handleSDARequest = (requestProps: SDARequestProps) => {
    const { image } = requestProps;
    setIsLoading(true);

    if (!image) {
      handleRequestImage(requestProps);
    } else {
      handleRequestQr(requestProps);
    }
  };

  const handleRequestImage = (requestProps: SDARequestProps) => {
    const { prompt, variables, controlImage } = requestProps;

    setIsLoading(true);
    generateImage(requestProps)
      .then(
        (
          data: StableDiffusionProcessingResponse | StableDiffusionApiResponse
        ) => {
          if (data?.status === "processing") {
            handleRequestWithTimeout(
              TIME_TO_REQUEST,
              (data as StableDiffusionApiResponse).fetch_result!,
              (data) =>
                handleRequestQr({
                  prompt,
                  variables,
                  controlImage,
                  image: data.output && data.output[0],
                })
            );
          } else if (data?.status === "success") {
            const params: SDAVariableParameters = {
              prompt,
              initImage: data?.output && data?.output[0],
              controlImage: QR_CODE_URL,
              ...variables,
            };

            handleRequestQr({
              prompt,
              controlImage,
              variables: params,
              image: params.initImage,
            });
          } else {
            data?.message === GENERATING_QR_ERROR_LIMIT_API.message
              ? showApiErrorToast(toast)
              : showGenericToast(
                  toast,
                  "Something went wrong",
                  data.message || data.messege || "Undefined error"
                );
            setIsLoading(false);
          }
        }
      )
      .catch((error) => {
        setIsLoading(false);
        showGenericToast(
          toast,
          "Something went wrong",
          error.message || error.messege
        );
      });
  };

  const handleRequestQr = (requestProps: SDARequestProps) => {
    const { prompt, variables, image, controlImage } = requestProps;
    setIsLoading(true);
    generateQRCode(requestProps)
      .then((data: StableDiffusionQRApiResponse) => {
        if (data?.status === "processing") {
          handleRequestWithTimeout(
            TIME_TO_REQUEST,
            (data as StableDiffusionApiResponse).fetch_result!,
            (dataProcessing: StableDiffusionProcessingResponse) => {
              setIsLoading(false);
              setData(dataProcessing.output);
              addQrToDB(data, image!, dataProcessing);
            }
          );
        } else if (data?.status === "success") {
          setData(data.output);
          addQrToDB(data, image!);
          setIsLoading(false);
        } else {
          data?.message === GENERATING_QR_ERROR_LIMIT_API.message
            ? showApiErrorToast(toast)
            : showGenericToast(
                toast,
                "Something went wrong",
                data.message || data.messege || "Undefined error"
              );
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        showGenericToast(
          toast,
          "Something went wrong",
          error.message || error.messege || "undefined error"
        );
      });
  };

  const addQrToDB = (
    qrCodeSucess: StableDiffusionQRApiResponse,
    image: string,
    qrCodeProcessing?: StableDiffusionProcessingResponse
  ) => {
    if (qrCodeSucess && qrCodeSucess.meta) {
      const {
        H,
        W,
        auto_hint,
        base64,
        clip_skip,
        controlnet_conditioning_scale,
        controlnet_model,
        controlnet_type,
        enhance_prompt,
        embeddings,
        guess_mode,
        guidance_scale,
        lora,
        lora_strength,
        mask_image,
        model_id,
        multi_lingual,
        n_samples,
        negative_prompt,
        prompt,
        safety_checker,
        scheduler,
        seed,
        steps,
        strength,
        temp,
        tomesd,
        upscale,
        use_karras_sigmas,
        vae,
      } = qrCodeSucess.meta!;

      addQR({
        output: qrCodeProcessing?.output || qrCodeSucess.output,
        prompt: prompt || "",
        init_image: image,
        control_image: QR_CODE_URL,
        auto_hint: auto_hint as BooleanString,
        base64: base64 as BooleanString,
        controlnet_conditioning_scale,
        controlnet_model: controlnet_model as ControlNetType,
        controlnet_type: controlnet_type as ControlNetType,
        enhance_prompt: enhance_prompt as BooleanString,
        guess_mode: guess_mode as BooleanString,
        guidance_scale,
        height: H,
        width: W,
        model_id: model_id as ModelID,
        negative_prompt,
        num_inference_steps: steps,
        safety_checker: safety_checker as BooleanString,
        samples: n_samples,
        scheduler: scheduler as Scheduler,
        strength,
        use_karras_sigmas: use_karras_sigmas as BooleanString,
        clip_skip,
        embeddings_model: embeddings,
        lora_model: lora,
        lora_strength,
        mask_image,
        multi_lingual: multi_lingual as BooleanString,
        seed,
        temp: temp as BooleanString,
        tomesd: tomesd as BooleanString,
        upscale: upscale as BooleanString,
        vae,
      });
    }
  };

  return {
    request: (requestProps: SDARequestProps) => handleSDARequest(requestProps),
    qrData: data,
    setQrData: (qrData) => setData(qrData),
    isLoading,
    isError,
  };
};
