import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculatePremium } from '../services/api'
import { FiShield, FiTrendingUp, FiHeart, FiSunrise, FiX, FiLoader } from 'react-icons/fi'
import { toast } from 'react-toastify'

const planTypes = [
  { id: 'term', label: 'Term', icon: FiShield, color: 'text-red-500' },
  { id: 'investment', label: 'Investment', icon: FiTrendingUp, color: 'text-blue-500' },
  { id: 'health', label: 'Health', icon: FiHeart, color: 'text-green-500' },
  { id: 'retirement', label: 'Retirement', icon: FiSunrise, color: 'text-amber-500' },
]

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const PremiumCalculatorWidget = () => {
  const [plan, setPlan] = useState('term')
  const [age, setAge] = useState(30)
  const [sumAssured, setSumAssured] = useState(5000000)
  const [term, setTerm] = useState(20)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const res = await calculatePremium({
        plan_type: plan,
        age,
        sum_assured: sumAssured,
        term,
      })
      setResult(res.data)
      setModalOpen(true)
    } catch (err) {
      // Fallback mock calculation when backend isn't available
      const base = sumAssured * 0.002 * (1 + (age - 25) * 0.03) * (term / 20)
      const annual = Math.round(base)
      setResult({
        annual_premium: annual,
        monthly_premium: Math.round(annual / 12),
        quarterly_premium: Math.round(annual / 4),
        gst_amount: Math.round(annual * 0.18),
        total_with_gst: Math.round(annual * 1.18),
        plan_type: plan,
        sum_assured: sumAssured,
      })
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8">
        {/* Plan Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {planTypes.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setPlan(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                plan === id
                  ? 'bg-navy border-navy text-white shadow-lg'
                  : 'border-gray-200 text-gray-500 hover:border-navy/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${plan === id ? 'text-white' : color}`} />
              {label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Age Slider */}
          <div>
            <label className="label-field">
              Age: <span className="text-primary font-bold">{age} years</span>
            </label>
            <input
              type="range"
              min={18}
              max={65}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>18</span><span>65</span>
            </div>
          </div>

          {/* Sum Assured */}
          <div>
            <label className="label-field">
              Sum Assured: <span className="text-primary font-bold">{formatCurrency(sumAssured)}</span>
            </label>
            <input
              type="range"
              min={500000}
              max={50000000}
              step={500000}
              value={sumAssured}
              onChange={(e) => setSumAssured(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹5L</span><span>₹5Cr</span>
            </div>
          </div>

          {/* Policy Term */}
          <div>
            <label className="label-field">
              Policy Term: <span className="text-primary font-bold">{term} years</span>
            </label>
            <input
              type="range"
              min={5}
              max={40}
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5</span><span>40 yrs</span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleCalculate}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Calculating...
            </>
          ) : (
            'Calculate Premium'
          )}
        </motion.button>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {modalOpen && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-navy px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Your Premium Estimate</h3>
                  <p className="text-white/50 text-xs capitalize">{result.plan_type} Insurance · {formatCurrency(result.sum_assured)}</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="bg-primary/5 rounded-2xl p-5 mb-4 text-center">
                  <p className="text-gray-500 text-sm mb-1">Annual Premium (excl. GST)</p>
                  <p className="text-navy font-black text-4xl">{formatCurrency(result.annual_premium)}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Monthly</p>
                    <p className="text-navy font-bold text-lg">{formatCurrency(result.monthly_premium)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs mb-1">Quarterly</p>
                    <p className="text-navy font-bold text-lg">{formatCurrency(result.quarterly_premium)}</p>
                  </div>
                </div>

                <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base Premium</span>
                    <span className="text-navy font-semibold">{formatCurrency(result.annual_premium)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST @ 18%</span>
                    <span className="text-navy font-semibold">{formatCurrency(result.gst_amount)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-navy">Total Payable</span>
                    <span className="text-primary text-base">{formatCurrency(result.total_with_gst)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-navy transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href="/calculator"
                    className="flex-1 btn-primary text-center py-3 rounded-xl"
                  >
                    Full Calculator
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PremiumCalculatorWidget
