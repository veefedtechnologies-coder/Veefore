import { Switch, Route } from 'wouter'
import { useState, useEffect } from 'react'
import { useFirebaseAuth } from './hooks/useFirebaseAuth'
import { apiRequest } from './lib/queryClient'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Landing } from './pages/Landing'
import { Onboarding } from './pages/Onboarding'
import { Sidebar } from './components/layout/sidebar'
import { Header } from './components/layout/header'
import { CreateDropdown } from './components/layout/create-dropdown'
import { AnalyticsDashboard } from './components/analytics/analytics-dashboard'
import { CreatePost } from './components/create/create-post'
import { ProfessionalDashboard } from './components/dashboard/professional-dashboard'
import { VeeGPT } from './pages/VeeGPT'
import { VideoGeneratorTest } from './pages/VideoGeneratorTest'
import { CalendarView } from './components/calendar/calendar-view'
import { ScheduledPosts } from './components/dashboard/scheduled-posts'
import { Drafts } from './components/dashboard/drafts-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

export default function App() {
  const { user, loading } = useFirebaseAuth()
  const [userData, setUserData] = useState(null)
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const response = await apiRequest('/api/user/profile')
      setUserData(response)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleCreateOptionSelect = (option: string) => {
    setIsCreateDropdownOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Switch>
          <Route path="/signup">
            <SignUp onNavigate={(page: string) => window.location.href = `/${page}`} />
          </Route>
          
          <Route path="/signin">
            <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
          </Route>
          
          <Route path="/onboarding">
            <Onboarding />
          </Route>
          
          <Route path="/">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <Tabs defaultValue="calendar" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                        <TabsTrigger value="drafts">Drafts</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="dm-automation">DM automation</TabsTrigger>
                      </TabsList>
                      <TabsContent value="calendar" className="mt-6">
                        <CalendarView />
                      </TabsContent>
                      <TabsContent value="drafts" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <ScheduledPosts />
                          <Drafts />
                        </div>
                      </TabsContent>
                      <TabsContent value="content" className="mt-6">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Library</h3>
                          <p className="text-gray-600">Manage your content library and templates here.</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="dm-automation" className="mt-6">
                        <div className="text-center py-12">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">DM Automation</h3>
                          <p className="text-gray-600">Set up automated direct message responses.</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </main>
                </div>
              </div>
            ) : (
              <Landing />
            )}
          </Route>
          
          <Route path="/plan">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <ProfessionalDashboard />
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/create">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <CreatePost />
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/analytics">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <AnalyticsDashboard />
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/inbox">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Inbox 2.0</h3>
                      <p className="text-gray-600">Manage your social media conversations here.</p>
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/veegpt">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <VeeGPT />
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/video-generator">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto">
                    <VideoGeneratorTest />
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/workspaces">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Workspaces</h3>
                      <p className="text-gray-600">Manage your workspaces and team collaboration here.</p>
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/profile">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
                      <p className="text-gray-600">Manage your profile settings here.</p>
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/integration">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Integration</h3>
                      <p className="text-gray-600">Connect your social media accounts here.</p>
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/automation">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Automation</h3>
                      <p className="text-gray-600">Set up automated workflows here.</p>
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
          
          <Route path="/integrations">
            {user && userData ? (
              <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
                <div className="h-screen overflow-y-auto">
                  <Sidebar 
                    className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                    isCreateDropdownOpen={isCreateDropdownOpen}
                    setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                  />
                </div>
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                  <Header onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)} />
                  {isCreateDropdownOpen && (
                    <CreateDropdown
                      isOpen={isCreateDropdownOpen}
                      onClose={() => setIsCreateDropdownOpen(false)}
                      onOptionSelect={handleCreateOptionSelect}
                    />
                  )}
                  <main className="flex-1 overflow-y-auto p-6">
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrations</h3>
                      <p className="text-gray-600">Manage your app integrations here.</p>
                    </div>
                  </main>
                </div>
              </div>
            ) : (
              <SignIn onNavigate={(page: string) => window.location.href = `/${page}`} />
            )}
          </Route>
        </Switch>
      </div>
    </QueryClientProvider>
  )
}