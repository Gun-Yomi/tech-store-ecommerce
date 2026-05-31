export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function calculateDiscountPercent(price: number, salePrice?: number | null) {
  if (!salePrice || salePrice >= price) {
    return null;
  }

  return Math.round(((price - salePrice) / price) * 100);
}

export function toTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
