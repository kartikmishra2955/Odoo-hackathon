// src/api/booking.js
import { api } from "./client";

/**
 * GET /booking
 * { id, assetId, userId, startTime, endTime, status }
 */
export function getBookings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/booking${qs ? `?${qs}` : ""}`);
}

export function createBooking({ assetId, userId, startTime, endTime }) {
  return api.post("/booking", { assetId, userId, startTime, endTime });
}

/**
 * Conflict validation: per the spec this should ideally be checked
 * server-side on POST /booking (and return 409 on conflict), but we
 * also check client-side before submit for instant UX feedback.
 */
export function hasBookingConflict(bookings, { assetId, startTime, endTime }) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return bookings.some((b) => {
    if (b.assetId !== assetId || b.status === "cancelled") return false;
    const bStart = new Date(b.startTime).getTime();
    const bEnd = new Date(b.endTime).getTime();
    return start < bEnd && end > bStart;
  });
}
