const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Initializing...</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">This should only take a moment</p>
      </div>
    </div>
  )
}

export default LoadingSpinner