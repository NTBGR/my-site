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
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#e8c9a8]">{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center py-1 text-[15px] leading-snug text-[#f4ede4]/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ფუთერი ყოველთვის მუქია (ორივე თემაში): საიტს ქვემოდან „სიმძიმეს“ და სიმდიდრეს აძლევს
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
    <footer
      className="relative isolate overflow-hidden bg-[#2a1a12] text-[#f4ede4]"
      style={{ ["--text" as string]: "#f4ede4", ["--accent" as string]: "#e8895f" }}
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: RIBBON }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border-[40px] border-white/[0.04]"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-6 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:px-10">
        <div>
          <LogoLink size="lg" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f4ede4]/75">{f.tagline}</p>
          <Link href="/join" className="btn btn-light mt-6">
            <span aria-hidden>✦</span>
            {nav.join}
          </Link>
          <SocialIcons className="mt-6" onDark />
        </div>
        <div className="lg:justify-self-end">
          <FooterList title={f.learnMore} links={explore} />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none select-none px-4 text-center font-serif text-[16vw] font-semibold leading-none tracking-tighter text-white opacity-[0.05] sm:text-[9rem]"
      >
        ხელოვანი
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-sm text-[#f4ede4]/65 sm:px-6 lg:px-10">
          <p>{f.copyright}</p>
          <div className="flex flex-wrap gap-x-6">
            <Link href="/terms" className="inline-flex min-h-10 items-center transition-colors hover:text-white">
              {f.terms}
            </Link>
            <Link href="/privacy" className="inline-flex min-h-10 items-center transition-colors hover:text-white">
              {f.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
