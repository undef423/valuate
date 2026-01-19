import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ValuationForm } from '@/components/ValuationForm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  IconArrowLeft,
  IconDownload,
  IconSparkles,
  IconLoader2,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import type { StartupInput, ValuationResult, AIAnalysis } from '@/lib/valuation'
import { calculateValuation, formatCurrency } from '@/lib/engine'
import { analyzeValuation } from '@/api/analyze'
import { exportValuationPdf } from '@/lib/exportPdf'

export const Route = createFileRoute('/valuation')({
  component: ValuationPage,
})

function ValuationPage() {
  const [input, setInput] = useState<StartupInput | null>(null)
  const [result, setResult] = useState<ValuationResult | null>(null)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const handleSubmit = (data: StartupInput) => {
    setInput(data)
    const valuation = calculateValuation(data)
    setResult(valuation)
    setAnalysis(null)
    setAnalysisError(null)
  }

  const handleAnalyze = async () => {
    if (!input || !result) return

    setAnalysisLoading(true)
    setAnalysisError(null)

    try {
      const response = await analyzeValuation({ data: { input, result } })
      if (response.success && response.analysis) {
        setAnalysis(response.analysis)
      } else {
        setAnalysisError(response.error || 'Failed to generate analysis')
      }
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handleReset = () => {
    setInput(null)
    setResult(null)
    setAnalysis(null)
    setAnalysisError(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header */}
      <header className="relative border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            ValuAte
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <IconArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div>
            <h1 className="text-2xl font-bold mb-6">
              {result ? input?.companyName : 'Enter Startup Details'}
            </h1>
            <ValuationForm
              onSubmit={handleSubmit}
              defaultValues={input ?? undefined}
            />
          </div>

          {/* Right: Results */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Blended Valuation */}
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">
                    Blended Valuation
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {formatCurrency(result.blended)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Range: {formatCurrency(result.range.low)} –{' '}
                    {formatCurrency(result.range.high)}
                  </p>
                </Card>

                {/* Method Breakdown */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">By Method</h2>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{result.dcf.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.dcf.description}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatCurrency(result.dcf.value)}
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {result.revenueMultiple.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.revenueMultiple.description}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatCurrency(result.revenueMultiple.value)}
                      </p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {result.comparables.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.comparables.description}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        {formatCurrency(result.comparables.value)}
                      </p>
                    </div>
                  </Card>
                </div>

                {/* AI Analysis */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <IconSparkles className="size-5 text-primary" />
                      AI Insights
                    </h2>
                    {!analysis && (
                      <Button
                        size="sm"
                        onClick={handleAnalyze}
                        disabled={analysisLoading}
                      >
                        {analysisLoading ? (
                          <>
                            <IconLoader2 className="size-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          'Generate Insights'
                        )}
                      </Button>
                    )}
                  </div>

                  {analysisError && (
                    <Card className="p-4 border-destructive/50 bg-destructive/5">
                      <p className="text-sm text-destructive">
                        {analysisError}
                      </p>
                    </Card>
                  )}

                  {analysis && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <Card className="p-4">
                        <p className="text-sm font-medium mb-2">Summary</p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.summary}
                        </p>
                      </Card>

                      {/* Key Assumptions */}
                      <Card className="p-4">
                        <p className="text-sm font-medium mb-2">
                          Key Assumptions
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {analysis.assumptions.map((a, i) => (
                            <li key={i}>• {a}</li>
                          ))}
                        </ul>
                      </Card>

                      {/* SWOT */}
                      <div className="grid grid-cols-2 gap-3">
                        <Card className="p-3">
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                            Strengths
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {analysis.swot.strengths.map((s, i) => (
                              <li key={i}>• {s}</li>
                            ))}
                          </ul>
                        </Card>
                        <Card className="p-3">
                          <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                            Weaknesses
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {analysis.swot.weaknesses.map((w, i) => (
                              <li key={i}>• {w}</li>
                            ))}
                          </ul>
                        </Card>
                        <Card className="p-3">
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                            Opportunities
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {analysis.swot.opportunities.map((o, i) => (
                              <li key={i}>• {o}</li>
                            ))}
                          </ul>
                        </Card>
                        <Card className="p-3">
                          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                            Threats
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {analysis.swot.threats.map((t, i) => (
                              <li key={i}>• {t}</li>
                            ))}
                          </ul>
                        </Card>
                      </div>

                      {/* Investor Talking Points */}
                      <Card className="p-4">
                        <p className="text-sm font-medium mb-2">
                          Investor Talking Points
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {analysis.investorPoints.map((p, i) => (
                            <li key={i}>• {p}</li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleReset}>
                    Start Over
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (input && result) {
                        exportValuationPdf(input, result, analysis)
                      }
                    }}
                  >
                    <IconDownload className="size-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg mb-2">No valuation yet</p>
                  <p className="text-sm">
                    Fill in the form to generate your valuation
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
