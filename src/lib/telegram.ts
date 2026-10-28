import { createHmac, timingSafeEqual } from "node:crypto";

// ტელეგრამის ბოტის დახმარებული ფუნქციები განაცხადის ფორმისთვის (ტექსტი და ფოტოები).
// TELEGRAM_API_BASE მხოლოდ ლოკალური ტესტისთვისაა (ყალბი სერვერი); ნამდვილ საიტზე არ მიეთითება.
export function telegramApi(method: string) {
  const base = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
  return `${base}/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;
}

export function telegramOn() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

// განაცხადის გაგზავნის შემდეგ ბრაუზერს ვაძლევთ ხელმოწერილ „ბილეთს“ (განაცხადის შეტყობინების ნომერი + დრო).
// ფოტოები მხოლოდ ამ ბილეთით მიიღება და ჩატში იმავე შეტყობინების პასუხად ჩაჯდება: ასე უცხო ადამიანი ჩატს თავისით ვერ გააჭედებს.
const TICKET_TTL_SEC = 2 * 60 * 60;

function mac(ref: number, ts: number) {
  return createHmac("sha256", process.env.TELEGRAM_BOT_TOKEN as string).update(`join-photo.${ref}.${ts}`).digest("hex").slice(0, 32);
}

export function signTicket(ref: number) {
  const ts = Math.floor(Date.now() / 1000);
  return `${ref}.${ts}.${mac(ref, ts)}`;
}

export function verifyTicket(ticket: string): number | null {
  const [refText, tsText, sig] = ticket.split(".");
  const ref = Number(refText);
  const ts = Number(tsText);
  if (!Number.isInteger(ref) || ref <= 0 || !Number.isInteger(ts) || !sig) return null;
  const age = Math.floor(Date.now() / 1000) - ts;
  if (age < -60 || age > TICKET_TTL_SEC) return null;
  const expected = Buffer.from(mac(ref, ts));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  return ref;
}

export function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
