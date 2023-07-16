import { Label } from "./label";
import { InfoTooltip, TooltipProps } from "./tooltipWithContent";

export interface LabelWithTooltipProps {
  label: React.ReactElement | string;
  htmlFor?: string;
  tooltip?: TooltipProps;
  className?: string;
}

export function LabelWithTooltip(props: LabelWithTooltipProps) {
  const { label, tooltip, htmlFor, className } = props;

  return (
    <Label className={className} htmlFor={htmlFor}>
      {label} {tooltip && <InfoTooltip content={tooltip.content} />}
    </Label>
  );
}
