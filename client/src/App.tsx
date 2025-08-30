import { useState, useEffect } from 'react'
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
import Workspaces from './pages/Workspaces'
import Waitlist from './pages/Waitlist'
import WaitlistStatus from './pages/WaitlistStatus'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { useFirebaseAuth } from './hooks/useFirebaseAuth'
import LoadingSpinner from './components/LoadingSpinner'
import { useQuery } from '@tanstack/react-query'
import { apiRequest, queryClient } from '@/lib/queryClient'
import Profile from './pages/Profile'
import Integration from './pages/Integration'
import AutomationStepByStep from './pages/AutomationStepByStep'
import VideoGeneratorAdvanced from './pages/VideoGeneratorAdvanced'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import { GuidedTour } from './components/walkthrough/GuidedTour'

function App() {
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false)
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
  
  // Authentication and onboarding guard logic - STRICT ENFORCEMENT
  useEffect(() => {
    // Wait for both loading states to complete to prevent timing issues
    if (!loading && !userDataLoading) {
      console.log('Auth guard - User:', user?.email || 'Not authenticated', 'Location:', location)
      console.log('User data:', userData)
      console.log('Onboarding modal state:', isOnboardingModalOpen)
      
      // If user is authenticated and fully onboarded, allow full access
      if (user && userData && userData.isOnboarded) {
        if (location === '/signin' || location === '/signup' || location === '/onboarding') {
          console.log('Redirecting fully onboarded user to home page')
          setLocation('/')
        }
        // Close onboarding modal if open
        if (isOnboardingModalOpen) {
          console.log('Closing onboarding modal for completed user')
          setIsOnboardingModalOpen(false)
        }
      }
      
      // STRICT: If user is authenticated but NOT onboarded, FORCE onboarding modal
      else if (user && userData && !userData.isOnboarded) {
        console.log('🚨 ENFORCING ONBOARDING: User authenticated but not onboarded')
        
        // Always ensure modal is open for non-onboarded users
        if (!isOnboardingModalOpen) {
          console.log('🔴 OPENING ONBOARDING MODAL - User cannot proceed without onboarding')
          setIsOnboardingModalOpen(true)
        }
        
        // FORCE redirect away from auth pages to dashboard where modal will show
        if (location === '/signin' || location === '/signup') {
          console.log('🚀 FORCE REDIRECTING to dashboard for MANDATORY onboarding')
          console.log('🔀 Current location:', location, '-> Redirecting to /')
          setLocation('/')
          return // Exit early to prevent rendering auth page
        }
      }
      
      // If user is not authenticated, close modal and restrict access
      else if (!user && !loading) {
        if (isOnboardingModalOpen) {
          setIsOnboardingModalOpen(false)
        }
        if (location === '/onboarding') {
          console.log('Redirecting unauthenticated user to root page')
          setLocation('/')
        }
      }
    }
  }, [user, loading, userData, userDataLoading, location, setLocation, isOnboardingModalOpen])

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
    <>
    <Switch>
      {/* Waitlist pages - full screen without sidebar */}
      <Route path="/waitlist">
        <div className="min-h-screen">
          <Waitlist />
        </div>
      </Route>

      <Route path="/waitlist-status">
        <div className="min-h-screen">
          <WaitlistStatus />
        </div>
      </Route>

      {/* Authentication pages - full screen without sidebar */}
      <Route path="/signup">
        <div className="min-h-screen">
          <SignUpIntegrated />
        </div>
      </Route>
      
      <Route path="/signin">
        <div className="min-h-screen">
          <SignIn onNavigate={(page: string) => setLocation(`/${page}`)} />
        </div>
      </Route>

      {/* Removed old onboarding route - now handled by modal */}


      {/* Admin Login - Accessible to everyone */}
      <Route path="/admin-login">
        <div className="min-h-screen">
          <AdminLogin />
        </div>
      </Route>

      {/* Admin Panel - Accessible with admin token */}
      <Route path="/admin">
        <div className="min-h-screen bg-gray-50">
          <AdminPanel />
        </div>
      </Route>

      {/* Root route - Landing for unauthenticated, Dashboard for authenticated users (modal handles onboarding) */}
      <Route path="/">
        {!user && !hasFirebaseAuth ? (
          <div className="min-h-screen">
            <Landing onNavigate={(page: string) => setLocation(`/${page}`)} />
          </div>
        ) : !user && hasFirebaseAuth ? (
          <LoadingSpinner />
        ) : user && userData ? (
          // ONBOARDED users see dashboard
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

            {/* Onboarding Flow for new users */}
            {userData && !userData.isOnboarded && (
              <OnboardingFlow 
                open={isOnboardingModalOpen}
                userData={userData}
                onComplete={async (onboardingData) => {
                console.log('🎯 COMPLETING ONBOARDING with data:', onboardingData)
                try {
                  const response = await fetch('/api/user/complete-onboarding', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${await user?.getIdToken()}`
                    },
                    body: JSON.stringify({ preferences: onboardingData })
                  })
                  if (response.ok) {
                    console.log('✅ Onboarding completed successfully!')
                    
                    // First, close the onboarding modal immediately
                    setIsOnboardingModalOpen(false)
                    
                    // Invalidate and refetch user data in background
                    queryClient.invalidateQueries({ queryKey: ['/api/user'] })
                    
                    // Wait a bit for the modal to close, then start the guided tour
                    setTimeout(() => {
                      setIsWalkthroughOpen(true)
                    }, 500) // Small delay to ensure modal closes first
                  } else {
                    console.error('❌ Failed to complete onboarding')
                  }
                } catch (error) {
                  console.error('❌ Onboarding completion error:', error)
                }
              }}
              />
            )}
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </Route>

      {/* Protected routes with sidebar layout - STRICT: only accessible when authenticated AND onboarded */}
      {user && userData && userData.isOnboarded && (
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
          

          
          <Route path="/video-generator">
            <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
              {/* Sidebar - Fixed height with independent scrolling */}
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white border-r border-gray-200 h-full shadow-sm"
                  isCreateDropdownOpen={isCreateDropdownOpen}
                  setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                />
              </div>

              {/* Main Content Area - Cosmos Studio interface without VeeFore header */}
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Create Dropdown */}
                {isCreateDropdownOpen && (
                  <CreateDropdown
                    isOpen={isCreateDropdownOpen}
                    onClose={() => setIsCreateDropdownOpen(false)}
                    onOptionSelect={handleCreateOptionSelect}
                  />
                )}

                {/* Cosmos Studio Interface - Full height with scrolling */}
                <main className="flex-1 overflow-y-auto">
                  <VideoGeneratorAdvanced />
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

          {/* VeeGPT Route - with main sidebar */}
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

              {/* Main Content Area - VeeGPT takes full remaining space */}
              <div className="flex-1 h-screen overflow-hidden">
                <VeeGPT />
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

          {/* Privacy Policy Route - Public access */}
          <Route path="/privacy-policy">
            <PrivacyPolicy />
          </Route>

          {/* Terms of Service Route - Public access */}
          <Route path="/terms-of-service">
            <TermsOfService />
          </Route>
        </>
      )}
      
      {/* Public routes for legal pages - accessible without authentication */}
      <Route path="/privacy-policy">
        <PrivacyPolicy />
      </Route>

      <Route path="/terms-of-service">
        <TermsOfService />
      </Route>
      
    </Switch>

    {/* Guided Tour */}
    <GuidedTour
      isActive={isWalkthroughOpen}
      onClose={() => setIsWalkthroughOpen(false)}
    />
    </>
  )
}

export default App