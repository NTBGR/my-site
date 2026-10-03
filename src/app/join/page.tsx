import Button from "@/components/ui/Button";

export const metadata = {
  title: "გახდი პარტნიორი",
};

const benefits = [
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
];

const steps = [
  "მოგვაწოდე სახელი, ქალაქი, მიმართულება და მოკლე ბიოგრაფია.",
  "გამოგვიგზავნე რამდენიმე ნამუშევარი და ინსტაგრამის ბმული.",
  "გადავამოწმებთ ინფორმაციას და გამოვაქვეყნებთ შენს პროფილს.",
];

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold text-[#2c2416] sm:text-4xl">
        გახდი პარტნიორი
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-[#5c5348]">
        ხარ მხატვარი, ფოტოგრაფი, ილუსტრატორი, კერამიკოსი ან სხვა მიმართულების
        ხელოვანი? შემოგვიერთდი და გახადე შენი შემოქმედება თვალსაჩინო.
      </p>

      <h2 className="mt-12 text-xl font-semibold text-[#2c2416]">რას მიიღებ</h2>
      <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {benefits.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-[#eadfd3] bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-[#2c2416]">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5c5348]">
              {item.text}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-semibold text-[#2c2416]">
        როგორ ხდება ჩართვა
      </h2>
      <ol className="mt-5 max-w-2xl list-decimal space-y-3 pl-5 leading-relaxed text-[#5c5348]">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="mt-8 max-w-2xl rounded-2xl border border-[#eadfd3] bg-[#fbf6f0] p-5">
        <p className="leading-relaxed text-[#5c5348]">
          განაცხადის ფორმა მალე დაემატება. ჯერ-ჯერობით საიტი დემო რეჟიმში
          მუშაობს, ამიტომ პროფილების გამოქვეყნება ჯერ არ არის შესაძლებელი.
        </p>
      </div>

      <div className="mt-8">
        <Button href="/artists" variant="secondary">
          ნახე არსებული პროფილები
        </Button>
      </div>
    </div>
  );
}
