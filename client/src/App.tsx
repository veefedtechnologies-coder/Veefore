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
import WalkthroughModal from './components/walkthrough/WalkthroughModal'
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

      {/* VeeGPT Route - Accessible to everyone */}
      <Route path="/veegpt">
        <div className="min-h-screen">
          <VeeGPT />
        </div>
      </Route>

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
                    {/* Temporary Walkthrough Trigger */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          console.log('🎯 WALKTHROUGH: Button clicked, opening modal...')
                          console.log('🎯 WALKTHROUGH: Current isWalkthroughOpen state:', isWalkthroughOpen)
                          setIsWalkthroughOpen(true)
                          console.log('🎯 WALKTHROUGH: setIsWalkthroughOpen(true) called')
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                      >
                        🎯 Start Walkthrough
                      </button>
                    </div>
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

            {/* ONBOARDING DISABLED - USER IS ALREADY ONBOARDED */}
            {false && userData && (
              <OnboardingFlow 
                open={false}
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
                    // Immediately open walkthrough modal
                    setIsWalkthroughOpen(true)
                    // Invalidate and refetch user data in background
                    queryClient.invalidateQueries({ queryKey: ['/api/user'] })
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
      
      {/* Walkthrough Modal - Direct JSX without IIFE */}
      {isWalkthroughOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.9)', // RED background to make it VERY visible
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999 // Much higher z-index
          }}
          onClick={() => {
            console.log('🎯 DIRECT JSX: Background clicked, closing modal')
            setIsWalkthroughOpen(false)
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              🎯 VeeFore Walkthrough
            </h1>
            <p style={{ marginBottom: '2rem', color: '#6b7280', fontSize: '1.1rem' }}>
              Welcome, {userData?.displayName || userData?.fullName || user?.email?.split('@')[0] || 'User'}! 
              <br />This DIRECT JSX modal should DEFINITELY work!
            </p>
            <button 
              onClick={() => {
                console.log('🎯 DIRECT JSX: Close button clicked')
                setIsWalkthroughOpen(false)
              }}
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              ✨ Close Modal
            </button>
          </div>
        </div>
      )}
    </Switch>
  )
}

export default App