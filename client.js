// src/api/client.js
//
// Thin fetch wrapper for the AssetFlow API.
// Auth pattern: JWT bearer token, stored in memory + localStorage,
// attached automatically to every request via the Authorization header.

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api";

const TOKEN_KEY = "assetflow_token";

let inMemoryToken = localStorage.getItem(TOKEN_KEY) || null;

export function getToken() {
  return inMemoryToken;
}

export function setToken(token) {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  setToken(null);
}

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Core request helper. All API modules (auth.js, dashboard.js, ...) call this.
 *
 * @param {string} path - endpoint path, e.g. "/auth/login"
 * @param {object} options - fetch options; body is auto-JSON-encoded if it's a plain object
 */
export async function request(path, options = {}) {
  const { method = "GET", body, headers = {}, ...rest } = options;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const token = getToken();
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...rest,
    });
  } catch (networkErr) {
    throw new ApiError("Network error — could not reach the server.", 0, null);
  }

  // 401: token is invalid/expired. Clear it so the app can redirect to login.
  if (res.status === 401) {
    clearToken();
  }

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export { ApiError };
