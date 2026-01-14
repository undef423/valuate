<p align="center">
  <img src="./src/logo.svg" alt="ValuAte Logo" width="120" height="120" />
</p>

<h1 align="center">ValuAte</h1>

<p align="center">
  <strong>AI-Powered Startup Valuation & Analysis Tool</strong>
</p>

<p align="center">
  Generate valuation ranges using multiple methods with AI-driven SWOT analysis and investor-ready explanations.
</p>

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [License](#license)

---

## 🎯 Overview

ValuAte helps early-stage founders and operators estimate startup valuation quickly and explain it clearly to investors. Unlike overly complex enterprise tools or simplistic calculators, ValuAte provides:

- **Multiple valuation methods** - DCF, Revenue Multiples, and Comparable Companies
- **AI-generated insights** - SWOT analysis and investor talking points
- **Instant results** - Generate valuations in under 3 minutes
- **No signup required** - Demo-ready without authentication

## ✨ Features

### 📊 Valuation Engine

ValuAte calculates startup valuations using three industry-standard methods:

| Method                         | Description                                                                   | Weight |
| ------------------------------ | ----------------------------------------------------------------------------- | ------ |
| **DCF (Discounted Cash Flow)** | 5-year revenue projection with EBITDA-based cash flows and 3% terminal growth | 40%    |
| **Revenue Multiple**           | Stage-based multiples (Pre-seed to Growth) with user override capability      | 30%    |
| **Comparable Companies**       | Sector-based median multiples from curated dataset                            | 30%    |

### 🤖 AI-Powered Analysis

Powered by [TanStack AI](https://tanstack.com/ai) and OpenAI, providing:

- **Valuation Summary** - Concise 30-60 word overview
- **Key Assumptions** - Transparent breakdown of calculation inputs
- **SWOT Analysis** - Strengths, Weaknesses, Opportunities, Threats
- **Investor Talking Points** - Pitch-ready insights

### 📝 Startup Input Form

Comprehensive input form with smart defaults:

- Company name & funding stage
- Last 12 months revenue
- Annual growth rate (%)
- EBITDA margin (%)
- Discount rate (stage-based defaults)
- Optional notes

### 📈 Results Dashboard

Clear, actionable output including:

- Blended valuation estimate
- Valuation range (low/high)
- Method-by-method breakdown
- Sensitivity analysis controls
- Export to PDF capability

## 🚀 Demo

> Generate a complete startup valuation in under **3 minutes** with demo data or your own inputs.

1. Visit the landing page
2. Click **"Try Demo"** or **"Create Valuation"**
3. Fill in startup metrics (or use defaults)
4. Click **"Generate Valuation"**
5. Explore results and adjust assumptions

## 🛠️ Tech Stack

- **TanStack Start**
- **TanStack Router**
- **TanStack Form**
- **TanStack AI**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Zod**

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended)
- **API Key** - OpenAI

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Environment Setup

Create a `.env` file with your API keys:

```env
OPENAI_API_KEY="your_openai_api_key"
```

### Development

```bash
# Start development server
pnpm dev

# Application runs at http://localhost:3000
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🏗️ Architecture

```
valuate/
├── src/
│   ├── api/              # API endpoints
│   │   └── analyze.ts    # AI analysis endpoint
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui primitives
│   │   ├── LandingPage.tsx
│   │   └── ValuationForm.tsx
│   ├── lib/              # Core logic
│   │   ├── engine.ts     # Valuation calculations
│   │   ├── valuation.ts  # Types & defaults
│   │   └── utils.ts      # Utilities
│   ├── routes/           # TanStack Router pages
│   │   ├── index.tsx     # Landing page route
│   │   └── valuation.tsx # Main valuation page
│   └── styles.css        # Global styles
├── docs/
│   └── PRD.md            # Product Requirements
└── public/               # Static assets
```

### Key Design Principles

1. **Pure valuation logic** - Calculations are isolated from UI, fully testable
2. **Type safety** - End-to-end TypeScript with Zod schemas
3. **AI as assistant** - AI explains results, never performs calculations
4. **Minimal state** - Form-driven, no global state management needed

## 📋 Valuation Methodology

### DCF (Discounted Cash Flow)

```
Valuation = Σ(Year 1-5 Cash Flows / (1 + Discount Rate)^Year) + Terminal Value PV
```

- Projects 5 years of revenue using growth rate
- Estimates cash flow using EBITDA margin
- Terminal value assumes 3% perpetual growth

### Revenue Multiple

```
Valuation = LTM Revenue × Stage Multiple
```

Default multiples by stage:
| Stage | Multiple |
|-------|----------|
| Pre-seed | 5x |
| Seed | 8x |
| Series A | 12x |
| Growth | 15x |

### Comparable Companies

```
Valuation = LTM Revenue × Sector Median Multiple
```

Sector multiples from curated dataset (SaaS, Fintech, E-commerce, Marketplace).

## 🎨 UI/UX Highlights

- **Responsive layout** - Mobile-friendly out of the box
- **Accessibility** - Built on Radix UI primitives
- **Instant feedback** - Real-time validation and updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using <a href="https://tanstack.com">TanStack</a>
</p>
