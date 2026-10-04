// დაკოპირება დაჭერისთანავე. iPhone-ზე ბრაუზერი ბუფერში ჩაწერას მხოლოდ დაჭერის წამშივე უშვებს და თუ გვერდი სხვა აპში
// (Instagram) გადადის, ასინქრონული navigator.clipboard ხშირად არ ასწრებს. ამიტომ ჯერ სინქრონულად textarea-ით ვაკოპირებთ,
// navigator.clipboard მხოლოდ სათადარიგოა.
export function copyText(text: string): boolean {
  let ok = false;
  const area = document.createElement("textarea");
  area.value = text;
  // readonly არ უნდა იყოს: iOS-ზე ასეთი ველი არ მონიშნება; 16px, რომ iPhone-მა გვერდი არ გაზარდოს
  area.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px";
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, text.length);
  try {
    ok = document.execCommand("copy");
  } catch {}
  area.remove();
  if (!ok && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
    ok = true;
  }
  return ok;
}
