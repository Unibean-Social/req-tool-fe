"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { setCookie } from "cookies-next";

import { fetchGithub } from "@/lib/api/services/fetchGithub";
import { queryKeys } from "@/lib/query/query-keys";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  setTokenWithRefresh,
  setupAutoRefresh,
} from "@/lib/redux/slices/authSlice";
import type { AppDispatch } from "@/lib/redux/store";
import { getAuthCookieConfig } from "@/utils/cookieConfig";

const DEFAULT_POPUP_FEATURES = "width=600,height=700,scrollbars=yes";
const postLoginPath = process.env.NEXT_PUBLIC_POST_LOGIN_PATH ?? "/";
const isDev = process.env.NODE_ENV === "development";

export type OpenGithubOAuthOptions = {
  /** `true`: cùng tab (`location.assign`). Mặc định: popup `github-oauth`. */
  sameTab?: boolean;
  popupFeatures?: string;
};

/**
 * Backend popup gửi về **origin của app Next** (vd `http://localhost:3000`):
 * `window.opener?.postMessage(payload, window.location.origin)` — trong đó `payload` có token.
 *
 * Gợi ý `payload`: `{ type: "req-tool:github-oauth", access_token, refresh_token }`
 * hoặc camelCase / bọc trong `{ data: { ... } }` — hook đều cố parse.
 */
export const GITHUB_OAUTH_POST_MESSAGE_TYPE = "req-tool:github-oauth";

type GithubOAuthMessagePayload = {
  type?: string;
  error?: string | boolean;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    access_token?: string;
    refresh_token?: string;
    accessToken?: string;
    refreshToken?: string;
  };
};

function unwrapMessageData(raw: unknown): unknown {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  return raw;
}

function parseGithubOAuthPayload(data: unknown): {
  accessToken: string;
  refreshToken: string;
} | null {
  const unwrapped = unwrapMessageData(data);
  if (!unwrapped || typeof unwrapped !== "object") return null;

  let o: GithubOAuthMessagePayload = unwrapped as GithubOAuthMessagePayload;
  if (o.data && typeof o.data === "object") {
    o = {
      ...o,
      access_token: o.access_token ?? o.data.access_token ?? o.data.accessToken,
      refresh_token: o.refresh_token ?? o.data.refresh_token ?? o.data.refreshToken,
    };
  }

  const access = o.access_token ?? o.accessToken;
  const refresh = o.refresh_token ?? o.refreshToken;
  if (typeof access !== "string" || !access) return null;
  if (typeof refresh !== "string" || !refresh) return null;
  return { accessToken: access, refreshToken: refresh };
}

function isExplicitOAuthError(o: GithubOAuthMessagePayload): boolean {
  if (o.error === true) return true;
  if (typeof o.error === "string" && o.error.length > 0) return true;
  const t = o.type?.toLowerCase();
  if (t && (t.includes("error") || t.endsWith(":fail"))) return true;
  return false;
}

/**
 * Mở luồng GET /api/v1/auth/github bằng navigation thật — tránh CORS/redirect với axios.
 */
export function useGithubOAuth() {
  const oauthUrl = React.useMemo(() => fetchGithub.getOAuthUrl(), []);

  const openOAuth = React.useCallback(
    (options?: OpenGithubOAuthOptions): boolean => {
      if (options?.sameTab) {
        window.location.assign(oauthUrl);
        return true;
      }
      const w = window.open(
        oauthUrl,
        "github-oauth",
        options?.popupFeatures ?? DEFAULT_POPUP_FEATURES
      );
      return Boolean(w);
    },
    [oauthUrl]
  );

  return { oauthUrl, openOAuth };
}


export function useGithubOAuthPopupResult(
  redirectTo?: string,
  rememberMe = false
) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const apiOrigin = React.useMemo(
    () => new URL(fetchGithub.getOAuthUrl()).origin,
    []
  );

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== apiOrigin) {
        if (isDev) {
          /* Chỉ log khi có vẻ là payload OAuth (tránh spam từ extension) */
          const sample = unwrapMessageData(event.data);
          if (
            sample &&
            typeof sample === "object" &&
            ("access_token" in sample ||
              "accessToken" in sample ||
              ("data" in sample && typeof (sample as { data: unknown }).data === "object"))
          ) {
            console.warn(
              "[GitHub OAuth] Bỏ qua postMessage — event.origin không khớp API.",
              { received: event.origin, expectedApiOrigin: apiOrigin }
            );
          }
        }
        return;
      }

      const raw = event.data;
      const top = unwrapMessageData(raw);
      if (!top || typeof top !== "object") return;

      const typed = top as GithubOAuthMessagePayload;
      if (isExplicitOAuthError(typed)) {
        toast.error(
          typeof typed.message === "string" && typed.message
            ? typed.message
            : "Đăng nhập GitHub thất bại"
        );
        return;
      }

      const tokens = parseGithubOAuthPayload(top);
      if (!tokens) {
        if (isDev) {
          console.warn(
            "[GitHub OAuth] postMessage từ API nhưng không có token hợp lệ. Kiểm tra payload từ backend:",
            top
          );
        }
        return;
      }

      setCookie(
        "authToken",
        tokens.accessToken,
        getAuthCookieConfig(rememberMe)
      );
      dispatch(setTokenWithRefresh(tokens));
      setupAutoRefresh(tokens.accessToken, dispatch as AppDispatch);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      toast.success("Đăng nhập GitHub thành công");
      router.push(redirectTo ?? postLoginPath);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [apiOrigin, dispatch, queryClient, redirectTo, rememberMe, router]);
}
