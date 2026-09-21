import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser, getMe } from '../services/api'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('hdfc_token'))
  const [loading, setLoading] = useState(true)

  // On mount, try to restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('hdfc_token')
    const storedUser = localStorage.getItem('hdfc_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  // Persist token in axios default headers whenever it changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = useCallback(async (email, password) => {
    const response = await loginUser(email, password)
    const { token: jwt, user: userData } = response.data
    localStorage.setItem('hdfc_token', jwt)
    localStorage.setItem('hdfc_user', JSON.stringify(userData))
    setToken(jwt)
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (data) => {
    const response = await registerUser(data)
    const { token: jwt, user: userData } = response.data
    localStorage.setItem('hdfc_token', jwt)
    localStorage.setItem('hdfc_user', JSON.stringify(userData))
    setToken(jwt)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('hdfc_token')
    localStorage.removeItem('hdfc_user')
    setToken(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe()
      setUser(res.data)
      localStorage.setItem('hdfc_user', JSON.stringify(res.data))
    } catch {
      logout()
    }
  }, [logout])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
