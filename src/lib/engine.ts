import type { StartupInput, ValuationResult, MethodResult } from './valuation'
import { defaultMultiples } from './valuation'

// Mocked comparable company multiples by sector (simplified)
const comparableMultiples: Record<string, number> = {
  default: 8,
  saas: 12,
  fintech: 10,
  ecommerce: 6,
  marketplace: 9,
}

/**
 * Calculate DCF (Discounted Cash Flow) valuation
 * Simplified: 5-year projection + terminal value
 */
export function calculateDCF(input: StartupInput): MethodResult {
  const { revenue, growthRate, ebitdaMargin, discountRate } = input

  // Project 5 years of cash flows
  let totalPV = 0
  let projectedRevenue = revenue

  for (let year = 1; year <= 5; year++) {
    projectedRevenue *= 1 + growthRate / 100
    const cashFlow = projectedRevenue * (ebitdaMargin / 100)
    const discountFactor = Math.pow(1 + discountRate / 100, year)
    totalPV += cashFlow / discountFactor
  }

  // Terminal value (assumes 3% perpetual growth)
  const terminalGrowth = 0.03
  const year5CashFlow = projectedRevenue * (ebitdaMargin / 100)
  const terminalValue =
    (year5CashFlow * (1 + terminalGrowth)) /
    (discountRate / 100 - terminalGrowth)
  const terminalPV = terminalValue / Math.pow(1 + discountRate / 100, 5)

  const value = Math.max(0, totalPV + terminalPV)

  return {
    value,
    label: 'DCF',
    description: `5-year projection with ${discountRate}% discount rate and 3% terminal growth`,
  }
}

/**
 * Calculate Revenue Multiple valuation
 */
export function calculateRevenueMultiple(input: StartupInput): MethodResult {
  const { revenue, stage } = input
  const multiple = defaultMultiples[stage]
  const value = revenue * multiple

  return {
    value,
    label: 'Revenue Multiple',
    description: `${multiple}x revenue multiple (${stage} stage typical)`,
  }
}

/**
 * Calculate Comparable Companies valuation
 * Uses mocked sector data with median multiples
 */
export function calculateComparables(input: StartupInput): MethodResult {
  const { revenue } = input
  // For MVP, use default multiple (would normally parse notes for sector)
  const multiple = comparableMultiples.default
  const value = revenue * multiple

  return {
    value,
    label: 'Comparables',
    description: `${multiple}x median multiple from comparable companies`,
  }
}

/**
 * Calculate blended valuation from all methods
 * Weights: 40% DCF, 30% Revenue Multiple, 30% Comparables
 */
export function calculateValuation(input: StartupInput): ValuationResult {
  const dcf = calculateDCF(input)
  const revenueMultiple = calculateRevenueMultiple(input)
  const comparables = calculateComparables(input)

  // Weighted average
  const blended =
    dcf.value * 0.4 + revenueMultiple.value * 0.3 + comparables.value * 0.3

  // Range: min/max of all methods with 20% buffer
  const allValues = [dcf.value, revenueMultiple.value, comparables.value]
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)

  return {
    dcf,
    revenueMultiple,
    comparables,
    blended,
    range: {
      low: minVal * 0.8,
      high: maxVal * 1.2,
    },
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}
