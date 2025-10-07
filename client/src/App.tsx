import { useState, useEffect, useRef } from 'react'
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
import InstagramWebhookListener from './components/dashboard/instagram-webhook-listener'
import { ScheduledPostsSection } from './components/dashboard/scheduled-posts-section'
import { DraftsSection } from './components/dashboard/drafts-section'
import { CalendarView } from './components/calendar/calendar-view'
import { AnalyticsDashboard } from './components/analytics/analytics-dashboard'
import { CreatePost } from './components/create/create-post'
import VeeGPT from './pages/VeeGPT'
import Landing from './pages/Landing'
import Landing3D from './pages/Landing3D'
import Landing3DAdvanced from './pages/Landing3DAdvanced'
import SplineKeyboardLanding from './pages/SplineKeyboardLanding'
import RobotHeroLanding from './pages/RobotHeroLanding'
import GlobalLandingPage from './pages/GlobalLandingPage'
import SignUpIntegrated from './pages/SignUpIntegrated'
import SignIn from './pages/SignIn'
import Workspaces from './pages/Workspaces'
import Waitlist from './pages/Waitlist'
import WaitlistStatus from './pages/WaitlistStatus'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { useFirebaseAuth } from './hooks/useFirebaseAuth'
import { useWorkspaceValidation } from './hooks/useWorkspaceValidation'
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
import Settings from './pages/Settings'
import InstagramDiagnostics from './pages/InstagramDiagnostics'
import SecurityDashboard from './pages/SecurityDashboard'
import { GuidedTour } from './components/walkthrough/GuidedTour'
import { initializeTheme } from './lib/theme'
// P6: Frontend SEO, Accessibility & UX System
import { initializeP6System, P6Provider, ToastContainer } from './lib/p6-integration'
// P7: Accessibility System
import { initializeAccessibilityCompliance, useAccessibilityRouteAnnouncements } from './lib/accessibility-compliance'
// P11: Mobile & Cross-Platform Excellence
import { initializeMobileExcellence } from './lib/mobile-excellence'
// P7: SEO, Core Web Vitals & Accessibility Excellence
import { initializeSEO } from './lib/seo-optimization';
import { initializeCoreWebVitals } from './lib/core-web-vitals';
import { initializeComponentModernization } from './lib/component-modernization';

