interface MetaResponse {
  prompt: string;
}

export const controlnetTypeIds = [
  "qrcode",
  "canny",
  "depth",
  "hed",
  "mlsd",
  "normal",
  "openpose",
  "scribble",
  "segmentation",
  "aesthetic-controlnet",
  "inpaint",
  "softedge",
  "lineart",
  "shuffle",
  "tile",
  "face_detector",
] as const;
export type ControlNetType = (typeof controlnetTypeIds)[number];

export const schedulers = [
  "DDPMScheduler",
  "DDIMScheduler",
  "PNDMScheduler",
  "LMSDiscreteScheduler",
  "EulerDiscreteScheduler",
  "EulerAncestralDiscreteScheduler",
  "DPMSolverMultistepScheduler",
  "HeunDiscreteScheduler",
  "KDPM2DiscreteScheduler",
  "DPMSolverSinglestepScheduler",
  "KDPM2AncestralDiscreteScheduler",
  "UniPCMultistepScheduler",
  "DDIMInverseScheduler",
  "DEISMultistepScheduler",
  "IPNDMScheduler",
  "KarrasVeScheduler",
  "ScoreSdeVeScheduler",
] as const;
export type Scheduler = (typeof schedulers)[number];

export const models = ["midjourney", "ghostmix", "sd-1.5"] as const;
export type ModelID = (typeof models)[number];

export interface StableDiffusionQRApiRequest {
  key: string;
  model_id: ModelID;
  controlnet_type: ControlNetType;
  controlnet_model: ControlNetType;
  auto_hint: "yes" | "no";
  guess_mode: "yes" | "no";
  prompt: string;
  negative_prompt: string;
  init_image: string;
  control_image: string;
  mask_image?: string;
  width: number;
  height: number;
  samples: number;
  scheduler?: Scheduler | null;
  tomesd?: "yes" | "no";
  use_karras_sigmas?: "yes" | "no";
  vae?: string;
  lora_strength?: number;
  lora_model?: string;
  num_inference_steps: number;
  safety_checker: "yes" | "no";
  embeddings_model?: string;
  enhance_prompt: "yes" | "no";
  multi_lingual?: "yes" | "no";
  guidance_scale: number;
  controlnet_conditioning_scale: number;
  strength: number;
  seed?: number;
  webhook?: string;
  track_id?: string;
  upscale?: "yes" | "no";
  clip_skip?: number;
  base64?: "yes" | "no";
  temp?: "yes" | "no";
}

export interface StableDiffusionQRApiResponse {
  generationTime: number;
  id: number;
  output: string[];
  meta?: MetaResponse;
  fetch_result?: string;
  status: "success" | "error" | "processing" | "failed";
  message?: string;
}

export interface StableDiffusionTextToImgApiRequest {
  key: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  samples: number;
  num_inference_steps: number;
  safety_checker: "yes" | "no";
  enhance_prompt: "yes" | "no";
  seed: null;
  guidance_scale: number;
  multi_lingual?: "yes" | "no";
  panorama?: "yes" | "no";
  self_attention?: "yes" | "no";
  upscale?: "yes" | "no";
  embeddings_model?: string;
  webhook?: string;
  track_id?: string;
}

export interface StableDiffusionImgToImgApiRequest {
  key: string;
  prompt: string;
  negative_prompt: string;
  init_image: string;
  width: number;
  height: number;
  samples: number;
  num_inference_steps: number;
  safety_checker: "yes" | "no";
  enhance_prompt: "yes" | "no";
  seed: null;
  guidance_scale: number;
  strength: number;
  webhook?: string;
  track_id?: string;
}

export interface StableDiffusionApiResponse {
  generationTime: number;
  id: number;
  output: string[];
  meta?: MetaResponse;
  fetch_result?: string;
  status: "success" | "error" | "processing" | "failed";
  message?: string;
}

export interface StableDiffusionProcessingResponse {
  id: number;
  output: string[];
  status: "success" | "error" | "processing" | "failed";
  message?: string;
}
