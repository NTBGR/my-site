// ჩატვირთვის „ჩონჩხი“: ბარათების ბადე, სანამ გვერდი მზად არ არის
export default function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-10" aria-busy="true" aria-label="loading">
      <div className="h-9 w-56 animate-pulse rounded-full bg-surface-2" />
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <div className="aspect-[4/5] w-full animate-pulse rounded-[1.25rem] bg-surface-2 sm:rounded-[1.5rem]" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-surface-2" />
            <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded-full bg-surface-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
