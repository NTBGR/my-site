import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import { getT } from "@/lib/i18n";

// საიტის სოციალური ქსელები: ჩაწერე ბმული და ფუტერში გამოჩნდება
const SOCIAL_LINKS = {
  instagram: "",
  facebook: "",
};

function FooterList({
  title,
  links,
  external = false,
}: {
  title: string;
  links: { href: string; label: string }[];
  external?: boolean;
}) {
  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex min-h-10 items-center text-[15px] text-text transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { footer: f, nav } = getT();

  const explore = [
    { href: "/about", label: f.about },
    { href: "/artists", label: nav.artists },
    { href: "/categories", label: nav.categories },
    { href: "/blog", label: nav.blog },
    { href: "/#how-it-works", label: f.howItWorks },
    { href: "/join", label: nav.join },
  ];
  const social = [
    { href: SOCIAL_LINKS.instagram, label: f.instagram },
    { href: SOCIAL_LINKS.facebook, label: f.facebook },
  ].filter((link) => link.href);

  return (
    <footer className="relative mt-0 overflow-hidden border-t border-border bg-surface-2">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-4 pt-10 sm:flex-row sm:justify-between sm:gap-12 sm:px-6 sm:pt-14 lg:px-10">
        <div>
          <LogoLink size="lg" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{f.tagline}</p>
        </div>
        <div className="flex gap-12 sm:gap-16">
          <FooterList title={f.learnMore} links={explore} />
          {social.length > 0 ? (
            <FooterList title={f.social} links={social} external />
          ) : null}
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
          <Link href="/privacy" className="inline-flex min-h-10 items-center transition-colors hover:text-accent">
            {f.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
