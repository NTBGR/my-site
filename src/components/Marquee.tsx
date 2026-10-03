export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-8 pr-8"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-8 whitespace-nowrap font-serif text-2xl font-semibold text-text sm:text-3xl"
        >
          {item}
          <span className="text-accent" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee relative overflow-hidden border-y border-border bg-surface-2 py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
