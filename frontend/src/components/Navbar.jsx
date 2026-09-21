import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  FiMenu, FiX, FiChevronDown, FiUser, FiLogOut,
  FiGrid, FiFileText, FiShield, FiTrendingUp, FiHeart, FiSunrise
} from 'react-icons/fi'
import logoImage from '../assets/logo.jpg'

const productCategories = [
  { name: 'Term Insurance', icon: FiShield, desc: 'Pure life cover', href: '/products?category=term' },
  { name: 'Investment Plans', icon: FiTrendingUp, desc: 'Grow your wealth', href: '/products?category=investment' },
  { name: 'Health Insurance', icon: FiHeart, desc: 'Stay protected', href: '/products?category=health' },
  { name: 'Retirement Plans', icon: FiSunrise, desc: 'Plan your future', href: '/products?category=retirement' },
]

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Calculator', href: '/calculator' },
  { name: 'Blogs', href: '/blogs' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dropRef = useRef(null)
  const userDropRef = useRef(null)

  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false)
      if (userDropRef.current && !userDropRef.current.contains(e.target)) setUserDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setUserDropOpen(false)
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage ? 'bg-navy shadow-xl shadow-navy/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={logoImage} 
              alt="HDFC Life Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 bg-white p-1 rounded-md"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-primary bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Home
            </NavLink>

            {/* Products Dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                Products
                <FiChevronDown
                  className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-2">
                      {productCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          to={cat.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group transition-colors"
                        >
                          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <cat.icon className="text-primary w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-navy font-semibold text-sm">{cat.name}</p>
                            <p className="text-gray-400 text-xs">{cat.desc}</p>
                          </div>
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Link
                          to="/products"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 p-3 rounded-lg hover:bg-primary/5 text-primary font-semibold text-sm transition-colors"
                        >
                          <FiGrid className="w-4 h-4" />
                          View All Products
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-primary bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <NavLink
              to="/become-partner"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-gold bg-gold/10' : 'text-gold hover:text-amber-400 hover:bg-gold/10'
                }`
              }
            >
              Become a Partner
            </NavLink>
          </div>

          {/* Right – Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={userDropRef}>
                <button
                  onClick={() => setUserDropOpen(!userDropOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-xl"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-white text-sm font-medium">{user?.username}</span>
                  <FiChevronDown className={`text-white/60 transition-transform ${userDropOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      <Link
                        to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setUserDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-navy text-sm font-medium transition-colors"
                      >
                        <FiGrid className="w-4 h-4 text-primary" />
                        Dashboard
                      </Link>
                      <Link
                        to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setUserDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-navy text-sm font-medium transition-colors"
                      >
                        <FiFileText className="w-4 h-4 text-primary" />
                        My Policies
                      </Link>
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm font-medium w-full transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: 'Calculator', href: '/calculator' }, { name: 'Blogs', href: '/blogs' }].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/become-partner"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gold hover:text-amber-400 hover:bg-gold/10 font-semibold transition-colors"
              >
                ✦ Become a Partner
              </Link>
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-medium transition-colors">
                      Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 font-medium transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-medium transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg bg-primary text-white font-semibold text-center">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
