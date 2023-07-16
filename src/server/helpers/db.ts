import { QR_CODE_URL } from "@/constants/api";
import { QR } from "@/types/qr";
import {
  BooleanString,
  ControlNetType,
  ModelID,
  Scheduler,
  StableDiffusionProcessingResponse,
  StableDiffusionQRApiResponse,
} from "@/types/StableDiffusionApi";
import axios, { AxiosResponse } from "axios";

export const addQrToDB = async (
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

    const result: QR = await addQR({
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

    return result;
  }
};

export const addQR = async (props: Omit<QR, "id" | "key">) => {
  const ADD_QR_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/qr`;

  const data = props;

  try {
    const response: AxiosResponse<any> = await axios.post(
      ADD_QR_API_URL,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Error adding the image.");
  }
};
