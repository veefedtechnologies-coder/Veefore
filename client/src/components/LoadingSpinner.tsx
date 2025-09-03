const LoadingSpinner = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: '#f9fafb', // Light gray background by default
        color: '#111827'
      }}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Initializing...</p>
        <p className="text-gray-400 text-xs mt-2">This should only take a moment</p>
      </div>
    </div>
  )
}

export default LoadingSpinner