import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShield, FiTrendingUp, FiHeart, FiSunrise, FiPrinter,
  FiShare2, FiCheck, FiLoader, FiChevronRight } from 'react-icons/fi'
import { calculatePremium } from '../services/api'
import { toast } from 'react-toastify'

const planTypes = [
  { id: 'term', label: 'Life Insurance', icon: FiShield, desc: 'Pure term & life cover', color: 'from-red-500 to-rose-600' },
  { id: 'investment', label: 'Investment Plan', icon: FiTrendingUp, desc: 'ULIPs & savings plans', color: 'from-blue-500 to-indigo-600' },
  { id: 'health', label: 'Health Insurance', icon: FiHeart, desc: 'Medical & critical illness', color: 'from-emerald-500 to-teal-600' },
  { id: 'retirement', label: 'Retirement Plan', icon: FiSunrise, desc: 'Pension & annuity', color: 'from-amber-500 to-orange-600' },
]

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const STEPS = ['Plan Type', 'Personal Details', 'Coverage Details', 'Results']

const Calculator = () => {
  const [step, setStep] = useState(0)
  const [planType, setPlanType] = useState('')
  const [age, setAge] = useState(30)
  const [isSmoker, setIsSmoker] = useState(false)
  const [sumAssured, setSumAssured] = useState(5000000)
  const [term, setTerm] = useState(20)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const canNext = () => {
    if (step === 0) return Boolean(planType)
    if (step === 1) return age >= 18 && age <= 65
    if (step === 2) return sumAssured >= 500000 && term >= 5
    return true
  }

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const res = await calculatePremium({ plan_type: planType, age, smoker: isSmoker, sum_assured: sumAssured, term })
      setResult(res.data)
      setStep(3)
    } catch {
      const base = sumAssured * 0.002 * (1 + (age - 25) * 0.03) * (term / 20) * (isSmoker ? 1.25 : 1)
      const annual = Math.round(base)
      setResult({
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
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (step === 2) {
      handleCalculate()
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleReset = () => {
    setStep(0)
    setPlanType('')
    setAge(30)
    setIsSmoker(false)
    setSumAssured(5000000)
    setTerm(20)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="gradient-hero py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Premium Calculator</h1>
          <p className="text-white/70 text-lg">Get an instant premium estimate in 4 simple steps</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  i < step ? 'bg-primary border-primary text-white' :
                  i === step ? 'bg-white border-primary text-primary' :
                  'bg-white border-gray-200 text-gray-400'
                }`}>
                  {i < step ? <FiCheck className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`hidden sm:block text-xs font-semibold ${i <= step ? 'text-navy' : 'text-gray-400'}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-primary' : 'bg-gray-200'} hidden sm:block w-8`} />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8"
            >
              {/* Step 1: Plan Type */}
              {step === 0 && (
                <div>
                  <h2 className="text-navy font-bold text-2xl mb-2">Select Plan Type</h2>
                  <p className="text-gray-400 mb-6">What kind of insurance are you looking for?</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {planTypes.map(({ id, label, icon: Icon, desc, color }) => (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPlanType(id)}
                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                          planType === id
                            ? 'border-navy bg-navy text-white'
                            : 'border-gray-200 hover:border-navy/40 bg-white'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                          <Icon className="text-white w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-bold ${planType === id ? 'text-white' : 'text-navy'}`}>{label}</p>
                          <p className={`text-sm ${planType === id ? 'text-white/70' : 'text-gray-400'}`}>{desc}</p>
                        </div>
                        {planType === id && <FiCheck className="text-white ml-auto shrink-0" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-navy font-bold text-2xl mb-2">Personal Details</h2>
                  <p className="text-gray-400 mb-6">Help us calculate the most accurate premium for you</p>
                  <div className="space-y-6">
                    <div>
                      <label className="label-field text-base">
                        Your Age: <span className="text-primary font-bold text-xl">{age} years</span>
                      </label>
                      <input
                        type="range"
                        min={18}
                        max={65}
                        value={age}
                        onChange={(e) => setAge(+e.target.value)}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>18 years</span>
                        <span>65 years</span>
                      </div>
                    </div>

                    <div>
                      <label className="label-field text-base mb-3 block">Smoking Status</label>
                      <div className="flex gap-4">
                        {[
                          { value: false, label: 'Non-Smoker', emoji: '🚭', desc: 'Never smoked or quit 3+ years ago' },
                          { value: true, label: 'Smoker', emoji: '🚬', desc: 'Currently smoke or quit < 3 years' },
                        ].map(({ value, label, emoji, desc }) => (
                          <button
                            key={label}
                            onClick={() => setIsSmoker(value)}
                            className={`flex-1 flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                              isSmoker === value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40'
                            }`}
                          >
                            <span className="text-3xl mb-2">{emoji}</span>
                            <p className="font-semibold text-navy text-sm">{label}</p>
                            <p className="text-gray-400 text-xs text-center mt-1">{desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Coverage Details */}
              {step === 2 && (
                <div>
                  <h2 className="text-navy font-bold text-2xl mb-2">Coverage Details</h2>
                  <p className="text-gray-400 mb-6">Choose your desired coverage amount and policy term</p>
                  <div className="space-y-7">
                    <div>
                      <label className="label-field text-base">
                        Sum Assured: <span className="text-primary font-bold text-xl">{formatCurrency(sumAssured)}</span>
                      </label>
                      <input
                        type="range"
                        min={500000}
                        max={50000000}
                        step={500000}
                        value={sumAssured}
                        onChange={(e) => setSumAssured(+e.target.value)}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>₹5 Lakh</span>
                        <span>₹5 Crore</span>
                      </div>
                    </div>

                    <div>
                      <label className="label-field text-base">
                        Policy Term: <span className="text-primary font-bold text-xl">{term} years</span>
                      </label>
                      <input
                        type="range"
                        min={5}
                        max={40}
                        value={term}
                        onChange={(e) => setTerm(+e.target.value)}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>5 years</span>
                        <span>40 years</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                      <h4 className="font-bold text-navy text-sm">Summary</h4>
                      {[
                        { label: 'Plan Type', value: planTypes.find((p) => p.id === planType)?.label },
                        { label: 'Age', value: `${age} years` },
                        { label: 'Smoker', value: isSmoker ? 'Yes' : 'No' },
                        { label: 'Sum Assured', value: formatCurrency(sumAssured) },
                        { label: 'Policy Term', value: `${term} years` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-gray-500">{label}</span>
                          <span className="text-navy font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {step === 3 && result && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiCheck className="text-green-500 w-8 h-8" />
                    </div>
                    <h2 className="text-navy font-bold text-2xl mb-1">Your Premium Estimate</h2>
                    <p className="text-gray-400 text-sm capitalize">
                      {planTypes.find((p) => p.id === result.plan_type)?.label} · {formatCurrency(result.sum_assured)} · {result.term} years
                    </p>
                  </div>

                  {/* Main premium */}
                  <div className="bg-navy rounded-2xl p-6 text-center mb-5">
                    <p className="text-white/60 text-sm mb-1">Annual Premium (Base)</p>
                    <p className="text-white font-black text-5xl mb-1">{formatCurrency(result.annual_premium)}</p>
                    <p className="text-white/40 text-xs">Exclusive of 18% GST</p>
                  </div>

                  {/* Payment modes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Monthly', value: result.monthly_premium },
                      { label: 'Quarterly', value: result.quarterly_premium },
                      { label: 'Half-Yearly', value: result.half_yearly_premium },
                      { label: 'Annual', value: result.annual_premium },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                        <p className="text-gray-400 text-xs mb-1">{label}</p>
                        <p className="text-navy font-bold text-sm">{formatCurrency(value)}</p>
                      </div>
                    ))}
                  </div>

                  {/* GST Breakdown */}
                  <div className="border border-dashed border-gray-200 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Base Premium</span>
                      <span className="font-semibold text-navy">{formatCurrency(result.annual_premium)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">GST @ 18%</span>
                      <span className="font-semibold text-navy">{formatCurrency(result.gst_amount)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                      <span className="text-navy">Total Annual Payable</span>
                      <span className="text-primary text-lg">{formatCurrency(result.total_with_gst)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-navy transition-colors"
                    >
                      Recalculate
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      <FiPrinter />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`HDFC Life Premium: ${formatCurrency(result.annual_premium)}/year`)
                        toast.success('Copied to clipboard!')
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      <FiShare2 />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          {step < 3 && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-navy transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canNext() || loading}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><FiLoader className="animate-spin" />Calculating...</>
                ) : step === 2 ? (
                  'Calculate Premium'
                ) : (
                  <>Next <FiChevronRight /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calculator
