import type { Lang } from "@/lib/dictionary";

// კონფიდენციალურობის პოლიტიკა. ტექსტი აღწერს იმას, რასაც საიტი რეალურად აკეთებს:
// განაცხადის ფორმა (ტელეგრამი/ემაილი), გადასვლების ანონიმური დათვლა (Upstash), ქუქები.
// საიტის ქცევის შეცვლისას აქაც განაახლე და UPDATED თარიღი შეცვალე.
export const CONTACT_EMAIL = "khelovani.ge@gmail.com";

type Section = { title: string; text?: string[]; items?: string[] };

export const privacy: Record<
  Lang,
  { title: string; intro: string; updated: string; sections: Section[]; contactTitle: string; contactText: string }
> = {
  ka: {
    title: "კონფიდენციალურობა",
    intro: "მოკლედ და გასაგებად: რა ინფორმაციას ვაგროვებთ, რატომ და როგორ ვიყენებთ.",
    updated: "ბოლო განახლება: 4 ოქტომბერი, 2026",
    sections: [
      {
        title: "ვინ ვართ",
        text: [
          "„ხელოვანი“ ქართველი ხელოვანების ხელნაკეთ ნამუშევრებს ერთ სივრცეში აერთიანებს. საიტზე არაფერს ვყიდით და გადახდებს არ ვიღებთ: შეკვეთა ხდება პირდაპირ ავტორთან, მის ინსტაგრამზე ან ფეისბუქზე, სადაც ამ პლატფორმების წესები მოქმედებს.",
        ],
      },
      {
        title: "საიტის სტუმრები",
        text: [
          "სტუმრებს პერსონალურ ინფორმაციას არ ვთხოვთ. ვითვლით მხოლოდ იმას, რამდენი ადამიანი გადავიდა ჩვენი საიტიდან ხელოვანის ინსტაგრამზე ან ფეისბუქზე, რომ ხელოვანს ყოველთვიური რეპორტი გავუგზავნოთ.",
        ],
        items: [
          "შენს ბრაუზერს ენიჭება შემთხვევითი, ანონიმური კოდი (ქუქი), რომელიც შენს ვინაობას არ ავლენს.",
          "გადასვლისას 24 საათით ვინახავთ ამ კოდის დაშიფრულ ვერსიას (ჰეშს), რომ ერთი ადამიანი ერთ დღეში ორჯერ არ ჩავთვალოთ. თუ ქუქი დაბლოკილია, ამავე მიზნით გამოიყენება IP მისამართისა და ბრაუზერის ჰეში.",
          "მუდმივად ვინახავთ მხოლოდ ჯამურ რიცხვებს: რამდენი ადამიანი გადავიდა რომელი ხელოვანის გვერდზე თვის განმავლობაში. IP მისამართს არ ვინახავთ.",
        ],
      },
      {
        title: "ხელოვანები (განაცხადის ფორმა)",
        text: [
          "„გახდი პარტნიორი“ ფორმით ვიღებთ: სახელს და გვარს, ემაილს, ქალაქს, მიმართულებას, ინსტაგრამისა და ფეისბუქის ბმულებს, მოკლე ბიოგრაფიას და ნამუშევრების ფოტოებს. ამ ინფორმაციას ვიყენებთ განაცხადის განსახილველად, შენთან დასაკავშირებლად და პროფილის გამოსაქვეყნებლად.",
          "გამოქვეყნებულ პროფილზე საჯაროდ ჩანს სახელი, ქალაქი, მიმართულება, ბიოგრაფია, ნამუშევრები და სოციალური ქსელების ბმულები. ემაილი არასოდეს ქვეყნდება.",
        ],
      },
      {
        title: "ქუქები და ბრაუზერის მეხსიერება",
        items: [
          "vid: ანონიმური კოდი გადასვლების დასათვლელად (1 წელი).",
          "lang: არჩეული ენა (ქართული ან ინგლისური).",
          "theme: ღია ან მუქი თემა (ინახება მხოლოდ შენს ბრაუზერში).",
          "სარეკლამო ქუქებს და სხვა კომპანიების თვალთვალის ხელსაწყოებს არ ვიყენებთ.",
        ],
      },
      {
        title: "ვის ვუზიარებთ",
        items: [
          "ხელოვანს: მხოლოდ ჯამურ რიცხვებს (რამდენი ადამიანი გადავიდა მის გვერდზე), არასოდეს ვინაობას.",
          "Vercel: საიტის ჰოსტინგი. მისი ტექნიკური ჟურნალები შეიძლება IP მისამართს მოკლე ვადით შეიცავდეს.",
          "Upstash: გადასვლების რიცხვების შესანახად (სერვერი ევროკავშირში, ფრანკფურტში).",
          "Telegram და ემაილის სერვისი: განაცხადები ჩვენამდე ამ არხებით მოდის.",
          "მონაცემებს არავის ვყიდით.",
        ],
      },
      {
        title: "რამდენ ხანს ვინახავთ",
        items: [
          "გადასვლის ჰეში: 24 საათი.",
          "თვიური რიცხვები: სანამ საიტი მუშაობს (ხელოვანებთან ანგარიშისთვის).",
          "განაცხადი და პროფილი: სანამ პროფილი აქტიურია, ან სანამ წაშლას არ მოითხოვ.",
        ],
      },
      {
        title: "შენი უფლებები",
        text: [
          "შეგიძლია მოითხოვო ინფორმაცია იმის შესახებ, რა მონაცემები გვაქვს შენზე, მათი შესწორება ან წაშლა, მათ შორის პროფილის მოხსნა საიტიდან. მოგვწერე და რაც შეიძლება მალე გიპასუხებთ.",
          "თუ ფიქრობ, რომ შენი უფლებები დაირღვა, შეგიძლია მიმართო საქართველოს პერსონალურ მონაცემთა დაცვის სამსახურს.",
        ],
      },
      {
        title: "ცვლილებები",
        text: ["თუ ამ წესებს შევცვლით, განახლებული ვერსია აქ გამოქვეყნდება და ზემოთ თარიღიც შეიცვლება."],
      },
    ],
    contactTitle: "კონტაქტი",
    contactText: "კითხვების ან მოთხოვნებისთვის მოგვწერე:",
  },
  en: {
    title: "Privacy",
    intro: "In short and plainly: what we collect, why, and how we use it.",
    updated: "Last updated: 4 October 2026",
    sections: [
      {
        title: "Who we are",
        text: [
          "Khelovani brings handmade work by Georgian makers into one place. We don't sell anything or take payments: you order directly from the maker on their Instagram or Facebook, where those platforms' rules apply.",
        ],
      },
      {
        title: "Visitors",
        text: [
          "We don't ask visitors for personal information. We only count how many people go from our site to a maker's Instagram or Facebook, so we can send the maker a monthly report.",
        ],
        items: [
          "Your browser gets a random, anonymous code (a cookie) that does not reveal who you are.",
          "When you follow a link, we keep a scrambled version (hash) of that code for 24 hours so one person isn't counted twice in a day. If cookies are blocked, a hash of your IP address and browser is used for the same purpose.",
          "The only thing we keep long-term is totals: how many people went to each maker's page per month. We don't store IP addresses.",
        ],
      },
      {
        title: "Makers (application form)",
        text: [
          "Through the \"Become a partner\" form we receive your name, email, city, craft, Instagram and Facebook links, a short bio and photos of your work. We use this to review your application, contact you and publish your profile.",
          "A published profile shows your name, city, craft, bio, works and social links. Your email is never published.",
        ],
      },
      {
        title: "Cookies and browser storage",
        items: [
          "vid: anonymous code for counting visits to makers' pages (1 year).",
          "lang: your language choice (Georgian or English).",
          "theme: light or dark theme (stored only in your browser).",
          "We don't use advertising cookies or third-party trackers.",
        ],
      },
      {
        title: "Who we share it with",
        items: [
          "Makers: only totals (how many people went to their page), never identities.",
          "Vercel: hosts the site. Its technical logs may briefly contain IP addresses.",
          "Upstash: stores the visit counts (servers in the EU, Frankfurt).",
          "Telegram and an email service: applications reach us through these.",
          "We never sell data.",
        ],
      },
      {
        title: "How long we keep it",
        items: [
          "Visit hash: 24 hours.",
          "Monthly totals: while the site runs (for reporting to makers).",
          "Applications and profiles: while the profile is active, or until you ask us to delete it.",
        ],
      },
      {
        title: "Your rights",
        text: [
          "You can ask what data we hold about you, have it corrected or deleted, including removing your profile from the site. Write to us and we'll reply as soon as we can.",
          "If you believe your rights have been violated, you can contact the Personal Data Protection Service of Georgia.",
        ],
      },
      {
        title: "Changes",
        text: ["If we change these rules, the updated version will be published here and the date above will change."],
      },
    ],
    contactTitle: "Contact",
    contactText: "For questions or requests, write to us:",
  },
};
