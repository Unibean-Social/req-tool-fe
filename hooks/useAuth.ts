/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  loginAsync,
  logoutAsync,
  selectAuth,
  selectUser,
  setupAutoRefresh,
} from "@/lib/redux/slices/authSlice";

const postLoginPath = process.env.NEXT_PUBLIC_POST_LOGIN_PATH ?? "/";

/**
 * Auth hook theo SETUP; chuyển hướng sau login là một đường dẫn cố định (không routing theo role).
 * Bật lại RBAC/route theo role trong middleware + điều chỉnh `postLoginPath` khi cần.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);

  const roles = user?.role ?? [];

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap();

      if (result.token) {
        setupAutoRefresh(result.token, dispatch as any);
      }

      toast.success("Đăng nhập thành công");
      router.push(postLoginPath);

      return result;
    } catch (error: any) {
      toast.error(String(error) || "Đăng nhập thất bại");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success("Đăng xuất thành công");
      router.push("/");
    } catch {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  return {
    ...auth,
    user,
    roles,
    login,
    logout,
  };
}
