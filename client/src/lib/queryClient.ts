import { QueryClient } from '@tanstack/react-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
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
    const token = await user.getIdToken()
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`,
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`${response.status}: ${response.statusText} - ${errorData}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  
  return response.text()
}