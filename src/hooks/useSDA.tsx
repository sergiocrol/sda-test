import React from "react";
import { useToast } from "@/components/ui/use-toast";

import {
  addQR,
  generateQRRequest,
  generateSDimgToImgRequest,
  generateSDtextToImgRequest,
  handleProcessingResult,
} from "@/lib/helpers";

import {
  StableDiffusionQRApiRequest,
  StableDiffusionQRApiResponse,
  StableDiffusionTextToImgApiRequest,
  StableDiffusionApiResponse,
  StableDiffusionProcessingResponse,
  StableDiffusionImgToImgApiRequest,
  ControlNetType,
  ModelID,
  Scheduler,
  BooleanString,
} from "@/types/StableDiffusionApi";
import { InitialVariablesMenu } from "@/components/menuAttributes";

export const NUMBER_OF_GENERATED_QR = 3;
export const NUMBER_OF_GENERATED_IMAGE = 1;

export const QR_CODE_URL =
  "https://res.cloudinary.com/dfdamn9df/image/upload/v1688666767/qrcode-test_u8ok5o.png";
export const QR_CODE_URL_H_TOLERANCE =
  "https://res.cloudinary.com/dfdamn9df/image/upload/v1688804290/qr_test_30_tolerance_sykjyu.png";

const EXCEEDED_LIMIT_MESSAGE_KEY = "limit exceeded";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_STABLE_DIFFUSION_WEBHOOK;

const API_KEY = process.env.NEXT_PUBLIC_STABLE_DIFFUSION_API_KEY as string;

interface SDARequestProps {
  image?: string;
  controlImage?: string;
  prompt: string;
  variables: InitialVariablesMenu;
}

interface SDAReturnedValues {
  request: (requestProps: SDARequestProps) => void;
  qrData: undefined | string[];
  setQrData: (qrData: undefined | string[]) => void;
  isLoading: boolean;
  isError: boolean;
}

export interface SDAVariableParameters {
  prompt: string;
  initImage: string;
  controlImage: string;
  width: number;
  height: number;
  samples: number;
  controlModel: ControlNetType;
  controlType: ControlNetType;
  modelID: ModelID;
  strength: number;
  numInferenceSteps: number;
  guidanceScale: number;
  scheduler?: Scheduler | null;
  use_karras_sigmas?: BooleanString;
}

const getParameterizedDataStructure = ({
  prompt,
  initImage,
  controlImage,
  width,
  height,
  samples,
  controlModel,
  controlType,
  modelID,
  strength,
  numInferenceSteps,
  guidanceScale,
  scheduler,
  use_karras_sigmas,
}: SDAVariableParameters): StableDiffusionQRApiRequest => {
  return {
    key: API_KEY,
    controlnet_model: controlModel,
    controlnet_type: controlType,
    model_id: modelID,
    auto_hint: "yes",
    guess_mode: "no",
    prompt,
    negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
    init_image: initImage,
    control_image: controlImage,
    mask_image: undefined,
    tomesd: "yes",
    width,
    height,
    vae: null,
    lora_strength: null,
    lora_model: null,
    controlnet_conditioning_scale: 1.9,
    samples,
    scheduler,
    num_inference_steps: numInferenceSteps,
    safety_checker: "no",
    embeddings_model: null,
    base64: "no",
    enhance_prompt: "no",
    guidance_scale: guidanceScale,
    multi_lingual: "no",
    clip_skip: 1,
    strength,
    seed: null,
    upscale: "no",
    use_karras_sigmas: "yes",
    temp: "no",
    webhook: WEBHOOK_URL,
    track_id: "track_id_test",
  };
};

const MAX_RETRY_NUMBERS = 10;

const showGenericToast = (toast: any, title: string, subtitle: string) => {
  toast({
    variant: "destructive",
    title: <span className="text-lg">{title}</span>,
    description: <span className="text-base">{subtitle}</span>,
  });
};

