export const calculatePremiumMock = ({ planType, age, sumAssured, term, isSmoker = false }) => {
  const base = sumAssured * 0.002 * (1 + (age - 25) * 0.03) * (term / 20) * (isSmoker ? 1.25 : 1)
  const annual = Math.round(base)
  return {
    annual_premium: annual,
    monthly_premium: Math.round(annual / 12),
    quarterly_premium: Math.round(annual / 4),
    half_yearly_premium: Math.round(annual / 2),
    gst_amount: Math.round(annual * 0.18),
    total_with_gst: Math.round(annual * 1.18),
    plan_type: planType,
    sum_assured: sumAssured,
    term,
    age,
  }
}
