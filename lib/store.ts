import { unstable_rethrow } from "next/navigation";
import { readKey, redis, writeKey } from "./redis";
import type { Invoice } from "./invoice";
import { holdsSlot, type Booking } from "./booking";

// ── Coupons ──────────────────────────────────────────────────────────────────

export interface Coupon {
  code: string;
  description: string;
  active: boolean;
  expiresAt?: string; // YYYY-MM-DD, last day the code works
}

// Used until the admin saves coupons for the first time, so existing codes keep working.
const DEFAULT_COUPONS: Coupon[] = [
  { code: "DIASPORA26", description: "", active: true },
  { code: "OCTOBER50", description: "", active: true },
];

export async function getCoupons(): Promise<Coupon[]> {
  return (await readKey<Coupon[]>("coupons")) ?? DEFAULT_COUPONS;
}

export async function saveCoupons(coupons: Coupon[]) {
  await writeKey("coupons", coupons);
}

export function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function isValidCoupon(code: string) {
  const normalized = normalizeCode(code);
  if (!normalized) return false;
  const today = todayISO();
  const coupons = await getCoupons();
  return coupons.some(
    c => c.code === normalized && c.active && (!c.expiresAt || c.expiresAt >= today)
  );
}

// ── Availability ─────────────────────────────────────────────────────────────

export interface AvailableDay {
  date: string;    // YYYY-MM-DD
  times: string[]; // "HH:MM", 24-hour
}

export async function getAvailability(): Promise<AvailableDay[]> {
  return (await readKey<AvailableDay[]>("availability")) ?? [];
}

export async function saveAvailability(days: AvailableDay[]) {
  await writeKey("availability", days);
}

/** Days from today onwards that still have at least one time, sorted. */
export async function getUpcomingAvailability() {
  const today = todayISO();
  const days = await getAvailability();
  return days
    .filter(d => d.date >= today && d.times.length > 0)
    .map(d => ({ ...d, times: [...d.times].sort() }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Upcoming availability minus slots already held by a new or confirmed booking. Shown to clients. */
export async function getOpenAvailability() {
  const [days, taken] = await Promise.all([getUpcomingAvailability(), getTakenSlots()]);
  return days
    .map(d => ({ ...d, times: d.times.filter(t => !taken.has(`${d.date} ${t}`)) }))
    .filter(d => d.times.length > 0);
}

// ── Bookings ─────────────────────────────────────────────────────────────────
// Stored as a Redis hash (one field per booking), so two requests arriving at
// once can't overwrite each other.

export async function getBookings(): Promise<Booking[]> {
  if (!redis) return [];
  try {
    const all = await redis.hgetall<Record<string, Booking>>("bookings");
    return Object.values(all ?? {});
  } catch (error) {
    unstable_rethrow(error);
    console.error("Redis read failed for bookings", error);
    return [];
  }
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (!redis) return null;
  return (await redis.hget<Booking>("bookings", id)) ?? null;
}

export async function saveBooking(booking: Booking) {
  if (!redis) throw new Error("Redis is not configured. Add the Upstash env vars.");
  await redis.hset("bookings", { [booking.id]: booking });
}

export async function deleteBooking(id: string) {
  if (!redis) throw new Error("Redis is not configured. Add the Upstash env vars.");
  await redis.hdel("bookings", id);
}

/** "YYYY-MM-DD HH:MM" keys for every slot held by a new or confirmed booking. */
export async function getTakenSlots() {
  const bookings = await getBookings();
  return new Set(bookings.filter(b => holdsSlot(b) && b.date && b.time).map(b => `${b.date} ${b.time}`));
}

// ── Portfolio (uploaded through admin) ───────────────────────────────────────

export interface CloudinaryAsset {
  publicId: string;
  resourceType: "image" | "video";
}

export interface PortfolioEntry {
  id: string;
  srcs: string[];
  video?: string;
  alt: string;
  note?: string;
  category?: string;
  tall?: boolean;
  assets: CloudinaryAsset[];
  createdAt: string;
}

export async function getPortfolioEntries(): Promise<PortfolioEntry[]> {
  return (await readKey<PortfolioEntry[]>("portfolio")) ?? [];
}

export async function savePortfolioEntries(entries: PortfolioEntry[]) {
  await writeKey("portfolio", entries);
}

// ── Invoices ─────────────────────────────────────────────────────────────────

export async function getInvoices(): Promise<Invoice[]> {
  return (await readKey<Invoice[]>("invoices")) ?? [];
}

export async function saveInvoices(invoices: Invoice[]) {
  await writeKey("invoices", invoices);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Today's date in the UK, as YYYY-MM-DD. */
export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}
