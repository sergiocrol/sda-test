import { NextApiRequest, NextApiResponse } from "next";

import { getAllQrs, saveQr } from "@/server/models/qrs.model";

import catchAsyncErrors from "@/server/middlewares/catchAsyncErrors";

import { QR, SuccessQrResponse } from "@/types/qr";
import {
  SDARequestProps,
  SDAVariableParameters,
  StableDiffusionApiResponse,
  StableDiffusionProcessingResponse,
  StableDiffusionQRApiResponse,
  StableDiffusionTextToImgApiRequest,
} from "@/types/StableDiffusionApi";

import { InitialVariablesMenu } from "@/components/menuAttributes";
import {
  API_KEY,
  EXCEEDED_LIMIT_MESSAGE_KEY,
  GENERATING_QR_ERROR,
  GENERATING_QR_ERROR_LIMIT_API,
  GENERATING_QR_ERROR_MAX_ERRORS,
  NUMBER_OF_GENERATED_IMAGE,
  QR_CODE_URL,
  TIME_TO_REQUEST,
  WEBHOOK_URL,
} from "@/constants/api";
import {
  generateQRRequest,
  generateSDtextToImgRequest,
  getParameterizedDataStructure,
  handleProcessingResult,
} from "@/server/helpers/request";
import { formatError } from "@/server/helpers/error";
import { ErrorInterface } from "@/types/error";
import { addQrToDB } from "@/server/helpers/db";

export const httpGetAllQrs = catchAsyncErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const qrs = await getAllQrs();

    res.status(200).json(qrs);
  }
);

export const httpPostQr = catchAsyncErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const qrToSave: QR = req.body;

    const qr = await saveQr(qrToSave);

    res.status(201).json(qr);
  }
);

export const httpGenerateQr = catchAsyncErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userData: SDARequestProps = req.body;

    const { prompt, image, controlImage, variables } = userData;

    let response: Promise<
      | StableDiffusionProcessingResponse
      | ErrorInterface
      | SuccessQrResponse
      | undefined
    >;
    if (image) {
      response = generateQrWithImage(prompt, image, variables);
    } else {
      response = generateQrWithoutImage(prompt, variables);
    }

    const result = await response;

    if (result?.status === "success") {
      const response = result as SuccessQrResponse;

      await addQrToDB(response.data, image || response.image);
      res.status(200).json(response);
    } else {
      res.status(500).json(result);
    }
  }
);

export const httpGenerateQrCode = catchAsyncErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userData: SDARequestProps = req.body;

    const { prompt, image, variables } = userData;

    let response;

    response = generateQrCodeWithImage(prompt, image!, variables);
    const result = await response;

    if (result?.status === "processing") {
      res.status(200).json(result.data);
    } else if (result?.status === "success") {
      const response = result as SuccessQrResponse;

      res.status(200).json(response.data);
    } else {
      res.status(500).json(result);
    }
  }
);

export const httpGenerateImage = catchAsyncErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userData: SDARequestProps = req.body;

    const { prompt, image, controlImage, variables } = userData;

    let response: Promise<
      | StableDiffusionProcessingResponse
      | ErrorInterface
      | SuccessQrResponse
      | undefined
    >;

    response = generateQrWithoutImage(prompt, variables);

    const result = await response;

    if (result?.status === "success" || result?.status === "processing") {
      const response = result;

      res.status(200).json(response);
    } else {
      res.status(500).json(result);
    }
  }
);

export const httpProcessingResult = catchAsyncErrors(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const processingData: { url: string } = req.body;

    const { url } = processingData;

    let response: Promise<
      | StableDiffusionProcessingResponse
      | ErrorInterface
      | SuccessQrResponse
      | undefined
    >;

    response = handleProcessingResult(url);

    const result = await response;

    if (result?.status === "success" || result?.status === "processing") {
      const response = result;

      res.status(200).json(response);
    } else {
      res.status(500).json(result);
    }
  }
);

