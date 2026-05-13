"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query/query-keys";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  loginAsync,
  logoutAsync,
  selectAuth,
  selectUser,
  setupAutoRefresh,
} from "@/lib/redux/slices/authSlice";

const postLoginPath = process.env.NEXT_PUBLIC_POST_LOGIN_PATH ?? "/";

type LoginVariables = { email: string; password: string; redirectTo?: string };

/**
 * Auth hook theo SETUP; sau login chuyển tới `redirectTo` (nếu có), `NEXT_PUBLIC_POST_LOGIN_PATH`, hoặc `/`.
 * Login/logout chạy qua TanStack Query (`useMutation`) để có `onSuccess` / `onError` mỗi lần gọi
 * và `invalidateQueries({ queryKey: queryKeys.auth.all })` để chỉ làm mới cache liên quan auth, không xóa toàn bộ GET cache.
 *
 * Ví dụ: `login({ email, password }, { redirectTo: "/reports", onSuccess: (data) => { ... } })`
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);

  const roles = user?.role ?? [];

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginVariables) => {
      const result = await dispatch(loginAsync({ email, password })).unwrap();
      if (result.token) {
        setupAutoRefresh(result.token, dispatch);
      }
      return result;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      toast.success("Đăng nhập thành công");
      const target = variables.redirectTo ?? postLoginPath;
      router.push(target);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : String(error);
      toast.error(message || "Đăng nhập thất bại");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await dispatch(logoutAsync()).unwrap();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      toast.success("Đăng xuất thành công");
      router.push("/login");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    },
  });

  return {
    ...auth,
    user,
    roles,
    queryClient,
    login: (
      credentials: { email: string; password: string },
      options?: Parameters<typeof loginMutation.mutateAsync>[1] & { redirectTo?: string }
    ) => {
      const { redirectTo, ...rest } = options ?? {};
      return loginMutation.mutateAsync({ ...credentials, redirectTo }, rest);
    },
    logout: (options?: Parameters<typeof logoutMutation.mutateAsync>[1]) =>
      logoutMutation.mutateAsync(undefined, options),
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    resetLoginError: loginMutation.reset,
    resetLogoutError: logoutMutation.reset,
  };
}
