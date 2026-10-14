// კატეგორიის ბარათებზე სურათი: მინიმალისტური ფოტო საგნისა კატეგორიის სულისკვეთებით (public/categories/<slug>.jpg).
// ეს ილუსტრაციებია კატეგორიისთვის და არა კონკრეტული ხელოვანის ნამუშევარი; ხელოვანების ნამდვილი ფოტოები ცალკე ჩანს მათ გვერდებზე.
// ახალი კატეგორიის დასამატებლად ფოტო ჩადე public/categories-ში და აქ ერთი ხაზი დაამატე.
export type CategoryPhoto = { src: string; focal?: string };

const photo = (slug: string, focal = "50% 50%"): CategoryPhoto => ({ src: `/categories/${slug}.jpg`, focal });

export const categoryPhotos: Record<string, CategoryPhoto> = {
  nakhatebi: photo("nakhatebi"),
  posterebi: photo("posterebi"),
  keramika: photo("keramika-main"),
  skulptura: photo("skulptura"),
  samkauli: photo("samkauli"),
  // ძველი გასაღები „ბეჭდები“ (ბანერებზე): ცალკე სურათი, რომ სამკაულთან ერთნაირი არ იყოს
  bechdebi: photo("bechdebi"),
  tekstili: photo("tekstili"),
  tyavi: photo("tyavi"),
  "khis-nakethobebi": photo("khis-nakethobebi"),
  "saxlis-dekori": photo("saxlis-dekori"),
  sachuqrebi: photo("sachuqrebi"),
  // ბანერის კოლაჟისთვის: იმავე კატეგორიის დამატებითი ფოტოები (ბანერზე სამივე ერთსა და იმავე თემაზეა)
  "keramika-2": photo("keramika-2"),
  "keramika-3": photo("keramika-3"),
  "nakhatebi-2": photo("nakhatebi-2"),
  "nakhatebi-3": photo("nakhatebi-3"),
  "posterebi-2": photo("posterebi-2"),
  "posterebi-3": photo("posterebi-3"),
  "samkauli-3": photo("samkauli-3"),
};

export function hasCategoryPhoto(slug: string) {
  return slug in categoryPhotos;
}
