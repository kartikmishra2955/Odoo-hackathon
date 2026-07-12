// src/api/auth.js
import { api, setToken, clearToken } from "./client";

/**
 * POST /auth/login
 * body: { email, password }
 * response: { token, user: { id, name, email, role } }
 */
export async function login({ email, password }) {
  const data = await api.post("/auth/login", { email, password });
  if (data?.token) setToken(data.token);
  return data;
}

/**
 * POST /auth/register
 * New accounts are always created with role "employee" — Department Head
 * and Asset Manager roles are assigned later by an Admin, so the client
 * never sends a role here.
 * body: { name, email, password }
 * response: { token, user: { id, name, email, role: "employee" } }
 */
export async function registerEmployee({ name, email, password }) {
  const data = await api.post("/auth/register", { name, email, password });
  if (data?.token) setToken(data.token);
  return data;
}

/**
 * GET /auth/me
 * Rehydrates the current user from a stored token (e.g. on app load / refresh).
 */
export async function getCurrentUser() {
  return api.get("/auth/me");
}

export function logout() {
  clearToken();
}
