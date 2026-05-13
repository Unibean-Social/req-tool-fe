import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center py-4">
        <div className="flex flex-col gap-8 text-left">
          <header className="space-y-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-[2.25rem] sm:leading-tight">
              Quên mật khẩu?
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Tính năng đặt lại mật khẩu sẽ sớm có. Liên hệ quản trị hoặc bộ phận hỗ trợ để được cấp lại quyền truy cập.
            </p>
          </header>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "default" }),
              "flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
            )}
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
