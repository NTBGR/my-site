// ფასის ტექსტი: „120 ₾“
export function formatPrice(price: number) {
  return `${price.toLocaleString("en-US")} ₾`;
}
