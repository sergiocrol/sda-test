import { InitialVariablesMenu } from "@/components/menuAttributes";

interface MetaResponse {
  prompt: string;
  H: number;
  W: number;
  auto_hint: string;
  base64: string;
  clip_skip: number;
  control_image: string;
  controlnet_conditioning_scale: number;
  controlnet_model: string;
  controlnet_type: string;
  embeddings: string | null;
  file_prefix: string;
  full_url: string;
  guess_mode: string;
  guidance_scale: number;
  enhance_prompt?: string;
  init_image: string;
  lora: string | null;
  lora_strength: number;
  mask_image: string | null;
  model_id: string;
  multi_lingual: string;
  n_samples: number;
  negative_prompt: string;
  safety_checker: string;
  scheduler: string | null;
  seed: number;
  steps: number;
  strength: number;
  temp: string;
  tomesd: string;
  upscale: string;
  use_karras_sigmas: string;
  vae: string | null;
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

export const models = [
  "midjourney",
  "ghostmix",
  "anything-v3",
  "sd-1.5",
  "dream-shaper-8797",
  "rev-animated",
] as const;
export type ModelID = (typeof models)[number];

export type BooleanString = "yes" | "no";

export interface StableDiffusionQRApiRequest {
  key: string;
  model_id: ModelID;
  controlnet_type: ControlNetType;
  controlnet_model: ControlNetType;
  auto_hint: BooleanString;
  guess_mode: BooleanString;
  prompt: string;
  negative_prompt: string;
  init_image: string;
  control_image: string;
  mask_image?: string | null;
  width: number;
  height: number;
  samples: number;
  scheduler?: Scheduler | null;
  tomesd?: BooleanString;
  use_karras_sigmas?: BooleanString;
  vae?: string | null;
  lora_strength?: number | null;
  lora_model?: string | null;
  num_inference_steps: number;
  safety_checker: BooleanString;
  embeddings_model?: string | null;
  enhance_prompt: BooleanString;
  multi_lingual?: BooleanString;
  guidance_scale: number;
  controlnet_conditioning_scale: number;
  strength: number;
  seed?: number | null;
  webhook?: string;
  track_id?: string;
  upscale?: BooleanString;
  clip_skip?: number;
  base64?: BooleanString;
  temp?: BooleanString;
}

export interface StableDiffusionQRApiResponse {
  generationTime: number;
  id: number;
  output: string[];
  meta?: MetaResponse;
  fetch_result?: string;
  status: "success" | "error" | "processing" | "failed";
  message?: string;
  messege?: string;
  image_links?: string[];
}

export interface StableDiffusionTextToImgApiRequest {
  key: string;
  model_id: ModelID;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  samples: number;
  num_inference_steps: number;
  safety_checker: BooleanString;
  enhance_prompt: BooleanString;
  seed: null;
  guidance_scale: number;
  multi_lingual?: BooleanString;
  panorama?: BooleanString;
  self_attention?: BooleanString;
  upscale?: BooleanString;
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
  safety_checker: BooleanString;
  enhance_prompt: BooleanString;
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
  messege?: string;
}

export interface StableDiffusionProcessingResponse {
  id: number;
  output: string[];
  status: "success" | "error" | "processing" | "failed";
  message?: string;
  messege?: string;
}

export interface SDARequestProps {
  image?: string;
  controlImage?: string;
  prompt: string;
  variables: InitialVariablesMenu;
}

export interface SDAReturnedValues {
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
