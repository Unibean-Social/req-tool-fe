"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LoginPasswordFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function LoginPasswordField({
  id = "password",
  value,
  onChange,
  disabled,
}: LoginPasswordFieldProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-foreground text-sm font-medium">
        Mật khẩu
      </Label>
      <div className="relative">
        <Input
          id={id}
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          required
          value={value}
          onChange={(ev) => onChange(ev.target.value)}
          disabled={disabled}
          className={cn(
            "h-11 rounded-xl border-border/60 bg-[#1a1a1a] pr-11 text-foreground placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-ring/45"
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          className="text-muted-foreground hover:bg-muted/60 hover:text-foreground focus-visible:bg-muted/60 focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 absolute end-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
