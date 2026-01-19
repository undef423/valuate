import { jsPDF } from 'jspdf'
import type { StartupInput, ValuationResult, AIAnalysis } from './valuation'

/**
 * Format a number as currency (USD)
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Generate and download a PDF report for the valuation
 */
export function exportValuationPdf(
  input: StartupInput,
  result: ValuationResult,
  analysis?: AIAnalysis | null,
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Helper to add text with word wrapping
  const addText = (
    text: string,
    fontSize: number,
    isBold = false,
    color: [number, number, number] = [0, 0, 0],
  ) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, contentWidth)
    doc.text(lines, margin, y)
    y += lines.length * fontSize * 0.4 + 2
  }

  // Helper to add a section header
  const addSectionHeader = (text: string) => {
    y += 6
    addText(text, 14, true, [60, 60, 60])
    y += 2
  }

  // Helper to add a horizontal line
  const addLine = () => {
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, y, pageWidth - margin, y)
    y += 4
  }

  // Helper to check if we need a new page
  const checkNewPage = (requiredSpace: number = 40) => {
    if (y > doc.internal.pageSize.getHeight() - requiredSpace) {
      doc.addPage()
      y = margin
    }
  }

  // =============================
  // HEADER
  // =============================
  doc.setFillColor(24, 24, 27) // zinc-900
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('ValuAte', margin, 18)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Startup Valuation Report', margin, 28)

  doc.setFontSize(9)
  doc.text(new Date().toLocaleDateString(), pageWidth - margin - 30, 18)

  y = 50

  // =============================
  // COMPANY INFO
  // =============================
  addText(input.companyName, 22, true)
  y += 2
  addText(input.description, 10, false, [100, 100, 100])
  y += 4

  // Stage and metrics in a compact format
  const stageLabel =
    input.stage.charAt(0).toUpperCase() + input.stage.slice(1).replace('-', ' ')
  addText(
    `Stage: ${stageLabel}  •  Revenue: ${formatCurrency(input.revenue)}  •  Growth: ${input.growthRate}%  •  EBITDA: ${input.ebitdaMargin}%`,
    9,
    false,
    [80, 80, 80],
  )

  addLine()

  // =============================
  // BLENDED VALUATION (Hero)
  // =============================
  y += 4
  doc.setFillColor(243, 244, 246) // gray-100
  doc.roundedRect(margin, y - 4, contentWidth, 32, 3, 3, 'F')

  doc.setTextColor(60, 60, 60)
  doc.setFontSize(10)
  doc.text('Blended Valuation', margin + 8, y + 6)

  doc.setTextColor(16, 185, 129) // emerald-500
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text(formatCurrency(result.blended), margin + 8, y + 20)

  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Range: ${formatCurrency(result.range.low)} – ${formatCurrency(result.range.high)}`,
    margin + 8,
    y + 26,
  )

  y += 38

  // =============================
  // VALUATION METHODS
  // =============================
  addSectionHeader('Valuation Methods')

  const methods = [
    {
      label: result.dcf.label,
      value: result.dcf.value,
      desc: result.dcf.description,
    },
    {
      label: result.revenueMultiple.label,
      value: result.revenueMultiple.value,
      desc: result.revenueMultiple.description,
    },
    {
      label: result.comparables.label,
      value: result.comparables.value,
      desc: result.comparables.description,
    },
  ]

  methods.forEach((method) => {
    checkNewPage(20)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(40, 40, 40)
    doc.text(method.label, margin, y)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(16, 185, 129)
    doc.text(formatCurrency(method.value), pageWidth - margin, y, {
      align: 'right',
    })

    y += 5
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(method.desc, margin, y)
    y += 8
  })

  // =============================
  // AI ANALYSIS (if available)
  // =============================
  if (analysis) {
    checkNewPage(60)
    addLine()
    addSectionHeader('AI Analysis')

    // Summary
    checkNewPage(30)
    addText('Summary', 11, true, [60, 60, 60])
    addText(analysis.summary, 9, false, [80, 80, 80])
    y += 4

    // Key Assumptions
    checkNewPage(30)
    addText('Key Assumptions', 11, true, [60, 60, 60])
    analysis.assumptions.forEach((assumption) => {
      checkNewPage(10)
      addText(`• ${assumption}`, 9, false, [80, 80, 80])
    })
    y += 4

    // SWOT Analysis
    checkNewPage(40)
    addText('SWOT Analysis', 11, true, [60, 60, 60])
    y += 2

    const swotItems = [
      {
        title: 'Strengths',
        items: analysis.swot.strengths,
        color: [22, 163, 74] as [number, number, number],
      },
      {
        title: 'Weaknesses',
        items: analysis.swot.weaknesses,
        color: [220, 38, 38] as [number, number, number],
      },
      {
        title: 'Opportunities',
        items: analysis.swot.opportunities,
        color: [37, 99, 235] as [number, number, number],
      },
      {
        title: 'Threats',
        items: analysis.swot.threats,
        color: [217, 119, 6] as [number, number, number],
      },
    ]

    swotItems.forEach((swot) => {
      checkNewPage(20)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...swot.color)
      doc.text(swot.title, margin, y)
      y += 5

      swot.items.forEach((item) => {
        checkNewPage(8)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 4)
        doc.text(lines, margin + 4, y)
        y += lines.length * 4 + 2
      })
      y += 3
    })

    // Investor Talking Points
    checkNewPage(30)
    addText('Investor Talking Points', 11, true, [60, 60, 60])
    analysis.investorPoints.forEach((point) => {
      checkNewPage(10)
      addText(`• ${point}`, 9, false, [80, 80, 80])
    })
  }

  // =============================
  // FOOTER
  // =============================
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Generated by ValuAte • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' },
    )
  }

  // =============================
  // DOWNLOAD
  // =============================
  const filename = `${input.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Valuation_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