const generateQrWithoutImage = async (
  prompt: string,
  variables: InitialVariablesMenu
) => {
  const dataSDA: StableDiffusionTextToImgApiRequest = {
    key: API_KEY,
    model_id: variables.modelID,
    prompt,
    negative_prompt: "ugly, disfigured, low quality, blurry, nsfw",
    width: variables.width,
    height: variables.height,
    samples: NUMBER_OF_GENERATED_IMAGE,
    num_inference_steps: variables.numInferenceSteps,
    safety_checker: "no",
    enhance_prompt: "yes",
    seed: null,
    guidance_scale: variables.guidanceScale,
    webhook: WEBHOOK_URL,
    track_id: "track_id_test",
  };

  const sdaResponse: StableDiffusionApiResponse =
    await generateSDtextToImgRequest(dataSDA);

  const params: SDAVariableParameters = {
    prompt,
    initImage: sdaResponse?.output && sdaResponse?.output[0],
    controlImage: QR_CODE_URL,
    ...variables,
  };

  return sdaResponse;
  // manejamos la respuesta en FE
  // if (sdaResponse.status === "success") {
  //   const response = await generateQrWithImage(
  //     prompt,
  //     params.initImage,
  //     params
  //   );
  //   return response;
  // } else if (sdaResponse.status === "processing" && sdaResponse.fetch_result) {
  //   const response = await handleRequestWithTimeout(
  //     TIME_TO_REQUEST,
  //     sdaResponse.fetch_result
  //   );
  //   if (response.status === "error") {
  //     return formatError(GENERATING_QR_ERROR);
  //   } else {
  //     const response = generateQrWithImage(prompt, params.initImage, params);
  //     return response;
  //   }
  // } else {
  //   return formatError(GENERATING_QR_ERROR);
  // }
};

const generateQrWithImage = async (
  prompt: string,
  image: string,
  variables: InitialVariablesMenu
) => {
  const params: SDAVariableParameters = {
    prompt,
    initImage: image,
    controlImage: QR_CODE_URL,
    ...variables,
  };

  const dataSDA = getParameterizedDataStructure(params);

  const sdaResponse: StableDiffusionQRApiResponse = await generateQRRequest(
    dataSDA
  );

  if (sdaResponse?.status === "success") {
    const response: SuccessQrResponse = {
      status: "success",
      data: sdaResponse,
      image,
    };
    return response;
  } else if (sdaResponse?.status === "processing" && sdaResponse.fetch_result) {
    const response = await handleRequestWithTimeout(
      TIME_TO_REQUEST,
      sdaResponse.fetch_result
    );
    return response;
  } else if (
    sdaResponse?.status === "error" &&
    sdaResponse?.message?.includes(EXCEEDED_LIMIT_MESSAGE_KEY)
  ) {
    return formatError(GENERATING_QR_ERROR_LIMIT_API);
  } else {
    return formatError({
      status: "error",
      message:
        sdaResponse?.message ||
        sdaResponse?.messege ||
        GENERATING_QR_ERROR.message,
    });
  }
};

const generateQrCodeWithImage = async (
  prompt: string,
  image: string,
  variables: InitialVariablesMenu
) => {
  const params: SDAVariableParameters = {
    prompt,
    initImage: image,
    controlImage: QR_CODE_URL,
    ...variables,
  };

  const dataSDA = getParameterizedDataStructure(params);

  const sdaResponse: StableDiffusionQRApiResponse = await generateQRRequest(
    dataSDA
  );

  if (
    sdaResponse?.status === "success" ||
    sdaResponse?.status === "processing"
  ) {
    const response = {
      status: sdaResponse.status,
      data: sdaResponse,
      image,
    };
    return response;
  } else if (
    sdaResponse?.status === "error" &&
    sdaResponse?.message?.includes(EXCEEDED_LIMIT_MESSAGE_KEY)
  ) {
    return formatError(GENERATING_QR_ERROR_LIMIT_API);
  } else {
    return formatError({
      status: "error",
      message:
        sdaResponse?.message ||
        sdaResponse?.messege ||
        GENERATING_QR_ERROR.message,
    });
  }
};

const handleRequestWithTimeout = async (time: number, url: string) => {
  const MAX_ATTEMPTS = 20;
  let attempts = 0;

  const recursiveRequest = async (): Promise<
    StableDiffusionProcessingResponse | ErrorInterface
  > => {
    const processingData = await handleProcessingResult(url);

    if (processingData?.status === "success") {
      return processingData;
    } else if (processingData?.status === "processing") {
      return new Promise((resolve) => {
        setTimeout(async () => {
          attempts++;
          if (attempts <= MAX_ATTEMPTS) {
            const result = await recursiveRequest();
            resolve(result);
          } else {
            resolve(formatError(GENERATING_QR_ERROR_MAX_ERRORS));
          }
        }, time);
      });
    } else {
      return formatError(GENERATING_QR_ERROR);
    }
  };

  return recursiveRequest();
};
