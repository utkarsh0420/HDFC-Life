import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi'
import logoImage from '../assets/logo.jpg'

const footerLinks = {
  Products: [
    { name: 'Term Insurance', href: '/products?category=term' },
    { name: 'Investment Plans', href: '/products?category=investment' },
    { name: 'Health Insurance', href: '/products?category=health' },
    { name: 'Retirement Plans', href: '/products?category=retirement' },
    { name: 'Child Plans', href: '/products?category=child' },
  ],
  Company: [
    { name: 'About HDFC Life', href: '/#about' },
    { name: 'Leadership Team', href: '/#leadership' },
    { name: 'Press Releases', href: '/blogs?category=press' },
    { name: 'Awards & Recognition', href: '/#awards' },
    { name: 'Careers', href: '/#careers' },
    { name: 'Become a Partner', href: '/become-partner' },
  ],
  Support: [
    { name: 'Claim Settlement', href: '/#claims' },
    { name: 'Premium Calculator', href: '/calculator' },
    { name: 'Renew Policy', href: '/dashboard' },
    { name: 'Download Forms', href: '/#forms' },
    { name: 'Contact Us', href: '/#contact' },
  ],
}

const socialLinks = [
  { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiYoutube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
]

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img 
                src={logoImage} 
                alt="HDFC Life Logo" 
                className="h-10 w-auto object-contain bg-white p-1 rounded-md"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Securing millions of lives across India with comprehensive insurance and financial protection solutions since 2000.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <FiPhone className="text-gold shrink-0" />
                <span>1800-266-9777 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <FiMail className="text-gold shrink-0" />
                <span>care@hdfclife.com</span>
              </div>
              <div className="flex items-start gap-3 text-white/60 text-sm">
                <FiMapPin className="text-gold shrink-0 mt-0.5" />
                <span>13th Floor, Lodha Excelus, Apollo Mills Compound, Mumbai 400 013</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-sm tracking-wider uppercase text-gold mb-5">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors hover:pl-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/40 text-xs text-center md:text-left leading-relaxed">
              <p>© {new Date().getFullYear()} HDFC Life Insurance Company Limited. All rights reserved.</p>
              <p className="mt-1">IRDAI Registration No. 101 | CIN: L65110MH2000PLC128245</p>
              <p className="mt-1">Regd. Office: Lodha Excelus, 13th Floor, Apollo Mills Compound, N.M. Joshi Marg, Mahalaxmi, Mumbai - 400 013.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/40">
              <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white/70 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white/70 transition-colors">Disclaimer</a>
              <a href="#" className="hover:text-white/70 transition-colors">Sitemap</a>
            </div>
          </div>
          <p className="text-white/25 text-[10px] mt-4 leading-relaxed">
            Insurance is a subject matter of solicitation. HDFC Life Insurance Company Ltd. (Formerly HDFC Standard Life Insurance Company Ltd.) is only the name of the insurance company and does not in any way indicate the quality of the contract, its future prospects or returns. Please know the associated risks and the applicable charges from your Insurance agent or the Intermediary or policy document issued by the insurance company.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
