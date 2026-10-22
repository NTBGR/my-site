import { cookies } from "next/headers";
import { artists, workId } from "@/data/artists";
import { clicksEnabled, conversion, dayOf, monthOf, monthStats, monthWorkStats, viewStats } from "@/lib/clicks";
import { monthFavorites, monthWorkFavorites } from "@/lib/favoriteStats";
import { STATS_COOKIE, statsConfigured, tokenValid } from "@/lib/statsAuth";
import { daysLeftText, memberships, onDay, type MembershipStatus } from "@/lib/membership";

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

// ხელოვანების ვადები: უფასო პერიოდი / გადახდილი გამოწერა, ყველაზე ახლოს მყოფი ვადა პირველი
const STATUS: Record<MembershipStatus, { label: string; className: string }> = {
  trial: { label: "უფასო", className: "bg-[#e3efe0] text-[#2f5a2a]" },
  paid: { label: "გადახდილი", className: "bg-[#dfe8f5] text-[#24406e]" },
  soon: { label: "მალე იწურება", className: "bg-[#fdeccf] text-[#7a4a06]" },
  expired: { label: "ვადა გავიდა", className: "bg-[#fbe0de] text-[#9b1c17]" },
  forever: { label: "მუდმივად უფასო", className: "bg-[#ece6f6] text-[#4a3d73]" },
};

