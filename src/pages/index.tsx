/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useSwr, { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InputFile } from "@/components/ui/inputFile";
import { TextAreaWithLabel } from "@/components/ui/textAreaWithLabel";

import { useGenerateQR } from "@/hooks/useGenerateQR";

import { QR, SettingVariables } from "@/types/qr";
import { fetcher } from "@/lib/helpers";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { QRCard } from "@/components/qrCard";
import { Toaster } from "@/components/ui/toaster";
import { QRCode } from "@/components/qrCode";
import { Footer } from "@/components/footer";
import {
  initialVariables,
  InitialVariablesMenu,
  MenuAttributes,
} from "@/components/menuAttributes";
import { Skeleton } from "@/components/ui/skeleton";
import { NUMBER_OF_GENERATED_QR, QR_CODE_URL } from "@/constants/api";
import { useTimer } from "@/hooks/useTimer";

export default function Home() {
  const { data: QRData, isLoading: QRLoadingData } = useSwr<QR[]>(
    "/api/qr",
    fetcher
  );
  const { mutate } = useSWRConfig();
  const { elapsedTime, handlePause, handleReset, handleStart } = useTimer();

  const homePage = React.useRef(null);
  const { request, data, setData, isLoading } = useGenerateQR();

  // TODO: Gestionar la subida de un QR
  const [selectedControlImage, setSelectedControlImage] =
    React.useState<File | null>(null);
  const [selectedInitialImage, setSelectedInitialImage] =
    React.useState<File | null>(null);
  const [prompt, setPrompt] = React.useState<string | null>(null);
  const [variables, setVariables] =
    React.useState<InitialVariablesMenu>(initialVariables);
  const [isTimerActive, setIsTimerActive] = React.useState(false);

  const [qrCodes, setQrCodes] = React.useState<string[]>([]);

  const handleQrGenerationRequest = () => {
    if (!isTimerActive) setIsTimerActive(true);

    setQrCodes([]);
    setData(undefined);
    request(prompt, selectedInitialImage, variables);

    handleReset();
    handleStart();
  };

  const getSettingVariables = (qr: QR): SettingVariables => {
    const {
      controlnet_model,
      controlnet_type,
      model_id,
      width,
      height,
      controlnet_conditioning_scale,
      scheduler,
      num_inference_steps,
      guidance_scale,
      strength,
    } = qr;

    return {
      controlnet_model,
      controlnet_type,
      model_id,
      width,
      height,
      controlnet_conditioning_scale: controlnet_conditioning_scale.toString(),
      scheduler,
      num_inference_steps,
      guidance_scale,
      strength,
    };
  };

  const formattedElapsedTime = () => {
    return elapsedTime;
  };

  React.useEffect(() => {
    if (data?.length && !qrCodes.length) {
      setQrCodes(data);
      mutate("/api/qr");
      handlePause();
    }
  }, [data, qrCodes]);

  React.useEffect(() => {
    if (!isLoading) {
      handlePause();
    }
  }, [isLoading]);

  return (
    <div ref={homePage} className="container w-full h-full mx-auto my-auto">
      <TypographyH1 text="Stable Diffusion API" className="my-12" />
      <Card className="bg-muted">
        <CardHeader> </CardHeader>
        <CardContent className="flex flex-row justify-evenly">
          <div className="w-3/5 flex flex-col items-center gap-y-10 mr-4">
            <div className="w-full flex justify-between gap-x-10">
              <InputFile
                title={
                  <span className="font-semibold">
                    Click to upload your QR code
                  </span>
                }
                id="input-qr"
                notRemovable
                subtitle=" "
                disabled
                className="dropzone w-full max-w-md"
                onSelectImage={setSelectedControlImage}
                defaultImage={QR_CODE_URL}
                label="Control image*"
                tooltip={{
                  content: (
                    <div className="text-center">
                      The user's QR. For testing purposes we use a default QR{" "}
                      <br />
                      code with a real url format.
                    </div>
                  ),
                }}
              />

              <InputFile
                id="input-file"
                className="dropzone w-full max-w-md"
                onSelectImage={setSelectedInitialImage}
                label="Initial image"
                tooltip={{
                  content: (
                    <div className="text-center">
                      <span className="font-bold">Optional. </span> Required by
                      ControlNet. We handle the <br /> image's generation with
                      the prompt through the SD Api. <br />
                      <span className="font-bold">Important: </span> for optimal
                      results, loaded images should have a 1:1 aspect ratio
                    </div>
                  ),
                }}
              />
            </div>
            <div className="w-full flex justify-between gap-x-10">
              <TextAreaWithLabel
                className="w-1/2"
                onChange={setPrompt}
                label="Prompt*"
                placeholder="A cubism painting of a town with a lot of houses in the snow, sky background, matte painting concept art, detailed painting"
              />
              <MenuAttributes
                className="w-1/2"
                label="Advanced options"
                onChange={setVariables}
              />
            </div>
            <div className="w-full max-w-md flex justify-center">
              <Button
                variant={"default"}
                className={`w-full h-14 text-lg mt-5 ${
                  isLoading ? "cursor-progress" : ""
                }`}
                disabled={!prompt?.trim() || isLoading}
                onClick={() => (handleReset(), handleQrGenerationRequest())}
              >
                {isLoading ? (
                  <svg
                    className="motion-reduce:hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : undefined}
                {isLoading ? "Processing..." : "Generate AI QR"}
              </Button>
            </div>
          </div>
          <Separator orientation="vertical" className="h-auto bg-slate-300" />
          <div className="w-1/4 max-w-md flex flex-col items-center gap-y-10 justify-center relative">
            <div className="flex flex-col gap-8">
              <QRCode
                id={0}
                qrCodes={[...qrCodes]}
                size="medium"
                isLoading={isLoading}
              />
              <div className="flex gap-x-4">
                {[...Array(NUMBER_OF_GENERATED_QR - 1).keys()].map((n) => {
                  return (
                    <QRCode
                      key={n + 1}
                      id={n + 1}
                      qrCodes={qrCodes}
                      size="small"
                      isLoading={isLoading}
                    />
                  );
                })}
              </div>
            </div>
            <div className="mt-4 absolute bottom-4">
              {isTimerActive && (
                <React.Fragment>
                  <span className="text-slate-400 italic">Elapsed time - </span>
                  <span
                    className={`font-semibold w-20 inline-block ${
                      elapsedTime > 50 ? "text-red-400" : "text-slate-600 "
                    }`}
                  >
                    {formattedElapsedTime()}
                    <span> s</span>
                  </span>
                </React.Fragment>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
      <React.Fragment>
        <TypographyH3 text="Generated QR Codes" className="my-5" />
        <Separator orientation="horizontal" className="mb-5 mt-3" />
        {QRLoadingData ? (
          <div className="flex flex-col gap-y-5">
            <Skeleton style={{ height: 184 }} />
            <Skeleton style={{ height: 184 }} />
            <Skeleton style={{ height: 184 }} />
          </div>
        ) : (
          QRData?.length &&
          QRData?.map((qr) => {
            return (
              <QRCard
                parentRef={homePage}
                key={qr.id}
                id={qr.id}
                output={qr?.output}
                prompt={qr.prompt}
                controlImage={qr.control_image}
                initImage={qr.init_image}
                settingVariables={getSettingVariables(qr)}
                className="my-6"
              />
            );
          })
        )}
      </React.Fragment>
      <Footer />
      <Toaster />
    </div>
  );
}
