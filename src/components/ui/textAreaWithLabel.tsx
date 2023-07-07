import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TextAreaWithLabel({
  onChange,
  className,
}: {
  onChange: (text: string) => void;
  className?: string;
}) {
  return (
    <div className="grid w-full max-w-md items-center gap-1.5">
      <Label htmlFor="prompt">Promps</Label>
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
