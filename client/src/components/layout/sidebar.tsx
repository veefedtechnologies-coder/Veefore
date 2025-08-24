import React, { useState, useEffect } from 'react'
import { Home, Calendar, BarChart3, MessageSquare, Settings, Globe, LogOut, Users, Link, Plus, Zap, Video, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateDropdown } from './create-dropdown'
import { logout } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { useLocation } from 'wouter'
import { useUser } from '@/hooks/useUser'

const sidebarItems = [
  { icon: Home, label: 'Home', key: 'home', url: '/' },
  { icon: Calendar, label: 'Plan', key: 'plan', url: '/plan' },
  { icon: Plus, label: 'Create', key: 'create', isCreateButton: true },
  { icon: Video, label: 'Video Gen', key: 'video-generator', url: '/video-generator' },
  { icon: MessageSquare, label: 'Inbox 2.0', key: 'inbox', url: '/inbox' },
  { icon: BarChart3, label: 'Analytics', key: 'analytics', url: '/analytics' },
  { icon: Zap, label: 'Automation', key: 'automation', url: '/automation' },
  { icon: Link, label: 'Integration', key: 'integration', url: '/integration' },
  { icon: Users, label: 'Workspaces', key: 'workspaces', url: '/workspaces' },
  { icon: Shield, label: 'Admin Panel', key: 'admin', url: '/admin' },
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
    if (loc === '/video-generator') return 'video-generator'
    if (loc === '/veegpt') return 'veegpt'
    if (loc === '/inbox') return 'inbox'
    if (loc === '/analytics') return 'analytics'
    if (loc === '/automation') return 'automation'
    if (loc === '/integration') return 'integration'
    if (loc === '/workspaces') return 'workspaces'
    if (loc === '/admin') return 'admin'
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownOpen])

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
    <div className={cn("w-24 bg-white flex flex-col items-center py-6 min-h-full relative", className)}>
      {/* VeeGPT Logo */}
      <div 
        className={cn(
          "flex flex-col items-center cursor-pointer transition-all duration-500 group py-2 mb-4 transform-gpu veegpt-nav-item",
          activeView === 'veegpt' 
            ? "text-blue-600" 
            : "text-gray-500 hover:text-blue-600"
        )}
        data-nav="veegpt"
        onClick={() => setLocation('/veegpt')}
      >
        <div className={cn(
          "w-16 h-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl flex items-center justify-center transition-all duration-500 mb-2 shadow-lg border border-gray-200/50 backdrop-blur-sm relative overflow-hidden",
          activeView === 'veegpt' 
            ? "shadow-2xl border-2 border-blue-300 scale-110 bg-gradient-to-br from-blue-50 via-white to-blue-100 animate-morph-active" 
            : isExiting
            ? "animate-veegpt-exit shadow-lg border border-gray-200/50 bg-gradient-to-br from-gray-50 via-white to-gray-100"
            : "hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:via-white hover:to-purple-50 hover-morphing"
        )}>
          {/* Energy waves - show during active or when exiting */}
          {(activeView === 'veegpt' || isExiting) && (
            <>
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-400/20 to-transparent",
                isExiting ? "animate-energy-wave-exit-1" : "animate-energy-wave-1"
              )}></div>
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-purple-400/15 to-transparent",
                isExiting ? "animate-energy-wave-exit-2" : "animate-energy-wave-2"
              )}></div>
              <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-indigo-400/10 to-transparent",
                isExiting ? "animate-energy-wave-exit-3" : "animate-energy-wave-3"
              )}></div>
            </>
          )}
          
          {/* Geometric particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute w-1 h-1 bg-blue-500 animate-geometric-float-1 opacity-60" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
            <div className="absolute w-1 h-1 bg-purple-500 animate-geometric-float-2 opacity-50 rounded-full"></div>
            <div className="absolute w-0.5 h-3 bg-indigo-500 animate-geometric-float-3 opacity-70"></div>
            <div className="absolute w-2 h-0.5 bg-cyan-500 animate-geometric-float-4 opacity-40"></div>
          </div>
          
          {/* VeeFore Logo with morphing effects */}
          <img 
            src="/veefore-logo.png" 
            alt="VeeFore" 
            className={cn(
              "w-10 h-10 transition-all duration-500 filter drop-shadow-lg relative z-10",
              activeView === 'veegpt' 
                ? "scale-110 brightness-110 drop-shadow-xl animate-logo-morph" 
                : isExiting
                ? "animate-logo-exit drop-shadow-lg"
                : "group-hover:scale-115 group-hover:brightness-110 group-hover:drop-shadow-xl group-hover:animate-logo-hover-morph"
            )}
            style={{
              filter: activeView === 'veegpt' 
                ? 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.4)) brightness(1.1) hue-rotate(10deg)' 
                : isExiting
                ? 'brightness(0.8) hue-rotate(0deg)'
                : undefined
            }}
          />
        </div>
        
        {/* User Profile Information */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {userData?.displayName?.charAt(0)?.toUpperCase() || userData?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {userData?.displayName || userData?.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-500">
                {userData?.plan || 'Free'} Plan
              </div>
            </div>
          </div>
        </div>
        
        {/* Active indicator with enhanced animation */}
        {activeView === 'veegpt' && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-blue-400 via-blue-600 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
        )}
        
        {/* Glow effect when active */}
        {activeView === 'veegpt' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-purple-400/20 rounded-3xl blur-xl animate-pulse"></div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4 flex-1 bg-white">
        {sidebarItems.map((item, index) => (
          <div
            key={item.label}
            data-testid={item.isCreateButton ? "create-dropdown-trigger" : undefined}
            data-nav={item.key}
            onClick={(e) => {
              if (item.isCreateButton) {
                handleCreateClick(e)
              } else if (item.url) {
                setLocation(item.url)
              }
            }}
            className={cn(
              "flex flex-col items-center cursor-pointer transition-all duration-300 relative group py-2 sidebar-nav-item",
              activeView === item.key 
                ? "text-blue-600" 
                : "text-gray-500 hover:text-blue-600"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mb-1",
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
              activeView === item.key ? "text-blue-600 font-semibold" : "text-gray-600"
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
      <div className="flex flex-col space-y-4 mt-auto bg-white pt-2 pb-2">


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