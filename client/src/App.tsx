import React, { useState, useEffect } from 'react'
import { Route, Switch, useLocation } from 'wouter'
import { Sidebar } from './components/layout/sidebar'
import { Header } from './components/layout/header'
import { CreateDropdown } from './components/layout/create-dropdown'
import { QuickActions } from './components/dashboard/quick-actions'
import { PerformanceScore } from './components/dashboard/performance-score'
import { Recommendations } from './components/dashboard/recommendations'
import { GetStarted } from './components/dashboard/get-started'
import { ScheduledPosts, Drafts } from './components/dashboard/scheduled-posts'
import { Listening } from './components/dashboard/listening'
import { SocialAccounts } from './components/dashboard/social-accounts'
import { ScheduledPostsSection } from './components/dashboard/scheduled-posts-section'
import { DraftsSection } from './components/dashboard/drafts-section'
import { CalendarView } from './components/calendar/calendar-view'
import { AnalyticsDashboard } from './components/analytics/analytics-dashboard'
import { CreatePost } from './components/create/create-post'
import VeeGPT from './pages/VeeGPT'
import Landing from './pages/Landing'
import SignUpIntegrated from './pages/SignUpIntegrated'
import SignIn from './pages/SignIn'
import ProfessionalOnboarding from './pages/ProfessionalOnboarding'
import Workspaces from './pages/Workspaces'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { useFirebaseAuth } from './hooks/useFirebaseAuth'
import LoadingSpinner from './components/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import Profile from './pages/Profile'
import Integration from './pages/Integration'
import AutomationStepByStep from './pages/AutomationStepByStep'

