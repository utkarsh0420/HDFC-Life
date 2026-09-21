import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiFilter, FiShield, FiTrendingUp, FiHeart, FiSunrise, FiX } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/api'

const categories = [
  { id: 'all', label: 'All Plans', icon: FiFilter },
  { id: 'term', label: 'Term Insurance', icon: FiShield },
  { id: 'investment', label: 'Investment', icon: FiTrendingUp },
  { id: 'health', label: 'Health', icon: FiHeart },
  { id: 'retirement', label: 'Retirement', icon: FiSunrise },
]

const mockProducts = [
  { _id: '1', name: 'Click 2 Protect Life', category: 'term', description: 'Pure term insurance providing comprehensive life cover at an affordable premium for your family.', base_premium_rate: 8500, key_benefit: 'Life cover up to ₹5 Crore' },
  { _id: '2', name: 'Click 2 Protect Super', category: 'term', description: 'Enhanced term plan with return of premium and critical illness waiver benefit.', base_premium_rate: 12000, key_benefit: 'Return of premium on survival' },
  { _id: '3', name: 'ProGrowth Plus', category: 'investment', description: 'Unit linked insurance plan offering market-linked returns with life cover.', base_premium_rate: 25000, key_benefit: 'Invest in 8 fund options' },
  { _id: '4', name: 'Sanchay Plus', category: 'investment', description: 'Guaranteed income plan with flexible payout options and life cover.', base_premium_rate: 30000, key_benefit: 'Guaranteed returns from day 1' },
  { _id: '5', name: 'Health Assure Plus', category: 'health', description: 'Comprehensive health insurance with critical illness cover and OPD benefits.', base_premium_rate: 12000, key_benefit: 'Critical illness cover included' },
  { _id: '6', name: 'Cancer Care', category: 'health', description: 'Specialized cancer insurance with lump sum payout on diagnosis.', base_premium_rate: 8000, key_benefit: 'Covers all stages of cancer' },
  { _id: '7', name: 'Pension Super Plus', category: 'retirement', description: 'Guaranteed income post-retirement with multiple annuity options.', base_premium_rate: 18000, key_benefit: 'Lifetime guaranteed pension' },
  { _id: '8', name: 'New Immediate Annuity Plan', category: 'retirement', description: 'Start your pension immediately with flexible payment modes.', base_premium_rate: 15000, key_benefit: 'Immediate annuity payouts' },
]

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 space-y-4 animate-pulse">
    <div className="h-12 w-12 bg-gray-200 rounded-xl" />
    <div className="h-5 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-10 bg-gray-200 rounded-xl w-full" />
  </div>
)

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const filters = {}
        if (activeCategory !== 'all') filters.category = activeCategory
        if (search) filters.search = search
        const res = await getProducts(filters)
        setProducts(res.data?.products || res.data || [])
      } catch {
        setProducts(
          mockProducts.filter((p) => {
            const matchCat = activeCategory === 'all' || p.category === activeCategory
            const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
            return matchCat && matchSearch
          })
        )
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [activeCategory, search])

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId)
    if (catId === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', catId)
    }
    setSearchParams(searchParams)
  }

  const filteredProducts = search
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
          >
            Our Insurance Plans
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Find the perfect plan to protect your family and grow your wealth
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleCategoryChange(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                activeCategory === id
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'border-gray-200 text-gray-600 hover:border-primary/50 bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-6">
            Showing {filteredProducts.length} plan{filteredProducts.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' ? ` in ${categories.find(c => c.id === activeCategory)?.label}` : ''}
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold text-lg mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FiSearch className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-lg">No plans found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or category filter</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }} className="btn-primary mt-6">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
