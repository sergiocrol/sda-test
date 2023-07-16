import axios, { AxiosResponse } from "axios";

import { SDARequestProps } from "@/types/StableDiffusionApi";

export const fetcher = (url: string) => {
  return fetch(url)
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

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

export const generateQR = async (props: SDARequestProps) => {
  const ADD_QR_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate`;

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
  } catch (error: any) {
    return error.response.data;
  }
};
