import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase,
  FiCheckCircle, FiDollarSign, FiMessageSquare, FiSend,
  FiTrendingUp, FiAward, FiUsers, FiStar,
} from 'react-icons/fi'
import { submitPartnerApplication } from '../services/api'

const benefits = [
  {
    icon: FiDollarSign,
    title: 'Attractive Commissions',
    desc: 'Earn industry-leading commissions on every policy you sell, plus renewal bonuses.',
  },
  {
    icon: FiTrendingUp,
    title: 'Unlimited Earning Potential',
    desc: 'No cap on your income – the more you sell, the more you earn.',
  },
  {
    icon: FiAward,
    title: 'Recognition & Rewards',
    desc: 'Win trips, trophies, and incentives through our Partner Excellence Programme.',
  },
  {
    icon: FiUsers,
    title: 'Training & Support',
    desc: 'Free IRDAI-certified training, digital tools, and a dedicated relationship manager.',
  },
  {
    icon: FiStar,
    title: 'Trusted Brand',
    desc: "Sell India's most award-winning life insurance brand and build lasting client trust.",
  },
  {
    icon: FiBriefcase,
    title: 'Flexible Working',
    desc: 'Work on your own terms – full-time, part-time, or as a side income stream.',
  },
]

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
]

const partnerTypes = [
  { value: 'individual_agent', label: 'Individual Agent' },
  { value: 'corporate_agent', label: 'Corporate Agent' },
  { value: 'broker', label: 'Insurance Broker' },
  { value: 'bancassurance', label: 'Bancassurance Partner' },
  { value: 'digital_partner', label: 'Digital / Online Partner' },
]

const incomeRanges = [
  'Below ₹3 LPA',
  '₹3 – 6 LPA',
  '₹6 – 10 LPA',
  '₹10 – 20 LPA',
  'Above ₹20 LPA',
]

const initialForm = {
  full_name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  partner_type: 'individual_agent',
  experience_years: '',
  current_occupation: '',
  annual_income_range: '',
  message: '',
}

const InputField = ({ label, required, icon: Icon, children }) => (
  <div>
    <label className="block text-sm font-medium text-navy mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      )}
      {children}
    </div>
  </div>
)

const BecomePartner = () => {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const inputCls = (hasIcon = true) =>
    `w-full border border-gray-200 rounded-xl py-3 ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitPartnerApplication({
        ...form,
        experience_years: Number(form.experience_years) || 0,
      })
      setSubmitted(true)
      toast.success('Application submitted! We will contact you within 2 business days.')
    } catch (err) {
      const msg = err?.response?.data?.error || 'Something went wrong. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block bg-gold/20 text-gold text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
          >
            Partner Programme
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight"
          >
            Grow With <span className="text-gold">HDFC Life</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Join our nationwide network of 1.4 lakh+ partners and turn your network into
            a rewarding income stream — with full training, support, and no upper income limit.
          </motion.p>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Partner With Us?</h2>
            <p className="section-subtitle mx-auto">
              Everything you need to build a successful insurance distribution business
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-navy font-bold mb-1">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Form ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Apply to Become a Partner</h2>
            <p className="section-subtitle mx-auto">
              Fill in your details below and our partnership team will get back to you within 2 business days.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-lg p-10 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Application Received!</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Thank you for your interest in partnering with HDFC Life. Our team will review
                your application and reach out within <strong>2 business days</strong>.
              </p>
              <button
                onClick={() => { setForm(initialForm); setSubmitted(false) }}
                className="btn-primary"
              >
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
            >
              {/* Personal Details */}
              <div>
                <h3 className="text-navy font-bold text-lg mb-4 pb-2 border-b border-gray-100">
                  Personal Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" required icon={FiUser}>
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={set('full_name')}
                      placeholder="Rahul Sharma"
                      className={inputCls()}
                    />
                  </InputField>

                  <InputField label="Email Address" required icon={FiMail}>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="rahul@example.com"
                      className={inputCls()}
                    />
                  </InputField>

                  <InputField label="Phone Number" required icon={FiPhone}>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="+91 98765 43210"
                      className={inputCls()}
                    />
                  </InputField>

                  <InputField label="City" icon={FiMapPin}>
                    <input
                      type="text"
                      value={form.city}
                      onChange={set('city')}
                      placeholder="Mumbai"
                      className={inputCls()}
                    />
                  </InputField>

                  <InputField label="State" icon={FiMapPin}>
                    <select
                      value={form.state}
                      onChange={set('state')}
                      className={inputCls()}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </InputField>
                </div>
              </div>

              {/* Partnership Details */}
              <div>
                <h3 className="text-navy font-bold text-lg mb-4 pb-2 border-b border-gray-100">
                  Partnership Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField label="Partnership Type" required icon={FiBriefcase}>
                    <select
                      required
                      value={form.partner_type}
                      onChange={set('partner_type')}
                      className={inputCls()}
                    >
                      {partnerTypes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </InputField>

                  <InputField label="Current Occupation" icon={FiBriefcase}>
                    <input
                      type="text"
                      value={form.current_occupation}
                      onChange={set('current_occupation')}
                      placeholder="e.g. Financial Advisor, Banker"
                      className={inputCls()}
                    />
                  </InputField>

                  <InputField label="Years of Experience in Finance / Insurance" icon={FiTrendingUp}>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={form.experience_years}
                      onChange={set('experience_years')}
                      placeholder="0"
                      className={inputCls()}
                    />
                  </InputField>

                  <InputField label="Annual Income Range" icon={FiDollarSign}>
                    <select
                      value={form.annual_income_range}
                      onChange={set('annual_income_range')}
                      className={inputCls()}
                    >
                      <option value="">Select Range</option>
                      {incomeRanges.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </InputField>
                </div>
              </div>

              {/* Message */}
              <InputField label="Why do you want to partner with HDFC Life?" icon={FiMessageSquare}>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell us about your motivation and goals…"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm resize-none"
                />
              </InputField>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </motion.button>

              <p className="text-gray-400 text-xs text-center">
                By submitting, you agree to our Privacy Policy. Your information is 100% secure and will not be shared.
              </p>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  )
}

export default BecomePartner
