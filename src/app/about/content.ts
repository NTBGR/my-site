import type { Lang } from "@/lib/dictionary";

// „ჩვენ შესახებ“ გვერდის ტექსტი. ისტორია განზრახ არ შეიცავს გამოგონილ სახელებს, თარიღებს ან ციფრებს:
// როცა რეალური დეტალები გექნება (დამფუძნებელი, პირველი ხელოვანები), აქ ჩაამატე.
type Principle = { title: string; text: string };

export const about: Record<
  Lang,
  {
    title: string;
    intro: string;
    badge: string;
    storyTitle: string;
    story: string[];
    principlesTitle: string;
    principles: Principle[];
    closing: string;
    browse: string;
    contact: string;
  }
> = {
  ka: {
    title: "ჩვენ შესახებ",
    intro: "ქართული ხელნაკეთი ერთ სივრცეში, რომ კარგი ნამუშევარი ინსტაგრამის ხმაურში არ დაიკარგოს.",
    badge: "ხელით შექმნილი საქართველოში",
    storyTitle: "ჩვენი ისტორია",
    story: [
      "ყველაფერი მარტივი დაკვირვებით დაიწყო. საქართველოში უამრავი ადამიანი ქმნის რაღაც განსაკუთრებულს: თიხის თასებს, ვერცხლის სამკაულს, ნაქარგ ქსოვილს, ხის კოვზებს, ნახატებს. მათი უმეტესობა ნამუშევრებს ინსტაგრამზე ყიდის, თავისი ხელით, ხშირად სამსახურის შემდეგ, საღამოობით.",
      "მაგრამ მათი პოვნა ძნელია. გინდა ხელნაკეთი საჩუქარი ან ნივთი სახლისთვის და საათობით ფურცლავ ჰეშთეგებს, მეგობრებს ეკითხები, ბოლოს კი მაღაზიაში ყიდულობ იმას, რაც ყველას აქვს. ხელოვანი კი იმავდროულად ფიქრობს, ვინ დაინახავს მის ნამუშევარს, როცა ალგორითმი დიდ ბრენდებს უწყობს ხელს.",
      "„ხელოვანი“ ამ ორ ადამიანს ერთმანეთთან აკავშირებს. ქართველ ოსტატებს ერთ სივრცეში ვაგროვებთ და კატეგორიებად ვალაგებთ, რომ საჭირო ადვილად იპოვო. ყიდვა კი ისევ პირდაპირ ავტორთან ხდება, მის ინსტაგრამზე ან ფეისბუქზე. ჩვენ შუაში არ ვდგავართ, უბრალოდ გზას ვაჩვენებთ.",
    ],
    principlesTitle: "რისი გვჯერა",
    principles: [
      {
        title: "მხოლოდ ხელნაკეთი",
        text: "ყველა ნამუშევარი ადამიანის ხელით ან მისი ორიგინალი ნახატით არის შექმნილი. ქარხნული ნაწარმი და გადაყიდვა აქ არ არის.",
      },
      {
        title: "პირდაპირ ავტორთან",
        text: "შეკვეთა ავტორთან ხდება. შეგიძლია ყველაფერი ჰკითხო და ხშირად შენთვის სასურველი ზომით ან ფერით შეუკვეთო.",
      },
      {
        title: "გამჭვირვალობა",
        text: "ყოველ ხელოვანს ყოველთვიურად ვუგზავნით, რამდენი ადამიანი მივიყვანეთ მის გვერდზე. ლამაზი სიტყვების ნაცვლად, რიცხვები.",
      },
      {
        title: "ქართული ხელობის მხარდაჭერა",
        text: "ყოველი შეკვეთა პირდაპირ ოსტატს ეხმარება, რომ განაგრძოს ის, რაც უყვარს და რაც კარგად გამოსდის.",
      },
    ],
    closing: "გვჯერა, რომ ხელით შექმნილ ნივთს ისტორია აქვს, და ეს ისტორია მის ავტორთან იწყება.",
    browse: "დაათვალიერე ნამუშევრები",
    contact: "კითხვა ან იდეა გაქვს? მოგვწერე:",
  },
  en: {
    title: "About us",
    intro: "Georgian handmade work in one place, so good work doesn't get lost in the Instagram noise.",
    badge: "Made by hand in Georgia",
    storyTitle: "Our story",
    story: [
      "It started with a simple observation. Across Georgia, lots of people make something special: clay bowls, silver jewelry, embroidered textiles, wooden spoons, paintings. Most of them sell on Instagram, by themselves, often in the evenings after work.",
      "But they're hard to find. You want a handmade gift or something for your home, and you spend hours scrolling hashtags and asking friends, only to end up buying what everyone else has. Meanwhile the maker wonders who will ever see their work when the algorithm favours big brands.",
      "Khelovani connects these two people. We bring Georgian makers together in one place and sort them by category so you can find what you need. Buying still happens directly with the maker, on their Instagram or Facebook. We don't stand in between; we just show the way.",
    ],
    principlesTitle: "What we believe in",
    principles: [
      {
        title: "Handmade only",
        text: "Every piece is made by a person's hands or from their original artwork. No factory goods, no reselling.",
      },
      {
        title: "Straight from the maker",
        text: "You order from the maker. Ask them anything, and often order in the size or colour you want.",
      },
      {
        title: "Transparency",
        text: "Every month we tell each maker how many people we sent to their page. Numbers instead of nice words.",
      },
      {
        title: "Supporting Georgian craft",
        text: "Every order directly helps a maker keep doing what they love and do well.",
      },
    ],
    closing: "We believe a handmade object has a story, and that story starts with its maker.",
    browse: "Browse the work",
    contact: "Have a question or an idea? Write to us:",
  },
};