function Deadlines() {
  const rows = memberships(artists);
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">ხელოვანების ვადები</h2>
      <p className="mt-1 text-sm text-muted">
        უფასო პერიოდი იწყება <code>joined</code> თარიღიდან (<code>src/data/artists.ts</code>); ხანგრძლივობა <code>freeMonths</code> (ნაგულისხმევი 2 თვე), ან <code>freeForever</code> მუდმივად უფასოსთვის.
        გადახდის შემდეგ ჩაწერე <code>paidUntil</code>. ტელეგრამში გაფრთხილება მოდის 7, 3 და 1 დღით ადრე, ვადის დღეს და მეორე დღეს.
      </p>
      <ul className="mt-3 grid gap-3 lg:grid-cols-2">
        {rows.map(({ artist, m }) => {
          const tone = m.forever ? STATUS.forever : m.daysLeft < 0 ? STATUS.expired : m.daysLeft <= 7 ? STATUS.soon : m.daysLeft <= 14 ? { ...STATUS.soon, label: m.paid ? "გადახდილი" : "უფასო" } : STATUS[m.status];
          return (
            <li key={artist.slug} className={card}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-base font-semibold text-text [overflow-wrap:anywhere] sm:text-lg">{artist.name}</h3>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tone.className}`}>{tone.label}</span>
              </div>
              {m.forever ? (
                <p className="mt-1 text-sm text-text">ვადა არ აქვს</p>
              ) : (
                <p className="mt-1 text-sm text-text">
                  იწურება <b>{onDay(m.end)}</b> ({m.end}) · <b>{daysLeftText(m.daysLeft)}</b>
                </p>
              )}
              <p className="mt-1 text-sm text-muted">
                დაიწყო {onDay(m.start)}{m.forever ? "" : ` · უფასო ${m.freeMonths} თვე`}
                {m.paid ? ` · გადახდილია ${onDay(m.end)}-მდე` : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type Period = { id: string; title: string; month?: string };

async function Block({ period, withSaves }: { period: Period; withSaves: boolean }) {
  const [stats, works, favs, favWorks, views] = await Promise.all([
    monthStats(period.id),
    monthWorkStats(period.id),
    withSaves && period.month ? monthFavorites(period.month) : Promise.resolve({} as Awaited<ReturnType<typeof monthFavorites>>),
    withSaves && period.month ? monthWorkFavorites(period.month) : Promise.resolve({} as Record<string, number>),
    viewStats(period.id),
  ]);
  const rows = artists
    .map((artist) => {
      const s = stats[artist.slug] ?? { instagram: 0, facebook: 0, total: 0 };
      // ნამუშევრები, რომლებზეც რაიმე მოხდა: გადასვლა (👆) ან დამახსოვრება (❤)
      const topWorks = artist.works
        .map((w, i) => {
          const id = workId(w, i);
          const c = (works[artist.slug] ?? []).find((x) => x.id === id);
          return { title: w.title, people: c?.people ?? 0, total: c?.total ?? 0, hearts: favWorks[`${artist.slug}/${id}`] ?? 0 };
        })
        .filter((x) => x.people > 0 || x.hearts > 0)
        .sort((a, b) => b.people - a.people || b.hearts - a.hearts || b.total - a.total)
        .slice(0, 8);
      const v = views[artist.slug] ?? { people: 0, total: 0 };
      const people = s.instagram + s.facebook;
      return { artist, ...s, people, topWorks, favPeople: favs[artist.slug]?.people ?? 0, viewPeople: v.people, viewTotal: v.total, rate: conversion(v.people, people) };
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
            <p className="mt-1 text-sm text-text">
              პროფილზე შემოვიდა: <b>{r.viewPeople}</b> ადამიანი ({r.viewTotal} ნახვა)
              {r.rate !== undefined ? (
                <>
                  {" "}
                  · გადავიდა ≈ <b className="text-accent">{r.rate}%</b>
                </>
              ) : null}
            </p>
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
                      👆 {w.people} <span className="text-xs">({w.total})</span>
                      {withSaves ? <> · ❤ {w.hearts}</> : null}
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

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ error?: string; reset?: string }> }) {
  const { error, reset } = await searchParams;
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
        დიდი რიცხვი = რამდენი ადამიანი გადავიდა ხელოვანთან: ერთი ადამიანი დღეში ერთხელ (ინსტაგრამი და ფეისბუქი ცალ-ცალკე). ფრჩხილებში: სულ დაწკაპუნება,
        ერთი ადამიანის განმეორებითიც. 👆 = გადასვლა ამ ნამუშევრიდან, ❤ = ფავორიტებში დაამატა (თვის მონაცემია).
        „პროფილზე შემოვიდა“ = რამდენმა ადამიანმა გახსნა ხელოვანის გვერდი; „გადავიდა ≈ %“ = მათ რამდენ პროცენტს უდრის ინსტაგრამზე/ფეისბუქზე გადასულები (გადასვლა სხვა გვერდებიდანაც შეიძლება, ამიტომ დაახლოებითია).
        ვინაობა არსად ინახება, მხოლოდ რიცხვები. დღის მონაცემები ჩანს მას შემდეგ, რაც ეს გვერდი გაიშვა.
      </p>
      {!clicksEnabled ? <p className={`${card} mt-4 text-sm text-accent`}>სტატისტიკის ბაზა დაკავშირებული არ არის.</p> : null}
      {reset === "confirm" ? <p className={`${card} mt-4 text-sm text-accent`}>გაანულება არ შესრულდა: ველში უნდა ჩაგეწერა სიტყვა „გაანულება“.</p> : null}
      {reset === "error" ? <p className={`${card} mt-4 text-sm text-accent`}>გაანულება ვერ შესრულდა. სცადე თავიდან.</p> : null}
      {reset && /^\d+$/.test(reset) ? <p className={`${card} mt-4 text-sm text-text`}>სტატისტიკა გაანულდა (წაიშალა {reset} ჩანაწერი).</p> : null}
      <Deadlines />
      <Block period={{ id: day, title: `დღეს, ${dayName(day)}` }} withSaves={false} />
      <Block period={{ id: month, month, title: `ეს თვე: ${monthName(month)}` }} withSaves />
      <Block period={{ id: prev, month: prev, title: `წინა თვე: ${monthName(prev)}` }} withSaves />

      {/* გაანულება: საშიში მოქმედება, ამიტომ ბოლოშია და სიტყვის ჩაწერა სჭირდება */}
      <section className={`${card} mt-12 border-[#c4302b]/40`}>
        <h2 className="text-lg font-semibold tracking-tight text-text">სტატისტიკის გაანულება</h2>
        <p className="mt-1 text-sm text-muted">
          წაიშლება ყველა გადასვლა, პროფილის ნახვა და ნამუშევრების ❤ (მათ შორის მთავარზე „თვის ფავორიტებიც“ ცარიელდება). აღდგენა შეუძლებელია.
          შენს ბრაუზერში შენახული გულები არ იშლება.
        </p>
        <form method="post" action="/stats/reset" className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            name="confirm"
            type="text"
            autoComplete="off"
            required
            placeholder="ჩაწერე: გაანულება"
            aria-label="დასადასტურებლად ჩაწერე სიტყვა გაანულება"
            className="h-11 min-w-0 flex-1 rounded-full border border-border bg-bg px-5 text-base text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#c4302b] px-6 text-sm font-medium text-white transition hover:bg-[#a82621] active:scale-95"
          >
            გაანულება
          </button>
        </form>
      </section>
    </div>
  );
}
