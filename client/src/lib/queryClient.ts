import { QueryClient } from '@tanstack/react-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Never consider data stale
      retry: false,
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnReconnect: false, // Don't refetch when network reconnects
      refetchOnMount: false, // Don't refetch when component mounts
      refetchInterval: false, // Disable automatic polling
      refetchIntervalInBackground: false, // Disable background polling
    },
  },
})

// API request function with authentication
export async function apiRequest(url: string, options: RequestInit = {}) {
  const { getAuth } = await import('firebase/auth')
  const auth = getAuth()
  const user = auth.currentUser

  let headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add auth token if user is authenticated
  if (user) {
    try {
      const token = await user.getIdToken()
      headers = {
        ...headers,
        'Authorization': `Bearer ${token}`,
      }
      console.log('API Request with auth token to:', url)
    } catch (error) {
      console.error('Failed to get Firebase auth token:', error)
      throw new Error('Authentication failed - please refresh the page')
    }
  } else {
    console.error('No authenticated user found for API request:', url)
    throw new Error('Please sign in to continue')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('API Error:', response.status, response.statusText, errorData)
    throw new Error(`${response.status}: ${response.statusText} - ${errorData}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  
  return response.text()
}