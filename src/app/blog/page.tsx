import Button from "@/components/ui/Button";

export const metadata = {
  title: "ბლოგა",
};

const topics = [
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
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold text-[#2c2416] sm:text-4xl">ბლოგა</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-[#5c5348]">
        აქ გამოქვეყნდება ისტორიები, ინტერვიუები და სასარგებლო მასალები ქართული
        ხელოვნების სამყაროდან. პირველი სტატიები მალე გამოჩნდება.
      </p>

      <h2 className="mt-12 text-xl font-semibold text-[#2c2416]">
        რას გამოაქვეყნებთ
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {topics.map((topic) => (
          <li
            key={topic.title}
            className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#2c2416]">{topic.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5c5348]">
              {topic.text}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <Button href="/artists" variant="secondary">
          გაეცანი ხელოვანებს
        </Button>
      </div>
    </div>
  );
}
