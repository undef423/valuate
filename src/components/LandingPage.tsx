import {
  IconCalculator,
  IconChartBar,
  IconFileText,
  IconSparkles,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const steps = [
  {
    number: '1',
    title: 'Enter metrics',
    description: 'Revenue, growth rate, stage',
  },
  {
    number: '2',
    title: 'Run analysis',
    description: 'Multiple valuation methods',
  },
  { number: '3', title: 'Get insights', description: 'AI-powered explanation' },
]

const features = [
  {
    icon: IconCalculator,
    title: 'Multiple Methods',
    description: 'DCF, revenue multiples, and comparable companies',
  },
  {
    icon: IconChartBar,
    title: 'Sensitivity Analysis',
    description: 'See how assumptions affect your valuation',
  },
  {
    icon: IconSparkles,
    title: 'AI Insights',
    description: 'SWOT analysis and investor talking points',
  },
  {
    icon: IconFileText,
    title: 'Export Ready',
    description: 'Download PDF for your pitch deck',
  },
]

export function LandingPage() {
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

      {/* Navbar */}
      <nav className="relative flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-xl font-semibold">ValuAte</span>
        <Button size="sm">Try Demo</Button>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-20 max-w-3xl mx-auto text-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

        <h1 className="relative text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Know your startup's worth
        </h1>
        <p className="relative text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Get a defensible valuation range in under 3 minutes. No signup
          required.
        </p>
        <Button size="lg" className="relative">
          Create Valuation
        </Button>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                {step.number}
              </div>
              <h3 className="font-medium mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-10">
          What you get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="p-5">
              <feature.icon className="size-5 text-primary mb-3" />
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-16 max-w-3xl mx-auto text-center border-t border-border">
        <h2 className="text-2xl font-semibold mb-3">
          Ready to value your startup?
        </h2>
        <p className="text-muted-foreground mb-6">
          No account needed. Results in minutes.
        </p>
        <Button size="lg">Get Started</Button>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-muted-foreground">
        <p>
          ValuAte. Built for founders, by{' '}
          <a
            href="https://github.com/undef423"
            target="_blank"
            className="font-bold"
          >
            Prabu
          </a>
        </p>
      </footer>
    </div>
  )
}
