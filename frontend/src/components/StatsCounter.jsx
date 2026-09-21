import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { FiUsers, FiAward, FiCheckCircle, FiCalendar } from 'react-icons/fi'

const stats = [
  {
    icon: FiUsers,
    value: 6,
    suffix: ' Cr+',
    label: 'Lives Covered',
    desc: 'Trusted by millions',
    color: 'from-red-500 to-red-700',
  },
  {
    icon: FiAward,
    value: 50,
    suffix: '+',
    label: 'Insurance Plans',
    desc: 'Tailored for every need',
    color: 'from-amber-500 to-amber-700',
  },
  {
    icon: FiCheckCircle,
    value: 99.5,
    suffix: '%',
    decimals: 1,
    label: 'Claim Settlement Ratio',
    desc: 'FY 2022-23',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    icon: FiCalendar,
    value: 35,
    suffix: '+',
    label: 'Years of Trust',
    desc: 'Established in 2000',
    color: 'from-blue-500 to-blue-700',
  },
]

const StatsCounter = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="bg-navy py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Numbers That Speak for Us
          </h2>
          <p className="text-white/50 text-lg">
            Decades of trust, millions of lives secured
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon className="text-white w-7 h-7" />
                </div>

                {/* Counter */}
                <div className="text-white font-black text-3xl md:text-4xl mb-1">
                  {inView ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      decimals={stat.decimals || 0}
                      suffix={stat.suffix}
                    />
                  ) : (
                    <span>0{stat.suffix}</span>
                  )}
                </div>

                <p className="text-white font-semibold text-sm mb-1">{stat.label}</p>
                <p className="text-white/40 text-xs">{stat.desc}</p>

                {/* Decorative underline */}
                <div className={`h-0.5 w-12 bg-gradient-to-r ${stat.color} mx-auto mt-3 rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsCounter
