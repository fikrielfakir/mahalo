export function formatPrice(price, fallback = null) {
  if (!price) return fallback
  const num = parseFloat(price)
  if (isNaN(num) || num <= 0) return fallback
  return num.toLocaleString('en-US') + ' MAD'
}

export function formatPriceWithRent(price, isRent) {
  if (!price) return null
  const num = parseFloat(price)
  if (isNaN(num) || num <= 0) return null
  const formatted = num.toLocaleString('en-US') + ' MAD'
  return isRent ? formatted + '/mo' : formatted
}
