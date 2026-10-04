import { clicksEnabled, pipeline } from "@/lib/clicks";

// უბრალო სიხშირის ლიმიტი Redis-ში: key-ზე მოთხოვნები windowSec წამში არ უნდა აღემატებოდეს limit-ს.
// თუ Redis არ არის ან შეცდომას აბრუნებს, მოთხოვნას ვუშვებთ, რომ რეალური ადამიანი არ დაიბლოკოს.
export async function allowed(key: string, limit: number, windowSec: number): Promise<boolean> {
  if (!clicksEnabled) return true;
  try {
    const [count] = await pipeline([
      ["INCR", `rl:${key}`],
      ["EXPIRE", `rl:${key}`, windowSec, "NX"],
    ]);
    return Number(count?.result) <= limit;
  } catch {
    return true;
  }
}

export function clientIp(headers: Headers) {
  return (headers.get("x-forwarded-for") || "").split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
}
