import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowDown, FiShield } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { getPolicies } from '../services/api'

const floatVariants = {
  animate: {
    y: [0, -16, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}

const particleVariants = (delay = 0) => ({
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.3, 0.7, 0.3],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay },
  },
})

const HeroSection = () => {
  const { user, isAuthenticated } = useAuth()
  const [heroPolicy, setHeroPolicy] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      getPolicies().then((res) => {
        const policies = res.data?.policies || res.data || []
        if (policies.length > 0) {
          setHeroPolicy(policies[0])
        }
      }).catch(err => console.error(err))
    }
  }, [isAuthenticated])
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden flex items-center">
      {/* Background decorative circles */}
      <motion.div
        variants={particleVariants(0)}
        animate="animate"
        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        variants={particleVariants(1.5)}
        animate="animate"
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        variants={particleVariants(0.8)}
        animate="animate"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-light/30 rounded-full blur-3xl"
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gold rounded-full opacity-40"
          style={{
            top: `${15 + i * 10}%`,
            left: `${5 + i * 12}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-white/80 text-sm font-medium">India's Leading Life Insurer</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
            >
              Secure Your{' '}
              <span className="text-gradient">Future</span>
              {' '}with{' '}
              <span className="text-gold">HDFC Life</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-lg"
            >
              Protect what matters most. With 6 crore+ lives covered and a 99.5% claim settlement ratio, we're India's most trusted life insurance partner.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/calculator" className="btn-primary text-base px-8 py-4">
                Get Free Quote
              </Link>
              <Link to="/products" className="btn-outline text-base px-8 py-4">
                Explore Plans
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { label: '6 Cr+', sub: 'Lives Covered' },
                { label: '99.5%', sub: 'Claim Settlement' },
                { label: '50+', sub: 'Plans Available' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-gold font-black text-2xl">{item.label}</span>
                  <span className="text-white/50 text-xs">{item.sub}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right – Animated Insurance Card */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-80 h-96">
              {/* Main floating card */}
              <motion.div
                variants={floatVariants}
                animate="animate"
                className="absolute inset-0 glass-card rounded-3xl p-6 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-white">H</div>
                    <span className="text-white font-semibold text-sm">HDFC Life</span>
                  </div>
                  <FiShield className="text-gold w-6 h-6" />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Policy Holder</p>
                    <p className="text-white font-bold text-lg">{user?.username || 'Rahul Sharma'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-white/50 text-xs">Sum Assured</p>
                      <p className="text-white font-bold">
                        {heroPolicy 
                          ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(heroPolicy.sum_assured)
                          : '₹1 Cr'}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-white/50 text-xs">Annual Premium</p>
                      <p className="text-white font-bold">
                        {heroPolicy
                          ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(heroPolicy.premium)
                          : '₹12,500'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-white/50 text-xs">Policy Term</p>
                    <p className="text-white font-bold">
                      {heroPolicy
                        ? `${new Date(heroPolicy.end_date || heroPolicy.start_date).getFullYear() - new Date(heroPolicy.start_date).getFullYear()} Years · ${heroPolicy.type || 'Term Plan'}`
                        : '30 Years · Term Plan'}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 rounded-xl p-3 ${heroPolicy?.status === 'lapsed' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${heroPolicy?.status === 'lapsed' ? 'bg-red-400' : 'bg-green-400'}`} />
                    <p className={`font-semibold text-sm ${heroPolicy?.status === 'lapsed' ? 'text-red-400' : 'text-green-400'}`}>
                      {heroPolicy?.status === 'lapsed' ? 'Policy Lapsed' : 'Policy Active'}
                    </p>
                  </div>
                </div>
              </motion.div>


            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
        <FiArrowDown className="text-white/40 w-5 h-5" />
      </motion.div>
    </section>
  )
}

export default HeroSection
