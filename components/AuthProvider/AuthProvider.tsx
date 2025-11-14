"use client";

import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { API } from "@/lib/api/authApi";

const http = axios.create({
  baseURL: API,
  withCredentials: true,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await http.get("/auth/me");
        if (data?.user) {
          setUser(data.user);
        } else {
          clearIsAuthenticated();
        }
      } catch (e) {
        clearIsAuthenticated();
      }
    };

    checkSession();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
