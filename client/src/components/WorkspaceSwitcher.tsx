import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  Settings, 
  Crown,
  Check,
  Users,
  Sparkles
} from 'lucide-react'

// Ultra-Modern Workspace Transition with Spectacular Animations
const AdvancedWorkspaceTransition = ({ workspace }: { workspace: Workspace }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xl">
      {/* Dynamic Animated Background with Moving Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-3xl animate-in fade-in-0 duration-1000" />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${i % 3 === 0 ? 'w-3 h-3 rounded-full' : i % 3 === 1 ? 'w-2 h-8 rounded-full' : 'w-4 h-1 rounded-full'} bg-gradient-to-r from-cyan-400/40 to-blue-500/40 animate-float-advanced`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Spectacular Main Card with Glass Morphism */}
      <div className="relative bg-white/15 backdrop-blur-3xl rounded-[2.5rem] border border-white/30 shadow-[0_40px_80px_rgba(0,0,0,0.6)] p-16 max-w-2xl w-full mx-8 animate-in zoom-in-95 slide-in-from-bottom-6 duration-1000 ease-out">
        
        {/* Animated Rainbow Border */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-cyan-400/40 via-blue-500/40 via-purple-500/40 to-pink-500/40 animate-gradient-x" />
        <div className="absolute inset-[2px] rounded-[2.5rem] bg-black/20 backdrop-blur-3xl" />
        
        {/* Content with Advanced Animations */}
        <div className="relative z-10">
          
          {/* Spectacular Workspace Icon */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              {/* Multiple Rotating Rings */}
              <div className="absolute -inset-12 rounded-full border-2 border-cyan-400/40 animate-spin-slow"></div>
              <div className="absolute -inset-9 rounded-full border-2 border-blue-400/50 animate-spin-reverse"></div>
              <div className="absolute -inset-6 rounded-full border-2 border-purple-400/60 animate-spin-slow"></div>
              
              {/* Main Icon with Enhanced Glow */}
              <div className={`relative w-32 h-32 rounded-[2rem] bg-gradient-to-br ${getThemeGradient(workspace.theme)} flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-pulse-glow`}>
                <Building2 className="w-16 h-16 text-white drop-shadow-2xl" />
                
                {/* Inner Glow Effect */}
                <div className="absolute inset-0 rounded-[2rem] bg-white/25 animate-pulse-subtle" />
              </div>
              
              {/* Orbiting Particles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-cyan-400/90 rounded-full animate-orbit shadow-lg"
                  style={{
                    animationDelay: `${i * 0.4}s`,
                    transformOrigin: '0 0',
                    left: '50%',
                    top: '50%'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Futuristic Loading Spinner */}
          <div className="flex justify-center mb-10">
            <div className="relative w-20 h-20">
              {/* Multiple Spinning Rings */}
              <div className="absolute inset-0 border-4 border-cyan-200/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin shadow-lg"></div>
              <div className="absolute inset-2 border-4 border-transparent border-r-blue-400 rounded-full animate-spin-reverse shadow-lg"></div>
              <div className="absolute inset-4 border-4 border-transparent border-b-purple-400 rounded-full animate-spin shadow-lg" style={{ animationDuration: '3s' }}></div>
              
              {/* Center Dot */}
              <div className="absolute inset-7 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>

          {/* Dynamic Text with Gradient Animation */}
          <div className="text-center mb-10">
            <h2 className="text-xl font-semibold text-white/90 mb-4 animate-in slide-in-from-bottom-4 duration-1000">
              Switching to
            </h2>
            <h1 className="text-5xl font-black mb-6 animate-in slide-in-from-bottom-5 duration-1000">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-lg">
                {workspace.name}
              </span>
            </h1>
            <p className="text-white/70 text-lg font-medium animate-in slide-in-from-bottom-6 duration-1000">
              Preparing your workspace environment...
            </p>
          </div>

          {/* Modern Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/30 shadow-lg animate-in slide-in-from-left duration-1000">
              <div className="text-4xl mb-3 animate-bounce">{getPersonalityIcon(workspace.aiPersonality)}</div>
              <div className="text-white/90 text-base font-semibold capitalize">{workspace.aiPersonality}</div>
              <div className="text-white/70 text-sm">AI Mode</div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/30 shadow-lg animate-in slide-in-from-right duration-1000">
              <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-3 animate-pulse" />
              <div className="text-white/90 text-base font-semibold">{workspace.credits}</div>
              <div className="text-white/70 text-sm">Credits</div>
            </div>
          </div>

          {/* Advanced Progress Visualization */}
          <div className="space-y-6 mb-8">
            <div className="relative h-4 bg-white/15 rounded-full overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full animate-progress-flow shadow-lg" style={{ width: '85%' }}>
                <div className="h-full bg-white/40 animate-shimmer-advanced rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-white/90 text-base font-medium animate-pulse">
                Loading workspace data...
              </div>
            </div>
          </div>

          {/* Futuristic Status Indicators */}
          <div className="flex justify-center space-x-8">
            {[
              { name: 'Analytics', color: 'bg-green-400', delay: '0s' },
              { name: 'Social', color: 'bg-blue-400', delay: '0.2s' },
              { name: 'Content', color: 'bg-purple-400', delay: '0.4s' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 animate-bounce" style={{ animationDelay: item.delay }}>
                <div className={`w-4 h-4 ${item.color} rounded-full animate-pulse-glow shadow-lg`}></div>
                <span className="text-white/80 text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get theme gradients
const getThemeGradient = (theme: string) => {
  switch (theme) {
    case 'space': return 'from-purple-500 to-indigo-600'
    case 'ocean': return 'from-blue-500 to-cyan-600'
    case 'forest': return 'from-green-500 to-emerald-600'
    case 'sunset': return 'from-orange-500 to-red-600'
    default: return 'from-gray-500 to-gray-600'
  }
}

// Helper function for personality icons
const getPersonalityIcon = (personality: string) => {
  switch (personality) {
    case 'creative': return '🎨'
    case 'casual': return '😊'
    case 'technical': return '⚙️'
    case 'friendly': return '🤝'
    default: return '💼'
  }
}


interface Workspace {
  id: string
  name: string
  description?: string
  theme: string
  aiPersonality: string
  isDefault: boolean
  maxTeamMembers: number
  credits: number
  createdAt: string
}

interface WorkspaceSwitcherProps {
  onNavigateToWorkspaces?: () => void
}

export default function WorkspaceSwitcher({ onNavigateToWorkspaces }: WorkspaceSwitcherProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(
    localStorage.getItem('currentWorkspaceId')
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetWorkspace, setTargetWorkspace] = useState<Workspace | null>(null)

  // Fetch user's workspaces
  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['/api/workspaces'],
    queryFn: () => apiRequest('/api/workspaces'),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Get current workspace
  const currentWorkspace = workspaces.find((ws: Workspace) => 
    currentWorkspaceId ? ws.id === currentWorkspaceId : ws.isDefault
  ) || workspaces.find((ws: Workspace) => ws.isDefault) || workspaces[0]

  // Advanced workspace switching with beautiful animation
  const handleWorkspaceSwitch = async (workspaceId: string) => {
    const workspace = workspaces.find((ws: Workspace) => ws.id === workspaceId)
    if (!workspace) return
    
    // Start beautiful transition
    setTargetWorkspace(workspace)
    setIsTransitioning(true)
    
    // Update workspace immediately
    setCurrentWorkspaceId(workspaceId)
    localStorage.setItem('currentWorkspaceId', workspaceId)
    
    // Dispatch custom event to notify useCurrentWorkspace hook
    window.dispatchEvent(new Event('workspace-changed'))
    
    // Invalidate queries that depend on workspace with animation timing
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['/api/content'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] })
    ])
    
    // Show beautiful animation for at least 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // End transition
    setIsTransitioning(false)
    setTargetWorkspace(null)
    
    toast({
      title: "🚀 Workspace Ready!",
      description: `Welcome to ${workspace.name} workspace`
    })
  }


  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
    )
  }

  if (!currentWorkspace) {
    return (
      <Button
        variant="outline"
        onClick={onNavigateToWorkspaces}
        className="flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Create Workspace</span>
      </Button>
    )
  }

  return (
    <>
      {/* Beautiful Advanced Workspace Transition */}
      {isTransitioning && targetWorkspace && (
        <AdvancedWorkspaceTransition workspace={targetWorkspace} />
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-3 h-auto p-2 hover:bg-gray-100 rounded-xl">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getThemeGradient(currentWorkspace.theme)} flex items-center justify-center text-white shadow-sm`}>
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-left">
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900 text-sm">{currentWorkspace.name}</span>
                {currentWorkspace.isDefault && (
                  <Crown className="w-3 h-3 text-yellow-500" />
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center space-x-1">
                <span>{getPersonalityIcon(currentWorkspace.aiPersonality)}</span>
                <span>{currentWorkspace.credits} credits</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-80 p-2">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Switch Workspace</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToWorkspaces}
            className="h-6 text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Manage
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-1">
          {workspaces.map((workspace: Workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => handleWorkspaceSwitch(workspace.id)}
              className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getThemeGradient(workspace.theme)} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                <Building2 className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 text-sm truncate">{workspace.name}</span>
                  {workspace.isDefault && (
                    <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                  )}
                  {workspace.id === currentWorkspace.id && (
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span>{getPersonalityIcon(workspace.aiPersonality)}</span>
                    <span className="capitalize">{workspace.aiPersonality}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{workspace.credits}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{workspace.maxTeamMembers}</span>
                  </div>
                </div>
                
                {workspace.description && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{workspace.description}</p>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={onNavigateToWorkspaces}
          className="flex items-center space-x-2 p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Create New Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

// Hook to get current workspace ID (reactive to localStorage changes)
export function useCurrentWorkspace() {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(
    localStorage.getItem('currentWorkspaceId')
  )
  
  // Listen for localStorage changes to keep hook reactive
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentWorkspaceId(localStorage.getItem('currentWorkspaceId'))
    }
    
    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab localStorage changes
    window.addEventListener('workspace-changed', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('workspace-changed', handleStorageChange)
    }
  }, [])
  
  const { data: workspaces = [] } = useQuery({
    queryKey: ['/api/workspaces'],
    queryFn: () => apiRequest('/api/workspaces'),
    staleTime: 5 * 60 * 1000
  })

  const currentWorkspace = workspaces.find((ws: Workspace) => 
    currentWorkspaceId ? ws.id === currentWorkspaceId : ws.isDefault
  ) || workspaces.find((ws: Workspace) => ws.isDefault) || workspaces[0]

  return {
    currentWorkspace,
    currentWorkspaceId: currentWorkspace?.id || null,
    workspaces
  }
}