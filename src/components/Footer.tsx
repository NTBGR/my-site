import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import { getT } from "@/lib/i18n";

function FooterList({
  title,
  links,
  className = "",
}: {
  title: string;
  links: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex min-h-10 items-center gap-1 break-words text-[15px] text-text sm:text-base transition-colors hover:text-accent"
            >
              {link.label}
              <span
                className="hidden -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:inline"
                aria-hidden
              >
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { footer: f, nav } = getT();

  const learnMore = [
    { href: "/about", label: f.about },
    { href: "/how-it-works", label: f.howItWorks },
    { href: "/blog", label: nav.blog },
    { href: "/faq", label: f.faq },
  ];
  const help = [
    { href: "/contact", label: f.contact },
    { href: "/privacy", label: f.privacy },
    { href: "/terms", label: f.terms },
    { href: "/takedown", label: f.takedown },
  ];
  const social = [
    { href: "#", label: f.instagram },
    { href: "#", label: f.facebook },
  ];

  return (
    <footer className="relative mt-0 overflow-hidden border-t border-border bg-surface-2">
      <div className="mx-auto grid max-w-7xl grid-cols-[repeat(2,minmax(0,1fr))] gap-x-6 gap-y-8 px-4 pb-6 pt-10 sm:gap-12 sm:px-6 lg:px-10 sm:pb-10 sm:pt-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <LogoLink size="lg" />
          <p className="mt-4 max-w-xs leading-relaxed text-muted">{f.tagline}</p>
        </div>
        <FooterList title={f.learnMore} links={learnMore} />
        <FooterList title={f.help} links={help} />
        <FooterList title={f.social} links={social} className="col-span-2 md:col-span-1" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none select-none px-4 text-center font-serif text-[17vw] font-semibold leading-none tracking-tighter text-text opacity-[0.05] sm:text-[14rem]"
      >
        ხელოვანი
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted sm:px-6 lg:px-10">
          {f.copyright}
        </p>
      </div>
    </footer>
  );
}
