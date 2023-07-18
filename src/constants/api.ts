import { ErrorInterface } from "@/types/error";

export const SDA_QR_API_URL = "https://stablediffusionapi.com/api/v3/text2img";
export const API_KEY = process.env
  .NEXT_PUBLIC_STABLE_DIFFUSION_API_KEY as string;
export const NUMBER_OF_GENERATED_IMAGE = 1;
export const NUMBER_OF_GENERATED_QR = 3;
export const TIME_TO_REQUEST = 2000;
export const WEBHOOK_URL = process.env.NEXT_PUBLIC_STABLE_DIFFUSION_WEBHOOK;
export const QR_CODE_URL =
  "https://res.cloudinary.com/dfdamn9df/image/upload/v1688666767/qrcode-test_u8ok5o.png";
export const QR_CODE_URL_H_TOLERANCE =
  "https://res.cloudinary.com/dfdamn9df/image/upload/v1688804290/qr_test_30_tolerance_sykjyu.png";

export const EXCEEDED_LIMIT_MESSAGE_KEY = "limit exceeded";
export const GENERATING_QR_ERROR: ErrorInterface = {
  status: "error",
  message:
    "It seems that the QR code generation process failed. Try it again in a while.",
};
export const GENERATING_QR_ERROR_LIMIT_API: ErrorInterface = {
  status: "error",
  message: "limit exceeded",
};
export const GENERATING_QR_ERROR_MAX_ERRORS: ErrorInterface = {
  status: "error",
  message: "Request generation time exceeded.",
};
