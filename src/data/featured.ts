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

// მთავარის „ახალი ნამუშევრების“ დიდი ბარათი: ყოველთვის ეს ნამუშევარია (კარგი ხარისხის ფოტო), დანარჩენი შემთხვევითი რიგითაა.
// ჩაწერე "<ხელოვანის slug>/<ფოტოს ფაილის სახელი გაფართოების გარეშე>"; null-ის შემთხვევაში დიდიც შემთხვევითია
export const newWorksFeatured: string | null = "zhuzha-ceramics/ring-pearl-heart";
// მთავარის „ახალი ნამუშევრების“ ზოლში ტრიალებს მხოლოდ ამ ხელოვანების ნამუშევრები (30 დღის შეზღუდვის გარეშე): ყოველ ჩატვირთვაზე შემთხვევითი რიგით, ხელოვანები რიგრიგობით.
// ჩაწერე ხელოვანის slug; ცარიელი სია ნიშნავს, რომ ზოლი ყველა ხელოვანის ბოლო 30 დღის ნამუშევრებისგან შედგება.
export const newWorksPriorityArtists: string[] = ["zhuzha-ceramics", "mokazmuli", "ivlisi", "natiart-space", "tbgr-poster-lab"];

// მთავარის „ახალი ხელოვანები“ ზოლში ეს ხელოვანები პირველია (ამ რიგით); ახლა სია ცარიელია და ხელოვანები მხოლოდ დამატების დროის მიხედვითაა (ახალი პირველი).
export const newArtistsPinned: string[] = [];
