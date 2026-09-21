import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { toast } from 'react-toastify'
import { FiShield, FiTrendingUp, FiHeart, FiSunrise, FiArrowRight,
  FiCheckCircle, FiAward, FiUsers, FiPhone, FiZap, FiLock, FiGlobe } from 'react-icons/fi'
import HeroSection from '../components/HeroSection'
import StatsCounter from '../components/StatsCounter'
import ProductCard from '../components/ProductCard'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import PremiumCalculatorWidget from '../components/PremiumCalculatorWidget'
import { getProducts, submitLead } from '../services/api'

const categories = [
  {
    icon: FiShield,
    title: 'Term Insurance',
    desc: 'Pure life protection at the lowest cost. Cover your family financially.',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    href: '/products?category=term',
  },
  {
    icon: FiTrendingUp,
    title: 'Investment Plans',
    desc: 'Grow your wealth with market-linked ULIP and guaranteed return plans.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    href: '/products?category=investment',
  },
  {
    icon: FiHeart,
    title: 'Health Insurance',
    desc: 'Comprehensive health coverage for you and your loved ones.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    href: '/products?category=health',
  },
  {
    icon: FiSunrise,
    title: 'Retirement Plans',
    desc: 'Plan a comfortable retirement with pension and annuity solutions.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    href: '/products?category=retirement',
  },
]

const trustPoints = [
  { icon: FiCheckCircle, title: '99.5% Claim Settlement', desc: 'One of the highest in the industry' },
  { icon: FiAward, title: 'Award-Winning Service', desc: 'Recognized by IRDAI & industry bodies' },
  { icon: FiUsers, title: '6 Crore+ Customers', desc: 'Trusted across India for 24+ years' },
  { icon: FiZap, title: 'Instant Policy Issuance', desc: 'Get your policy in minutes online' },
  { icon: FiLock, title: 'Secure Digital Platform', desc: 'Bank-grade security for your data' },
  { icon: FiGlobe, title: 'Pan-India Network', desc: '400+ branches & 1.4L+ agents' },
]

const newsItems = [
  {
    id: 1,
    title: 'HDFC Life Wins "Best Life Insurer" Award at Economic Times Insurance Summit',
    date: 'Sep 15, 2026',
    category: 'Awards',
    image: 'https://placehold.co/600x400/0D1B2A/ffffff?text=Awards',
    excerpt: 'HDFC Life has been recognized as the Best Life Insurer at the prestigious Economic Times Insurance Summit 2026.',
  },
  {
    id: 2,
    title: 'New Child Education Plan Launched with Guaranteed Maturity Benefits',
    date: 'Sep 8, 2026',
    category: 'Products',
    image: 'https://placehold.co/600x400/1A2E45/ffffff?text=New+Plan',
    excerpt: 'HDFC Life launches YoungStar Pro with guaranteed maturity benefits aligned to educational milestones.',
  },
  {
    id: 3,
    title: 'HDFC Life Reports 99.5% Claim Settlement Ratio for FY 2025-26',
    date: 'Aug 30, 2026',
    category: 'Press Release',
    image: 'https://placehold.co/600x400/B71C1C/ffffff?text=Claims',
    excerpt: 'Industry-leading claim settlement ratio reinforces our commitment to protecting our customers.',
  },
]

const awardsMarquee = [
  '🏆 Best Life Insurer 2026', '⭐ IRDAI Award of Excellence', '🥇 ET Insurance Summit Award',
  '🏅 Forbes Best Employer 2025', '🎖️ Golden Peacock HR Excellence', '🏆 Best Life Insurer 2026',
  '⭐ IRDAI Award of Excellence', '🥇 ET Insurance Summit Award', '🏅 Forbes Best Employer 2025',
]

