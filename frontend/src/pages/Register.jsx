import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCheck, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import logoImage from '../assets/logo.jpg'

const getStrength = (pwd) => {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const strength = getStrength(form.password)
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== ''

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) { toast.error('Please agree to the terms and conditions'); return }
    if (!passwordsMatch) { toast.error('Passwords do not match'); return }
    if (strength < 2) { toast.error('Please use a stronger password'); return }
    setLoading(true)
    try {
      const userData = await register({ username: form.username, email: form.email, phone: form.phone, password: form.password })
      toast.success('Account created! Welcome to HDFC Life!')
      setTimeout(() => {
        if (userData?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }, 1200)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-2/5 gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full translate-y-40 -translate-x-40" />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <img 
            src={logoImage} 
            alt="HDFC Life Logo" 
            className="h-12 w-auto object-contain bg-white p-1 rounded-md"
          />
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-4">Start Your Journey to Financial Security</h2>
          <p className="text-white/70 mb-6 leading-relaxed">
            Join 6 crore+ Indians who trust HDFC Life for their financial protection needs.
          </p>
          <div className="space-y-3">
            {['Free account – no hidden fees', 'Instant policy issuance online', 'Dedicated relationship manager', '24/7 customer support'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80 text-sm">
                <FiCheck className="text-gold shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} HDFC Life Insurance. IRDAI Reg. 101
        </p>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <img 
              src={logoImage} 
              alt="HDFC Life Logo" 
              className="h-10 w-auto object-contain bg-white p-1 rounded-md"
            />
          </div>

          <h1 className="text-3xl font-black text-navy mb-2">Create Account</h1>
          <p className="text-gray-400 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="label-field">Username *</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" value={form.username} onChange={update('username')} required
                    placeholder="rahul_sharma" className="input-field pl-11 text-sm" />
                </div>
              </div>
              {/* Phone */}
              <div>
                <label className="label-field">Phone *</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="tel" value={form.phone} onChange={update('phone')} required
                    placeholder="9876543210" className="input-field pl-11 text-sm" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label-field">Email Address *</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" value={form.email} onChange={update('email')} required
                  placeholder="you@example.com" className="input-field pl-11 text-sm" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label-field">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={update('password')} required
                  placeholder="Create a strong password" className="input-field pl-11 pr-11 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Password strength: <span className="font-semibold">{strengthLabels[strength]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label-field">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={update('confirmPassword')} required
                  placeholder="Confirm your password" className="input-field pl-11 pr-11 text-sm" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {form.confirmPassword && (
                <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-primary" />
              <span className="text-sm text-gray-500 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>.
                I consent to being contacted by HDFC Life advisors.
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={loading || !agreed}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</>
              ) : (
                <>Create Account <FiArrowRight /></>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
