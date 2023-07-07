import React from "react";
import useSwr from "swr";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { InputFile } from "@/components/ui/inputFile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TextAreaWithLabel } from "@/components/ui/textAreaWithLabel";

import { useGenerateQR } from "@/hooks/useGenerateQR";

import { QR } from "@/lib/qrs-repo";
import { fetcher } from "@/lib/helpers";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { QRCard } from "@/components/qrCard";

export const FALLBACK_IMAGE = "placeholder.svg";

export default function Home() {
  const homePage = React.useRef(null);
  const {
    data: QRData,
    error,
    isLoading: QRLoadingData,
  } = useSwr<QR[]>("/api/qr", fetcher);
  const { request, data, isLoading } = useGenerateQR();

  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [prompt, setPrompt] = React.useState<string | null>(null);

  const [qrCodes, setQrCodes] = React.useState<string[]>([]);
  const [selectedQRCode, setSelectedQRCode] = React.useState(FALLBACK_IMAGE);

  React.useEffect(() => {
    if (data?.length && !qrCodes.length) {
      setQrCodes(data);
      setSelectedQRCode(data[0]);
    }
  }, [data, qrCodes]);

  return (
    <div ref={homePage} className="container w-full h-full mx-auto my-auto">
      <TypographyH1 text="Stable Diffusion API" className="my-12" />
      <Card className="bg-muted">
        <CardHeader> </CardHeader>
        <CardContent className="flex flex-row justify-evenly">
          <div className="w-1/2 flex flex-col items-center gap-y-10">
            <InputFile
              id="input-file"
              className="dropzone w-full max-w-md"
              onSelectImage={setSelectedImage}
              label="Initial image"
            />
            <div className="dropzone w-full max-w-md">
              <TextAreaWithLabel onChange={setPrompt} label="Prompt" />
            </div>
            <div className="w-full max-w-md flex justify-center">
              <Button
                variant={"default"}
                className="w-full h-14 text-lg"
                disabled={!prompt?.trim() || isLoading}
                onClick={() => (request(prompt, selectedImage), setQrCodes([]))}
              >
                {isLoading ? "Loading" : "Generate AI QR"}
              </Button>
            </div>
          </div>
          <Separator orientation="vertical" className="h-auto bg-slate-300" />
          <div className="w-1/2 flex flex-col items-center gap-y-10 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="w-56 h-56 cursor-pointer shadow-md relative">
                  {isLoading && (
                    <Skeleton className="w-full h-full opacity-60 absolute z-10" />
                  )}
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      className="p-2"
                      src={qrCodes.length > 0 ? qrCodes[0] : FALLBACK_IMAGE}
                    />
                    <AvatarFallback>QR</AvatarFallback>
                  </Avatar>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] m-12">
                <Image
                  width={350}
                  height={350}
                  src={qrCodes.length > 0 ? qrCodes[0] : "/" + FALLBACK_IMAGE}
                  alt={qrCodes.length > 0 ? qrCodes[0] : "/" + FALLBACK_IMAGE}
                />
              </DialogContent>
            </Dialog>
            <div className="flex gap-x-5">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer shadow-md relative">
                    {isLoading && (
                      <Skeleton className="w-full h-full opacity-60 absolute z-10" />
                    )}
                    <Avatar className="w-24 h-24 rounded-none">
                      <AvatarImage
                        className="p-2"
                        src={qrCodes.length > 0 ? qrCodes[1] : FALLBACK_IMAGE}
                      />
                      <AvatarFallback>QR</AvatarFallback>
                    </Avatar>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] m-12">
                  <Image
                    width={350}
                    height={350}
                    src={qrCodes.length > 0 ? qrCodes[1] : "/" + FALLBACK_IMAGE}
                    alt={qrCodes.length > 0 ? qrCodes[1] : "/" + FALLBACK_IMAGE}
                  />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer shadow-md relative">
                    {isLoading && (
                      <Skeleton className="w-full h-full opacity-60 absolute z-10" />
                    )}
                    <Avatar className="w-24 h-24 rounded-none">
                      <AvatarImage
                        className="p-2"
                        src={qrCodes.length > 0 ? qrCodes[2] : FALLBACK_IMAGE}
                      />
                      <AvatarFallback>QR</AvatarFallback>
                    </Avatar>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] m-12">
                  <Image
                    width={350}
                    height={350}
                    src={qrCodes.length > 0 ? qrCodes[2] : "/" + FALLBACK_IMAGE}
                    alt={qrCodes.length > 0 ? qrCodes[2] : "/" + FALLBACK_IMAGE}
                  />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer shadow-md relative">
                    {isLoading && (
                      <Skeleton className="w-full h-full opacity-60 absolute z-10" />
                    )}
                    <Avatar className="w-24 h-24 rounded-none">
                      <AvatarImage
                        className="p-2"
                        src={qrCodes.length > 0 ? qrCodes[3] : FALLBACK_IMAGE}
                      />
                      <AvatarFallback>QR</AvatarFallback>
                    </Avatar>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] m-12">
                  <Image
                    width={350}
                    height={350}
                    src={qrCodes.length > 0 ? qrCodes[3] : "/" + FALLBACK_IMAGE}
                    alt={qrCodes.length > 0 ? qrCodes[3] : "/" + FALLBACK_IMAGE}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
      {QRData?.length && (
        <React.Fragment>
          <TypographyH3 text="Generated QR Codes" className="my-5" />
          <Separator orientation="horizontal" className="mb-5 mt-3" />
          {QRData?.map((qr) => {
            return (
              <QRCard
                parentRef={homePage}
                key={qr.id}
                id={qr.id}
                output={qr.output}
                prompt={qr.prompt}
                controlImage={qr.control_image}
                initImage={qr.init_image}
                className="my-5"
              />
            );
          })}
        </React.Fragment>
      )}
      <div className="mt-20 mb-5 text-right text-white mr-6">
        done with &#129504; by{" "}
        <span className="text-slate-300 font-semibold">S|C|R</span>
      </div>
    </div>
  );
}
