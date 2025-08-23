import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Star, 
  Target, 
  Users, 
  TrendingUp, 
  Crown,
  Zap,
  Palette,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Heart
} from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface OnboardingData {
  step: number
  planSelected: string
  socialAccountsConnected: string[]
  userProfile: {
    goals: string[]
    niche: string
    targetAudience: string
    contentStyle: string
    postingFrequency: string
    businessType: string
    experienceLevel: string
    primaryObjective: string
    additionalInfo: string
  }
}

const TOTAL_STEPS = 4

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  console.log('🔵 OnboardingModal function called - isOpen:', isOpen)
  
  if (isOpen) {
    console.log('🟢 Modal should be visible - rendering overlay!')
  }

  if (!isOpen) {
    console.log('🔴 Modal is closed - returning null')
    return null
  }
  
  console.log('✅ Rendering modal JSX now!')
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 99999 }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">🎉 Onboarding Modal Test</h2>
        <p className="text-gray-600 mb-4">Success! The strict signup flow is working.</p>
        <button 
          onClick={onClose}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 w-full"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  )
}