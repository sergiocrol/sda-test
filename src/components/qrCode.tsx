import React from "react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

export const FALLBACK_IMAGE = "placeholder.svg";

interface QRCodeProps {
  id: number;
  size: "big" | "medium" | "small";
  isLoading: boolean;
  qrCodes: string[];
}

export const QRCode = (props: QRCodeProps) => {
  const { isLoading, size, id, qrCodes } = props;

  const conditionalRem =
    size === "big" ? "18rem" : size === "medium" ? "15rem" : "7rem";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={`cursor-pointer shadow-md relative`}
          style={{ width: conditionalRem }}
        >
          {isLoading && (
            <Skeleton className="w-full h-full opacity-80 absolute z-10" />
          )}
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage
              className="p-2"
              src={qrCodes.length > 0 ? qrCodes[id] : FALLBACK_IMAGE}
            />
            <AvatarFallback>QR</AvatarFallback>
          </Avatar>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] m-12">
        <Image
          width={350}
          height={350}
          src={qrCodes.length > 0 ? qrCodes[id] : "/" + FALLBACK_IMAGE}
          alt={qrCodes.length > 0 ? qrCodes[id] : "/" + FALLBACK_IMAGE}
        />
      </DialogContent>
    </Dialog>
  );
};
