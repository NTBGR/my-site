// მსუბუქი ვიბრაცია შეხებაზე (გულის დაჭერა და სხვ.).
// Android: navigator.vibrate. iPhone-ის Safari-ს ეს API არ აქვს; iOS 17.4+-ზე სისტემურ ჰაპტიკს რთავს ფარული „switch“ ველის გადართვა
// (ტელეფონის პარამეტრებში „Sounds & Haptics → System Haptics“ ჩართული უნდა იყოს). ველს ერთხელ ვქმნით და ვტოვებთ გვერდზე, რადგან ყოველ ჯერზე ახალი ელემენტი ზოგჯერ არ მუშაობს.
// ორივე მხოლოდ მომხმარებლის დაჭერის დროს მუშაობს; სადაც არ მუშაობს (დესკტოპი, ძველი ტელეფონი), ჩუმად არაფერს აკეთებს.
let iosLabel: HTMLLabelElement | undefined;

function iosHaptic() {
  if (!iosLabel || !iosLabel.isConnected) {
    const label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.display = "none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    label.appendChild(input);
    document.head.appendChild(label);
    iosLabel = label;
  }
  iosLabel.click();
}

export function haptic(ms = 30) {
  if (typeof navigator === "undefined" || typeof document === "undefined") return;
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(ms);
    return;
  }
  try {
    iosHaptic();
  } catch {}
}
