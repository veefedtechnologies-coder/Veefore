import React, { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Film, 
  Wand2, 
  Sparkles, 
  Video, 
  Mic, 
  Image, 
  Download, 
  Share2, 
  Settings, 
  Clock, 
  User, 
  Volume2, 
  Eye, 
  Edit3, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload,
  Bot,
  Zap,
  Star,
  Layers,
  Palette,
  Music,
  FileText,
  RefreshCw,
  Save,
  Trash2,
  RotateCcw,
  Globe,
  AlertCircle,
  Info,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Target,
  Flame,
  Award,
  Bookmark,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Scissors,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Grid,
  List,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Calendar,
  Camera,
  Headphones,
  Sliders,
  PaintBucket,
  Type,
  Layers3,
  Lightbulb,
  Cpu,
  Gauge,
  Database,
  Cloud,
  Shield,
  Crown,
  Timer,
  Monitor,
  AspectRatio,
  ArrowLeft,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'

interface VideoJob {
  id: string
  status: 'draft' | 'generating' | 'completed' | 'failed'
  progress: number
  prompt: string
  duration: number
  voiceSettings: {
    gender: string
    language: string
    accent: string
    tone: string
  }
  motionEngine: string
  aspectRatio: string
  resolution: string
  fps: number
  videoUrl?: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
}

interface VideoGeneratorSettings {
  duration: number
  aspectRatio: string
  resolution: string
  fps: number
  motionEngine: string
  voiceGender: string
  voiceLanguage: string
  voiceAccent: string
  voiceTone: string
  voiceStability: number
  voiceSimilarity: number
  voiceStyle: number
  avatarEnabled: boolean
  avatarStyle: string
  avatarPosition: string
  backgroundMusic: boolean
  musicGenre: string
  musicVolume: number
  enableCaptions: boolean
  captionStyle: string
  colorGrading: string
  transitions: string
  speedControl: number
  zoomEffects: boolean
  creditEstimate: number
}

const VideoGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentJob, setCurrentJob] = useState<VideoJob | null>(null)
  const [settings, setSettings] = useState<VideoGeneratorSettings>({
    duration: 60,
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    motionEngine: 'Auto',
    voiceGender: 'female',
    voiceLanguage: 'English',
    voiceAccent: 'American',
    voiceTone: 'professional',
    voiceStability: 0.4,
    voiceSimilarity: 0.75,
    voiceStyle: 0.0,
    avatarEnabled: false,
    avatarStyle: 'realistic',
    avatarPosition: 'corner',
    backgroundMusic: false,
    musicGenre: 'corporate',
    musicVolume: 0.3,
    enableCaptions: true,
    captionStyle: 'modern',
    colorGrading: 'cinematic',
    transitions: 'smooth',
    speedControl: 1.0,
    zoomEffects: false,
    creditEstimate: 0
  })

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Calculate credit estimate based on settings
  useEffect(() => {
    const calculateCredits = () => {
      let credits = 0
      
      // Base cost for video generation
      const baseCost = settings.duration <= 30 ? 5 : settings.duration <= 60 ? 10 : 15
      credits += baseCost
      
      // Motion engine costs
      if (settings.motionEngine === 'Runway Gen-2') {
        credits += 15
      } else if (settings.motionEngine === 'AnimateDiff + Interpolation') {
        credits += 5
      }
      
      // Resolution costs
      if (settings.resolution === '4K') {
        credits += 20
      } else if (settings.resolution === '1080p') {
        credits += 10
      } else {
        credits += 5
      }
      
      // Avatar costs
      if (settings.avatarEnabled) {
        credits += 10
      }
      
      // Voice generation costs
      credits += 5
      
      return credits
    }
    
    setSettings(prev => ({
      ...prev,
      creditEstimate: calculateCredits()
    }))
  }, [settings.duration, settings.motionEngine, settings.resolution, settings.avatarEnabled])

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video prompt",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setCurrentStep(2)
    
    try {
      const response = await apiRequest('/api/video/generate', {
        method: 'POST',
        body: {
          prompt: prompt.trim(),
          settings
        }
      })
      
      setCurrentJob(response)
      
      // Start progress tracking
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + Math.random() * 10
        })
      }, 1000)
      
      // Simulate completion after 30 seconds
      setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setIsGenerating(false)
        setCurrentStep(3)
        toast({
          title: "Success",
          description: "Video generated successfully!",
          variant: "default"
        })
      }, 30000)
      
    } catch (error) {
      console.error('Video generation error:', error)
      setIsGenerating(false)
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive"
      })
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Generation
          </CardTitle>
          <CardDescription>
            Describe the video you want to create
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">Video Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Create a video about..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration</Label>
                <Select value={settings.duration.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, duration: parseInt(value) }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">⚡ 15 seconds - Quick & Punchy</SelectItem>
                    <SelectItem value="30">🎯 30 seconds - Social Media Perfect</SelectItem>
                    <SelectItem value="60">🎬 60 seconds - Standard</SelectItem>
                    <SelectItem value="90">📹 90 seconds - Extended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Resolution</Label>
                <Select value={settings.resolution} onValueChange={(value) => setSettings(prev => ({ ...prev, resolution: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">🎥 720p HD - Fast & Efficient</SelectItem>
                    <SelectItem value="1080p">✨ 1080p Full HD - Premium Quality</SelectItem>
                    <SelectItem value="4K">💎 4K Ultra HD - Professional Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Aspect Ratio</Label>
              <Select value={settings.aspectRatio} onValueChange={(value) => setSettings(prev => ({ ...prev, aspectRatio: value }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">📺 16:9 Landscape - YouTube & Desktop</SelectItem>
                  <SelectItem value="9:16">📱 9:16 Portrait - TikTok & Stories</SelectItem>
                  <SelectItem value="1:1">⬜ 1:1 Square - Instagram Feed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Motion Engine</Label>
              <Select value={settings.motionEngine} onValueChange={(value) => setSettings(prev => ({ ...prev, motionEngine: value }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Auto">🤖 Auto (AI Decides) - Recommended</SelectItem>
                  <SelectItem value="Runway Gen-2">🎬 Runway Gen-2 - Cinematic Quality</SelectItem>
                  <SelectItem value="AnimateDiff + Interpolation">⚡ AnimateDiff + Interpolation - Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estimated Credits</span>
                <Badge variant="outline" className="text-lg">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {settings.creditEstimate}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleGenerateVideo}
          disabled={!prompt.trim() || isGenerating}
          className="px-8"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Video
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Generating Video
          </CardTitle>
          <CardDescription>
            Please wait while we create your video...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {Math.round(progress)}%
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {progress < 25 && "Analyzing your prompt..."}
              {progress >= 25 && progress < 50 && "Generating scenes..."}
              {progress >= 50 && progress < 75 && "Creating visuals..."}
              {progress >= 75 && progress < 90 && "Adding audio..."}
              {progress >= 90 && "Finalizing video..."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Video Ready
          </CardTitle>
          <CardDescription>
            Your video has been generated successfully!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Video Preview</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Video Generator</h1>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`text-sm ${step <= currentStep ? 'text-primary' : 'text-gray-500'}`}>
                  {step === 1 && 'Configure'}
                  {step === 2 && 'Generate'}
                  {step === 3 && 'Download'}
                </span>
                {step < 3 && <ChevronRight className="h-4 w-4 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  )
}

export default VideoGenerator