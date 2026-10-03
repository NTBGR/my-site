export type Lang = "ka" | "en";

export const LANG_COOKIE = "lang";

const ka = {
  meta: {
    title: "ხელოვანი",
    description:
      "ქართველი ხელოვანების ხელნაკეთი ნივთების მაღაზია — იპოვე ნამუშევრები და შემოქმედები.",
  },
  nav: {
    artists: "ხელოვანები",
    categories: "კატეგორიები",
    blog: "ბლოგი",
    favorites: "რჩეულები",
    join: "გახდი პარტნიორი",
    search: "ძებნა...",
    searchLabel: "ძებნა",
    menu: "მენიუ",
    menuClose: "მენიუს დახურვა",
    main: "მთავარი",
    mobile: "მობილური",
    theme: "თემის შეცვლა",
    language: "Switch to English",
    languageShort: "EN",
  },
  footer: {
    learnMore: "გაიგე მეტი",
    help: "დახმარება",
    social: "სოციალური ქსელები",
    about: "ჩვენ შესახებ",
    howItWorks: "როგორ მუშაობს",
    faq: "კითხვები",
    contact: "კონტაქტი",
    privacy: "კონფიდენციალურობა",
    terms: "გამოყენების პირობები",
    takedown: "ამოშლის მოთხოვნა",
    instagram: "ინსტაგრამი",
    facebook: "ფეისბუქი",
    copyright: "© 2026 ხელოვანი",
    tagline: "ქართველი ხელოვანების ხელნაკეთი ნივთები ერთ სივრცეში.",
  },
  home: {
    badge: "ხელნაკეთი საქართველოდან",
    title: "ხელნაკეთი ნივთები ერთ სივრცეში",
    text: "ქართველი ხელოვანების ნახატები, კერამიკა, სამკაული და დეკორი.",
    ctaPrimary: "დაათვალიერე კატეგორიები",
    ctaSecondary: "გაიცანი ხელოვანები",
    perks: ["ხელნაკეთი", "უნიკალური", "პირდაპირ ავტორისგან"],
    categoriesTitle: "აღმოაჩინე კატეგორიით",
    allCategories: "ყველა კატეგორია",
    browse: "დაათვალიერე",
    banners: [
      { slug: "keramika", title: "კერამიკა და ჭურჭელი", text: "ხელნაკეთი თასები, ლანგრები და ვაზები." },
      { slug: "nakhatebi", title: "ნახატები", text: "ორიგინალი ნამუშევრები ქართველი მხატვრებისგან." },
      { slug: "samkauli", title: "სამკაული", text: "ვერცხლი, ოქრო და ქვები, ხელით დამუშავებული." },
    ],
    prev: "წინა",
    next: "შემდეგი",
    featured: "ხელოვანები, რომლებიც გვიყვარს",
    fullList: "სრული სია",
    how: "როგორ მუშაობს",
    howText: "",
    steps: [
      {
        title: "აირჩიე ნივთი",
        text: "კატეგორიით ან ავტორით.",
      },
      {
        title: "გაიცანი ავტორი",
        text: "ბიოგრაფია და ნამუშევრები.",
      },
      {
        title: "დაუკავშირდი",
        text: "პირდაპირ ინსტაგრამზე.",
      },
    ],
    bannerTitle: "ხარ შემოქმედი?",
    bannerText: "გახადე შენი ნამუშევრები თვალსაჩინო.",
  },
  artists: {
    title: "ხელოვანები",
    text: "ადამიანები, რომლებიც ქმნიან.",
    allCities: "ყველა ქალაქი",
    emptyCity: "ამ ქალაქში ხელოვანი ვერ მოიძებნა.",
  },
  artist: {
    notFoundTitle: "ხელოვანი ვერ მოიძებნა",
    notFoundText: "ამ მისამართზე პროფილი არ არსებობს. სცადე სიიდან არჩევა.",
    list: "ხელოვანების სია",
    back: "← ყველა ხელოვანი",
    instagram: "ინსტაგრამი",
    works: "ნამუშევრები",
  },
  categories: {
    title: "კატეგორიები",
    text: "აირჩიე კატეგორია.",
    back: "← ყველა კატეგორია",
    empty: "ამ კატეგორიაში ნივთები ჯერ არ არის.",
    count: (n: number) => `${n} ხელოვანი`,
  },
  blog: {
    title: "ბლოგი",
    text: "ისტორიები და ინტერვიუები ქართული ხელოვნების სამყაროდან. პირველი სტატიები მალე გამოჩნდება.",
    topicsTitle: "რას გამოაქვეყნებთ",
    topics: [
      {
        title: "ინტერვიუები ხელოვანებთან",
        text: "საუბრები მხატვრებთან, ფოტოგრაფებთან და ხელოსნებთან მათ გზაზე, შთაგონებასა და სამუშაო პროცესზე.",
      },
      {
        title: "ხელოვნება და ქალაქი",
        text: "თბილისიდან თელავამდე: სად იქმნება თანამედროვე ქართული ხელოვნება და სად შეიძლება მისი ნახვა.",
      },
      {
        title: "რჩევები დამწყებებისთვის",
        text: "როგორ წარადგინო ნამუშევრები, როგორ შექმნა პორტფოლიო და როგორ მიაღწიო იმ ადამიანებამდე, ვისაც შენი ნამუშევრები აინტერესებს.",
      },
    ],
    cta: "გაეცანი ხელოვანებს",
  },
  join: {
    title: "გახდი პარტნიორი",
    text: "შემოგვიერთდი და გახადე შენი ნამუშევრები თვალსაჩინო.",
    benefitsTitle: "რას მიიღებ",
    benefits: [
      {
        title: "საკუთარი პროფილი",
        text: "შენი სახელი, ქალაქი, მიმართულება და მოკლე ბიოგრაფია ერთ გვერდზე.",
      },
      {
        title: "ნამუშევრების გალერეა",
        text: "აჩვენე საუკეთესო ნამუშევრები იმ ადამიანებს, ვინც ქართულ ხელოვნებას ეძებს.",
      },
      {
        title: "პირდაპირი კავშირი",
        text: "დაინტერესებული ადამიანი შენს ინსტაგრამ გვერდზე გადავა და უშუალოდ დაგიკავშირდება.",
      },
    ],
    stepsTitle: "როგორ ხდება ჩართვა",
    steps: [
      "მოგვაწოდე სახელი, ქალაქი, მიმართულება და მოკლე ბიოგრაფია.",
      "გამოგვიგზავნე რამდენიმე ნამუშევარი და ინსტაგრამის ბმული.",
      "გადავამოწმებთ ინფორმაციას და გამოვაქვეყნებთ შენს პროფილს.",
    ],
    existing: "ნახე არსებული პროფილები",
  },
  form: {
    open: "შეავსე განაცხადი",
    name: "სახელი და გვარი *",
    email: "ემაილი *",
    city: "ქალაქი *",
    category: "მიმართულება *",
    categoryPlaceholder: "მაგ. მხატვარი, ფოტოგრაფი",
    instagram: "ინსტაგრამის ბმული",
    bio: "მოკლე ბიოგრაფია *",
    works: "ნამუშევრები",
    worksHint: (n: number) =>
      `მაქსიმუმ ${n} ფოტო (JPG, PNG, WEBP), ჯამში 4MB-მდე.`,
    submit: "გაგზავნა",
    sending: "იგზავნება...",
    thanksTitle: "გმადლობთ!",
    thanksText:
      "განაცხადი მივიღეთ. ინფორმაციას გადავამოწმებთ და მალე დაგიკავშირდებით.",
    errors: {
      required: "შეავსე ყველა სავალდებულო ველი.",
      email: "ემაილის მისამართი არასწორია.",
      tooMany: (n: number) => `მაქსიმუმ ${n} ფოტოს ატვირთვაა შესაძლებელი.`,
      type: "დაშვებულია მხოლოდ JPG, PNG ან WEBP ფორმატი.",
      size: "ფოტოების ჯამური ზომა 4MB-ს არ უნდა აღემატებოდეს.",
      unavailable: "გაგზავნა დროებით შეუძლებელია. სცადე მოგვიანებით.",
      failed: "გაგზავნა ვერ მოხერხდა. სცადე მოგვიანებით.",
      network: "კავშირის შეცდომა. შეამოწმე ინტერნეტი და სცადე თავიდან.",
    },
  },
};

