// src/api/auth.js
import { setToken, clearToken } from "./client";
export { getToken } from "./client";

// Mock user storage
let mockCurrentUser = null;

/**
 * Mock login - accepts any email/password combination
 * body: { email, password }
 * response: { token, user: { id, name, email, role } }
 */
export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  
  // Create mock user from email
  const name = email.split("@")[0];
  const mockUser = {
    id: Math.random().toString(36).substr(2, 9),
    name: name.charAt(0).toUpperCase() + name.slice(1),
    email,
    role: "employee",
  };
  
  // Mock token
  const mockToken = btoa(JSON.stringify(mockUser));
  setToken(mockToken);
  mockCurrentUser = mockUser;
  
  return { token: mockToken, user: mockUser };
}

/**
 * Mock register - creates new user without API call
 * body: { name, email, password }
 * response: { token, user: { id, name, email, role: "employee" } }
 */
export async function registerEmployee({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }
  
  const mockUser = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    role: "employee",
  };
  
  const mockToken = btoa(JSON.stringify(mockUser));
  setToken(mockToken);
  mockCurrentUser = mockUser;
  
  return { token: mockToken, user: mockUser };
}

/**
 * Mock getCurrentUser - retrieves from mock storage
 */
export async function getCurrentUser() {
  if (mockCurrentUser) {
    return { user: mockCurrentUser };
  }
  throw new Error("No user logged in");
}

export function logout() {
  clearToken();
  mockCurrentUser = null;
}