const SectionWrapper = ({ children, className = '' }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const Home = () => {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', interest: 'term' })
  const [submittingLead, setSubmittingLead] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({ limit: 4 })
        setProducts(res.data?.products || res.data || [])
      } catch {
        // Use fallback mock products
        setProducts([
          { _id: '1', name: 'Click 2 Protect Life', category: 'term', description: 'Pure term insurance providing comprehensive life cover at an affordable premium.', base_premium_rate: 8500, key_benefit: 'Life cover up to ₹5 Crore' },
          { _id: '2', name: 'ProGrowth Plus', category: 'investment', description: 'Unit linked insurance plan offering market-linked returns with life cover.', base_premium_rate: 25000, key_benefit: 'Invest in 8 fund options' },
          { _id: '3', name: 'Health Assure Plus', category: 'health', description: 'Comprehensive health insurance with critical illness cover and OPD benefits.', base_premium_rate: 12000, key_benefit: 'Critical illness cover included' },
          { _id: '4', name: 'Pension Super Plus', category: 'retirement', description: 'Guaranteed income post-retirement with multiple annuity options.', base_premium_rate: 18000, key_benefit: 'Lifetime guaranteed pension' },
        ])
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setSubmittingLead(true)
    try {
      await submitLead(leadForm)
      toast.success('Thank you! Our advisor will contact you shortly.')
      setLeadForm({ name: '', email: '', phone: '', interest: 'term' })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmittingLead(false)
    }
  }

  return (
    <div>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Stats */}
      <StatsCounter />

      {/* 3. Product Categories */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-title">Plans for Every Life Stage</h2>
            <p className="section-subtitle mx-auto">
              Whatever your goal, we have the right insurance and investment plan for you
            </p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={cat.href}
                  className={`group block rounded-2xl ${cat.bg} border border-transparent hover:border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <cat.icon className="text-white w-7 h-7" />
                  </div>
                  <h3 className="text-navy font-bold text-lg mb-2">{cat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{cat.desc}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-semibold">
                    Explore <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-title">Featured Plans</h2>
            <p className="section-subtitle mx-auto">Our most popular insurance and investment solutions</p>
          </SectionWrapper>

          {loadingProducts ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="skeleton h-12 w-12 rounded-xl" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                  <div className="skeleton h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products" className="btn-outline-red inline-flex items-center gap-2">
              View All Plans <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Calculator Widget */}
      <section className="py-16 lg:py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SectionWrapper>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Calculate Your Premium in <span className="text-gold">60 Seconds</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Get an instant estimate for your insurance premium. No personal data required to get started.
              </p>
              <ul className="space-y-3">
                {['Free instant estimate', 'No personal data needed', 'Compare multiple plans', 'Talk to an advisor'].map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-white/70">
                    <FiCheckCircle className="text-gold shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </SectionWrapper>
            <SectionWrapper>
              <PremiumCalculatorWidget />
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* 6. Why HDFC Life */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-title">Why Choose HDFC Life?</h2>
            <p className="section-subtitle mx-auto">Built on trust, driven by purpose</p>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <point.icon className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-navy font-bold mb-1">{point.title}</h3>
                  <p className="text-gray-500 text-sm">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <TestimonialsCarousel />

      {/* 8. News & Awards */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper className="text-center mb-12">
            <h2 className="section-title">News & Updates</h2>
            <p className="section-subtitle mx-auto">Stay updated with the latest from HDFC Life</p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 card-hover"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-gray-400 text-xs">{item.date}</span>
                  </div>
                  <h3 className="text-navy font-bold text-sm leading-snug mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{item.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/blogs" className="btn-outline-red inline-flex items-center gap-2">
              View All News <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Get a Quote CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-navy to-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SectionWrapper>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get a Free Quote Today
              </h2>
              <p className="text-white/60 text-lg mb-6">
                Leave your details and our certified insurance advisor will reach out within 24 hours.
              </p>
              <div className="flex items-center gap-3 text-white/60">
                <FiPhone className="text-gold" />
                <span>Or call us: 1800-266-9777 (Toll Free)</span>
              </div>
            </SectionWrapper>

            <SectionWrapper>
              <form onSubmit={handleLeadSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="rahul@email.com"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Interested In</label>
                  <select
                    value={leadForm.interest}
                    onChange={(e) => setLeadForm(p => ({ ...p, interest: e.target.value }))}
                    className="w-full bg-navy border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                  >
                    <option value="term">Term Insurance</option>
                    <option value="investment">Investment Plans</option>
                    <option value="health">Health Insurance</option>
                    <option value="retirement">Retirement Plans</option>
                  </select>
                </div>
                <motion.button
                  type="submit"
                  disabled={submittingLead}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gold hover:bg-amber-500 text-navy font-bold py-4 rounded-xl transition-colors text-base disabled:opacity-60"
                >
                  {submittingLead ? 'Submitting...' : 'Request Free Callback'}
                </motion.button>
                <p className="text-white/30 text-xs text-center">
                  By submitting, you agree to our Privacy Policy. Your data is 100% secure.
                </p>
              </form>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* 10. Awards Marquee */}
      <div className="bg-primary py-4 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content flex gap-8">
            {[...awardsMarquee, ...awardsMarquee].map((award, i) => (
              <span key={i} className="text-white font-semibold text-sm whitespace-nowrap px-4">
                {award}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
