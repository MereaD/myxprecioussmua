import { Redis } from "@upstash/redis";
import { unstable_rethrow } from "next/navigation";

// Vercel's Upstash integration sets KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

export async function readKey<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch (error) {
    // Let Next.js's own render signals (e.g. "this page must be dynamic") through.
    unstable_rethrow(error);
    console.error(`Redis read failed for "${key}"`, error);
    return null;
  }
}

export async function writeKey<T>(key: string, value: T) {
  if (!redis) throw new Error("Redis is not configured. Add the Upstash env vars.");
  await redis.set(key, value);
}
