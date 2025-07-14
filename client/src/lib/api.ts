import { auth } from './firebase'

export class ApiClient {
  private static async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null
    
    try {
      return await user.getIdToken()
    } catch (error) {
      console.error('Failed to get auth token:', error)
      return null
    }
  }

  static async request(url: string, options: RequestInit = {}) {
    const token = await this.getAuthToken()
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      window.location.href = '/'
      throw new Error('Authentication required')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async get(url: string) {
    return this.request(url, { method: 'GET' })
  }

  static async post(url: string, data?: any) {
    return this.request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async put(url: string, data?: any) {
    return this.request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  static async delete(url: string) {
    return this.request(url, { method: 'DELETE' })
  }
}

// Security helper functions
export const requireAuth = () => {
  if (!auth.currentUser) {
    window.location.href = '/'
    return false
  }
  return true
}

export const checkAuthStatus = () => {
  return !!auth.currentUser
}