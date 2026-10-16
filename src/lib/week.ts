// მიმდინარე კვირის ნომერი (1970-დან): „ხელოვანი კვირისა“ ამით იცვლება
export function currentWeek(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}
