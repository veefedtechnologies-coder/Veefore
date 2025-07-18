import React from 'react'

export function ProfessionalDashboard() {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Dashboard</h2>
        <p className="text-gray-600">Welcome to your professional dashboard. Manage your account and features here.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Status</h3>
          <p className="text-gray-600">Your account is active and ready to use.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Details</h3>
          <p className="text-gray-600">Current plan: Professional</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Stats</h3>
          <p className="text-gray-600">Monitor your usage and analytics.</p>
        </div>
      </div>
    </div>
  )
}