import React from "react";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTrigger,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Separator } from "./ui/separator";

export interface SettingVariables {
  controlnet_model: string;
  controlnet_type: string;
  model_id: string;
  width: number;
  height: number;
  controlnet_conditioning_scale: string;
  scheduler: string | null | undefined;
  num_inference_steps: number;
  guidance_scale: number;
  strength: number;
}

interface IQRCard {
  parentRef: React.MutableRefObject<null>;
  id: number;
  output: string[];
  prompt: string;
  initImage: string;
  controlImage: string;
  settingVariables: SettingVariables;
  className?: string;
}

export const QRCard = (props: IQRCard) => {
  const {
    output,
    id,
    controlImage,
    initImage,
    prompt,
    className,
    settingVariables: {
      controlnet_conditioning_scale,
      controlnet_model,
      controlnet_type,
      guidance_scale,
      height,
      model_id,
      num_inference_steps,
      scheduler,
      strength,
      width,
    },
  } = props;

  const outputIndexes = output.map((url, idx) => ({ id: idx, url }));
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <div>
      <Card className={`flex p-2 ${className}`}>
        <Dialog>
          <DialogTrigger
            className="cursor-pointer w-40"
            style={{ minWidth: "10rem" }}
          >
            <Image
              className="m-2"
              width={150}
              height={150}
              src={output[0]}
              alt={id.toString()}
            />
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full sm:max-w-[550px] m-12">
                <div className="flex flex-col items-center">
                  <Image
                    className="m-2 rounded-md mb-10"
                    width={350}
                    height={350}
                    src={outputIndexes[selectedIndex].url}
                    alt={id.toString()}
                  />
                  <div className="flex">
                    <Image
                      className={`m-2 rounded-md cursor-pointer ${
                        selectedIndex === 0
                          ? "border-solid border-4 border-blue-500"
                          : ""
                      }`}
                      width={150}
                      height={150}
                      src={outputIndexes[0].url}
                      alt={id.toString()}
                      onClick={() => setSelectedIndex(0)}
                    />
                    <Image
                      className={`m-2 rounded-md cursor-pointer ${
                        selectedIndex === 1
                          ? "border-solid border-4 border-blue-500"
                          : ""
                      }`}
                      width={150}
                      height={150}
                      src={outputIndexes[1].url}
                      alt={id.toString()}
                      onClick={() => setSelectedIndex(1)}
                    />
                    <Image
                      className={`m-2 rounded-md cursor-pointer ${
                        selectedIndex === 2
                          ? "border-solid border-4 border-blue-500"
                          : ""
                      }`}
                      width={150}
                      height={150}
                      src={outputIndexes[2].url}
                      alt={id.toString()}
                      onClick={() => setSelectedIndex(2)}
                    />
                  </div>
                </div>
              </DialogContent>
            </DialogOverlay>
          </DialogPortal>
        </Dialog>
        <div className="flex ml-12 mr-12">
          <div className="flex flex-col gap-y-1 w-1/3">
            <span className="font-bold text-md">Prompt</span>
            <span className="text-sm">{prompt}</span>
          </div>
          <Separator orientation="vertical" className="mx-4" />
          <div className="flex flex-col w-2/3 gap-y-2">
            <div className="flex gap-x-4 mb-1 mt-3">
              <div className="flex flex-col gap-y-1 w-1/2">
                <span className="font-bold text-sm">Control image</span>
                <a
                  href={controlImage}
                  target="_blank"
                  className="overflow-clip text-xs text-sky-600"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 360,
                  }}
                >
                  {controlImage}
                </a>
              </div>
              <div className="flex flex-col gap-y-1 w-1/2">
                <span className="font-bold text-sm">Initial image</span>
                <a
                  href={initImage}
                  target="_blank"
                  className="overflow-clip text-xs text-sky-600"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 360,
                  }}
                >
                  {initImage}
                </a>
              </div>
            </div>
            <div className="flex gap-x-4">
              <div className="flex flex-col w-1/5">
                <span className="font-bold text-sm">Controlnet scale</span>
                <span className="text-xs">{controlnet_conditioning_scale}</span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Controlnet model</span>
                <span className="text-xs">{controlnet_model}</span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Controlnet type</span>
                <span className="text-xs">{controlnet_type}</span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Model ID</span>
                <span className="text-xs">{model_id}</span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Guidance scale</span>
                <span className="text-xs">{guidance_scale}</span>
              </div>
            </div>
            <div className="flex gap-x-4">
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Scheduler</span>
                <span
                  title={scheduler || ""}
                  className="overflow-hidden text-xs"
                >
                  {scheduler}
                </span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Steps</span>
                <span className="text-xs">{num_inference_steps}</span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Strength</span>
                <span className="text-xs">{strength}</span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Width</span>
                <span className="text-xs">{width}</span>
              </div>
              <div className="flex flex-col w-1/5 overflow-hidden ">
                <span className="font-bold text-sm">Height</span>
                <span className="text-xs">{height}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
