// src/api/organization.js
import { api } from "./client";

export function getUsers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/users${qs ? `?${qs}` : ""}`);
}

export function getRoles() {
  return api.get("/roles");
}

export function getDepartments() {
  return api.get("/departments");
}

export function getCategories() {
  return api.get("/categories");
}
