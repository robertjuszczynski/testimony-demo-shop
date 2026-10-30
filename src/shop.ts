export type Product = {
  id: string
  name: string
  notes: string
  price: number
}

export type Discount = {
  code: string
  percent: number
}

export type Discounts = Record<string, Discount>

export type CartLine = {
  product: Product
  quantity: number
}

export function subtotalOf(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
}

export function applyDiscount(subtotal: number, discounts: Discounts, code: string) {
  const discount = discounts[code.trim().toUpperCase()]
  return Math.round(subtotal * (1 - discount.percent / 100))
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) throw new Error(`Couldn't load ${path} (${response.status})`)
  return response.json()
}