function App() {
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)
  const { user, loading } = useFirebaseAuth()
  const [location, setLocation] = useLocation()

  console.log('App component rendering:', { location, user: !!user, loading })

  // Fetch user data when authenticated
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user'),
    enabled: !!user && !loading,
    retry: false
  })
  
  // Authentication and onboarding guard logic
  useEffect(() => {
    // Wait for both loading states to complete to prevent timing issues
    if (!loading && !userDataLoading) {
      console.log('Auth guard - User:', user?.email || 'Not authenticated', 'Location:', location)
      console.log('User data:', userData)
      
      // If user is authenticated and fully onboarded, redirect from auth pages to home
      if (user && userData && userData.isOnboarded) {
        if (location === '/signin' || location === '/signup' || location === '/onboarding') {
          console.log('Redirecting fully onboarded user to home page')
          setLocation('/')
        }
      }
      
      // If user is authenticated but NOT onboarded, keep them on signup page
      else if (user && userData && !userData.isOnboarded) {
        if (location === '/signin' || location === '/onboarding') {
          console.log('Redirecting authenticated but not onboarded user to signup page')
          setLocation('/signup')
        }
        // Allow them to stay on /signup and root route
      }
      
      // If user is definitively not authenticated (not loading), redirect from protected routes
      else if (!user && !loading) {
        if (location === '/onboarding') {
          console.log('Redirecting unauthenticated user to root page')
          setLocation('/')
        }
        // Allow unauthenticated users to access /signup and /signin
      }
    }
  }, [user, loading, userData, userDataLoading, location, setLocation])

  // Show loading spinner while checking authentication and user data
  if (loading || (user && userDataLoading)) {
    return <LoadingSpinner />
  }
  
  // If we have evidence of existing authentication but no user yet, show loading
  const hasFirebaseAuth = Object.keys(localStorage).some(key => 
    key.includes('firebase:authUser') && localStorage.getItem(key)
  )
  
  if (hasFirebaseAuth && !user && loading) {
    return <LoadingSpinner />
  }

  const handleCreateOptionSelect = (option: string) => {
    setIsCreateDropdownOpen(false)
    console.log('Selected create option:', option)
  }

  return (
    <Switch>
      {/* Authentication pages - full screen without sidebar */}
      <Route path="/signup">
        <div className="min-h-screen">
          <SignUpIntegrated onNavigate={(page: string) => setLocation(`/${page}`)} />
        </div>
      </Route>
      
      <Route path="/signin">
        <div className="min-h-screen">
          <SignIn onNavigate={(page: string) => setLocation(`/${page}`)} />
        </div>
      </Route>

      {/* Onboarding page - full screen without sidebar */}
      <Route path="/onboarding">
        <div className="min-h-screen">
          <ProfessionalOnboarding />
        </div>
      </Route>

      {/* Root route - Landing for unauthenticated, Dashboard for authenticated & onboarded, Signup for authenticated but not onboarded */}
      <Route path="/">
        {!user && !hasFirebaseAuth ? (
          <div className="min-h-screen">
            <Landing onNavigate={(page: string) => setLocation(`/${page}`)} />
          </div>
        ) : !user && hasFirebaseAuth ? (
          <LoadingSpinner />
        ) : userData && !userData.isOnboarded ? (
          <div className="min-h-screen">
            <SignUpIntegrated onNavigate={(page: string) => setLocation(`/${page}`)} />
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
            {/* Sidebar - Fixed height with independent scrolling */}
            <div className="h-screen overflow-y-auto bg-white">
              <Sidebar 
                className="w-24 bg-white h-full"
                isCreateDropdownOpen={isCreateDropdownOpen}
                setIsCreateDropdownOpen={setIsCreateDropdownOpen}
              />
            </div>

            {/* Main Content Area - Independent scrolling */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Header */}
              <Header 
                onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
              />
              
              {/* Create Dropdown */}
              {isCreateDropdownOpen && (
                <CreateDropdown
                  isOpen={isCreateDropdownOpen}
                  onClose={() => setIsCreateDropdownOpen(false)}
                  onOptionSelect={handleCreateOptionSelect}
                />
              )}

              {/* Main Content - Scrollable */}
              <main className="flex-1 overflow-y-auto p-6">
                <>
                  {/* Quick Actions - Top Section */}
                  <div className="mb-8">
                    <QuickActions />
                  </div>
                  
                  {/* Main Dashboard Layout - Hootsuite Style */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Performance Score + Get Started + Scheduled Posts + Drafts */}
                    <div className="space-y-6">
                      <PerformanceScore />
                      <GetStarted />
                      <ScheduledPostsSection />
                      <DraftsSection />
                    </div>
                    
                    {/* Right Column - Recommendations + Social Accounts + Listening */}
                    <div className="space-y-6">
                      <Recommendations />
                      <SocialAccounts />
                      <Listening />
                    </div>
                  </div>
                </>
              </main>
            </div>
          </div>
        )}
      </Route>

      {/* Protected routes with sidebar layout - only accessible when authenticated */}
      {user && (
        <>
          <Route path="/plan">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <Tabs defaultValue="calendar" className="w-full">
                      <TabsList className="bg-white border border-gray-200">
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
                  </div>
                </main>
              </div>
            </div>
          </Route>
          
          <Route path="/create">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                  <CreatePost />
                </main>
              </div>
            </div>
          </Route>
          
          <Route path="/analytics">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                  <AnalyticsDashboard />
                </main>
              </div>
            </div>
          </Route>
          
          <Route path="/inbox">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Inbox 2.0</h3>
                    <p className="text-gray-600">Manage your social media conversations here.</p>
                  </div>
                </main>
              </div>
            </div>
          </Route>
          
          <Route path="/veegpt">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                  <VeeGPT />
                </main>
              </div>
            </div>
          </Route>
          
          <Route path="/workspaces">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto">
                  <Workspaces />
                </main>
              </div>
            </div>
          </Route>

          <Route path="/profile">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto">
                  <Profile />
                </main>
              </div>
            </div>
          </Route>

          <Route path="/integration">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                  <Integration />
                </main>
              </div>
            </div>
          </Route>

          <Route path="/automation">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto">
                  <AutomationStepByStep />
                </main>
              </div>
            </div>
          </Route>

          <Route path="/integrations">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Independent scrolling */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header 
                  onCreateClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                />
                
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                  <Integration />
                </main>
              </div>
            </div>
          </Route>
        </>
      )}
    </Switch>
  )
}

export default App