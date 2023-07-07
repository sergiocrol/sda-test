interface MetaResponse {
  prompt: string;
}

export interface StableDiffusionQRApiResponse {
  generationTime: number;
  id: number;
  output: string[];
  meta?: MetaResponse;
  fetch_result?: string;
  status: "success" | "error" | "processing";
}

export interface StableDiffusionQRApiRequest {
  key: string;
  controlnet_type: "qrcode";
  controlnet_model: "qrcode";
  model_id: "midjourney";
  auto_hint: "yes" | "no";
  guess_mode: "yes" | "no";
  prompt: string;
  negative_prompt: string;
  init_image: string;
  control_image: string;
  width: number;
  height: number;
  controlnet_conditioning_scale: number;
  samples: number;
  scheduler: null;
  num_inference_steps: number;
  safety_checker: "yes" | "no";
  base64: "yes" | "no";
  enhance_prompt: "yes" | "no";
  guidance_scale: number;
  strength: number;
  webhook?: string;
  track_id?: string;
}

export interface StableDiffusionApiRequest {
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
  webhook?: string;
  track_id?: string;
}

export interface StableDiffusionApiResponse {
  generationTime: number;
  id: number;
  output: string[];
  meta?: MetaResponse;
  fetch_result?: string;
  status: "success" | "error" | "processing";
}

export interface StableDiffusionProcessingResponse {
  id: number;
  output: string[];
  status: "success" | "error" | "processing";
}
