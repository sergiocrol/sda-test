import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TooltipProps } from "./tooltipWithContent";
import { LabelWithTooltip } from "./labelWithTooltip";

interface TextAreaWithLabelProps {
  onChange: (text: string) => void;
  label?: string;
  className?: string;
  placeholder?: string;
  tooltip?: TooltipProps;
}

export function TextAreaWithLabel({
  onChange,
  label,
  className,
  placeholder,
  tooltip,
}: TextAreaWithLabelProps) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      {label && (
        <LabelWithTooltip
          label={label}
          htmlFor="prompt"
          tooltip={{
            content: <div>Detailed prompts usually give better results</div>,
          }}
        />
      )}
      <Textarea
        id="prompt"
        rows={11}
        className="resize-none bg-white placeholder:text-gray-300"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
