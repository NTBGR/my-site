import { NextResponse, type NextRequest } from "next/server";

const VISITOR_COOKIE = "vid";

// ყოველ ბრაუზერს ანონიმური შემთხვევითი კოდი (ქუქი), რომ გადასვლების დათვლისას
// ერთ IP-ზე მყოფი სხვადასხვა ადამიანი (მობილური ოპერატორები) ცალ-ცალკე ჩაითვალოს
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get(VISITOR_COOKIE)) {
    res.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      secure: req.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export const config = {
  // მხოლოდ გვერდებზე; სტატიკური ფაილები, სურათები და API არ გვჭირდება
  matcher: ["/((?!_next/|api/|go/|opengraph-image|icon|favicon|robots.txt).*)"],
};
