import { cookies } from "next/headers";
import { artists, workId } from "@/data/artists";
import { clicksEnabled, dayOf, monthOf, monthStats, monthWorkStats } from "@/lib/clicks";
import { monthFavorites } from "@/lib/favoriteStats";
import { STATS_COOKIE, statsConfigured, tokenValid } from "@/lib/statsAuth";

export const dynamic = "force-dynamic";

// სტატისტიკა მხოლოდ შენთვისაა: საძიებო სისტემებს არ ეჩვენება
export const metadata = { title: "სტატისტიკა", robots: { index: false, follow: false } };

const MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const monthName = (month: string) => `${MONTHS[Number(month.slice(5, 7)) - 1]} ${month.slice(0, 4)}`;
const dayName = (day: string) => `${Number(day.slice(8, 10))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`;

function previousMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 2, 15)).toISOString().slice(0, 7);
}

const card = "rounded-[1.5rem] border border-border bg-surface p-4 sm:p-5";

function Login({ error, configured }: { error?: string; configured: boolean }) {
  const message =
    error === "1"
      ? "პაროლი არასწორია."
      : error === "wait"
        ? "ბევრი ცდა. სცადე 10 წუთში."
        : !configured
          ? "სტატისტიკა ჯერ არ არის ჩართული (STATS_PASSWORD არ არის დაყენებული)."
          : null;
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:py-24">
      <h1 className="text-2xl font-semibold tracking-tight text-text">სტატისტიკა</h1>
      {configured ? (
        <form method="post" action="/api/stats-login" className="mt-5 flex flex-col gap-3">
          <label className="text-sm text-muted" htmlFor="stats-password">
            პაროლი
          </label>
          <input
            id="stats-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-12 rounded-full border border-border bg-surface px-5 text-base text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
          >
            შესვლა
          </button>
        </form>
      ) : null}
      {message ? <p className="mt-4 text-sm text-accent">{message}</p> : null}
    </div>
  );
}

type Period = { id: string; title: string; month?: string };

async function Block({ period, withSaves }: { period: Period; withSaves: boolean }) {
  const [stats, works, favs] = await Promise.all([
    monthStats(period.id),
    monthWorkStats(period.id),
    withSaves && period.month ? monthFavorites(period.month) : Promise.resolve({} as Awaited<ReturnType<typeof monthFavorites>>),
  ]);
  const rows = artists
    .map((artist) => {
      const s = stats[artist.slug] ?? { instagram: 0, facebook: 0, total: 0 };
      const topWorks = (works[artist.slug] ?? [])
        .map((c) => {
          const index = artist.works.findIndex((w, i) => workId(w, i) === c.id);
          return index >= 0 ? { title: artist.works[index].title, people: c.people, total: c.total } : undefined;
        })
        .filter((x): x is { title: string; people: number; total: number } => Boolean(x))
        .slice(0, 5);
      return { artist, ...s, people: s.instagram + s.facebook, topWorks, favPeople: favs[artist.slug]?.people ?? 0 };
    })
    .sort((a, b) => b.people - a.people || b.total - a.total);
  const totalPeople = rows.reduce((sum, r) => sum + r.people, 0);
  const totalClicks = rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">{period.title}</h2>
        <p className="text-sm text-muted">
          <b className="text-text">{totalPeople}</b> ადამიანი · {totalClicks} დაწკაპუნება
        </p>
      </div>
      <ul className="mt-3 grid gap-3 lg:grid-cols-2">
        {rows.map((r) => (
          <li key={r.artist.slug} className={card}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 text-base font-semibold text-text [overflow-wrap:anywhere] sm:text-lg">{r.artist.name}</h3>
              <span className="shrink-0 text-2xl font-semibold tabular-nums text-accent">{r.people}</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              ინსტაგრამი {r.instagram} · ფეისბუქი {r.facebook} · დაწკაპუნება {r.total}
              {withSaves && r.favPeople ? ` · ❤ ${r.favPeople}` : ""}
            </p>
            {r.topWorks.length > 0 ? (
              <ol className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
                {r.topWorks.map((w) => (
                  <li key={w.title} className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 text-text [overflow-wrap:anywhere]">{w.title}</span>
                    <span className="shrink-0 tabular-nums text-muted">
                      {w.people} <span className="text-xs">({w.total})</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = statsConfigured();
  const authed = tokenValid((await cookies()).get(STATS_COOKIE)?.value);
  if (!authed) return <Login error={error} configured={configured} />;

  const month = monthOf();
  const day = dayOf();
  const prev = previousMonth(month);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10">
      <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">სტატისტიკა</h1>
      <p className="mt-1 text-sm text-muted">
        დიდი რიცხვი = რამდენმა ადამიანმა გადაინაცვლა ხელოვანთან (ერთი ადამიანი დღეში ერთხელ). ფრჩხილებში: სულ დაწკაპუნება.
        დღის მონაცემები ჩანს მას შემდეგ, რაც ეს გვერდი გაიშვა.
      </p>
      {!clicksEnabled ? <p className={`${card} mt-4 text-sm text-accent`}>სტატისტიკის ბაზა დაკავშირებული არ არის.</p> : null}
      <Block period={{ id: day, title: `დღეს, ${dayName(day)}` }} withSaves={false} />
      <Block period={{ id: month, month, title: `ეს თვე: ${monthName(month)}` }} withSaves />
      <Block period={{ id: prev, month: prev, title: `წინა თვე: ${monthName(prev)}` }} withSaves />
    </div>
  );
}
