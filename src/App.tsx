import { useEffect, useState, type FormEvent } from 'react'
import {
  applyDiscount,
  formatPrice,
  loadJson,
  subtotalOf,
  type CartLine,
  type Discounts,
  type Product,
} from './shop'

export function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [discounts, setDiscounts] = useState<Discounts>({})
  const [cart, setCart] = useState<CartLine[]>([])
  const [code, setCode] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  useEffect(() => {
    loadJson<Product[]>('/products.json').then(setProducts)
    loadJson<Discounts>('/discounts.json').then(setDiscounts)
  }, [])

  function addToCart(product: Product) {
    setCart((lines) => {
      const existing = lines.find((line) => line.product.id === product.id)
      if (!existing) return [...lines, { product, quantity: 1 }]
      return lines.map((line) => (line === existing ? { ...line, quantity: line.quantity + 1 } : line))
    })
  }

  function changeQuantity(id: string, delta: number) {
    setCart((lines) =>
      lines
        .map((line) => (line.product.id === id ? { ...line, quantity: line.quantity + delta } : line))
        .filter((line) => line.quantity > 0),
    )
  }

  function submitCode(event: FormEvent) {
    event.preventDefault()
    setAppliedCode(code)
  }

  const subtotal = subtotalOf(cart)
  const total = appliedCode ? applyDiscount(subtotal, discounts, appliedCode) : subtotal

  return (
    <div className="shop">
      <header className="shop-header">
        <span className="logo">Daily Grind</span>
        <span className="tagline">Specialty coffee, roasted every Monday</span>
      </header>

      <main className="shop-main">
        <section className="products">
          {products.map((product) => (
            <article key={product.id} className="product">
              <div className="product-art" data-origin={product.id} />
              <h2>{product.name}</h2>
              <p>{product.notes}</p>
              <div className="product-footer">
                <strong>{formatPrice(product.price)}</strong>
                <button type="button" onClick={() => addToCart(product)}>
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart">
          <h2>Your cart</h2>
          {cart.length === 0 ? (
            <p className="muted">Nothing here yet.</p>
          ) : (
            <ul className="cart-lines">
              {cart.map((line) => (
                <li key={line.product.id}>
                  <span>{line.product.name}</span>
                  <span className="quantity">
                    <button type="button" aria-label="Remove one" onClick={() => changeQuantity(line.product.id, -1)}>
                      −
                    </button>
                    {line.quantity}
                    <button type="button" aria-label="Add one" onClick={() => changeQuantity(line.product.id, 1)}>
                      +
                    </button>
                  </span>
                  <span>{formatPrice(line.product.price * line.quantity)}</span>
                </li>
              ))}
            </ul>
          )}

          <form className="discount" onSubmit={submitCode}>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Discount code"
              aria-label="Discount code"
            />
            <button type="submit" disabled={!code.trim()}>
              Apply
            </button>
          </form>

          <dl className="totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {appliedCode && (
              <div>
                <dt>Discount ({appliedCode.toUpperCase()})</dt>
                <dd>−{formatPrice(subtotal - total)}</dd>
              </div>
            )}
            <div className="total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <button type="button" className="checkout" disabled={cart.length === 0}>
            Checkout
          </button>
        </aside>
      </main>
    </div>
  )
}
