import type { Lang } from "@/lib/dictionary";
import { CONTACT_EMAIL } from "@/app/privacy/content";

// ხელოვანებთან თანამშრომლობის წესები და პირობები. მარტივი ენით დაწერილი პროექტი, იურისტს არ გადაუხედავს.
// ფასი: რეგისტრაცია და განთავსება სრულიად უფასოა (გადაწყვეტილება 2026-10-27). შეცვლისას აქაც და src/lib/dictionary.ts-შიც განაახლე.
export { CONTACT_EMAIL };
export const PRICE_GEL = 20;
// ვერსია (დაემთხვევა updated თარიღს): განაცხადთან ერთად ინახება, რომ ვიცოდეთ, რომელ ტექსტს დათანხმდა ხელოვანი. პირობების შეცვლისას განაახლე აქაც და updated-შიც
export const TERMS_VERSION = "2026-10-27";

type Section = { title: string; text?: string[]; items?: string[] };

export const terms: Record<
  Lang,
  { title: string; intro: string; updated: string; sections: Section[]; contactTitle: string; contactText: string }
> = {
  ka: {
    title: "წესები და პირობები",
    intro: "მოკლედ და გასაგებად: რა გვაქვს შეთანხმებული ხელოვანებთან, რა ღირს და როგორ წყდება თანამშრომლობა.",
    updated: "ბოლო განახლება: 27 ოქტომბერი, 2026",
    sections: [
      {
        title: "რას ვაკეთებთ",
        text: [
          "„ხელოვანი“ ქართველი ხელოვანების ხელნაკეთ ნამუშევრებს ერთ სივრცეში აერთიანებს. საიტზე არაფერს ვყიდით და გადახდებს არ ვიღებთ: მყიდველი ავტორის ინსტაგრამზე ან ფეისბუქზე გადადის და შეკვეთა პირდაპირ მასთან ხდება. ყიდვა-გაყიდვის მხარე ავტორი და მყიდველია, ჩვენ ამ გარიგებაში მონაწილე არ ვართ.",
        ],
      },
      {
        title: "ვის შეუძლია განთავსება",
        items: [
          "მხოლოდ ხელნაკეთ ნამუშევრებს ვაქვეყნებთ: ხელით ან ავტორის ორიგინალი ნახატით შექმნილს. ქარხნული ნაწარმი და გადაყიდვა არ გვაინტერესებს.",
          "ფოტოები და ტექსტები შენი უნდა იყოს, ან გქონდეს მათი გამოყენების უფლება.",
          "განაცხადში მითითებული ინფორმაცია (სახელი, ბმულები, ქალაქი) ზუსტი უნდა იყოს.",
          "გამოქვეყნებამდე განაცხადს ვამოწმებთ და უარის თქმის უფლებას ვიტოვებთ.",
        ],
      },
      {
        title: "ფასი",
        items: [
          "რეგისტრაცია და განთავსება სრულიად უფასოა, ვალდებულების გარეშე.",
          "გაყიდვებზე პროცენტს არ ვიღებთ: საიტზე გაყიდვა არ ხდება და ყველა შემოსავალი შენია.",
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
          "ნამუშევრის ხარისხზე, ფასზე, მიწოდებასა და დაბრუნებაზე პასუხისმგებელია ავტორი. საიტი გზას აჩვენებს და გარიგებაში არ მონაწილეობს. ბმულებისა და მესამე მხარის პლატფორმების (ინსტაგრამი, ფეისბუქი) მუშაობაზე პასუხს ვერ ვაგებთ.",
        ],
      },
      {
        title: "ცვლილებები",
        text: [
          "ამ პირობებს შეიძლება შევცვალოთ. განახლებულ ვერსიას აქ გამოვაქვეყნებთ და ზემოთ თარიღს შევცვლით, არსებულ ხელოვანებს კი იმეილით ვაცნობებთ. ფასის ცვლილებას წინასწარ ვაცნობებთ და ის არ ამოქმედდება შენი თანხმობის გარეშე.",
        ],
      },
    ],
    contactTitle: "კითხვა გაქვს?",
    contactText: "მოგვწერე და გიპასუხებთ:",
  },
  en: {
    title: "Terms",
    intro: "In short and plainly: what we agree with makers, what it costs and how it ends.",
    updated: "Last updated: 27 October 2026",
    sections: [
      {
        title: "What we do",
        text: [
          "Khelovani gathers Georgian handmade work in one place. We sell nothing and take no payments: the visitor goes to the maker's Instagram or Facebook and orders directly from them. The maker and the buyer are the parties to a sale; we are not part of it.",
        ],
      },
      {
        title: "Who can be listed",
        items: [
          "Only handmade work: made by hand or from the maker's original drawing. Factory goods and resale are not accepted.",
          "Photos and texts must be yours, or you must have the right to use them.",
          "The information in your application (name, links, city) must be accurate.",
          "We review every application before publishing and may decline it.",
        ],
      },
      {
        title: "Price",
        items: [
          "Signing up and listing is completely free, no strings attached.",
          "We take no commission: nothing is sold on the site, and all sales income is yours.",
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
          "The maker is responsible for the quality, price, delivery and returns of their work. The site only shows the way and takes no part in the sale. We are not responsible for links or for third-party platforms (Instagram, Facebook).",
        ],
      },
      {
        title: "Changes",
        text: [
          "We may change these terms. The updated version will be published here with a new date, and existing makers will be told by email. A price change is announced in advance and does not take effect without your agreement.",
        ],
      },
    ],
    contactTitle: "Questions?",
    contactText: "Write to us and we will answer:",
  },
};
