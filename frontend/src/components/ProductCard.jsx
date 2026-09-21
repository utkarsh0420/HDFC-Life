import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiTrendingUp, FiHeart, FiSunrise, FiArrowRight } from 'react-icons/fi'

const categoryConfig = {
  term: { icon: FiShield, color: 'bg-red-100 text-red-600', border: 'border-red-200', badge: 'bg-red-50 text-red-600' },
  investment: { icon: FiTrendingUp, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200', badge: 'bg-blue-50 text-blue-600' },
  health: { icon: FiHeart, color: 'bg-green-100 text-green-600', border: 'border-green-200', badge: 'bg-green-50 text-green-600' },
  retirement: { icon: FiSunrise, color: 'bg-amber-100 text-amber-600', border: 'border-amber-200', badge: 'bg-amber-50 text-amber-600' },
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    category = 'term',
    description,
    base_premium_rate,
    min_sum_assured,
    key_benefit,
  } = product

  const config = categoryConfig[category?.toLowerCase()] || categoryConfig.term
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl border ${config.border} overflow-hidden flex flex-col transition-shadow duration-300`}
    >
      {/* Card header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${config.badge} capitalize`}>
            {category}
          </span>
        </div>

        <h3 className="text-navy font-bold text-lg mb-2 line-clamp-2">{name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{description}</p>
      </div>

      {/* Key benefit */}
      {key_benefit && (
        <div className="mx-6 mb-4 bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Key Benefit</p>
          <p className="text-navy text-sm font-semibold">{key_benefit}</p>
        </div>
      )}

      {/* Premium info */}
      <div className="px-6 pb-4 flex-1 flex items-end">
        {base_premium_rate ? (
          <div className="w-full">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Starting from</p>
            <p className="text-navy font-black text-xl">
              {formatCurrency(base_premium_rate)}
              <span className="text-gray-400 text-sm font-normal">/year</span>
            </p>
          </div>
        ) : null}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          to={`/products/${_id}`}
          className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 group"
        >
          Know More
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

export default ProductCard
