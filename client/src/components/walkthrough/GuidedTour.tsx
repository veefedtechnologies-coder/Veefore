import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Target, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TourStep {
  id: string
  target: string // CSS selector for the element to highlight
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
  action?: () => void
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-testid="dashboard-header"]',
    title: 'Welcome to VeeFore!',
    description: 'Your AI-powered social media command center. Let me show you the core features that make VeeFore the most advanced social media platform.',
    position: 'bottom'
  },
  {
    id: 'veegpt-nav',
    target: '.veegpt-nav-item',
    title: '🤖 VeeGPT - Your AI Assistant',
    description: 'Meet your personal AI assistant! VeeGPT helps with content creation, strategy planning, analytics insights, and answers any questions about your social media.',
    position: 'right'
  },
  {
    id: 'video-generator-nav',
    target: '[data-nav="video-generator"]',
    title: '🎬 AI Video Generator',
    description: 'Create professional videos with AI! Generate scripts, voiceovers, visuals, and complete videos from just a text prompt. Our most powerful feature.',
    position: 'right'
  },
  {
    id: 'automation-nav',
    target: '[data-nav="automation"]',
    title: '⚡ Smart Automation',
    description: 'Automate your social media interactions! Set up AI-powered DM responses, comment replies, keyword triggers, and engagement automation.',
    position: 'right'
  },
  {
    id: 'create-button',
    target: '[data-testid="create-dropdown-trigger"]',
    title: '✨ AI Content Creation',
    description: 'Create content with AI enhancement! Generate captions, hashtags, images, and optimize content for each platform with our AI tools.',
    position: 'right'
  },
  {
    id: 'analytics-nav',
    target: '[data-nav="analytics"]',
    title: '📊 Advanced Analytics',
    description: 'Deep insights powered by AI! Track performance across all platforms, get predictive analytics, and receive smart recommendations.',
    position: 'right'
  },
  {
    id: 'workspaces-nav',
    target: '[data-nav="workspaces"]',
    title: '👥 AI-Powered Workspaces',
    description: 'Collaborate with custom AI personalities! Each workspace can have its own AI assistant with unique personality and expertise.',
    position: 'right'
  },
  {
    id: 'integration-nav',
    target: '[data-nav="integration"]',
    title: '🔗 Platform Integration',
    description: 'Connect all your social platforms! Manage Instagram, YouTube, Twitter, LinkedIn, and more from one unified dashboard.',
    position: 'right'
  }
]

interface GuidedTourProps {
  isActive: boolean
  onComplete: () => void
  onClose: () => void
}

export function GuidedTour({ isActive, onComplete, onClose }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const currentStepData = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1

  useEffect(() => {
    if (!isActive) return

    const findAndHighlightElement = () => {
      const element = document.querySelector(currentStepData.target) as HTMLElement
      
      if (element) {
        setTargetElement(element)
        
        // Scroll element into view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })

        // Calculate tooltip position
        const rect = element.getBoundingClientRect()
        const tooltipRect = tooltipRef.current?.getBoundingClientRect()
        
        let top = 0
        let left = 0

        switch (currentStepData.position) {
          case 'top':
            top = rect.top - (tooltipRect?.height || 0) - 20
            left = rect.left + (rect.width / 2) - ((tooltipRect?.width || 0) / 2)
            break
          case 'bottom':
            top = rect.bottom + 20
            left = rect.left + (rect.width / 2) - ((tooltipRect?.width || 0) / 2)
            break
          case 'left':
            top = rect.top + (rect.height / 2) - ((tooltipRect?.height || 0) / 2)
            left = rect.left - (tooltipRect?.width || 0) - 20
            break
          case 'right':
            top = rect.top + (rect.height / 2) - ((tooltipRect?.height || 0) / 2)  
            left = rect.right + 20
            break
        }

        // Ensure tooltip stays within viewport
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        if (left < 10) left = 10
        if (left + (tooltipRect?.width || 0) > viewportWidth - 10) {
          left = viewportWidth - (tooltipRect?.width || 0) - 10
        }
        if (top < 10) top = 10
        if (top + (tooltipRect?.height || 0) > viewportHeight - 10) {
          top = viewportHeight - (tooltipRect?.height || 0) - 10
        }

        setTooltipPosition({ top, left })
      }
    }

    // Small delay to ensure DOM is updated
    const timer = setTimeout(findAndHighlightElement, 200)
    return () => clearTimeout(timer)
  }, [currentStep, isActive, currentStepData])

  const nextStep = () => {
    if (currentStepData.action) {
      currentStepData.action()
    }
    
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const skipTour = () => {
    onClose()
  }

  if (!isActive) return null

  return (
    <>
      {/* Overlay with spotlight effect */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none"
        style={{
          background: targetElement 
            ? `radial-gradient(circle at ${targetElement.getBoundingClientRect().left + targetElement.getBoundingClientRect().width/2}px ${targetElement.getBoundingClientRect().top + targetElement.getBoundingClientRect().height/2}px, transparent 0px, transparent ${Math.max(targetElement.getBoundingClientRect().width, targetElement.getBoundingClientRect().height) + 60}px, rgba(0,0,0,0.4) ${Math.max(targetElement.getBoundingClientRect().width, targetElement.getBoundingClientRect().height) + 80}px)`
            : 'rgba(0,0,0,0.3)'
        }}
      />

      {/* Highlight border around target element */}
      {targetElement && (
        <div
          className="fixed z-50 pointer-events-none border-3 border-blue-400 rounded-lg shadow-lg"
          style={{
            top: targetElement.getBoundingClientRect().top - 6,
            left: targetElement.getBoundingClientRect().left - 6,
            width: targetElement.getBoundingClientRect().width + 12,
            height: targetElement.getBoundingClientRect().height + 12,
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.4)',
            animation: 'pulse 2s infinite'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm border border-gray-200 pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: tooltipPosition.top < 100 ? 'translateY(0)' : 'translateY(0)'
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
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-blue-500 w-4' 
                    : index < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextStep}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
          >
            <span>{isLastStep ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Arrow pointing to target */}
        <div 
          className={`absolute w-4 h-4 bg-white border border-gray-200 transform rotate-45 ${
            currentStepData.position === 'top' ? '-bottom-2 left-1/2 -translate-x-1/2' :
            currentStepData.position === 'bottom' ? '-top-2 left-1/2 -translate-x-1/2' :
            currentStepData.position === 'left' ? '-right-2 top-1/2 -translate-y-1/2' :
            '-left-2 top-1/2 -translate-y-1/2'
          }`}
        />
      </div>
    </>
  )
}

export default GuidedTour