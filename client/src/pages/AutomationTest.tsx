import React from 'react'

export default function AutomationTest() {
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Automation Test Page</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg text-gray-700">
            This is a test page to debug the automation routing issue.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            If you can see this page, the routing is working correctly.
          </p>
        </div>
      </div>
    </div>
  )
}