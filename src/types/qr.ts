import {
  StableDiffusionQRApiRequest,
  StableDiffusionQRApiResponse,
} from "./StableDiffusionApi";

export interface QR extends StableDiffusionQRApiRequest {
  id: number;
  output: string[];
  prompt: string;
  init_image: string;
  control_image: string;
}

export interface SuccessQrResponse {
  status: "success";
  data: StableDiffusionQRApiResponse;
  image: string;
}

export interface SettingVariables {
  controlnet_model: string;
  controlnet_type: string;
  model_id: string;
  width: number;
  height: number;
  controlnet_conditioning_scale: string;
  scheduler: string | null | undefined;
  num_inference_steps: number;
  guidance_scale: number;
  strength: number;
}

export interface IQRCard {
  parentRef: React.MutableRefObject<null>;
  id: number;
  output: string[];
  prompt: string;
  initImage: string;
  controlImage: string;
  settingVariables: SettingVariables;
  className?: string;
}
