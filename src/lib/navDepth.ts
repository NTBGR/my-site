// რამდენი გვერდი გადავიარე საიტის შიგნით ამ ტაბში: „უკან“ ისრისთვის.
// 0 = ამ გვერდზე პირდაპირ მოვედი (ძებნიდან, ბმულიდან), უკან დაბრუნებაზე საიტიდან გასვლა მოხდებოდა.
const KEY = "nav-depth";

export function getNavDepth(): number {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

export function changeNavDepth(delta: 1 | -1) {
  try {
    sessionStorage.setItem(KEY, String(Math.max(0, getNavDepth() + delta)));
  } catch {}
}
