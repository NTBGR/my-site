import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import SocialIcons from "@/components/SocialIcons";
import { dictionary } from "@/lib/dictionary";
import { getLang } from "@/lib/i18n";
import { RIBBON } from "@/lib/tones";

function FooterList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center py-1 text-[15px] leading-snug text-text transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ფუთერი ღია, თბილი ქვიშისფერია (საიტის ფერებს მიჰყვება, ბნელ თემაშიც): ბოლომდე მშვიდი ტონი, ზემოთ ტერაკოტის ხაზი
export default async function Footer() {
  const lang = await getLang();
  const { footer: f, nav } = dictionary[lang];

  const explore = [
    { href: "/about", label: f.about },
    { href: "/artists", label: nav.artists },
    { href: "/blog", label: nav.blog },
    { href: "/#how-it-works", label: f.howItWorks },
    { href: "/join", label: nav.join },
    { href: "/faq", label: f.faq },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-surface-2 text-text">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: RIBBON }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border-[40px] border-[color-mix(in_srgb,var(--accent)_7%,transparent)]"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-6 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:px-10">
        <div>
          <LogoLink size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{f.tagline}</p>
          <Link href="/join" className="btn btn-primary mt-6">
            <span aria-hidden>✦</span>
            {nav.join}
          </Link>
          <SocialIcons className="mt-6" />
        </div>
        <div className="lg:justify-self-end">
          <FooterList title={f.learnMore} links={explore} />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none select-none px-4 text-center font-serif text-[16vw] font-semibold leading-none tracking-tighter text-text opacity-[0.05] sm:text-[9rem]"
      >
        ხელოვანი
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-sm text-muted sm:px-6 lg:px-10">
          <p>{f.copyright}</p>
          <div className="flex flex-wrap gap-x-6">
            <Link href="/terms" className="inline-flex min-h-10 items-center transition-colors hover:text-accent">
              {f.terms}
            </Link>
            <Link href="/privacy" className="inline-flex min-h-10 items-center transition-colors hover:text-accent">
              {f.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
