import { categories } from "@/data/categories";

// განაცხადის ფორმაში ქალაქს და მიმართულებას ადამიანი ირჩევს და არ წერს, რომ უაზრო ტექსტი არ მოვიდეს.
// ქალაქის მნიშვნელობა (value) ყოველთვის ქართულია, რომ შეტყობინებებში ერთნაირად ჩანდეს.
// სია: საქართველოს მთავრობის კონტროლქვეშ მყოფი ქალაქები (Wikipedia: List of cities and towns in Georgia, 54 ქალაქი)
// + რამდენიმე პოპულარული დასახლება, სადაც ხელოსნები ცხოვრობენ. რაც სიაში არ არის, „სხვა“ ამოირჩევა და ხელით ჩაიწერება.
const MAIN: { value: string; en: string }[] = [
  { value: "თბილისი", en: "Tbilisi" },
  { value: "ბათუმი", en: "Batumi" },
  { value: "ქუთაისი", en: "Kutaisi" },
  { value: "რუსთავი", en: "Rustavi" },
];

const REST: { value: string; en: string }[] = [
  { value: "აბაშა", en: "Abasha" },
  { value: "ადიგენი", en: "Adigeni" },
  { value: "ამბროლაური", en: "Ambrolauri" },
  { value: "ასპინძა", en: "Aspindza" },
  { value: "ახალქალაქი", en: "Akhalkalaki" },
  { value: "ახალციხე", en: "Akhaltsikhe" },
  { value: "ახმეტა", en: "Akhmeta" },
  { value: "ბაკურიანი", en: "Bakuriani" },
  { value: "ბაღდათი", en: "Baghdati" },
  { value: "ბოლნისი", en: "Bolnisi" },
  { value: "ბორჯომი", en: "Borjomi" },
  { value: "გარდაბანი", en: "Gardabani" },
  { value: "გორი", en: "Gori" },
  { value: "გურჯაანი", en: "Gurjaani" },
  { value: "გუდაური", en: "Gudauri" },
  { value: "დედოფლისწყარო", en: "Dedoplistskaro" },
  { value: "დმანისი", en: "Dmanisi" },
  { value: "დუშეთი", en: "Dusheti" },
  { value: "ვალე", en: "Vale" },
  { value: "ვანი", en: "Vani" },
  { value: "ზესტაფონი", en: "Zestaponi" },
  { value: "ზუგდიდი", en: "Zugdidi" },
  { value: "თეთრიწყარო", en: "Tetritskaro" },
  { value: "თელავი", en: "Telavi" },
  { value: "თერჯოლა", en: "Terjola" },
  { value: "თიანეთი", en: "Tianeti" },
  { value: "კასპი", en: "Kaspi" },
  { value: "ლაგოდეხი", en: "Lagodekhi" },
  { value: "ლანჩხუთი", en: "Lanchkhuti" },
  { value: "ლენტეხი", en: "Lentekhi" },
  { value: "მარნეული", en: "Marneuli" },
  { value: "მარტვილი", en: "Martvili" },
  { value: "მესტია", en: "Mestia" },
  { value: "მცხეთა", en: "Mtskheta" },
  { value: "ნინოწმინდა", en: "Ninotsminda" },
  { value: "ონი", en: "Oni" },
  { value: "ოზურგეთი", en: "Ozurgeti" },
  { value: "სამტრედია", en: "Samtredia" },
  { value: "საგარეჯო", en: "Sagarejo" },
  { value: "საჩხერე", en: "Sachkhere" },
  { value: "სენაკი", en: "Senaki" },
  { value: "სიღნაღი", en: "Sighnaghi" },
  { value: "სტეფანწმინდა", en: "Stepantsminda" },
  { value: "ტყიბული", en: "Tkibuli" },
  { value: "ფოთი", en: "Poti" },
  { value: "ქარელი", en: "Kareli" },
  { value: "ქედა", en: "Keda" },
  { value: "ქობულეთი", en: "Kobuleti" },
  { value: "ყვარელი", en: "Kvareli" },
  { value: "ცაგერი", en: "Tsageri" },
  { value: "წალენჯიხა", en: "Tsalenjikha" },
  { value: "წალკა", en: "Tsalka" },
  { value: "წყალტუბო", en: "Tskaltubo" },
  { value: "წნორი", en: "Tsnori" },
  { value: "ჭიათურა", en: "Chiatura" },
  { value: "ხაშური", en: "Khashuri" },
  { value: "ხარაგაული", en: "Kharagauli" },
  { value: "ხობი", en: "Khobi" },
  { value: "ხონი", en: "Khoni" },
  { value: "ხულო", en: "Khulo" },
  { value: "ჯვარი", en: "Jvari" },
  { value: "ჩოხატაური", en: "Chokhatauri" },
  { value: "შუახევი", en: "Shuakhevi" },
];

// თბილისი, ბათუმი, ქუთაისი, რუსთავი ზემოთაა, დანარჩენი ქართული ანბანის მიხედვით
export const cities: { value: string; en: string }[] = [
  ...MAIN,
  ...REST.sort((a, b) => a.value.localeCompare(b.value, "ka")),
];

// „სხვა“ ქალაქისთვის და მიმართულებისთვის: ადამიანი ხელით წერს (ველი ჩნდება არჩევისას)
export const OTHER_CITY = "other";
export const OTHER_CATEGORY = "other";

// სერვერზე შესამოწმებლად და შეტყობინებებისთვის: slug → ქართული სახელი
export function categoryNameKa(value: string): string | undefined {
  if (value === OTHER_CATEGORY) return "სხვა";
  return categories.find((c) => c.slug === value)?.name;
}
