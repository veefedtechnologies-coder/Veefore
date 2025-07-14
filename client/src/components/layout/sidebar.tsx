import React, { useState, useEffect } from 'react'
import { Home, Calendar, Edit3, BarChart3, MessageSquare, Settings, User, Building2, TrendingUp, PieChart, Globe, LogOut, Users, Link, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateDropdown } from './create-dropdown'
import veeGPTLogo from '@assets/output-onlinepngtools_1752443706727.png'
import { logout } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { useLocation } from 'wouter'
import { useUser } from '@/hooks/useUser'

const sidebarItems = [
  { icon: Home, label: 'Home', key: 'home', url: '/' },
  { icon: Calendar, label: 'Plan', key: 'plan', url: '/plan' },
  { icon: Plus, label: 'Create', key: 'create', isCreateButton: true },
  { icon: MessageSquare, label: 'Inbox 2.0', key: 'inbox', url: '/inbox' },
  { icon: BarChart3, label: 'Analytics', key: 'analytics', url: '/analytics' },
  { icon: Link, label: 'Integration', key: 'integration', url: '/integration' },
  { icon: Users, label: 'Workspaces', key: 'workspaces', url: '/workspaces' },
  { icon: Globe, label: 'Landing', key: 'landing', url: '/landing' },
]

interface SidebarProps {
  className?: string
  isCreateDropdownOpen?: boolean
  setIsCreateDropdownOpen?: (open: boolean) => void
}

export function Sidebar({ className, isCreateDropdownOpen, setIsCreateDropdownOpen }: SidebarProps) {
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [location, setLocation] = useLocation()
  const [prevActiveView, setPrevActiveView] = useState('')
  const dropdownOpen = isCreateDropdownOpen ?? localDropdownOpen
  const setDropdownOpen = setIsCreateDropdownOpen ?? setLocalDropdownOpen
  const { toast } = useToast()
  const { userData } = useUser()

  // Convert URL to activeView for backwards compatibility
  const getActiveViewFromLocation = (loc: string) => {
    if (loc === '/') return 'home'
    if (loc === '/plan') return 'plan'
    if (loc === '/create') return 'create'
    if (loc === '/veegpt') return 'veegpt'
    if (loc === '/inbox') return 'inbox'
    if (loc === '/analytics') return 'analytics'
    if (loc === '/integration') return 'integration'
    if (loc === '/workspaces') return 'workspaces'
    if (loc === '/landing') return 'landing'
    return 'home'
  }

  const activeView = getActiveViewFromLocation(location)

  // Handle smooth exit animation ONLY when leaving VeeGPT
  useEffect(() => {
    console.log('Exit Effect - prevActiveView:', prevActiveView, 'activeView:', activeView, 'isExiting:', isExiting)
    
    // Only trigger exit animation when coming FROM veegpt TO another page
    if (prevActiveView === 'veegpt' && activeView !== 'veegpt') {
      console.log('🎯 TRIGGERING EXIT ANIMATION - Leaving VeeGPT from', prevActiveView, 'to', activeView)
      setIsExiting(true)
      // Reset exit state and update prevActiveView after animation completes
      const timer = setTimeout(() => {
        console.log('🔄 EXIT ANIMATION COMPLETE - Resetting state')
        setIsExiting(false)
        setPrevActiveView(activeView) // Update to current view AFTER animation
      }, 1200) // Match the exit animation duration
      return () => clearTimeout(timer)
    } else {
      // Update previous view immediately for non-VeeGPT transitions
      setPrevActiveView(activeView)
    }
  }, [activeView, prevActiveView])

  const handleCreateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Create button clicked, current state:', dropdownOpen)
    setDropdownOpen(!dropdownOpen)
    console.log('Create button clicked, new state will be:', !dropdownOpen)
  }

  const handleCreateOptionSelect = (option: string) => {
    setDropdownOpen(false)
    console.log('Selected create option:', option)
    // Handle the selected option here
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn("w-24 bg-gray-100 flex flex-col items-center py-6 min-h-full relative", className)}>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4 flex-1">
        {sidebarItems.map((item, index) => (
          <div
            key={item.label}
            onClick={(e) => {
              if (item.isCreateButton) {
                handleCreateClick(e)
              } else if (item.url) {
                setLocation(item.url)
              }
            }}
            className={cn(
              "flex flex-col items-center cursor-pointer transition-all duration-300 relative group py-2",
              activeView === item.key 
                ? "text-blue-600" 
                : "text-gray-500 hover:text-blue-600"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-1 relative",
              activeView === item.key 
                ? "bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg border border-blue-200/50" 
                : "hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
            )}>
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300",
                activeView === item.key ? "scale-110" : "group-hover:scale-105"
              )} />
              {item.isCreateButton && dropdownOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse"></div>
              )}
            </div>
            
            {/* Icon Label */}
            <span className={cn(
              "text-xs font-medium transition-all duration-300",
              activeView === item.key 
                ? "text-blue-600 font-semibold" 
                : "text-gray-600"
            )}>
              {item.label}
            </span>
            
            {/* Active indicator */}
            {activeView === item.key && (
              <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            )}


          </div>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col space-y-4 mt-auto">


        <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-blue-600 transition-all duration-300 group py-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md transition-all duration-300 mb-1">
            <Settings className="w-5 h-5 group-hover:scale-105 transition-transform duration-300" />
          </div>
          <span className="text-xs font-medium text-gray-600">Settings</span>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer py-2 hover:scale-105 transition-all duration-300"
          onClick={() => setLocation('/profile')}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center hover-lift shadow-lg mb-1 relative overflow-hidden">
            {userData?.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {userData?.displayName ? userData.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
                 userData?.email ? userData.email.split('@')[0].slice(0, 2).toUpperCase() : 
                 'U'}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600">Profile</span>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer py-2 hover:text-red-600 transition-colors duration-300"
          onClick={handleLogout}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center hover-lift shadow-lg mb-1">
            <LogOut className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-600">Logout</span>
        </div>
      </div>
      
      {/* Create Dropdown */}
      <CreateDropdown 
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        onOptionSelect={handleCreateOptionSelect}
      />

    </div>
  )
}