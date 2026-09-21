import { formatCurrency } from '../utils/currency'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getDashboard, getPolicies } from '../services/api'
import { FiShield, FiFileText, FiPhone, FiDownload, FiAlertCircle,
  FiTrendingUp, FiCalendar, FiUser, FiCheck, FiClock, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-200' },
  lapsed: { label: 'Lapsed', color: 'bg-red-100 text-red-700 border-red-200' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  matured: { label: 'Matured', color: 'bg-blue-100 text-blue-700 border-blue-200' },
}

const mockDashboard = {
  total_policies: 3,
  total_coverage: 15000000,
  next_premium_due: '2026-10-15',
  next_premium_amount: 25600,
  profile_complete: 75,
}

const mockPolicies = [
  { id: 'HDFC-TRM-001', name: 'Click 2 Protect Life', type: 'Term', sum_assured: 10000000, premium: 8500, due_date: '2026-10-15', status: 'active', start_date: '2020-10-15', end_date: '2050-10-15' },
  { id: 'HDFC-ULP-002', name: 'ProGrowth Plus', type: 'ULIP', sum_assured: 3000000, premium: 25000, due_date: '2026-11-01', status: 'active', start_date: '2022-11-01', end_date: '2042-11-01' },
  { id: 'HDFC-SAV-003', name: 'Sanchay Plus', type: 'Savings', sum_assured: 2000000, premium: 18000, due_date: '2026-09-30', status: 'pending', start_date: '2023-09-30', end_date: '2043-09-30' },
]

const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [dashData, setDashData] = useState(mockDashboard)
  const [policies, setPolicies] = useState(mockPolicies)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dashRes, polRes] = await Promise.all([getDashboard(), getPolicies()])
        
        const fetchedPolicies = polRes.data?.policies || polRes.data || []
        setPolicies(fetchedPolicies.length > 0 ? fetchedPolicies : mockPolicies)
        
        if (dashRes.data && dashRes.data.summary) {
          // Find next premium due from policies
          let nextDue = null
          let nextAmount = 0
          if (fetchedPolicies.length > 0) {
            const activePolicies = fetchedPolicies.filter(p => p.status === 'active')
            if (activePolicies.length > 0) {
              const sorted = activePolicies.sort((a, b) => new Date(a.due_date || a.end_date) - new Date(b.due_date || b.end_date))
              nextDue = sorted[0].due_date || sorted[0].end_date
              nextAmount = sorted[0].premium
            }
          }
          
          setDashData({
            total_policies: dashRes.data.summary.total_policies,
            total_coverage: dashRes.data.summary.total_coverage,
            next_premium_due: nextDue || mockDashboard.next_premium_due,
            next_premium_amount: nextAmount || mockDashboard.next_premium_amount,
            profile_complete: 100, // Profile is complete if they have real data
          })
        } else {
          setDashData(dashRes.data || mockDashboard)
        }
      } catch {
        // Use mock data when backend not available
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const daysUntilDue = dashData.next_premium_due
    ? Math.max(0, Math.ceil((new Date(dashData.next_premium_due) - new Date()) / (1000 * 60 * 60 * 24)))
    : null

  const statCards = [
    { icon: FiShield, label: 'Total Policies', value: dashData.total_policies, sub: 'Active plans', color: 'from-blue-500 to-blue-600' },
    { icon: FiTrendingUp, label: 'Total Coverage', value: formatCurrency(dashData.total_coverage), sub: 'Sum assured', color: 'from-green-500 to-green-600' },
    { icon: FiCalendar, label: 'Next Premium Due', value: dashData.next_premium_due ? new Date(dashData.next_premium_due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A', sub: daysUntilDue ? `In ${daysUntilDue} days` : '', color: daysUntilDue && daysUntilDue < 7 ? 'from-red-500 to-red-600' : 'from-amber-500 to-amber-600' },
    { icon: FiFileText, label: 'Premium Amount', value: formatCurrency(dashData.next_premium_amount), sub: 'Including GST', color: 'from-purple-500 to-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center font-black text-white text-2xl">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-white/60 text-sm">Welcome back,</p>
                <h1 className="text-white font-black text-2xl">{user?.username || 'Customer'}</h1>
                <p className="text-white/50 text-xs">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href="tel:18002669777" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                <FiPhone size={14} /> Support
              </a>
            </div>
          </div>

          {/* Profile completion */}
          {dashData.profile_complete < 100 && (
            <div className="mt-5 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-xs">Profile Completion</span>
                <span className="text-gold text-xs font-bold">{dashData.profile_complete}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-gold h-2 rounded-full transition-all duration-1000" style={{ width: `${dashData.profile_complete}%` }} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="text-white w-5 h-5" />
              </div>
              <p className="text-navy font-black text-lg leading-tight">{card.value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{card.label}</p>
              {card.sub && <p className="text-gray-300 text-xs">{card.sub}</p>}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Policies Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-navy font-bold text-lg">My Policies</h2>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {policies.length} Active
                </span>
              </div>

              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {policies.map((policy) => {
                    const status = statusConfig[policy.status] || statusConfig.active
                    return (
                      <motion.div
                        key={policy.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center shrink-0">
                              <FiShield className="text-navy w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-navy font-bold text-sm">{policy.name}</p>
                              <p className="text-gray-400 text-xs">{policy.id} · {policy.type}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                Coverage: <span className="text-navy font-semibold">{formatCurrency(policy.sum_assured)}</span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                              {status.label}
                            </span>
                            <p className="text-gray-400 text-xs mt-2">Due: {new Date(policy.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                            <p className="text-primary font-bold text-sm">{formatCurrency(policy.premium)}/yr</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy border border-gray-200 px-3 py-1.5 rounded-lg hover:border-navy transition-all">
                            <FiDownload size={12} /> Download
                          </button>
                          <button
                            onClick={() => toast.info('Claim process initiated. Our team will contact you.')}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy border border-gray-200 px-3 py-1.5 rounded-lg hover:border-navy transition-all"
                          >
                            <FiAlertCircle size={12} /> File Claim
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-navy font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: FiAlertCircle, label: 'File a Claim', color: 'text-red-500', onClick: () => toast.info('Redirecting to claim portal...') },
                  { icon: FiDownload, label: 'Download Policy', color: 'text-blue-500', onClick: () => toast.info('Download initiated.') },
                  { icon: FiPhone, label: 'Contact Support', color: 'text-green-500', onClick: () => toast.info('Support: 1800-266-9777') },
                  { icon: FiUser, label: 'Update Profile', color: 'text-purple-500', onClick: () => toast.info('Profile update coming soon.') },
                ].map(({ icon: Icon, label, color, onClick }) => (
                  <button key={label} onClick={onClick}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                    <Icon className={`${color} w-5 h-5`} />
                    <span className="text-navy text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-navy font-bold mb-4">Profile</h3>
              <div className="space-y-3">
                {[
                  { label: 'Name', value: user?.username || '—' },
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Member Since', value: '2022' },
                  { label: 'KYC Status', value: 'Verified', badge: 'bg-green-100 text-green-700' },
                ].map(({ label, value, badge }) => (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{label}</span>
                    {badge ? (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>{value}</span>
                    ) : (
                      <span className="text-navy font-semibold truncate max-w-[120px]">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
