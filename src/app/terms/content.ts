import type { Lang } from "@/lib/dictionary";
import { CONTACT_EMAIL } from "@/app/privacy/content";

// ხელოვანებთან თანამშრომლობის წესები და პირობები. მარტივი ენით დაწერილი პროექტი, იურისტს არ გადაუხედავს.
// ფასი: რეგისტრაცია და განთავსება სრულიად უფასოა (გადაწყვეტილება 2026-10-27). შეცვლისას აქაც და src/lib/dictionary.ts-შიც განაახლე.
export { CONTACT_EMAIL };
export const PRICE_GEL = 20;
// ვერსია (დაემთხვევა updated თარიღს): განაცხადთან ერთად ინახება, რომ ვიცოდეთ, რომელ ტექსტს დათანხმდა ხელოვანი. პირობების შეცვლისას განაახლე აქაც და updated-შიც
export const TERMS_VERSION = "2026-10-30";

// რას ეთანხმება ხელოვანი მოკლედ: განაცხადის შეტყობინებაში ჩაიწერება თანხმობის დროსთან ერთად, რომ ვიცოდეთ ზუსტად რაზე დაეთანხმა. პირობების შეცვლისას განაახლე TERMS_VERSION-თან ერთად
export const TERMS_SUMMARY =
  "განთავსება სრულიად უფასოა; მხოლოდ ხელნაკეთი ნამუშევრები და ნამდვილი (არა AI-ით შექმნილი) ფოტოები; ფოტოები და ტექსტები პარტნიორი ხელოვანისაა; ნამუშევრის ხარისხზე, ფასზე, შეკვეთასა და გადახდაზე, მიწოდებასა და დაბრუნებაზე სრულად პასუხისმგებელია პარტნიორი ხელოვანი, khelovani.ge გარიგებაში არ მონაწილეობს და დავაზე პასუხს არ აგებს; ხელოვანს შეუძლია ნებისმიერ დროს მოითხოვოს პროფილის მოხსნა";

type Section = { title: string; text?: string[]; items?: string[] };

export const terms: Record<
  Lang,
  { title: string; intro: string; updated: string; sections: Section[]; contactTitle: string; contactText: string }
