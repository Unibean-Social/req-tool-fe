"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LoginEmailFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function LoginEmailField({
  id = "email",
  value,
  onChange,
  disabled,
}: LoginEmailFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-foreground text-sm font-medium">
        Email
      </Label>
      <Input
        id={id}
        name="email"
        type="email"
        autoComplete="email"
        required
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        disabled={disabled}
        className={cn(
          "h-11 rounded-xl border-border/60 bg-[#1a1a1a] text-foreground placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-ring/45"
        )}
      />
    </div>
  );
}
