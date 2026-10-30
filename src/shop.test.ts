import { describe, expect, it } from 'vitest'
import { applyDiscount, subtotalOf, type Discounts } from './shop'

const discounts: Discounts = {
  SAVE10: { code: 'SAVE10', percent: 10 },
}

describe('subtotalOf', () => {
  it('adds up every line', () => {
    const product = { id: 'a', name: 'A', notes: '', price: 1000 }
    expect(subtotalOf([{ product, quantity: 2 }])).toBe(2000)
  })
})

describe('applyDiscount', () => {
  it('takes the discount off the subtotal', () => {
    expect(applyDiscount(2000, discounts, 'SAVE10')).toBe(1800)
  })

  it('ignores case and surrounding spaces', () => {
    expect(applyDiscount(2000, discounts, '  save10 ')).toBe(1800)
  })

  it('leaves the subtotal unchanged for an unknown code', () => {
    expect(applyDiscount(2000, discounts, 'fdsafdsafd')).toBe(2000)
  })
})
