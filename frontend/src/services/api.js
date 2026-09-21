import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor – attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hdfc_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor – global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hdfc_token')
      localStorage.removeItem('hdfc_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password })

export const registerUser = (data) =>
  api.post('/auth/register', data)

export const getMe = () =>
  api.get('/auth/me')

// ─── Products ────────────────────────────────────────────────────────────────
export const getProducts = (filters = {}) =>
  api.get('/products', { params: filters })

export const getProduct = (id) =>
  api.get(`/products/${id}`)

// ─── Calculator ──────────────────────────────────────────────────────────────
export const calculatePremium = (data) =>
  api.post('/calculator/calculate', data)

// ─── Leads ───────────────────────────────────────────────────────────────────
export const submitLead = (data) =>
  api.post('/leads', data)

// ─── Partners ────────────────────────────────────────────────────────────────
export const submitPartnerApplication = (data) =>
  api.post('/partners', data)


// ─── Blogs ───────────────────────────────────────────────────────────────────
export const getBlogs = (params = {}) =>
  api.get('/blogs', { params })

export const getBlog = (slug) =>
  api.get(`/blogs/${slug}`)

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const getDashboard = () =>
  api.get('/dashboard')

export const getPolicies = () =>
  api.get('/dashboard/policies')

export default api
