import { createServerFn } from '@tanstack/react-start'
import { chat, streamToText } from '@tanstack/ai'
import { openaiText } from '@tanstack/ai-openai'
import type { StartupInput, ValuationResult, AIAnalysis } from '@/lib/valuation'
import { formatCurrency } from '@/lib/engine'

export const analyzeValuation = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { input: StartupInput; result: ValuationResult }) => data,
  )
  .handler(async ({ data }) => {
    const { input, result } = data

    const prompt = `You are a startup valuation analyst. Analyze this valuation and provide insights.

Startup: ${input.companyName}
Stage: ${input.stage}
Description: ${input.description}
Revenue: ${formatCurrency(input.revenue)}
Growth Rate: ${input.growthRate}%
EBITDA Margin: ${input.ebitdaMargin}%
Discount Rate: ${input.discountRate}%

Valuation Results:
- DCF: ${formatCurrency(result.dcf.value)}
- Revenue Multiple: ${formatCurrency(result.revenueMultiple.value)}
- Comparables: ${formatCurrency(result.comparables.value)}
- Blended: ${formatCurrency(result.blended)}
- Range: ${formatCurrency(result.range.low)} - ${formatCurrency(result.range.high)}

Respond with ONLY a JSON object (no markdown, no code blocks) in this exact format:
{"summary": "2-3 sentence summary", "assumptions": ["assumption 1", "assumption 2", "assumption 3"], "swot": {"strengths": ["strength 1", "strength 2"], "weaknesses": ["weakness 1", "weakness 2"], "opportunities": ["opportunity 1", "opportunity 2"], "threats": ["threat 1", "threat 2"]}, "investorPoints": ["point 1", "point 2", "point 3"]}`

    try {
      const stream = chat({
        adapter: openaiText('gpt-4.1-nano'),
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const fullContent = await streamToText(stream)

      if (!fullContent.trim()) {
        throw new Error('Empty response from AI')
      }

      // Clean up the response - remove markdown code blocks if present
      let cleanedContent = fullContent.trim()
      cleanedContent = cleanedContent.replace(/^```json\s*/i, '')
      cleanedContent = cleanedContent.replace(/^```\s*/i, '')
      cleanedContent = cleanedContent.replace(/\s*```$/i, '')

      // Parse the JSON response
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error(
          `No valid JSON found. Response was: ${cleanedContent.substring(0, 200)}`,
        )
      }

      const analysis: AIAnalysis = JSON.parse(jsonMatch[0])
      return { success: true, analysis }
    } catch (error) {
      console.error('AI analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  })
