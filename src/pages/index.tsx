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

import { QR } from "@/types/qr";
import { fetcher } from "@/lib/helpers";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { QRCard, SettingVariables } from "@/components/qrCard";
import { Toaster } from "@/components/ui/toaster";
import { QRCode } from "@/components/qrCode";
import { Footer } from "@/components/footer";
import { NUMBER_OF_GENERATED_QR, QR_CODE_URL } from "@/hooks/useSDA";
import {
  initialVariables,
  InitialVariablesMenu,
  MenuAttributes,
} from "@/components/menuAttributes";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: QRData, isLoading: QRLoadingData } = useSwr<QR[]>(
    "/api/qr",
    fetcher
  );
  const { mutate } = useSWRConfig();

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

  const [qrCodes, setQrCodes] = React.useState<string[]>([]);

  const handleQrGenerationRequest = () => {
    setQrCodes([]);
    setData(undefined);
    request(prompt, selectedInitialImage, variables);
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

  React.useEffect(() => {
    if (data?.length && !qrCodes.length) {
      setQrCodes(data);
      mutate("/api/qr");
    }
  }, [data, qrCodes]);

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
                className="dropzone w-full max-w-md"
                onSelectImage={setSelectedControlImage}
                defaultImage={QR_CODE_URL}
                label="Control image*"
              />

              <InputFile
                id="input-file"
                className="dropzone w-full max-w-md"
                onSelectImage={setSelectedInitialImage}
                label="Initial image"
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
                className="w-full h-14 text-lg mt-5"
                disabled={!prompt?.trim() || isLoading}
                onClick={handleQrGenerationRequest}
              >
                {isLoading ? "Loading" : "Generate AI QR"}
              </Button>
            </div>
          </div>
          <Separator orientation="vertical" className="h-auto bg-slate-300" />
          <div className="w-1/4 max-w-md flex flex-col items-center gap-y-10 justify-center">
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
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
      <React.Fragment>
        <TypographyH3 text="Generated QR Codes" className="my-5" />
        <Separator orientation="horizontal" className="mb-5 mt-3" />
        {true ? (
          <div className="flex flex-col gap-y-5">
            <Skeleton style={{ height: 150 }} />
            <Skeleton style={{ height: 150 }} />
            <Skeleton style={{ height: 150 }} />
          </div>
        ) : (
          QRData?.length &&
          QRData?.map((qr) => {
            return (
              <QRCard
                parentRef={homePage}
                key={qr.id}
                id={qr.id}
                output={qr.output}
                prompt={qr.prompt}
                controlImage={qr.control_image}
                initImage={qr.init_image}
                settingVariables={getSettingVariables(qr)}
                className="my-5"
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
