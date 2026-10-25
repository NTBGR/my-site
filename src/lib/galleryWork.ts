import { variantFor } from "@/components/ArtTile";
import type { GalleryWork } from "@/components/WorksGallery";
import { isNewWork, pricing, workId, type Artist, type ArtistWork } from "@/data/artists";

// ნამუშევარი გალერეის ფორმატში (ბარათი + სრულეკრანიანი ნახვა). ერთი ადგილი ყველა სიისთვის:
// ხელოვანის გვერდი, საჩუქრები, საჩუქრის შერჩევა, რჩეულები, მთავარი.
// showArtist: სიაში სხვადასხვა ხელოვანია, ამიტომ ბარათზე და ნახვაში ავტორის სახელი ჩანს
export function toGalleryWork(
  artist: Artist,
  work: ArtistWork,
  index: number,
  opts: { showArtist?: boolean; badge?: string; saves?: Record<string, number> } = {},
): GalleryWork {
  const id = workId(work, index);
  // ❤ რიცხვი ჩანს მხოლოდ მაშინ, როცა ერთმა ადამიანმა მაინც შეინახა
  const saved = opts.saves?.[`${artist.slug}/${id}`];
  const cost = pricing(artist, work);
  const link = work.url || artist.instagram || artist.facebook;
  return {
    title: work.title,
    price: cost?.price,
    oldPrice: cost?.original,
    salePercent: cost?.percent,
    isNew: isNewWork(work),
    color: work.color,
    variant: (variantFor(artist.slug) + index) % 4,
    url: link ? `/go/${artist.slug}/w${index}` : undefined,
    favKey: `${artist.slug}/${id}`,
    alt: `${work.title} - ${artist.name}`,
    network: /facebook\.com|fb\.com|fb\.me/i.test(link) ? "facebook" : "instagram",
    image: work.image,
    width: work.width,
    height: work.height,
    focal: work.focal,
    artistName: opts.showArtist ? artist.name : undefined,
    artistHref: opts.showArtist ? `/artists/${artist.slug}` : undefined,
    badge: opts.badge ?? (saved ? `❤ ${saved}` : undefined),
  };
}
