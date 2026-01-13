import { z } from 'zod'

// Startup stages
export const stages = ['pre-seed', 'seed', 'series-a', 'growth'] as const
export type Stage = (typeof stages)[number]

// Default discount rates by stage
export const defaultDiscountRates: Record<Stage, number> = {
  'pre-seed': 40,
  seed: 35,
  'series-a': 25,
  growth: 15,
}

// Default revenue multiples by stage
export const defaultMultiples: Record<Stage, number> = {
  'pre-seed': 8,
  seed: 10,
  'series-a': 12,
  growth: 15,
}

// Input schema
export const startupInputSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  stage: z.enum(stages),
  revenue: z.number().min(0, 'Revenue must be positive'),
  growthRate: z
    .number()
    .min(-100)
    .max(1000, 'Growth rate must be between -100% and 1000%'),
  ebitdaMargin: z
    .number()
    .min(-100)
    .max(100, 'EBITDA margin must be between -100% and 100%'),
  discountRate: z
    .number()
    .min(1)
    .max(50, 'Discount rate must be between 1% and 50%'),
  description: z
    .string()
    .min(20, 'Please describe your startup (at least 20 characters)'),
})

export type StartupInput = z.infer<typeof startupInputSchema>

// Valuation result for a single method
export type MethodResult = {
  value: number
  label: string
  description: string
}

// Full valuation result
export type ValuationResult = {
  dcf: MethodResult
  revenueMultiple: MethodResult
  comparables: MethodResult
  blended: number
  range: {
    low: number
    high: number
  }
}

// AI analysis result
export type AIAnalysis = {
  summary: string
  assumptions: string[]
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  investorPoints: string[]
}
