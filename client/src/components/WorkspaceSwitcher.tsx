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

// Modern Full-Screen Loading Experience
const AdvancedWorkspaceTransition = ({ workspace }: { workspace: Workspace }) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[99999] bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center overflow-hidden" style={{ position: 'fixed', inset: 0 }}>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-advanced"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      {/* Main Loading Content */}
      <div className="text-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Large Workspace Icon with Pulse Animation */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Pulsing Rings */}
            <div className="absolute -inset-8 rounded-full border-2 border-white/20 animate-ping"></div>
            <div className="absolute -inset-6 rounded-full border-2 border-white/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -inset-4 rounded-full border border-white/40 animate-ping" style={{ animationDelay: '1s' }}></div>
            
            {/* Main Icon */}
            <div className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br ${getThemeGradient(workspace.theme)} flex items-center justify-center shadow-2xl animate-pulse-glow`}>
              <Building2 className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Modern Spinner */}
        <div className="flex justify-center mb-12">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-b-purple-400 border-l-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
        </div>

        {/* Loading Text with Animations */}
        <div className="mb-16 space-y-6">
          <h1 className="text-7xl font-black text-white mb-6 animate-in slide-in-from-bottom-4 duration-1000">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              {workspace.name}
            </span>
          </h1>
          
          <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-1000">
            <p className="text-2xl text-white/90 font-medium">Loading workspace environment</p>
            <div className="flex justify-center items-center space-x-2">
              <span className="text-lg text-white/70">Please wait</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-[500px] mx-auto mb-16 animate-in slide-in-from-bottom-6 duration-1000">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full animate-progress-flow" style={{ width: '80%' }}>
              <div className="h-full bg-white/30 animate-shimmer-advanced"></div>
            </div>
          </div>
          <div className="flex justify-between text-base text-white/70 mt-4">
            <span>Initializing workspace</span>
            <span className="font-bold">80%</span>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-4 animate-in slide-in-from-bottom-7 duration-1000">
          {[
            { step: 'Loading workspace data', status: 'complete', delay: '0s' },
            { step: 'Syncing social accounts', status: 'active', delay: '0.2s' },
            { step: 'Preparing dashboard', status: 'pending', delay: '0.4s' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center space-x-4 animate-bounce" style={{ animationDelay: item.delay }}>
              <div className={`w-4 h-4 rounded-full ${
                item.status === 'complete' ? 'bg-green-400' :
                item.status === 'active' ? 'bg-blue-400 animate-pulse' :
                'bg-white/30'
              }`}></div>
              <span className={`text-base font-medium ${
                item.status === 'complete' ? 'text-green-400' :
                item.status === 'active' ? 'text-blue-400' :
                'text-white/50'
              }`}>
                {item.step}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Workspace Info */}
      <div className="absolute bottom-12 left-12 right-12 animate-in slide-in-from-bottom-8 duration-1000">
        <div className="flex items-center justify-between text-white/70 text-base">
          <div className="flex items-center space-x-4">
            <div className="text-2xl">{getPersonalityIcon(workspace.aiPersonality)}</div>
            <span className="capitalize font-medium">{workspace.aiPersonality} Mode</span>
          </div>
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">{workspace.credits} Credits</span>
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