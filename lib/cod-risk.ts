export type RiskLevel = 'low' | 'medium' | 'high'

export type RiskResult = {
  level: RiskLevel
  reasons: string[]
}

export function evaluateCODRisk(params: {
  paymentMode: string
  totalAmount: number
  previousOrdersCount: number
  phone?: string | null
}): RiskResult {
  const reasons: string[] = []

  if (params.paymentMode === 'COD') {
    if (params.totalAmount >= 3000) {
      reasons.push('Very high COD order value')
    } else if (params.totalAmount >= 2000) {
      reasons.push('High COD order value')
    }

    if (!params.phone || params.phone.length < 10) {
      reasons.push('Invalid or missing phone')
    }

    if (params.previousOrdersCount >= 3) {
      reasons.push('Multiple previous COD orders from same phone')
    }
  }

  let level: RiskLevel = 'low'

  if (reasons.length >= 2) level = 'high'
  else if (reasons.length === 1) level = 'medium'

  return { level, reasons }
}
