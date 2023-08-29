import axios, { AxiosResponse } from "axios";

import { API_KEY, SDA_QR_API_URL, WEBHOOK_URL } from "@/constants/api";

import {
  SDAVariableParameters,
  StableDiffusionProcessingResponse,
  StableDiffusionQRApiRequest,
  StableDiffusionQRApiResponse,
  StableDiffusionTextToImgApiRequest,
} from "@/types/StableDiffusionApi";

export const generateSDtextToImgRequest = async (
  props: StableDiffusionTextToImgApiRequest
): Promise<StableDiffusionQRApiResponse> => {
  const data = props;

  try {
    const response: AxiosResponse<any> = await axios.post(
      SDA_QR_API_URL,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Error generating Image.");
  }
};

export const generateQRRequest = async (
  props: StableDiffusionQRApiRequest
): Promise<StableDiffusionQRApiResponse> => {
  const SDA_QR_API_URL = `${process.env.NEXT_PUBLIC_SD_API_BASE_URL}/controlnet`;

  const data = props;

  try {
    const response: AxiosResponse<any> = await axios.post(
      SDA_QR_API_URL,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Error generating QR.");
  }
};

export const handleProcessingResult = async (
  url: string
): Promise<StableDiffusionProcessingResponse> => {
  const SDA_PROCESSING_API_URL = url;

  try {
    const response: AxiosResponse<any> = await axios.post(
      SDA_PROCESSING_API_URL,
      {
        key: process.env.NEXT_PUBLIC_STABLE_DIFFUSION_API_KEY,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Error fetching result.");
  }
};

export const getParameterizedDataStructure = ({
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
