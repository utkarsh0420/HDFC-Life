import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiShield, FiTrendingUp, FiHeart, FiSunrise,
  FiCheckCircle, FiFileText, FiUser, FiAlertCircle, FiLoader } from 'react-icons/fi'
import { getProduct, calculatePremium, submitLead } from '../services/api'
import { toast } from 'react-toastify'

const TABS = ['Overview', 'Benefits', 'Eligibility', 'Documents']

const categoryIcon = {
  term: FiShield,
  investment: FiTrendingUp,
  health: FiHeart,
  retirement: FiSunrise,
}

const mockBenefits = [
  'Comprehensive life coverage up to ₹5 Crore',
  'Tax benefits under Section 80C and 10(10D)',
  'Terminal illness benefit included',
  'Optional critical illness rider available',
  'Accidental death benefit rider',
  'Premium waiver on disability',
]

const mockEligibility = [
  { label: 'Entry Age', value: '18 – 65 years' },
  { label: 'Policy Term', value: '10 – 40 years' },
  { label: 'Sum Assured', value: '₹50 Lakh – ₹5 Crore' },
  { label: 'Premium Payment', value: 'Annual / Monthly / Quarterly' },
  { label: 'Medical Exam', value: 'Required above ₹50 Lakh' },
]

const mockDocuments = [
  'Identity proof (Aadhaar / PAN / Passport)',
  'Address proof (Electricity bill / Rent agreement)',
  'Income proof (Salary slips / ITR)',
  'Recent photograph (passport size)',
  'Medical reports (if applicable)',
]

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [age, setAge] = useState(30)
  const [sumAssured, setSumAssured] = useState(5000000)
  const [term, setTerm] = useState(20)
  const [calcLoading, setCalcLoading] = useState(false)
  const [calcResult, setCalcResult] = useState(null)
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProduct(id)
        setProduct(res.data)
      } catch {
        // Mock product
        setProduct({
          _id: id,
          name: 'Click 2 Protect Life',
          category: 'term',
          description: 'Click 2 Protect Life is a comprehensive term insurance plan that provides financial protection to your family at an affordable premium. With flexible options and high sum assured, it is designed to meet all your protection needs.',
          base_premium_rate: 8500,
          key_benefit: 'Life cover up to ₹5 Crore',
          min_sum_assured: 2500000,
          max_sum_assured: 50000000,
        })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleCalculate = async () => {
    setCalcLoading(true)
    try {
      const res = await calculatePremium({ plan_type: product.category, age, sum_assured: sumAssured, term })
      setCalcResult(res.data)
    } catch {
      const base = sumAssured * 0.002 * (1 + (age - 25) * 0.03) * (term / 20)
      const annual = Math.round(base)
      setCalcResult({
        annual_premium: annual,
        monthly_premium: Math.round(annual / 12),
        gst_amount: Math.round(annual * 0.18),
        total_with_gst: Math.round(annual * 1.18),
      })
    } finally {
      setCalcLoading(false)
    }
  }

  const handleEnquiry = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitLead({ ...enquiry, interest: product.category, product_name: product.name })
      toast.success('Enquiry submitted! We will call you shortly.')
      setEnquiry({ name: '', email: '', phone: '' })
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const Icon = product ? (categoryIcon[product.category] || FiShield) : FiShield

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-navy font-medium">Loading plan details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-navy transition-colors text-sm font-medium">
          <FiArrowLeft /> Back to Products
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Icon className="text-white w-8 h-8" />
            </div>
            <div className="flex-1">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize mb-3 inline-block">
                {product.category} Insurance
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white mb-2">{product.name}</h1>
              <p className="text-white/70 max-w-2xl">{product.description}</p>
            </div>
            {product.base_premium_rate && (
              <div className="glass-card rounded-2xl p-5 text-center min-w-40">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Starting from</p>
                <p className="text-white font-black text-2xl">{formatCurrency(product.base_premium_rate)}</p>
                <p className="text-white/50 text-xs">per year</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="flex border-b border-gray-100">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                      activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-navy'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  {activeTab === 'Overview' && (
                    <div>
                      <h3 className="text-navy font-bold text-lg mb-4">Plan Overview</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                        <div className="flex gap-3">
                          <FiAlertCircle className="text-primary shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm">
                            <strong>Key Highlight:</strong> {product.key_benefit || 'This plan offers comprehensive coverage with flexible premium payment options and tax benefits.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Benefits' && (
                    <div>
                      <h3 className="text-navy font-bold text-lg mb-4">Plan Benefits</h3>
                      <ul className="space-y-3">
                        {mockBenefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <FiCheckCircle className="text-green-500 shrink-0 mt-0.5 w-5 h-5" />
                            <span className="text-gray-700 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'Eligibility' && (
                    <div>
                      <h3 className="text-navy font-bold text-lg mb-4">Eligibility Criteria</h3>
                      <div className="space-y-3">
                        {mockEligibility.map((item) => (
                          <div key={item.label} className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-500 text-sm flex items-center gap-2">
                              <FiUser className="w-4 h-4 text-primary" />
                              {item.label}
                            </span>
                            <span className="text-navy font-semibold text-sm">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'Documents' && (
                    <div>
                      <h3 className="text-navy font-bold text-lg mb-4">Required Documents</h3>
                      <ul className="space-y-3">
                        {mockDocuments.map((doc, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <FiFileText className="text-primary shrink-0 mt-0.5 w-5 h-5" />
                            <span className="text-gray-700 text-sm">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Inline Calculator */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-navy font-bold text-lg mb-5">Calculate Your Premium</h3>
              <div className="grid sm:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="label-field">Age: <strong className="text-primary">{age}</strong></label>
                  <input type="range" min={18} max={65} value={age} onChange={(e) => setAge(+e.target.value)}
                    className="w-full accent-primary" />
                </div>
                <div>
                  <label className="label-field">Sum Assured: <strong className="text-primary">{formatCurrency(sumAssured)}</strong></label>
                  <input type="range" min={500000} max={50000000} step={500000} value={sumAssured}
                    onChange={(e) => setSumAssured(+e.target.value)} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="label-field">Term: <strong className="text-primary">{term} yrs</strong></label>
                  <input type="range" min={5} max={40} value={term} onChange={(e) => setTerm(+e.target.value)}
                    className="w-full accent-primary" />
                </div>
              </div>
              <button onClick={handleCalculate} disabled={calcLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {calcLoading ? <><FiLoader className="animate-spin" />Calculating...</> : 'Calculate Premium'}
              </button>
              {calcResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Annual', value: formatCurrency(calcResult.annual_premium) },
                    { label: 'Monthly', value: formatCurrency(calcResult.monthly_premium) },
                    { label: 'GST', value: formatCurrency(calcResult.gst_amount) },
                    { label: 'Total', value: formatCurrency(calcResult.total_with_gst) },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                      <p className="text-navy font-bold">{item.value}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar – Enquiry Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="text-navy font-bold text-lg mb-1">Get Expert Advice</h3>
              <p className="text-gray-400 text-sm mb-5">Our advisor will call you within 2 hours</p>
              <form onSubmit={handleEnquiry} className="space-y-4">
                <div>
                  <label className="label-field">Full Name *</label>
                  <input type="text" required value={enquiry.name}
                    onChange={(e) => setEnquiry(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name" className="input-field" />
                </div>
                <div>
                  <label className="label-field">Email *</label>
                  <input type="email" required value={enquiry.email}
                    onChange={(e) => setEnquiry(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com" className="input-field" />
                </div>
                <div>
                  <label className="label-field">Phone *</label>
                  <input type="tel" required value={enquiry.phone}
                    onChange={(e) => setEnquiry(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210" className="input-field" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Request Callback'}
                </button>
              </form>
              <div className="border-t border-gray-100 mt-5 pt-4">
                <p className="text-center text-gray-400 text-xs mb-3">Or buy directly online</p>
                <button className="w-full border-2 border-primary text-primary font-semibold py-3 rounded-xl hover:bg-primary hover:text-white transition-colors">
                  Buy Online Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