function App() {
  // Initialization guards to prevent re-initialization
  const themeInitialized = useRef(false);
  const p6Initialized = useRef(false);
  const accessibilityInitialized = useRef(false);
  const mobileInitialized = useRef(false);
  const seoInitialized = useRef(false);
  const webVitalsInitialized = useRef(false);
  const componentModernizationInitialized = useRef(false);

  // Always call hooks at the top level - never inside conditions
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false)
  const { user, loading } = useFirebaseAuth()
  const [location, setLocation] = useLocation()

  // CRITICAL FIX: Workspace validation to prevent production bugs
  const workspaceValidation = useWorkspaceValidation()
  
  // Debug workspace validation status
  useEffect(() => {
    if (workspaceValidation.isCorrected) {
      console.log('🚀 [APP] Workspace ID was auto-corrected!', {
        workspaceName: workspaceValidation.currentWorkspace?.name,
        workspaceId: workspaceValidation.currentWorkspaceId,
        timestamp: new Date().toISOString()
      })
    }
  }, [workspaceValidation.isCorrected, workspaceValidation.currentWorkspace, workspaceValidation.currentWorkspaceId])

  // 🚀 INSTANT ACTIVATION: Track user activity for hibernation management
  useEffect(() => {
    console.log('[USER ACTIVITY DEBUG] useEffect triggered:', {
      user: !!user,
      loading,
      workspaceId: workspaceValidation.currentWorkspaceId,
      location: location
    })
    
    // Track user activity when workspace changes or user navigates
    if (user && !loading && workspaceValidation.currentWorkspaceId) {
      console.log('[USER ACTIVITY DEBUG] ✅ Conditions met - starting user activity tracking')
      
      const trackUserActivity = async () => {
        try {
          console.log('[USER ACTIVITY DEBUG] 🔄 Calling /api/instagram/user-activity with workspaceId:', workspaceValidation.currentWorkspaceId)
          
          const response = await apiRequest('/api/instagram/user-activity', {
            method: 'POST',
            body: JSON.stringify({
              workspaceId: workspaceValidation.currentWorkspaceId
            })
          })
          
          console.log('[USER ACTIVITY DEBUG] 📡 Response received:', response)
          
          // Handle skipped responses (e.g., due to tunnel issues)
          if (response.skipped) {
            console.log('[USER ACTIVITY DEBUG] ⏭️ Request skipped due to tunnel issues, continuing normally')
            return
          }
          
          if (response.activated) {
            console.log(`🚀 [INSTANT ACTIVATION] User activated Instagram polling for ${response.username}`)
            
            // Force refresh polling status to update UI immediately
            console.log('[INSTANT ACTIVATION] 🔄 Invalidating polling status query to update UI')
            queryClient.invalidateQueries({ queryKey: ['/api/instagram/polling-status'] })
            
            // Also refresh social accounts data
            queryClient.invalidateQueries({ queryKey: ['/api/social-accounts', workspaceValidation.currentWorkspaceId] })
          } else {
            console.log(`📱 [USER ACTIVITY] User activity tracked for workspace ${workspaceValidation.currentWorkspaceId}`)
          }
        } catch (error) {
          console.warn('[USER ACTIVITY] Failed to track user activity:', error)
        }
      }

      // Track immediately on mount/navigation
      console.log('[USER ACTIVITY DEBUG] 🚀 Calling trackUserActivity immediately')
      trackUserActivity()

      // Track periodically while user is active (every 5 minutes)
      const activityInterval = setInterval(() => {
        console.log('[USER ACTIVITY DEBUG] ⏰ Periodic user activity tracking')
        trackUserActivity()
      }, 5 * 60 * 1000)

      return () => {
        console.log('[USER ACTIVITY DEBUG] 🧹 Cleaning up user activity tracking')
        clearInterval(activityInterval)
      }
    } else {
      console.log('[USER ACTIVITY DEBUG] ❌ Conditions not met:', {
        user: !!user,
        loading,
        workspaceId: workspaceValidation.currentWorkspaceId
      })
    }
  }, [user, loading, workspaceValidation.currentWorkspaceId, location])

  // 🚀 FORCE ACTIVATION: Additional useEffect to ensure user activity is tracked on every page load
  useEffect(() => {
    // Force user activity tracking on every page load (with delay to ensure dependencies are ready)
    const forceUserActivity = () => {
      if (user && !loading && workspaceValidation.currentWorkspaceId) {
        console.log('[FORCE ACTIVATION] 🚀 Forcing user activity tracking on page load')
        
        const trackUserActivity = async () => {
          try {
            console.log('[FORCE ACTIVATION] 🔄 Calling /api/instagram/user-activity with workspaceId:', workspaceValidation.currentWorkspaceId)
            
            const response = await apiRequest('/api/instagram/user-activity', {
              method: 'POST',
              body: JSON.stringify({
                workspaceId: workspaceValidation.currentWorkspaceId
              })
            })
            
            console.log('[FORCE ACTIVATION] 📡 Response received:', response)
            
            // Handle skipped responses (e.g., due to tunnel issues)
            if (response.skipped) {
              console.log('[FORCE ACTIVATION] ⏭️ Request skipped due to tunnel issues, continuing normally')
              return
            }
            
            if (response.activated) {
              console.log(`🚀 [FORCE ACTIVATION] User activated Instagram polling for ${response.username}`)
              
              // Force refresh polling status to update UI immediately
              console.log('[FORCE ACTIVATION] 🔄 Invalidating polling status query to update UI')
              queryClient.invalidateQueries({ queryKey: ['/api/instagram/polling-status'] })
              
              // Also refresh social accounts data
              queryClient.invalidateQueries({ queryKey: ['/api/social-accounts', workspaceValidation.currentWorkspaceId] })
            } else {
              console.log(`📱 [FORCE ACTIVATION] User activity tracked for workspace ${workspaceValidation.currentWorkspaceId}`)
            }
          } catch (error) {
            console.warn('[FORCE ACTIVATION] Failed to track user activity:', error)
          }
        }
        
        trackUserActivity()
      } else {
        console.log('[FORCE ACTIVATION] ❌ Conditions not met:', {
          user: !!user,
          loading,
          workspaceId: workspaceValidation.currentWorkspaceId
        })
      }
    }
    
    // Run immediately
    forceUserActivity()
    
    // Run after a short delay to ensure all dependencies are ready
    const timeoutId1 = setTimeout(forceUserActivity, 1000)
    
    // Run after a longer delay as backup
    const timeoutId2 = setTimeout(forceUserActivity, 3000)
    
    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
    }
  }, [user, loading, workspaceValidation.currentWorkspaceId]) // Add dependencies to run when they change

  // P7: Route announcements for accessibility
  useAccessibilityRouteAnnouncements(location)

  // Initialize theme system - only once
  useEffect(() => {
    if (!themeInitialized.current) {
      initializeTheme()
      themeInitialized.current = true
    }
  }, [])

  // P6: Initialize Frontend SEO, Accessibility & UX System  
  // P7: Initialize Accessibility System
  // P11: Initialize Mobile & Cross-Platform Excellence
  // Optimized: Defer non-critical initializations to prevent blank page
  useEffect(() => {
    // Critical: Run immediately for accessibility - only once
    if (!accessibilityInitialized.current) {
      initializeAccessibilityCompliance()
      accessibilityInitialized.current = true
    }
    
    // Defer non-critical initializations to prevent blocking render
    const deferInit = () => {
      if (!mobileInitialized.current) {
        initializeMobileExcellence()
        mobileInitialized.current = true
      }
      if (!seoInitialized.current) {
        initializeSEO()
        seoInitialized.current = true
      }
      if (!webVitalsInitialized.current) {
        initializeCoreWebVitals()
        webVitalsInitialized.current = true
      }
      if (!componentModernizationInitialized.current) {
        initializeComponentModernization()
        componentModernizationInitialized.current = true
      }
      if (!p6Initialized.current) {
        initializeP6System({
          seo: {
            defaultTitle: 'VeeFore - AI-Powered Social Media Management',
            defaultDescription: 'Transform your social media presence with VeeFore\'s AI-powered content creation, automated scheduling, and comprehensive analytics.',
            siteName: 'VeeFore',
            twitterHandle: '@VeeFore'
          },
          accessibility: {
            enableScreenReaderSupport: true,
            enableKeyboardNavigation: true,
            announceRouteChanges: true
          },
          ux: {
            enableLoadingStates: true,
            enableToastNotifications: true,
            autoSaveInterval: 30000
          },
          mobile: {
            enableTouchOptimization: true,
            enableGestureSupport: true,
            enablePullToRefresh: true
          },
          performance: {
            enableLazyLoading: true,
            enableImageOptimization: true,
            enableWebVitalsMonitoring: true
          }
        })
        p6Initialized.current = true
      }
    }
    
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(deferInit)
    } else {
      setTimeout(deferInit, 1)
    }
  }, [])

  // Google sign-in is now handled directly in SignIn.tsx with popup method
  // No need for redirect result handling

  // Fetch user data when authenticated - with retry for new users
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user'),
    enabled: !!user && !loading,
    retry: 3, // Retry up to 3 times for new users whose account might still be creating
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff: 1s, 2s, 4s
    staleTime: 30000, // Consider fresh for 30 seconds
  })
  
  // Remove brittle localStorage check to avoid incorrect public-landing redirects during auth init

  // Pre-fetch workspaces data for faster navigation
  const { data: workspaces } = useQuery({
    queryKey: ['/api/workspaces'],
    queryFn: () => apiRequest('/api/workspaces'),
    enabled: !!user && !loading && !!userData,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    retry: false
  })

  // Pre-fetch social accounts for current workspace to eliminate loading on Integration page
  const currentWorkspaceId = workspaces?.find((w: any) => w.isActive)?.id
  useQuery({
    queryKey: ['/api/social-accounts', currentWorkspaceId],
    queryFn: () => currentWorkspaceId ? apiRequest(`/api/social-accounts?workspaceId=${currentWorkspaceId}`) : Promise.resolve([]),
    enabled: !!user && !loading && !!currentWorkspaceId,
    staleTime: 10 * 60 * 1000, // 10 minutes cache for smooth navigation
    retry: false
  })
  
  // Authentication and onboarding guard logic - OPTIMIZED FOR BETTER UX
  useEffect(() => {
    // CRITICAL FIX: Don't wait for userData to load - only wait for auth state
    if (!loading) {
      // If user is authenticated and fully onboarded, allow full access
      if (user && userData && userData.isOnboarded) {
        if (location === '/signin' || location === '/signup' || location === '/onboarding') {
          setLocation('/')
        }
        // Close onboarding modal if open
        if (isOnboardingModalOpen) {
          setIsOnboardingModalOpen(false)
        }
      }
      
      // STRICT: If user is authenticated but NOT onboarded, FORCE onboarding modal
      else if (user && userData && !userData.isOnboarded) {
        // Always ensure modal is open for non-onboarded users
        if (!isOnboardingModalOpen) {
          setIsOnboardingModalOpen(true)
        }
        
        // FORCE redirect away from auth pages to dashboard where modal will show
        if (location === '/signin' || location === '/signup') {
          setLocation('/')
          return // Exit early to prevent rendering auth page
        }
      }
      
      // If user is authenticated but userData is still loading, redirect auth pages but don't open onboarding yet
      else if (user && !userData && !userDataLoading) {
        // User exists but no userData yet - redirect auth pages but keep dashboard accessible
        if (location === '/signin' || location === '/signup') {
          setLocation('/')
        }
        // Don't open onboarding modal yet - wait for userData
      }
      
      // If user is not authenticated, close modal and restrict access
      else if (!user) {
        if (isOnboardingModalOpen) {
          setIsOnboardingModalOpen(false)
        }
        if (location === '/onboarding') {
          setLocation('/')
        }
      }
    }
  }, [user, loading, userData, userDataLoading, location, setLocation, isOnboardingModalOpen])

  // Show loading spinner only during initial auth - not for user data loading (better UX)
  if (loading) {
    return <LoadingSpinner />
  }
  
  // Show loading spinner for protected routes when auth is still loading
  const protectedRoutes = ['/integration', '/plan', '/create', '/analytics', '/inbox', '/video-generator', '/workspaces', '/profile', '/automation', '/veegpt']
  if (!user && protectedRoutes.some(route => location.startsWith(route))) {
    return <LoadingSpinner />
  }

  const handleCreateOptionSelect = (_option: string) => {
    setIsCreateDropdownOpen(false)
  }

  return (
    <P6Provider>
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

      {/* 3D Landing Page - Public access */}
      <Route path="/3d">
        <Landing3D />
      </Route>

      {/* Advanced 3D Landing Page with Spline Robot - Public access */}
      <Route path="/3d-advanced">
        <Landing3DAdvanced />
      </Route>

      {/* Spline Keyboard Landing Page - Public access */}
      <Route path="/keyboard">
        <SplineKeyboardLanding />
      </Route>

      {/* Robot Hero Landing Page - Public access */}
      <Route path="/robot-hero">
        <RobotHeroLanding />
      </Route>

      {/* Global Landing Page - Public access */}
      <Route path="/global">
        <GlobalLandingPage />
      </Route>

      {/* Original Landing Page - Public access */}
      <Route path="/landing">
        <div className="min-h-screen">
          <Landing onNavigate={(page: string) => setLocation(`/${page}`)} />
        </div>
      </Route>

      {/* Root route - Landing for unauthenticated, Dashboard for authenticated users (userData loads in background) */}
      <Route path="/">
        {loading ? (
          <LoadingSpinner />
        ) : !user ? (
          <GlobalLandingPage />
        ) : (
          // CRITICAL FIX: Show dashboard immediately for authenticated users
          // userData can load in background without blocking the dashboard
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
            {/* Sidebar - Fixed height with independent scrolling */}
            <div className="h-screen overflow-y-auto bg-white dark:bg-gray-800 transition-colors duration-300">
              <Sidebar 
                className="w-24 bg-white dark:bg-gray-800 h-full transition-colors duration-300"
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
              <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <>
                  {/* Instagram Webhook Listener for Real-time Updates */}
                  <InstagramWebhookListener />
                  
                  {/* Quick Actions - Top Section */}
                  <div className="mb-8">
                    <QuickActions />
                  </div>
                  
                  {/* Main Dashboard Layout - Hootsuite Style */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                    {/* Show gentle loading indicator if userData is still loading */}
                    {userDataLoading && (
                      <div className="col-span-full mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-blue-700 dark:text-blue-300 text-sm">Loading your dashboard data...</span>
                        </div>
                      </div>
                    )}
                    
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
        )}
      </Route>

      {/* Protected routes with sidebar layout - STRICT: only accessible when authenticated AND onboarded */}
      {user && userData && userData.isOnboarded && (
        <>
                     <Route path="/plan">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   <div className="space-y-6">
                     <Tabs defaultValue="calendar" className="w-full">
                       <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Content Library</h3>
                           <p className="text-gray-600 dark:text-gray-400">Manage your content library and templates here.</p>
                         </div>
                       </TabsContent>
                       <TabsContent value="dm-automation" className="mt-6">
                         <div className="text-center py-12">
                           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">DM Automation</h3>
                           <p className="text-gray-600 dark:text-gray-400">Set up automated direct message responses.</p>
                         </div>
                       </TabsContent>
                    </Tabs>
                  </div>
                </main>
              </div>
            </div>
          </Route>
          
                     <Route path="/create">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   {/* Instagram Webhook Listener for Real-time Updates */}
                   <InstagramWebhookListener />
                   <CreatePost />
                 </main>
               </div>
             </div>
           </Route>
          
                     <Route path="/analytics">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   {/* Instagram Webhook Listener for Real-time Updates */}
                   <InstagramWebhookListener />
                   <AnalyticsDashboard />
                 </main>
               </div>
             </div>
           </Route>
          
                     <Route path="/inbox">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   <div className="text-center py-12">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Inbox 2.0</h3>
                     <p className="text-gray-600 dark:text-gray-400">Manage your social media conversations here.</p>
                   </div>
                 </main>
               </div>
             </div>
           </Route>
          

          
                     <Route path="/video-generator">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   <Workspaces />
                 </main>
               </div>
             </div>
           </Route>



                     <Route path="/profile">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   <Profile />
                 </main>
               </div>
             </div>
           </Route>

                     <Route path="/integration">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   {/* Instagram Webhook Listener for Real-time Updates */}
                   <InstagramWebhookListener />
                   <Integration />
                 </main>
               </div>
             </div>
           </Route>

          {/* Instagram Diagnostics - protected */}
          <Route path="/ig-diagnostics">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
              <div className="h-screen overflow-y-auto">
                <Sidebar 
                  className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <InstagramDiagnostics />
                </main>
              </div>
            </div>
          </Route>

                     <Route path="/automation">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   <AutomationStepByStep />
                 </main>
               </div>
             </div>
           </Route>

                     {/* VeeGPT Route - with main sidebar */}
           <Route path="/veegpt">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
                   isCreateDropdownOpen={isCreateDropdownOpen}
                   setIsCreateDropdownOpen={setIsCreateDropdownOpen}
                 />
               </div>

               {/* Main Content Area - VeeGPT takes full remaining space */}
               <div className="flex-1 h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                 <VeeGPT />
               </div>
             </div>
           </Route>

                     <Route path="/integrations">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                 <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                   {/* Instagram Webhook Listener for Real-time Updates */}
                   <InstagramWebhookListener />
                   <Integration />
                 </main>
               </div>
             </div>
           </Route>

                     <Route path="/settings">
             <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden relative transition-colors duration-300">
               {/* Sidebar - Fixed height with independent scrolling */}
               <div className="h-screen overflow-y-auto">
                 <Sidebar 
                   className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full shadow-sm transition-colors duration-300"
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
                     onOptionSelect={(option) => {
                       setIsCreateDropdownOpen(false)
                       // Handle navigation based on option
                       if (option === 'post') setLocation('/create')
                       if (option === 'automation') setLocation('/automation')
                       if (option === 'video') setLocation('/video-generator')
                     }}
                   />
                 )}
                 
                 {/* Page Content */}
                 <div className="flex-1 overflow-y-auto">
                   <Settings />
                 </div>
               </div>
             </div>
           </Route>

           {/* P8: Security Operations Center Route */}
           <Route path="/security">
             <SecurityDashboard />
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
    
    {/* P6: Toast notifications container */}
    <ToastContainer position="top-right" />
    </>
    </P6Provider>
  )
}

export default App

