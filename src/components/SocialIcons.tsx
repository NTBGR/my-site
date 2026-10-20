import { CONTACT_EMAIL } from "@/app/privacy/content";
import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/site";

// საიტის საკუთარი ინსტაგრამი და ფეისბუქი ხატულებით. ჩანს მხოლოდ ის, რომლის ბმულიც src/lib/site.ts-შია მითითებული
// ფეისბუქი პირველია, მერე ინსტაგრამი
// withEmail: ელფოსტის ხატულაც (კონტაქტის ადგილებზე: კითხვები, ჩვენ შესახებ); ფუტერში და მენიუში მხოლოდ სოც ქსელებია
export default function SocialIcons({ className = "", size = "md", withEmail = false }: { className?: string; size?: "sm" | "md"; withEmail?: boolean }) {
  const box = size === "sm" ? "h-10 w-10" : "h-11 w-11";
  const items = [
    {
      key: "facebook",
      href: FACEBOOK_URL,
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M13.5 21v-7.5H16l.5-3h-3V8.8c0-.9.3-1.5 1.6-1.5h1.5V4.6c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2H7.5v3H10V21h3.5Z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      href: INSTAGRAM_URL,
      label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      key: "email",
      href: withEmail ? `mailto:${CONTACT_EMAIL}` : "",
      label: CONTACT_EMAIL,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7.5 8 5.5 8-5.5" />
        </svg>
      ),
    },
  ].filter((item) => item.href);

  if (items.length === 0) return null;

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            target={item.key === "email" ? undefined : "_blank"}
            rel={item.key === "email" ? undefined : "noopener noreferrer"}
            aria-label={item.label}
            className={`inline-flex ${box} items-center justify-center rounded-full border border-border bg-surface text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-on-accent active:scale-95`}
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
