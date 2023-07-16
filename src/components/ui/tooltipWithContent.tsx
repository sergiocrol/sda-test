import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TooltipProps {
  content: JSX.Element;
}

export function InfoTooltip(props: TooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoCircledIcon
            className="text-slate-500 inline cursor-pointer w-3 h-3"
            style={{ marginBottom: "2px" }}
          />
        </TooltipTrigger>
        <TooltipContent>{props.content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