type Dict = typeof ka;

const en: Dict = {
  meta: {
    title: "Khelovani",
    description:
      "A shop for handmade goods by Georgian artists — discover works and the makers behind them.",
  },
  nav: {
    artists: "Artists",
    categories: "Categories",
    blog: "Blog",
    favorites: "Favorites",
    join: "Become a partner",
    search: "Search...",
    searchLabel: "Search",
    menu: "Menu",
    menuClose: "Close menu",
    main: "Main",
    mobile: "Mobile",
    theme: "Toggle theme",
    language: "გადართვა ქართულზე",
    languageShort: "KA",
  },
  footer: {
    learnMore: "Learn more",
    help: "Help",
    social: "Social media",
    about: "About us",
    howItWorks: "How it works",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms of use",
    takedown: "Takedown request",
    instagram: "Instagram",
    facebook: "Facebook",
    copyright: "© 2026 Khelovani",
    tagline: "Handmade goods by Georgian artists, all in one place.",
  },
  home: {
    badge: "Handmade in Georgia",
    title: "Handmade goods in one place",
    text: "Paintings, ceramics, jewelry and decor by Georgian artists.",
    ctaPrimary: "Browse categories",
    ctaSecondary: "Meet the artists",
    perks: ["Handmade", "One of a kind", "Straight from the maker"],
    categoriesTitle: "Shop by category",
    allCategories: "All categories",
    browse: "Browse",
    banners: [
      { slug: "keramika", title: "Ceramics & tableware", text: "Handmade bowls, platters and vases." },
      { slug: "nakhatebi", title: "Paintings", text: "Original works by Georgian painters." },
      { slug: "samkauli", title: "Jewelry", text: "Silver, gold and gemstones, worked by hand." },
    ],
    prev: "Previous",
    next: "Next",
    featured: "Artists we love",
    fullList: "Full list",
    how: "How it works",
    howText: "",
    steps: [
      {
        title: "Pick a piece",
        text: "By category or by maker.",
      },
      {
        title: "Meet the maker",
        text: "Bio and works in one place.",
      },
      {
        title: "Get in touch",
        text: "Directly on Instagram.",
      },
    ],
    bannerTitle: "Are you a maker?",
    bannerText: "Put your work in front of the right people.",
  },
  artists: {
    title: "Artists",
    text: "The people who make things.",
    allCities: "All cities",
    emptyCity: "No artists found in this city.",
  },
  artist: {
    notFoundTitle: "Artist not found",
    notFoundText: "There is no profile at this address. Try choosing from the list.",
    list: "Artist list",
    back: "← All artists",
    instagram: "Instagram",
    works: "Works",
  },
  categories: {
    title: "Categories",
    text: "Pick a category.",
    back: "← All categories",
    empty: "There are no items in this category yet.",
    count: (n: number) => `${n} ${n === 1 ? "artist" : "artists"}`,
  },
  blog: {
    title: "Blog",
    text: "Stories and interviews from the world of Georgian art. First articles coming soon.",
    topicsTitle: "What we will publish",
    topics: [
      {
        title: "Interviews with artists",
        text: "Conversations with painters, photographers and craftspeople about their path, inspiration and process.",
      },
      {
        title: "Art and the city",
        text: "From Tbilisi to Telavi: where contemporary Georgian art is made and where you can see it.",
      },
      {
        title: "Tips for beginners",
        text: "How to present your work, build a portfolio and reach people who are interested in what you make.",
      },
    ],
    cta: "Meet the artists",
  },
  join: {
    title: "Become a partner",
    text: "Join us and make your work visible.",
    benefitsTitle: "What you get",
    benefits: [
      {
        title: "Your own profile",
        text: "Your name, city, category and a short bio on one page.",
      },
      {
        title: "A gallery of works",
        text: "Show your best work to people looking for Georgian art.",
      },
      {
        title: "Direct contact",
        text: "Interested people go to your Instagram page and contact you directly.",
      },
    ],
    stepsTitle: "How joining works",
    steps: [
      "Send us your name, city, category and a short bio.",
      "Send a few works and your Instagram link.",
      "We review the information and publish your profile.",
    ],
    existing: "See existing profiles",
  },
  form: {
    open: "Fill in the application",
    name: "Full name *",
    email: "Email *",
    city: "City *",
    category: "Category *",
    categoryPlaceholder: "e.g. painter, photographer",
    instagram: "Instagram link",
    bio: "Short bio *",
    works: "Works",
    worksHint: (n: number) =>
      `Up to ${n} photos (JPG, PNG, WEBP), 4MB in total.`,
    submit: "Send",
    sending: "Sending...",
    thanksTitle: "Thank you!",
    thanksText:
      "We received your application. We will review it and get back to you soon.",
    errors: {
      required: "Please fill in all required fields.",
      email: "The email address is invalid.",
      tooMany: (n: number) => `You can upload up to ${n} photos.`,
      type: "Only JPG, PNG or WEBP files are allowed.",
      size: "The total size of the photos must not exceed 4MB.",
      unavailable: "Sending is temporarily unavailable. Please try again later.",
      failed: "Sending failed. Please try again later.",
      network: "Connection error. Check your internet and try again.",
    },
  },
};

export const dictionary: Record<Lang, Dict> = { ka, en };

export function normalizeLang(value: string | undefined | null): Lang {
  return value === "en" ? "en" : "ka";
}
