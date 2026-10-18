// „გადამოწმებულია“: წრე ნიშნით (ბარათზე სახელის გვერდით და ხელოვანის გვერდზე). ხელით შემოწმებულია, რომ გვერდი ნამდვილია.
// წრე ტექსტის ფერისაა (currentColor), ნიშანი checkColor-ისა (ნაგულისხმევი: გვერდის ფონი; მუქ ბანერზე მუქი უნდა იყოს)
export default function VerifiedMark({ className = "", checkColor = "var(--bg)" }: { className?: string; checkColor?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <circle cx="12" cy="12" r="11" />
      <path d="m7.5 12.4 3 3 6-6.4" fill="none" stroke={checkColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
