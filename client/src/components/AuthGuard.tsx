import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLocation } from 'wouter'

interface AuthGuardProps {
  children: ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth()
  const [location, setLocation] = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/signin', '/signup', '/forgot-password']
  
  // If user is not authenticated and trying to access protected route
  if (!user && !publicRoutes.includes(location)) {
    // Redirect to landing page
    setLocation('/')
    return null
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (user && (location === '/signin' || location === '/signup')) {
    setLocation('/home')
    return null
  }

  return <>{children}</>
}

export default AuthGuard