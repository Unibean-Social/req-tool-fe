import type { ReactNode } from "react";

import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Quên mật khẩu",
  description: "Khôi phục mật khẩu REQ-Bean9",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
