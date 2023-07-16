import React from "react";

import { Card } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { InfoTooltip, TooltipProps } from "./tooltipWithContent";

interface InputFileProps {
  id: string;
  className: string;
  title?: React.ReactElement | string;
  subtitle?: React.ReactElement | string;
  onSelectImage: (img: File | null) => void;
  defaultImage?: string;
  notRemovable?: boolean;
  label?: string;
  disabled?: boolean;
  tooltip?: TooltipProps;
}

const getURLFromImage = (img?: File) =>
  img ? URL.createObjectURL(img) : undefined;

export function InputFile({
  id,
  className,
  onSelectImage,
  defaultImage,
  notRemovable,
  title,
  subtitle,
  label,
  disabled,
  tooltip,
}: InputFileProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    defaultImage || null
  );

  const onHandleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files && e.target.files[0];
    if (!img) return;

    setPreviewUrl(getURLFromImage(img) as string);
    onSelectImage(img);
    e.target.value = "";
  };

  return (
    <div
      className={`flex-col items-center justify-between w-full ${className}`}
    >
      {label} {tooltip && <InfoTooltip content={tooltip.content} />}
      <div className="flex gap-x-3">
        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
            disabled ? "opacity-50" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {title || (
                <span className="font-semibold">
                  Click to upload your image
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle || <span>1:1 aspect ratio for a better results</span>}
            </p>
          </div>
          <input
            id={id}
            type="file"
            className={`hidden ${disabled ? "cursor-not-allowed" : ""}`}
            disabled={disabled}
            onChange={(e) => onHandleImage(e)}
          />
        </label>
        {previewUrl && (
          <Card
            className="w-32 h-32 cursor-pointer"
            style={{ minWidth: "8rem" }}
            onClick={() =>
              !notRemovable && (setPreviewUrl(null), setIsHovered(false))
            }
            onMouseEnter={() => !notRemovable && setIsHovered(true)}
            onMouseLeave={() => !notRemovable && setIsHovered(false)}
          >
            <Avatar className="w-full h-full rounded-sm">
              {isHovered && (
                <div className="flex justify-center items-center w-full h-full bg-slate-100/60 text-white font-extrabold text-3xl absolute">
                  &#x2715;
                </div>
              )}
              <AvatarImage src={previewUrl} />
              <AvatarFallback>QR</AvatarFallback>
            </Avatar>
          </Card>
        )}
      </div>
    </div>
  );
}
