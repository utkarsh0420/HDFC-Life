import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import logoImage from '../assets/logo.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, user } = useAuth()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const userData = await login(email, password)
      toast.success('Welcome back! Redirecting...')
      setTimeout(() => {
        if (userData?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }, 1000)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorations */}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black text-white mb-4">
              Welcome Back to <span className="text-gold">HDFC Life</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Access your policies, track claims, and manage your insurance portfolio all in one place.
            </p>
            <div className="space-y-4">
              {[
                'View all your active policies',
                'Track claim status in real-time',
                'Download policy documents instantly',
                'Pay premiums with one click',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-white/80">
                  <div className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-gold text-xs">✓</span>
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <FiShield className="text-gold w-8 h-8 shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Bank-Grade Security</p>
              <p className="text-white/50 text-xs">256-bit SSL encryption protects your data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <img 
              src={logoImage} 
              alt="HDFC Life Logo" 
              className="h-10 w-auto object-contain bg-white p-1 rounded-md"
            />
          </div>

          <h1 className="text-3xl font-black text-navy mb-2">Sign In</h1>
          <p className="text-gray-400 mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one →</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label-field mb-0">Password</label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-12 pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-gray-400">OR</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 leading-relaxed">
            By signing in, you agree to HDFC Life's{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>

          <div className="mt-8 flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <FiShield className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-600">
              Your session is protected with 256-bit SSL encryption. HDFC Life will never ask for your OTP or password.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
