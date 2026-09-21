import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiCalendar, FiUser, FiArrowRight, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getBlogs } from '../services/api'

const categories = ['All', 'Insurance Tips', 'Investment', 'Health', 'Tax Planning', 'Claims', 'Press Release']

const mockBlogs = [
  { _id: '1', slug: 'term-insurance-guide-2026', title: 'Complete Guide to Term Insurance in 2026', category: 'Insurance Tips', author: 'Rahul Verma', date: '2026-09-15', excerpt: 'Everything you need to know about buying the right term insurance plan for your family in 2026.', image: 'https://placehold.co/600x400/0D1B2A/ffffff?text=Term+Insurance', readTime: '5 min read', tags: ['term insurance', 'life cover', 'guide'] },
  { _id: '2', slug: 'ulip-vs-mutual-fund', title: 'ULIP vs Mutual Fund: Which is Better for You?', category: 'Investment', author: 'Priya Nair', date: '2026-09-10', excerpt: 'A detailed comparison of ULIPs and Mutual Funds to help you make the right investment decision.', image: 'https://placehold.co/600x400/1A2E45/ffffff?text=ULIP+vs+MF', readTime: '7 min read', tags: ['ULIP', 'mutual fund', 'investment'] },
  { _id: '3', slug: 'health-insurance-tax-benefit', title: 'How Health Insurance Saves You Tax Under Section 80D', category: 'Tax Planning', author: 'Suresh Kumar', date: '2026-09-05', excerpt: 'Maximize your tax savings by understanding the Section 80D deductions available on health insurance premiums.', image: 'https://placehold.co/600x400/B71C1C/ffffff?text=Tax+Benefits', readTime: '4 min read', tags: ['tax', 'section 80D', 'health insurance'] },
  { _id: '4', slug: 'retirement-planning-30s', title: '5 Retirement Planning Mistakes to Avoid in Your 30s', category: 'Investment', author: 'Anjali Mehta', date: '2026-09-01', excerpt: 'Start your retirement journey on the right foot by avoiding these common financial planning mistakes.', image: 'https://placehold.co/600x400/0D1B2A/F5A623?text=Retirement', readTime: '6 min read', tags: ['retirement', 'planning', 'investment'] },
  { _id: '5', slug: 'claim-settlement-process', title: 'How to File a Life Insurance Claim: Step-by-Step Guide', category: 'Claims', author: 'Ravi Shankar', date: '2026-08-25', excerpt: 'A comprehensive guide on how to file a life insurance claim smoothly and get the settlement quickly.', image: 'https://placehold.co/600x400/1A2E45/ffffff?text=Claims+Guide', readTime: '8 min read', tags: ['claims', 'settlement', 'guide'] },
  { _id: '6', slug: 'child-education-plan', title: 'Best Child Education Insurance Plans in India 2026', category: 'Insurance Tips', author: 'Meera Iyer', date: '2026-08-20', excerpt: 'Secure your child\'s educational future with the right insurance-cum-investment plan. Review of top options.', image: 'https://placehold.co/600x400/0D1B2A/ffffff?text=Child+Plans', readTime: '5 min read', tags: ['child plan', 'education', 'savings'] },
]

const ITEMS_PER_PAGE = 6

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getBlogs({ category: activeCategory !== 'All' ? activeCategory : undefined, page })
        setBlogs(res.data?.blogs || res.data || mockBlogs)
      } catch {
        setBlogs(mockBlogs)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [activeCategory, page])

  const filtered = blogs.filter((b) => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white mb-4"
          >
            Insurance Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg mb-6 max-w-2xl mx-auto"
          >
            Expert tips, guides, and updates to help you make smarter financial decisions
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-auto"
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 shadow-xl focus:outline-none focus:ring-2 focus:ring-gold text-navy"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-gray-400 text-sm mb-6">{filtered.length} articles found</p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <FiSearch className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">No articles found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((blog, i) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover flex flex-col"
              >
                <div className="relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><FiUser size={12} />{blog.author}</span>
                    <span className="flex items-center gap-1"><FiCalendar size={12} />{new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h2 className="text-navy font-bold text-base mb-2 line-clamp-2 flex-1">{blog.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                        <FiTag size={10} />{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all group"
                  >
                    Read Article <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:border-primary disabled:opacity-40 transition-colors">
              <FiChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'border border-gray-200 hover:border-primary text-gray-600'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:border-primary disabled:opacity-40 transition-colors">
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blogs
