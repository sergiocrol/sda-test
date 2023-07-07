import axios, { AxiosResponse } from "axios";

import {
  StableDiffusionQRApiRequest,
  StableDiffusionQRApiResponse,
  StableDiffusionApiRequest,
  StableDiffusionApiResponse,
  StableDiffusionProcessingResponse,
} from "@/types/StableDiffusionApi";

import { QR } from "./qrs-repo";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const uploadImage = async (
  url: string,
  file: File,
  upload_preset: string
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset);

  try {
    const response: AxiosResponse<any> = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Error uploading image.");
  }
};

export const generateQRRequest = async (
  props: StableDiffusionQRApiRequest
): Promise<StableDiffusionQRApiResponse> => {
  const SDA_QR_API_URL = "https://stablediffusionapi.com/api/v5/controlnet";

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

export const generateSDRequest = async (
  props: StableDiffusionApiRequest
): Promise<StableDiffusionQRApiResponse> => {
  const SDA_QR_API_URL = "https://stablediffusionapi.com/api/v3/text2img";

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

export const addQR = async (props: QR) => {
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
    throw new Error("Error generating Image.");
  }
};
