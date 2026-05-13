import type { ReactNode } from "react";

import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Đăng ký",
  description: "Tạo tài khoản REQ-Bean9",
  path: "/signUp",
  noindex: true,
});

export default function SignUpSegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
