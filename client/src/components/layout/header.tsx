import React from 'react'
import { Bell, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import WorkspaceSwitcher from '../WorkspaceSwitcher'
import { ProfileDropdown } from '../ProfileDropdown'
import { useUser } from '@/hooks/useUser'
import { useLocation } from 'wouter'

interface HeaderProps {
  className?: string
  onCreateClick?: () => void
}

export function Header({ className, onCreateClick }: HeaderProps) {
  const [location, setLocation] = useLocation()
  const { userData } = useUser()

  const getDisplayName = () => {
    if (userData?.displayName) return userData.displayName
    if (userData?.email) {
      // Extract name from email (before @)
      const emailName = userData.email.split('@')[0]
      // Convert username format to readable name
      return emailName.replace(/_\d+$/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    return 'User'
  }

  return (
    <header className={cn("h-28 bg-white/98 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-10 shadow-lg flex-shrink-0", className)}>
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        <div className="flex flex-col space-y-3">
          {/* Trial Badge */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-2.5 rounded-2xl border border-blue-200/60 shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-700 tracking-wide">TRIAL ENDS IN 25 DAYS</span>
          </div>
          
          {/* Welcome Message */}
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
              Welcome, {getDisplayName()}!
            </h1>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search posts, analytics, insights..."
            className="pl-14 pr-8 py-4 border border-gray-200/60 rounded-2xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400/60 w-80 text-sm font-medium placeholder-gray-500 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative w-14 h-14 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-600 rounded-full text-xs flex items-center justify-center shadow-lg">
            <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
          </span>
        </Button>

        {/* Workspace Switcher */}
        <WorkspaceSwitcher onNavigateToWorkspaces={() => setLocation('/workspaces')} />

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  )
}