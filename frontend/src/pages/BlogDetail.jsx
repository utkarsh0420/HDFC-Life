import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCalendar, FiUser, FiTag, FiShare2,
  FiTwitter, FiLinkedin, FiFacebook, FiClock } from 'react-icons/fi'
import { getBlog } from '../services/api'
import { toast } from 'react-toastify'

const mockBlog = {
  _id: '1',
  slug: 'term-insurance-guide-2026',
  title: 'Complete Guide to Term Insurance in 2026',
  category: 'Insurance Tips',
  author: 'Rahul Verma',
  author_bio: 'Senior Financial Advisor at HDFC Life with 12+ years of experience in life insurance and financial planning.',
  date: '2026-09-15',
  readTime: '5 min read',
  image: 'https://placehold.co/1200x600/0D1B2A/ffffff?text=Term+Insurance+Guide',
  tags: ['term insurance', 'life cover', 'guide', 'financial planning'],
  content: `
## What is Term Insurance?

Term insurance is the purest form of life insurance that provides financial protection to your family in case of your untimely demise. Unlike traditional life insurance plans, term insurance offers a **high sum assured at a very affordable premium**.

## Why Do You Need Term Insurance in 2026?

With rising inflation and increasing family financial responsibilities, having an adequate life cover has become more important than ever. Here are the key reasons:

1. **Income Replacement**: If you are the primary breadwinner, term insurance ensures your family can maintain their lifestyle even in your absence.

2. **Debt Protection**: Outstanding loans (home loan, car loan, education loan) can burden your family. Term insurance helps pay off these debts.

3. **Children's Education**: Secure your children's educational future regardless of what happens to you.

4. **Tax Benefits**: Premiums paid are deductible under Section 80C (up to ₹1.5 lakh) and the death benefit is tax-free under Section 10(10D).

## How to Choose the Right Term Insurance Plan?

### Step 1: Calculate Your Coverage Need
A good thumb rule is to have life cover that is **10-12 times your annual income**. If you earn ₹10 lakh per year, you should have at least ₹1-1.2 crore of coverage.

### Step 2: Choose the Right Policy Term
Your policy term should cover you until your retirement age (typically 60-65 years). If you are 30 years old, opt for a 30-35 year term.

### Step 3: Compare Premium Quotes
Use online calculators to compare premiums across different insurers. Always choose a company with a high **Claim Settlement Ratio (CSR)**.

### Step 4: Check Additional Riders
Consider adding riders like:
- **Critical Illness Rider**: Pays a lump sum on diagnosis of serious illness
- **Accidental Death Benefit**: Extra payout in case of accidental death
- **Premium Waiver Rider**: Waives future premiums if you become disabled

## HDFC Life's Term Insurance Plans

HDFC Life offers several term insurance options:

- **Click 2 Protect Life**: Pure term plan with high coverage at low premiums
- **Click 2 Protect Super**: Enhanced plan with return of premium option
- **Sanchay Term Plan**: Guaranteed income variant with survival benefits

## Conclusion

Term insurance is not an expense — it's an investment in your family's security. With premiums starting as low as ₹700/month for ₹1 crore cover, there's no reason to delay getting protected.

*Start your term insurance journey today with HDFC Life's [Premium Calculator](/calculator).*
  `,
}

const relatedBlogs = [
  { slug: 'ulip-vs-mutual-fund', title: 'ULIP vs Mutual Fund: Which is Better for You?', category: 'Investment', image: 'https://placehold.co/400x250/1A2E45/ffffff?text=ULIP+vs+MF', readTime: '7 min read' },
  { slug: 'health-insurance-tax-benefit', title: 'How Health Insurance Saves You Tax Under Section 80D', category: 'Tax Planning', image: 'https://placehold.co/400x250/B71C1C/ffffff?text=Tax+Benefits', readTime: '4 min read' },
  { slug: 'retirement-planning-30s', title: '5 Retirement Planning Mistakes to Avoid in Your 30s', category: 'Investment', image: 'https://placehold.co/400x250/0D1B2A/F5A623?text=Retirement', readTime: '6 min read' },
]

