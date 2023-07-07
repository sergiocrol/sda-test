import React from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTrigger,
  DialogOverlay,
  DialogClose,
} from "@radix-ui/react-dialog";

interface IQRCard {
  parentRef: React.MutableRefObject<null>;
  id: number;
  output: string[];
  prompt: string;
  initImage: string;
  controlImage: string;
  className?: string;
}

export const QRCard = (props: IQRCard) => {
  const { output, id, controlImage, initImage, prompt, className } = props;

  return (
    <div>
      <Card className={`flex p-2 ${className}`}>
        <Dialog>
          <DialogTrigger className="cursor-pointer">
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
              <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full sm:max-w-[425px] m-12">
                <Image
                  className="m-2"
                  width={350}
                  height={350}
                  src={output[0]}
                  alt={id.toString()}
                />
              </DialogContent>
            </DialogOverlay>
          </DialogPortal>
        </Dialog>
        <div className="flex flex-col gap-y-1 ml-12 mr-12">
          <span className="font-bold text-lg">Prompt</span>
          <span>{prompt}</span>
        </div>
      </Card>
    </div>
  );
};
