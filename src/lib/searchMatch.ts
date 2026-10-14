// ძებნის შედარება: ქართული/ლათინური ტოლერანტული, რეგისტრის და ბრჭყალების იგნორით, ნაწილობრივი დამთხვევით.
// მაგ. „bechedi“ პოულობს „ბეჭედი“-ს, „zhu“ პოულობს „ZHU-ZHA“-ს, „ბეჭედ“ ბეჭედს.

// ტექსტის გასუფთავება: პატარა ასოები, ბრჭყალები და პუნქტუაცია გაქრება, ცარიელი ადგილები ერთდება
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[„“”"«»'’‘`´.,;:!?()[\]{}\-–—_/\\|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ქართული ასო → ლათინური „გასაღები“ (ზოგი ბგერა გაერთიანებულია: თ/ტ→t, კ/ქ/ყ→k, წ/ჭ/ც/ჩ→c ...)
const GEO: Record<string, string> = {
  ა: "a", ბ: "b", გ: "g", დ: "d", ე: "e", ვ: "v", ზ: "z", თ: "t", ი: "i", კ: "k", ლ: "l", მ: "m", ნ: "n",
  ო: "o", პ: "p", ჟ: "j", რ: "r", ს: "s", ტ: "t", უ: "u", ფ: "p", ქ: "k", ღ: "g", ყ: "k", შ: "x",
  ჩ: "c", ც: "c", ძ: "z", წ: "c", ჭ: "c", ხ: "h", ჯ: "j", ჰ: "h",
};

// ლათინური ტრანსლიტერაცია იმავე გასაღებზე: ორასოიანი ბგერები ჯერ (sh, ch, zh, ts, dz, kh, gh)
export function key(text: string): string {
  const n = normalize(text).replace(/\s+/g, "");
  const latin = n
    .replace(/sh/g, "x")
    .replace(/zh/g, "j")
    .replace(/ch/g, "c")
    .replace(/ts/g, "c")
    .replace(/dz/g, "z")
    .replace(/kh/g, "h")
    .replace(/gh/g, "g")
    .replace(/q/g, "k")
    .replace(/w/g, "c")
    .replace(/y/g, "k")
    .replace(/h/g, "h");
  let out = "";
  for (const ch of latin) out += GEO[ch] ?? ch;
  return out;
}

export type Searchable = { text: string };

// ქულა: 0 = არ ემთხვევა; მეტი = უკეთესი (დასაწყისი > სიტყვის დასაწყისი > შიგნით > ტრანსლიტერაცია)
export function scoreText(text: string, query: string): number {
  const hay = normalize(text);
  const q = normalize(query);
  if (!q) return 0;
  if (hay.startsWith(q)) return 4;
  if (hay.split(" ").some((w) => w.startsWith(q))) return 3;
  if (hay.includes(q)) return 2;
  const kq = key(q);
  if (kq.length >= 2) {
    const kh = key(hay);
    if (kh.startsWith(kq)) return 1.5;
    if (kh.includes(kq)) return 1;
  }
  return 0;
}

// სიის გაფილტვრა ქულით და დალაგება (საუკეთესო პირველი)
export function rank<T extends Searchable>(list: T[], query: string): T[] {
  return list
    .map((item) => ({ item, score: scoreText(item.text, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}

// მოძებნილი ფრაგმენტის ამოღება გამოსაყოფად (bold): თუ ეტიკეტში პირდაპირ ჩანს
export function splitHighlight(label: string, query: string): { before: string; match: string; after: string } | null {
  const q = query.trim();
  if (!q) return null;
  const i = label.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return null;
  return { before: label.slice(0, i), match: label.slice(i, i + q.length), after: label.slice(i + q.length) };
}
