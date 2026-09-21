import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiUsers, FiFileText, FiActivity, FiSettings } from 'react-icons/fi'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-navy rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-white text-2xl">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-white/60 text-sm">Admin Portal</p>
              <h1 className="text-white font-black text-2xl">Welcome, {user?.username || 'Admin'}</h1>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: '1,234', icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Active Policies', value: '892', icon: FiFileText, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Partner Applications', value: '45', icon: FiActivity, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'System Settings', value: 'Manage', icon: FiSettings, color: 'text-gray-500', bg: 'bg-gray-100' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`${stat.color} w-6 h-6`} />
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-navy font-black text-2xl mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-navy mb-4">Recent Activity</h2>
          <div className="text-gray-500 text-sm py-8 text-center">
            No recent activity to show.
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
