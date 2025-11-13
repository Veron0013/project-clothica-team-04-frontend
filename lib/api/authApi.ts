"use client";

export const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export type AuthValues = { name?: string; phone: string; password: string };

export async function callAuth(login: boolean, values: AuthValues) {
  const endpoint = login ? "/auth/login" : "/auth/register";

  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(values),
  });

  if (res.ok) return res.json();
  const err = await res.json().catch(() => ({}));
  throw new Error(err?.message || `HTTP ${res.status}`);
}

export async function getMe() {
  const res = await fetch(`${API}/users/me`, { credentials: "include" });
  if (res.ok) return res.json();
  return null;
}


export async function logout() {
  const res = await fetch(`${API}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `HTTP ${res.status}`);
  }
}