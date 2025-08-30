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

// Beautiful Workspace Transition Loading Overlay
const WorkspaceTransitionOverlay = ({ workspace }: { workspace: Workspace }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="text-center p-8 bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-md">
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getThemeGradientStatic(workspace.theme)} flex items-center justify-center text-white shadow-lg mx-auto animate-pulse`}>
            <Building2 className="w-8 h-8" />
          </div>
        </div>
        
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Switching to {workspace.name}</h3>
        <p className="text-gray-600 text-sm mb-4">Loading workspace data...</p>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>{getPersonalityIconStatic(workspace.aiPersonality)}</span>
            <span className="capitalize">{workspace.aiPersonality}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>{workspace.credits} credits</span>
          </div>
        </div>
        
        <div className="mt-6 w-full bg-gray-200 rounded-full h-1">
          <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  )
}

// Static helper functions for the overlay
const getThemeGradientStatic = (theme: string) => {
  switch (theme) {
    case 'space': return 'from-purple-500 to-indigo-600'
    case 'ocean': return 'from-blue-500 to-cyan-600'
    case 'forest': return 'from-green-500 to-emerald-600'
    case 'sunset': return 'from-orange-500 to-red-600'
    default: return 'from-gray-500 to-gray-600'
  }
}

const getPersonalityIconStatic = (personality: string) => {
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
  const [transitionWorkspace, setTransitionWorkspace] = useState<Workspace | null>(null)

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

  // Update current workspace in localStorage and state with beautiful transition
  const handleWorkspaceSwitch = async (workspaceId: string) => {
    const newWorkspace = workspaces.find((ws: Workspace) => ws.id === workspaceId)
    if (!newWorkspace) return
    
    // Show beautiful transition overlay
    setTransitionWorkspace(newWorkspace)
    setIsTransitioning(true)
    
    // Update workspace
    setCurrentWorkspaceId(workspaceId)
    localStorage.setItem('currentWorkspaceId', workspaceId)
    
    // Dispatch custom event to notify useCurrentWorkspace hook
    window.dispatchEvent(new Event('workspace-changed'))
    
    // Invalidate queries that depend on workspace
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['/api/content'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] })
    ])
    
    // Wait for transition animation (minimum 1.5 seconds for beauty)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Hide transition overlay
    setIsTransitioning(false)
    setTransitionWorkspace(null)
    
    toast({
      title: "✨ Workspace switched",
      description: `Welcome to ${newWorkspace.name}!`
    })
  }

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'space':
        return 'from-purple-500 to-indigo-600'
      case 'ocean':
        return 'from-blue-500 to-cyan-600'
      case 'forest':
        return 'from-green-500 to-emerald-600'
      case 'sunset':
        return 'from-orange-500 to-red-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'creative':
        return '🎨'
      case 'casual':
        return '😊'
      case 'technical':
        return '⚙️'
      case 'friendly':
        return '🤝'
      default:
        return '💼'
    }
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
      {/* Beautiful Workspace Transition Overlay */}
      {isTransitioning && transitionWorkspace && (
        <WorkspaceTransitionOverlay workspace={transitionWorkspace} />
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