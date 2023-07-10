import { StableDiffusionQRApiRequest } from "./StableDiffusionApi";

export interface QR extends StableDiffusionQRApiRequest {
  id: number;
  output: string[];
  prompt: string;
  init_image: string;
  control_image: string;
}
