export const CURRENCY_CONFIG = {
  code: "KES",
  symbol: "KSh",
  name: "Kenya Shilling",
  locale: "en-KE",
  decimals: 2,
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000000) {
    return `KSh ${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `KSh ${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and parse
  const cleaned = value.replace(/[KSh,\s]/g, "")
  return Number.parseFloat(cleaned) || 0
}

export const TAX_RATES = {
  VAT: 0.16, // 16% VAT in Kenya
  WITHHOLDING_TAX: 0.05, // 5% withholding tax
  SERVICE_CHARGE: 0.1, // 10% service charge
}
