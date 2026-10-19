import Photo from "@/components/Photo";

// საახალწლო „საჩუქრის ბარათი“: ხელოვანის რეალური ნამუშევრის ფოტო კრემისფერ ჩარჩოში, ზემოდან წითელი ბაფთით და ოქროსფერი ძაფით
export default function GiftTagPhoto({ src, alt, sizes = "140px" }: { src: string; alt: string; sizes?: string }) {
  return (
    <div className="relative rounded-2xl bg-[#fff6e8] p-1.5 shadow-xl ring-1 ring-[#e9d9b8]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-2">
        <Photo src={src} alt={alt} sizes={sizes} />
      </div>
      {/* ბაფთა */}
      <svg viewBox="0 0 64 40" aria-hidden className="absolute -top-3.5 left-1/2 h-8 w-12 -translate-x-1/2 drop-shadow" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 22C20 4 4 6 5 17c1 11 17 8 27 5z" fill="#c8372d" />
        <path d="M32 22C44 4 60 6 59 17c-1 11-17 8-27 5z" fill="#b02a22" />
        <path d="M32 22l-9 16 9-5 9 5z" fill="#a3241d" />
        <circle cx="32" cy="21" r="5" fill="#d9a82b" />
      </svg>
    </div>
  );
}
