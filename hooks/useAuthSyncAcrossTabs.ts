"use client";

import { useEffect } from "react";

import { buildLoginUrl } from "@/lib/auth/session";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";

export function useAuthSyncAcrossTabs() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
      const path = window.location.pathname;
      if (path !== "/login") {
        window.location.replace(buildLoginUrl(path));
      }
    };
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, [dispatch]);
}
