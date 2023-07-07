import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TextAreaWithLabel({
  onChange,
  label,
  className,
}: {
  onChange: (text: string) => void;
  label?: string;
  className?: string;
}) {
  return (
    <div className="grid w-full max-w-md items-center gap-1.5">
      {label && <Label htmlFor="prompt">{label}</Label>}
      <Textarea
        id="prompt"
        rows={8}
        className="resize-none bg-white"
        placeholder="Panda in a forest"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