const BlogDetail = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getBlog(slug)
        setBlog(res.data)
      } catch {
        setBlog({ ...mockBlog, slug })
      } finally {
        setLoading(false)
      }
    }
    fetch()
    window.scrollTo(0, 0)
  }, [slug])

  const handleShare = (platform) => {
    const url = window.location.href
    const title = blog?.title || 'HDFC Life Blog'
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-navy font-medium">Loading article...</p>
        </div>
      </div>
    )
  }

  // Parse basic markdown-like content to JSX
  const renderContent = (content) => {
    const lines = content.trim().split('\n')
    const elements = []
    let i = 0
    while (i < lines.length) {
      const line = lines[i].trim()
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-navy mt-8 mb-3">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-bold text-navy mt-6 mb-2">{line.slice(4)}</h3>)
      } else if (line.startsWith('- ')) {
        const items = []
        while (i < lines.length && lines[i].trim().startsWith('- ')) {
          items.push(<li key={i} className="text-gray-700">{lines[i].trim().slice(2)}</li>)
          i++
        }
        elements.push(<ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-3 pl-2">{items}</ul>)
        continue
      } else if (/^\d+\./.test(line)) {
        const items = []
        while (i < lines.length && /^\d+\./.test(lines[i].trim())) {
          items.push(<li key={i} className="text-gray-700">{lines[i].trim().replace(/^\d+\.\s*/, '')}</li>)
          i++
        }
        elements.push(<ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-3 pl-2">{items}</ol>)
        continue
      } else if (line) {
        // Handle bold
        const withBold = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy font-bold">$1</strong>')
        // Handle links
        const withLinks = withBold.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
        elements.push(
          <p key={i} className="text-gray-600 leading-relaxed my-3 text-base"
            dangerouslySetInnerHTML={{ __html: withLinks }}
          />
        )
      }
      i++
    }
    return elements
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-gray-400 hover:text-navy transition-colors text-sm mb-6">
          <FiArrowLeft /> Back to Blogs
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">{blog.category}</span>
              <span className="flex items-center gap-1 text-gray-400 text-xs"><FiClock size={12} />{blog.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-navy mb-4 leading-tight">{blog.title}</h1>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {blog.author?.[0]}
                  </div>
                  {blog.author}
                </span>
                <span className="flex items-center gap-1.5"><FiCalendar size={13} />{new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Share:</span>
                {[
                  { icon: FiTwitter, platform: 'twitter', color: 'hover:bg-sky-500' },
                  { icon: FiLinkedin, platform: 'linkedin', color: 'hover:bg-blue-700' },
                  { icon: FiFacebook, platform: 'facebook', color: 'hover:bg-blue-600' },
                ].map(({ icon: Icon, platform, color }) => (
                  <button key={platform} onClick={() => handleShare(platform)}
                    className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center ${color} hover:text-white transition-all`}>
                    <Icon size={14} />
                  </button>
                ))}
                <button onClick={handleCopyLink}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                  <FiShare2 size={14} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <img src={blog.image} alt={blog.title} className="w-full h-64 md:h-96 object-cover rounded-3xl mb-8 shadow-lg" />

          {/* Article Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 mb-8">
            {renderContent(blog.content || '')}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-gray-400 text-sm flex items-center gap-1"><FiTag size={14} />Tags:</span>
            {blog.tags?.map((tag) => (
              <span key={tag} className="bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-500 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors capitalize">
                {tag}
              </span>
            ))}
          </div>

          {/* Author Box */}
          {blog.author_bio && (
            <div className="bg-navy/5 border border-navy/10 rounded-2xl p-6 mb-8 flex gap-4 items-start">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0">
                {blog.author?.[0]}
              </div>
              <div>
                <p className="text-navy font-bold">{blog.author}</p>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">{blog.author_bio}</p>
              </div>
            </div>
          )}

          {/* Related Articles */}
          <div>
            <h2 className="text-navy font-black text-2xl mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/blogs/${rel.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all card-hover"
                >
                  <img src={rel.image} alt={rel.title} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <span className="text-xs text-primary font-semibold">{rel.category}</span>
                    <h3 className="text-navy font-bold text-sm mt-1 line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h3>
                    <p className="text-gray-400 text-xs mt-2">{rel.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}

export default BlogDetail
