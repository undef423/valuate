import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import {
  startupInputSchema,
  stages,
  defaultDiscountRates,
  type StartupInput,
  type Stage,
} from '@/lib/valuation'

type ValuationFormProps = {
  onSubmit: (data: StartupInput) => void
  defaultValues?: Partial<StartupInput>
}

export function ValuationForm({ onSubmit, defaultValues }: ValuationFormProps) {
  const form = useForm({
    defaultValues: {
      companyName: defaultValues?.companyName ?? '',
      stage: defaultValues?.stage ?? 'seed',
      revenue: defaultValues?.revenue ?? 1000000,
      growthRate: defaultValues?.growthRate ?? 50,
      ebitdaMargin: defaultValues?.ebitdaMargin ?? 20,
      discountRate: defaultValues?.discountRate ?? defaultDiscountRates['seed'],
      description: defaultValues?.description ?? '',
    } as StartupInput,
    validators: {
      onSubmit: ({ value }) => {
        const result = startupInputSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map((i) => i.message).join(', ')
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  // Update discount rate when stage changes
  const handleStageChange = (newStage: Stage) => {
    form.setFieldValue('stage', newStage)
    form.setFieldValue('discountRate', defaultDiscountRates[newStage])
  }

  return (
    <Card className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-5"
      >
        {/* Company Name */}
        <form.Field name="companyName">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Company Name</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Acme Inc."
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Stage */}
        <form.Field name="stage">
          {(field) => (
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select
                value={field.state.value}
                onValueChange={(v) => handleStageChange(v as Stage)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() +
                        stage.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        {/* Revenue */}
        <form.Field name="revenue">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>LTM Revenue ($)</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                min={0}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Growth Rate */}
        <form.Field name="growthRate">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Annual Growth Rate (%)</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* EBITDA Margin */}
        <form.Field name="ebitdaMargin">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>EBITDA Margin (%)</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Discount Rate */}
        <form.Field name="discountRate">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Discount Rate (%)</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                min={1}
                max={50}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor={field.name}>Describe Your Startup</Label>
              <Textarea
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Describe what your startup does, your target market, business model, and competitive advantages..."
                rows={4}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <Button type="submit" className="w-full" size="lg">
          Generate Valuation
        </Button>
      </form>
    </Card>
  )
}
