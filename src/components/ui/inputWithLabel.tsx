import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputWithLabelProps {
  id: string;
  label?: React.ReactElement | string;
  placeholder?: string;
  type?: "text" | "email" | "number";
  onChange?: (value: string) => void;
  value: string | number | readonly string[] | undefined;
}

export function InputWithLabel(props: InputWithLabelProps) {
  const { label, id, type, placeholder, onChange, value } = props;
  const [internalValue, setInternalValue] = React.useState<
    string | number | readonly string[] | undefined
  >(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type || "text"}
        id={id}
        placeholder={placeholder}
        onChange={handleChange}
        value={internalValue !== undefined ? internalValue.toString() : ""}
      />
    </div>
  );
}
