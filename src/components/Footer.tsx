import Link from "next/link";

const learnMore = [
  { href: "/about", label: "ჩვენ შესახებ" },
  { href: "/how-it-works", label: "როგორ მუშაობს" },
  { href: "/blog", label: "ბლოგა" },
  { href: "/faq", label: "კითხვები" },
];

const help = [
  { href: "/contact", label: "კონტაქტი" },
  { href: "/privacy", label: "კონფიდენციალურობა" },
  { href: "/terms", label: "გამოყენების პირობები" },
  { href: "/takedown", label: "ამოშლის მოთხოვნა" },
];

const social = [
  { href: "#", label: "ინსტაგრამი" },
  { href: "#", label: "ფეისბუქი" },
];

function FooterList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="mb-3 font-serif text-base font-semibold text-text">
        {title}
      </h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm text-accent hover:text-accent-hover"
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
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <FooterList title="გაიგე მეტი" links={learnMore} />
        <FooterList title="დახმარება" links={help} />
        <FooterList title="სოციალური ქსელები" links={social} />
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted sm:px-6">
          © 2026 ხელოვანი
        </p>
      </div>
    </footer>
  );
}
