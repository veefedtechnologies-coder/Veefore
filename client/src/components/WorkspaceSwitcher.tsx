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

// Advanced Workspace Transition Overlay with Stunning Animations
const AdvancedWorkspaceTransition = ({ workspace }: { workspace: Workspace }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Animated Blurred Background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl animate-in fade-in-0 duration-500" />
      
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Transition Card */}
      <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-5 duration-700 ease-out">
        
        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />
        
        {/* Content Container */}
        <div className="relative z-10">
          
          {/* Workspace Icon with Pulsing Effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getThemeGradient(workspace.theme)} flex items-center justify-center shadow-2xl animate-pulse`}>
                <Building2 className="w-10 h-10 text-white" />
              </div>
              
              {/* Ripple Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getThemeGradient(workspace.theme)} animate-ping opacity-30`} />
              <div className={`absolute inset-2 rounded-xl bg-gradient-to-br ${getThemeGradient(workspace.theme)} animate-ping opacity-20`} style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Advanced Spinning Loader */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute top-1 left-1 w-10 h-10 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute top-2 left-2 w-8 h-8 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
          </div>

          {/* Dynamic Workspace Information */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom-3 duration-700">
              Switching to
            </h2>
            <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-in slide-in-from-bottom-4 duration-700">
              {workspace.name}
            </h3>
            <p className="text-gray-600 animate-in slide-in-from-bottom-5 duration-700">
              Loading workspace environment...
            </p>
          </div>

          {/* Workspace Details with Icons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50/80 rounded-xl p-3 text-center animate-in slide-in-from-left duration-700">
              <div className="text-2xl mb-1">{getPersonalityIcon(workspace.aiPersonality)}</div>
              <div className="text-xs text-gray-600 font-medium capitalize">{workspace.aiPersonality}</div>
            </div>
            <div className="bg-gray-50/80 rounded-xl p-3 text-center animate-in slide-in-from-right duration-700">
              <Sparkles className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-xs text-gray-600 font-medium">{workspace.credits} Credits</div>
            </div>
          </div>

          {/* Advanced Progress Bar */}
          <div className="space-y-3 mb-4">
            <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse transition-all duration-1000 ease-out" style={{ width: '75%' }}>
                <div className="h-full bg-white/30 animate-pulse rounded-full"></div>
              </div>
            </div>
            
            {/* Status Messages */}
            <div className="text-center">
              <div className="text-sm text-gray-500 animate-pulse">
                Syncing workspace data...
              </div>
            </div>
          </div>

          {/* Floating Action Indicators */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500 animate-bounce" style={{ animationDelay: '0s' }}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 animate-bounce" style={{ animationDelay: '0.3s' }}>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Social Accounts</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 animate-bounce" style={{ animationDelay: '0.6s' }}>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Content</span>
            </div>
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