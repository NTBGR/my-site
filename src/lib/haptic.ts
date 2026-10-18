// მსუბუქი ვიბრაცია შეხებაზე (გულის დაჭერა და სხვ.).
// Android: navigator.vibrate. iPhone-ის Safari-ს ეს API არ აქვს, ამიტომ iOS 17.4+-ზე ვიყენებთ ფარულ „switch“ ველს, რომლის დაჭერაც სისტემურ ჰაპტიკს რთავს.
// ორივე მხოლოდ მომხმარებლის დაჭერის დროს მუშაობს; სადაც არ მუშაობს (დესკტოპი, ძველი ტელეფონი), ჩუმად არაფერს აკეთებს.
export function haptic(ms = 30) {
  if (typeof navigator === "undefined" || typeof document === "undefined") return;
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(ms);
    return;
  }
  try {
    const label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    label.appendChild(input);
    document.body.appendChild(label);
    label.click();
    window.setTimeout(() => label.remove(), 150);
  } catch {}
}
