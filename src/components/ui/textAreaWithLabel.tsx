import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextAreaWithLabelProps {
  onChange: (text: string) => void;
  label?: string;
  className?: string;
  placeholder?: string;
}

export function TextAreaWithLabel({
  onChange,
  label,
  className,
  placeholder,
}: TextAreaWithLabelProps) {
  return (
    <div className={`grid gap-1.5 ${className}`}>
      {label && <Label htmlFor="prompt">{label}</Label>}
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
