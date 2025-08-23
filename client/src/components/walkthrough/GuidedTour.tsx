import { useState, useEffect, useRef } from 'react'
import { X, Target, ArrowRight, ArrowLeft } from 'lucide-react'

interface TourStep {
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

interface GuidedTourProps {
  isActive: boolean
  onClose: () => void
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to VeeFore!",
    description: "Let's take a quick tour of your AI-powered social media management platform and discover how AI can transform your content strategy.",
    target: "h1",
    position: "bottom"
  },
  {
    title: "🤖 VeeGPT - Your AI Assistant", 
    description: "Meet VeeGPT, your intelligent AI assistant that helps you create content, generate ideas, and manage your social media strategy with advanced AI capabilities.",
    target: "[data-nav='veegpt']",
    position: "right"
  },
  {
    title: "🎬 AI Video Generator",
    description: "Create professional videos with AI! Generate scripts, voiceovers, visuals, and complete videos from just a text prompt. Our most powerful feature.",
    target: "[data-nav='video-generator']", 
    position: "right"
  },
  {
    title: "⚡ Automation Hub",
    description: "Automate your social media interactions! Set up AI-powered DM responses, comment replies, and engagement automation to save time and boost efficiency.",
    target: "[data-nav='automation']",
    position: "right"
  },
  {
    title: "📊 AI Analytics Dashboard", 
    description: "Get AI-powered insights about your content performance, audience engagement, and growth opportunities across all your social platforms.",
    target: "[data-nav='analytics']",
    position: "right"
  },
  {
    title: "👥 Team Workspaces",
    description: "Collaborate with your team using AI-powered workspaces. Each workspace can have its own AI personality and content strategy.",
    target: "[data-nav='workspaces']", 
    position: "right"
  },
  {
    title: "🔗 Social Platform Integration",
    description: "Connect all your social media accounts and manage them from one AI-powered dashboard with seamless integrations.",
    target: "[data-nav='integration']",
    position: "right"
  },
  {
    title: "✨ AI Content Creation",
    description: "Use our AI content creation tools to generate posts, stories, captions, and more with just a few clicks.",
    target: "[data-nav='create']",
    position: "right"
  }
]

export function GuidedTour({ isActive, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const currentStepData = tourSteps[currentStep]

  // Find and highlight the target element for current step
  useEffect(() => {
    if (!isActive) return

    const findElement = () => {
      setTimeout(() => {
        let element: HTMLElement | null = null

        // Use data-nav attributes for precise targeting
        switch (currentStep) {
          case 0: // Welcome - target main heading
            element = document.querySelector('h1') || document.querySelector('.text-3xl') || document.querySelector('.text-2xl')
            break
          case 1: // VeeGPT
            element = document.querySelector('[data-nav="veegpt"]')
            break
          case 2: // Video Generator
            element = document.querySelector('[data-nav="video-generator"]')
            break
          case 3: // Automation
            element = document.querySelector('[data-nav="automation"]')
            break
          case 4: // Analytics
            element = document.querySelector('[data-nav="analytics"]')
            break
          case 5: // Workspaces
            element = document.querySelector('[data-nav="workspaces"]')
            break
          case 6: // Integration
            element = document.querySelector('[data-nav="integration"]')
            break
          case 7: // Create
            element = document.querySelector('[data-nav="create"]')
            break
        }

        console.log(`🎯 Step ${currentStep + 1}: Looking for "${currentStepData.title}"`)
        console.log('📍 Found element:', element?.tagName, element?.textContent?.trim())
        
        if (!element) {
          console.log('❌ Element not found! Available elements:')
          document.querySelectorAll('[data-nav]').forEach(el => {
            console.log(`- [data-nav="${el.getAttribute('data-nav')}"]`)
          })
        }

        if (element) {
          setTargetElement(element)
          positionTooltip(element)
        }
      }, 150)
    }

    findElement()
  }, [currentStep, isActive])

  // Position tooltip relative to target element
  const positionTooltip = (element: HTMLElement) => {
    if (!tooltipRef.current) return

    setTimeout(() => {
      const rect = element.getBoundingClientRect()
      const tooltip = tooltipRef.current?.getBoundingClientRect()
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      
      let top = 0
      let left = 0
      const padding = viewport.width < 768 ? 16 : 20

      // Position based on step preference
      switch (currentStepData.position) {
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltip?.height || 0) / 2
          left = rect.right + 20
          break
        case 'bottom':
          top = rect.bottom + 20
          left = rect.left + (rect.width / 2) - (tooltip?.width || 0) / 2
          break
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltip?.height || 0) / 2
          left = rect.left - (tooltip?.width || 0) - 20
          break
        case 'top':
          top = rect.top - (tooltip?.height || 0) - 20
          left = rect.left + (rect.width / 2) - (tooltip?.width || 0) / 2
          break
      }

      // Keep tooltip in viewport
      if (left < padding) left = padding
      if (left + (tooltip?.width || 0) > viewport.width - padding) {
        left = viewport.width - (tooltip?.width || 0) - padding
      }
      if (top < padding) top = padding
      if (top + (tooltip?.height || 0) > viewport.height - padding) {
        top = viewport.height - (tooltip?.height || 0) - padding
      }

      setTooltipPosition({ top, left })
    }, 50)
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    onClose()
  }

  // Block body scroll and interactions
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isActive])

  // Handle window resize
  useEffect(() => {
    if (!isActive || !targetElement) return

    const handleResize = () => {
      positionTooltip(targetElement)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [isActive, targetElement])

  if (!isActive) return null

  return (
    <>
      {/* Background overlay with spotlight effect */}
      <div 
        className="fixed inset-0 z-50"
        style={{
          background: targetElement ? (() => {
            const rect = targetElement.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const spotlightRadius = Math.max(rect.width, rect.height) + (window.innerWidth < 768 ? 40 : 60)
            const fadeRadius = spotlightRadius + 20
            
            return `radial-gradient(circle at ${centerX}px ${centerY}px, transparent 0px, transparent ${spotlightRadius}px, rgba(0,0,0,0.4) ${fadeRadius}px)`
          })() : 'rgba(0,0,0,0.3)',
          overscrollBehavior: 'contain'
        }}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        onScroll={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
      />

      {/* Highlight border around target element */}
      {targetElement && (() => {
        const rect = targetElement.getBoundingClientRect()
        const padding = window.innerWidth < 768 ? 4 : 6
        const shadowSize = window.innerWidth < 768 ? 20 : 30
        
        return (
          <div
            className="fixed z-50 pointer-events-none border-2 md:border-3 border-blue-400 rounded-lg shadow-lg"
            style={{
              top: rect.top - padding,
              left: rect.left - padding,
              width: rect.width + (padding * 2),
              height: rect.height + (padding * 2),
              boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.2), 0 0 ${shadowSize}px rgba(59, 130, 246, 0.4)`,
              animation: 'pulse 2s infinite'
            }}
          />
        )
      })()}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-xs md:max-w-sm border border-gray-200 pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          maxWidth: window.innerWidth < 768 ? '280px' : '384px',
        }}
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <button 
            onClick={skipTour}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}