const showApiErrorToast = (toast: any, stopLoading: () => void) => {
  toast({
    variant: "destructive",
    title: <span className="text-lg">Free account limit exceeded</span>,
    description: (
      <span className="text-base">
        Gift me one API key! 🥺 <br />
        <a
          className="underline"
          href="https://stablediffusionapi.com/register"
          target="_blank"
        >
          Create a free account
        </a>{" "}
        and{" "}
        <a className="underline" href="mailto: sergio.crol@gmail.com">
          share the key with me
        </a>
        .
      </span>
    ),
  });
  stopLoading();
};

export const useSDA = (): SDAReturnedValues => {
  const { toast } = useToast();

  const [data, setData] = React.useState<undefined | string[]>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [retryNumber, setRetryNumber] = React.useState(0);

  const addQrToDB = (
    qrCodeSucess: StableDiffusionQRApiResponse,
    image: string,
    qrCodeProcessing?: StableDiffusionProcessingResponse
  ) => {
    setData(qrCodeProcessing?.output || qrCodeSucess?.output);

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

  const handleRequestWithTimeout = (
    time: number,
    url: string,
    callback: (data: StableDiffusionProcessingResponse) => void
  ) => {
    setRetryNumber(retryNumber + 1);
    setTimeout(() => {
      handleProcessingResult(url).then(
        (data: StableDiffusionProcessingResponse) => {
          if (data?.status === "success") {
            callback(data);
            setIsLoading(false);
            setRetryNumber(0);
          } else if (data?.status === "processing") {
            if (retryNumber < MAX_RETRY_NUMBERS) {
              handleRequestWithTimeout(5000, url, callback);
            } else {
              showGenericToast(
                toast,
                "Response time exceeded",
                "It seems the server is not responding. Try it again later!"
              );
              setRetryNumber(0);
            }
          } else {
            setIsLoading(false);
            setRetryNumber(0);
            showGenericToast(
              toast,
              "Something went wrong",
              "It seems that the QR code generation process failed. Try it again in a while."
            );
          }
        }
      );
    }, time);
  };

  // This is for a request to QR creator model api "https://stablediffusionapi.com/api/v5/controlnet"
  const handleRequestWithImage = (
    prompt: string,
    image: string,
    variables: InitialVariablesMenu
  ) => {
    const params: SDAVariableParameters = {
      prompt,
      initImage: image,
      controlImage: QR_CODE_URL,
      ...variables,
    };

    const dataSDA = getParameterizedDataStructure(params);

    setIsLoading(true);
    generateQRRequest(dataSDA)
      .then((data: StableDiffusionQRApiResponse) => {
        if (data?.status === "success") {
          addQrToDB(data, image);
          setIsLoading(false);
        } else if (data?.status === "processing") {
          if (data?.fetch_result) {
            handleRequestWithTimeout(
              8000,
              data.fetch_result,
              (dataProcessing) => addQrToDB(data, image, dataProcessing)
            );
          }
        } else if (
          data?.status === "error" &&
          data?.message?.includes(EXCEEDED_LIMIT_MESSAGE_KEY)
        ) {
          showApiErrorToast(toast, () => setIsLoading(false));
        } else {
          setIsLoading(false);
          showGenericToast(
            toast,
            "Something went wrong",
            "It seems that the QR code generation process failed. Try it again in a while."
          );
        }
      })
      .catch(() => (setIsError(true), setIsLoading(false)));
  };

  // This is for a request to Stable Diffusion text2Img API
  const handleRequestWithoutImage = (
    prompt: string,
    variables: InitialVariablesMenu
  ) => {
    const dataSDA: StableDiffusionTextToImgApiRequest = {
      key: API_KEY,
      prompt,
      negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      width: variables.width,
      height: variables.height,
      samples: NUMBER_OF_GENERATED_IMAGE,
      num_inference_steps: variables.numInferenceSteps,
      safety_checker: "no",
      enhance_prompt: "yes",
      seed: null,
      guidance_scale: variables.guidanceScale,
      webhook: WEBHOOK_URL,
      track_id: "track_id_test",
    };

    setIsLoading(true);
    generateSDtextToImgRequest(dataSDA)
      .then((data: StableDiffusionApiResponse) => {
        const params: SDAVariableParameters = {
          prompt,
          initImage: data?.output && data?.output[0],
          controlImage: QR_CODE_URL,
          ...variables,
        };

        if (data?.status === "success") {
          handleRequestWithImage(prompt, params.initImage, params);
        } else if (data?.status === "processing") {
          if (data?.fetch_result) {
            handleRequestWithTimeout(8000, data.fetch_result, (data) =>
              handleRequestWithImage(prompt, params.initImage, params)
            );
          }
        } else if (
          data?.status === "error" &&
          data?.message?.includes(EXCEEDED_LIMIT_MESSAGE_KEY)
        ) {
          showApiErrorToast(toast, () => setIsLoading(false));
        } else {
          setIsLoading(false);
          showGenericToast(
            toast,
            "Something went wrong",
            "It seems that the QR code generation process failed. Try it again in a while."
          );
        }
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
        showGenericToast(
          toast,
          "Something went wrong",
          "It seems that the QR code generation process failed. Try it again in a while."
        );
      });
  };

  const handleSDARequest = (requestProps: SDARequestProps) => {
    const { prompt, image, controlImage, variables } = requestProps;

    if (image) {
      handleRequestWithImage(prompt, image, variables);
    } else {
      handleRequestWithoutImage(prompt, variables);
    }
  };

  // TODO: Optional method for testing a better result?
  const imgToImgRequest = (requestProps: SDARequestProps) => {
    // Here the passed image is not the init_image used in the other requests, but the qrCode itself
    // (the control_image in the other requests)
    const { prompt, image } = requestProps;

    const dataSDA: StableDiffusionImgToImgApiRequest = {
      key: API_KEY,
      init_image: image!,
      prompt,
      negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
      width: 768,
      height: 768,
      samples: NUMBER_OF_GENERATED_IMAGE,
      num_inference_steps: 51,
      safety_checker: "no",
      enhance_prompt: "yes",
      strength: 0.75,
      seed: null,
      guidance_scale: 7,
      webhook: WEBHOOK_URL,
      track_id: "track_id_test",
    };

    setIsLoading(true);
    generateSDimgToImgRequest(dataSDA)
      .then((data: StableDiffusionApiResponse) => {
        const params: SDAVariableParameters = {
          prompt,
          initImage: data?.output && data?.output[0],
          controlImage: QR_CODE_URL,
          width: 512,
          height: 512,
          samples: NUMBER_OF_GENERATED_QR,
          controlModel: "qrcode",
          controlType: "qrcode",
          modelID: "ghostmix",
          strength: 0.87,
          guidanceScale: 7,
          numInferenceSteps: 50,
        };

        if (data?.status === "success") {
          handleRequestWithImage(prompt, data?.output[0], params);
        } else if (data?.status === "processing") {
          if (data?.fetch_result) {
            handleRequestWithTimeout(8000, data.fetch_result, (data) =>
              handleRequestWithImage(prompt, data?.output[0], params)
            );
          }
        } else if (
          data?.status === "error" &&
          data?.message?.includes(EXCEEDED_LIMIT_MESSAGE_KEY)
        ) {
          showApiErrorToast(toast, () => setIsLoading(false));
        } else {
          setIsLoading(false);
          showGenericToast(
            toast,
            "Something went wrong",
            "It seems that the QR code generation process failed. Try it again in a while."
          );
        }
      })
      .catch(() => (setIsError(true), setIsLoading(false)));
  };

  return {
    request: (requestProps: SDARequestProps) => handleSDARequest(requestProps),
    qrData: data,
    setQrData: (qrData) => setData(qrData),
    isLoading,
    isError,
  };
};
