// „კვირის ხელოვანი“ ხელით დასაფიქსირებლად: ჩაწერე ხელოვანის slug (მაგ. "zhuzha-ceramics") და ის დარჩება ბარათზე.
// null-ის შემთხვევაში ყოველ კვირას ხელოვანები ავტომატურად რიგრიგობით იცვლება.
export const artistOfWeekOverride: string | null = "zhuzha-ceramics";

// მთავარზე „რჩეული ნამუშევრები“ ხელით: ჩაწერე "<ხელოვანის slug>/<ფოტოს ფაილის სახელი გაფართოების გარეშე>" (მაგ. "zhuzha-ceramics/ring-amore-rose"), რიგით.
// მხოლოდ მაშინ ჩანს, როცა „ამ თვის ყველაზე შენახული“ ჯერ არ არის საკმარისი; თუ სია 10-ზე ნაკლებია, დანარჩენი ავტომატურად ივსება
export const pickedWorks: string[] = [
  "zhuzha-ceramics/ring-amore-rose",
  "zhuzha-ceramics/set-red-hearts",
  "tbgr-poster-lab/arsenal",
  "tbgr-poster-lab/old-trafford",
  "zhuzha-ceramics/earrings-wave",
  "zhuzha-ceramics/ring-green-heart",
  "tamus-shop/bouquet-pink-blooms",
  "zhuzha-ceramics/necklace-orange-star",
  "tamus-shop/tulips-blue-doll",
];
