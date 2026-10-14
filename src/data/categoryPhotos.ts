// კატეგორიის ბარათებზე სურათი: მინიმალისტური ფოტო საგნისა კატეგორიის სულისკვეთებით (public/categories/<slug>.jpg).
// ეს ილუსტრაციებია კატეგორიისთვის და არა კონკრეტული ხელოვანის ნამუშევარი; ხელოვანების ნამდვილი ფოტოები ცალკე ჩანს მათ გვერდებზე.
// ახალი კატეგორიის დასამატებლად ფოტო ჩადე public/categories-ში და აქ ერთი ხაზი დაამატე.
export type CategoryPhoto = { src: string; focal?: string };

const photo = (slug: string, focal = "50% 50%"): CategoryPhoto => ({ src: `/categories/${slug}.jpg`, focal });

export const categoryPhotos: Record<string, CategoryPhoto> = {
  nakhatebi: photo("nakhatebi"),
  posterebi: photo("posterebi"),
  keramika: photo("keramika", "35% 55%"),
  skulptura: photo("skulptura"),
  samkauli: photo("samkauli"),
  // „ბეჭდები“ გაერთიანდა „სამკაულში“; ძველი გასაღები ბანერებისთვის ამავე სურათს იყენებს
  bechdebi: photo("samkauli"),
  tekstili: photo("tekstili"),
  tyavi: photo("tyavi"),
  "khis-nakethobebi": photo("khis-nakethobebi"),
  "saxlis-dekori": photo("saxlis-dekori"),
  sachuqrebi: photo("sachuqrebi"),
};

export function hasCategoryPhoto(slug: string) {
  return slug in categoryPhotos;
}