> = {
  ka: {
    title: "წესები და პირობები",
    intro: "მოკლედ და გასაგებად: რა გვაქვს შეთანხმებული პარტნიორ ხელოვანებთან და როგორ წყდება თანამშრომლობა.",
    updated: "ბოლო განახლება: 30 ოქტომბერი, 2026",
    sections: [
      {
        title: "რას ვაკეთებთ",
        text: [
          "„ხელოვანი“ ქართველი ხელოვანების ხელნაკეთ ნამუშევრებს ერთ სივრცეში აერთიანებს. საიტზე არაფერს ვყიდით და გადახდებს არ ვიღებთ: მყიდველი პარტნიორი ხელოვანის ინსტაგრამზე ან ფეისბუქზე გადადის და შეკვეთა პირდაპირ მასთან ხდება. ყიდვა-გაყიდვის მხარე პარტნიორი ხელოვანი და მყიდველია, ჩვენ ამ გარიგებაში მონაწილე არ ვართ.",
        ],
      },
      {
        title: "ვის შეუძლია განთავსება",
        items: [
          "მხოლოდ ხელნაკეთ ნამუშევრებს ვაქვეყნებთ: ხელით ან ავტორის ორიგინალი ნახატით შექმნილს. ქარხნული ნაწარმი და გადაყიდვა არ გვაინტერესებს.",
          "ფოტოები და ტექსტები შენი უნდა იყოს, ან გქონდეს მათი გამოყენების უფლება.",
          "ფოტოები ნამდვილი უნდა იყოს: ხელოვნური ინტელექტით (AI) შექმნილ ან გაფორმებულ სურათებს არ ვიღებთ.",
          "განაცხადში მითითებული ინფორმაცია (სახელი, ბმულები, ქალაქი) ზუსტი უნდა იყოს.",
          "გამოქვეყნებამდე განაცხადს ვამოწმებთ და უარის თქმის უფლებას ვიტოვებთ.",
        ],
      },
      {
        title: "ფასი",
        items: [
          "რეგისტრაცია და განთავსება სრულიად უფასოა, ვალდებულების გარეშე.",
          "გაყიდვებზე პროცენტს არ ვიღებთ: საიტზე გაყიდვა არ ხდება და ყველა შემოსავალი პარტნიორი ხელოვანისაა.",
        ],
      },
      {
        title: "რას იღებ",
        items: [
          "შენს პროფილს, ნამუშევრების გვერდს და ადგილს კატეგორიებსა და ძიებაში.",
          "ყოველი თვის 1 რიცხვში იმეილით გიგზავნით რეპორტს: რამდენი ადამიანი გადავიდა საიტიდან შენს ინსტაგრამზე ან ფეისბუქზე.",
          "გაყიდვებს, ვიზიტებსა და გადასვლების კონკრეტულ რაოდენობას არ გპირდებით. რეპორტი მხოლოდ იმას აჩვენებს, რაც რეალურად მოხდა.",
        ],
      },
      {
        title: "შეწყვეტა",
        text: [
          "შეგიძლია ნებისმიერ დროს მოგვწერო და გაუქმება მოგვთხოვო, ჩვენ პროფილს სწრაფად მოვხსნით. ჩვენც შეგვიძლია პროფილი მოვხსნათ, თუ ამ წესებს დაარღვევ ან ნამუშევრები ხელნაკეთი არ აღმოჩნდება.",
        ],
      },
      {
        title: "შენი ფოტოები და ტექსტები",
        text: [
          "ფოტოები, ტექსტები და ნამუშევრები შენი რჩება. განთავსებით საიტზე მათი ჩვენების უფლებას გვაძლევ. გაუქმებისას მათაც მოვხსნით.",
        ],
      },
      {
        title: "პასუხისმგებლობა",
        text: [
          "khelovani.ge მხოლოდ გასაცნობი პლატფორმაა: პარტნიორ ხელოვანებს მყიდველებთან ვაკავშირებთ. ჩვენ არ ვყიდით, არ ვამზადებთ, არ ვაგზავნით და არ ვიბრუნებთ ნამუშევრებს და არც ერთ გარიგებაში არ ვმონაწილეობთ.",
          "ყველაფერზე, რაც ნამუშევარს ეხება, სრულად პასუხისმგებელია პარტნიორი ხელოვანი: ხარისხზე, ფასზე, შეკვეთასა და გადახდაზე, მიწოდებასა და დაბრუნებაზე, ფოტოებისა და აღწერების სისწორეზე. პარტნიორი ხელოვანი ადასტურებს, რომ ნამუშევარი თავად გააკეთა და ფოტოებიც მისია. მყიდველთან დავასა და ზარალზე khelovani.ge პასუხს არ აგებს, ასეთ საკითხებს პარტნიორი ხელოვანი თავად აგვარებს.",
          "ბმულებისა და მესამე მხარის პლატფორმების (ინსტაგრამი, ფეისბუქი) მუშაობაზეც პასუხს ვერ ვაგებთ.",
        ],
      },
      {
        title: "ცვლილებები",
        text: [
          "ამ პირობებს შეიძლება შევცვალოთ. განახლებულ ვერსიას აქ გამოვაქვეყნებთ და ზემოთ თარიღს შევცვლით, არსებულ პარტნიორ ხელოვანებს კი იმეილით ვაცნობებთ. ფასის ცვლილებას წინასწარ ვაცნობებთ და ის არ ამოქმედდება შენი თანხმობის გარეშე.",
        ],
      },
    ],
    contactTitle: "კითხვა გაქვს?",
    contactText: "მოგვწერე და გიპასუხებთ:",
  },
  en: {
    title: "Terms",
    intro: "In short and plainly: what we agree with partner makers and how it ends.",
    updated: "Last updated: 30 October 2026",
    sections: [
      {
        title: "What we do",
        text: [
          "Khelovani gathers Georgian handmade work in one place. We sell nothing and take no payments: the visitor goes to the partner maker's Instagram or Facebook and orders directly from them. The partner maker and the buyer are the parties to a sale; we are not part of it.",
        ],
      },
      {
        title: "Who can be listed",
        items: [
          "Only handmade work: made by hand or from the maker's original drawing. Factory goods and resale are not accepted.",
          "Photos and texts must be yours, or you must have the right to use them.",
          "Photos must be real: we do not accept images created or edited with artificial intelligence (AI).",
          "The information in your application (name, links, city) must be accurate.",
          "We review every application before publishing and may decline it.",
        ],
      },
      {
        title: "Price",
        items: [
          "Signing up and listing is completely free, no strings attached.",
          "We take no commission: nothing is sold on the site, and all sales income belongs to the partner maker.",
        ],
      },
      {
        title: "What you get",
        items: [
          "Your profile, a page for your works and a place in categories and search.",
          "On the 1st of each month we email you a report: how many people went from the site to your Instagram or Facebook.",
          "We do not promise sales, visits or any particular number of clicks. The report only shows what really happened.",
        ],
      },
      {
        title: "Ending it",
        text: [
          "You can write to us at any time and ask to cancel; we will promptly remove your profile. We may also remove a profile if these terms are broken or the work turns out not to be handmade.",
        ],
      },
      {
        title: "Your photos and texts",
        text: [
          "Your photos, texts and works stay yours. By listing, you allow us to show them on the site. When you cancel, they are removed too.",
        ],
      },
      {
        title: "Responsibility",
        text: [
          "khelovani.ge is only an introduction platform: we connect partner makers with buyers. We do not sell, make, ship or take back any work, and we take no part in any transaction.",
          "The partner maker is fully responsible for everything concerning their work: quality, price, ordering and payment, delivery and returns, and the accuracy of photos and descriptions. The partner maker confirms that they made the work themselves and that the photos are theirs. khelovani.ge accepts no responsibility for disputes or losses between a maker and a buyer; the partner maker settles such matters themselves.",
          "We are also not responsible for links or for third-party platforms (Instagram, Facebook).",
        ],
      },
      {
        title: "Changes",
        text: [
          "We may change these terms. The updated version will be published here with a new date, and existing partner makers will be told by email. A price change is announced in advance and does not take effect without your agreement.",
        ],
      },
    ],
    contactTitle: "Questions?",
    contactText: "Write to us and we will answer:",
  },
};
